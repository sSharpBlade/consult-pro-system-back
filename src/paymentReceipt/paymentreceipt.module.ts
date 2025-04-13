/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { PaymentReceiptsController } from './paymentreceipt.controller';
import { PaymentReceiptsService } from './paymentreceipt.service';

@Module({
  imports: [],
  controllers: [PaymentReceiptsController],
  providers: [PaymentReceiptsService],
})
export class PaymentReceiptModule {}
