import { DoctorsController } from './doctor.controller';
import { DoctorsService } from './doctor.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorModule {}
