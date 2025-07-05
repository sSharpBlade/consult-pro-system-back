import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Clinic } from '../../clinic/entity/clinic.entity';
import { ClinicSecretary } from '../../clinicSecretary/entity/clinicSecretary.entity';
import { encryptionTransformer } from 'src/common/transformers/encryption.transformer';

@Entity('secretaries')
export class Secretary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ transformer: encryptionTransformer })
  name: string;

  @Column({ transformer: encryptionTransformer })
  phone: string;

  @Column({ transformer: encryptionTransformer })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  created_at: Date;

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

  @ManyToMany(() => Clinic, (clinic) => clinic.secretaryClinics)
  clinics: Clinic[];

  @OneToMany(
    () => ClinicSecretary,
    (clinicSecretary) => clinicSecretary.secretary,
  )
  clinicSecretaries: ClinicSecretary[];
}
