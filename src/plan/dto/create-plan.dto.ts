import {IsNotEmpty,IsString,IsNumber,IsPositive,MaxLength,} from 'class-validator';

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsNumber()
  @IsPositive()
  maxDoctors: number;

  @IsNumber()
  @IsPositive()
  price: number;
}
