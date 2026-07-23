import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HistoryPeriod, JobHistoryRecord, PortalDataService } from '../../../core/services/portal-data.service';
import { ToastService } from '../../../core/services/toast.service';

interface PeriodFilter {
  id: HistoryPeriod;
  label: string;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit{
filters: PeriodFilter[] = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'all', label: 'All Time' },
  ];

  activePeriod: HistoryPeriod = 'all';
  records: JobHistoryRecord[] = [];

  constructor(
    private data: PortalDataService,
    private toast: ToastService
  ) {}

  get stats() {
    return this.data.historyStats;
  }

  ngOnInit(): void {
    this.applyFilter('all');
  }

  setPeriod(period: HistoryPeriod): void {
    this.activePeriod = period;
    this.records = this.data.getJobHistory(period);
  }

  isPeriodActive(period: HistoryPeriod): boolean {
    return this.activePeriod === period;
  }

  stars(rating: number): string {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
  }

  viewReceipt(record: JobHistoryRecord): void {
    this.toast.show(`Receipt for ${record.id} downloaded.`);
  }

  private applyFilter(period: HistoryPeriod): void {
    this.activePeriod = period;
    this.records = this.data.getJobHistory(period);
  }
}
