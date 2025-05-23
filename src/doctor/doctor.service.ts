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
import { ClinicSecretary } from 'src/clinicSecretary/entity/clinicSecretary.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Clinic)
    private clinicsRepository: Repository<Clinic>,
    @InjectRepository(ClinicSecretary)
    private secretaryDoctorRepository: Repository<ClinicSecretary>,
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

  
  async findDoctorByUserId(userId: number): Promise<Doctor> {
  const doctor = await this.doctorsRepository.findOne({
    where: { user: { id: userId }, deletedAt: IsNull() },
    relations: ['user', 'clinic'],
  });

  if (!doctor) {
    throw new NotFoundException(`Doctor with user ID ${userId} not found`);
  }

  return doctor;
}
}
