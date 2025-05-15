/* eslint-disable prettier/prettier */
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

  async create(
    createDto: CreatePaymentReceiptDto,
    currentUser?: any,
  ): Promise<PaymentReceipt> {
    const queryRunner = this.paymentReceiptsRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar y obtener la cita
      const appointment = await queryRunner.manager.findOne(Appointment, {
        where: { id: createDto.appointmentId, deletedAt: IsNull() },
      });

      if (!appointment) {
        throw new NotFoundException(
          `Cita con ID ${createDto.appointmentId} no encontrada`,
        );
      }

      // Verificar que no exista ya un comprobante
      const existingReceipt = await queryRunner.manager.findOne(PaymentReceipt, {
        where: { appointment: { id: appointment.id }, deletedAt: IsNull() },
      });

      if (existingReceipt) {
        throw new ConflictException(
          `La cita ya tiene un comprobante de pago (ID: ${existingReceipt.id})`,
        );
      }

      // Crear el comprobante
      const paymentReceipt = this.paymentReceiptsRepository.create({
        amount: createDto.amount,
        method: createDto.method,
        appointment,
        createdBy: currentUser ? String(currentUser.id) : 'system',
      });

      const savedReceipt = await queryRunner.manager.save(paymentReceipt);
      await queryRunner.commitTransaction();

      return savedReceipt;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
    currentUser?: any,
  ): Promise<PaymentReceipt> {
    const paymentReceipt = await this.findOne(id);

    // lastModified se actualiza automáticamente por la configuración en la entidad
    const updated = this.paymentReceiptsRepository.merge(
      paymentReceipt,
      updateDto,
    );

    return this.paymentReceiptsRepository.save(updated);
  }

  async remove(id: number, currentUser?: any): Promise<void> {
    const paymentReceipt = await this.findOne(id);

    // Actualización de auditoría antes del soft delete
    if ('deletedBy' in paymentReceipt) {
      await this.paymentReceiptsRepository.update(id, {
        deletedBy: currentUser ? String(currentUser.id) : 'system',
      });
    }

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
