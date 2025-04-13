import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clinic } from './entity/clinic.entity';
import { Plan } from '../plan/entity/plan.entity';
import { Doctor } from '../doctor/entity/doctor.entity';
import { ClinicPayment } from '../clinicPayment/entity/clinicPayment.entity';
import { ClinicsController } from './clinic.controller';
import { ClinicsService } from './clinic.service';
import { PlanModule } from '../plan/plan.module';
import { DoctorModule } from '../doctor/doctor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Clinic, Plan, Doctor, ClinicPayment]),
    PlanModule,
    DoctorModule,
  ],
  controllers: [ClinicsController],
  providers: [ClinicsService],
  exports: [ClinicsService],
})
export class ClinicModule {}
