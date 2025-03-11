import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of, switchMap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    if (isPlatformServer(this.platformId)) {
      return of(true);
    }

    return this.authService.isLoggedIn().pipe(
      switchMap(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['/login']);
          return of(false);
        }

        return this.authService.getUserRoleObservable().pipe(
          map(role => {
            const allowedRoles = route.data['roles'] as string[];
            if (role && allowedRoles.includes(role)) {
              return true;
            } else {
              this.router.navigate(['/unauthorized']);
              return false;
            }
          })
        );
      })
    );
  }
}
