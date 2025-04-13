import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentModule } from './appointment/appointment.module';
import { ClinicModule } from './clinic/clinic.module';
import { ClinicPaymentModule } from './clinicPayment/clinicpayment.module';
import { DoctorModule } from './doctor/doctor.module';
import { PaymentReceiptModule } from './paymentReceipt/paymentreceipt.module';
import { PlanModule } from './plan/plan.module';
import { PrescriptionModule } from './prescription/prescription.module';
import { SecretaryModule } from './secretary/secretary.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.MAIN_DB_HOST,
      port: Number(process.env.MAIN_DB_PORT),
      username: process.env.MAIN_DB_USER,
      password: process.env.MAIN_DB_PASSWORD,
      database: process.env.MAIN_DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),

    AppointmentModule,
    ClinicModule,
    ClinicPaymentModule,
    DoctorModule,
    PaymentReceiptModule,
    PlanModule,
    PrescriptionModule,
    SecretaryModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
