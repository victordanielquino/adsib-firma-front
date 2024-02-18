import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { IJacobitusStatusResponse } from '../common/interfaces/jacobitus-status-response.interface';
import { IJacobitusTokenConnected } from '../common/interfaces/jacobitus-token-connected-response.interface';
import { IJacobitusTokenDataRequest } from '../common/interfaces/jacobitus-token-data-request.interface';
import { IJacobitusTokenDataResponse } from '../common/interfaces/jacobitus-token-data-response.interface';
import { IJacobitusFirmaPdfRequest } from '../common/interfaces/jacobitus-firma-pdf-request.interface';
import { IJacobitusFirmaPdfResponse } from '../common/interfaces/jacobitus-firma-pdf-response.interface';
import { IJacobitusValidarPdfResponse } from '../common/interfaces/jacobitus-validar-pdf-response.inteface';

@Injectable({
  providedIn: 'root',
})
export class JacobitusService {
  private apiUrl = `https://localhost:9000/api`;

  constructor(private http: HttpClient) {}

  /**
   * @Description: 1 verifica si el token esta conectado
   */
  get_status(): Observable<IJacobitusStatusResponse> {
    const apiRequest = `${this.apiUrl}/status`;
    console.log('JacobitusService / get_status: Consultando api: ', apiRequest);
    return this.http.get<IJacobitusStatusResponse>(apiRequest).pipe(
      retry(3), // Reintenta la petición hasta 3 veces en caso de fallos
      catchError(this.handleError) // Maneja errores
    );
  }

  /**
   * @Description: 2 obtiene lista de tokens
   */
  get_tokenConnected(): Observable<IJacobitusTokenConnected> {
    const apiRequest = `${this.apiUrl}/token/connected`;
    console.log(
      'JacobitusService / get_tokenConnected: Consultando api: ',
      apiRequest
    );
    return this.http.get<IJacobitusTokenConnected>(apiRequest).pipe(
      retry(3), // Reintenta la petición hasta 3 veces en caso de fallos
      catchError(this.handleError) // Maneja errores
    );
  }

  /**
   * @Description: 3 autenticacion y obtencion de certificados
   */
  post_tokenData(
    payload: IJacobitusTokenDataRequest
  ): Observable<IJacobitusTokenDataResponse> {
    const apiRequest = `${this.apiUrl}/token/data`;
    console.log(
      'JacobitusService / get_tokenData: Consultando api: ',
      apiRequest
    );
    return this.http
      .post<IJacobitusTokenDataResponse>(apiRequest, payload)
      .pipe(
        retry(1), // Reintenta la petición hasta 3 veces en caso de fallos
        catchError(this.handleError) // Maneja errores
      );
  }

  /**
   * @Description: 4 firma pdf
   */
  post_firmaPdf(
    payload: IJacobitusFirmaPdfRequest
  ): Observable<IJacobitusFirmaPdfResponse> {
    const apiRequest = `${this.apiUrl}/token/firmar_pdf`;
    console.log(
      'JacobitusService / post_firmaPdf: Consultando api: ',
      apiRequest
    );
    return this.http.post<IJacobitusFirmaPdfResponse>(apiRequest, payload).pipe(
      retry(1), // Reintenta la petición hasta 3 veces en caso de fallos
      catchError(this.handleError) // Maneja errores
    );
  }

  /**
   * @Description: 5 validar pdf
   */
  post_validarPdf(pdfBase64: string): Observable<IJacobitusValidarPdfResponse> {
    const apiRequest = `${this.apiUrl}/validar_pdf`;
    console.log(
      'JacobitusService / post_validarPdf: Consultando api: ',
      apiRequest
    );
    return this.http
      .post<IJacobitusValidarPdfResponse>(apiRequest, { pdf: pdfBase64 })
      .pipe(
        retry(1), // Reintenta la petición hasta 3 veces en caso de fallos
        catchError(this.handleError) // Maneja errores
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // Un error del lado del cliente o de red ocurrió. Maneja como creas conveniente.
      console.error('An error occurred:', error.error);
    } else {
      // El backend retornó un código de respuesta de fallo.
      // El cuerpo de la respuesta puede contener pistas de qué fue lo que salió mal.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Retorna un observable con un mensaje de error amigable al usuario
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
