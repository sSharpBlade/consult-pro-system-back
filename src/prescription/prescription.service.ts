import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Prescription } from './entity/prescription.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { Appointment } from 'src/appointment/entity/appointment.entity';
import { Doctor } from 'src/doctor/entity/doctor.entity';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionsRepository: Repository<Prescription>,
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
  ) {}

  async create(
    createPrescriptionDto: CreatePrescriptionDto,
  ): Promise<Prescription> {
    const [appointment, doctor] = await Promise.all([
      this.appointmentsRepository.findOne({
        where: { id: createPrescriptionDto.appointmentId, deletedAt: IsNull() },
      }),
      this.doctorsRepository.findOne({
        where: { id: createPrescriptionDto.doctorId, deletedAt: IsNull() },
      }),
    ]);

    if (!appointment) {
      throw new NotFoundException(
        `Appointment with ID ${createPrescriptionDto.appointmentId} not found`,
      );
    }

    if (!doctor) {
      throw new NotFoundException(
        `Doctor with ID ${createPrescriptionDto.doctorId} not found`,
      );
    }

    // Verificar si ya existe una prescripción para esta cita
    const existing = await this.prescriptionsRepository.findOne({
      where: { appointment: { id: appointment.id }, deletedAt: IsNull() },
    });

    if (existing) {
      throw new ConflictException(
        `Appointment already has a prescription (ID: ${existing.id})`,
      );
    }

    const prescription = this.prescriptionsRepository.create({
      document: createPrescriptionDto.document,
      appointment,
      doctor,
    });

    return this.prescriptionsRepository.save(prescription);
  }

  async findAll(): Promise<Prescription[]> {
    return this.prescriptionsRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['appointment', 'doctor'],
    });
  }

  async findByAppointment(appointmentId: number): Promise<Prescription[]> {
    return this.prescriptionsRepository.find({
      where: { appointment: { id: appointmentId }, deletedAt: IsNull() },
      relations: ['doctor'],
    });
  }

  async findOne(id: number): Promise<Prescription> {
    const prescription = await this.prescriptionsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['appointment', 'doctor'],
    });

    if (!prescription) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }

    return prescription;
  }

  async update(
    id: number,
    updatePrescriptionDto: UpdatePrescriptionDto,
  ): Promise<Prescription> {
    const prescription = await this.findOne(id);

    if (updatePrescriptionDto.doctorId) {
      const doctor = await this.doctorsRepository.findOne({
        where: { id: updatePrescriptionDto.doctorId, deletedAt: IsNull() },
      });
      if (!doctor) {
        throw new NotFoundException(
          `Doctor with ID ${updatePrescriptionDto.doctorId} not found`,
        );
      }
      prescription.doctor = doctor;
    }

    const updatedPrescription = this.prescriptionsRepository.merge(
      prescription,
      updatePrescriptionDto,
    );

    return this.prescriptionsRepository.save(updatedPrescription);
  }

  async remove(id: number): Promise<void> {
    const result = await this.prescriptionsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }
  }

  async restore(id: number): Promise<void> {
    const result = await this.prescriptionsRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }
  }
}
