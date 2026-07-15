import { Component, OnDestroy, OnInit } from '@angular/core';
import { StaffRole } from '../../core/models/portal.models';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RoleConfigService } from '../../core/services/role-config.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit,OnDestroy{
selectedRole: StaffRole = 'admin';
  email = '';
  password = '';
  showPassword = false;
  loading = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private roleConfig: RoleConfigService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/portal']);
      return;
    }
    this.selectRole('admin');
    document.body.classList.add('auth-layout');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('auth-layout');
  }

  get demoHint(): string {
    return this.roleConfig.demoHints[this.selectedRole];
  }

  selectRole(role: StaffRole): void {
    this.selectedRole = role;
    this.roleConfig.applyTheme(role);
    const user = this.roleConfig.users.find((u) => u.role === role);
    if (user) {
      this.email = user.email;
      this.password = user.password;
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  handleLogin(event: Event): void {
    event.preventDefault();
    this.loading = true;

    setTimeout(() => {
      const user = this.roleConfig.findUser(
        this.email.trim(),
        this.password,
        this.selectedRole
      );

      if (user) {
        this.auth.login(user);
        this.router.navigate(['/portal']);
      } else {
        this.loading = false;
        this.toast.show('Invalid credentials. Try the demo hint above.', 'error');
      }
    }, 900);
  }
}
