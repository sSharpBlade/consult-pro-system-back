import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entity/doctor.entity';
import { SecretaryDoctor } from '../secretaryDoctor/entity/secretaryDoctor.entity';
import { User } from '../user/entity/user.entity';
import { Clinic } from '../clinic/entity/clinic.entity';
import { Appointment } from '../appointment/entity/appointment.entity';
import { DoctorsController } from './doctor.controller';
import { DoctorsService } from './doctor.service';
import { UserModule } from '../user/user.module';
import { ClinicModule } from '../clinic/clinic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Doctor,
      SecretaryDoctor,
      User,
      Clinic,
      Appointment,
    ]),
    UserModule,
    ClinicModule,
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorModule {}
