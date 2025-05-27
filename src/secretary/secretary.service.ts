import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { Clinic } from '../clinic/entity/clinic.entity';
import { ClinicSecretary } from '../clinicSecretary/entity/clinicSecretary.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { ClinicSecretaryDto } from '../clinicSecretary/dto/create-clinicSecretary.entity';
import { RolesService } from '../roles/roles.service';

function getUserId(user: any): string | undefined {
  if (
    user &&
    typeof user === 'object' &&
    Object.prototype.hasOwnProperty.call(user, 'id')
  ) {
    return String(user['id']);
  }
  return undefined;
}

@Injectable()
export class SecretaryService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Clinic)
    private clinicRepo: Repository<Clinic>,
    @InjectRepository(ClinicSecretary)
    private clinicSecretaryRepo: Repository<ClinicSecretary>,
    private rolesService: RolesService,
  ) {}

  async create(dto: CreateUserDto, currentUser?: any) {
    // Forzar rol secretary
    const role = await this.rolesService.findOneByName('secretary');
    if (!role) throw new NotFoundException('Rol secretaria no encontrado');
    const createdBy = getUserId(currentUser) || 'system';
    const user = this.userRepo.create({
      ...dto,
      userRole: role,
      createdBy,
    });
    return this.userRepo.save(user);
  }

  async findAll() {
    // Solo usuarios con rol secretaria y no eliminados
    return this.userRepo.find({
      where: { userRole: { name: 'secretary' }, deletedAt: IsNull() },
      relations: ['userRole'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['userRole'],
    });
    if (!user || user.userRole?.name !== 'secretary')
      throw new NotFoundException('Secretaria no encontrada');
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async remove(id: number, currentUser?: any) {
    const user = await this.findOne(id);
    user.deletedAt = new Date();
    user.deletedBy = getUserId(currentUser) || 'system';
    return this.userRepo.save(user);
  }

  // Asignar secretaria a clínica
  async assignToClinic(dto: ClinicSecretaryDto) {
    await this.findOne(dto.secretaryId); // Solo para validar existencia y rol
    const clinic = await this.clinicRepo.findOne({
      where: { id: dto.clinicId, active: true },
    });
    if (!clinic) throw new NotFoundException('Clínica no encontrada');
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

  // Listar clínicas de una secretaria
  async getClinics(secretaryId: number) {
    const relations = await this.clinicSecretaryRepo.find({
      where: { secretaryId, isActive: true },
      relations: ['clinic'],
    });
    return relations.map((r) => r.clinic);
  }
}
