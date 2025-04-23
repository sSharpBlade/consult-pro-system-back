import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: this.configService.get('MAIL_SECURE'),
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async sendPasswordResetEmail(
    email: string,
    tempPassword: string,
  ): Promise<void> {
    const appName = this.configService.get('APP_NAME') || 'Nuestra Aplicación';
    const supportEmail =
      this.configService.get('SUPPORT_EMAIL') || 'soporte@example.com';
    const expiresHours =
      this.configService.get('TEMP_PASSWORD_EXPIRES_HOURS') || 2;

    await this.transporter.sendMail({
      from: `"Soporte de ${appName}" <${supportEmail}>`,
      to: email,
      subject: 'Recuperación de contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Recuperación de contraseña</h2>
          <p>Hemos recibido una solicitud para restablecer tu contraseña en ${appName}.</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;">Usa la siguiente contraseña temporal para iniciar sesión:</p>
            <h3 style="margin: 10px 0; color: #3498db;">${tempPassword}</h3>
            <p style="margin: 0; font-size: 0.9em; color: #7f8c8d;">
              Esta contraseña expirará en ${expiresHours} horas.
            </p>
          </div>
          
          <p>Por seguridad, te recomendamos cambiar esta contraseña temporal inmediatamente después de iniciar sesión.</p>
          
          <p>Si no solicitaste este cambio, por favor ignora este mensaje o contacta a nuestro equipo de soporte.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          
          <p style="font-size: 0.9em; color: #7f8c8d;">
            Equipo de ${appName}<br>
            <a href="mailto:${supportEmail}">${supportEmail}</a>
          </p>
        </div>
      `,
    });
  }
}
