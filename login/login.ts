import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginData: LoginData = {
    email: '',
    password: ''
  };

  isLoading = false;

  correo: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onLogin(): void {
    if (this.isLoading) return;

    console.log('Login attempt with:', this.loginData);
    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      
      // Mock successful login
      if (this.loginData.email && this.loginData.password) {
        console.log('Login successful!');
        this.showSuccessMessage('Login exitoso!');
        
        // Navigate to dashboard or home page
        // this.router.navigate(['/dashboard']);
      } else {
        this.showErrorMessage('Por favor llena todos los campos');
      }
    }, 2000);
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    console.log('Forgot password clicked');
    this.showInfoMessage('Password reset link will be sent to your email');
    
    // Here you would typically navigate to forgot password page
    // this.router.navigate(['/forgot-password']);
  }

  loginWithGoogle(): void {
    console.log('Google login clicked');
    this.showInfoMessage('Google login integration needed');
    
    // Here you would integrate with Google OAuth
    // Example: this.authService.loginWithGoogle();
  }

  loginWithGithub(): void {
    console.log('GitHub login clicked');
    this.showInfoMessage('GitHub login integration needed');
    
    // Here you would integrate with GitHub OAuth
    // Example: this.authService.loginWithGithub();
  }

  loginWithFacebook(): void {
    console.log('Facebook login clicked');
    this.showInfoMessage('Facebook login integration needed');
    
    // Here you would integrate with Facebook OAuth
    // Example: this.authService.loginWithFacebook();
  }

  switchToRegister(event: Event): void {
    event.preventDefault();
    console.log('Switching to register');
    
    // Navigate to register page
    this.router.navigate(['/register']);
  }

  private showSuccessMessage(message: string): void {
    // You can integrate with a toast notification service here
    alert(message);
  }

  private showErrorMessage(message: string): void {
    // You can integrate with a toast notification service here
    alert(message);
  }

  private showInfoMessage(message: string): void {
    // You can integrate with a toast notification service here
    alert(message);
  }

  iniciarSesion(): void {
    if (this.isLoading) return;
    this.isLoading = true;
    // Simula la lógica de login
    setTimeout(() => {
      this.isLoading = false;
      if (this.correo && this.password) {
        this.showSuccessMessage('Login exitoso!');
        // this.router.navigate(['/dashboard']);
      } else {
        this.showErrorMessage('Por favor llena todos los campos');
      }
    }, 2000);
  }
}

