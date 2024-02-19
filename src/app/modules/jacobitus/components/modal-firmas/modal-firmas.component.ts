import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IFirmaSendByCode } from '../../common/interfaces/jacobitus-validar-pdf-response.inteface';

@Component({
  selector: 'app-modal-firmas',
  templateUrl: './modal-firmas.component.html',
  styleUrls: ['./modal-firmas.component.scss'],
})
export class ModalFirmasComponent {
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Input() firmaDetalle: IFirmaSendByCode[] = [];

  close(): void {
    this.closeModal.emit();
    this.isVisible = false;
  }
}
