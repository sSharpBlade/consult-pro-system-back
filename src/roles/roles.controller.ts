import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './entity/roles.entity';

@Controller('roles')
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@Get()
	async findAll(): Promise<Role[]> {
		return this.rolesService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: number): Promise<Role> {
		const role = await this.rolesService.findOne(id);
		if (!role) {
			throw new NotFoundException(`Role with id ${id} not found`);
		}
		return role;
	}

	@Post()
	async create(@Body() roleData: Partial<Role>): Promise<Role> {
		return this.rolesService.create(roleData);
	}

	@Put(':id')
	async update(@Param('id') id: number, @Body() roleData: Partial<Role>): Promise<Role> {
		return this.rolesService.update(id, roleData);
	}

	@Delete(':id')
	async remove(@Param('id') id: number): Promise<void> {
		return this.rolesService.remove(id);
	}
}