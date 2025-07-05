import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ClinicSecretaryService } from './clinicSecretary.service';
import { ClinicSecretaryDto } from './dto/create-clinicSecretary.entity';

@Controller('clinic-secretaries')
@ApiBearerAuth('JWT-auth')
export class ClinicSecretaryController {
  constructor(
    private readonly clinicSecretaryService: ClinicSecretaryService,
  ) {}

  @Post('assign')
  @ApiOperation({
    summary: 'Asignar secretaria a clínica',
    description: 'Asocia un usuario con rol secretaria a una clínica.',
  })
  @ApiBody({
    schema: {
      example: {
        secretaryId: 13,
        clinicId: 3,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Secretaria asignada a clínica correctamente.',
  })
  async assignSecretaryToClinic(@Body() dto: ClinicSecretaryDto) {
    return this.clinicSecretaryService.assignSecretaryToClinic(dto);
  }

  @Get('appointments/:secretaryId')
  @ApiOperation({
    summary: 'Obtener citas de la clínica de la secretaria',
    description:
      'Devuelve todas las citas de la clínica a la que está asignada la secretaria con información básica del paciente, doctor y clínica.',
  })
  @ApiParam({
    name: 'secretaryId',
    example: 13,
    description: 'ID del usuario secretaria',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de citas de la clínica con información relacionada.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          appointmentDate: { type: 'string', example: '2025-07-10' },
          appointmentTime: { type: 'string', example: '10:00:00' },
          status: { type: 'string', example: 'pending' },
          patient: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              firstName: { type: 'string', example: 'Juan' },
              lastName: { type: 'string', example: 'Pérez' },
              email: { type: 'string', example: 'juan@email.com' },
            },
          },
          doctor: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              specialization: { type: 'string', example: 'Cardiología' },
              user: {
                type: 'object',
                properties: {
                  firstName: { type: 'string', example: 'Dr. María' },
                  lastName: { type: 'string', example: 'García' },
                },
              },
            },
          },
          clinic: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Clínica Central' },
            },
          },
        },
      },
    },
  })
  async getAppointmentsBySecretary(
    @Param('secretaryId', ParseIntPipe) secretaryId: number,
  ) {
    return this.clinicSecretaryService.getAppointmentsBySecretary(secretaryId);
  }

  @Get('appointments/:secretaryId/:appointmentId')
  @ApiOperation({
    summary: 'Obtener detalles completos de una cita específica',
    description:
      'Devuelve los detalles completos de una cita incluyendo información del paciente, doctor, clínica y receta asociados.',
  })
  @ApiParam({
    name: 'secretaryId',
    example: 13,
    description: 'ID del usuario secretaria',
  })
  @ApiParam({
    name: 'appointmentId',
    example: 1,
    description: 'ID de la cita',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles completos de la cita con información relacionada.',
    schema: {
      example: {
        id: 1,
        appointmentDate: '2025-07-10',
        appointmentTime: '10:00:00',
        status: 'pending',
        createdAt: '2025-07-05T10:00:00.000Z',
        patient: {
          id: 1,
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@email.com',
          phone: '123456789',
        },
        doctor: {
          id: 1,
          specialization: 'Cardiología',
          user: {
            firstName: 'Dr. María',
            lastName: 'García',
            email: 'maria@doctor.com',
          },
        },
        clinic: {
          id: 1,
          name: 'Clínica Central',
          address: 'Av. Principal 123',
          phone: '987654321',
        },
        prescription: {
          id: 1,
          medications: 'Paracetamol 500mg',
          instructions: 'Tomar cada 8 horas',
        },
      },
    },
  })
  async getAppointmentDetails(
    @Param('secretaryId', ParseIntPipe) secretaryId: number,
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
  ) {
    return await this.clinicSecretaryService.getAppointmentDetails(
      secretaryId,
      appointmentId,
    );
  }
}
