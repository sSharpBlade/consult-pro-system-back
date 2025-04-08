import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Suscripcion } from './suscripcion.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id_cliente: number;

  @Column()
  nombre_clinica: string;

  @Column()
  correo: string;

  @Column()
  telefono: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_registro: Date;

  @Column({ default: true })
  estado: boolean;

  @Column()
  db_host: string;

  @Column()
  db_usuario: string;

  @Column()
  db_password: string;

  @Column()
  db_nombre: string;

  @OneToMany(() => Suscripcion, (s) => s.cliente)
  suscripciones: Suscripcion[];
}
