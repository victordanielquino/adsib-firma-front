import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-btn-view-firmas',
  templateUrl: './btn-view-firmas.component.html',
  styleUrls: ['./btn-view-firmas.component.css'],
})
export class BtnViewFirmasComponent {
  @Output() clickDelPadre = new EventEmitter<void>();
  @Input() botonHabilitado: boolean = true;

  clickHijo() {
    this.clickDelPadre.emit(); // Emite un evento al hacer clic
  }
}
