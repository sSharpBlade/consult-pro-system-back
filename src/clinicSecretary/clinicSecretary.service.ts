import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ClinicSecretary } from './entity/clinicSecretary.entity';
import { ClinicSecretaryDto } from './dto/create-clinicSecretary.entity';
import { Clinic } from '../clinic/entity/clinic.entity';
import { User } from '../user/entity/user.entity';

@Injectable()
export class ClinicSecretaryService {
  constructor(
    @InjectRepository(ClinicSecretary)
    private clinicSecretaryRepo: Repository<ClinicSecretary>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Clinic)
    private clinicRepo: Repository<Clinic>,
  ) {}

  async assignSecretaryToClinic(dto: ClinicSecretaryDto) {
    // secretaryId es el id de User
    const user = await this.userRepo.findOne({
      where: { id: dto.secretaryId, deletedAt: IsNull() },
      relations: ['userRole'],
    });
    if (!user || user.userRole?.name !== 'secretary')
      throw new NotFoundException('Usuario secretaria no encontrado');
    const clinic = await this.clinicRepo.findOne({
      where: { id: dto.clinicId, active: true },
    });
    if (!clinic) throw new NotFoundException('Clínica no encontrada');
    // Verificar si ya existe la relación
    const exists = await this.clinicSecretaryRepo.findOne({
      where: {
        secretaryId: dto.secretaryId,
        clinicId: dto.clinicId,
        isActive: true,
      },
    });
    if (exists) return exists;
    const relation = this.clinicSecretaryRepo.create({
      secretaryId: dto.secretaryId,
      clinicId: dto.clinicId,
    });
    return this.clinicSecretaryRepo.save(relation);
  }

  async getAppointmentsBySecretary(secretaryId: number) {
    // secretaryId es el id de User
    const relation = await this.clinicSecretaryRepo.findOne({
      where: { secretaryId, isActive: true },
      relations: ['clinic'],
    });
    if (!relation)
      throw new NotFoundException(
        'La secretaria no está asignada a ninguna clínica',
      );
    const clinic = relation.clinic;
    if (!clinic) throw new NotFoundException('Clínica no encontrada');
    // Obtener las citas de la clínica
    const appointments = await this.clinicRepo
      .createQueryBuilder('clinic')
      .leftJoinAndSelect('clinic.appointments', 'appointment')
      .where('clinic.id = :clinicId', { clinicId: clinic.id })
      .getOne();
    return appointments?.appointments || [];
  }
}
