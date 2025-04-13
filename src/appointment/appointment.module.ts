import { AppointmentsController } from './appointment.controller';
import { AppointmentsService } from './appointment.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentModule {}
