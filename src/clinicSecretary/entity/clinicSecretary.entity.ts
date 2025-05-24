import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Clinic } from '../../clinic/entity/clinic.entity';

@Entity('clinic_secretaries')
export class ClinicSecretary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clinicId: number;

  @Column()
  secretaryId: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.clinicSecretaries)
  @JoinColumn({ name: 'secretaryId' })
  secretary: User;

  @ManyToOne(() => Clinic, (clinic) => clinic.secretaryClinics)
  @JoinColumn({ name: 'clinicId' })
  clinic: Clinic;
}
