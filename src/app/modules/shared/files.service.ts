import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor() {}

  convertFileToArrayBuffer(file: File): Promise<ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as ArrayBuffer);
      };

      reader.onerror = (error) => {
        console.error('Error al leer el archivo:', error);
        reject(null);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  convertArrayBufferToBase64(buffer: ArrayBuffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const blob = new Blob([buffer]);
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result as string); // Esto es una cadena base64
      };

      reader.onerror = (error) => {
        console.error('Error al convertir a base64:', error);
        reject('Error al convertir a base64');
      };

      reader.readAsDataURL(blob);
    });
  }

  convertBase64ToBlob(pdfBase64: string) {
    const byteCharacters = atob(pdfBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/pdf' });
  }

  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64); // Decodifica base64 a cadena binaria
    const len = binaryString.length;
    const bytes = new Uint8Array(len); // Crea un array de bytes
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i); // Convierte caracteres a valores de bytes
    }
    return bytes.buffer; // Devuelve el ArrayBuffer
  }

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string); // El resultado es data URL que contiene la cadena base64
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file); // Lee el archivo y lo codifica como base64
    });
  }
}
