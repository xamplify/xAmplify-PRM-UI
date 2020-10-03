import { Component, OnInit } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpClient } from "@angular/common/http";
import {DamPostDto} from '../models/dam-post-dto';
import {DamService} from '../services/dam.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { ErrorResponse } from 'app/util/models/error-response';
declare var $:any;
@Component({
  selector: 'app-add-dam',
  templateUrl: './add-dam.component.html',
  styleUrls: ['./add-dam.component.css'],
  providers: [Properties]
})
export class AddDamComponent implements OnInit {
  ngxloading = false;
  jsonBody:any;
  damPostDto : DamPostDto = new DamPostDto();
  loggedInUserId:number = 0;
  modalPopupLoader: boolean;
  customResponse:CustomResponse = new CustomResponse();
  constructor(public properties: Properties,private damService:DamService,private authenticationService:AuthenticationService,public referenceService:ReferenceService,private httpClient:HttpClient) {
    this.loggedInUserId = this.authenticationService.getUserId();
   }

  ngOnInit() {
    this.ngxloading = true;
    this.httpClient.get("assets/config-files/bee-default-asset.json").subscribe(data =>{
      this.jsonBody = JSON.stringify(data);
      this.ngxloading = false;
    });
  }

goToManageDam(){
	this.ngxloading = true;
	this.referenceService.goToRouter("/home/dam/manage");
}

readBeeTemplateData(event:any){
  this.damPostDto.jsonBody = event.jsonContent;
  this.damPostDto.htmlBody = event.htmlContent;
  $('#addAssetDetailsPopup').modal('show');
}

hidePopup(){
  $('#addAssetDetailsPopup').modal('hide');
}

save(){
  this.customResponse = new CustomResponse();
  this.modalPopupLoader = true;
  this.damPostDto.createdBy = this.loggedInUserId;
  this.damService.save(this.damPostDto).subscribe((result: any) => {
    if (result.statusCode === 200) {
      this.hidePopup();
      this.referenceService.goToRouter("/home/dam/manage");
      this.referenceService.isCreated = true;
    }
    this.modalPopupLoader = false;
  }, error => {
    this.modalPopupLoader = false;
    this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
  });
  console.log(this.damPostDto);
}

}
