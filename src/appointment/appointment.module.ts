import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entity/appointment.entity';
import { User } from '../user/entity/user.entity';
import { Doctor } from '../doctor/entity/doctor.entity';
import { Clinic } from '../clinic/entity/clinic.entity';
import { Prescription } from '../prescription/entity/prescription.entity';
import { PaymentReceipt } from '../paymentReceipt/entity/paymentReceipt.entity';
import { AppointmentsController } from './appointment.controller';
import { AppointmentsService } from './appointment.service';
import { UserModule } from '../user/user.module';
import { DoctorModule } from '../doctor/doctor.module';
import { ClinicModule } from '../clinic/clinic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      User,
      Doctor,
      Clinic,
      Prescription,
      PaymentReceipt,
    ]),
    UserModule,
    DoctorModule,
    ClinicModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentModule {}
