import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { RolesService } from '../roles/roles.service';

function getUserId(user: any): string | undefined {
  if (user && typeof user === 'object' && user?.id) {
    return String(user.id);
  }
  return undefined;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private rolesService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto, currentUser?: any): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const roleEntity = await this.rolesService.findOneByName(
      createUserDto.role,
    );
    if (!roleEntity) throw new NotFoundException('Rol no encontrado');
    const createdBy = getUserId(currentUser) || 'system';
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      userRole: roleEntity,
      createdBy,
    });
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ withDeleted: true });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUser?: any,
  ): Promise<User> {
    const user = await this.findOne(id);
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    let roleEntity = user.userRole;
    if (updateUserDto.role) {
      const foundRole = await this.rolesService.findOneByName(
        updateUserDto.role,
      );
      if (!foundRole) throw new NotFoundException('Rol no encontrado');
      roleEntity = foundRole;
    }
    const updatedUser = this.usersRepository.merge(user, {
      ...updateUserDto,
      userRole: roleEntity,
    });
    return this.usersRepository.save(updatedUser);
  }

  async remove(id: number, currentUser?: any): Promise<void> {
    const user = await this.findOne(id);
    const deletedBy = getUserId(currentUser) || 'system';
    if ('deletedBy' in user) {
      await this.usersRepository.update(id, {
        deletedBy,
      });
    }
    const result = await this.usersRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async restore(id: number): Promise<void> {
    const result = await this.usersRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async findPatientsByDoctor(doctorUserId: number): Promise<User[]> {
    // Pacientes creados por el doctor
    const createdPatients = await this.usersRepository.find({
      where: {
        createdBy: String(doctorUserId),
        userRole: { name: 'patient' },
        deletedAt: IsNull(),
      },
    });

    // Pacientes con cita con el doctor
    const patientsWithAppointments = await this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.appointments', 'appointment')
      .innerJoin('appointment.doctor', 'doctor')
      .innerJoin('doctor.user', 'doctorUser')
      .innerJoin('user.userRole', 'role')
      .where('doctorUser.id = :doctorUserId', { doctorUserId })
      .andWhere('user.deletedAt IS NULL')
      .andWhere('role.name = :role', { role: 'patient' })
      .getMany();

    // Unir y eliminar duplicados por id
    const allPatients = [...createdPatients, ...patientsWithAppointments];
    const uniquePatients = Array.from(
      new Map(allPatients.map((u) => [u.id, u])).values(),
    );
    return uniquePatients;
  }
}
