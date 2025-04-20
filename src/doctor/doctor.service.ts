import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Doctor } from './entity/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { User } from 'src/user/entity/user.entity';
import { Clinic } from 'src/clinic/entity/clinic.entity';
import { SecretaryDoctor } from 'src/secretaryDoctor/entity/secretaryDoctor.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Clinic)
    private clinicsRepository: Repository<Clinic>,
    @InjectRepository(SecretaryDoctor)
    private secretaryDoctorRepository: Repository<SecretaryDoctor>,
  ) {}

  async create(
    createDoctorDto: CreateDoctorDto,
    currentUser?: any,
  ): Promise<Doctor> {
    const user = await this.usersRepository.findOne({
      where: { id: createDoctorDto.userId, deletedAt: IsNull() },
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createDoctorDto.userId} not found`,
      );
    }

    const clinic = await this.clinicsRepository.findOne({
      where: { id: createDoctorDto.clinicId, deletedAt: IsNull() },
    });
    if (!clinic) {
      throw new NotFoundException(
        `Clinic with ID ${createDoctorDto.clinicId} not found`,
      );
    }

    const doctor = this.doctorsRepository.create({
      specialization: createDoctorDto.specialization,
      user,
      clinic,
      createdBy: currentUser ? String(currentUser.id) : 'system',
    });
    return this.doctorsRepository.save(doctor);
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorsRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['user', 'clinic'],
    });
  }

  async findOne(id: number): Promise<Doctor> {
    const doctor = await this.doctorsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['user', 'clinic', 'appointments'],
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async update(
    id: number,
    updateDoctorDto: UpdateDoctorDto,
    currentUser?: any,
  ): Promise<Doctor> {
    const doctor = await this.findOne(id);

    if (updateDoctorDto.userId) {
      const user = await this.usersRepository.findOne({
        where: { id: updateDoctorDto.userId, deletedAt: IsNull() },
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${updateDoctorDto.userId} not found`,
        );
      }
      doctor.user = user;
    }

    if (updateDoctorDto.clinicId) {
      const clinic = await this.clinicsRepository.findOne({
        where: { id: updateDoctorDto.clinicId, deletedAt: IsNull() },
      });
      if (!clinic) {
        throw new NotFoundException(
          `Clinic with ID ${updateDoctorDto.clinicId} not found`,
        );
      }
      doctor.clinic = clinic;
    }

    // lastModified se actualiza automáticamente por la configuración en la entidad
    const updatedDoctor = this.doctorsRepository.merge(doctor, updateDoctorDto);
    return this.doctorsRepository.save(updatedDoctor);
  }

  async remove(id: number, currentUser?: any): Promise<void> {
    const doctor = await this.findOne(id);

    // Actualización de auditoría antes del soft delete
    if ('deletedBy' in doctor) {
      await this.doctorsRepository.update(id, {
        deletedBy: currentUser ? String(currentUser.id) : 'system',
      });
    }

    const result = await this.doctorsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
  }

  async restore(id: number): Promise<void> {
    const result = await this.doctorsRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
  }

  async addSecretary(doctorId: number, secretaryId: number) {
    // Verificar que el secretario y el doctor existan
    const [doctor, secretary] = await Promise.all([
      this.doctorsRepository.findOne({
        where: { id: doctorId, deletedAt: IsNull() },
      }),
      this.usersRepository.findOne({
        where: { id: secretaryId, role: 'secretary', deletedAt: IsNull() },
      }),
    ]);

    if (!doctor) throw new NotFoundException('Doctor not found');
    if (!secretary)
      throw new NotFoundException('Secretary not found or invalid role');

    // Verificar si la relación ya existe
    const existing = await this.secretaryDoctorRepository.findOne({
      where: {
        doctor: { id: doctorId },
        secretary: { id: secretaryId },
        deletedAt: IsNull(),
      },
    });

    if (existing) {
      throw new ConflictException(
        'This secretary is already assigned to the doctor',
      );
    }

    const relation = this.secretaryDoctorRepository.create({
      doctor: { id: doctorId },
      secretary: { id: secretaryId },
    });

    return this.secretaryDoctorRepository.save(relation);
  }

  async removeSecretary(doctorId: number, secretaryId: number) {
    const result = await this.secretaryDoctorRepository.softDelete({
      doctor: { id: doctorId },
      secretary: { id: secretaryId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Assignment not found');
    }
  }

  async listSecretaries(doctorId: number) {
    const relations = await this.secretaryDoctorRepository.find({
      where: {
        doctor: { id: doctorId },
        deletedAt: IsNull(),
      },
      relations: ['secretary'],
    });

    return relations.map((rel) => rel.secretary);
  }
}
