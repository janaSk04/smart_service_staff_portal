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
        path: 'complaints', 
        component: ComplaintsComponent 
      },
      { 
        path: 'requests', 
        component: RequestsComponent 
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
        path: 'schedule', 
        component: ScheduleComponent 
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
