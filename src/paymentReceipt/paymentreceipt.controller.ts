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

@Controller('payment-receipts')
@UseGuards(JwtAuthGuard)
export class PaymentReceiptsController {
  constructor(
    private readonly paymentReceiptsService: PaymentReceiptsService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'patient'])
  async create(
    @Body() createDto: CreatePaymentReceiptDto,
    @Req() req,
  ): Promise<PaymentReceipt> {
    return this.paymentReceiptsService.create(createDto, req.user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor', 'patient'])
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
  async findOne(@Param('id') id: string): Promise<PaymentReceipt> {
    return this.paymentReceiptsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['doctor'])
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
  async remove(@Param('id') id: string, @Req() req): Promise<void> {
    await this.paymentReceiptsService.remove(+id, req.user);
  }

  @Post(':id/restore')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(@Param('id') id: string): Promise<void> {
    await this.paymentReceiptsService.restore(+id);
  }
}
