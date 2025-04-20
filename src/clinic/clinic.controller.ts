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
  SetMetadata,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ClinicsService } from './clinic.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { Clinic } from './entity/clinic.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('clinics')
@UseGuards(JwtAuthGuard)
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  async create(
    @Body() createClinicDto: CreateClinicDto,
    @Req() req,
  ): Promise<Clinic> {
    return this.clinicsService.create(createClinicDto, req.user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'patient'])
  async findAll(): Promise<Clinic[]> {
    return this.clinicsService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'patient', 'secretary', 'admin'])
  async findOne(@Param('id') id: string): Promise<Clinic> {
    return this.clinicsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  async update(
    @Param('id') id: string,
    @Body() updateClinicDto: UpdateClinicDto,
    @Req() req,
  ): Promise<Clinic> {
    return this.clinicsService.update(+id, updateClinicDto, req.user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req): Promise<void> {
    await this.clinicsService.remove(+id, req.user);
  }

  @Post(':id/restore')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(@Param('id') id: string): Promise<void> {
    await this.clinicsService.restore(+id);
  }
}
