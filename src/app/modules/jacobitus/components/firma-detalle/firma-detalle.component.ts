import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFirmaSendByCode } from '../../common/interfaces/jacobitus-validar-pdf-response.inteface';

@Component({
  selector: 'app-firma-detalle',
  templateUrl: './firma-detalle.component.html',
  styleUrls: ['./firma-detalle.component.css'],
})
export class FirmaDetalleComponent implements OnInit {
  firmaDetalle: IFirmaSendByCode[] = [];
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      this.validaCode(code);
    });
  }

  validaCode(code: string) {
    try {
      this.firmaDetalle = JSON.parse(code);
    } catch (error) {
      console.log(`Error al docodificar el code`);
    }
  }

  volver() {
    this.router.navigate(['adsib']);
  }
}
