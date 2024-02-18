export interface ResponseTokenFirmaPdfI {
  datos: DatosI,
  finalizado: boolean,
  mensaje: string,
}
export interface DatosI {
  pdf_firmado: string,
}

