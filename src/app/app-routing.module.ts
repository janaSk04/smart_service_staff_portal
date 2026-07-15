import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  { path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  { path: 'login', 
    component: LoginComponent 
  },
  {
    path: 'portal',
    loadChildren: () => 
     import('./portal/portal.module')
    .then((m) => m.PortalModule),
  },
  { 
    path: '**', 
    redirectTo: 'login' 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
