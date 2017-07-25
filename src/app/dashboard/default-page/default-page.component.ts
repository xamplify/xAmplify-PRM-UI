import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../core/services/authentication.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-default-page',
  templateUrl: './default-page.component.html',
  styleUrls: ['./default-page.component.css']
})
export class DefaultPageComponent implements OnInit {
    defaultPage: string;
    constructor( private router: Router, private userService: UserService, private authenticationService: AuthenticationService ) { }

    getDefaultPage( userId: number ) {
        this.userService.getUserDefaultPage( userId )
            .subscribe(
            data => this.defaultPage = data['_body'].replace( /['"]+/g, '' ),
            error => console.log( error ),
            () => {
                console.log( this.defaultPage );
                if( this.defaultPage  === 'welcome'){
                    this.router.navigate( ['/home/dashboard/welcome'] );
                }else{
                    this.router.navigate( ['/home/dashboard'] );
                }
            }
            );
    }
    ngOnInit() {
        const userId = this.authenticationService.user.id;
        this.getDefaultPage( userId );
    }

}
