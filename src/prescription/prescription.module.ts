import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescription } from './entity/prescription.entity';
import { Appointment } from '../appointment/entity/appointment.entity';
import { Doctor } from '../doctor/entity/doctor.entity';
import { PrescriptionsController } from './prescription.controller';
import { PrescriptionsService } from './prescription.service';
import { AppointmentModule } from '../appointment/appointment.module';
import { DoctorModule } from '../doctor/doctor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prescription, Appointment, Doctor]),
    AppointmentModule,
    DoctorModule,
  ],
  controllers: [PrescriptionsController],
  providers: [PrescriptionsService],
  exports: [PrescriptionsService],
})
export class PrescriptionModule {}
