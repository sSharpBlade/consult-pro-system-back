import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Doctor } from '../../doctor/entity/doctor.entity';
import { SecretaryDoctor } from 'src/secretaryDoctor/entity/secretaryDoctor.entity';

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

  @Column({
    name: 'created_by',
    nullable: true  
  })
  createdBy: string;

  @Column({
    name: 'last_modified',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  lastModified: Date;

  @Column({
    name: 'deleted_by',
    nullable: true  
  })
  deletedBy: string;

  @ManyToMany(() => Doctor, (doctor) => doctor.secretaryDoctors)
  doctors: Doctor[];

  @OneToMany(
    () => SecretaryDoctor,
    (secretaryDoctor) => secretaryDoctor.secretary,
  )
  secretaryDoctors: SecretaryDoctor[];
}
