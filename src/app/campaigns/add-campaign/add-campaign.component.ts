import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { CampaignService } from '../services/campaign.service';
import { Campaign } from '../models/campaign';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { CallActionSwitch } from 'app/videos/models/call-action-switch';
import { ActivatedRoute } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-add-campaign',
  templateUrl: './add-campaign.component.html',
  styleUrls: ['./add-campaign.component.css'],
  providers:[CallActionSwitch]
})
export class AddCampaignComponent implements OnInit {

  loggedInUserId = 0;
  campaign: Campaign = new Campaign();
  loading = false;


  defaultTabClass = "col-block";
  activeTabClass = "col-block col-block-active width";
  completedTabClass = "col-block col-block-complete";
  disableTabClass = "col-block col-block-disable";
  campaignDetailsTabClass = this.activeTabClass;


  /************Campaign Details******************/
  formGroupClass = "form-group";
  campaignNameDivClass:string = this.formGroupClass;
  fromNameDivClass:string =  this.formGroupClass;
  subjectLineDivClass:string = this.formGroupClass;
  fromEmaiDivClass:string = this.formGroupClass;
  preHeaderDivClass:string = this.formGroupClass;
  messageDivClass:string = this.formGroupClass;
  campaignType = "";
  isCampaignDetailsFormValid = true;
  names:string[]=[];
  editedCampaignName = "";
  isValidCampaignName = false;
  categoryNames: any;
  campaignNamesLoader = false;
  categoryNamesLoader = false;
  partnerModuleCustomName = "Partner";
  toPartnerToolTipMessage = "";
  throughPartnerToolTipMessage = "";
  throughPartnerAndToPartnerHelpToolTip: string;
  shareWhiteLabeledContent = false;

  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService,
    public campaignService:CampaignService,public xtremandLogger:XtremandLogger,public callActionSwitch:CallActionSwitch,
    private activatedRoute:ActivatedRoute) {
    this.loggedInUserId = this.authenticationService.getUserId();
   }

  ngOnInit() {
    this.loadCampaignDetailsSection();
  }

  loadCampaignDetailsSection(){
    this.findCampaignNames(this.loggedInUserId);
    this.findCategories();
    let partnerModuleCustomName = localStorage.getItem("partnerModuleCustomName");
    if(partnerModuleCustomName!=null && partnerModuleCustomName!=undefined){
      this.partnerModuleCustomName = partnerModuleCustomName;
    }
    this.campaignType = this.activatedRoute.snapshot.params['campaignType'];
    if ('landingPage' == this.campaignType) {
      this.toPartnerToolTipMessage = "To "+this.partnerModuleCustomName+": Share a private page";
      this.throughPartnerToolTipMessage = "Through "+this.partnerModuleCustomName+": Share a public page";
  } else {
      this.toPartnerToolTipMessage = "To "+this.partnerModuleCustomName+": Send a campaign intended just for your "+this.partnerModuleCustomName;
      this.throughPartnerToolTipMessage = "Through "+this.partnerModuleCustomName+": Send a campaign that your "+this.partnerModuleCustomName+" can redistribute";
  }
    this.throughPartnerAndToPartnerHelpToolTip = this.throughPartnerToolTipMessage +"<br><br>"+this.toPartnerToolTipMessage;
  }


  /****************Campaign Details***********/
  validateCampaignName(campaignName:string){
    let lowerCaseCampaignName = $.trim(campaignName.toLowerCase());//Remove all spaces
    var list = this.names[0];
    if($.inArray(lowerCaseCampaignName, list) > -1 && this.editedCampaignName.toLowerCase()!=lowerCaseCampaignName){
        this.isValidCampaignName = false;
    }else{
        this.isValidCampaignName = true;
    }
  }

  validateForm() {
    var isValid = true;
    var campaignNameLength= $.trim(this.campaign.campaignName).length;
    var fromNameLength = $.trim(this.campaign.fromName).length;
    var subjectLineLength = $.trim(this.campaign.subjectLine).length;
    var preHeaderLength  =  $.trim(this.campaign.preHeader).length;
    if(campaignNameLength>0 &&  fromNameLength>0 && subjectLineLength>0 && preHeaderLength>0){
        isValid = true;
    }else{
        isValid = false;
    }
   if(isValid && this.isValidCampaignName){
       this.isCampaignDetailsFormValid = true;
   }else{
       this.isCampaignDetailsFormValid = false;
   }
 }

  validateField(fieldId:string){
    var errorClass = "form-group has-error has-feedback";
    var successClass = "form-group has-success has-feedback";
    let fieldValue = $.trim($('#'+fieldId).val())
    if(fieldId=="campaignName"){
        if(fieldValue.length>0&&this.isValidCampaignName){
            this.campaignNameDivClass = successClass;
        }else{
            this.campaignNameDivClass = errorClass;
        }

    }else if(fieldId=="fromName"){
        if(fieldValue.length>0){
            this.fromNameDivClass = successClass;
        }else{
            this.fromNameDivClass = errorClass;
        }
    }else if(fieldId=="subjectLine"){
        if(this.campaign.subjectLine.length>0){
            this.subjectLineDivClass = successClass;
        }else{
            this.subjectLineDivClass = errorClass;
        }
    }else if(fieldId=="preHeader"){
        if(fieldValue.length>0){
            this.preHeaderDivClass = successClass;
        }else{
            this.preHeaderDivClass = errorClass;
        }
    }else if(fieldId=="message"){
        if(fieldValue.length>0){
            this.messageDivClass = successClass;
        }else{
            this.messageDivClass = errorClass;
        }
    }
}


/*********Find Campaign Names*******/
findCampaignNames(userId:number){
  this.campaignNamesLoader = true;
   this.campaignService.getCampaignNames(userId)
   .subscribe(
   data => {
       this.names.push(data);
       this.campaignNamesLoader = false;
   },
   error =>{
    
   });
}

/**********Find Categories*****/
findCategories(){
  this.categoryNamesLoader = true;
  this.authenticationService.getCategoryNamesByUserId(this.loggedInUserId).subscribe(
      ( data: any ) => {
          this.categoryNames = data.data;
          let categoryIds = this.categoryNames.map(function (a:any) { return a.id; });
          if(this.campaign.categoryId==0 || this.campaign.categoryId==undefined || categoryIds.indexOf(this.campaign.categoryId)<0){
              this.campaign.categoryId = categoryIds[0];
          }
          this.categoryNamesLoader = false;
      },
      error => {
         this.xtremandLogger.error( "error in getCategoryNamesByUserId(" + this.loggedInUserId + ")", error );
      });
}

setChannelCampaign(event){
  this.campaign.channelCampaign = event;
}

}
