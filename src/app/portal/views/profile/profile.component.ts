import { Component, OnInit } from '@angular/core';
import { StaffUser } from '../../../core/models/portal.models';
import { PortalDataService, TechCertification, TechProfileData } from '../../../core/services/portal-data.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ProfileSection = 'personal' | 'certifications' | 'work' | 'notifications';

interface NavItem {
  id: ProfileSection;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  user: StaffUser | null = null;
  profile!: TechProfileData;
  activeSection: ProfileSection = 'personal';

  readonly navItems: NavItem[] = [
    { id: 'personal', icon: 'fa-user', label: 'Personal Info' },
    { id: 'certifications', icon: 'fa-certificate', label: 'Certifications' },
    { id: 'work', icon: 'fa-briefcase', label: 'Work Details' },
    { id: 'notifications', icon: 'fa-bell', label: 'Notifications' },
  ];

  constructor(
    private auth: AuthService,
    private data: PortalDataService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.profile = { ...this.data.techProfile, certifications: [...this.data.techProfile.certifications] };
  }

  openSection(section: ProfileSection): void {
    this.activeSection = section;
  }

  certBadgeClass(cert: TechCertification): string {
    if (cert.status === 'valid') return 'badge-green';
    if (cert.status === 'expiring') return 'badge-yellow';
    return 'badge-red';
  }

  certStatusLabel(cert: TechCertification): string {
    if (cert.status === 'valid') return 'Valid';
    if (cert.status === 'expiring') return 'Expiring Soon';
    return 'Expired';
  }

  savePersonal(): void {
    this.toast.show('Personal information saved.');
  }

  saveWork(): void {
    this.toast.show('Work details updated.');
  }

  saveNotifications(): void {
    this.toast.show('Notification preferences saved.');
  }

  uploadCert(): void {
    this.toast.show('Certificate upload opened.');
  }
}

