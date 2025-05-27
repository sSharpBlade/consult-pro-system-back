import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { ClinicSecretaryService } from './clinicSecretary.service';
import { ClinicSecretaryDto } from './dto/create-clinicSecretary.entity';

@Controller('clinic-secretaries')
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
      'Devuelve todas las citas de la clínica a la que está asignada la secretaria.',
  })
  @ApiParam({
    name: 'secretaryId',
    example: 13,
    description: 'ID del usuario secretaria',
  })
  @ApiResponse({ status: 200, description: 'Lista de citas de la clínica.' })
  async getAppointmentsBySecretary(
    @Param('secretaryId', ParseIntPipe) secretaryId: number,
  ) {
    return this.clinicSecretaryService.getAppointmentsBySecretary(secretaryId);
  }
}
