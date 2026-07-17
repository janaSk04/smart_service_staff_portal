import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PortalDataService, TechJob, TechKpi, TimelineItem } from '../../../core/services/portal-data.service';
import { buildChartBars, ChartBar } from '../../../core/utils/dashboard.util';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-technician-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './technician-dashboard.component.html',
  styleUrl: './technician-dashboard.component.css'
})
export class TechnicianDashboardComponent implements OnInit{
  kpis: TechKpi[] = [];
  jobs: TechJob[] = [];
  completedToday: TimelineItem[] = [];
  earningsBars: ChartBar[] = [];
  earningsLabels: string[] = [];
  rating = 4.9;
  jobsDone = 148;
  onTimeRate = '96%';
  weekEarnings = 'LKR 18,400';
  ratingArc = 0;

  constructor(
    private data: PortalDataService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.kpis = this.data.techKpis;
    this.jobs = this.data.techJobs;
    this.completedToday = this.data.techCompletedToday;
    this.earningsLabels = this.data.techEarningsLabels;
    this.earningsBars = buildChartBars(this.data.techEarningsChartData);
    this.rating = this.data.techRating;
    this.jobsDone = this.data.techJobsDone;
    this.onTimeRate = this.data.techOnTimeRate;
    this.weekEarnings = this.data.techWeekEarnings;
    this.ratingArc = (this.rating / 5) * 364;
  }

  showToast(msg: string): void {
    this.toast.show(msg);
  }
}
