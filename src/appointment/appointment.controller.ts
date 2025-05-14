import { Controller, Get, Post, Body, Param, Put, Delete, 
  HttpCode, HttpStatus, UseGuards, SetMetadata, Req, Query } from '@nestjs/common';
import { AppointmentsService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entity/appointment.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'patient', 'admin'])
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Req() req,
  ): Promise<Appointment> {
    return this.appointmentsService.create(createAppointmentDto, req.user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'patient', 'secretary', 'admin'])
  async findAll(): Promise<Appointment[]> {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'patient', 'secretary'])
  async findOne(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'patient'])
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
  async remove(@Param('id') id: string, @Req() req): Promise<void> {
    await this.appointmentsService.remove(+id, req.user);
  }

  @Post(':id/restore')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(@Param('id') id: string): Promise<void> {
    await this.appointmentsService.restore(+id);
  }

  @Get('filter/by')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'patient', 'secretary', 'admin'])
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
  async findByDoctor(@Param('id') doctorId: string): Promise<Appointment[]> {
    return this.appointmentsService.findByFilters({ doctorId: +doctorId });
  }

  @Get('patient/:id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['patient', 'doctor', 'secretary', 'admin'])
  async findByPatient(@Param('id') patientId: string): Promise<Appointment[]> {
    return this.appointmentsService.findByFilters({ patientId: +patientId });
  }

  @Get('clinic/:id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'secretary', 'admin'])
  async findByClinic(@Param('id') clinicId: string): Promise<Appointment[]> {
    return this.appointmentsService.findByFilters({ clinicId: +clinicId });
  }

  @Get('date/:date')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'secretary', 'admin'])
  async findByDate(@Param('date') date: string): Promise<Appointment[]> {
    return this.appointmentsService.findByFilters({ date });
  }
}
