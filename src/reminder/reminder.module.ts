import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/appointment/entity/appointment.entity';
import { PushNotificationsModule } from 'src/push-notifications/push-notifications.module';

@Module({
    imports: [TypeOrmModule.forFeature([Appointment]), PushNotificationsModule],
    providers: [ReminderService],
    exports: [ReminderService],
})
export class ReminderModule { }
