import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { PaymentReceipt } from './entity/paymentReceipt.entity';
import { CreatePaymentReceiptDto } from './dto/create-paymentReceipt.dto';
import { UpdatePaymentReceiptDto } from './dto/update-paymentReceipt.dto';
import { Appointment } from 'src/appointment/entity/appointment.entity';

@Injectable()
export class PaymentReceiptsService {
  constructor(
    @InjectRepository(PaymentReceipt)
    private paymentReceiptsRepository: Repository<PaymentReceipt>,
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
  ) {}

  async create(createDto: CreatePaymentReceiptDto): Promise<PaymentReceipt> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id: createDto.appointmentId, deletedAt: IsNull() },
    });

    if (!appointment) {
      throw new NotFoundException(
        `Appointment with ID ${createDto.appointmentId} not found`,
      );
    }

    // Verificar si ya existe un comprobante para esta cita
    const existing = await this.paymentReceiptsRepository.findOne({
      where: { appointment: { id: appointment.id }, deletedAt: IsNull() },
    });

    if (existing) {
      throw new ConflictException(
        `Appointment already has a payment receipt (ID: ${existing.id})`,
      );
    }

    const paymentReceipt = this.paymentReceiptsRepository.create({
      amount: createDto.amount,
      method: createDto.method,
      appointment,
    });

    return this.paymentReceiptsRepository.save(paymentReceipt);
  }

  async findAll(): Promise<PaymentReceipt[]> {
    return this.paymentReceiptsRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['appointment'],
    });
  }

  async findByAppointment(appointmentId: number): Promise<PaymentReceipt[]> {
    return this.paymentReceiptsRepository.find({
      where: { appointment: { id: appointmentId }, deletedAt: IsNull() },
    });
  }

  async findOne(id: number): Promise<PaymentReceipt> {
    const paymentReceipt = await this.paymentReceiptsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['appointment'],
    });

    if (!paymentReceipt) {
      throw new NotFoundException(`Payment receipt with ID ${id} not found`);
    }

    return paymentReceipt;
  }

  async update(
    id: number,
    updateDto: UpdatePaymentReceiptDto,
  ): Promise<PaymentReceipt> {
    const paymentReceipt = await this.findOne(id);
    const updated = this.paymentReceiptsRepository.merge(
      paymentReceipt,
      updateDto,
    );
    return this.paymentReceiptsRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const result = await this.paymentReceiptsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Payment receipt with ID ${id} not found`);
    }
  }

  async restore(id: number): Promise<void> {
    const result = await this.paymentReceiptsRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Payment receipt with ID ${id} not found`);
    }
  }
}
