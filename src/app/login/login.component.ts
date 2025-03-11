import { Component, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = signal('');
  password = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email(), this.password())
      // .then(res => console.log('Login Successful', res))
      .then(res => {
        console.log('Login Successful', res);
        this.router.navigate(['/wage']); 
      })
      .catch(err =>{console.error('Login Failed', err);
        alert('Invalid Credentials');
      });
  }

  redirect(){
    this.router.navigate(['/register']);
  }

}
