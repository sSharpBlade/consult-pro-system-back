import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { Role } from './entity/roles.entity';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos los roles',
    description: 'Devuelve todos los roles del sistema.',
  })
  @ApiResponse({ status: 200, description: 'Lista de roles.' })
  async findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un rol',
    description: 'Devuelve los datos de un rol específico.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del rol' })
  @ApiResponse({ status: 200, description: 'Rol encontrado.' })
  async findOne(@Param('id') id: number): Promise<Role> {
    const role = await this.rolesService.findOne(id);
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return role;
  }

  @Post()
  @ApiOperation({ summary: 'Crear un rol', description: 'Crea un nuevo rol.' })
  @ApiBody({
    schema: {
      example: { name: 'secretary', description: 'Rol de secretaria' },
    },
  })
  @ApiResponse({ status: 201, description: 'Rol creado correctamente.' })
  async create(@Body() roleData: Partial<Role>): Promise<Role> {
    return this.rolesService.create(roleData);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un rol',
    description: 'Actualiza los datos de un rol.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del rol' })
  @ApiBody({
    schema: { example: { name: 'doctor', description: 'Rol de doctor' } },
  })
  @ApiResponse({ status: 200, description: 'Rol actualizado.' })
  async update(
    @Param('id') id: number,
    @Body() roleData: Partial<Role>,
  ): Promise<Role> {
    return this.rolesService.update(id, roleData);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un rol',
    description: 'Elimina un rol del sistema.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del rol' })
  @ApiResponse({ status: 200, description: 'Rol eliminado.' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.rolesService.remove(id);
  }
}
