import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { SecretaryDoctor } from '../secretaryDoctor/entity/secretaryDoctor.entity';
import { SecretaryController } from './secretary.controller';
import { SecretaryService } from './secretary.service';
import { UserModule } from '../user/user.module';
import { DoctorModule } from '../doctor/doctor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SecretaryDoctor]),
    UserModule,
    DoctorModule,
  ],
  controllers: [SecretaryController],
  providers: [SecretaryService],
  exports: [SecretaryService],
})
export class SecretaryModule {}
