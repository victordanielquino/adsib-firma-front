export interface ResponseTokenListaI {
  datos: {
    connected: boolean;
    tokens: {
      slot: number;
      serial: string;
      name: string;
      model: string;
    }[];
  };
  finalizado: boolean;
  mensaje: string;
}
