import { PrescriptionsController } from './prescription.controller';
import { PrescriptionsService } from './prescription.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [PrescriptionsController],
  providers: [PrescriptionsService],
})
export class PrescriptionModule {}
