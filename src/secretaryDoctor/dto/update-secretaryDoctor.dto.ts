import { IsNumber, IsOptional } from 'class-validator';

export class UpdateSecretaryDoctorDto {
  @IsNumber()
  @IsOptional()
  secretaryId?: number;

  @IsNumber()
  @IsOptional()
  doctorId?: number;
}
