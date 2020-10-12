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
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";

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
  name = "";
  description = "";
  validForm = false;
  nameErrorMessage = "";
  isPartnerView =false;
  constructor(private xtremandLogger:XtremandLogger,public router: Router,private route:ActivatedRoute,public properties: Properties,private damService:DamService,private authenticationService:AuthenticationService,public referenceService:ReferenceService,private httpClient:HttpClient) {
    this.loggedInUserId = this.authenticationService.getUserId();
   }

  ngOnInit() {
    this.ngxloading = true;
    if(this.router.url.indexOf('/edit')>-1){
      this.assetId = this.route.snapshot.params['id'];
      if(this.assetId>0){
        this.isPartnerView = this.router.url.indexOf('/editp')>-1;
        this.isAdd = false;
        this.modalTitle = "Update Details";
        this.saveOrUpdateButtonText = "Update";
        this.getById();
      }else{
        this.goToManageSectionWithError();
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

  goToManageSectionWithError(){
    this.referenceService.showSweetAlertErrorMessage("Invalid Id");
        this.referenceService.goToRouter("/home/dam");
  }

  getById(){
    this.damService.getById(this.assetId,this.isPartnerView).subscribe((result: any) => {
      if (result.statusCode === 200) {
        let dam = result.data;
        if(dam!=undefined){
          this.jsonBody = dam.jsonBody;
          this.damPostDto.name = dam.assetName;
          this.damPostDto.description = dam.description;
          this.name = dam.assetName;
          this.validForm = true;
          this.nameErrorMessage = "";
          this.description = dam.description;
        }else{
          this.goToManageSectionWithError();
        }
        this.ngxloading = false;
      }
    }, error => {
      this.xtremandLogger.log(error);
      this.ngxloading = false;
      this.goBack();
      this.referenceService.showSweetAlertServerErrorMessage();
    });
  }

  goBack(){
  this.ngxloading = true;
  if(this.isPartnerView){
    this.referenceService.goToRouter("/home/dam/shared");
  }else{
    this.referenceService.goToRouter("/home/dam/manage");
  }
}

readBeeTemplateData(event:any){
  this.damPostDto.jsonBody = event.jsonContent;
  this.damPostDto.htmlBody = event.htmlContent;
  $('#addAssetDetailsPopup').modal('show');
}

hidePopup(){
  $('#addAssetDetailsPopup').modal('hide');
  if(!this.isAdd){
    if($.trim(this.damPostDto.name).length==0){
      this.damPostDto.name = this.name;
    }
    if($.trim(this.damPostDto.description).length==0){
      this.damPostDto.description = this.description;
    }
  }
}

validateName(name:string){
  this.validForm = (name!=undefined && $.trim(name).length>0);
}


saveOrUpdate(){
  this.nameErrorMessage = "";
  this.customResponse = new CustomResponse();
  this.modalPopupLoader = true;
  this.damPostDto.createdBy = this.loggedInUserId;
  if(this.isPartnerView){
      this.updatePublishedAsset();
  }else{
    if(!this.isAdd){
      this.damPostDto.id = this.assetId;
    }
    this.damService.save(this.damPostDto).subscribe((result: any) => {
      this.hidePopup();
      this.referenceService.isCreated = true;
      this.referenceService.goToRouter("/home/dam/manage");
      this.modalPopupLoader = false;
    }, error => {
      this.modalPopupLoader = false;
      let statusCode = JSON.parse(error['status']);
      if (statusCode == 409) {
          this.validForm = false;
          this.nameErrorMessage = "Already exists";
      } else {
        this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
      }
    });
  }

  
}

updatePublishedAsset(){
  console.log(this.damPostDto);
}

}
