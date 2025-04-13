import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Doctor } from '../../doctor/entity/doctor.entity';

@Entity('secretaries')
export class Secretary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => Doctor, (doctor) => doctor.secretaries)
  doctors: Doctor[];
}
