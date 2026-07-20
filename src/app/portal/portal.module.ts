import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortalRoutingModule } from './portal-routing.module';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { ChatComponent } from './views/chat/chat.component';
import { AnalyticsComponent } from './views/analytics/analytics.component';
import { JobsComponent } from './views/jobs/jobs.component';
import { ScheduleComponent } from './views/schedule/schedule.component';
import { RequestsComponent } from './views/requests/requests.component';
import { UsersComponent } from './views/users/users.component';
import { ComplaintsComponent } from './views/complaints/complaints.component';
import { UnderConstructionComponent } from './views/under-construction/under-construction.component';
import { AssignComponent } from './views/assign/assign.component';
import { ProfileComponent } from './views/profile/profile.component';



@NgModule({
  declarations: [
    ShellComponent,
    ChatComponent,
    AnalyticsComponent,
    ScheduleComponent,
    RequestsComponent,

  ],
  imports: [
    CommonModule,
    PortalRoutingModule,
    FormsModule,
    RouterModule,
    HomeComponent,
    UsersComponent,
    JobsComponent,
    ComplaintsComponent,
    AssignComponent,
    ProfileComponent,
    UnderConstructionComponent
  ]
})
export class PortalModule { }
