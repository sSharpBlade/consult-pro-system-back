import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';
import { Appointment } from 'src/appointment/entity/appointment.entity';

@Injectable()
export class ReminderService {
    constructor(
        @InjectRepository(Appointment)
        private readonly appointmentRepository: Repository<Appointment>,
        private readonly pushService: PushNotificationsService,
    ) { }

    @Cron('0 */8 * * *') // Cada 8 horas
    // @Cron('*/1 * * * *') // Cada minuto (para pruebas)
    async sendDailyReminders() {
        const now = new Date();

        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const dayAfter = new Date(tomorrow);
        dayAfter.setDate(tomorrow.getDate() + 1);

        const appointments = await this.appointmentRepository.find({
            where: {
                appointmentDate: Between(tomorrow, dayAfter),
            },
            relations: ['patient', 'doctor', 'doctor.user'],
        });

        for (const appt of appointments) {
            const timeStr = appt.appointmentTime;
            const appointmentId = appt.id;

            // Notificar al paciente
            const patientId = appt.patient?.id;
            if (patientId) {
                await this.pushService.sendNotificationToUser(
                    patientId,
                    'Recordatorio de cita médica',
                    `Tienes una cita agendada para mañana  a las ${timeStr}`,
                    { appointmentId }
                );
            }

            // Notificar al doctor
            const doctorId = appt.doctor?.user?.id;
            if (doctorId) {
                await this.pushService.sendNotificationToUser(
                    doctorId,
                    'Recordatorio de cita médica',
                    `Tienes una cita con un paciente mañana a las ${timeStr}`,
                    { appointmentId }
                );
            }
        }
    }
}
