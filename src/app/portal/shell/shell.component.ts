import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { PortalNotification, RoleConfig, StaffUser } from '../../core/models/portal.models';
import { RoleConfigService } from '../../core/services/role-config.service';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { ToastService } from '../../core/services/toast.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css'
})
export class ShellComponent implements OnInit, OnDestroy{
  user!: StaffUser;
  roleConfig!: RoleConfig;
  sidebarCollapsed = false;
  mobileSidebarOpen = false;
  mobileSearchOpen = false;
  notifOpen = false;
  profileOpen = false;
  breadcrumb = 'Dashboard';

  notifications: PortalNotification[] = [];
  private routerSub?: Subscription;
  private allowOutsideClose = false;

  constructor(
    private auth: AuthService,
    private roleConfigService: RoleConfigService,
    private notificationService: NotificationService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.auth.getUser();
    if (!user) return;

    this.user = user;
    this.roleConfig = this.roleConfigService.getConfig(user.role);
    this.notifications = this.notificationService.getForRole(user.role);
    this.applyRoleTheme();
    this.updateBreadcrumb(this.router.url);
    document.body.classList.add('portal-layout');

    this.routerSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumb(this.router.url);
        this.closeProfileDropdown();
        this.closeNotifPanel();
      });
  }

  ngOnDestroy(): void {
    document.body.classList.remove('portal-layout');
    document.body.classList.remove('notif-open');
    this.roleConfigService.resetTheme();
    this.routerSub?.unsubscribe();
  }

  get notifCount(): number {
    return this.notifications.filter((n) => n.unread).length;
  }

  toggleSidebar(): void {
    if (window.innerWidth <= 768) {
      this.mobileSidebarOpen = !this.mobileSidebarOpen;
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen = false;
  }

  toggleMobileSearch(): void {
    this.mobileSearchOpen = !this.mobileSearchOpen;
  }

  toggleNotifPanel(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.notifOpen = !this.notifOpen;
    this.closeProfileDropdown();

    if (this.notifOpen) {
      document.body.classList.add('notif-open');
      this.armOutsideClose();
    } else {
      document.body.classList.remove('notif-open');
      this.allowOutsideClose = false;
    }
  }

  closeNotifPanel(): void {
    this.notifOpen = false;
    this.allowOutsideClose = false;
    document.body.classList.remove('notif-open');
  }

  onSettingsClick(): void {
    this.closeNotifPanel();
    this.closeProfileDropdown();
  }

  goToProfile(): void {
    this.closeProfileDropdown();
    this.closeNotifPanel();
    void this.router.navigateByUrl('/portal/profile');
  }

  goToSettings(): void {
    this.closeProfileDropdown();
    this.closeNotifPanel();
    void this.router.navigateByUrl('/portal/settings');
  }

  toggleProfileDropdown(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    this.profileOpen = !this.profileOpen;
    if (this.profileOpen) {
      this.closeNotifPanel();
      this.armOutsideClose();
    } else {
      this.allowOutsideClose = false;
    }
  }

  closeProfileDropdown(): void {
    this.profileOpen = false;
  }

  markAllRead(): void {
    this.notifications.forEach((n) => (n.unread = false));
    this.toast.show('All notifications marked as read.');
  }

  logout(): void {
    this.auth.logout();
  }

  onNavClick(): void {
    this.closeMobileSidebar();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.allowOutsideClose) return;

    const target = event.target as HTMLElement;

    if (this.profileOpen && !target.closest('.tb-profile-wrap')) {
      this.closeProfileDropdown();
    }

    if (
      this.notifOpen &&
      !target.closest('.notif-panel') &&
      !target.closest('.tb-notif-btn')
    ) {
      this.closeNotifPanel();
    }
  }

  private armOutsideClose(): void {
    this.allowOutsideClose = false;
    setTimeout(() => {
      this.allowOutsideClose = true;
    }, 0);
  }

  private applyRoleTheme(): void {
    this.roleConfigService.applyTheme(this.user.role);
  }

  private updateBreadcrumb(url: string): void {
    const labels: Record<string, string> = {
      '/portal': 'Dashboard',
      '/portal/analytics': 'Analytics',
      '/portal/users': 'User Management',
      '/portal/services': 'Service Catalog',
      '/portal/requests': 'Service Requests',
      '/portal/agents': 'Agents',
      '/portal/technicians': 'Technicians',
      '/portal/reports': 'Reports',
      '/portal/chat': 'Chat',
      '/portal/settings': 'Settings',
      '/portal/audit': 'Audit Logs',
      '/portal/assign': 'Assignments',
      '/portal/schedule': 'Schedule',
      '/portal/jobs': 'My Jobs',
      '/portal/history': 'Job History',
      '/portal/profile': 'My Profile',
    };
    this.breadcrumb = labels[url.split('?')[0]] ?? 'Dashboard';
  }
}
