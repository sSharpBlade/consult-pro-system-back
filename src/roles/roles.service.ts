import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entity/roles.entity';

@Injectable()
export class RolesService {
	constructor(
		@InjectRepository(Role)
		private readonly rolesRepository: Repository<Role>,
	) {}

	async findAll(): Promise<Role[]> {
		return this.rolesRepository.find();
	}

	async findOne(id: number): Promise<Role | undefined> {
		const role = await this.rolesRepository.findOne({ where: { id } });
		return role === null ? undefined : role;
	}

	async create(roleData: Partial<Role>): Promise<Role> {
		const role = this.rolesRepository.create(roleData);
		return this.rolesRepository.save(role);
	}

	async update(id: number, updateData: Partial<Role>): Promise<Role> {
		await this.rolesRepository.update(id, updateData);
		const updatedRole = await this.findOne(id);
		if (!updatedRole) {
			throw new Error(`Role with id ${id} not found`);
		}
		return updatedRole;
	}

	async remove(id: number): Promise<void> {
		await this.rolesRepository.delete(id);
	}
}