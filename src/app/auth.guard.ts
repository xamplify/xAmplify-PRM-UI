import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
    	console.log("canActivate() : AuthGuard");
        if (localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }
        console.log("canActivate() router.navigate : /login");
        // not logged in so redirect to login page
        this.router.navigateByUrl('/login');
        return false;
    }
}