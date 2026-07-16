import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AgentQueueItem, DashboardStat, PortalDataService, SlaItem, TechListItem, TimelineItem } from '../../../core/services/portal-data.service';
import { buildChartBars, ChartBar, getPriorityBadge, getTechStatusDot, getTechStatusLabel, parsePct } from '../../../core/utils/dashboard.util';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agent-dashboard.component.html',
  styleUrl: './agent-dashboard.component.css'
})
export class AgentDashboardComponent implements OnInit{
  stats: DashboardStat[] = [];
  queue: AgentQueueItem[] = [];
  slaItems: SlaItem[] = [];
  technicians: TechListItem[] = [];
  timeline: TimelineItem[] = [];
  weekLabels: string[] = [];
  chartBars: ChartBar[] = [];

  constructor(
    private data: PortalDataService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.stats = this.data.agentStats;
    this.queue = this.data.agentQueue;
    this.slaItems = this.data.slaItems;
    this.technicians = this.data.myTechnicians;
    this.timeline = this.data.agentTimeline;
    this.weekLabels = this.data.weekLabels;
    this.chartBars = buildChartBars(this.data.agentChartData);
  }

  priorityBadge(priority: string) {
    return getPriorityBadge(priority);
  }

  techStatusLabel(status: string) {
    return getTechStatusLabel(status);
  }

  techStatusDot(status: string) {
    return getTechStatusDot(status);
  }

  slaWidth(pct: string) {
    return parsePct(pct);
  }

  aiAssign(): void {
    this.toast.show('Auto-assign running…');
  }

  goToRequests(): void {
    this.router.navigate(['/portal/requests']);
  }

  goToTechnicians(): void {
    this.router.navigate(['/portal/technicians']);
  }

  confirmAssign(item: AgentQueueItem): void {
    this.toast.show(`${item.id} assigned to ${item.assignedTo}`);
  }

  assignToTech(name: string): void {
    this.toast.show(`Assigned task to ${name}`);
  }
}
