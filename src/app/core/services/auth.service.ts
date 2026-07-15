import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StaffRole, StaffUser } from '../models/portal.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'servex_user';

  constructor(private router: Router) {}

  getUser(): StaffUser | null {
    const raw = sessionStorage.getItem(this.storageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StaffUser;
    } catch {
      return null;
    }
  }

  getRole(): StaffRole | null {
    return this.getUser()?.role ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  login(user: StaffUser): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  logout(): void {
    sessionStorage.removeItem(this.storageKey);
    this.router.navigate(['/login']);
  }
}

