import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentReceipt } from './entity/paymentReceipt.entity';
import { Appointment } from 'src/appointment/entity/appointment.entity';
import { AppointmentModule } from 'src/appointment/appointment.module';
import { PaymentReceiptsService } from './paymentreceipt.service';
import { PaymentReceiptsController } from './paymentreceipt.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentReceipt, Appointment]),
    AppointmentModule,
  ],
  controllers: [PaymentReceiptsController],
  providers: [PaymentReceiptsService],
  exports: [PaymentReceiptsService],
})
export class PaymentReceiptModule {}
