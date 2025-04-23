import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsIn,
  IsOptional,
} from 'class-validator';
import { User } from '../../user/entity/user.entity';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  dni: string;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsIn(['admin', 'patient', 'doctor', 'secretary'])
  role: User['role'];

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  image?: string;
}
