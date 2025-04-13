import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Appointment } from 'src/appointment/entity/appointment.entity';

@Entity()
export class PaymentReceipt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paymentDate: Date;

  @Column({ length: 50 })
  method: string;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @ManyToOne(() => Appointment, (appointment) => appointment.paymentReceipt)
  appointment: Appointment;
}
