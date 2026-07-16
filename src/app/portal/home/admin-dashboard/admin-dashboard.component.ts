import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ActivityItem, AdminAgent, AdminRequest, CustomerComplaint, DashboardStat, DonutSegment, PortalDataService } from '../../../core/services/portal-data.service';
import { buildChartBars, buildDonutArcs, ChartBar, DonutArc, getAgentHealthStyle, getComplaintSeverityBadge, getComplaintStatusBadge, getRequestStatusBadge } from '../../../core/utils/dashboard.util';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit{
  
  stats: DashboardStat[] = [];
  recentRequests: AdminRequest[] = [];
  agents: AdminAgent[] = [];
  activities: ActivityItem[] = [];
  complaints: CustomerComplaint[] = [];
  openComplaintCount = 0;
  statusDonut: DonutSegment[] = [];
  weekLabels: string[] = [];
  chartBars: ChartBar[] = [];
  donutArcs: DonutArc[] = [];
  mapPins: { top: string; left: string; delay: string }[] = [];
  subtitle = '';

  constructor(
    private data: PortalDataService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.stats = this.data.adminStats;
    this.recentRequests = this.data.getRecentRequests();
    this.agents = this.data.getTopAgents();
    this.activities = this.data.activities;
    this.refreshComplaints();
    this.statusDonut = this.data.statusDonut;
    this.weekLabels = this.data.weekLabels;
    this.chartBars = buildChartBars(this.data.weekChartData);
    this.donutArcs = buildDonutArcs(this.data.statusDonut);
    this.mapPins = this.data.mapPins;
    this.subtitle = this.formatSubtitle();
  }

  refreshComplaints(): void {
    this.complaints = this.data.getCustomerComplaints({ openOnly: true, limit: 6 });
    this.openComplaintCount = this.data.getOpenComplaintCount();
  }

  statusBadge(status: string): { cls: string; label: string } {
    return getRequestStatusBadge(status);
  }

  complaintStatusBadge(status: string): { cls: string; label: string } {
    return getComplaintStatusBadge(status);
  }

  complaintSeverityBadge(severity: string): { cls: string; label: string } {
    return getComplaintSeverityBadge(severity);
  }

  healthStyle(health: string): { color: string; background: string } {
    return getAgentHealthStyle(health);
  }

  exportChart(): void {
    this.toast.show('Chart data exported (CSV)');
  }

  goToRequests(): void {
    this.router.navigate(['/portal/requests']);
  }

  goToAgents(): void {
    this.router.navigate(['/portal/agents']);
  }

  goToComplaints(): void {
    this.router.navigate(['/portal/complaints']);
  }

  viewRequest(id: string): void {
    this.toast.show(`Viewing ${id}`);
  }

  editRequest(id: string): void {
    this.toast.show(`Editing ${id}`);
  }

  viewAgent(id: string): void {
    this.toast.show(`Viewing agent ${id}`);
  }

  editAgent(id: string): void {
    this.toast.show(`Editing agent ${id}`);
  }

  addRequest(): void {
    this.toast.show('Add request form — connect admin modal');
  }

  addAgent(): void {
    this.toast.show('Add agent form — connect admin modal');
  }

  viewComplaint(row: CustomerComplaint): void {
    void this.router.navigate(['/portal/complaints'], { queryParams: { id: row.id } });
  }

  investigateComplaint(row: CustomerComplaint): void {
    const updated = this.data.updateComplaintStatus(row.id, 'investigating');
    if (!updated) return;
    this.refreshComplaints();
    this.toast.show(`${row.id} marked Investigating.`);
  }

  escalateComplaint(row: CustomerComplaint): void {
    const updated = this.data.updateComplaintStatus(row.id, 'escalated');
    if (!updated) return;
    this.refreshComplaints();
    this.toast.show(`${row.id} escalated.`);
  }

  resolveComplaint(row: CustomerComplaint): void {
    const updated = this.data.updateComplaintStatus(row.id, 'resolved');
    if (!updated) return;
    this.refreshComplaints();
    this.toast.show(`${row.id} resolved.`);
  }

  private formatSubtitle(): string {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date()) + ' — All systems operational';
  }
}
