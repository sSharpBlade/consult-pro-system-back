/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ClinicPaymentsController } from './clinicpayment.controller';
import { ClinicPaymentsService } from './clinicpayment.service';

@Module({
  imports: [],
  controllers: [ClinicPaymentsController],
  providers: [ClinicPaymentsService],
})
export class ClinicPaymentModule {}
