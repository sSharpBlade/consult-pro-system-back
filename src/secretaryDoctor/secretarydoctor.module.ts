import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecretaryDoctor } from './entity/secretaryDoctor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SecretaryDoctor])],
  exports: [TypeOrmModule], // Exporta el repositorio
})
export class SecretaryDoctorModule {}
