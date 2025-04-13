import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Clinic } from 'src/clinic/entity/clinic.entity';

@Entity()
export class ClinicPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paymentDate: Date;

  @Column({ length: 20, default: 'paid' })
  status: 'paid' | 'pending' | 'failed';

  @Column({ type: 'date' })
  startPeriod: Date;

  @Column({ type: 'date' })
  endPeriod: Date;

  @Column({ length: 50 })
  method: string;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @ManyToOne(() => Clinic, (clinic) => clinic.payments)
  clinic: Clinic;
}
