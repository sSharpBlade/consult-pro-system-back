import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsIn,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MaxLength(10)
  @IsOptional()
  dni?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @IsEmail()
  @MaxLength(100)
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsIn(['admin', 'patient', 'doctor', 'secretary'])
  @IsOptional()
  role?: string;
}
