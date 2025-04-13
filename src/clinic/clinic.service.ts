import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Clinic } from './entity/clinic.entity';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { Plan } from 'src/plan/entity/plan.entity';

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic)
    private clinicsRepository: Repository<Clinic>,
    @InjectRepository(Plan)
    private plansRepository: Repository<Plan>,
  ) {}

  async create(createClinicDto: CreateClinicDto): Promise<Clinic> {
    const plan = await this.plansRepository.findOne({
      where: { id: createClinicDto.planId, deletedAt: IsNull() },
    });
    if (!plan) {
      throw new NotFoundException(
        `Plan with ID ${createClinicDto.planId} not found`,
      );
    }

    const clinic = this.clinicsRepository.create({
      ...createClinicDto,
      plan,
    });
    return this.clinicsRepository.save(clinic);
  }

  async findAll(): Promise<Clinic[]> {
    return this.clinicsRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['plan'],
    });
  }

  async findOne(id: number): Promise<Clinic> {
    const clinic = await this.clinicsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['plan', 'doctors'],
    });
    if (!clinic) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }
    return clinic;
  }

  async update(id: number, updateClinicDto: UpdateClinicDto): Promise<Clinic> {
    const clinic = await this.findOne(id);

    if (updateClinicDto.planId) {
      const plan = await this.plansRepository.findOne({
        where: { id: updateClinicDto.planId, deletedAt: IsNull() },
      });
      if (!plan) {
        throw new NotFoundException(
          `Plan with ID ${updateClinicDto.planId} not found`,
        );
      }
      clinic.plan = plan;
    }

    const updatedClinic = this.clinicsRepository.merge(clinic, updateClinicDto);
    return this.clinicsRepository.save(updatedClinic);
  }

  async remove(id: number): Promise<void> {
    const result = await this.clinicsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }
  }

  async restore(id: number): Promise<void> {
    const result = await this.clinicsRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }
  }
}
