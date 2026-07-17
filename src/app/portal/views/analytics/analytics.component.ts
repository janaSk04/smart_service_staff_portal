import { Component, OnInit } from '@angular/core';
import { DashboardStat, DonutSegment, PortalDataService, TopTechnicianRow, ZoneSlaRow } from '../../../core/services/portal-data.service';
import { buildChartBars, buildDonutArcs, ChartBar, DonutArc } from '../../../core/utils/dashboard.util';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent implements OnInit{
  stats: DashboardStat[] = [];
  trendLabels: string[] = [];
  chartBars: ChartBar[] = [];
  zoneSlaRows: ZoneSlaRow[] = [];
  categoryDonut: DonutSegment[] = [];
  donutArcs: DonutArc[] = [];
  topTechnicians: TopTechnicianRow[] = [];

  constructor(
    private data: PortalDataService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.stats = this.data.analyticsStats;
    this.trendLabels = this.data.analyticsTrendLabels;
    this.chartBars = buildChartBars(this.data.analyticsTrendData);
    this.zoneSlaRows = this.data.zoneSlaRows;
    this.categoryDonut = this.data.categoryDonut;
    this.donutArcs = buildDonutArcs(this.data.categoryDonut);
    this.topTechnicians = this.data.topTechnicians;
  }

  exportTrend(): void {
    this.toast.show('Trend exported as CSV');
  }
}
