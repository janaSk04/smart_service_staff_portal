import { Injectable } from '@angular/core';
import { PortalNotification, StaffRole } from '../models/portal.models';

const NOTIFS: Record<StaffRole, PortalNotification[]> = {
  admin: [
    { id: 1, icon: 'fa-exclamation-triangle', color: '#ef4444', bg: '#fee2e2', title: 'SLA Breach', desc: 'REQ-0320 is 45 minutes overdue in Zone 1', time: '2m ago', unread: true },
    { id: 2, icon: 'fa-user-plus', color: '#4f8ef7', bg: '#eef4fe', title: 'New User', desc: 'Chamara Tissa joined as Technician', time: '15m ago', unread: true },
    { id: 3, icon: 'fa-chart-line', color: '#8b5cf6', bg: '#f3e8ff', title: 'Report Ready', desc: 'Q1 2026 performance report is available', time: '1h ago', unread: true },
    { id: 4, icon: 'fa-circle-check', color: '#10b981', bg: '#d1fae5', title: 'Bulk Complete', desc: 'Zone 4 bulk pickups done (12 requests)', time: '2h ago', unread: false },
  ],
  agent: [
    { id: 1, icon: 'fa-circle-exclamation', color: '#f59e0b', bg: '#fef3c7', title: 'High Priority Request', desc: 'REQ-0342 needs immediate assignment', time: '1m ago', unread: true },
    { id: 2, icon: 'fa-location-dot', color: '#4f8ef7', bg: '#eef4fe', title: 'Technician Check-in', desc: 'Roshan Fernando checked in at Zone 1', time: '10m ago', unread: true },
    { id: 3, icon: 'fa-comment', color: '#10b981', bg: '#d1fae5', title: 'Message from Amal', desc: 'Job REQ-0338 may need extra parts', time: '25m ago', unread: true },
    { id: 4, icon: 'fa-calendar', color: '#8b5cf6', bg: '#f3e8ff', title: 'Schedule Update', desc: '3 jobs rescheduled for tomorrow', time: '1h ago', unread: false },
  ],
  technician: [
    { id: 1, icon: 'fa-briefcase', color: '#f97316', bg: '#fff3eb', title: 'New Job Assigned', desc: 'REQ-0350 assigned — Pest Control, 5:00 PM', time: '5m ago', unread: true },
    { id: 2, icon: 'fa-comment', color: '#4f8ef7', bg: '#eef4fe', title: 'Message from Agent', desc: 'Nadeesha: Please confirm REQ-0341 ETA', time: '20m ago', unread: true },
    { id: 3, icon: 'fa-star', color: '#f59e0b', bg: '#fef3c7', title: 'New Rating', desc: 'You received a 5.0 star rating on REQ-0315', time: '2h ago', unread: false },
    { id: 4, icon: 'fa-coins', color: '#10b981', bg: '#d1fae5', title: 'Payment Credited', desc: "LKR 4,200 credited for today's work", time: '3h ago', unread: false },
  ],
};

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  getForRole(role: StaffRole | null | undefined): PortalNotification[] {
    const key = role && NOTIFS[role] ? role : 'admin';
    return NOTIFS[key].map((n) => ({ ...n }));
  }
}
