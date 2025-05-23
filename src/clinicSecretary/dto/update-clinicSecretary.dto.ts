import { IsNumber, IsOptional } from 'class-validator';

export class UpdateClinicSecretaryDto {
  @IsNumber()
  @IsOptional()
  secretaryId?: number;

  @IsNumber()
  @IsOptional()
  clinicId?: number;
}
