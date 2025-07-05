import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Doctor } from 'src/doctor/entity/doctor.entity';
import { Appointment } from 'src/appointment/entity/appointment.entity';
import { ClinicSecretary } from 'src/clinicSecretary/entity/clinicSecretary.entity';
import { Role } from 'src/roles/entity/roles.entity';
import { UserToken } from 'src/push-notifications/entity/userToken.entity';
import { encryptionTransformer } from 'src/common/transformers/encryption.transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10, unique: true, transformer: encryptionTransformer })
  dni: string;

  @Column({ length: 100, nullable: true, transformer: encryptionTransformer })
  name: string;

  @Column({ length: 100, unique: true, transformer: encryptionTransformer })
  email: string;

  @Column({ length: 10, nullable: true, transformer: encryptionTransformer })
  phone: string;

  @Column({ length: 255, nullable: true, transformer: encryptionTransformer })
  address: string;

  @Column({ length: 255, nullable: true })
  image: string;

  @Column({ length: 255, default: 'consultprosystem' })
  password: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'temp_password',
  })
  tempPassword: string | null;

  @ManyToOne(() => Role, (role) => role.users, { eager: true, nullable: false })
  @JoinColumn({ name: 'role_id' })
  userRole: Role;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'temp_password_expires',
  })
  tempPasswordExpires: Date | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @OneToOne(() => Doctor, (doctor) => doctor.user)
  doctor: Doctor;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @OneToMany(
    () => ClinicSecretary,
    (clinicSecretaries) => clinicSecretaries.secretary,
  )
  clinicSecretaries: ClinicSecretary[];

  @OneToMany(() => UserToken, (userToken) => userToken.user)
  user_tokens: UserToken[];

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
