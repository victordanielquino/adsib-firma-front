export interface ICertificado {
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

export interface IFirma {
  noModificado: boolean;
  cadenaConfianza: boolean;
  firmadoDuranteVigencia: boolean;
  firmadoAntesRevocacion: boolean;
  versionado: boolean;
  timeStamp: boolean;
  fechaFirma: string;
  certificado: ICertificado;
}

export interface IDatos {
  firmas: IFirma[];
}

export interface IJacobitusValidarPdfResponse {
  datos: IDatos;
  finalizado: boolean;
  mensaje: string;
}

export interface ICertificadoSendByCode {
  ci: string;
  nombreSignatario: string;
  emailSignatario: string;
}

export interface IFirmaSendByCode {
  noModificado: boolean;
  fechaFirma: string;
  // certificado: ICertificadoSendByCode;
  ci: string;
  nombreSignatario: string;
  emailSignatario: string;
}

const transformarCertificadoParaEnvio = (
  certificado: ICertificado
): ICertificadoSendByCode => {
  return {
    ci: certificado.ci,
    nombreSignatario: certificado.nombreSignatario,
    emailSignatario: certificado.emailSignatario,
  };
};

const transformarFirmaParaEnvio = (firma: IFirma): IFirmaSendByCode => {
  return {
    noModificado: firma.noModificado,
    fechaFirma: firma.fechaFirma,
    // certificado: transformarCertificadoParaEnvio(firma.certificado),
    ci: firma.certificado.ci,
    nombreSignatario: firma.certificado.nombreSignatario,
    emailSignatario: firma.certificado.emailSignatario,
  };
};

export const METODOS_CODE = {
  transformarCertificadoParaEnvio,
  transformarFirmaParaEnvio,
};
