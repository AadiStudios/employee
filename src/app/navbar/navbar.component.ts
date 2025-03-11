import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-navbar',
    imports: [CommonModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLoggedIn = false;

  constructor(private authService: AuthService,private router: Router) {
    this.authService.isLoggedIn().subscribe(isAuth => {
      this.isLoggedIn = isAuth;
    });
  }
  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']); 
    });
  }
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
