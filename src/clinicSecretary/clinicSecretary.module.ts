import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicSecretary } from './entity/clinicSecretary.entity';
import { ClinicSecretaryService } from './clinicSecretary.service';
import { User } from '../user/entity/user.entity';
import { Clinic } from '../clinic/entity/clinic.entity';
import { ClinicSecretaryController } from './clinicSecretary.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicSecretary, User, Clinic])],
  providers: [ClinicSecretaryService],
  controllers: [ClinicSecretaryController],
  exports: [TypeOrmModule, ClinicSecretaryService],
})
export class ClinicSecretaryModule {}
