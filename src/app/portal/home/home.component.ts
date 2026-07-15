import { Component, OnInit } from '@angular/core';
import { StaffRole } from '../../core/models/portal.models';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AgentDashboardComponent } from './agent-dashboard/agent-dashboard.component';
import { TechnicianDashboardComponent } from './technician-dashboard/technician-dashboard.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports:[
    CommonModule,
    AdminDashboardComponent,
    AgentDashboardComponent,
    TechnicianDashboardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
    role: StaffRole = 'admin';

    constructor(private auth: AuthService) {}

    ngOnInit(): void {
    this.role = this.auth.getRole() ?? 'admin';
  }
}
