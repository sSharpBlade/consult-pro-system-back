import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSecretaryDoctorDto {
  @IsNumber()
  @IsNotEmpty()
  secretaryId: number;

  @IsNumber()
  @IsNotEmpty()
  doctorId: number;
}
