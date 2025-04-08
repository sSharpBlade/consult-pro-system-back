import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';
import { Plan } from '../entities/plan.entity';
import { Suscripcion } from '../entities/suscripcion.entity';

@Injectable()
export class MainService {
  constructor(
    @InjectRepository(Cliente) private clienteRepo: Repository<Cliente>,
    @InjectRepository(Plan) private planRepo: Repository<Plan>,
    @InjectRepository(Suscripcion)
    private suscripcionRepo: Repository<Suscripcion>,
  ) {}

  // CLIENTES
  createCliente(dto: Partial<Cliente>) {
    const cliente = this.clienteRepo.create(dto);
    return this.clienteRepo.save(cliente);
  }

  findAllClientes() {
    return this.clienteRepo.find();
  }

  findClienteById(id_cliente: number) {
    return this.clienteRepo.findOneBy({ id_cliente: id_cliente });
  }

  updateCliente(id: number, dto: Partial<Cliente>) {
    return this.clienteRepo.update(id, dto);
  }

  deleteCliente(id_cliente: number) {
    return this.clienteRepo.delete(id_cliente);
  }

  // PLANES
  createPlan(dto: Partial<Plan>) {
    const plan = this.planRepo.create(dto);
    return this.planRepo.save(plan);
  }

  findAllPlanes() {
    return this.planRepo.find();
  }

  findPlanById(id_plan: number) {
    return this.planRepo.findOneBy({ id_plan: id_plan });
  }

  updatePlan(id_plan: number, dto: Partial<Plan>) {
    return this.planRepo.update(id_plan, dto);
  }

  deletePlan(id_plan: number) {
    return this.planRepo.delete(id_plan);
  }

  // SUSCRIPCIONES
  async createSuscripcion(dto: Partial<Suscripcion>) {
    const cliente = await this.clienteRepo.findOneBy({
      id_cliente: dto.id_cliente,
    });
    const plan = await this.planRepo.findOneBy({ id_plan: dto.id_plan });

    if (!cliente || !plan)
      throw new NotFoundException('Cliente o Plan no encontrado');

    const suscripcion = this.suscripcionRepo.create({
      cliente,
      plan,
      fecha_inicio: dto.fecha_inicio,
    });
    return this.suscripcionRepo.save(suscripcion);
  }

  findAllSuscripciones() {
    return this.suscripcionRepo.find({ relations: ['cliente', 'plan'] });
  }

  findSuscripcionById(id_suscripcion: number) {
    return this.suscripcionRepo.findOne({
      where: { id_suscripcion: id_suscripcion },
      relations: ['cliente', 'plan'],
    });
  }

  async updateSuscripcion(id_suscripcion: number, dto: Partial<Suscripcion>) {
    const suscripcion = await this.suscripcionRepo.findOneBy({
      id_suscripcion: id_suscripcion,
    });
    if (!suscripcion) throw new NotFoundException('Suscripción no encontrada');

    if (dto.id_cliente) {
      const cliente = await this.clienteRepo.findOneBy({
        id_cliente: dto.id_cliente,
      });
      if (!cliente) throw new NotFoundException('Cliente no encontrado');
      suscripcion.cliente = cliente;
    }

    if (dto.id_plan) {
      const plan = await this.planRepo.findOneBy({ id_plan: dto.id_plan });
      if (!plan) throw new NotFoundException('Plan no encontrado');
      suscripcion.plan = plan;
    }

    if (dto.fecha_inicio) suscripcion.fecha_inicio = new Date(dto.fecha_inicio);

    return this.suscripcionRepo.save(suscripcion);
  }

  deleteSuscripcion(id_suscripcion: number) {
    return this.suscripcionRepo.delete(id_suscripcion);
  }
}
