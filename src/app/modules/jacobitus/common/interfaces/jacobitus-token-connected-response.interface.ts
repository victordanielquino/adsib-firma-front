export interface IJacobitusTokenConnected {
  datos: {
    connected: boolean;
    tokens: IToken[];
  };
  finalizado: boolean;
  mensaje: string;
}

export interface IToken {
  slot: number;
  serial: string;
  name: string;
  model: string;
}
