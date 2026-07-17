import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastPayload, ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit, OnDestroy{
  message = '';
  type: 'success' | 'error' = 'success';
  visible = false;
  private sub?: Subscription;
  private hideTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sub = this.toastService.toast$.subscribe((payload) => this.show(payload));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    if (this.hideTimer) clearTimeout(this.hideTimer);
  }

  private show(payload: ToastPayload): void {
    if (!payload?.message?.trim()) return;

    this.message = payload.message.trim();
    this.type = payload.type;
    this.visible = true;
    this.cdr.markForCheck();
    this.cdr.detectChanges();

    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.hideTimer = setTimeout(() => {
      this.visible = false;
      this.cdr.detectChanges();
    }, 3200);
  }
}
