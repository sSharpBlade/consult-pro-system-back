import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key: Buffer;
  private readonly iv: Buffer;
  private readonly encryptionPrefix = 'ENC:'; // Prefijo para identificar datos encriptados

  constructor() {
    // En producción, estas claves deben venir de variables de entorno
    const secretKey =
      process.env.ENCRYPTION_KEY || 'your-32-char-secret-key-here!!!';
    const ivKey = process.env.ENCRYPTION_IV || 'your-16-char-iv!!';

    this.key = crypto.scryptSync(secretKey, 'salt', 32);
    this.iv = Buffer.from(ivKey.substring(0, 16));
  }

  /**
   * Verifica si un texto ya está encriptado
   */
  isEncrypted(text: string): boolean {
    return Boolean(text && text.startsWith(this.encryptionPrefix));
  }

  /**
   * Encripta un texto usando AES-256-CBC solo si no está ya encriptado
   */
  encrypt(text: string): string {
    if (!text) return text;

    // Si ya está encriptado, no lo encriptamos de nuevo
    if (this.isEncrypted(text)) {
      return text;
    }

    try {
      const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return this.encryptionPrefix + encrypted; // Agregamos prefijo
    } catch (error) {
      console.warn('Error al encriptar, devolviendo texto original:', error);
      return text;
    }
  }

  /**
   * Desencripta un texto solo si está encriptado
   */
  decrypt(encryptedText: string): string {
    if (!encryptedText) return encryptedText;

    // Si no tiene el prefijo, es un dato antiguo sin encriptar
    if (!this.isEncrypted(encryptedText)) {
      return encryptedText; // Devolver tal como está (datos existentes)
    }

    try {
      // Remover el prefijo antes de desencriptar
      const textWithoutPrefix = encryptedText.substring(
        this.encryptionPrefix.length,
      );

      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.key,
        this.iv,
      );
      let decrypted = decipher.update(textWithoutPrefix, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      console.warn('Error al desencriptar, devolviendo texto original:', error);
      // Si no se puede desencriptar, devolver sin el prefijo
      return encryptedText.replace(this.encryptionPrefix, '');
    }
  }
}
