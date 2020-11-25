import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate,


  Router, RouterStateSnapshot
} from '@angular/router';
import { Select } from '@ngxs/store';
import {
  Observable,
  of
} from 'rxjs';
import {
  catchError,
  map
} from 'rxjs/operators';
import { AuthState } from './state/auth.state';


@Injectable() export class AuthGuard implements CanActivate {
  @Select(AuthState.loggedIn) isLoggedIn$: Observable<boolean>;
  constructor(private router: Router) { }


  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.isLoggedIn$.pipe(
      map(e => {
        console.log('AUTH GUARD SAYS: ', e);
        if (e) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError((err) => {
        console.log('AUTH GUARD SAYS: ', err);
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
