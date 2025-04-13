import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Clinic } from '../../clinic/entity/clinic.entity';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column()
  maxDoctors: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @OneToMany(() => Clinic, (clinic) => clinic.plan)
  clinics: Clinic[];
}
