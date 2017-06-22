import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor( private authenticationService: AuthenticationService, private router: Router ) { }
    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
        const url: string = state.url;
        return this.checkLogin( url );
    }
    canActivateChild( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
        return this.canActivate( route, state );
    }
    checkLogin( url: string ): boolean {
        let currentUser = localStorage.getItem( 'currentUser' );
        if ( currentUser ) {
            this.authenticationService.access_token = JSON.parse( currentUser )['accessToken'];
            this.authenticationService.refresh_token = JSON.parse( currentUser )['refreshToken'];
            const userName = JSON.parse( currentUser )['userName'];

            if ( !this.authenticationService.user.id ) {
                this.getUserByUserName( userName );
            }

            return true;
        }
        // Store the attempted URL for redirecting
        // this.authService.redirectUrl = url;
        // Navigate to the login page
        this.router.navigate( ['/login'] );
        return false;
    }

    getUserByUserName( userName: string ) {
        this.authenticationService.getUserByUserName( userName )
            .subscribe(
            data => {
                this.authenticationService.user = data;
            },
            error => {console.log( error ); this.router.navigate( ['/login'] );},
            () => { }
            );
    }
 }