import { UsersController } from './user.controller';
import { UsersService } from './user.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UserModule {}
