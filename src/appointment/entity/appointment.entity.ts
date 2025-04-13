import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Doctor } from 'src/doctor/entity/doctor.entity';
import { Clinic } from 'src/clinic/entity/clinic.entity';
import { Prescription } from 'src/prescription/entity/prescription.entity';
import { PaymentReceipt } from 'src/paymentReceipt/entity/paymentReceipt.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  appointmentDate: Date;

  @Column({ type: 'time' })
  appointmentTime: string;

  @Column({ length: 20, default: 'pending' })
  status: 'pending' | 'completed' | 'cancelled';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.appointments)
  patient: User;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
  doctor: Doctor;

  @ManyToOne(() => Clinic, (clinic) => clinic.appointments)
  clinic: Clinic;

  @OneToOne(() => Prescription, (prescription) => prescription.appointment)
  prescription: Prescription;

  @OneToOne(
    () => PaymentReceipt,
    (paymentReceipt) => paymentReceipt.appointment,
  )
  paymentReceipt: PaymentReceipt;
}
