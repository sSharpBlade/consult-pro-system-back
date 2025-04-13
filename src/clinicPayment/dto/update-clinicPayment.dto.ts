import {
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  IsIn,
} from 'class-validator';

export class UpdateClinicPaymentDto {
  @IsNumber()
  @IsOptional()
  clinicId?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsIn(['paid', 'pending', 'failed'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  startPeriod?: string;

  @IsString()
  @IsOptional()
  endPeriod?: string;

  @IsString()
  @IsOptional()
  method?: string;
}
