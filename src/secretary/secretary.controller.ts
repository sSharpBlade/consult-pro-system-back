import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { SecretaryService } from './secretary.service';
import { CreateSecretaryDto } from './dto/create-secretary.dto';
import { UpdateSecretaryDto } from './dto/update-secretary.dto';

@Controller('secretaries')
export class SecretaryController {
  constructor(private readonly secretaryService: SecretaryService) {}

  @Post()
  create(@Body() dto: CreateSecretaryDto) {
    return this.secretaryService.create(dto);
  }

  @Get()
  findAll() {
    return this.secretaryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.secretaryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSecretaryDto) {
    return this.secretaryService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.secretaryService.remove(+id);
  }
}
