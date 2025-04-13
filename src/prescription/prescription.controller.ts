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
import { PrescriptionsService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { Prescription } from './entity/prescription.entity';

@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  async create(
    @Body() createPrescriptionDto: CreatePrescriptionDto,
  ): Promise<Prescription> {
    return this.prescriptionsService.create(createPrescriptionDto);
  }

  @Get()
  async findAll(
    @Query('appointmentId') appointmentId?: string,
  ): Promise<Prescription[]> {
    if (appointmentId) {
      return this.prescriptionsService.findByAppointment(+appointmentId);
    }
    return this.prescriptionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Prescription> {
    return this.prescriptionsService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto,
  ): Promise<Prescription> {
    return this.prescriptionsService.update(+id, updatePrescriptionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.prescriptionsService.remove(+id);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(@Param('id') id: string): Promise<void> {
    await this.prescriptionsService.restore(+id);
  }
}
