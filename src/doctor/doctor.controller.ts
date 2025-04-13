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
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { DoctorsService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './entity/doctor.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
@SetMetadata('roles', ['doctor'])
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  async create(@Body() createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  async findAll(): Promise<Doctor[]> {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Doctor> {
    return this.doctorsService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor> {
    return this.doctorsService.update(+id, updateDoctorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.doctorsService.remove(+id);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(@Param('id') id: string): Promise<void> {
    await this.doctorsService.restore(+id);
  }

  @Post(':doctorId/secretaries/:secretaryId')
  @HttpCode(HttpStatus.CREATED)
  async addSecretary(
    @Param('doctorId') doctorId: string,
    @Param('secretaryId') secretaryId: string,
  ) {
    return this.doctorsService.addSecretary(+doctorId, +secretaryId);
  }

  @Delete(':doctorId/secretaries/:secretaryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSecretary(
    @Param('doctorId') doctorId: string,
    @Param('secretaryId') secretaryId: string,
  ) {
    await this.doctorsService.removeSecretary(+doctorId, +secretaryId);
  }

  @Get(':doctorId/secretaries')
  async listSecretaries(@Param('doctorId') doctorId: string) {
    return this.doctorsService.listSecretaries(+doctorId);
  }
}
