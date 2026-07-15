import { Injectable } from '@angular/core';
import { StaffRole } from '../models/portal.models';

export type RequestStatus = 'progress' | 'pending' | 'scheduled' | 'completed' | 'overdue';
export type AgentHealth = 'green' | 'yellow' | 'orange' | 'red';

export interface AdminRequest {
  id: string;
  service: string;
  customer: string;
  agent: string;
  tech: string;
  priority: string;
  status: RequestStatus;
}

export interface AdminAgent {
  id: string;
  av: string;
  avColor: string;
  name: string;
  zone: string;
  open: number;
  pct: string;
  health: AgentHealth;
}

export interface DashboardStat {
  icon: string;
  label: string;
  value: string;
  scColor: string;
  iconBg: string;
  iconColor: string;
  delta: string;
  deltaDir: 'up' | 'down';
}

export interface ActivityItem {
  icon: string;
  color: string;
  bg: string;
  title: string;
  desc: string;
  time: string;
}

export interface DonutSegment {
  value: number;
  color: string;
  label: string;
  count: string;
}

export type TechStatus = 'available' | 'busy' | 'offline';
export type JobPriority = 'critical' | 'high' | 'normal' | 'low';

export interface AgentQueueItem {
  id: string;
  service: string;
  customer: string;
  priority: JobPriority;
  assignedTo: string;
}

export interface SlaItem {
  label: string;
  pct: string;
  color: string;
}

export interface TechListItem {
  av: string;
  color: string;
  name: string;
  role: string;
  status: TechStatus;
  load: string;
}

export interface TimelineItem {
  icon: string;
  color: string;
  bg: string;
  title: string;
  desc: string;
  time: string;
}

export interface TechKpi {
  value: string;
  label: string;
  color: string;
}

export interface TechJob {
  id: string;
  service: string;
  customer: string;
  phone: string;
  address: string;
  due: string;
  amount?: string;
  statusLabel: string;
  statusBadge: string;
  borderColor: string;
  variant: 'enroute' | 'progress' | 'scheduled';
  filterStatus?: JobFilterStatus;
}

export type JobFilterStatus = 'enroute' | 'progress' | 'scheduled' | 'completed';
export type JobFilterOption = 'all' | JobFilterStatus;

export interface ScheduleDayChip {
  label: string;
  bg: string;
}

export interface ScheduleCalendarDay {
  day: number;
  isToday: boolean;
  chips: ScheduleDayChip[];
}

export type HistoryPeriod = 'today' | 'week' | 'month' | 'all';

export interface JobHistoryRecord {
  id: string;
  service: string;
  customer: string;
  address: string;
  completedAt: string;
  completedDate: string;
  amount: string;
  rating: number;
  period: HistoryPeriod;
}

export interface TechCertification {
  id: string;
  name: string;
  issuer: string;
  expiry: string;
  status: 'valid' | 'expiring' | 'expired';
}

export interface TechProfileData {
  phone: string;
  address: string;
  zone: string;
  specialty: string;
  employeeId: string;
  joined: string;
  emergencyName: string;
  emergencyPhone: string;
  notifyJobs: boolean;
  notifyChat: boolean;
  notifyPromo: boolean;
  certifications: TechCertification[];
}

export interface AdminTechnician {
  id: string;
  av: string;
  color: string;
  name: string;
  spec: string;
  zone: string;
  jobs: number;
  rating: string;
  status: TechStatus;
}

export type RequestFilterOption = 'all' | 'open' | 'progress' | 'completed' | 'overdue';
export type AssignmentFilterOption = 'pending' | 'confirmed' | 'all';

export interface AdminUser {
  id: string;
  av: string;
  color: string;
  name: string;
  email: string;
  role: 'Admin' | 'Agent' | 'Technician';
  dept: string;
  status: 'active' | 'inactive';
  lastActive: string;
}

export interface ZoneSlaRow {
  zone: string;
  completed: number;
  avgEta: string;
  sla: string;
  slaBadge: string;
}

export interface TopTechnicianRow {
  name: string;
  jobs: number;
  onTime: string;
  rating: number;
}

@Injectable({ providedIn: 'root' })
export class PortalDataService {
  readonly adminStats: DashboardStat[] = [
    { icon: 'fa-ticket', label: 'Total Requests', value: '1,842', scColor: '#4f8ef7', iconBg: '#eef4fe', iconColor: '#2563eb', delta: '+12% this week', deltaDir: 'up' },
    { icon: 'fa-circle-check', label: 'Completed Today', value: '148', scColor: '#10b981', iconBg: '#d1fae5', iconColor: '#065f46', delta: '+8 since yesterday', deltaDir: 'up' },
    { icon: 'fa-hourglass-half', label: 'In Progress', value: '67', scColor: '#f59e0b', iconBg: '#fef3c7', iconColor: '#92400e', delta: '3 near SLA breach', deltaDir: 'down' },
    { icon: 'fa-users', label: 'Active Users', value: '312', scColor: '#8b5cf6', iconBg: '#f3e8ff', iconColor: '#6b21a8', delta: '+5 this month', deltaDir: 'up' },
    { icon: 'fa-screwdriver-wrench', label: 'Technicians', value: '84', scColor: '#f97316', iconBg: '#ffedd5', iconColor: '#9a3412', delta: '72 on shift', deltaDir: 'up' },
    { icon: 'fa-star', label: 'Avg CSAT', value: '4.87', scColor: '#ec4899', iconBg: '#fce7f3', iconColor: '#9d174d', delta: '↑ 0.12 pts', deltaDir: 'up' },
  ];

  readonly weekChartData = [62, 78, 55, 89, 94, 71, 85];
  readonly weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  readonly statusDonut: DonutSegment[] = [
    { value: 42, color: '#10b981', label: 'Completed', count: '774' },
    { value: 28, color: '#f59e0b', label: 'In Progress', count: '515' },
    { value: 18, color: '#4f8ef7', label: 'Scheduled', count: '331' },
    { value: 12, color: '#ef4444', label: 'Overdue', count: '221' },
  ];

  readonly activities: ActivityItem[] = [
    { icon: 'fa-user-plus', color: '#4f8ef7', bg: '#eef4fe', title: 'New technician onboarded', desc: 'Chamara Tissa added to Colombo zone', time: '2m ago' },
    { icon: 'fa-exclamation-triangle', color: '#ef4444', bg: '#fee2e2', title: 'SLA breach detected', desc: 'REQ-0320 overdue by 45 minutes', time: '8m ago' },
    { icon: 'fa-circle-check', color: '#10b981', bg: '#d1fae5', title: 'Bulk requests completed', desc: 'Zone 4 — 12 garbage pickups done', time: '15m ago' },
    { icon: 'fa-user-slash', color: '#f59e0b', bg: '#fef3c7', title: 'Agent reassigned', desc: 'Nadeesha moved to Zone 2', time: '1h ago' },
    { icon: 'fa-chart-line', color: '#8b5cf6', bg: '#f3e8ff', title: 'Weekly report ready', desc: 'Download Q1 2026 summary', time: '2h ago' },
  ];

  readonly mapPins = [
    { top: '30%', left: '40%', delay: '0s' },
    { top: '55%', left: '60%', delay: '.5s' },
    { top: '45%', left: '25%', delay: '1s' },
    { top: '70%', left: '70%', delay: '1.5s' },
    { top: '20%', left: '75%', delay: '.3s' },
  ];

  readonly adminRequests: AdminRequest[] = [
    { id: 'REQ-0341', service: 'Garbage Pickup', customer: 'Priya M.', agent: 'Nadeesha S.', tech: 'Roshan F.', priority: 'normal', status: 'progress' },
    { id: 'REQ-0338', service: 'Plumbing Repair', customer: 'Kamal S.', agent: 'Nadeesha S.', tech: 'Amal W.', priority: 'critical', status: 'progress' },
    { id: 'REQ-0337', service: 'Deep Cleaning', customer: 'Amara P.', agent: 'Kasun P.', tech: 'Chamara T.', priority: 'normal', status: 'scheduled' },
    { id: 'REQ-0335', service: 'Pest Control', customer: 'Dilshan R.', agent: 'Dimali W.', tech: 'Pradeep L.', priority: 'high', status: 'completed' },
    { id: 'REQ-0334', service: 'Electrical', customer: 'Nimali K.', agent: 'Nadeesha S.', tech: 'Kasun P.', priority: 'normal', status: 'progress' },
    { id: 'REQ-0320', service: 'Electrical', customer: 'Nimali K.', agent: 'Nadeesha S.', tech: 'Kasun P.', priority: 'high', status: 'overdue' },
  ];

  readonly adminAgents: AdminAgent[] = [
    { id: 'AG-001', av: 'NS', avColor: '#10c27a', name: 'Nadeesha S.', zone: 'Zone 1', open: 18, pct: '94%', health: 'green' },
    { id: 'AG-002', av: 'KP', avColor: '#4f8ef7', name: 'Kasun P.', zone: 'Zone 2', open: 23, pct: '88%', health: 'yellow' },
    { id: 'AG-003', av: 'DW', avColor: '#8b5cf6', name: 'Dimali W.', zone: 'Zone 3', open: 11, pct: '97%', health: 'green' },
    { id: 'AG-004', av: 'RL', avColor: '#f97316', name: 'Rohan L.', zone: 'Zone 4', open: 29, pct: '79%', health: 'orange' },
  ];

  getRecentRequests(limit = 5): AdminRequest[] {
    return this.adminRequests.slice(0, limit);
  }

  getTopAgents(limit = 5): AdminAgent[] {
    return this.adminAgents.slice(0, limit);
  }

  readonly agentStats: DashboardStat[] = [
    { icon: 'fa-inbox', label: 'Queue', value: '18', scColor: '#10c27a', iconBg: '#e6faf3', iconColor: '#065f46', delta: '5 high priority', deltaDir: 'down' },
    { icon: 'fa-arrows-spin', label: 'Assigned Today', value: '34', scColor: '#10c27a', iconBg: '#e6faf3', iconColor: '#065f46', delta: '+8 since morning', deltaDir: 'up' },
    { icon: 'fa-hourglass', label: 'Near SLA Breach', value: '4', scColor: '#ef4444', iconBg: '#fee2e2', iconColor: '#991b1b', delta: 'Needs attention', deltaDir: 'down' },
    { icon: 'fa-star', label: 'Avg Team Rating', value: '4.7', scColor: '#f59e0b', iconBg: '#fef3c7', iconColor: '#92400e', delta: '↑ 0.2 this week', deltaDir: 'up' },
  ];

  readonly agentQueue: AgentQueueItem[] = [
    { id: 'REQ-0341', service: 'Garbage Pickup', customer: 'Priya M.', priority: 'high', assignedTo: 'Roshan F.' },
    { id: 'REQ-0342', service: 'Plumbing', customer: 'Kamal S.', priority: 'critical', assignedTo: 'Amal W.' },
    { id: 'REQ-0343', service: 'Deep Clean', customer: 'Amara P.', priority: 'normal', assignedTo: 'Chamara T.' },
    { id: 'REQ-0344', service: 'Recycling', customer: 'Dilshan R.', priority: 'normal', assignedTo: 'Nimal S.' },
    { id: 'REQ-0345', service: 'Electrical', customer: 'Nimali K.', priority: 'high', assignedTo: 'Kasun P.' },
    { id: 'REQ-0346', service: 'Pest Control', customer: 'Ramya D.', priority: 'normal', assignedTo: 'Pradeep L.' },
  ];

  readonly slaItems: SlaItem[] = [
    { label: 'Garbage Collection', pct: '78%', color: '#10b981' },
    { label: 'Plumbing Repairs', pct: '91%', color: '#4f8ef7' },
    { label: 'Electrical', pct: '65%', color: '#f59e0b' },
    { label: 'Deep Cleaning', pct: '44%', color: '#ef4444' },
  ];

  readonly agentChartData = [14, 22, 18, 31, 27, 19, 24];

  readonly myTechnicians: TechListItem[] = [
    { av: 'RF', color: '#f97316', name: 'Roshan Fernando', role: 'Garbage · Zone 1', status: 'available', load: '3 jobs' },
    { av: 'AW', color: '#4f8ef7', name: 'Amal Wickrama', role: 'Plumbing · Zone 1', status: 'busy', load: '2 jobs' },
    { av: 'CT', color: '#8b5cf6', name: 'Chamara Tissa', role: 'Cleaning · Zone 1', status: 'available', load: '1 job' },
    { av: 'NS', color: '#10b981', name: 'Nimal Senevirathna', role: 'Recycling · Zone 1', status: 'busy', load: '4 jobs' },
    { av: 'KP', color: '#ec4899', name: 'Kasun Perera', role: 'Electrical · Zone 1', status: 'offline', load: '0 jobs' },
  ];

  readonly agentTimeline: TimelineItem[] = [
    { icon: 'fa-check', color: '#10b981', bg: '#d1fae5', title: 'Roshan — Garbage Pickup', desc: 'REQ-0320 completed at 44 Temple Rd', time: '08:15 AM' },
    { icon: 'fa-arrows-spin', color: '#4f8ef7', bg: '#dbeafe', title: 'Amal — Assigned Plumbing', desc: 'REQ-0338 dispatched to Galle Rd', time: '09:30 AM' },
    { icon: 'fa-exclamation', color: '#f59e0b', bg: '#fef3c7', title: 'SLA Warning', desc: 'REQ-0335 approaching deadline', time: '10:45 AM' },
    { icon: 'fa-circle', color: '#10b981', bg: '#d1fae5', title: 'Chamara — En Route', desc: 'REQ-0341 heading to Colombo 07', time: '11:00 AM' },
    { icon: 'fa-calendar', color: '#8b5cf6', bg: '#f3e8ff', title: 'Bulk Recycling Start', desc: '4 pickups scheduled for afternoon', time: '02:00 PM' },
  ];

  readonly techKpis: TechKpi[] = [
    { value: '4', label: 'Jobs Today', color: '#f97316' },
    { value: '2', label: 'Completed', color: '#10b981' },
    { value: '1', label: 'En Route', color: '#4f8ef7' },
    { value: '4.9', label: 'My Rating', color: '#f59e0b' },
    { value: 'LKR 4,200', label: 'Today Earnings', color: '#8b5cf6' },
  ];

  readonly techJobs: TechJob[] = [
    {
      id: 'REQ-2026-0341',
      service: 'Garbage Collection',
      customer: 'Priya Mendis',
      phone: '+94 77 234 5678',
      address: '123 Galle Rd, Col 03',
      due: '11:00 AM',
      statusLabel: 'En Route',
      statusBadge: 'badge-blue',
      borderColor: '#4f8ef7',
      variant: 'enroute',
    },
    {
      id: 'REQ-2026-0338',
      service: 'Plumbing Repair',
      customer: 'Kamal Silva',
      phone: '+94 71 456 7890',
      address: '45 Ward Pl, Col 07',
      due: '1:00 PM',
      statusLabel: 'In Progress',
      statusBadge: 'badge-green',
      borderColor: '#10b981',
      variant: 'progress',
    },
    {
      id: 'REQ-2026-0345',
      service: 'Recycling Pickup',
      customer: 'Nimali Kumari',
      phone: '+94 76 789 0123',
      address: '87 Rajagiriya Rd',
      due: '3:00 PM',
      statusLabel: 'Scheduled',
      statusBadge: 'badge-yellow',
      borderColor: '#f59e0b',
      variant: 'scheduled',
    },
  ];

  readonly techEarningsChartData = [2400, 3100, 2800, 3500, 2900, 1800, 1900];
  readonly techEarningsLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  readonly techRating = 4.9;
  readonly techJobsDone = 148;
  readonly techOnTimeRate = '96%';
  readonly techWeekEarnings = 'LKR 18,400';

  readonly techCompletedToday: TimelineItem[] = [
    { icon: 'fa-check', color: '#10b981', bg: '#d1fae5', title: 'Garbage Collection', desc: 'REQ-0320 — Completed 08:45 AM', time: '4.9 ★' },
    { icon: 'fa-check', color: '#10b981', bg: '#d1fae5', title: 'Electrical Repair', desc: 'REQ-0315 — Completed 10:15 AM', time: '5.0 ★' },
  ];

  readonly techAllJobs: TechJob[] = [
    {
      id: 'REQ-0341',
      service: 'Garbage Collection',
      customer: 'Priya Mendis',
      phone: '+94 77 234 5678',
      address: '123 Galle Rd, Col 03',
      due: '11:00 AM',
      amount: 'LKR 800',
      statusLabel: 'En Route',
      statusBadge: 'badge-blue',
      borderColor: '#4f8ef7',
      variant: 'enroute',
      filterStatus: 'enroute',
    },
    {
      id: 'REQ-0338',
      service: 'Plumbing Repair',
      customer: 'Kamal Silva',
      phone: '+94 71 456 7890',
      address: '45 Ward Pl, Col 07',
      due: '1:00 PM',
      amount: 'LKR 1,500',
      statusLabel: 'In Progress',
      statusBadge: 'badge-green',
      borderColor: '#10b981',
      variant: 'progress',
      filterStatus: 'progress',
    },
    {
      id: 'REQ-0345',
      service: 'Recycling Pickup',
      customer: 'Nimali Kumari',
      phone: '+94 76 789 0123',
      address: '87 Rajagiriya Rd',
      due: '3:00 PM',
      amount: 'LKR 600',
      statusLabel: 'Scheduled',
      statusBadge: 'badge-yellow',
      borderColor: '#f59e0b',
      variant: 'scheduled',
      filterStatus: 'scheduled',
    },
    {
      id: 'REQ-0350',
      service: 'Pest Control',
      customer: 'Amara Perera',
      phone: '+94 72 345 6789',
      address: '12 Cinnamon Gdns',
      due: '5:00 PM',
      amount: 'LKR 3,000',
      statusLabel: 'Scheduled',
      statusBadge: 'badge-yellow',
      borderColor: '#f59e0b',
      variant: 'scheduled',
      filterStatus: 'scheduled',
    },
  ];

  readonly scheduleMonthLabel = 'March 2026';
  readonly scheduleWeekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  readonly scheduleTodayDay = 8;

  readonly scheduleCalendarDays: ScheduleCalendarDay[] = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const chips: ScheduleDayChip[] = [];
    if (day === 8) chips.push({ label: '3 jobs', bg: 'var(--accent)' });
    if (day === 10) chips.push({ label: '2 jobs', bg: '#10b981' });
    if (day === 14) chips.push({ label: '5 jobs', bg: '#f59e0b' });
    return { day, isToday: day === 8, chips };
  });

  readonly scheduleDayEvents: Record<number, ScheduleDayChip[]> = {
    8: [
      { label: '11:00 AM — Garbage Collection', bg: 'var(--accent)' },
      { label: '1:00 PM — Plumbing Repair', bg: '#10b981' },
      { label: '3:00 PM — Recycling Pickup', bg: '#f59e0b' },
    ],
    10: [
      { label: '9:00 AM — Deep Cleaning', bg: '#10b981' },
      { label: '2:00 PM — Pest Control', bg: '#8b5cf6' },
    ],
    14: [
      { label: '8:00 AM — Electrical Repair', bg: '#f59e0b' },
      { label: '10:30 AM — Garbage Collection', bg: 'var(--accent)' },
      { label: '1:00 PM — Plumbing', bg: '#10b981' },
      { label: '3:30 PM — Recycling', bg: '#8b5cf6' },
      { label: '5:00 PM — Deep Cleaning', bg: '#ef4444' },
    ],
  };

  getScheduleEventsForDay(day: number): ScheduleDayChip[] {
    return this.scheduleDayEvents[day] ?? this.scheduleCalendarDays.find((d) => d.day === day)?.chips ?? [];
  }

  getTechJobs(filter: JobFilterOption = 'all'): TechJob[] {
    if (filter === 'all') return this.techAllJobs;
    return this.techAllJobs.filter((j) => j.filterStatus === filter);
  }

  readonly historyStats = [
    { value: '148', label: 'Total Completed', color: '#10b981' },
    { value: 'LKR 42,800', label: 'This Month', color: '#8b5cf6' },
    { value: '4.9', label: 'Avg Rating', color: '#f59e0b' },
    { value: '96%', label: 'On-Time Rate', color: '#4f8ef7' },
  ];

  readonly jobHistory: JobHistoryRecord[] = [
    { id: 'REQ-0320', service: 'Garbage Collection', customer: 'Priya Mendis', address: '44 Temple Rd, Col 04', completedAt: '08:45 AM', completedDate: '2026-03-08', amount: 'LKR 800', rating: 4.9, period: 'today' },
    { id: 'REQ-0315', service: 'Electrical Repair', customer: 'Nimali Kumari', address: '12 Ward Pl, Col 07', completedAt: '10:15 AM', completedDate: '2026-03-08', amount: 'LKR 2,200', rating: 5.0, period: 'today' },
    { id: 'REQ-0310', service: 'Recycling Pickup', customer: 'Dilshan Rajapaksa', address: '78 Baseline Rd', completedAt: '04:30 PM', completedDate: '2026-03-07', amount: 'LKR 600', rating: 4.8, period: 'week' },
    { id: 'REQ-0305', service: 'Plumbing Repair', customer: 'Kamal Silva', address: '22 Galle Rd, Col 03', completedAt: '02:10 PM', completedDate: '2026-03-07', amount: 'LKR 1,500', rating: 4.7, period: 'week' },
    { id: 'REQ-0298', service: 'Deep Cleaning', customer: 'Amara Perera', address: '5 Cinnamon Gdns', completedAt: '11:00 AM', completedDate: '2026-03-05', amount: 'LKR 3,200', rating: 5.0, period: 'week' },
    { id: 'REQ-0285', service: 'Pest Control', customer: 'Ramya Dias', address: '90 Rajagiriya Rd', completedAt: '09:20 AM', completedDate: '2026-03-02', amount: 'LKR 3,000', rating: 4.9, period: 'month' },
    { id: 'REQ-0270', service: 'Garbage Collection', customer: 'Sunil Jayawardena', address: '33 Duplication Rd', completedAt: '07:55 AM', completedDate: '2026-02-28', amount: 'LKR 800', rating: 4.6, period: 'all' },
    { id: 'REQ-0255', service: 'Electrical Repair', customer: 'Chathuri Fernando', address: '61 Havelock Rd', completedAt: '03:40 PM', completedDate: '2026-02-20', amount: 'LKR 1,800', rating: 4.8, period: 'all' },
  ];

  readonly techProfile: TechProfileData = {
    phone: '+94 77 123 4567',
    address: '18 Station Rd, Colombo 04',
    zone: 'Zone 1 — Colombo Central',
    specialty: 'Garbage Collection · Recycling',
    employeeId: 'TEC-003',
    joined: '2024-06-15',
    emergencyName: 'Sandya Fernando',
    emergencyPhone: '+94 71 987 6543',
    notifyJobs: true,
    notifyChat: true,
    notifyPromo: false,
    certifications: [
      { id: 'cert-1', name: 'Waste Handling License', issuer: 'Western Province EPA', expiry: '2027-03-15', status: 'valid' },
      { id: 'cert-2', name: 'Occupational Safety (OSHA)', issuer: 'ServeX Academy', expiry: '2026-08-20', status: 'valid' },
      { id: 'cert-3', name: 'First Aid Certification', issuer: 'Red Cross Sri Lanka', expiry: '2026-04-10', status: 'expiring' },
      { id: 'cert-4', name: 'Heavy Vehicle Operation', issuer: 'DMV Sri Lanka', expiry: '2025-11-01', status: 'expired' },
    ],
  };

  getJobHistory(period: HistoryPeriod = 'all'): JobHistoryRecord[] {
    if (period === 'all') return this.jobHistory;
    if (period === 'today') return this.jobHistory.filter((r) => r.period === 'today');
    if (period === 'week') return this.jobHistory.filter((r) => r.period === 'today' || r.period === 'week');
    if (period === 'month') return this.jobHistory.filter((r) => r.period !== 'all');
    return this.jobHistory;
  }

  readonly adminTechnicians: AdminTechnician[] = [
    { id: 'TECH-001', av: 'RF', color: '#f97316', name: 'Roshan Fernando', spec: 'Waste Management', zone: 'Zone 1', jobs: 3, rating: '4.9', status: 'available' },
    { id: 'TECH-002', av: 'AW', color: '#4f8ef7', name: 'Amal Wickrama', spec: 'Plumbing', zone: 'Zone 1', jobs: 2, rating: '4.7', status: 'busy' },
    { id: 'TECH-003', av: 'CT', color: '#8b5cf6', name: 'Chamara Tissa', spec: 'Cleaning', zone: 'Zone 1', jobs: 1, rating: '4.8', status: 'available' },
    { id: 'TECH-004', av: 'NS', color: '#10b981', name: 'Nimal Senevirathna', spec: 'Recycling', zone: 'Zone 2', jobs: 4, rating: '4.6', status: 'busy' },
    { id: 'TECH-005', av: 'KP', color: '#ec4899', name: 'Kasun Perera', spec: 'Electrical', zone: 'Zone 2', jobs: 0, rating: '4.9', status: 'offline' },
    { id: 'TECH-006', av: 'PL', color: '#f59e0b', name: 'Pradeep Lankaputhra', spec: 'Pest Control', zone: 'Zone 3', jobs: 2, rating: '4.5', status: 'available' },
  ];

  readonly assignmentStats: DashboardStat[] = [
    { icon: 'fa-clock', label: 'Pending Assignments', value: '7', scColor: '#f59e0b', iconBg: '#fef3c7', iconColor: '#92400e', delta: 'Awaiting dispatch', deltaDir: 'down' },
    { icon: 'fa-arrows-spin', label: 'Assigned Today', value: '34', scColor: '#10c27a', iconBg: '#e6faf3', iconColor: '#065f46', delta: '+8 since morning', deltaDir: 'up' },
    { icon: 'fa-user-slash', label: 'Unassigned', value: '2', scColor: '#ef4444', iconBg: '#fee2e2', iconColor: '#991b1b', delta: 'Needs attention', deltaDir: 'down' },
    { icon: 'fa-hourglass', label: 'Near SLA Breach', value: '4', scColor: '#ef4444', iconBg: '#fee2e2', iconColor: '#991b1b', delta: 'Act within 1 hour', deltaDir: 'down' },
  ];

  readonly technicianStats = [
    { icon: 'fa-circle', label: 'Available', value: '0', scColor: '#10b981', iconBg: '#d1fae5', iconColor: '#065f46', delta: 'On standby', deltaDir: 'up' as const },
    { icon: 'fa-bolt', label: 'On Job', value: '0', scColor: '#f59e0b', iconBg: '#fef3c7', iconColor: '#92400e', delta: 'Active in field', deltaDir: 'up' as const },
    { icon: 'fa-moon', label: 'Offline', value: '0', scColor: '#94a3b8', iconBg: '#f3f4f6', iconColor: '#374151', delta: 'Off shift', deltaDir: 'down' as const },
  ];

  getTechnicianStatusStats(): DashboardStat[] {
    const avail = this.adminTechnicians.filter((t) => t.status === 'available').length;
    const busy = this.adminTechnicians.filter((t) => t.status === 'busy').length;
    const off = this.adminTechnicians.filter((t) => t.status === 'offline').length;
    return [
      { ...this.technicianStats[0], value: String(avail) },
      { ...this.technicianStats[1], value: String(busy) },
      { ...this.technicianStats[2], value: String(off) },
    ];
  }

  getRequestsForRole(role: StaffRole | null, agentName?: string): AdminRequest[] {
    let list = [...this.adminRequests];
    if (role === 'agent' && agentName) {
      const first = agentName.split(/\s+/)[0]?.toLowerCase();
      if (first) {
        list = list.filter((r) => r.agent.toLowerCase().includes(first));
      }
    }
    return list;
  }

  filterRequests(list: AdminRequest[], filter: RequestFilterOption): AdminRequest[] {
    if (filter === 'all') return list;
    if (filter === 'open') return list.filter((r) => r.status === 'scheduled' || r.status === 'pending');
    if (filter === 'progress') return list.filter((r) => r.status === 'progress');
    if (filter === 'completed') return list.filter((r) => r.status === 'completed');
    if (filter === 'overdue') return list.filter((r) => r.status === 'overdue');
    return list;
  }

  getTechniciansForRole(_role: StaffRole | null): AdminTechnician[] {
    return this.adminTechnicians;
  }

  techLoadPct(jobs: number): number {
    return Math.min(100, jobs * 20);
  }

  readonly adminUsers: AdminUser[] = [
    { id: 'USR-001', av: 'AP', color: '#4f8ef7', name: 'Arjun Perera', email: 'admin@servex.lk', role: 'Admin', dept: 'System', status: 'active', lastActive: 'Just now' },
    { id: 'USR-002', av: 'NS', color: '#10c27a', name: 'Nadeesha Silva', email: 'agent@servex.lk', role: 'Agent', dept: 'Zone 1', status: 'active', lastActive: '5m ago' },
    { id: 'USR-003', av: 'RF', color: '#f97316', name: 'Roshan Fernando', email: 'tech@servex.lk', role: 'Technician', dept: 'Zone 1', status: 'active', lastActive: '12m ago' },
    { id: 'USR-004', av: 'KP', color: '#8b5cf6', name: 'Kasun Perera', email: 'k.perera@servex.lk', role: 'Agent', dept: 'Zone 2', status: 'inactive', lastActive: '2d ago' },
    { id: 'USR-005', av: 'DT', color: '#ec4899', name: 'Dimali Tissera', email: 'd.tissera@servex.lk', role: 'Technician', dept: 'Zone 3', status: 'active', lastActive: '1h ago' },
    { id: 'USR-006', av: 'PM', color: '#14b8a6', name: 'Pradeep Madushan', email: 'p.madushan@servex.lk', role: 'Technician', dept: 'Zone 2', status: 'active', lastActive: '30m ago' },
  ];

  readonly analyticsStats: DashboardStat[] = [
    { icon: 'fa-chart-column', label: 'Requests / Day', value: '263', scColor: '#4f8ef7', iconBg: '#eef4fe', iconColor: '#2563eb', delta: '+11% vs last week', deltaDir: 'up' },
    { icon: 'fa-stopwatch', label: 'Avg Completion Time', value: '3h 18m', scColor: '#10b981', iconBg: '#d1fae5', iconColor: '#065f46', delta: '-14 mins improved', deltaDir: 'up' },
    { icon: 'fa-shield-halved', label: 'SLA Compliance', value: '92.4%', scColor: '#8b5cf6', iconBg: '#f3e8ff', iconColor: '#6b21a8', delta: '+1.9% this month', deltaDir: 'up' },
    { icon: 'fa-face-smile', label: 'CSAT', value: '4.86', scColor: '#f59e0b', iconBg: '#fef3c7', iconColor: '#92400e', delta: 'Stable high score', deltaDir: 'up' },
  ];

  readonly analyticsTrendData = [198, 215, 232, 221, 248, 256, 241, 263, 255, 270, 258, 272, 266, 263];
  readonly analyticsTrendLabels = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D14'];

  readonly zoneSlaRows: ZoneSlaRow[] = [
    { zone: 'Zone 1', completed: 182, avgEta: '2h 58m', sla: '95%', slaBadge: 'badge-green' },
    { zone: 'Zone 2', completed: 149, avgEta: '3h 22m', sla: '91%', slaBadge: 'badge-blue' },
    { zone: 'Zone 3', completed: 127, avgEta: '3h 49m', sla: '86%', slaBadge: 'badge-yellow' },
    { zone: 'Zone 4', completed: 104, avgEta: '4h 06m', sla: '82%', slaBadge: 'badge-orange' },
  ];

  readonly categoryDonut: DonutSegment[] = [
    { value: 32, color: '#4f8ef7', label: 'Waste', count: '32%' },
    { value: 27, color: '#10b981', label: 'Home Repair', count: '27%' },
    { value: 21, color: '#f59e0b', label: 'Cleaning', count: '21%' },
    { value: 20, color: '#8b5cf6', label: 'Travel', count: '20%' },
  ];

  readonly topTechnicians: TopTechnicianRow[] = [
    { name: 'Roshan Fernando', jobs: 44, onTime: '97%', rating: 4.9 },
    { name: 'Amal Wickrama', jobs: 38, onTime: '95%', rating: 4.8 },
    { name: 'Chamara Tissa', jobs: 35, onTime: '94%', rating: 4.8 },
    { name: 'Nimal Senevirathna', jobs: 31, onTime: '92%', rating: 4.7 },
  ];
}
