import { IsNotEmpty, IsNumber, IsString, IsPositive, IsIn } from 'class-validator';

export class CreatePaymentReceiptDto {
  @IsNumber()
  @IsNotEmpty()
  appointmentId: number;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsIn(['efectivo', 'tarjeta débito', 'tarjeta crédito', 'transferencia'])
  method: string;
}
