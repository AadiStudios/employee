import { Component, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-register',
    imports: [CommonModule, FormsModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = signal('');
  email = signal('');
  password = signal('');
  phoneNumber = signal('');

  constructor(private authService: AuthService, private firestore: Firestore, private router: Router) {}

  async register() {
    try {
      const userCredential = await this.authService.register(this.email(), this.password());

      const user = userCredential.user;
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userDocRef, {
        uid: user.uid,
        name: this.name(),
        email: this.email(),
        phoneNumber: this.phoneNumber(),
        role: 'guest' 
      });

      console.log('Registration Successful', user);
      this.router.navigate(['/wage']); 
    } catch (err) {
      console.error('Registration Failed', err);
    }
  }
}
