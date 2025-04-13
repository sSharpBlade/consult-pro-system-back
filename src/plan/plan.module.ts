import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entity/plan.entity';
import { Clinic } from '../clinic/entity/clinic.entity';
import { PlansController } from './plan.controller';
import { PlansService } from './plan.service';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, Clinic])],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService],
})
export class PlanModule {}
