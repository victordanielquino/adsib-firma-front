import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'adsib-firma-front';
  verProductos: boolean = false;

  constructor(private router: Router) {}

  redirectToFirmaV2() {
    this.verProductos = false;
    this.router.navigate(['adsib/v2']);
    // this.router.navigate(['adsib/firma-detalle']);
  }
  redirectToFirmaV3() {
    this.verProductos = false;
    this.router.navigate(['adsib/v3']);
    // this.router.navigate(['adsib/firma-detalle']);
  }

  handleVerProductos() {
    console.log('click');

    this.verProductos = !this.verProductos;
  }
}
