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
} from '@nestjs/common';
import { PaymentReceiptsService } from './paymentreceipt.service';
import { CreatePaymentReceiptDto } from './dto/create-paymentReceipt.dto';
import { UpdatePaymentReceiptDto } from './dto/update-paymentReceipt.dto';
import { PaymentReceipt } from './entity/paymentReceipt.entity';

@Controller('payment-receipts')
export class PaymentReceiptsController {
  constructor(
    private readonly paymentReceiptsService: PaymentReceiptsService,
  ) {}

  @Post()
  async create(
    @Body() createDto: CreatePaymentReceiptDto,
  ): Promise<PaymentReceipt> {
    return this.paymentReceiptsService.create(createDto);
  }

  @Get()
  async findAll(
    @Query('appointmentId') appointmentId?: string,
  ): Promise<PaymentReceipt[]> {
    if (appointmentId) {
      return this.paymentReceiptsService.findByAppointment(+appointmentId);
    }
    return this.paymentReceiptsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PaymentReceipt> {
    return this.paymentReceiptsService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePaymentReceiptDto,
  ): Promise<PaymentReceipt> {
    return this.paymentReceiptsService.update(+id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.paymentReceiptsService.remove(+id);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(@Param('id') id: string): Promise<void> {
    await this.paymentReceiptsService.restore(+id);
  }
}
