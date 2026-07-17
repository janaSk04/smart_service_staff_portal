import { Component, OnInit } from '@angular/core';
import { JobFilterOption, PortalDataService, TECH_JOB_PRIORITY_META, TECH_JOB_STATUS_META, TechJob, TechJobPriority, TechJobWorkStatus } from '../../../core/services/portal-data.service';
import { ToastService } from '../../../core/services/toast.service';
import { Router } from '@angular/router';
import { TeamChatService } from '../../../core/services/team-chat.service';
import { JOB_NAV_PLACEHOLDER_PATH, jobNavQueryParams, openJobNavigation } from '../../../core/utils/navigation.util';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface JobFilter {
  id: JobFilterOption;
  label: string;
}

interface StatusOption {
  id: TechJobWorkStatus;
  label: string;
  icon: string;
  needsReason: boolean;
}

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css'
})

export class JobsComponent implements OnInit{
filters: JobFilter[] = [
    { id: 'all', label: 'All' },
    { id: 'available', label: 'Available' },
    { id: 'enroute', label: 'En Route' },
    { id: 'inprogress', label: 'In Progress' },
    { id: 'onhold', label: 'On Hold' },
    { id: 'partially_done', label: 'Partially Done' },
    { id: 'done', label: 'Done' },
    { id: 'rejected', label: 'Rejected' },
  ];

  readonly statusOptions: StatusOption[] = [
    { id: 'available', label: 'Available', icon: 'fa-circle-check', needsReason: false },
    { id: 'enroute', label: 'En Route', icon: 'fa-truck', needsReason: false },
    { id: 'inprogress', label: 'In Progress', icon: 'fa-play', needsReason: false },
    { id: 'onhold', label: 'On Hold', icon: 'fa-pause', needsReason: true },
    { id: 'partially_done', label: 'Partially Done', icon: 'fa-hourglass-half', needsReason: false },
    { id: 'done', label: 'Done', icon: 'fa-flag-checkered', needsReason: false },
  ];

  activeFilter: JobFilterOption = 'all';
  jobs: TechJob[] = [];

  modalOpen = false;
  modalMode: 'status' | 'reject' = 'status';
  selectedJob: TechJob | null = null;
  selectedStatus: TechJobWorkStatus = 'available';
  reason = '';

  constructor(
    private data: PortalDataService,
    private toast: ToastService,
    private router: Router,
    private chat: TeamChatService
  ) {}

  ngOnInit(): void {
    this.refreshJobs();
  }

  setFilter(filter: JobFilterOption): void {
    this.activeFilter = filter;
    this.refreshJobs();
  }

  isFilterActive(filter: JobFilterOption): boolean {
    return this.activeFilter === filter;
  }

  isPendingDecision(job: TechJob): boolean {
    return this.data.isPendingDecision(job);
  }

  canUpdateStatus(job: TechJob): boolean {
    return this.data.isJobAccepted(job) && job.status !== 'done';
  }

  acceptJob(job: TechJob): void {
    const updated = this.data.acceptTechJob(job.id);
    if (!updated) {
      this.toast.show('Could not accept job.', 'error');
      return;
    }
    this.refreshJobs();
    this.toast.show(`${updated.id} accepted. You can update status now.`);
  }

  redoJob(job: TechJob): void {
    const updated = this.data.redoTechJob(job.id);
    if (!updated) {
      this.toast.show('Could not redo job.', 'error');
      return;
    }
    this.activeFilter = 'available';
    this.refreshJobs();
    this.toast.show(`${updated.id} sent back for Accept or Reject.`);
  }

  reassignJob(job: TechJob): void {
    const updated = this.data.requestJobReassign(job.id);
    if (!updated) {
      this.toast.show('Could not request reassignment.', 'error');
      return;
    }
    this.refreshJobs();
    this.toast.show(`Reassignment requested for ${updated.id}.`);
  }

  openStatusModal(job: TechJob): void {
    if (!this.canUpdateStatus(job)) {
      this.toast.show('Accept the job before updating status.', 'error');
      return;
    }
    this.selectedJob = job;
    this.selectedStatus = job.status === 'rejected' ? 'available' : job.status;
    this.reason = job.statusReason ?? '';
    this.modalMode = 'status';
    this.modalOpen = true;
  }

  openRejectModal(job: TechJob): void {
    this.selectedJob = job;
    this.selectedStatus = 'rejected';
    this.reason = '';
    this.modalMode = 'reject';
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedJob = null;
    this.reason = '';
  }

  selectStatus(status: TechJobWorkStatus): void {
    this.selectedStatus = status;
    if (!this.statusNeedsReason(status)) {
      this.reason = '';
    }
  }

  statusNeedsReason(status: TechJobWorkStatus = this.selectedStatus): boolean {
    return status === 'onhold' || status === 'rejected';
  }

  get modalTitle(): string {
    if (this.modalMode === 'reject') return 'Reject Job';
    return 'Update Job Status';
  }

  get reasonLabel(): string {
    if (this.selectedStatus === 'rejected') return 'Rejection reason';
    return 'On-hold reason';
  }

  get reasonPlaceholder(): string {
    if (this.selectedStatus === 'rejected') {
      return 'e.g. Customer not available, wrong address, unsafe site…';
    }
    return 'e.g. Waiting for parts, customer delayed, weather…';
  }

  confirmModal(): void {
    if (!this.selectedJob) return;

    const status = this.modalMode === 'reject' ? 'rejected' : this.selectedStatus;

    if (this.statusNeedsReason(status) && !this.reason.trim()) {
      this.toast.show(`Please enter a ${status === 'rejected' ? 'rejection' : 'on-hold'} reason.`, 'error');
      return;
    }

    const updated = this.data.updateTechJobStatus(
      this.selectedJob.id,
      status,
      this.reason.trim() || undefined
    );

    if (!updated) {
      this.toast.show('Could not update job status.', 'error');
      return;
    }

    this.refreshJobs();
    this.closeModal();

    if (status === 'rejected') {
      this.activeFilter = 'rejected';
      this.refreshJobs();
      this.toast.show(`${updated.id} rejected. Use Reassign or Redo.`);
    } else if (status === 'onhold') {
      this.toast.show(`${updated.id} put on hold.`);
    } else {
      this.toast.show(`${updated.id} marked as ${TECH_JOB_STATUS_META[status].label}.`);
    }
  }

  navigate(job: TechJob): void {
    if (job.status === 'rejected' || job.status === 'done') {
      this.toast.show('Navigation is not available for this job.', 'error');
      return;
    }
    if (!openJobNavigation(job.address)) {
      this.toast.show('Job address is missing.', 'error');
      return;
    }

    void this.router.navigate([JOB_NAV_PLACEHOLDER_PATH], {
      queryParams: jobNavQueryParams(job.address),
    });
    this.toast.show('Maps navigation is under construction.');
  }

  uploadPhoto(job: TechJob): void {
    this.toast.show(`Photo upload opened for ${job.id}`);
  }

  openChat(job: TechJob): void {
    this.chat.openJobChat(job.id, job.customer);
    void this.router.navigate(['/portal/chat'], { queryParams: { job: job.id } });
  }

  priorityLabel(priority: TechJobPriority): string {
    return TECH_JOB_PRIORITY_META[priority].label;
  }

  priorityBadge(priority: TechJobPriority): string {
    return TECH_JOB_PRIORITY_META[priority].badge;
  }

  private refreshJobs(): void {
    this.jobs = this.data.getTechJobs(this.activeFilter);
  }
}
