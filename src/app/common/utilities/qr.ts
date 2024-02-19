import * as QRCode from 'qrcode';
import { PDFDocument, rgb } from 'pdf-lib';

/**
 * @Description: Crea QR con texto
 * */
export const createImageQR = async (text: string) => {
  const qrValue = text;
  const qrImageURI = await QRCode.toDataURL(qrValue);
  const qrImageResponse = await fetch(qrImageURI);
  return await qrImageResponse.arrayBuffer();
};
export const createImageQRBase64 = async (text: string) => {
  const qrValue = text;
  return await QRCode.toDataURL(qrValue);
};

/**
 * @Description: Agrega QR a PDF
 * */
export const addQRinPDF = async (
  fileBuffer: ArrayBuffer,
  qrImageBuffer: ArrayBuffer,
  x = 50,
  y = 50,
  texto = 'PRUEBA TEXTO',
  firmasCantidad = 0
): Promise<string> => {
  const pdfDoc = await PDFDocument.load(fileBuffer);
  const qrImage = await pdfDoc.embedPng(qrImageBuffer);

  const nuevoAncho = 70;
  const nuevaAltura = 70;

  const page = pdfDoc.getPages()[0]; // Primera página del PDF
  const alturaPagina = page.getHeight(); // Obtiene la altura de la página
  const anchoPagina = page.getWidth(); // Obtiene la altura de la página

  const posicionY = 50; // Define la distancia desde el borde inferior de la página
  const nuevaPosicionY = alturaPagina - nuevaAltura - posicionY;

  // Dibuja la imagen de código QR en el PDF con el nuevo tamaño
  page.drawImage(qrImage, {
    x: x,
    y: y,
    width: nuevoAncho,
    height: nuevaAltura,
  });
  // dibuja el texto:
  const resultado = insertarSaltosDeLinea(texto);

  resultado.map((texto, index) => {
    if (index <= 2) {
      page.drawText(texto, {
        x: x + 5,
        y: y - 4 - (index == 0 ? 0 : index * 8),
        size: 8, // Tamaño del texto
        color: rgb(0, 0, 0), // Color del texto
      });
    }
  });

  const pdfBytes = await pdfDoc.saveAsBase64();
  return pdfBytes;
};

export const insertarSaltosDeLinea = (texto: string) => {
  const palabras = texto.split(/\s+/); // Divide el texto en palabras
  let lineaActual = '';
  let lineas = [];

  palabras.forEach((palabra) => {
    // Verifica si la palabra cabe en la línea actual o si es una palabra larga que debe ir sola
    if (
      lineaActual.length + palabra.length + (lineaActual.length > 0 ? 1 : 0) <=
        10 ||
      (lineaActual.length === 0 && palabra.length > 10)
    ) {
      // Agrega la palabra a la línea actual, incluyendo un espacio si no es el inicio de la línea
      lineaActual += (lineaActual.length > 0 ? ' ' : '') + palabra;
    } else {
      // Si la palabra no cabe, guarda la línea actual y empieza una nueva con la palabra actual
      lineas.push(lineaActual);
      lineaActual = palabra;
    }
  });

  // Asegúrate de agregar la última línea si no está vacía
  if (lineaActual.length > 0) {
    lineas.push(lineaActual);
  }
  console.log(lineas);
  return lineas;
};
