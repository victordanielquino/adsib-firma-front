export interface ITitular {
  dnQualifier: string;
  uidNumber: string;
  UID: string;
  CN: string;
  T: string;
  O: string;
  OU: string;
  EmailAddress: string;
  description: string;
}

export interface IValidez {
  desde: string;
  hasta: string;
}

export interface IEmisor {
  CN: string;
  O: string;
}

export interface ICertificado {
  tipo: string;
  tipo_desc: string;
  alias: string;
  id: string;
  tiene_certificado: boolean;
  pem?: string;
  validez?: IValidez;
  titular?: ITitular;
  common_name?: string;
  emisor?: IEmisor;
  adsib?: boolean;
  serialNumber?: string;
}

export interface IDatos {
  data_token: {
    certificates: number;
    data: ICertificado[];
    private_keys: number;
  };
}

export interface IJacobitusTokenDataResponse {
  datos: IDatos;
  finalizado: boolean;
  mensaje: string;
}
