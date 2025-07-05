import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key: Buffer;
  private readonly iv: Buffer;

  constructor() {
    // En producción, estas claves deben venir de variables de entorno
    const secretKey =
      process.env.ENCRYPTION_KEY || 'your-32-char-secret-key-here!!!';
    const ivKey = process.env.ENCRYPTION_IV || 'your-16-char-iv!!';

    this.key = crypto.scryptSync(secretKey, 'salt', 32);
    this.iv = Buffer.from(ivKey.substring(0, 16));
  }

  /**
   * Encripta un texto usando AES-256-CBC
   */
  encrypt(text: string): string {
    if (!text) return text;

    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /**
   * Desencripta un texto
   */
  decrypt(encryptedText: string): string {
    if (!encryptedText) return encryptedText;

    try {
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.key,
        this.iv,
      );
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      // Si no se puede desencriptar, devolver el texto original
      // Esto es útil para migración de datos existentes
      return encryptedText;
    }
  }
}
