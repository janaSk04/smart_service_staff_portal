export type StaffRole = 'admin' | 'agent' | 'technician';

export interface StaffUser {
  id: string;
  role: StaffRole;
  name: string;
  email: string;
  password: string;
  avatar: string;
  avatarColor: string;
  title: string;
}

export interface NavItem {
  id: string;
  icon: string;
  label: string;
  badge: string | null;
  route: string;
}

export interface NavSection {
  section: string;
  items: NavItem[];
}

export interface RoleConfig {
  label: string;
  accent: string;
  accentLight: string;
  badgeBg: string;
  badgeColor: string;
  nav: NavSection[];
}

export interface PortalNotification {
  id: number;
  icon: string;
  color: string;
  bg: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}