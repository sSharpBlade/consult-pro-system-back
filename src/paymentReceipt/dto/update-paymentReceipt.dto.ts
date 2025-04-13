import { IsNumber, IsPositive, IsString, IsOptional } from 'class-validator';

export class UpdatePaymentReceiptDto {
  @IsNumber()
  @IsOptional()
  appointmentId?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  method?: string;
}
