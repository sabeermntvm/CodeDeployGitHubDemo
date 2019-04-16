import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

/* import { UserService } from '../core/services'; */
import { map ,  take } from 'rxjs/operators';

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

    return Observable.of(true); ; //this.userService.isAuthenticated.pipe(take(1), map(isAuth => !isAuth));

  }
}
