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

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @Column({
    name: 'deleted_by',
    nullable: true  
  })
  deletedBy: string;

  @OneToMany(() => Clinic, (clinic) => clinic.plan)
  clinics: Clinic[];
}
