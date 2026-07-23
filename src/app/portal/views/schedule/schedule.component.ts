import { Component, OnInit } from '@angular/core';
import { PortalDataService, ScheduleCalendarDay, ScheduleDayChip, TECH_JOB_PRIORITY_META, TECH_JOB_STATUS_META, TechJob, TechJobPriority, TechJobWorkStatus } from '../../../core/services/portal-data.service';
import { ToastService } from '../../../core/services/toast.service';
import { Router } from '@angular/router';
import { TeamChatService } from '../../../core/services/team-chat.service';
import { JOB_NAV_PLACEHOLDER_PATH, jobNavQueryParams, openJobNavigation } from '../../../core/utils/navigation.util';

type ScheduleViewMode = 'day' | 'week' | 'month';

interface ScheduleWeekCell extends ScheduleCalendarDay {
  date: Date;
  weekdayLabel: string;
  isOutsideMonth: boolean;
}

interface ScheduleMonthCell extends ScheduleCalendarDay {
  date: Date;
}

interface StatusOption {
  id: TechJobWorkStatus;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit{

  weekDays: string[] = [];
  viewMode: ScheduleViewMode = 'month';
  viewModes: ScheduleViewMode[] = ['day', 'week', 'month'];

  anchor = new Date(2026, 2, 8);

  /** Day-view job detail popup */
  jobPopupOpen = false;
  selectedJob: TechJob | null = null;
  selectedSlotLabel = '';
  selectedChip: ScheduleDayChip | null = null;

  /** Status / reject modal */
  statusModalOpen = false;
  statusModalMode: 'status' | 'reject' = 'status';
  selectedStatus: TechJobWorkStatus = 'available';
  reason = '';

  readonly statusOptions: StatusOption[] = [
    { id: 'available', label: 'Available', icon: 'fa-circle-check' },
    { id: 'enroute', label: 'En Route', icon: 'fa-truck' },
    { id: 'inprogress', label: 'In Progress', icon: 'fa-play' },
    { id: 'onhold', label: 'On Hold', icon: 'fa-pause' },
    { id: 'partially_done', label: 'Partially Done', icon: 'fa-hourglass-half' },
    { id: 'done', label: 'Done', icon: 'fa-flag-checkered' },
  ];

  constructor(
    private data: PortalDataService,
    private toast: ToastService,
    private router: Router,
    private chat: TeamChatService
  ) {}

  ngOnInit(): void {
    this.weekDays = this.data.scheduleWeekDays;
  }

  get periodLabel(): string {
    if (this.viewMode === 'day') {
      return this.anchor.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }

    if (this.viewMode === 'week') {
      const start = this.getWeekStart(this.anchor);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      const sameMonth = start.getMonth() === end.getMonth();
      const startLabel = start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const endLabel = end.toLocaleDateString('en-US', {
        month: sameMonth ? undefined : 'short',
        day: 'numeric',
        year: 'numeric',
      });
      return `${startLabel} – ${endLabel}`;
    }

    return this.anchor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  get dayEvents(): ScheduleDayChip[] {
    const day = this.anchor.getDate();
    if (!this.isDemoMonth(this.anchor)) return [];
    return this.data.getScheduleEventsForDay(day);
  }

  get dayIsToday(): boolean {
    return this.isToday(this.anchor);
  }

  get weekCells(): ScheduleWeekCell[] {
    const start = this.getWeekStart(this.anchor);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const day = date.getDate();
      const inDemoMonth = this.isDemoMonth(date);
      const source = inDemoMonth
        ? this.data.scheduleCalendarDays.find((cell) => cell.day === day)
        : undefined;

      return {
        date,
        day,
        weekdayLabel: this.weekDays[date.getDay()],
        isToday: this.isToday(date),
        isOutsideMonth: date.getMonth() !== this.anchor.getMonth(),
        chips: source?.chips ?? [],
      };
    });
  }

  get monthCells(): (ScheduleMonthCell | null)[] {
    const year = this.anchor.getFullYear();
    const month = this.anchor.getMonth();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const leading = Array.from({ length: firstDayOfWeek }, () => null);
    const days = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const date = new Date(year, month, day);
      const inDemoMonth = this.isDemoMonth(date);
      const source = inDemoMonth
        ? this.data.scheduleCalendarDays.find((cell) => cell.day === day)
        : undefined;

      return {
        date,
        day,
        isToday: this.isToday(date),
        chips: source?.chips ?? [],
      };
    });

    return [...leading, ...days];
  }

  setViewMode(mode: ScheduleViewMode): void {
    this.viewMode = mode;
    if (mode !== 'day') this.closeJobPopup();
  }

  openDayView(date: Date, event?: Event): void {
    event?.stopPropagation();
    this.closeJobPopup();
    this.anchor = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.viewMode = 'day';
  }

  openJobPopup(chip: ScheduleDayChip, event?: Event): void {
    event?.stopPropagation();
    if (!chip.job) return;
    this.selectedChip = chip;
    this.selectedJob = chip.job;
    this.selectedSlotLabel = chip.label;
    this.jobPopupOpen = true;
  }

  closeJobPopup(): void {
    this.jobPopupOpen = false;
    this.selectedJob = null;
    this.selectedSlotLabel = '';
    this.selectedChip = null;
    this.closeStatusModal();
  }

  priorityLabel(priority: TechJobPriority): string {
    return TECH_JOB_PRIORITY_META[priority].label;
  }

  priorityBadge(priority: TechJobPriority): string {
    return TECH_JOB_PRIORITY_META[priority].badge;
  }

  canNavigate(job: TechJob): boolean {
    return job.status !== 'rejected' && job.status !== 'done';
  }

  isPendingDecision(job: TechJob): boolean {
    return this.data.isPendingDecision(job);
  }

  canUpdateStatus(job: TechJob): boolean {
    return this.data.isJobAccepted(job) && job.status !== 'done';
  }

  /** Placeholder page until Google Maps is wired (see navigation.util.ts) */
  navigateJob(job: TechJob): void {
    if (!this.canNavigate(job)) {
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

  openChat(job: TechJob): void {
    this.chat.openJobChat(job.id, job.customer);
    this.closeJobPopup();
    void this.router.navigate(['/portal/chat'], { queryParams: { job: job.id } });
  }

  acceptJob(job: TechJob): void {
    const fromStore = this.data.acceptTechJob(job.id);
    const updated: TechJob = fromStore ?? { ...job, accepted: true, reassignRequested: false };
    this.applyJobToPopup(updated);
    this.toast.show(`${updated.id} accepted. You can update status now.`);
  }

  redoJob(job: TechJob): void {
    const meta = TECH_JOB_STATUS_META.available;
    const fromStore = this.data.redoTechJob(job.id);
    const updated: TechJob =
      fromStore ??
      ({
        ...job,
        status: 'available',
        statusLabel: meta.label,
        statusBadge: meta.badge,
        borderColor: meta.border,
        variant: meta.variant,
        filterStatus: meta.filter,
        statusReason: undefined,
        accepted: false,
        reassignRequested: false,
      } as TechJob);
    this.applyJobToPopup(updated);
    this.toast.show(`${updated.id} sent back for Accept or Reject.`);
  }

  reassignJob(job: TechJob): void {
    const fromStore = this.data.requestJobReassign(job.id);
    const updated: TechJob = fromStore ?? { ...job, reassignRequested: true };
    this.applyJobToPopup(updated);
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
    this.statusModalMode = 'status';
    this.statusModalOpen = true;
  }

  openRejectModal(job: TechJob): void {
    this.selectedJob = job;
    this.selectedStatus = 'rejected';
    this.reason = '';
    this.statusModalMode = 'reject';
    this.statusModalOpen = true;
  }

  closeStatusModal(): void {
    this.statusModalOpen = false;
    this.reason = '';
  }

  selectStatus(status: TechJobWorkStatus): void {
    this.selectedStatus = status;
    if (status !== 'onhold' && status !== 'rejected') this.reason = '';
  }

  statusNeedsReason(status: TechJobWorkStatus = this.selectedStatus): boolean {
    return status === 'onhold' || status === 'rejected';
  }

  get statusModalTitle(): string {
    return this.statusModalMode === 'reject' ? 'Reject Job' : 'Update Job Status';
  }

  get reasonLabel(): string {
    return this.selectedStatus === 'rejected' ? 'Rejection reason' : 'On-hold reason';
  }

  confirmStatusModal(): void {
    if (!this.selectedJob) return;

    const status = this.statusModalMode === 'reject' ? 'rejected' : this.selectedStatus;
    if (this.statusNeedsReason(status) && !this.reason.trim()) {
      this.toast.show(`Please enter a ${status === 'rejected' ? 'rejection' : 'on-hold'} reason.`, 'error');
      return;
    }

    const meta = TECH_JOB_STATUS_META[status];
    const reason = this.statusNeedsReason(status) ? this.reason.trim() : undefined;

    const fromStore = this.data.updateTechJobStatus(this.selectedJob.id, status, reason);

    const updated: TechJob = fromStore ?? {
      ...this.selectedJob,
      status,
      statusLabel: meta.label,
      statusBadge: meta.badge,
      borderColor: meta.border,
      variant: meta.variant,
      filterStatus: meta.filter,
      statusReason: reason,
      accepted: status !== 'rejected',
      reassignRequested: status === 'rejected' ? false : this.selectedJob.reassignRequested,
    };

    this.applyJobToPopup(updated);
    this.closeStatusModal();

    if (status === 'rejected') this.toast.show(`${updated.id} rejected. Use Reassign or Redo.`);
    else if (status === 'onhold') this.toast.show(`${updated.id} put on hold.`);
    else this.toast.show(`${updated.id} marked as ${meta.label}.`);
  }

  private applyJobToPopup(updated: TechJob): void {
    if (this.selectedJob) Object.assign(this.selectedJob, updated);
    if (this.selectedChip?.job) {
      Object.assign(this.selectedChip.job, updated);
      this.selectedChip.label = `${updated.due} — ${updated.service}`;
      this.selectedChip.bg = updated.borderColor;
      this.selectedSlotLabel = this.selectedChip.label;
    }
    this.selectedJob = { ...updated };
  }

  prevPeriod(): void {
    if (this.viewMode === 'day') {
      this.anchor.setDate(this.anchor.getDate() - 1);
    } else if (this.viewMode === 'week') {
      this.anchor.setDate(this.anchor.getDate() - 7);
    } else {
      this.anchor = new Date(this.anchor.getFullYear(), this.anchor.getMonth() - 1, 1);
    }
    this.anchor = new Date(this.anchor);
    this.closeJobPopup();
  }

  nextPeriod(): void {
    if (this.viewMode === 'day') {
      this.anchor.setDate(this.anchor.getDate() + 1);
    } else if (this.viewMode === 'week') {
      this.anchor.setDate(this.anchor.getDate() + 7);
    } else {
      this.anchor = new Date(this.anchor.getFullYear(), this.anchor.getMonth() + 1, 1);
    }
    this.anchor = new Date(this.anchor);
    this.closeJobPopup();
  }

  private getWeekStart(date: Date): Date {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    return start;
  }

  private isDemoMonth(date: Date): boolean {
    return date.getFullYear() === 2026 && date.getMonth() === 2;
  }

  private isToday(date: Date): boolean {
    return (
      this.isDemoMonth(date) &&
      date.getDate() === this.data.scheduleTodayDay
    );
  }
}
