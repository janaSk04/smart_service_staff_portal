export interface ChartBar {
  heightPct: number;
  highlight: boolean;
  delay: string;
  value: number;
}

export interface DonutArc {
  color: string;
  dashArray: string;
  dashOffset: number;
}

const STATUS_LABELS: Record<string, [string, string]> = {
  progress: ['badge-blue', 'In Progress'],
  pending: ['badge-yellow', 'Pending'],
  scheduled: ['badge-purple', 'Scheduled'],
  completed: ['badge-green', 'Completed'],
  overdue: ['badge-red', 'Overdue'],
};

const HEALTH_COLORS: Record<string, { text: string; bg: string }> = {
  green: { text: '#10b981', bg: '#d1fae5' },
  yellow: { text: '#f59e0b', bg: '#fef3c7' },
  orange: { text: '#f97316', bg: '#ffedd5' },
  red: { text: '#ef4444', bg: '#fee2e2' },
};

export function buildChartBars(data: number[]): ChartBar[] {
  const max = Math.max(...data);
  const todayIndex = new Date().getDay() - 1;
  return data.map((value, index) => ({
    value,
    heightPct: max ? (value / max) * 100 : 0,
    highlight: index === todayIndex,
    delay: `${index * 0.06}s`,
  }));
}

export function buildDonutArcs(
  segments: { value: number; color: string }[],
  radius = 46,
  cx = 60,
  cy = 60
): DonutArc[] {
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  let offset = -circumference * 0.25;

  return segments.map((seg) => {
    const dash = total ? (seg.value / total) * circumference : 0;
    const arc: DonutArc = {
      color: seg.color,
      dashArray: `${Math.max(dash - 2, 0)} ${circumference - dash + 2}`,
      dashOffset: -offset,
    };
    offset -= dash;
    return arc;
  });
}

export function getRequestStatusBadge(status: string): { cls: string; label: string } {
  const [cls, label] = STATUS_LABELS[status] ?? ['badge-gray', status];
  return { cls, label };
}

export function getAgentHealthStyle(health: string): { color: string; background: string } {
  const style = HEALTH_COLORS[health] ?? HEALTH_COLORS['green'];
  return { color: style.text, background: style.bg };
}

const PRIORITY_LABELS: Record<string, [string, string]> = {
  critical: ['badge-red', 'Critical'],
  high: ['badge-orange', 'High'],
  normal: ['badge-blue', 'Normal'],
  low: ['badge-gray', 'Low'],
};

const TECH_STATUS_LABELS: Record<string, string> = {
  available: 'Available',
  busy: 'On Job',
  offline: 'Offline',
};

const TECH_STATUS_DOT: Record<string, string> = {
  available: 'dot-available',
  busy: 'dot-busy',
  offline: 'dot-offline',
};

export function getPriorityBadge(priority: string): { cls: string; label: string } {
  const [cls, label] = PRIORITY_LABELS[priority] ?? ['badge-gray', 'Normal'];
  return { cls, label };
}

export function getTechStatusLabel(status: string): string {
  return TECH_STATUS_LABELS[status] ?? status;
}

export function getTechStatusDot(status: string): string {
  return TECH_STATUS_DOT[status] ?? 'dot-offline';
}

export function getTechStatusBadge(status: string): string {
  const map: Record<string, string> = {
    available: 'badge-green',
    busy: 'badge-yellow',
    offline: 'badge-gray',
  };
  return map[status] ?? 'badge-gray';
}

export function getPriorityRawBadge(priority: string): string {
  const map: Record<string, string> = {
    critical: 'badge-red',
    high: 'badge-orange',
    normal: 'badge-blue',
    low: 'badge-gray',
  };
  return map[priority] ?? 'badge-gray';
}

const COMPLAINT_STATUS_LABELS: Record<string, [string, string]> = {
  open: ['badge-red', 'Open'],
  investigating: ['badge-orange', 'Investigating'],
  escalated: ['badge-purple', 'Escalated'],
  resolved: ['badge-green', 'Resolved'],
};

const COMPLAINT_SEVERITY_LABELS: Record<string, [string, string]> = {
  critical: ['badge-red', 'Critical'],
  high: ['badge-orange', 'High'],
  medium: ['badge-yellow', 'Medium'],
  low: ['badge-gray', 'Low'],
};

export function getComplaintStatusBadge(status: string): { cls: string; label: string } {
  const [cls, label] = COMPLAINT_STATUS_LABELS[status] ?? ['badge-gray', status];
  return { cls, label };
}

export function getComplaintSeverityBadge(severity: string): { cls: string; label: string } {
  const [cls, label] = COMPLAINT_SEVERITY_LABELS[severity] ?? ['badge-gray', severity];
  return { cls, label };
}

export function getUserRoleBadge(role: string): string {
  const map: Record<string, string> = {
    Admin: 'badge-blue',
    Agent: 'badge-green',
    Technician: 'badge-orange',
  };
  return map[role] ?? 'badge-gray';
}

export function getUserStatusBadge(status: string): string {
  return status === 'active' ? 'badge-green' : 'badge-gray';
}

export function parsePct(pct: string): number {
  return parseInt(pct, 10) || 0;
}