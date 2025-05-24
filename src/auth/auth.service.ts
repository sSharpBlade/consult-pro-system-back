/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, Not } from 'typeorm';
import { User } from '../user/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from './mail.service';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly rolesService: RolesService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: registerDto.email }, { dni: registerDto.dni }],
    });

    if (existingUser) {
      throw new ConflictException('El email o DNI ya están registrados');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    // Buscar el rol 'patient' en la base de datos
    const roleEntity = await this.rolesService.findOneByName('patient');
    if (!roleEntity) throw new NotFoundException('Rol patient no encontrado');
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      userRole: roleEntity,
    });

    const savedUser = await this.userRepository.save(user);
    const accessToken = this.generateToken(savedUser);

    const { password, ...userWithoutPassword } = savedUser;
    return { user: userWithoutPassword, accessToken };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email, deletedAt: IsNull() },
      relations: ['userRole'],
      select: [
        'id',
        'email',
        'password',
        'dni',
        'name',
        'createdAt',
        'tempPassword',
        'tempPasswordExpires',
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (
      user.tempPassword &&
      user.tempPasswordExpires &&
      new Date() < user.tempPasswordExpires
    ) {
      const isValidTempPassword = await bcrypt.compare(
        loginDto.password,
        user.tempPassword,
      );
      if (isValidTempPassword) {
        const accessToken = this.generateToken(user);
        const {
          password,
          tempPassword,
          tempPasswordExpires,
          ...userWithoutPassword
        } = user;
        return {
          accessToken,
          user: userWithoutPassword,
          isTempPassword: true,
        };
      }
    }

    // Si no es contraseña temporal, verifica la contraseña normal
    if (!(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const accessToken = this.generateToken(user);
    const {
      password,
      tempPassword,
      tempPasswordExpires,
      ...userWithoutPassword
    } = user;
    return {
      accessToken,
      user: userWithoutPassword,
      isTempPassword: false,
    };
  }

  async validateUser(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId, deletedAt: IsNull() },
    });
  }

  private generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.userRole?.name,
      dni: user.dni,
      name: user.name,
    };
    return this.jwtService.sign(payload);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordDto.email, deletedAt: IsNull() },
    });

    if (!user) {
      return {
        message: 'Si el correo existe, se ha enviado un enlace de recuperación',
      };
    }

    // Generar token temporal y fecha de expiración (2 horas)
    const tempPassword = crypto.randomBytes(8).toString('hex');
    const tempPasswordExpires = new Date();
    tempPasswordExpires.setHours(tempPasswordExpires.getHours() + 2);

    await this.userRepository.update(user.id, {
      tempPassword: await bcrypt.hash(tempPassword, 10),
      tempPasswordExpires,
    });

    try {
      await this.mailService.sendPasswordResetEmail(user.email, tempPassword);

      return {
        message: 'Si el correo existe, se ha enviado un enlace de recuperación',
      };
    } catch (error) {
      console.error('Error enviando email:', error);
      throw new Error('Ocurrió un error al enviar el email de recuperación');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userRepository.findOne({
      where: {
        tempPassword: Not(IsNull()),
        tempPasswordExpires: Not(IsNull()),
        deletedAt: IsNull(),
      },
    });

    if (!user) {
      throw new NotFoundException('Token inválido o expirado');
    }

    if (user.tempPasswordExpires && new Date() > user.tempPasswordExpires) {
      throw new BadRequestException('El token ha expirado');
    }

    if (
      user.tempPassword &&
      !(await bcrypt.compare(resetPasswordDto.tempPassword, user.tempPassword))
    ) {
      throw new UnauthorizedException('Token inválido');
    }

    user.password = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    user.tempPassword = null;
    user.tempPasswordExpires = null;
    await this.userRepository.save(user);

    return { message: 'Contraseña actualizada correctamente' };
  }
}
