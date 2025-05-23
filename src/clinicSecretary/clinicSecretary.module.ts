import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicSecretary } from './entity/clinicSecretary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicSecretary])],
  exports: [TypeOrmModule],
})
export class ClinicSecretaryModule {}
