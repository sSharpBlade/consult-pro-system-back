import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  SetMetadata,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @ApiOperation({
    summary: 'Crear un nuevo usuario',
    description:
      'Crea un usuario con los datos proporcionados. Solo administradores.',
  })
  @ApiBody({
    schema: {
      example: {
        dni: '72845163',
        name: 'Nombre Completo',
        email: 'usuario@example.com',
        password: 'contraseña123',
        role: 'patient',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente.' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() req,
  ): Promise<User> {
    return this.usersService.create(createUserDto, req.user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'doctor'])
  @ApiOperation({
    summary: 'Listar todos los usuarios',
    description:
      'Devuelve todos los usuarios del sistema. Solo administradores y doctores.',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuarios.' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'patient', 'doctor'])
  @ApiOperation({
    summary: 'Obtener un usuario',
    description: 'Devuelve los datos de un usuario específico.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'patient', 'doctor'])
  @ApiOperation({
    summary: 'Actualizar un usuario',
    description:
      'Actualiza los datos de un usuario. Solo administradores, pacientes y doctores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del usuario' })
  @ApiBody({
    schema: {
      example: {
        name: 'Nuevo Nombre',
        email: 'nuevo_email@example.com',
        role: 'doctor',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Usuario actualizado.' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ): Promise<User> {
    return this.usersService.update(+id, updateUserDto, req.user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @ApiOperation({
    summary: 'Eliminar un usuario',
    description: 'Elimina un usuario (soft delete). Solo administradores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del usuario' })
  @ApiResponse({ status: 204, description: 'Usuario eliminado.' })
  async remove(@Param('id') id: string, @Req() req): Promise<void> {
    await this.usersService.remove(+id, req.user);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @ApiOperation({
    summary: 'Restaurar un usuario',
    description: 'Restaura un usuario eliminado. Solo administradores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del usuario' })
  @ApiResponse({ status: 204, description: 'Usuario restaurado.' })
  async restore(@Param('id') id: string): Promise<void> {
    await this.usersService.restore(+id);
  }
}
