import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { PlansService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entity/plan.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('plans')
@UseGuards(JwtAuthGuard)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles',['admin'])
  async create(@Body() createPlanDto: CreatePlanDto): Promise<Plan> {
    return this.plansService.create(createPlanDto);
  }

  @Get()
  async findAll(): Promise<Plan[]> {
    return this.plansService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Plan> {
    return this.plansService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles',['admin'])
  async update(
    @Param('id') id: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<Plan> {
    return this.plansService.update(+id, updatePlanDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles',['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.plansService.remove(+id);
  }

  @Post(':id/restore')
  @UseGuards(RolesGuard)
  @SetMetadata('roles',['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(@Param('id') id: string): Promise<void> {
    await this.plansService.restore(+id);
  }
}
