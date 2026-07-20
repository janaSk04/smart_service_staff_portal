import { Component, OnInit } from '@angular/core';
import { AgentQueueItem, DashboardStat, PortalDataService } from '../../../core/services/portal-data.service';
import { ToastService } from '../../../core/services/toast.service';
import { getPriorityBadge } from '../../../core/utils/dashboard.util';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface AssignRow extends AgentQueueItem {
  confirmed: boolean;
}

@Component({
  selector: 'app-assign',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign.component.html',
  styleUrl: './assign.component.css'
})
export class AssignComponent implements OnInit{
stats: DashboardStat[] = [];
  rows: AssignRow[] = [];
  filteredRows: AssignRow[] = [];
  technicians: string[] = [];
  activeTab: 'pending' | 'confirmed' | 'all' = 'pending';

  constructor(
    private data: PortalDataService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.stats = this.data.assignmentStats;
    this.technicians = this.data.myTechnicians.map((t) => t.name);
    this.rows = this.data.agentQueue.map((item, i) => ({
      ...item,
      confirmed: i >= 5,
    }));
    this.applyTab('pending');
  }

  priorityBadge(priority: string) {
    return getPriorityBadge(priority);
  }

  setTab(tab: 'pending' | 'confirmed' | 'all'): void {
    this.applyTab(tab);
  }

  isTabActive(tab: 'pending' | 'confirmed' | 'all'): boolean {
    return this.activeTab === tab;
  }

  aiAssign(): void {
    this.toast.show('Auto-assign running…');
  }

  confirmAssign(row: AssignRow): void {
    row.confirmed = true;
    this.toast.show(`${row.id} assigned to ${row.assignedTo}`);
    this.applyTab(this.activeTab);
  }

  reassign(row: AssignRow): void {
    this.toast.show(`Reassigning ${row.id}…`);
  }

  private applyTab(tab: 'pending' | 'confirmed' | 'all'): void {
    this.activeTab = tab;
    if (tab === 'pending') this.filteredRows = this.rows.filter((r) => !r.confirmed);
    else if (tab === 'confirmed') this.filteredRows = this.rows.filter((r) => r.confirmed);
    else this.filteredRows = [...this.rows];
  }
}
