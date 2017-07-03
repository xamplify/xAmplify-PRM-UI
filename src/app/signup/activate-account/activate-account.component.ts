import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
    selector: 'app-activate-account',
    templateUrl: './activate-account.component.html',
    styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit {
    public alias: string;
    constructor(private activatedRoute: ActivatedRoute, private userService:UserService, private router : Router) { }
    
    activateAccount(){
        this.userService.activateAccount(this.alias)
        .subscribe(
         (result: any) => {
          console.log(result);
          this.router.navigate( ['/login'] );

    });
    	
    }

    ngOnInit() {
        
        this.activatedRoute.queryParams.subscribe(
            (param: any) => {
                this.alias = param['alias'];
            });
        this.activateAccount();
    }

}

