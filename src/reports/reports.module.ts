import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { UserModule } from '../user/user.module';
import { AppointmentModule } from '../appointment/appointment.module';
import { ClinicModule } from '../clinic/clinic.module';
import { DoctorModule } from '../doctor/doctor.module';
import { SecretaryModule } from '../secretary/secretary.module';
import { ClinicPaymentModule } from '../clinicPayment/clinicpayment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Appointment } from '../appointment/entity/appointment.entity';
import { Clinic } from '../clinic/entity/clinic.entity';
import { Doctor } from '../doctor/entity/doctor.entity';
import { Secretary } from '../secretary/entity/secretary.entity';
import { ClinicPayment } from '../clinicPayment/entity/clinicPayment.entity';
import { ClinicSecretary } from '../clinicSecretary/entity/clinicSecretary.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Appointment,
      Clinic,
      Doctor,
      Secretary,
      ClinicPayment,
      ClinicSecretary,
    ]),
    UserModule,
    AppointmentModule,
    ClinicModule,
    DoctorModule,
    SecretaryModule,
    ClinicPaymentModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
