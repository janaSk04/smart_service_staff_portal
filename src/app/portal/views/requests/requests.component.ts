import { Component, OnInit } from '@angular/core';
import { AdminRequest, PortalDataService, RequestFilterOption } from '../../../core/services/portal-data.service';
import { StaffRole } from '../../../core/models/portal.models';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { getPriorityRawBadge, getRequestStatusBadge } from '../../../core/utils/dashboard.util';

interface StatusFilter {
  id: RequestFilterOption;
  label: string;
}

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements OnInit{

  role: StaffRole | null = null;
  pageSubtitle = 'All system requests';
  allRequests: AdminRequest[] = [];
  filteredRequests: AdminRequest[] = [];
  activeFilter: RequestFilterOption = 'all';
  page = 1;
  readonly pageSize = 5;

  filters: StatusFilter[] = [
    { id: 'all', label: 'All' },
    { id: 'open', label: 'Open' },
    { id: 'progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'overdue', label: 'Overdue' },
  ];

  constructor(
    private auth: AuthService,
    private data: PortalDataService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.role = this.auth.getRole();
    const user = this.auth.getUser();
    this.pageSubtitle = this.role === 'agent' ? 'Your zone requests' : 'All system requests';
    this.allRequests = this.data.getRequestsForRole(this.role, user?.name);
    this.applyFilter('all');
  }

  setFilter(filter: RequestFilterOption): void {
    this.applyFilter(filter);
  }

  isFilterActive(filter: RequestFilterOption): boolean {
    return this.activeFilter === filter;
  }

  statusBadge(status: string) {
    return getRequestStatusBadge(status);
  }

  priorityBadge(priority: string): string {
    return getPriorityRawBadge(priority);
  }

  viewRequest(id: string): void {
    this.toast.show(`Viewing ${id}`);
  }

  editRequest(id: string): void {
    this.toast.show(`Editing ${id}`);
  }

  get pagedRequests(): AdminRequest[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredRequests.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRequests.length / this.pageSize));
  }

  get showPagination(): boolean {
    return this.filteredRequests.length > 0;
  }

  prevPage(): void {
    if (this.page > 1) this.page--;
  }

  nextPage(): void {
    if (this.page < this.totalPages) this.page++;
  }

  private applyFilter(filter: RequestFilterOption): void {
    this.activeFilter = filter;
    this.filteredRequests = this.data.filterRequests(this.allRequests, filter);
    this.page = 1;
  }
}

