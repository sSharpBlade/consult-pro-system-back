import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Doctor } from '../doctor/entity/doctor.entity';
import { Appointment } from '../appointment/entity/appointment.entity';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { DoctorModule } from '../doctor/doctor.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Doctor, Appointment]),
    forwardRef(() => DoctorModule),
    RolesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
