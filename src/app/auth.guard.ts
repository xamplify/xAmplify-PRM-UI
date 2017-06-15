import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {AuthenticationService} from './core/services/authentication.service';
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authenticationService: AuthenticationService) { }

    canActivate() {
    	console.log("canActivate() : AuthGuard");
        if (this.authenticationService.userToken != undefined) {
            // logged in so return true
            return true;
        }
        console.log("canActivate() router.navigate : /login");
        // not logged in so redirect to login page
        this.router.navigateByUrl('/login');
        return false;
    }
}