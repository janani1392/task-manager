import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { TaskListComponent } from './components/task-list/task-list.component';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/tasks', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  { 
    path: 'tasks', 
    component: TaskListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];