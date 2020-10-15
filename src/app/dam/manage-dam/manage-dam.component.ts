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
	loading = false;
	uploadAsset = false;
	isPartnerView = false;
	constructor(public authenticationService:AuthenticationService,public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router) {
		
	}

	ngOnInit() {
		this.isPartnerView = this.router.url.indexOf('/shared')>-1;
	}

	addAsset() {
		this.loading = true;
		this.referenceService.goToRouter("/home/dam/add");
	}

	viewPublishedContent(){
		this.referenceService.showSweetAlertInfoMessage();
	}

	goToUploadComponent(){
		this.uploadAsset = true;
	}

	clearValues(){
		this.uploadAsset = false;
	}
	showSuccessMessage(){
	this.referenceService.isUploaded = true;
    this.referenceService.goToRouter("/home/dam/manage");
	}
}
