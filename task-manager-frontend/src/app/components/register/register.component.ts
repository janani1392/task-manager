import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: ''
  };
  error: any = '';
  isLoading = false;
  
  passwordChecks = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  };
  
  passwordStrength = 0;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  checkPasswordStrength() {
    const password = this.user.password;
    
    // Update individual checks
    this.passwordChecks.length = password.length >= 8;
    this.passwordChecks.uppercase = /[A-Z]/.test(password);
    this.passwordChecks.lowercase = /[a-z]/.test(password);
    this.passwordChecks.number = /\d/.test(password);
    this.passwordChecks.special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // Calculate strength percentage
    const metChecks = Object.values(this.passwordChecks).filter(Boolean).length;
    this.passwordStrength = (metChecks / 5) * 100;
  }

  getStrengthClass(): string {
    if (this.passwordStrength <= 40) return 'weak';
    if (this.passwordStrength <= 80) return 'medium';
    return 'strong';
  }

  getStrengthText(): string {
    if (this.passwordStrength <= 40) return 'Weak';
    if (this.passwordStrength <= 80) return 'Medium';
    return 'Strong';
  }

  isPasswordValid(): boolean {
    return Object.values(this.passwordChecks).every(Boolean);
  }

  getErrorList(): string[] {
    if (typeof this.error === 'string') return [this.error];
    if (Array.isArray(this.error)) return this.error;
    if (this.error.errors) return this.error.errors;
    return [JSON.stringify(this.error)];
  }

  onSubmit() {
    if (!this.isPasswordValid()) {
      this.error = 'Please meet all password requirements';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.register(this.user)
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = err;
          this.isLoading = false;
        }
      });
  }
}