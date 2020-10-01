import { Component, OnInit,Input } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
declare var BeePlugin,swal,$:any;

@Component({
	selector: 'app-bee-template-util',
	templateUrl: './bee-template-util.component.html',
	styleUrls: ['./bee-template-util.component.css']
})
export class BeeTemplateUtilComponent implements OnInit {

	loading = false;
	@Input() jsonBody: any;
	constructor(private referenceService:ReferenceService) { }

	ngOnInit() {
		this.loading =  true;
		this.loadContainer();
	}
	
	loadContainer(){
		let jsonBody = this.jsonBody;
		if(jsonBody!=undefined){
			
		}else{
			this.loading =false;
			this.referenceService.showSweetAlertErrorMessage("Input data not found for loading container.Please try aftersometime");
			this.referenceService.goToRouter("/home/dashboard");
		}
	}

}
