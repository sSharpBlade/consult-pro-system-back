import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePrescriptionDto {
  @IsNumber()
  @IsNotEmpty()
  appointmentId: number;

  @IsNumber()
  @IsNotEmpty()
  doctorId: number;

  @IsString()
  @IsNotEmpty()
  document: string;
}
