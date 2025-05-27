import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  SetMetadata,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { SecretaryService } from './secretary.service';
import { CreateSecretaryDto } from './dto/create-secretary.dto';
import { UpdateSecretaryDto } from './dto/update-secretary.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Secretarias')
@Controller('secretaries')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class SecretaryController {
  constructor(private readonly secretaryService: SecretaryService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'doctor'])
  @ApiOperation({
    summary: 'Crear una secretaria',
    description:
      'Crea una nueva secretaria (usuario con rol secretaria). Solo administradores y doctores.',
  })
  @ApiBody({
    schema: {
      example: {
        name: 'María López',
        phone: '987654321',
        email: 'secretaria@ejemplo.com',
        password: 'secreta123',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Secretaria creada correctamente.' })
  create(@Body() dto: any, @Req() req) {
    // Se recomienda crear un DTO específico para crear usuario secretaria
    return this.secretaryService.create(dto, req.user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'secretary', 'doctor'])
  @ApiOperation({
    summary: 'Listar secretarias',
    description:
      'Devuelve todos los usuarios con rol secretaria. Solo administradores, secretarias y doctores.',
  })
  @ApiResponse({ status: 200, description: 'Lista de secretarias.' })
  findAll() {
    return this.secretaryService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'secretary', 'doctor'])
  @ApiOperation({
    summary: 'Obtener una secretaria',
    description:
      'Devuelve los datos de una secretaria específica (usuario con rol secretaria).',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la secretaria' })
  @ApiResponse({ status: 200, description: 'Secretaria encontrada.' })
  findOne(@Param('id') id: string) {
    return this.secretaryService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'doctor'])
  @ApiOperation({
    summary: 'Actualizar una secretaria',
    description:
      'Actualiza los datos de una secretaria (usuario con rol secretaria). Solo administradores y doctores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la secretaria' })
  @ApiBody({
    schema: {
      example: {
        name: 'María López Actualizada',
        phone: '912345678',
        email: 'nueva_secretaria@ejemplo.com',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Secretaria actualizada.' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.secretaryService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'doctor'])
  @ApiOperation({
    summary: 'Eliminar una secretaria',
    description:
      'Elimina una secretaria (soft delete, usuario con rol secretaria). Solo administradores y doctores.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la secretaria' })
  @ApiResponse({ status: 200, description: 'Secretaria eliminada.' })
  remove(@Param('id') id: string, @Req() req) {
    return this.secretaryService.remove(+id, req.user);
  }
}
