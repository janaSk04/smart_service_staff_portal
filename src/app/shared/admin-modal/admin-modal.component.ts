import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-modal',
  templateUrl: './admin-modal.component.html',
  styleUrl: './admin-modal.component.css'
})
export class AdminModalComponent {
  open = false;
  title = 'Details';
  bodyHtml = '';
  footHtml = '';

  close(event?: Event): void {
    if (event && event.target !== event.currentTarget) {
      return;
    }
    this.open = false;
  }
}
