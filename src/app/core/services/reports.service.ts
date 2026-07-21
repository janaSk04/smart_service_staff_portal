import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

export interface ReportTemplate {
  id: string;
  name: string;
  desc: string;
  freq: string;
  format: string;
}

export interface ReportRun {
  id: string;
  templateId: string;
  name: string;
  by: string;
  date: string;
  time: string;
  status: 'processing' | 'ready';
}

const STORAGE_KEY = 'servex_report_history';

const TEMPLATES: ReportTemplate[] = [
  { id: 'rpt-ops-daily', name: 'Daily Operations Report', desc: 'Volume, SLA, and completion trends by zone', freq: 'Daily', format: 'PDF' },
  { id: 'rpt-agent-weekly', name: 'Agent Performance Report', desc: 'Assignment efficiency and backlog movement', freq: 'Weekly', format: 'XLSX' },
  { id: 'rpt-tech-productivity', name: 'Technician Productivity', desc: 'Jobs completed, rating, on-time ratio', freq: 'Weekly', format: 'PDF' },
  { id: 'rpt-finance-monthly', name: 'Revenue & Payout Summary', desc: 'Service revenue, payout, and fees', freq: 'Monthly', format: 'CSV' },
];

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
private history: ReportRun[] = [];

  constructor(private auth: AuthService) {
    this.loadHistory();
  }

  getTemplates(): ReportTemplate[] {
    return TEMPLATES;
  }

  getHistory(): ReportRun[] {
    return this.history;
  }

  getGeneratedTodayCount(): number {
    const today = this.todayIso();
    return this.history.filter((r) => r.date === today).length;
  }

  generateReport(templateId: string): ReportRun | null {
    const tpl = TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return null;

    const run: ReportRun = {
      id: `RUN-${Date.now().toString().slice(-6)}`,
      templateId: tpl.id,
      name: tpl.name,
      by: this.auth.getUser()?.name || 'Admin',
      date: this.todayIso(),
      time: new Date().toLocaleString(),
      status: 'processing',
    };

    this.history.unshift(run);
    this.persistHistory();

    setTimeout(() => {
      const item = this.history.find((r) => r.id === run.id);
      if (item) {
        item.status = 'ready';
        this.persistHistory();
      }
    }, 900);

    return run;
  }

  clearHistory(): void {
    this.history = [];
    this.persistHistory();
  }

  downloadReport(runId: string): ReportRun | null {
    return this.history.find((r) => r.id === runId) ?? null;
  }

  private loadHistory(): void {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      this.history = Array.isArray(saved) ? saved : [];
    } catch {
      this.history = [];
    }
  }

  private persistHistory(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.history));
  }

  private todayIso(): string {
    return new Date().toISOString().slice(0, 10);
  }
}

