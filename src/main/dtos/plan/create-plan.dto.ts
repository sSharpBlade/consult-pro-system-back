export class CreatePlanDto {
  nombre: string;
  limiteProfesionales: number;
  precio_mensual: number;
  estado?: boolean;
}
