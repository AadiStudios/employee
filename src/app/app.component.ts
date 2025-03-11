import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeFormComponent } from "./employee-form/employee-form.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,  
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'employeeapp';
  isLoggedIn = false;

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user; 
    });
    this.authService.logout(); 
  }
}
