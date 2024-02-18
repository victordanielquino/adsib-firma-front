export interface IJacobitusStatusResponse {
  datos: {
    compilacion: number;
    api_version: string;
  };
  finalizado: boolean;
  mensaje: string;
}
