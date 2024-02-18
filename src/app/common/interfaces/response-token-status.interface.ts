export interface ResponseTokenStatusI {
  datos: {
    compilacion: number;
    api_version: string;
  };
  finalizado: boolean;
  mensaje: string;
}
