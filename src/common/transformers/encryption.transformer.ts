import { ValueTransformer } from 'typeorm';
import { EncryptionService } from '../services/encryption.service';

// Instancia global del servicio de encriptación
const encryptionService = new EncryptionService();

export class EncryptionTransformer implements ValueTransformer {
  /**
   * Se ejecuta cuando se guarda el dato en la base de datos
   */
  to(value: string | number): string {
    if (!value && value !== 0) return value as string;
    const stringValue = String(value);
    return encryptionService.encrypt(stringValue);
  }

  /**
   * Se ejecuta cuando se lee el dato desde la base de datos
   */
  from(value: string): string | number {
    if (!value) return value;
    const decrypted = encryptionService.decrypt(value);

    // Si es un número, convertirlo de vuelta
    const asNumber = Number(decrypted);
    if (!isNaN(asNumber) && isFinite(asNumber)) {
      return asNumber;
    }

    return decrypted;
  }
}

// Exportar una instancia para reutilizar
export const encryptionTransformer = new EncryptionTransformer();
