import { Component, OnInit } from '@angular/core';
import {ReferenceService} from '../services/reference.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
	  public refcategories: any;
	    constructor(private referenceService: ReferenceService ) { }
	    getCategorisService() {
	        this.referenceService.getCategories()
	            .subscribe((result: any) => {
	                this.refcategories = result;
	                this.referenceService.refcategories = this.refcategories;
	               // console.log(this.refcategories);
	            }),
              () => console.log('categoriss  are in the manage vidoes :' + this.refcategories);
	    }

        ngOnInit(){
           this.getCategorisService();
       }

}
