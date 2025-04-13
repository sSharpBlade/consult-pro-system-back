import {
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class UpdatePlanDto {
  @IsString()
  @MaxLength(50)
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  maxDoctors?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;
}
