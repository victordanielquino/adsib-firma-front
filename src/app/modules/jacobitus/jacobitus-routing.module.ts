import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JacobitusComponent } from './components/jacobitus/jacobitus.component';
import { FirmaDetalleComponent } from './components/firma-detalle/firma-detalle.component';
import { JacobitusGuard } from './guards/jacobitus.guard';

const routes: Routes = [
  {
    path: '',
    component: JacobitusComponent,
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
