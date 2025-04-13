import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateClinicDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsNumber()
  planId: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsString()
  openingDays: string;

  @IsString()
  openingTime: string;

  @IsString()
  closingTime: string;
}
