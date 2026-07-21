import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StaffRole } from '../../../core/models/portal.models';
import { ComplaintStatus, CustomerComplaint, PortalDataService } from '../../../core/services/portal-data.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { getComplaintSeverityBadge, getComplaintStatusBadge } from '../../../core/utils/dashboard.util';

type ComplaintFilter = 'all' | ComplaintStatus;

interface StatusFilter {
  id: ComplaintFilter;
  label: string;
}

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './complaints.component.html',
  styleUrl: './complaints.component.css'
})
export class ComplaintsComponent implements OnInit{
  role: StaffRole | null = null;
  pageSubtitle = 'All customer complaints';
  agentZone = 'Zone 1';

  allComplaints: CustomerComplaint[] = [];
  filteredComplaints: CustomerComplaint[] = [];
  activeFilter: ComplaintFilter = 'all';
  page = 1;
  readonly pageSize = 8;

  detailOpen = false;
  selected: CustomerComplaint | null = null;

  readonly filters: StatusFilter[] = [
    { id: 'all', label: 'All' },
    { id: 'open', label: 'Open' },
    { id: 'investigating', label: 'Investigating' },
    { id: 'escalated', label: 'Escalated' },
    { id: 'resolved', label: 'Resolved' },
  ];

  constructor(
    private auth: AuthService,
    private data: PortalDataService,
    private toast: ToastService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.role = this.auth.getRole();
    this.pageSubtitle =
      this.role === 'agent'
        ? `${this.agentZone} customer complaints`
        : 'All customer complaints across zones';
    this.reload();

    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      const row = this.allComplaints.find((c) => c.id === id);
      if (row) this.openDetail(row);
    }
  }

  reload(): void {
    this.allComplaints =
      this.role === 'agent'
        ? this.data.getCustomerComplaints({ zone: this.agentZone })
        : this.data.getCustomerComplaints();
    this.applyFilter(this.activeFilter);
  }

  setFilter(filter: ComplaintFilter): void {
    this.applyFilter(filter);
  }

  isFilterActive(filter: ComplaintFilter): boolean {
    return this.activeFilter === filter;
  }

  statusBadge(status: string) {
    return getComplaintStatusBadge(status);
  }

  severityBadge(severity: string) {
    return getComplaintSeverityBadge(severity);
  }

  openDetail(row: CustomerComplaint): void {
    this.selected = { ...row };
    this.detailOpen = true;
  }

  closeDetail(): void {
    this.detailOpen = false;
    this.selected = null;
  }

  investigate(row: CustomerComplaint): void {
    this.updateStatus(row, 'investigating');
  }

  escalate(row: CustomerComplaint): void {
    this.updateStatus(row, 'escalated');
  }

  resolve(row: CustomerComplaint): void {
    this.updateStatus(row, 'resolved');
  }

  private updateStatus(row: CustomerComplaint, status: ComplaintStatus): void {
    const updated = this.data.updateComplaintStatus(row.id, status);
    if (!updated) {
      this.toast.show('Could not update complaint.', 'error');
      return;
    }
    this.reload();
    if (this.selected?.id === row.id) {
      this.selected = { ...updated };
    }
    this.toast.show(`${row.id} marked ${getComplaintStatusBadge(status).label}.`);
  }

  get pagedComplaints(): CustomerComplaint[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredComplaints.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredComplaints.length / this.pageSize));
  }

  get showPagination(): boolean {
    return this.filteredComplaints.length > this.pageSize;
  }

  prevPage(): void {
    if (this.page > 1) this.page -= 1;
  }

  nextPage(): void {
    if (this.page < this.totalPages) this.page += 1;
  }

  private applyFilter(filter: ComplaintFilter): void {
    this.activeFilter = filter;
    this.page = 1;
    this.filteredComplaints =
      filter === 'all'
        ? [...this.allComplaints]
        : this.allComplaints.filter((c) => c.status === filter);
  }
}
