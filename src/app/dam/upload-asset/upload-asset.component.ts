import { Component, OnInit,Output,EventEmitter } from '@angular/core';
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
  providers:[Properties]
})
export class UploadAssetComponent implements OnInit {
  modalPopupLoader = false;
	customResponse:CustomResponse = new CustomResponse();
	damUploadPostDto:DamUploadPostDto = new DamUploadPostDto();
	formData: any = new FormData();
	@Output() notificationFromUploadAsset = new EventEmitter();
  constructor(private damService: DamService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties) { }

  ngOnInit() {
    $('#uploadDamModalPopup').modal('show');	
  }

	closePopup(){
		this.notificationFromUploadAsset.emit();
		this.customResponse = new CustomResponse();
		this.formData = new FormData();
		this.clearFile();
		this.damUploadPostDto = new DamUploadPostDto();
		$('#uploadDamModalPopup').modal('hide');	
	}

	onFileChangeEvent(event:any){
		if (event.target.files.length > 0) {
		  let file = event.target.files[0];
		  this.formData.append("uploadedFile", file, file['name']);
		} else {
		  this.referenceService.showSweetAlertErrorMessage("No File Found")
		}
	  }

	uploadAsset(){
		this.customResponse = new CustomResponse();
		this.damUploadPostDto.loggedInUserId = this.authenticationService.getUserId();
		let  fileLength = $("#uploadedAsset")[0].files.length;
		if(fileLength==0){
			this.customResponse = new CustomResponse('ERROR','Please upload file',true);
		  }else{
			this.modalPopupLoader = true;
			this.damService.uploadAsset(this.formData,this.damUploadPostDto).subscribe(
			  (result: any) => {
				this.clearFile();
				if(result.statusCode==200){
				  this.closePopup();
				  this.referenceService.showSweetAlertSuccessMessage("Uploaded Successfully");
				}else if(result.statusCode==400){
				  this.customResponse = new CustomResponse('ERROR',result.message,true);
				}else if(result.statusCode==404){
				  this.referenceService.showSweetAlertErrorMessage("Invalid Request");
				}
			  this.modalPopupLoader = false;
			  }, error => {
			  this.clearFile();
			  this.modalPopupLoader = false;
			  this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
			  this.xtremandLogger.log(error);
			  });
		  }
	}

	clearFile(){
		$('#uploadedAsset').val('');
		this.formData = new FormData();
	}
}
