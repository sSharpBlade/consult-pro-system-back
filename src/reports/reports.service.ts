import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { Appointment } from '../appointment/entity/appointment.entity';
import { Clinic } from '../clinic/entity/clinic.entity';
import { Doctor } from '../doctor/entity/doctor.entity';
import { ClinicPayment } from '../clinicPayment/entity/clinicPayment.entity';
import { Secretary } from '../secretary/entity/secretary.entity';
import { ClinicSecretary } from '../clinicSecretary/entity/clinicSecretary.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Clinic)
    private readonly clinicRepo: Repository<Clinic>,
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
    @InjectRepository(Secretary)
    private readonly secretaryRepo: Repository<Secretary>,
    @InjectRepository(ClinicPayment)
    private readonly clinicPaymentRepo: Repository<ClinicPayment>,
    @InjectRepository(ClinicSecretary)
    private readonly clinicSecretaryRepo: Repository<ClinicSecretary>,
  ) {}

  async getUsersReport() {
    const [total, activos, inactivos, porRolArr, ultimos, modificados] =
      await Promise.all([
        this.userRepo.count({ where: { deletedAt: IsNull() } }),
        this.userRepo.count({ where: { deletedAt: IsNull() } }),
        this.userRepo.count({ where: { deletedAt: Not(IsNull()) } }),
        this.userRepo
          .createQueryBuilder('user')
          .select('userRole.name', 'role')
          .addSelect('COUNT(user.id)', 'count')
          .leftJoin('user.userRole', 'userRole')
          .where('user.deletedAt IS NULL')
          .groupBy('userRole.name')
          .getRawMany(),
        this.userRepo.find({
          where: { deletedAt: IsNull() },
          order: { createdAt: 'DESC' },
          take: 5,
          relations: ['userRole'],
        }),
        this.userRepo.find({
          where: { deletedAt: IsNull() },
          order: { lastModified: 'DESC' },
          take: 5,
          relations: ['userRole'],
        }),
      ]);
    const porRol: Record<string, number> = {};
    (porRolArr as { role: string; count: string }[]).forEach((r) => {
      porRol[String(r.role)] = Number(r.count);
    });
    return { total, porRol, activos, inactivos, ultimos, modificados };
  }

  async getAppointmentsReport() {
    const [total, porEstadoArr, porFechaArr, ultimas, proximas] =
      await Promise.all([
        this.appointmentRepo.count({ where: { deletedAt: IsNull() } }),
        this.appointmentRepo
          .createQueryBuilder('appointment')
          .select('appointment.status', 'status')
          .addSelect('COUNT(appointment.id)', 'count')
          .where('appointment.deletedAt IS NULL')
          .groupBy('appointment.status')
          .getRawMany(),
        this.appointmentRepo
          .createQueryBuilder('appointment')
          .select('appointment.appointmentDate', 'date')
          .addSelect('COUNT(appointment.id)', 'count')
          .where('appointment.deletedAt IS NULL')
          .andWhere('appointment.appointmentDate >= :date', {
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          })
          .groupBy('appointment.appointmentDate')
          .orderBy('appointment.appointmentDate', 'ASC')
          .getRawMany(),
        this.appointmentRepo.find({
          where: { deletedAt: IsNull() },
          order: { createdAt: 'DESC' },
          take: 5,
          relations: ['patient', 'clinic', 'doctor'],
        }),
        this.appointmentRepo.find({
          where: { deletedAt: IsNull(), appointmentDate: Not(IsNull()) },
          order: { appointmentDate: 'ASC' },
          take: 5,
          relations: ['patient', 'clinic', 'doctor'],
        }),
      ]);
    const porEstado: Record<string, number> = {};
    (porEstadoArr as { status: string; count: string }[]).forEach((r) => {
      porEstado[String(r.status)] = Number(r.count);
    });
    const porFecha: Record<string, number> = {};
    (porFechaArr as { date: string; count: string }[]).forEach((r) => {
      porFecha[String(r.date)] = Number(r.count);
    });
    return { total, porEstado, porFecha, ultimas, proximas };
  }

  async getClinicsReport() {
    const [total, activas, inactivas, ultimas] = await Promise.all([
      this.clinicRepo.count({ where: { deletedAt: IsNull() } }),
      this.clinicRepo.count({ where: { deletedAt: IsNull(), active: true } }),
      this.clinicRepo.count({ where: { deletedAt: IsNull(), active: false } }),
      this.clinicRepo.find({
        where: { deletedAt: IsNull() },
        order: { createdAt: 'DESC' },
        take: 5,
      }),
    ]);
    return { total, activas, inactivas, ultimas };
  }

  async getDoctorsSecretariesReport() {
    const [
      doctoresTotal,
      doctoresActivos,
      secretariasTotal,
      secretariasActivas,
      asignaciones,
      ultimosDoctores,
      ultimasSecretarias,
    ] = await Promise.all([
      this.doctorRepo.count({ where: { deletedAt: IsNull() } }),
      this.doctorRepo.count({ where: { deletedAt: IsNull() } }),
      this.secretaryRepo.count(),
      this.secretaryRepo.count({ where: { isActive: true } }),
      this.clinicSecretaryRepo.count({ where: { isActive: true } }),
      this.doctorRepo.find({
        where: { deletedAt: IsNull() },
        order: { lastModified: 'DESC' },
        take: 5,
      }),
      this.secretaryRepo.find({
        order: { created_at: 'DESC' },
        take: 5,
      }),
    ]);
    return {
      doctores: {
        total: doctoresTotal,
        activos: doctoresActivos,
        ultimos: ultimosDoctores,
      },
      secretarias: {
        total: secretariasTotal,
        activas: secretariasActivas,
        ultimas: ultimasSecretarias,
      },
      asignaciones,
    };
  }

  async getFinancesReport() {
    const [pagos, ultimosPagos] = await Promise.all([
      this.clinicPaymentRepo.find({
        where: { deletedAt: IsNull() },
        relations: ['clinic'],
      }),
      this.clinicPaymentRepo.find({
        where: { deletedAt: IsNull() },
        order: { paymentDate: 'DESC' },
        take: 5,
        relations: ['clinic'],
      }),
    ]);
    let totalPagos = 0;
    const pagosPorClinica: Record<string, number> = {};
    pagos.forEach((p) => {
      totalPagos += Number(p.amount);
      const clinica = p.clinic?.name || 'Sin clínica';
      pagosPorClinica[clinica] =
        (pagosPorClinica[clinica] || 0) + Number(p.amount);
    });
    return { totalPagos, pagosPorClinica, ultimosPagos };
  }
}
