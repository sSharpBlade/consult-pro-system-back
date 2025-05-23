import { IsNotEmpty, IsNumber } from 'class-validator';

export class ClinicSecretaryDto {
  @IsNumber()
  @IsNotEmpty()
  secretaryId: number;

  @IsNumber()
  @IsNotEmpty()
  clinicId: number;
}
