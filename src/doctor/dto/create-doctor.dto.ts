import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateDoctorDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  clinicId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  specialization: string;
}
