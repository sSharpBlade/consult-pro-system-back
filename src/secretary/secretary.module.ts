import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecretaryController } from './secretary.controller';
import { SecretaryService } from './secretary.service';
import { UserModule } from '../user/user.module';
import { DoctorModule } from '../doctor/doctor.module';
import { SecretaryDoctorModule } from 'src/secretaryDoctor/secretarydoctor.module';
import { Secretary } from './entity/secretary.entity';

@Module({
  imports: [
    SecretaryDoctorModule,
    TypeOrmModule.forFeature([Secretary]),
    forwardRef(() => UserModule),
    forwardRef(() => DoctorModule),
  ],
  controllers: [SecretaryController],
  providers: [SecretaryService],
  exports: [SecretaryService],
})
export class SecretaryModule {}
