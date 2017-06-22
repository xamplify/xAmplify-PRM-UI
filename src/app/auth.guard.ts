import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor( private authService: AuthenticationService, private router: Router ) { }
    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
        const url: string = state.url;
        return this.checkLogin( url );
    }
    canActivateChild( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
        return this.canActivate( route, state );
    }
    checkLogin( url: string ): boolean {
        if ( localStorage.getItem( 'currentUser' ) ) {
            return true;
        }
        // Store the attempted URL for redirecting
        // this.authService.redirectUrl = url;
        // Navigate to the login page
        this.router.navigate( ['/login'] );
        return false;
    }
 }