import { PlansController } from './plan.controller';
import { PlansService } from './plan.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlanModule {}
