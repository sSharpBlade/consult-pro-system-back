import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { MainService } from '../services/main.service';
import { UpdateClienteDto } from '../dtos/cliente/update-cliente.dto';
import { UpdatePlanDto } from '../dtos/plan/update-plan.dto';
import { CreateSuscripcionDto } from '../dtos/suscripcion/create-suscripcion.dto';
import { UpdateSuscripcionDto } from '../dtos/suscripcion/update-suscripcion.dto';
import { CreateClienteDto } from '../dtos/cliente/create-cliente.dto';
import { CreatePlanDto } from '../dtos/plan/create-plan.dto';

@Controller('api')
export class MainController {
  constructor(private readonly service: MainService) {}

  // CLIENTES
  @Post('clientes')
  createCliente(@Body() dto: CreateClienteDto) {
    return this.service.createCliente(dto);
  }

  @Get('clientes')
  findAllClientes() {
    return this.service.findAllClientes();
  }

  @Get('clientes/:id')
  findClienteById(@Param('id') id: number) {
    return this.service.findClienteById(id);
  }

  @Put('clientes/:id')
  updateCliente(@Param('id') id: number, @Body() dto: UpdateClienteDto) {
    return this.service.updateCliente(id, dto);
  }

  @Delete('clientes/:id')
  deleteCliente(@Param('id') id: number) {
    return this.service.deleteCliente(id);
  }

  // PLANES
  @Post('planes')
  createPlan(@Body() dto: CreatePlanDto) {
    return this.service.createPlan(dto);
  }

  @Get('planes')
  findAllPlanes() {
    return this.service.findAllPlanes();
  }

  @Get('planes/:id')
  findPlanById(@Param('id') id: number) {
    return this.service.findPlanById(id);
  }

  @Put('planes/:id')
  updatePlan(@Param('id') id: number, @Body() dto: UpdatePlanDto) {
    return this.service.updatePlan(id, dto);
  }

  @Delete('planes/:id')
  deletePlan(@Param('id') id: number) {
    return this.service.deletePlan(id);
  }

  // SUSCRIPCIONES
  @Post('suscripciones')
  createSuscripcion(@Body() dto: CreateSuscripcionDto) {
    return this.service.createSuscripcion(dto);
  }

  @Get('suscripciones')
  findAllSuscripciones() {
    return this.service.findAllSuscripciones();
  }

  @Get('suscripciones/:id')
  findSuscripcionById(@Param('id') id: number) {
    return this.service.findSuscripcionById(id);
  }

  @Put('suscripciones/:id')
  updateSuscripcion(
    @Param('id') id: number,
    @Body() dto: UpdateSuscripcionDto,
  ) {
    return this.service.updateSuscripcion(id, dto);
  }

  @Delete('suscripciones/:id')
  deleteSuscripcion(@Param('id') id: number) {
    return this.service.deleteSuscripcion(id);
  }
}
