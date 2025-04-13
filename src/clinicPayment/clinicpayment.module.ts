import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicPayment } from './entity/clinicPayment.entity';
import { Clinic } from '../clinic/entity/clinic.entity';
import { ClinicModule } from '../clinic/clinic.module';
import { ClinicPaymentsController } from './clinicpayment.controller';
import { ClinicPaymentsService } from './clinicpayment.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicPayment, Clinic]), ClinicModule],
  controllers: [ClinicPaymentsController],
  providers: [ClinicPaymentsService],
  exports: [ClinicPaymentsService],
})
export class ClinicPaymentModule {}
