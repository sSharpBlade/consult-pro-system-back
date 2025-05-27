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
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('clinics')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @ApiOperation({
    summary: 'Crear una clínica',
    description: 'Crea una nueva clínica. Solo administradores.',
  })
  @ApiBody({
    schema: {
      example: {
        name: 'Clínica Central',
        address: 'Av. Principal 123',
        lat: -12.04318,
        lng: -77.02824,
        planId: 1,
        openingDays: 'Lunes a Viernes',
        openingTime: '08:00',
        closingTime: '18:00',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Clínica creada correctamente.' })
  async create(
    @Body() createClinicDto: CreateClinicDto,
    @Req() req,
  ): Promise<Clinic> {
    return this.clinicsService.create(createClinicDto, req.user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'patient'])
  @ApiOperation({
    summary: 'Listar clínicas',
    description:
      'Devuelve todas las clínicas del sistema. Solo administradores y pacientes.',
  })
  @ApiResponse({ status: 200, description: 'Lista de clínicas.' })
  async findAll(): Promise<Clinic[]> {
    return this.clinicsService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'patient', 'secretary', 'admin'])
  @ApiOperation({
    summary: 'Obtener una clínica',
    description: 'Devuelve los datos de una clínica específica.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la clínica' })
  @ApiResponse({ status: 200, description: 'Clínica encontrada.' })
  async findOne(@Param('id') id: string): Promise<Clinic> {
    return this.clinicsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @ApiOperation({
    summary: 'Actualizar una clínica',
    description: 'Actualiza los datos de una clínica. Solo administradores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la clínica' })
  @ApiBody({
    schema: {
      example: {
        name: 'Clínica Central Actualizada',
        address: 'Av. Nueva 456',
        openingDays: 'Lunes a Sábado',
        openingTime: '07:00',
        closingTime: '19:00',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Clínica actualizada.' })
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
  @ApiOperation({
    summary: 'Eliminar una clínica',
    description: 'Elimina una clínica (soft delete). Solo administradores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la clínica' })
  @ApiResponse({ status: 204, description: 'Clínica eliminada.' })
  async remove(@Param('id') id: string, @Req() req): Promise<void> {
    await this.clinicsService.remove(+id, req.user);
  }

  @Post(':id/restore')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Restaurar una clínica',
    description: 'Restaura una clínica eliminada. Solo administradores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la clínica' })
  @ApiResponse({ status: 204, description: 'Clínica restaurada.' })
  async restore(@Param('id') id: string): Promise<void> {
    await this.clinicsService.restore(+id);
  }
}
