import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, TaskListComponent, TaskFormComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  currentUserName: string = '';
  shouldShowHeader: boolean = false;
  private routeSubscription?: Subscription;
  private authSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Check route changes
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateHeaderVisibility();
      }
    });

    // Check auth state changes
    this.authSubscription = this.authService.getCurrentUser().subscribe(user => {
      this.currentUserName = user?.user?.name || '';
      this.updateHeaderVisibility();
    });
  }

  private updateHeaderVisibility() {
    const currentUrl = this.router.url;
    const isAuthRoute = currentUrl.includes('/login') || currentUrl.includes('/register');
    const isLoggedIn = this.authService.isLoggedIn();
    
    this.shouldShowHeader = !isAuthRoute && isLoggedIn;
    
    // Redirect to login if not authenticated and trying to access protected route
    if (!isLoggedIn && !isAuthRoute) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }
}
