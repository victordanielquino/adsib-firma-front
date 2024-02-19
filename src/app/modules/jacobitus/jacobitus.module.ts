import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JacobitusRoutingModule } from './jacobitus-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FirmaDetalleComponent } from './components/firma-detalle/firma-detalle.component';
import { BtnLoadingComponent } from './components/btn-loading/btn-loading.component';
import { BtnPdfComponent } from './components/btn-pdf/btn-pdf.component';
import { BtnViewFirmasComponent } from './components/btn-view-firmas/btn-view-firmas.component';
import { FirmaV3Component } from './pages/firma-v3/firma-v3.component';
import { FirmaV2Component } from './pages/firma-v2/firma-v2.component';
import { FirmaV1Component } from './pages/firma-v1/firma-v1.component';
import { ModalFirmasComponent } from './components/modal-firmas/modal-firmas.component';

@NgModule({
  declarations: [
    FirmaDetalleComponent,
    BtnLoadingComponent,
    BtnPdfComponent,
    BtnViewFirmasComponent,
    FirmaV3Component,
    FirmaV2Component,
    FirmaV1Component,
    ModalFirmasComponent,
  ],
  imports: [CommonModule, JacobitusRoutingModule, ReactiveFormsModule],
})
export class JacobitusModule {}
