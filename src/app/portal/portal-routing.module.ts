import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './views/chat/chat.component';
import { AnalyticsComponent } from './views/analytics/analytics.component';
import { JobsComponent } from './views/jobs/jobs.component';
import { RequestsComponent } from './views/requests/requests.component';
import { ScheduleComponent } from './views/schedule/schedule.component';
import { UsersComponent } from './views/users/users.component';
import { ComplaintsComponent } from './views/complaints/complaints.component';
import { UnderConstructionComponent } from './views/under-construction/under-construction.component';
import { AssignComponent } from './views/assign/assign.component';
import { ProfileComponent } from './views/profile/profile.component';
import { SettingsComponent } from './views/settings/settings.component';
import { TechniciansComponent } from './views/technicians/technicians.component';
import { AgentsComponent } from './views/agents/agents.component';
import { HistoryComponent } from './views/history/history.component';
import { AuditComponent } from './views/audit/audit.component';
import { ServicesComponent } from './views/services/services.component';
import { ReportsComponent } from './views/reports/reports.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children:[
      { 
        path: '', 
        component: HomeComponent 
      },
      { 
        path: 'analytics', 
        component: AnalyticsComponent 
      },
      { 
        path: 'users', 
        component: UsersComponent 
      },
      { 
        path: 'agents', 
        component: AgentsComponent 
      },
      { 
        path: 'technicians', 
        component: TechniciansComponent 
      },
      { 
        path: 'complaints', 
        component: ComplaintsComponent 
      },
      { 
        path: 'requests', 
        component: RequestsComponent 
      },
      { 
        path: 'assign', 
        component: AssignComponent 

      },
      { 
        path: 'chat', 
        component: ChatComponent 
      },
      { 
        path: 'jobs', 
        component: JobsComponent 
      },
      { 
        path: 'services', 
        component: ServicesComponent 
      },
      { 
        path: 'schedule', 
        component: ScheduleComponent 
      },
      { 
        path: 'profile', 
        component: ProfileComponent 
      },
      { 
        path: 'settings', 
        component: SettingsComponent 
      },
      { 
        path: 'audit', 
        component: AuditComponent 
      },
      { 
        path: 'reports', 
        component: ReportsComponent 
      },
      { 
        path: 'history', 
        component: HistoryComponent 
      },
      { 
        path: 'under-construction', 
        component: UnderConstructionComponent 
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }
