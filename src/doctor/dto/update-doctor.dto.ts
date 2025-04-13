import { IsNumber, IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateDoctorDto {
  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsNumber()
  @IsOptional()
  clinicId?: number;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  specialization?: string;
}
