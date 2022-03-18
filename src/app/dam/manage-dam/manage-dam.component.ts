import { Component, OnInit } from '@angular/core';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
	selector: 'app-manage-dam',
	templateUrl: './manage-dam.component.html',
	styleUrls: ['./manage-dam.component.css']
})
export class ManageDamComponent implements OnInit {
	manageDam : boolean = true;
    editVideo : boolean = false;
	loading = false;
	uploadAsset = false;
	isPartnerView = false;
	constructor(public authenticationService:AuthenticationService,public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router) {
		
	}

	ngOnInit() {
		this.isPartnerView = this.router.url.indexOf('/shared')>-1;
	}

	

	viewPublishedContent(){
		this.referenceService.showSweetAlertInfoMessage();
	}

	showSuccessMessage(){
	this.referenceService.isUploaded = true;
    this.referenceService.goToRouter("/home/dam/manage");
	}

	goToUploadComponent(){
		this.loading = true;
		this.referenceService.goToRouter("/home/dam/select");
	}
	goToDam(){
		this.loading = true;
		if(this.isPartnerView){
			this.referenceService.goToRouter("/home/dam/shared");
		}else{
			this.referenceService.goToRouter("/home/dam/manage");
		}
		
	}
	
    setManageDam(result: any) {
    	this.manageDam = result;
    	this.editVideo = !result;
    }
    
    update(videoFile: any) {
        if (videoFile != null) {
            this.referenceService.isAssetDetailsUpldated = true;
        }
        this.referenceService.goToRouter("home/dam/manage");
    }
}
