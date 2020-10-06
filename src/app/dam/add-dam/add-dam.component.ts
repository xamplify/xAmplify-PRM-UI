import { Component, OnInit } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpClient } from "@angular/common/http";
import {DamPostDto} from '../models/dam-post-dto';
import {DamService} from '../services/dam.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { ErrorResponse } from 'app/util/models/error-response';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

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
  assetId:number=0;
  isAdd = false;
  modalTitle = "";
  saveOrUpdateButtonText  = "";
  constructor(public router: Router,private route:ActivatedRoute,public properties: Properties,private damService:DamService,private authenticationService:AuthenticationService,public referenceService:ReferenceService,private httpClient:HttpClient) {
    this.loggedInUserId = this.authenticationService.getUserId();
   }

  ngOnInit() {
    this.ngxloading = true;
    if(this.router.url.indexOf('/edit')>-1){
      this.assetId = this.route.snapshot.params['id'];
      if(this.assetId>0){
        this.isAdd = false;
        this.modalTitle = "Update Details";
        this.saveOrUpdateButtonText = "Update";
        this.getById();
      }else{
        this.referenceService.showSweetAlertErrorMessage("Invalid Id");
        this.referenceService.goToRouter("/home/dam");
      }
    }else{
      this.isAdd = true;
      this.modalTitle = "Add Details";
      this.saveOrUpdateButtonText = "Save";
      this.httpClient.get("assets/config-files/bee-default-asset.json").subscribe(data =>{
        this.jsonBody = JSON.stringify(data);
        this.ngxloading = false;
      });
    }
  }

  getById(){
    this.damService.getById(this.assetId).subscribe((result: any) => {
      if (result.statusCode === 200) {
        let dam = result.data;
        this.jsonBody = dam.jsonBody;
        this.damPostDto.name = dam.assetName;
        this.damPostDto.description = dam.description;
        this.ngxloading = false;
      }
    }, _error => {
      this.ngxloading = false;
      this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
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

saveOrUpdate(){
  this.customResponse = new CustomResponse();
  this.modalPopupLoader = true;
  this.damPostDto.createdBy = this.loggedInUserId;
  if(!this.isAdd){
    this.damPostDto.id = this.assetId;
  }
  this.damService.save(this.damPostDto).subscribe((result: any) => {
    if (result.statusCode === 200) {
      this.hidePopup();
      this.referenceService.goToRouter("/home/dam/manage");
      if(this.isAdd){
        this.referenceService.isCreated = true;
      }else{
        this.referenceService.isUpdated = true;
      }
      
    }
    this.modalPopupLoader = false;
  }, _error => {
    this.modalPopupLoader = false;
    this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
  });
}

update(){

}

}
