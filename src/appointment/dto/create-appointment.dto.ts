import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsNumber()
  @IsNotEmpty()
  patientId: number;

  @IsNumber()
  @IsNotEmpty()
  doctorId: number;

  @IsNumber()
  @IsNotEmpty()
  clinicId: number;

  @IsString()
  @IsNotEmpty()
  appointmentDate: string;

  @IsString()
  @IsNotEmpty()
  appointmentTime: string;
}
