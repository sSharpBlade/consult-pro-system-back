import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { SecretaryService } from './secretary.service';
import { CreateSecretaryDto } from './dto/create-secretary.dto';
import { UpdateSecretaryDto } from './dto/update-secretary.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('secretaries')
@UseGuards(JwtAuthGuard)
export class SecretaryController {
  constructor(private readonly secretaryService: SecretaryService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'doctor'])
  create(@Body() dto: CreateSecretaryDto) {
    return this.secretaryService.create(dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'secretary', 'doctor'])
  findAll() {
    return this.secretaryService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'secretary', 'doctor'])
  findOne(@Param('id') id: string) {
    return this.secretaryService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'doctor'])
  update(@Param('id') id: string, @Body() dto: UpdateSecretaryDto) {
    return this.secretaryService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin','doctor'])
  remove(@Param('id') id: string) {
    return this.secretaryService.remove(+id);
  }
}
