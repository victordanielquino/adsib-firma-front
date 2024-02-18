interface Titular {
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

interface Validez {
  desde: string;
  hasta: string;
}

interface Emisor {
  CN: string;
  O: string;
}

interface Certificado {
  tipo: string;
  tipo_desc: string;
  alias: string;
  id: string;
  tiene_certificado: boolean;
  pem?: string;
  validez?: Validez;
  titular?: Titular;
  common_name?: string;
  emisor?: Emisor;
  adsib?: boolean;
  serialNumber?: string;
}

interface Datos {
  data_token: {
    certificates: number;
    data: Certificado[];
    private_keys: number;
  };
}

export interface ResponseTokenValidaI {
  datos: Datos;
  finalizado: boolean;
  mensaje: string;
}
