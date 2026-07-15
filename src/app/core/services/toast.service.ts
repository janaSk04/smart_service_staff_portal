import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'success' | 'error';

export interface ToastPayload {
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})

export class ToastService {
  private readonly toastSubject = new Subject<ToastPayload>();
  readonly toast$ = this.toastSubject.asObservable();

  constructor(private ngZone: NgZone) {}

  show(message: string, type: ToastType = 'success'): void {
    const text = (message ?? '').trim();
    if (!text) return;

    this.ngZone.run(() => {
      this.toastSubject.next({ message: text, type });
    });
  }
}
