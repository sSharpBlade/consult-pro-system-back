import { Body, Controller, Delete, HttpCode, Post } from '@nestjs/common';
import { PushNotificationsService } from './push-notifications.service';
import { RegisterTokenDto } from './dto/register-token.dto';

@Controller('push')
export class PushNotificationsController {
  constructor(private readonly pushService: PushNotificationsService) { }

  @Post('register')
  async registerToken(@Body() dto: RegisterTokenDto) {
    await this.pushService.saveToken(dto.userId, dto.token);
    return { message: 'Token registrado correctamente' };
  }

  @HttpCode(204)
  @Delete('remove')
  async removeToken(@Body() dto: RegisterTokenDto) {
    await this.pushService.removeToken(dto.userId, dto.token);
  }
}
