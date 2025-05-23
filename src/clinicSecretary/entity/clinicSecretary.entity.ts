import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn,CreateDateColumn} from 'typeorm';
import { Secretary } from '../../secretary/entity/secretary.entity';
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

  @ManyToOne(() => Secretary, (secretary) => secretary.clinicSecretaries)
  @JoinColumn({ name: 'secretaryId' })
  secretary: Secretary;

  @ManyToOne(() => Clinic, (clinic) => clinic.secretaryClinics)
  @JoinColumn({ name: 'clinicId' })
  clinic: Clinic;
}