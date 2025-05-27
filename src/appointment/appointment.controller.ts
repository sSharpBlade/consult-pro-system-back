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
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entity/appointment.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'patient', 'admin'])
  @ApiOperation({
    summary: 'Crear una cita',
    description:
      'Crea una nueva cita médica. Solo doctores, pacientes y administradores.',
  })
  @ApiBody({
    schema: {
      example: {
        appointmentDate: '2025-05-27',
        appointmentTime: '10:00',
        doctorId: 2,
        patientId: 5,
        clinicId: 1,
        reason: 'Consulta general',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Cita creada correctamente.' })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Req() req,
  ): Promise<Appointment> {
    return this.appointmentsService.create(createAppointmentDto, req.user);
  }

  @Post(':id/complete')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'admin'])
  @ApiOperation({
    summary: 'Completar una cita',
    description:
      'Marca una cita como completada. Solo doctores y administradores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la cita' })
  @ApiResponse({ status: 200, description: 'Cita completada.' })
  async completeAppointment(
    @Param('id') id: string,
    @Req() req,
  ): Promise<Appointment> {
    return this.appointmentsService.completeAppointment(+id, req.user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'patient', 'secretary', 'admin'])
  @ApiOperation({
    summary: 'Listar citas',
    description: 'Devuelve todas las citas del sistema. Acceso según rol.',
  })
  @ApiResponse({ status: 200, description: 'Lista de citas.' })
  async findAll(): Promise<Appointment[]> {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'patient', 'secretary'])
  @ApiOperation({
    summary: 'Obtener una cita',
    description: 'Devuelve los datos de una cita específica.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la cita' })
  @ApiResponse({ status: 200, description: 'Cita encontrada.' })
  async findOne(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'patient'])
  @ApiOperation({
    summary: 'Actualizar una cita',
    description: 'Actualiza los datos de una cita. Solo doctores y pacientes.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la cita' })
  @ApiBody({
    schema: {
      example: {
        appointmentDate: '2025-05-28',
        appointmentTime: '11:00',
        reason: 'Control de presión',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Cita actualizada.' })
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Req() req,
  ): Promise<Appointment> {
    return this.appointmentsService.update(+id, updateAppointmentDto, req.user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'patient'])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar una cita',
    description: 'Elimina una cita (soft delete). Solo doctores y pacientes.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la cita' })
  @ApiResponse({ status: 204, description: 'Cita eliminada.' })
  async remove(@Param('id') id: string, @Req() req): Promise<void> {
    await this.appointmentsService.remove(+id, req.user);
  }

  @Post(':id/restore')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Restaurar una cita',
    description:
      'Restaura una cita eliminada. Solo doctores y administradores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la cita' })
  @ApiResponse({ status: 204, description: 'Cita restaurada.' })
  async restore(@Param('id') id: string): Promise<void> {
    await this.appointmentsService.restore(+id);
  }

  @Get('filter/by')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'patient', 'secretary', 'admin'])
  @ApiOperation({
    summary: 'Filtrar citas',
    description: 'Filtra citas por doctor, paciente, clínica, fecha o estado.',
  })
  @ApiResponse({ status: 200, description: 'Citas filtradas.' })
  async findByFilters(
    @Query('doctorId') doctorId?: string,
    @Query('patientId') patientId?: string,
    @Query('clinicId') clinicId?: string,
    @Query('date') date?: string,
    @Query('status') status?: string,
  ): Promise<Appointment[]> {
    const filters: any = {};
    if (doctorId) filters.doctorId = +doctorId;
    if (patientId) filters.patientId = +patientId;
    if (clinicId) filters.clinicId = +clinicId;
    if (date) filters.date = date;
    if (status) filters.status = status;
    return this.appointmentsService.findByFilters(filters);
  }

  @Get('doctor/:id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'secretary', 'admin'])
  @ApiOperation({
    summary: 'Listar citas por doctor',
    description: 'Devuelve todas las citas asociadas a un doctor.',
  })
  @ApiParam({ name: 'id', example: 2, description: 'ID del doctor' })
  @ApiResponse({ status: 200, description: 'Citas del doctor.' })
  async findByDoctor(@Param('id') doctorId: string): Promise<Appointment[]> {
    return this.appointmentsService.findByFilters({ doctorId: +doctorId });
  }

  @Get('patient/:id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['patient', 'doctor', 'secretary', 'admin'])
  @ApiOperation({
    summary: 'Listar citas por paciente',
    description: 'Devuelve todas las citas asociadas a un paciente.',
  })
  @ApiParam({ name: 'id', example: 5, description: 'ID del paciente' })
  @ApiResponse({ status: 200, description: 'Citas del paciente.' })
  async findByPatient(@Param('id') patientId: string): Promise<Appointment[]> {
    return this.appointmentsService.findByFilters({ patientId: +patientId });
  }

  @Get('clinic/:id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'secretary', 'admin'])
  @ApiOperation({
    summary: 'Listar citas por clínica',
    description: 'Devuelve todas las citas asociadas a una clínica.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la clínica' })
  @ApiResponse({ status: 200, description: 'Citas de la clínica.' })
  async findByClinic(@Param('id') clinicId: string): Promise<Appointment[]> {
    return this.appointmentsService.findByFilters({ clinicId: +clinicId });
  }

  @Get('date/:date')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'secretary', 'admin'])
  @ApiOperation({
    summary: 'Listar citas por fecha',
    description: 'Devuelve todas las citas de una fecha específica.',
  })
  @ApiParam({
    name: 'date',
    example: '2025-05-27',
    description: 'Fecha de la cita (YYYY-MM-DD)',
  })
  @ApiResponse({ status: 200, description: 'Citas de la fecha.' })
  async findByDate(@Param('date') date: string): Promise<Appointment[]> {
    return this.appointmentsService.findByFilters({ date });
  }
}
