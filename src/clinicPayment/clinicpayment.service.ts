import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ClinicPayment } from './entity/clinicPayment.entity';
import { CreateClinicPaymentDto } from './dto/create-clinicPayment.dto';
import { UpdateClinicPaymentDto } from './dto/update-clinicPayment.dto';
import { Clinic } from '../clinic/entity/clinic.entity';

@Injectable()
export class ClinicPaymentsService {
  constructor(
    @InjectRepository(ClinicPayment)
    private clinicPaymentsRepository: Repository<ClinicPayment>,
    @InjectRepository(Clinic)
    private clinicsRepository: Repository<Clinic>,
  ) {}

  async create(createDto: CreateClinicPaymentDto): Promise<ClinicPayment> {
    const clinic = await this.clinicsRepository.findOne({
      where: { id: createDto.clinicId, deletedAt: IsNull() },
    });

    if (!clinic) {
      throw new NotFoundException(
        `Clinic with ID ${createDto.clinicId} not found`,
      );
    }

    // Validar que las fechas del período sean correctas
    if (new Date(createDto.startPeriod) >= new Date(createDto.endPeriod)) {
      throw new BadRequestException('Start period must be before end period');
    }

    const payment = this.clinicPaymentsRepository.create({
      amount: createDto.amount,
      status: createDto.status as ClinicPayment['status'],
      startPeriod: createDto.startPeriod,
      endPeriod: createDto.endPeriod,
      method: createDto.method,
      clinic,
    });

    return this.clinicPaymentsRepository.save(payment);
  }

  async findAll(): Promise<ClinicPayment[]> {
    return this.clinicPaymentsRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['clinic'],
    });
  }

  async findByClinic(clinicId: number): Promise<ClinicPayment[]> {
    return this.clinicPaymentsRepository.find({
      where: { clinic: { id: clinicId }, deletedAt: IsNull() },
      order: { startPeriod: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ClinicPayment> {
    const payment = await this.clinicPaymentsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['clinic'],
    });

    if (!payment) {
      throw new NotFoundException(`Clinic payment with ID ${id} not found`);
    }

    return payment;
  }

  async update(
    id: number,
    updateDto: UpdateClinicPaymentDto,
  ): Promise<ClinicPayment> {
    const payment = await this.findOne(id);

    if (updateDto.clinicId) {
      const clinic = await this.clinicsRepository.findOne({
        where: { id: updateDto.clinicId, deletedAt: IsNull() },
      });
      if (!clinic) {
        throw new NotFoundException(
          `Clinic with ID ${updateDto.clinicId} not found`,
        );
      }
      payment.clinic = clinic;
    }

    const updatedPayment = this.clinicPaymentsRepository.merge(payment, {
      ...updateDto,
      status: updateDto.status as ClinicPayment['status'],
    });
    return this.clinicPaymentsRepository.save(updatedPayment);
  }

  async remove(id: number): Promise<void> {
    const result = await this.clinicPaymentsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Clinic payment with ID ${id} not found`);
    }
  }

  async restore(id: number): Promise<void> {
    const result = await this.clinicPaymentsRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Clinic payment with ID ${id} not found`);
    }
  }
}
