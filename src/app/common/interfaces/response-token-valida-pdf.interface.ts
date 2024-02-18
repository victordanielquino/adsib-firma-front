interface Certificado {
  ci: string;
  nombreSignatario: string;
  cargoSignatario: string;
  organizacionSignatario: string;
  emailSignatario: string;
  nombreECA: string;
  descripcionECA: string;
  inicioValidez: string;
  finValidez: string;
  numeroSerie: string;
}

interface Firma {
  noModificado: boolean;
  cadenaConfianza: boolean;
  firmadoDuranteVigencia: boolean;
  firmadoAntesRevocacion: boolean;
  versionado: boolean;
  timeStamp: boolean;
  fechaFirma: string;
  certificado: Certificado;
}

interface Datos {
  firmas: Firma[];
}

export interface ResponseTokenValidaPdfI {
  datos: Datos;
  finalizado: boolean;
  mensaje: string;
}
