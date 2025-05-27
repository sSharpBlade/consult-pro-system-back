import {
  Controller,
  Post,
  Body,
  UseGuards,
  SetMetadata,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthenticatedRequest } from './types';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Autenticación')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
    description:
      'Registra un usuario con el rol "patient" por defecto. No requiere autenticación.',
  })
  @ApiBody({
    schema: {
      example: {
        dni: '72845163',
        name: 'Nombre Completo',
        email: 'usuario@example.com',
        password: 'contraseña123',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado correctamente.',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Inicia sesión con email y contraseña.',
  })
  @ApiBody({
    schema: {
      example: {
        email: 'usuario@example.com',
        password: 'contraseña123',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario autenticado correctamente.',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener perfil de usuario',
    description: 'Devuelve el perfil del usuario autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil de usuario obtenido correctamente.',
  })
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  @ApiOperation({
    summary: 'Solo para administradores',
    description: 'Endpoint de prueba solo accesible para administradores.',
  })
  @ApiResponse({
    status: 200,
    description: 'Acceso de administrador concedido.',
  })
  adminOnly() {
    return { message: 'Solo para administradores' };
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Solicitar restablecimiento de contraseña',
    description: 'Envía un correo para restablecer la contraseña.',
  })
  @ApiBody({
    schema: {
      example: {
        email: 'usuario@example.com',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Correo de restablecimiento enviado.',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Restablecer contraseña',
    description:
      'Permite restablecer la contraseña usando el token recibido por correo.',
  })
  @ApiBody({
    schema: {
      example: {
        token: 'token_de_recuperacion',
        newPassword: 'nuevaContraseña123',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña restablecida correctamente.',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
