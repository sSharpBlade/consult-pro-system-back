import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Plan } from './entity/plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private plansRepository: Repository<Plan>,
  ) {}

  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    const plan = this.plansRepository.create(createPlanDto);
    return this.plansRepository.save(plan);
  }

  async findAll(): Promise<Plan[]> {
    return this.plansRepository.find({ where: { deletedAt: IsNull() } });
  }

  async findOne(id: number): Promise<Plan> {
    const plan = await this.plansRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['clinics'],
    });
    if (!plan) throw new NotFoundException(`Plan with ID ${id} not found`);
    return plan;
  }

  async update(id: number, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    const plan = await this.findOne(id);
    const updated = this.plansRepository.merge(plan, updatePlanDto);
    return this.plansRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const result = await this.plansRepository.softDelete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Plan with ID ${id} not found`);
  }

  async restore(id: number): Promise<void> {
    const result = await this.plansRepository.restore(id);
    if (result.affected === 0)
      throw new NotFoundException(`Plan with ID ${id} not found`);
  }
}
