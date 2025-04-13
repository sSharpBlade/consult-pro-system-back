import {
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Doctor } from '../../doctor/entity/doctor.entity';

@Entity()
export class SecretaryDoctor {
  @PrimaryGeneratedColumn()
  id: number;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.secretaryDoctors)
  secretary: User;

  @ManyToOne(() => Doctor, (doctor) => doctor.secretaryDoctors)
  doctor: Doctor;
}
