import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Clinic } from 'src/clinic/entity/clinic.entity';
import { Appointment } from 'src/appointment/entity/appointment.entity';
import { SecretaryDoctor } from 'src/secretaryDoctor/entity/secretaryDoctor.entity';
import { Prescription } from 'src/prescription/entity/prescription.entity';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  specialization: string;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Clinic, (clinic) => clinic.doctors)
  clinic: Clinic;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @OneToMany(() => SecretaryDoctor, (secretaryDoctor) => secretaryDoctor.doctor)
  secretaryDoctors: SecretaryDoctor[];

  @OneToMany(() => Prescription, (prescription) => prescription.doctor)
  prescriptions: Prescription[];
}
