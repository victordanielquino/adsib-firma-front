import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-btn-pdf',
  templateUrl: './btn-pdf.component.html',
  styleUrls: ['./btn-pdf.component.css'],
})
export class BtnPdfComponent {
  @Output() clickDelPadre = new EventEmitter<void>();
  @Input() botonHabilitado: boolean = true;

  clickHijo() {
    this.clickDelPadre.emit(); // Emite un evento al hacer clic
  }
}
