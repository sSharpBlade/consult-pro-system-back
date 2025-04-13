import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsIn,
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
}
