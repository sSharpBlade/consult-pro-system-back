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
import { ClinicPaymentsService } from './clinicpayment.service';
import { CreateClinicPaymentDto } from './dto/create-clinicPayment.dto';
import { UpdateClinicPaymentDto } from './dto/update-clinicPayment.dto';
import { ClinicPayment } from './entity/clinicPayment.entity';

@Controller('clinic-payments')
export class ClinicPaymentsController {
  constructor(private readonly clinicPaymentsService: ClinicPaymentsService) {}

  @Post()
  async create(
    @Body() createDto: CreateClinicPaymentDto,
  ): Promise<ClinicPayment> {
    return this.clinicPaymentsService.create(createDto);
  }

  @Get()
  async findAll(
    @Query('clinicId') clinicId?: string,
  ): Promise<ClinicPayment[]> {
    if (clinicId) {
      return this.clinicPaymentsService.findByClinic(+clinicId);
    }
    return this.clinicPaymentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ClinicPayment> {
    return this.clinicPaymentsService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateClinicPaymentDto,
  ): Promise<ClinicPayment> {
    return this.clinicPaymentsService.update(+id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.clinicPaymentsService.remove(+id);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(@Param('id') id: string): Promise<void> {
    await this.clinicPaymentsService.restore(+id);
  }
}
