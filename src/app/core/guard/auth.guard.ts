import { Injectable } from '@angular/core';

import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  manageSession(){
    clearTimeout(this.authService.timout);
    this.authService.timout = setTimeout(()=> {
      this.authService.logout();
      this.router.navigate(['/authentication/signin']);
    }
    , this.authService.ALLOWEDIDLETIME);
  }

  canActivate() {
    if (this.authService.isLoggedIn()) {
      this.manageSession();
      this.authService.refreshToken();
      return true;
    } else {
      this.authService.logout();
      this.router.navigate(['/authentication/signin']);
      return false;
    }
  }
}
