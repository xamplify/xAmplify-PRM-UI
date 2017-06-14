import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {UtilService} from './core/services/util.service';
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private utilService: UtilService) { }

    canActivate() {
    	console.log("canActivate() : AuthGuard");
        if (this.utilService.userToken) {
            // logged in so return true
            return true;
        }
        console.log("canActivate() router.navigate : /login");
        // not logged in so redirect to login page
        this.router.navigateByUrl('/login');
        return false;
    }
}