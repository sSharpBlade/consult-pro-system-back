import { IsString, IsEmail, IsArray, IsInt } from 'class-validator';

export class CreateSecretaryDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsArray()
  @IsInt({ each: true })
  doctorIds: number[];
}
