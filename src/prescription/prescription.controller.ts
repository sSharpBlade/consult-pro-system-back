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
  Query,
  UseGuards,
  SetMetadata,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PrescriptionsService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { Prescription } from './entity/prescription.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('prescriptions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'doctor'])
  @ApiOperation({
    summary: 'Crear una prescripción',
    description:
      'Crea una nueva prescripción médica. Solo administradores y doctores.',
  })
  @ApiBody({
    schema: {
      example: {
        document:
          'Diagnóstico: Gripe estacional. Tratamiento: Paracetamol 500mg cada 8 horas durante 3 días...',
        appointmentId: 123,
        doctorId: 456,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Prescripción creada correctamente.',
  })
  async create(
    @Body() createPrescriptionDto: CreatePrescriptionDto,
    @Req() req,
  ): Promise<Prescription> {
    return this.prescriptionsService.create(createPrescriptionDto, req.user);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar prescripciones',
    description: 'Devuelve todas las prescripciones o filtra por cita médica.',
  })
  @ApiResponse({ status: 200, description: 'Lista de prescripciones.' })
  async findAll(
    @Query('appointmentId') appointmentId?: string,
  ): Promise<Prescription[]> {
    if (appointmentId) {
      return this.prescriptionsService.findByAppointment(+appointmentId);
    }
    return this.prescriptionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una prescripción',
    description: 'Devuelve los datos de una prescripción específica.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la prescripción' })
  @ApiResponse({ status: 200, description: 'Prescripción encontrada.' })
  async findOne(@Param('id') id: string): Promise<Prescription> {
    return this.prescriptionsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'doctor'])
  @ApiOperation({
    summary: 'Actualizar una prescripción',
    description:
      'Actualiza los datos de una prescripción. Solo administradores y doctores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la prescripción' })
  @ApiBody({
    schema: {
      example: {
        document:
          'Diagnóstico actualizado: Infección viral respiratoria. Tratamiento: Paracetamol 500mg cada 8 horas durante 5 días...',
        doctorId: 456,
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Prescripción actualizada.' })
  async update(
    @Param('id') id: string,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto,
    @Req() req,
  ): Promise<Prescription> {
    return this.prescriptionsService.update(
      +id,
      updatePrescriptionDto,
      req.user,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'doctor'])
  @ApiOperation({
    summary: 'Eliminar una prescripción',
    description:
      'Elimina una prescripción (soft delete). Solo administradores y doctores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la prescripción' })
  @ApiResponse({ status: 204, description: 'Prescripción eliminada.' })
  async remove(@Param('id') id: string, @Req() req): Promise<void> {
    await this.prescriptionsService.remove(+id, req.user);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'doctor'])
  @ApiOperation({
    summary: 'Restaurar una prescripción',
    description:
      'Restaura una prescripción eliminada. Solo administradores y doctores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la prescripción' })
  @ApiResponse({ status: 204, description: 'Prescripción restaurada.' })
  async restore(@Param('id') id: string): Promise<void> {
    await this.prescriptionsService.restore(+id);
  }
}
