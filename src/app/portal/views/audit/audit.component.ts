import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuditLogEntry, AuditService, AuditSeverityFilter } from '../../../core/services/audit.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.css'
})
export class AuditComponent implements OnInit{
severityFilter: AuditSeverityFilter = 'all';
  logs: AuditLogEntry[] = [];
  page = 1;
  readonly pageSize = 6;

  constructor(
    private audit: AuditService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.refreshLogs();
  }

  onFilterChange(): void {
    this.page = 1;
    this.refreshLogs();
  }

  severityBadge(severity: string): string {
    if (severity === 'high') return 'badge-red';
    if (severity === 'medium') return 'badge-yellow';
    return 'badge-blue';
  }

  viewLog(id: string): void {
    this.toast.show(`Viewing audit log ${id}`);
  }

  exportCsv(): void {
    const csv = this.audit.exportCsv(this.severityFilter);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.audit.downloadFilename();
    a.click();
    URL.revokeObjectURL(url);
    this.toast.show('Audit logs exported.');
  }

  get pagedLogs(): AuditLogEntry[] {
    const start = (this.page - 1) * this.pageSize;
    return this.logs.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.logs.length / this.pageSize));
  }

  prevPage(): void {
    if (this.page > 1) this.page--;
  }

  nextPage(): void {
    if (this.page < this.totalPages) this.page++;
  }

  private refreshLogs(): void {
    this.logs = this.audit.getLogs(this.severityFilter);
  }
}

