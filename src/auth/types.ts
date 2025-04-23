import { User } from '../user/entity/user.entity';
import { Request } from 'express';

export interface JwtPayload {
  sub: number; // user.id
  email: string;
  role: User['role'];
  dni: string;
  name: string;
  iat?: number; // issued at
  exp?: number; // expiration
}

export interface AuthenticatedRequest extends Request {
  user: User;
}

export interface LoginResponse {
  accessToken: string;
  user: Omit<User, 'password' | 'tempPassword' | 'tempPasswordExpires'>;
  isTempPassword?: boolean;
}
