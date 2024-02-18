import * as QRCode from 'qrcode';
import { PDFDocument } from 'pdf-lib';

/**
 * @Description: Crea QR con texto
 * */
export const createImageQR = async (text: string) => {
  const qrValue = text;
  const qrImageURI = await QRCode.toDataURL(qrValue);
  const qrImageResponse = await fetch(qrImageURI);
  return await qrImageResponse.arrayBuffer();
};

/**
 * @Description: Agrega QR a PDF
 * */
export const addQRinPDF = async (
  fileBuffer: ArrayBuffer,
  qrImageBuffer: ArrayBuffer,
  x = 50,
  y = 50,
  firmasCantidad = 0
): Promise<string> => {
  const pdfDoc = await PDFDocument.load(fileBuffer);
  const qrImage = await pdfDoc.embedPng(qrImageBuffer);

  const nuevoAncho = 70;
  const nuevaAltura = 70;

  const page = pdfDoc.getPages()[0]; // Primera página del PDF
  const alturaPagina = page.getHeight(); // Obtiene la altura de la página

  const posicionY = 50; // Define la distancia desde el borde inferior de la página
  const nuevaPosicionY = alturaPagina - nuevaAltura - posicionY;

  // Dibuja la imagen de código QR en el PDF con el nuevo tamaño
  page.drawImage(qrImage, {
    x: x + 60 * firmasCantidad,
    y: y,
    width: nuevoAncho,
    height: nuevaAltura,
  });

  const pdfBytes = await pdfDoc.saveAsBase64();
  return pdfBytes;
};
