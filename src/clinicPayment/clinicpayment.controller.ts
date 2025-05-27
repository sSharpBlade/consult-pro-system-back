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
  SetMetadata,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ClinicPaymentsService } from './clinicpayment.service';
import { CreateClinicPaymentDto } from './dto/create-clinicPayment.dto';
import { UpdateClinicPaymentDto } from './dto/update-clinicPayment.dto';
import { ClinicPayment } from './entity/clinicPayment.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('clinic-payments')
@UseGuards(JwtAuthGuard)
export class ClinicPaymentsController {
  constructor(private readonly clinicPaymentsService: ClinicPaymentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @ApiOperation({
    summary: 'Crear un pago de clínica',
    description: 'Crea un nuevo pago para una clínica. Solo administradores.',
  })
  @ApiBody({
    schema: {
      example: {
        clinicId: 1,
        amount: 500.0,
        paymentDate: '2025-05-27T00:00:00.000Z',
        status: 'paid',
        startPeriod: '2025-05-01',
        endPeriod: '2025-05-31',
        method: 'transferencia',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Pago de clínica creado correctamente.',
  })
  async create(
    @Body() createDto: CreateClinicPaymentDto,
    @Req() req,
  ): Promise<ClinicPayment> {
    return this.clinicPaymentsService.create(createDto, req.user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @ApiOperation({
    summary: 'Listar pagos de clínica',
    description: 'Devuelve todos los pagos de clínica. Solo administradores.',
  })
  @ApiResponse({ status: 200, description: 'Lista de pagos de clínica.' })
  async findAll(
    @Query('clinicId') clinicId?: string,
  ): Promise<ClinicPayment[]> {
    if (clinicId) {
      return this.clinicPaymentsService.findByClinic(+clinicId);
    }
    return this.clinicPaymentsService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @ApiOperation({
    summary: 'Obtener un pago de clínica',
    description: 'Devuelve los datos de un pago de clínica específico.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del pago de clínica' })
  @ApiResponse({ status: 200, description: 'Pago de clínica encontrado.' })
  async findOne(@Param('id') id: string): Promise<ClinicPayment> {
    return this.clinicPaymentsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @ApiOperation({
    summary: 'Actualizar un pago de clínica',
    description:
      'Actualiza los datos de un pago de clínica. Solo administradores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del pago de clínica' })
  @ApiBody({
    schema: {
      example: {
        amount: 600.0,
        status: 'paid',
        method: 'tarjeta',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Pago de clínica actualizado.' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateClinicPaymentDto,
    @Req() req,
  ): Promise<ClinicPayment> {
    return this.clinicPaymentsService.update(+id, updateDto, req.user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un pago de clínica',
    description:
      'Elimina un pago de clínica (soft delete). Solo administradores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del pago de clínica' })
  @ApiResponse({ status: 204, description: 'Pago de clínica eliminado.' })
  async remove(@Param('id') id: string, @Req() req): Promise<void> {
    await this.clinicPaymentsService.remove(+id, req.user);
  }

  @Post(':id/restore')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Restaurar un pago de clínica',
    description: 'Restaura un pago de clínica eliminado. Solo administradores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del pago de clínica' })
  @ApiResponse({ status: 204, description: 'Pago de clínica restaurado.' })
  async restore(@Param('id') id: string): Promise<void> {
    await this.clinicPaymentsService.restore(+id);
  }
}
