import { Component, OnInit } from '@angular/core';
import { ReferenceService } from '../services/reference.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
declare var $:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
		public refcategories: any;
		public currentUser = JSON.parse(localStorage.getItem('currentUser'));
	    constructor(public referenceService: ReferenceService, public userService: UserService,private router:Router,public authenticationService:AuthenticationService) { 
	        this.isAuthorized();
	    }
	    
	    
	    isAuthorized():boolean{
	        if(!localStorage.getItem( 'currentUser' )){
	            $('.page-container,.page-header.navbar.navbar-fixed-top').html('');
                this.router.navigateByUrl('/login');
                return false;
            }
	    }
	    getCategorisService() {
	        this.referenceService.getCategories()
	            .subscribe((result: any) => {
	                this.refcategories = result;
	                this.referenceService.refcategories = this.refcategories;
	               // console.log(this.refcategories);
	            });
				 () => console.log('categoriss  are in the manage vidoes :' + this.refcategories);
	    } 
		getVideoTitles() {
			  this.referenceService.getVideoTitles()
	            .subscribe((result: any) => {
	                this.referenceService.videoTitles = result.titles;
	            });
		}
		getVideoDefaultSettings() {
        this.userService.getVideoDefaultSettings().subscribe(
           (result: any) => {
               var body = result['_body'];
                if ( body != "" ) {
                var response = JSON.parse( body );
                console.log(response);
                this.referenceService.defaultPlayerSettings = response; }
		   });
		}
        ngOnInit() {
        //  this.getCategorisService();
		//  this.getVideoTitles();
			if (this.referenceService.defaulgVideoMethodCalled === false && this.currentUser.roles.length>1 && this.authenticationService.hasCompany()) {
			this.getVideoDefaultSettings();
			this.referenceService.defaulgVideoMethodCalled = true;
			}
			
       }

}
