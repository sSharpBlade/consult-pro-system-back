import { IsNumber, IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateAppointmentDto {
  @IsNumber()
  @IsOptional()
  patientId?: number;

  @IsNumber()
  @IsOptional()
  doctorId?: number;

  @IsNumber()
  @IsOptional()
  clinicId?: number;

  @IsString()
  @IsOptional()
  appointmentDate?: string;

  @IsString()
  @IsOptional()
  appointmentTime?: string;

  @IsString()
  @IsOptional()
  @IsIn(['pending', 'completed', 'cancelled'])
  status?: string;
}
