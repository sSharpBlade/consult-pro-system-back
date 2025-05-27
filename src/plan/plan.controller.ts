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
  Req,
} from '@nestjs/common';
import { PlansService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entity/plan.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('plans')
@UseGuards(JwtAuthGuard)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @ApiOperation({
    summary: 'Crear un plan',
    description: 'Crea un nuevo plan. Solo administradores.',
  })
  @ApiBody({
    schema: {
      example: {
        name: 'Plan Premium',
        price: 150.0,
        description: 'Acceso a todas las funcionalidades',
        durationMonths: 12,
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Plan creado correctamente.' })
  async create(
    @Body() createPlanDto: CreatePlanDto,
    @Req() req,
  ): Promise<Plan> {
    return this.plansService.create(createPlanDto, req.user);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar planes',
    description: 'Devuelve todos los planes disponibles.',
  })
  @ApiResponse({ status: 200, description: 'Lista de planes.' })
  async findAll(): Promise<Plan[]> {
    return this.plansService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un plan',
    description: 'Devuelve los datos de un plan específico.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del plan' })
  @ApiResponse({ status: 200, description: 'Plan encontrado.' })
  async findOne(@Param('id') id: string): Promise<Plan> {
    return this.plansService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @ApiOperation({
    summary: 'Actualizar un plan',
    description: 'Actualiza los datos de un plan. Solo administradores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del plan' })
  @ApiBody({
    schema: {
      example: {
        name: 'Plan Premium Actualizado',
        price: 200.0,
        description: 'Incluye soporte prioritario',
        durationMonths: 24,
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Plan actualizado.' })
  async update(
    @Param('id') id: string,
    @Body() updatePlanDto: UpdatePlanDto,
    @Req() req,
  ): Promise<Plan> {
    return this.plansService.update(+id, updatePlanDto, req.user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un plan',
    description: 'Elimina un plan (soft delete). Solo administradores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del plan' })
  @ApiResponse({ status: 204, description: 'Plan eliminado.' })
  async remove(@Param('id') id: string, @Req() req): Promise<void> {
    await this.plansService.remove(+id, req.user);
  }

  @Post(':id/restore')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Restaurar un plan',
    description: 'Restaura un plan eliminado. Solo administradores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del plan' })
  @ApiResponse({ status: 204, description: 'Plan restaurado.' })
  async restore(@Param('id') id: string): Promise<void> {
    await this.plansService.restore(+id);
  }
}
