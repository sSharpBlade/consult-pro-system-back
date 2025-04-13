import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Secretary } from './entity/secretary.entity';
import { CreateSecretaryDto } from './dto/create-secretary.dto';
import { UpdateSecretaryDto } from './dto/update-secretary.dto';
import { Doctor } from '../doctor/entity/doctor.entity';

@Injectable()
export class SecretaryService {
  constructor(
    @InjectRepository(Secretary)
    private secretaryRepo: Repository<Secretary>,

    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
  ) {}

  async create(dto: CreateSecretaryDto) {
    const doctors = await this.doctorRepo.findByIds(dto.doctorIds);
    const secretary = this.secretaryRepo.create({
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      doctors,
    });
    return this.secretaryRepo.save(secretary);
  }

  async findAll() {
    return this.secretaryRepo.find({
      where: { isActive: true },
      relations: ['doctors'],
    });
  }

  async findOne(id: number) {
    const secretary = await this.secretaryRepo.findOne({
      where: { id, isActive: true },
      relations: ['doctors'],
    });
    if (!secretary) throw new NotFoundException('Secretaria no encontrada');
    return secretary;
  }

  async update(id: number, dto: UpdateSecretaryDto) {
    const secretary = await this.findOne(id);

    if (dto.doctorIds) {
      secretary.doctors = await this.doctorRepo.findByIds(dto.doctorIds);
      delete dto.doctorIds;
    }

    Object.assign(secretary, dto);
    return this.secretaryRepo.save(secretary);
  }

  async remove(id: number) {
    const secretary = await this.findOne(id);
    secretary.isActive = false;
    return this.secretaryRepo.save(secretary);
  }
}
