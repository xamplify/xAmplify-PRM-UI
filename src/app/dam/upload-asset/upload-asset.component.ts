import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DamUploadPostDto } from '../models/dam-upload-post-dto';
import { CustomResponse } from 'app/common/models/custom-response';
import { DamService } from '../services/dam.service';
import { Properties } from '../../common/models/properties';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
declare var $: any;

@Component({
	selector: 'app-upload-asset',
	templateUrl: './upload-asset.component.html',
	styleUrls: ['./upload-asset.component.css'],
	providers: [Properties]
})
export class UploadAssetComponent implements OnInit {
	formLoader = false;
	customResponse: CustomResponse = new CustomResponse();
	damUploadPostDto: DamUploadPostDto = new DamUploadPostDto();
	formData: any = new FormData();
	loading = false;
	dupliateNameErrorMessage: string;
	descriptionErrorMessage: string;
	constructor(private damService: DamService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties) { }
	ngOnInit() {
	}

	onFileChangeEvent(event: any) {
		if (event.target.files.length > 0) {
			let file = event.target.files[0];
			this.formData.append("uploadedFile", file, file['name']);
		} else {
			this.referenceService.showSweetAlertErrorMessage("No File Found")
		}
	}

	uploadAsset() {
		this.clearErrors();
		this.damUploadPostDto.loggedInUserId = this.authenticationService.getUserId();
		let fileLength = $("#uploadedAsset")[0].files.length;
		if (fileLength == 0 || $.trim(this.damUploadPostDto.assetName).length == 0) {
			this.customResponse = new CustomResponse('ERROR', 'Please fill required fields', true);
		} else {
			this.formLoader = true;
			this.damService.uploadAsset(this.formData, this.damUploadPostDto).subscribe(
				(result: any) => {
					if (result.statusCode == 200) {
						this.referenceService.isUploaded = true;
						this.referenceService.goToRouter("home/dam/manage");
					} else if (result.statusCode == 400) {
						this.customResponse = new CustomResponse('ERROR', result.message, true);
					} else if (result.statusCode == 404) {
						this.referenceService.showSweetAlertErrorMessage("Invalid Request");
					}
					this.formLoader = false;
				}, error => {
					this.formLoader = false;
					let statusCode = JSON.parse(error['status']);
					if (statusCode == 409) {
						this.dupliateNameErrorMessage = "Already exists";
					} else {
						this.xtremandLogger.log(error);
						this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
					}
				});
		}
	}


	goToManageDam() {
		this.loading = true;
		this.referenceService.goToRouter("home/dam/manage");
	}

	clearErrors(){
		this.dupliateNameErrorMessage = "";
		this.descriptionErrorMessage = "";
		this.customResponse = new CustomResponse();
	}

	validateForm(){
		
	}

	
}
