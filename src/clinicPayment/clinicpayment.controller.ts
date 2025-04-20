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
} from '@nestjs/common';
import { ClinicPaymentsService } from './clinicpayment.service';
import { CreateClinicPaymentDto } from './dto/create-clinicPayment.dto';
import { UpdateClinicPaymentDto } from './dto/update-clinicPayment.dto';
import { ClinicPayment } from './entity/clinicPayment.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('clinic-payments')
@UseGuards(JwtAuthGuard)
export class ClinicPaymentsController {
  constructor(private readonly clinicPaymentsService: ClinicPaymentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  async create(
    @Body() createDto: CreateClinicPaymentDto,
  ): Promise<ClinicPayment> {
    return this.clinicPaymentsService.create(createDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
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
  async findOne(@Param('id') id: string): Promise<ClinicPayment> {
    return this.clinicPaymentsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateClinicPaymentDto,
  ): Promise<ClinicPayment> {
    return this.clinicPaymentsService.update(+id, updateDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.clinicPaymentsService.remove(+id);
  }

  @Post(':id/restore')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(@Param('id') id: string): Promise<void> {
    await this.clinicPaymentsService.restore(+id);
  }
}
