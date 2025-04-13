import { SecretaryController } from './secretary.controller';
import { SecretaryService } from './secretary.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [SecretaryController],
  providers: [SecretaryService],
})
export class SecretaryModule {}
