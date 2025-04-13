import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Appointment } from 'src/appointment/entity/appointment.entity';
import { Doctor } from 'src/doctor/entity/doctor.entity';

@Entity()
export class Prescription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  document: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @ManyToOne(() => Appointment, (appointment) => appointment.prescription)
  appointment: Appointment;

  @ManyToOne(() => Doctor, (doctor) => doctor.prescriptions)
  doctor: Doctor;
}
