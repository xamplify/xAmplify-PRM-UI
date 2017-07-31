import { Component, OnInit } from '@angular/core';
import { ReferenceService } from '../services/reference.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
        public refcategories: any;
	    constructor(public referenceService: ReferenceService, public userService: UserService) {  }
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
           this.getCategorisService();
		   this.getVideoTitles();
		   this.getVideoDefaultSettings();
       }

}
