import { Injectable } from '@angular/core';

export type AuditSeverity = 'high' | 'medium' | 'low';
export type AuditSeverityFilter = 'all' | AuditSeverity;

export interface AuditLogEntry {
  id: string;
  actor: string;
  role: string;
  action: string;
  entity: string;
  severity: AuditSeverity;
  time: string;
}

const STORAGE_KEY = 'servex_audit_logs';

const DEFAULT_LOGS: AuditLogEntry[] = [
  { id: 'AUD-9012', actor: 'Arjun Perera', role: 'admin', action: 'Updated SLA threshold', entity: 'Settings', severity: 'medium', time: '2026-03-26 10:14:22' },
  { id: 'AUD-9011', actor: 'Nadeesha Silva', role: 'agent', action: 'Reassigned REQ-0342', entity: 'Request', severity: 'low', time: '2026-03-26 09:51:07' },
  { id: 'AUD-9010', actor: 'Roshan Fernando', role: 'technician', action: 'Uploaded completion photos', entity: 'Job', severity: 'low', time: '2026-03-26 09:22:11' },
  { id: 'AUD-9009', actor: 'System', role: 'system', action: 'Auto escalated SLA breach', entity: 'SLA', severity: 'high', time: '2026-03-26 08:58:40' },
  { id: 'AUD-9008', actor: 'Arjun Perera', role: 'admin', action: 'Disabled user account', entity: 'User', severity: 'high', time: '2026-03-25 17:44:02' },
];

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private logs: AuditLogEntry[] = [];

  constructor() {
    this.loadLogs();
  }

  getLogs(severity: AuditSeverityFilter = 'all'): AuditLogEntry[] {
    if (severity === 'all') return this.logs;
    return this.logs.filter((l) => l.severity === severity);
  }

  exportCsv(severity: AuditSeverityFilter = 'all'): string {
    const rows = this.getLogs(severity);
    const header = 'id,actor,role,action,entity,severity,time';
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    return [header, ...rows.map((r) => [r.id, r.actor, r.role, r.action, r.entity, r.severity, r.time].map(escape).join(','))].join('\n');
  }

  downloadFilename(): string {
    return `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;
  }

  private loadLogs(): void {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      this.logs = Array.isArray(saved) && saved.length ? saved : [...DEFAULT_LOGS];
    } catch {
      this.logs = [...DEFAULT_LOGS];
    }
  }
}
