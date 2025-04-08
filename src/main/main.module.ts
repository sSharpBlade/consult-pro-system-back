import { MainService } from './services/main.service';
import { MainController } from './controllers/main.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Plan } from './entities/plan.entity';
import { Suscripcion } from './entities/suscripcion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Plan, Suscripcion])],
  controllers: [MainController],
  providers: [MainService],
})
export class MainModule {}
