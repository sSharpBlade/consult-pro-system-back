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
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { PrescriptionsService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { Prescription } from './entity/prescription.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('prescriptions')
@UseGuards(JwtAuthGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin','doctor'])
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
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin','doctor'])
  async update(
    @Param('id') id: string,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto,
  ): Promise<Prescription> {
    return this.prescriptionsService.update(+id, updatePrescriptionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin','doctor'])
  async remove(@Param('id') id: string): Promise<void> {
    await this.prescriptionsService.remove(+id);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin','doctor'])
  async restore(@Param('id') id: string): Promise<void> {
    await this.prescriptionsService.restore(+id);
  }
}
