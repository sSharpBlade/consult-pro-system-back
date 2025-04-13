import {
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Doctor } from '../../doctor/entity/doctor.entity';
import { Secretary } from 'src/secretary/entity/secretary.entity';

@Entity()
export class SecretaryDoctor {
  @PrimaryGeneratedColumn()
  id: number;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.secretaryDoctors)
  doctor: Doctor;

  @ManyToOne(() => Secretary, (secretary) => secretary.doctors)
  secretary: Secretary;
}
