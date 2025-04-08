import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Suscripcion } from './suscripcion.entity';

@Entity('planes')
export class Plan {
  @PrimaryGeneratedColumn()
  id_plan: number;

  @Column()
  nombre: string;

  @Column()
  limiteProfesionales: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio_mensual: number;

  @Column({ default: true })
  estado: boolean;

  @OneToMany(() => Suscripcion, (s) => s.plan)
  suscripciones: Suscripcion[];
}
