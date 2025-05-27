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
import { PaymentReceiptsService } from './paymentreceipt.service';
import { CreatePaymentReceiptDto } from './dto/create-paymentReceipt.dto';
import { UpdatePaymentReceiptDto } from './dto/update-paymentReceipt.dto';
import { PaymentReceipt } from './entity/paymentReceipt.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('payment-receipts')
@UseGuards(JwtAuthGuard)
export class PaymentReceiptsController {
  constructor(
    private readonly paymentReceiptsService: PaymentReceiptsService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'patient', 'admin'])
  @ApiOperation({
    summary: 'Crear un recibo de pago',
    description:
      'Crea un nuevo recibo de pago para una cita. Solo doctores, pacientes y administradores.',
  })
  @ApiBody({
    schema: {
      example: {
        appointmentId: 10,
        amount: 100.0,
        paymentDate: '2025-05-27T00:00:00.000Z',
        method: 'efectivo',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Recibo de pago creado correctamente.',
  })
  async create(
    @Body() createDto: CreatePaymentReceiptDto,
    @Req() req,
  ): Promise<PaymentReceipt> {
    return this.paymentReceiptsService.create(createDto, req.user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'patient'])
  @ApiOperation({
    summary: 'Listar recibos de pago',
    description:
      'Devuelve todos los recibos de pago. Solo doctores y pacientes.',
  })
  @ApiResponse({ status: 200, description: 'Lista de recibos de pago.' })
  async findAll(
    @Query('appointmentId') appointmentId?: string,
  ): Promise<PaymentReceipt[]> {
    if (appointmentId) {
      return this.paymentReceiptsService.findByAppointment(+appointmentId);
    }
    return this.paymentReceiptsService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'patient'])
  @ApiOperation({
    summary: 'Obtener un recibo de pago',
    description: 'Devuelve los datos de un recibo de pago específico.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del recibo de pago' })
  @ApiResponse({ status: 200, description: 'Recibo de pago encontrado.' })
  async findOne(@Param('id') id: string): Promise<PaymentReceipt> {
    return this.paymentReceiptsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor'])
  @ApiOperation({
    summary: 'Actualizar un recibo de pago',
    description: 'Actualiza los datos de un recibo de pago. Solo doctores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del recibo de pago' })
  @ApiBody({
    schema: {
      example: {
        amount: 120.0,
        method: 'tarjeta',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Recibo de pago actualizado.' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePaymentReceiptDto,
    @Req() req,
  ): Promise<PaymentReceipt> {
    return this.paymentReceiptsService.update(+id, updateDto, req.user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor'])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un recibo de pago',
    description: 'Elimina un recibo de pago (soft delete). Solo doctores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del recibo de pago' })
  @ApiResponse({ status: 204, description: 'Recibo de pago eliminado.' })
  async remove(@Param('id') id: string, @Req() req): Promise<void> {
    await this.paymentReceiptsService.remove(+id, req.user);
  }

  @Post(':id/restore')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Restaurar un recibo de pago',
    description: 'Restaura un recibo de pago eliminado. Solo administradores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del recibo de pago' })
  @ApiResponse({ status: 204, description: 'Recibo de pago restaurado.' })
  async restore(@Param('id') id: string): Promise<void> {
    await this.paymentReceiptsService.restore(+id);
  }
}
