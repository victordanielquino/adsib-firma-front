export interface IJacobitusFirmaPdfResponse {
  datos: DatosI;
  finalizado: boolean;
  mensaje: string;
}
export interface DatosI {
  pdf_firmado: string;
}
