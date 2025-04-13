import { IsString, IsEmail, IsOptional, IsArray, IsInt } from 'class-validator';

export class UpdateSecretaryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  doctorIds?: number[];
}
