import { AuthGuardService } from './auth-guard.service';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const AppRoutes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './auth/auth.module#AuthModule',
      },
    ]
  },
  {
    path: '',
    canActivate: [AuthGuardService],
    component: MainLayoutComponent,
    children: [
      {
        path: 'request',
        canActivate: [AuthGuardService],
        loadChildren: './main/request/request.module#RequestModule',
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuardService],
        loadChildren: './main/dashboard/dashboard.module#DashboardModule',
      },
      { path: '**', redirectTo: 'dashboard' }
    ]
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
