import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirmaDetalleComponent } from './components/firma-detalle/firma-detalle.component';
import { JacobitusGuard } from './guards/jacobitus.guard';
import { FirmaV2Component } from './pages/firma-v2/firma-v2.component';
import { FirmaV3Component } from './pages/firma-v3/firma-v3.component';

const routes: Routes = [
  {
    path: 'v2',
    component: FirmaV2Component,
  },
  {
    path: 'v3',
    component: FirmaV3Component,
  },
  {
    path: 'firma-detalle',
    component: FirmaDetalleComponent,
    canActivate: [JacobitusGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JacobitusRoutingModule {}
