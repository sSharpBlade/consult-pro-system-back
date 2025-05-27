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
import { DoctorsService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './entity/doctor.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('doctors')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @ApiOperation({
    summary: 'Crear un doctor',
    description: 'Crea un nuevo doctor. Solo administradores.',
  })
  @ApiBody({
    schema: {
      example: {
        name: 'Dr. Juan Pérez',
        specialty: 'Cardiología',
        phone: '987654321',
        email: 'doctor@ejemplo.com',
        userId: 5,
        clinicId: 1,
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Doctor creado correctamente.' })
  async create(
    @Body() createDoctorDto: CreateDoctorDto,
    @Req() req,
  ): Promise<Doctor> {
    return this.doctorsService.create(createDoctorDto, req.user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'patient', 'secretary'])
  @ApiOperation({
    summary: 'Listar doctores',
    description:
      'Devuelve todos los doctores del sistema. Solo administradores, pacientes y secretarias.',
  })
  @ApiResponse({ status: 200, description: 'Lista de doctores.' })
  async findAll(): Promise<Doctor[]> {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'patient', 'secretary'])
  @ApiOperation({
    summary: 'Obtener un doctor',
    description: 'Devuelve los datos de un doctor específico.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del doctor' })
  @ApiResponse({ status: 200, description: 'Doctor encontrado.' })
  async findOne(@Param('id') id: string): Promise<Doctor> {
    return this.doctorsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'doctor'])
  @ApiOperation({
    summary: 'Actualizar un doctor',
    description:
      'Actualiza los datos de un doctor. Solo administradores y doctores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del doctor' })
  @ApiBody({
    schema: {
      example: {
        name: 'Dr. Juan Pérez Actualizado',
        specialty: 'Neurología',
        phone: '912345678',
        email: 'nuevo_doctor@ejemplo.com',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Doctor actualizado.' })
  async update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
    @Req() req,
  ): Promise<Doctor> {
    return this.doctorsService.update(+id, updateDoctorDto, req.user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un doctor',
    description: 'Elimina un doctor (soft delete). Solo administradores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del doctor' })
  @ApiResponse({ status: 204, description: 'Doctor eliminado.' })
  async remove(@Param('id') id: string, @Req() req): Promise<void> {
    await this.doctorsService.remove(+id, req.user);
  }

  @Post(':id/restore')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Restaurar un doctor',
    description: 'Restaura un doctor eliminado. Solo administradores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del doctor' })
  @ApiResponse({ status: 204, description: 'Doctor restaurado.' })
  async restore(@Param('id') id: string): Promise<void> {
    await this.doctorsService.restore(+id);
  }

  @Get('by-user/:userId')
  @ApiOperation({
    summary: 'Obtener doctor por ID de usuario',
    description: 'Devuelve el doctor asociado a un usuario específico.',
  })
  @ApiParam({ name: 'userId', example: 5, description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Doctor encontrado por usuario.' })
  async getDoctorByUserId(@Param('userId') userId: number): Promise<Doctor> {
    return this.doctorsService.findDoctorByUserId(userId);
  }
}
