import { Component, ElementRef, ViewChild } from '@angular/core';
import { IJacobitusStatusResponse } from '../../common/interfaces/jacobitus-status-response.interface';
import { IJacobitusTokenConnected } from '../../common/interfaces/jacobitus-token-connected-response.interface';
import {
  ICertificado,
  IJacobitusTokenDataResponse,
} from '../../common/interfaces/jacobitus-token-data-response.interface';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IJacobitusFirmaPdfResponse } from '../../common/interfaces/jacobitus-firma-pdf-response.interface';
import { JacobitusService } from '../../services/jacobitus.service';
import { FilesService } from 'src/app/modules/shared/files.service';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { addQRinPDF, createImageQR } from 'src/app/common/utilities/qr';
import { IJacobitusFirmaPdfRequest } from '../../common/interfaces/jacobitus-firma-pdf-request.interface';
import { PDF } from '../../common/data/pdf';
import {
  IFirmaSendByCode,
  METODOS_CODE,
} from '../../common/interfaces/jacobitus-validar-pdf-response.inteface';

@Component({
  selector: 'app-firma-v2',
  templateUrl: './firma-v2.component.html',
  styleUrls: ['./firma-v2.component.scss'],
})
export class FirmaV2Component {
  title = 'FirmaV2Component';
  status: IJacobitusStatusResponse | null = null;
  tokenConneted: IJacobitusTokenConnected | null = null;
  tokenData: IJacobitusTokenDataResponse | null = null;
  tokenLoadind: boolean = false;
  certificados: ICertificado[] = [];
  certificadosLoading: boolean = false;
  formToken: FormGroup | undefined;
  formCertificado: FormGroup | undefined;
  file: File | null = null;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  pdfPrefijo = 'data:application/pdf;base64,';
  pdfBuffer: ArrayBuffer | null = null;
  pdfB64 = '';
  pdfB64Content = '';
  firmaLoading: boolean = false;
  code: string = '';
  firma: IJacobitusFirmaPdfResponse | null = null;
  firmaModal: boolean = false;
  firmaValida: IFirmaSendByCode[] = [];

  constructor(
    private _serviceJacobitus: JacobitusService,
    private _serviceFile: FilesService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.get_status();
  }

  initForms() {
    this.formToken = new FormGroup({
      slot: new FormControl(null, Validators.required),
      pin: new FormControl('Suma.1234', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
    this.formCertificado = this.fb.group({
      alias: new FormControl(null, Validators.required),
    });
  }
  // 1 verifica si hay tokens conectados
  get_status() {
    this._serviceJacobitus.get_status().subscribe({
      next: (response) => {
        this.status = response;
        console.log(`${this.title} / getStatus - next`);
        this.get_tokenConneted();
      },
      error: (error) => {
        console.log(`${this.title} / getStatus - Error: `, error);
      },
      complete: () => {
        console.log(
          `${this.title} / getStatus - complete: Observavle completado`
        );
      },
    });
  }
  // 2 lista de tokens
  get_tokenConneted() {
    this.tokenLoadind = true;
    this._serviceJacobitus.get_tokenConnected().subscribe({
      next: (response) => {
        this.tokenLoadind = false;
        this.tokenConneted = response;
        console.log(`${this.title} / get_tokenConneted - next: response: `);
      },
      error: (error) => {
        this.tokenLoadind = false;
        console.log(`${this.title} / get_tokenConneted - Error: `, error);
      },
      complete: () => {
        this.tokenLoadind = false;
        console.log(
          `${this.title} / get_tokenConneted - complete: Observable completado`
        );
      },
    });
  }
  // 3 busca certificados
  post_tokenData() {
    if (!this.formToken?.valid) return;
    this.certificadosLoading = true;

    this.resetAll();
    const payload = {
      slot: this.formToken.value.slot,
      pin: this.formToken.value.pin,
    };
    this._serviceJacobitus.post_tokenData(payload).subscribe({
      next: async (response) => {
        this.certificadosLoading = false;
        if (
          response &&
          response.datos &&
          response.datos.data_token &&
          response.datos.data_token.data &&
          response.datos.data_token.data.length > 0
        ) {
          this.tokenData = response;
          console.log(`${this.title} / post_tokenData - next: response: `);
          await this.filtrarTokenData();
        }
      },
      error: (error) => {
        this.certificadosLoading = false;
        console.log(`${this.title} / post_tokenData - Error: `, error);
      },
      complete: () => {
        this.certificadosLoading = false;
        console.log(
          `${this.title} / post_tokenData - complete: Observable completado`
        );
      },
    });
  }
  // 4 firma pdf
  async post_firmaPdf() {
    this.firmaLoading = true;
    console.log(
      `${this.title} / post_firmaPdf: Iniciando proceso para firmar PDF`
    );
    if (!this.formCertificado?.valid || !this.file) {
      this.firmaLoading = false;
      console.log(`${this.title} / post_firmaPdf: Formulario no completado!!!`);
      return;
    }
    const alias = this.formCertificado.value
      ? this.formCertificado.value.alias
      : '';
    const miCertficado = this.certificados.find((item) => item.alias === alias);
    try {
      console.log(
        `${this.title} / post_firmaPdf: Inciando proceso para verificar si el pdf esta firmado previamente`
      );
      const pdfB64 = await this._serviceFile.fileToBase64(this.file);
      this.pdfB64Content = pdfB64.split(',')[1];
      this._serviceJacobitus.post_validarPdf(this.pdfB64Content).subscribe({
        next: async (response: any) => {
          if (
            response.datos &&
            response.datos.firmas.length === 0 &&
            this.file
          ) {
            try {
              console.log(
                `${this.title} / post_firmaPdf: Inicio de verificacion de firmas sobre pdf`
              );
              this.pdfBuffer = await this._serviceFile.convertFileToArrayBuffer(
                this.file
              );
              if (this.pdfBuffer) {
                let nombre = 'PRUEBA';
                if (
                  miCertficado &&
                  miCertficado.titular &&
                  miCertficado.titular.CN
                ) {
                  nombre = miCertficado.titular.CN;
                }
                console.log(
                  `${this.title} / post_firmaPdf: Inicio para agregar QR al pdf`
                );
                const fechaActual = format(new Date(), 'dd-MM-yyyy HH:mm');
                const fechaHasta = format(
                  new Date(
                    miCertficado?.validez?.hasta
                      ? miCertficado.validez.hasta
                      : new Date()
                  ),
                  'dd-MM-yyyy HH:mm'
                );
                const qrImageBuffer = await createImageQR(
                  'NOMBRE: ' +
                    nombre +
                    '\nCORREO: ' +
                    miCertficado?.titular?.EmailAddress +
                    '\nFECHA FIRMA: ' +
                    fechaActual +
                    '\nVALIDEZ HASTA: ' +
                    fechaHasta
                ); // crea qr
                this.pdfB64Content = await addQRinPDF(
                  this.pdfBuffer,
                  qrImageBuffer,
                  50,
                  50,
                  '->VDQUINOJ<- ' + nombre
                ); // pdf con qr, return base64
                console.log(
                  `${this.title} / post_firmaPdf: Se agrego QR al pdf correctamente`
                );
              } else {
                console.log(
                  `${this.title} / post_firmaPdf: Error al generar pdfBuffer`
                );
                this.firmaLoading = false;
                return;
              }
            } catch (e) {
              console.log(
                `${this.title} / post_firmaPdf: Excepcion al generar pdfBuffer`
              );
              this.firmaLoading = false;
              return;
            }
          } else {
            console.log(
              `${this.title} / post_firmaPdf: El pdf ya tiene: ` +
                response.datos.firmas.length +
                ' firmas y no se agregara QR'
            );
          }
          console.log(`${this.title} / post_firmaPdf: ADD firma digital`);
          const payload: IJacobitusFirmaPdfRequest = {
            slot: this.formToken?.value.slot,
            pin: this.formToken?.value.pin,
            alias: this.formCertificado?.value.alias,
            pdf: this.pdfB64Content ? this.pdfB64Content : PDF.pdfBase64,
          };
          this._serviceJacobitus.post_firmaPdf(payload).subscribe({
            next: (response) => {
              console.log(response);
              if (response.finalizado) {
                this.firma = response;
                console.log(
                  `${this.title} / post_validarPdf: Iniciando proceso para validar la ultma firma`
                );
                this._serviceJacobitus
                  .post_validarPdf(this.firma.datos.pdf_firmado)
                  .subscribe({
                    next: async (response) => {
                      console.log(
                        `${this.title} / post_validarPdf: Proceso completado para validar la ultima firma`
                      );
                      this.firmaValida = response.datos.firmas.map((item) =>
                        METODOS_CODE.transformarFirmaParaEnvio(item)
                      );
                      this.code = JSON.stringify(this.firmaValida);
                      this.firmaLoading = false;
                    },
                    error: (error) => {
                      this.firmaLoading = false;
                      console.log(`${this.title} / post_firmaPdf: `, error);
                    },
                    complete: () => {
                      this.firmaLoading = false;
                      console.log(`${this.title} / post_firmaPdf - complete`);
                    },
                  });
              }
            },
            error: (error) => {
              this.firmaLoading = false;
              console.log(`${this.title} / post_firmaPdf: `, error);
            },
            complete: () => {
              console.log(`${this.title} / post_firmaPdf - complete`);
            },
          });
        },
        error: (error) => {
          this.firmaLoading = false;
          console.log(`${this.title} / post_validarPdf: `, error);
        },
        complete: () => {
          console.log(`${this.title} / post_validarPdf - complete`);
        },
      });
    } catch (e) {
      this.firmaLoading = false;
      console.log('${this.title} / ocurrio un error al verificar pdf!!');
      return;
    }
  }

  async filtrarTokenData() {
    if (
      this.tokenData &&
      this.tokenData.datos &&
      this.tokenData.datos.data_token &&
      this.tokenData.datos.data_token.data &&
      this.tokenData.datos.data_token.data.length > 0
    )
      this.certificados = this.tokenData.datos.data_token.data.filter(
        (item, index) =>
          index % 2 === 1 &&
          item.titular?.EmailAddress &&
          item.validez &&
          this.validaRangoFechas(item.validez?.desde, item.validez?.hasta)
      );
    if (this.certificados.length > 0) {
      try {
        // consulta certificados revocados.
        await Promise.all(
          this.certificados.map(async (item) => {
            console.log(
              'filtrarTokenData: Consulta certificados revocados por serial: ',
              item.serialNumber
            );
            // consulta api;
          })
        );
      } catch (e) {
        // error con la api de certificados revocados.
      }
    }
  }

  validaRangoFechas(desde: string, hasta: string) {
    const fromDate = new Date(desde);
    const toDate = new Date(hasta);
    const currentDate = new Date();
    const isInRange = currentDate >= fromDate && currentDate <= toDate;
    console.log(`Certificado vigente? ${isInRange}`);
    return isInRange;
  }

  resetAll() {
    this.tokenData = null;
    this.certificados = [];
  }

  onFileSelected(event: any): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.file = fileList.item(0);
    }
  }

  triggerFileInput() {
    this.fileInput && this.fileInput.nativeElement.click();
  }

  redirectToFirmaDetalle() {
    // this.router.navigate(['adsib/firma-detalle'], {
    //   queryParams: { code: this.code },
    // });
    // this.router.navigate(['adsib/firma-detalle']);
    this.openModal();
  }

  abrirPDFenNuevaPestana() {
    try {
      if (this.firma && this.firma.datos && this.firma.datos.pdf_firmado) {
        const blob = this._serviceFile.convertBase64ToBlob(
          this.firma.datos.pdf_firmado as string
        );
        const url = URL.createObjectURL(blob); // Crear una URL de objeto para la descarga
        window.open(url, '_blank'); // Abrir una nueva pestaña del navegador con el PDF
      } else {
        alert('No hay pdf firmado');
      }
    } catch (error) {
      console.error('Error al abrir el PDF:', error);
    }
  }
  openModal() {
    this.firmaModal = true;
  }

  onModalClose() {
    this.firmaModal = false;
    // Cualquier otra lógica que necesites ejecutar cuando el modal se cierre
  }
}
