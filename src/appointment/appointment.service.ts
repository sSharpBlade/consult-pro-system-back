import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Appointment } from './entity/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from 'src/user/entity/user.entity';
import { Doctor } from 'src/doctor/entity/doctor.entity';
import { Clinic } from 'src/clinic/entity/clinic.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    @InjectRepository(Clinic)
    private clinicsRepository: Repository<Clinic>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto,currentUser?: any,): Promise<Appointment> 
  {
    const patient = await this.usersRepository.findOne({
      where: { id: createAppointmentDto.patientId, deletedAt: IsNull() },
    });
    if (!patient) {
      throw new NotFoundException(
        `El paciente con el ID ${createAppointmentDto.patientId} no se encuentra`,
      );
    }

    const doctor = await this.doctorsRepository.findOne({
      where: { id: createAppointmentDto.doctorId, deletedAt: IsNull() },
    });
    if (!doctor) {
      throw new NotFoundException(
        `El doctor con el ID ${createAppointmentDto.doctorId} no se encuentra`,
      );
    }

    const clinic = await this.clinicsRepository.findOne({
      where: { id: createAppointmentDto.clinicId, deletedAt: IsNull() },
    });
    if (!clinic) {
      throw new NotFoundException(
        `La clinica con el ID ${createAppointmentDto.clinicId} no se encuentra`,
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(createAppointmentDto.appointmentDate)) {
      throw new NotFoundException(
        `Debe de ingresar una fecha válida en el formato YYYY-MM-DD`,
      );
    }

    const appointment = this.appointmentsRepository.create({
      ...createAppointmentDto,
      patient,
      doctor,
      clinic,
      createdBy: currentUser ? String(currentUser.id) : 'system',
    });

    return this.appointmentsRepository.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['patient','doctor','clinic','prescription','paymentReceipt'],
    });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['patient','doctor','clinic','prescription','paymentReceipt'],
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async update(id: number,updateAppointmentDto: UpdateAppointmentDto,currentUser?: any,): Promise<Appointment>
   {
    const appointment = await this.findOne(id);

    if (updateAppointmentDto.patientId) {
      const patient = await this.usersRepository.findOne({
        where: { id: updateAppointmentDto.patientId, deletedAt: IsNull() },
      });
      if (!patient) {
        throw new NotFoundException(
          `Patient with ID ${updateAppointmentDto.patientId} not found`,
        );
      }
      appointment.patient = patient;
    }

    if (updateAppointmentDto.doctorId) {
      const doctor = await this.doctorsRepository.findOne({
        where: { id: updateAppointmentDto.doctorId, deletedAt: IsNull() },
      });
      if (!doctor) {
        throw new NotFoundException(
          `Doctor with ID ${updateAppointmentDto.doctorId} not found`,
        );
      }
      appointment.doctor = doctor;
    }

    if (updateAppointmentDto.clinicId) {
      const clinic = await this.clinicsRepository.findOne({
        where: { id: updateAppointmentDto.clinicId, deletedAt: IsNull() },
      });
      if (!clinic) {
        throw new NotFoundException(
          `Clinic with ID ${updateAppointmentDto.clinicId} not found`,
        );
      }
      appointment.clinic = clinic;
    }

    const updatedAppointment = this.appointmentsRepository.merge(appointment, {
      ...updateAppointmentDto,
      status: updateAppointmentDto.status as
        | 'pending'
        | 'completed'
        | 'cancelled',
    });

    return this.appointmentsRepository.save(updatedAppointment);
  }

  async completeAppointment(
    id: number,
    currentUser?: any,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);

    // Validar que la cita esté pendiente
    if (appointment.status !== 'pending') {
      throw new BadRequestException(
        `La cita debe estar en estado 'pending' para ser completada. Estado actual: ${appointment.status}`,
      );
    }

    // Verificar que tenga comprobante de pago
    if (!appointment.paymentReceipt) {
      throw new BadRequestException(
        'No se puede completar la cita sin comprobante de pago',
      );
    }

    // Actualizar solo el estado
    appointment.status = 'completed';
    appointment.lastModified = new Date();

    return this.appointmentsRepository.save(appointment);
  }

  async remove(id: number, currentUser?: any): Promise<void> {
    const appointment = await this.findOne(id);

    if ('deletedBy' in appointment) {
      await this.appointmentsRepository.update(id, {
        deletedBy: currentUser ? String(currentUser.id) : 'system',
      });
    }

    const result = await this.appointmentsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
  }

  async restore(id: number): Promise<void> {
    const result = await this.appointmentsRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
  }

  async findByFilters(filters: {doctorId?: number;patientId?: number;clinicId?: number;date?: string;status?: string;}): Promise<Appointment[]> 
  {
    const query = this.appointmentsRepository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('appointment.clinic', 'clinic')
      .where('appointment.deletedAt IS NULL');
    
    if (filters.doctorId) {
      query.andWhere('doctor.id = :doctorId', { doctorId: filters.doctorId });
    }
    if (filters.patientId) {
      query.andWhere('patient.id = :patientId', { patientId: filters.patientId });
    }
    if (filters.clinicId) {
      query.andWhere('clinic.id = :clinicId', { clinicId: filters.clinicId });
    }
    if (filters.date) {
      query.andWhere('appointment.appointmentDate = :date', { date: filters.date });
    }
    if (filters.status) {
      query.andWhere('appointment.status = :status', { status: filters.status });
    }
    
    return query.getMany();
  }

  
}
