import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entity/doctor.entity';
import { ClinicSecretary } from '../clinicSecretary/entity/clinicSecretary.entity';
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
      ClinicSecretary,
      User,
      Clinic,
      Appointment,
    ]),
    forwardRef(() => UserModule), // <-- Usar forwardRef
    forwardRef(() => ClinicModule), // <-- Usar forwardRef si ClinicModule también depende de DoctorModule
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService, TypeOrmModule],
})
export class DoctorModule {}
