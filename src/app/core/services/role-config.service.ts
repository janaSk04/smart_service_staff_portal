import { Injectable } from '@angular/core';
import { RoleConfig, StaffRole, StaffUser } from '../models/portal.models';

const DEFAULT_ACCENT = '#4f8ef7';
const DEFAULT_ACCENT_LIGHT = '#eef4fe';

@Injectable({
  providedIn: 'root'
})
export class RoleConfigService {
readonly users: StaffUser[] = [
    {
      id: 'USR001',
      role: 'admin',
      name: 'Eugin Beanut',
      email: 'admin@service.lk',
      password: 'admin123',
      avatar: 'AP',
      avatarColor: '#4f8ef7',
      title: 'System Administrator',
    },
    {
      id: 'USR002',
      role: 'agent',
      name: 'Bavitha',
      email: 'agent@service.lk',
      password: 'agent123',
      avatar: 'NS',
      avatarColor: '#10c27a',
      title: 'Senior Service Agent',
    },
    {
      id: 'USR003',
      role: 'technician',
      name: 'Bavish',
      email: 'tech@service.lk',
      password: 'tech123',
      avatar: 'RF',
      avatarColor: '#f97316',
      title: 'Field Technician',
    },
  ];

  readonly demoHints: Record<StaffRole, string> = {
    admin: 'Demo: admin@service.lk / admin123',
    agent: 'Demo: agent@service.lk / agent123',
    technician: 'Demo: tech@service.lk / tech123',
  };

  getConfig(role: StaffRole): RoleConfig {
    return ROLE_CONFIG[role];
  }

  findUser(email: string, password: string, role: StaffRole): StaffUser | undefined {
    return this.users.find(
      (u) => u.email === email && u.password === password && u.role === role
    );
  }

  applyTheme(role: StaffRole): void {
    const config = this.getConfig(role);
    const root = document.documentElement;
    root.style.setProperty('--accent', config.accent);
    root.style.setProperty('--accent-light', config.accentLight);
    root.style.setProperty('--accent-dark', this.darken(config.accent, 0.12));
    root.setAttribute('data-role-theme', role);
  }

  resetTheme(): void {
    const root = document.documentElement;
    root.style.setProperty('--accent', DEFAULT_ACCENT);
    root.style.setProperty('--accent-light', DEFAULT_ACCENT_LIGHT);
    root.style.setProperty('--accent-dark', '#2563eb');
    root.setAttribute('data-role-theme', 'admin');
  }

  private darken(hex: string, amount: number): string {
    const n = hex.replace('#', '');
    const num = parseInt(n.length === 3 ? n.split('').map((c) => c + c).join('') : n, 16);
    if (Number.isNaN(num)) return hex;
    const r = Math.max(0, Math.round(((num >> 16) & 255) * (1 - amount)));
    const g = Math.max(0, Math.round(((num >> 8) & 255) * (1 - amount)));
    const b = Math.max(0, Math.round((num & 255) * (1 - amount)));
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  }
}


const ROLE_CONFIG: Record<StaffRole, RoleConfig> = {
  admin: {
    label: 'Administrator',
    accent: '#4f8ef7',
    accentLight: '#eef4fe',
    badgeBg: 'rgba(79,142,247,.15)',
    badgeColor: '#82aeff',
    nav: [
      {
        section: 'Overview',
        items: [
          { id: 'dashboard', icon: 'fa-gauge-high', label: 'Dashboard', badge: null, route: '/portal' },
          { id: 'analytics', icon: 'fa-chart-line', label: 'Analytics', badge: null, route: '/portal/analytics' },
        ],
      },
      {
        section: 'Management',
        items: [
          { id: 'users', icon: 'fa-users', label: 'User Management', badge: '124', route: '/portal/users' },
          { id: 'services', icon: 'fa-list-check', label: 'Service Catalog', badge: null, route: '/portal/services' },
          { id: 'requests', icon: 'fa-ticket', label: 'All Requests', badge: '42', route: '/portal/requests' },
          { id: 'agents', icon: 'fa-headset', label: 'Agents', badge: null, route: '/portal/agents' },
          { id: 'technicians', icon: 'fa-screwdriver-wrench', label: 'Technicians', badge: null, route: '/portal/technicians' },
        ],
      },
      {
        section: 'System',
        items: [
          { id: 'reports', icon: 'fa-file-chart-column', label: 'Reports', badge: null, route: '/portal/reports' },
          { id: 'chat', icon: 'fa-comments', label: 'Team Chat', badge: '5', route: '/portal/chat' },
          { id: 'settings', icon: 'fa-gear', label: 'Settings', badge: null, route: '/portal/settings' },
          { id: 'audit', icon: 'fa-shield-check', label: 'Audit Logs', badge: null, route: '/portal/audit' },
        ],
      },
    ],
  },
  agent: {
    label: 'Service Agent',
    accent: '#10c27a',
    accentLight: '#e6faf3',
    badgeBg: 'rgba(16,194,122,.15)',
    badgeColor: '#4eddaa',
    nav: [
      {
        section: 'Overview',
        items: [
          { id: 'dashboard', icon: 'fa-gauge-high', label: 'Dashboard', badge: null, route: '/portal' },
        ],
      },
      {
        section: 'Operations',
        items: [
          { id: 'requests', icon: 'fa-ticket', label: 'Service Requests', badge: '18', route: '/portal/requests' },
          { id: 'assign', icon: 'fa-arrows-spin', label: 'Assignments', badge: '7', route: '/portal/assign' },
          { id: 'technicians', icon: 'fa-screwdriver-wrench', label: 'My Technicians', badge: null, route: '/portal/technicians' },
          { id: 'schedule', icon: 'fa-calendar-days', label: 'Schedule', badge: null, route: '/portal/schedule' },
        ],
      },
      {
        section: 'Tools',
        items: [
          { id: 'chat', icon: 'fa-comments', label: 'Team Chat', badge: '3', route: '/portal/chat' },
          { id: 'reports', icon: 'fa-chart-bar', label: 'Reports', badge: null, route: '/portal/reports' },
          { id: 'settings', icon: 'fa-gear', label: 'Settings', badge: null, route: '/portal/settings' },
        ],
      },
    ],
  },
  technician: {
    label: 'Technician',
    accent: '#f97316',
    accentLight: '#fff3eb',
    badgeBg: 'rgba(249,115,22,.15)',
    badgeColor: '#fdba74',
    nav: [
      {
        section: 'Overview',
        items: [
          { id: 'dashboard', icon: 'fa-gauge-high', label: 'Dashboard', badge: null, route: '/portal' },
        ],
      },
      {
        section: 'My Work',
        items: [
          { id: 'jobs', icon: 'fa-briefcase', label: 'My Jobs', badge: '4', route: '/portal/jobs' },
          { id: 'schedule', icon: 'fa-calendar-days', label: 'Schedule', badge: null, route: '/portal/schedule' },
          { id: 'history', icon: 'fa-clock-rotate-left', label: 'Job History', badge: null, route: '/portal/history' },
        ],
      },
      {
        section: 'Support',
        items: [
          { id: 'chat', icon: 'fa-comments', label: 'Chat Agent', badge: '2', route: '/portal/chat' },
          { id: 'profile', icon: 'fa-id-badge', label: 'My Profile', badge: null, route: '/portal/profile' },
          { id: 'settings', icon: 'fa-gear', label: 'Settings', badge: null, route: '/portal/settings' },
        ],
      },
    ],
  },
}
