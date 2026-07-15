import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './views/chat/chat.component';
import { AnalyticsComponent } from './views/analytics/analytics.component';
import { JobsComponent } from './views/jobs/jobs.component';
import { RequestsComponent } from './views/requests/requests.component';
import { ScheduleComponent } from './views/schedule/schedule.component';

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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }
