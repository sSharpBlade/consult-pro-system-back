export class CreateSuscripcionDto {
  id_cliente: number;
  id_plan: number;
  fecha_inicio: Date;
  fecha_fin?: Date;
  estado?: boolean;
}
