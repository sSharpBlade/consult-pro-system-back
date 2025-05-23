import {Entity,PrimaryGeneratedColumn,Column,DeleteDateColumn,ManyToOne,OneToMany,OneToOne,JoinColumn,} from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Clinic } from 'src/clinic/entity/clinic.entity';
import { Appointment } from 'src/appointment/entity/appointment.entity';
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


  @OneToMany(() => Prescription, (prescription) => prescription.doctor)
  prescriptions: Prescription[];

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
