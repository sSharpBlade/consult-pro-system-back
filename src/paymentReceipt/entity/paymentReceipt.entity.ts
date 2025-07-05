import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Appointment } from 'src/appointment/entity/appointment.entity';
import { encryptionTransformer } from 'src/common/transformers/encryption.transformer';

@Entity()
export class PaymentReceipt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: encryptionTransformer,
  })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paymentDate: Date;

  @Column({ length: 50, transformer: encryptionTransformer })
  method: string;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @ManyToOne(() => Appointment, (appointment) => appointment.paymentReceipt)
  appointment: Appointment;

  @Column({
    name: 'created_by',
    nullable: true,
  })
  createdBy: string;

  @Column({
    name: 'last_modified',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  lastModified: Date;

  @Column({
    name: 'deleted_by',
    nullable: true,
  })
  deletedBy: string;
}
