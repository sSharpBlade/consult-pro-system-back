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

  async create(dto: CreateSecretaryDto, currentUser?: any) {
    const doctors = await this.doctorRepo.findByIds(dto.doctorIds);
    const secretary = this.secretaryRepo.create({
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      isActive: true,
      createdBy: currentUser ? String(currentUser.id) : 'system',
      // No doctors property, as Secretary entity does not have it
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

  async update(id: number, dto: UpdateSecretaryDto, currentUser?: any) {
    const secretary = await this.findOne(id);

    // El lastModified se actualiza automáticamente por la configuración en la entidad
    Object.assign(secretary, dto);
    return this.secretaryRepo.save(secretary);
  }

  async remove(id: number, currentUser?: any) {
    const secretary = await this.findOne(id);
    secretary.isActive = false;
    secretary.deletedBy = currentUser ? String(currentUser.id) : 'system';
    return this.secretaryRepo.save(secretary);
  }
}
