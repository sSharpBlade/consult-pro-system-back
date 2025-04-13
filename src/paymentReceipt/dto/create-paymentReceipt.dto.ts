import { IsNotEmpty, IsNumber, IsString, IsPositive } from 'class-validator';

export class CreatePaymentReceiptDto {
  @IsNumber()
  @IsNotEmpty()
  appointmentId: number;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  method: string;
}
