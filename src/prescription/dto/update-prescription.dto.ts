import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdatePrescriptionDto {
  @IsNumber()
  @IsOptional()
  appointmentId?: number;

  @IsNumber()
  @IsOptional()
  doctorId?: number;

  @IsString()
  @IsOptional()
  document?: string;
}
