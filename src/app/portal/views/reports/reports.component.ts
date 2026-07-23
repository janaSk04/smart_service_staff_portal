import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { StaffRole } from '../../../core/models/portal.models';
import { ReportRun, ReportsService, ReportTemplate } from '../../../core/services/reports.service';
import { DashboardStat } from '../../../core/services/portal-data.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit, OnDestroy{
  role: StaffRole | null = null;
  pageTitle = 'Reports';
  pageSubtitle = 'Generate, download, and track report runs';
  templates: ReportTemplate[] = [];
  history: ReportRun[] = [];
  stats: DashboardStat[] = [];
  page = 1;
  readonly pageSize = 5;
  private refreshTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private reports: ReportsService,
    private auth: AuthService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.role = this.auth.getRole();
    if (this.role === 'agent') {
      this.pageTitle = 'Reports & Analytics';
      this.pageSubtitle = 'Generate and export system reports';
    }
    this.templates = this.reports.getTemplates();
    this.refreshData();
    this.refreshTimer = setInterval(() => {
      this.refreshData();
      this.cdr.markForCheck();
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
  }

  get pagedHistory(): ReportRun[] {
    const start = (this.page - 1) * this.pageSize;
    return this.history.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.history.length / this.pageSize));
  }

  statusBadge(status: string): string {
    return status === 'ready' ? 'badge-green' : 'badge-yellow';
  }

  generate(templateId: string): void {
    const tpl = this.templates.find((t) => t.id === templateId);
    const run = this.reports.generateReport(templateId);
    if (!run || !tpl) return;
    this.refreshData();
    this.page = 1;
    this.toast.show(`Generating ${tpl.name}...`);
    setTimeout(() => {
      this.refreshData();
      this.cdr.markForCheck();
      this.toast.show(`${tpl.name} is ready.`);
    }, 950);
  }

  clearHistory(): void {
    if (!window.confirm('Clear report generation history?')) return;
    this.reports.clearHistory();
    this.refreshData();
    this.page = 1;
    this.toast.show('Report history cleared.');
  }

  viewReport(run: ReportRun): void {
    this.toast.show(`Viewing ${run.name}`);
  }

  download(run: ReportRun): void {
    const item = this.reports.downloadReport(run.id);
    if (item) this.toast.show(`Downloaded ${item.name}.`);
  }

  prevPage(): void {
    if (this.page > 1) this.page--;
  }

  nextPage(): void {
    if (this.page < this.totalPages) this.page++;
  }

  private refreshData(): void {
    this.history = this.reports.getHistory();
    this.stats = [
      {
        icon: 'fa-file-circle-check',
        label: 'Generated Today',
        value: String(this.reports.getGeneratedTodayCount()),
        scColor: '#4f8ef7',
        iconBg: '#eef4fe',
        iconColor: '#2563eb',
        delta: 'Auto + manual runs',
        deltaDir: 'up',
      },
      {
        icon: 'fa-clock',
        label: 'Pending Jobs',
        value: '2',
        scColor: '#f59e0b',
        iconBg: '#fef3c7',
        iconColor: '#92400e',
        delta: 'Queued in export worker',
        deltaDir: 'down',
      },
      {
        icon: 'fa-download',
        label: 'Downloads (7d)',
        value: '138',
        scColor: '#10b981',
        iconBg: '#d1fae5',
        iconColor: '#065f46',
        delta: '+18% vs previous',
        deltaDir: 'up',
      },
      {
        icon: 'fa-hard-drive',
        label: 'Storage Used',
        value: '1.4 GB',
        scColor: '#8b5cf6',
        iconBg: '#f3e8ff',
        iconColor: '#6b21a8',
        delta: 'Report artifacts',
        deltaDir: 'up',
      },
    ];
  }
}

