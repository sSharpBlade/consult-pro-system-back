import { Module } from '@nestjs/common';
import { PushNotificationsService } from './push-notifications.service';
import { PushNotificationsController } from './push-notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from './entity/userToken.entity';
import { Appointment } from 'src/appointment/entity/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserToken, Appointment]),],
  controllers: [PushNotificationsController],
  providers: [PushNotificationsService],
  exports: [PushNotificationsService],
})
export class PushNotificationsModule { }
