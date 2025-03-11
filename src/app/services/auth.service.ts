import { Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword,createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Observable, of, switchMap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>; 
  role$: Observable<string | null>; 

  constructor(private auth: Auth, private firestore: Firestore) {
    this.user$ = authState(this.auth); 

    this.role$ = this.user$.pipe(
      switchMap(user => {
        if (user) {
          return this.getUserRole(user.email);
        } else {
          return of(null);
        }
      })
    );
  }

  async getUserRole(email: string | null): Promise<string | null> {
    if (!email) return null;
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return userData['role'] || null;
    }
    return null;
  }

  login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }
  isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
  }

  getUserRoleObservable(): Observable<string | null> {
    return this.role$;
  }
}
