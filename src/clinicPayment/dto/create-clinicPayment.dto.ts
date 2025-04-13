import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsPositive,
  IsIn,
} from 'class-validator';

export class CreateClinicPaymentDto {
  @IsNumber()
  @IsNotEmpty()
  clinicId: number;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsIn(['paid', 'pending', 'failed'])
  status: string;

  @IsString()
  @IsNotEmpty()
  startPeriod: string;

  @IsString()
  @IsNotEmpty()
  endPeriod: string;

  @IsString()
  @IsNotEmpty()
  method: string;
}
