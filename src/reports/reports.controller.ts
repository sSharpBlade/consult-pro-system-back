import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Reportes')
@ApiBearerAuth('JWT-auth')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@SetMetadata('roles', ['admin'])
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('users')
  @ApiOperation({
    summary: 'Reporte de usuarios',
    description: 'Cantidad total de usuarios, por rol y estado.',
  })
  getUsersReport() {
    return this.reportsService.getUsersReport();
  }

  @Get('appointments')
  @ApiOperation({
    summary: 'Reporte de citas',
    description: 'Cantidad de citas por estado y por fecha.',
  })
  getAppointmentsReport() {
    return this.reportsService.getAppointmentsReport();
  }

  @Get('clinics')
  @ApiOperation({
    summary: 'Reporte de clínicas',
    description: 'Cantidad de clínicas registradas y activas.',
  })
  getClinicsReport() {
    return this.reportsService.getClinicsReport();
  }

  @Get('doctors-secretaries')
  @ApiOperation({
    summary: 'Reporte de doctores y secretarias',
    description: 'Cantidad total y activos, asignaciones.',
  })
  getDoctorsSecretariesReport() {
    return this.reportsService.getDoctorsSecretariesReport();
  }

  @Get('finances')
  @ApiOperation({
    summary: 'Reporte financiero',
    description: 'Sumatoria de pagos recibidos y pagos por clínica.',
  })
  getFinancesReport() {
    return this.reportsService.getFinancesReport();
  }
}
