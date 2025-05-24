import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ClinicSecretaryService } from './clinicSecretary.service';
import { ClinicSecretaryDto } from './dto/create-clinicSecretary.entity';

@Controller('clinic-secretaries')
export class ClinicSecretaryController {
  constructor(
    private readonly clinicSecretaryService: ClinicSecretaryService,
  ) {}

  @Post('assign')
  async assignSecretaryToClinic(@Body() dto: ClinicSecretaryDto) {
    return this.clinicSecretaryService.assignSecretaryToClinic(dto);
  }

  @Get('appointments/:secretaryId')
  async getAppointmentsBySecretary(
    @Param('secretaryId', ParseIntPipe) secretaryId: number,
  ) {
    return this.clinicSecretaryService.getAppointmentsBySecretary(secretaryId);
  }
}
