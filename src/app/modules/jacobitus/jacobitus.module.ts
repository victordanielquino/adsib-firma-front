import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JacobitusRoutingModule } from './jacobitus-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { JacobitusComponent } from './components/jacobitus/jacobitus.component';
import { FirmaDetalleComponent } from './components/firma-detalle/firma-detalle.component';
import { BtnLoadingComponent } from './components/btn-loading/btn-loading.component';
import { BtnPdfComponent } from './components/btn-pdf/btn-pdf.component';
import { BtnViewFirmasComponent } from './components/btn-view-firmas/btn-view-firmas.component';

@NgModule({
  declarations: [
    JacobitusComponent,
    FirmaDetalleComponent,
    BtnLoadingComponent,
    BtnPdfComponent,
    BtnViewFirmasComponent,
  ],
  imports: [CommonModule, JacobitusRoutingModule, ReactiveFormsModule],
})
export class JacobitusModule {}
