import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Plan } from '../../plan/entity/plan.entity';
import { Doctor } from 'src/doctor/entity/doctor.entity';
import { Appointment } from 'src/appointment/entity/appointment.entity';
import { ClinicPayment } from 'src/clinicPayment/entity/clinicPayment.entity';
import { Secretary } from 'src/secretary/entity/secretary.entity';
import { ClinicSecretary } from 'src/clinicSecretary/entity/clinicSecretary.entity';

@Entity()
export class Clinic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column('text')
  address: string;

  @Column('double precision')
  lat: number;

  @Column('double precision')
  lng: number;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('text')
  openingDays: string;

  @Column({ type: 'time' })
  openingTime: string;

  @Column({ type: 'time' })
  closingTime: string;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @ManyToOne(() => Plan, (plan) => plan.clinics)
  plan: Plan;

  @OneToMany(() => Doctor, (doctor) => doctor.clinic)
  doctors: Doctor[];

  @OneToMany(() => Appointment, (appointment) => appointment.clinic)
  appointments: Appointment[];

  @OneToMany(() => ClinicPayment, (clinicPayment) => clinicPayment.clinic)
  payments: ClinicPayment[];

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

  @ManyToMany(() => Secretary, (secretary) => secretary.clinics)
  secretaries: Secretary[];

  @OneToMany(() => ClinicSecretary, (clinicSecretary) => clinicSecretary.clinic)
  secretaryClinics: ClinicSecretary[];
}
