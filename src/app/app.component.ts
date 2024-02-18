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

  redirectToFirmaDetalle() {
    this.verProductos = false;
    this.router.navigate(['adsib']);
    // this.router.navigate(['adsib/firma-detalle']);
  }

  handleVerProductos() {
    console.log('click');

    this.verProductos = !this.verProductos;
  }
}
