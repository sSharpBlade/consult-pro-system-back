import { ClinicsController } from './clinic.controller';
import { ClinicsService } from './clinic.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ClinicsController],
  providers: [ClinicsService],
})
export class ClinicModule {}
