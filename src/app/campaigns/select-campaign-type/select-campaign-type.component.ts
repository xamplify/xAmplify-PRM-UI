import { Component, OnInit,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Roles } from '../../core/models/roles';
import { CampaignService } from '../services/campaign.service';
import { UserService } from 'app/core/services/user.service';
import { CampaignAccess } from '../models/campaign-access';
import { HomeComponent } from 'app/core/home/home.component';
import {AddFolderModalPopupComponent} from 'app/util/add-folder-modal-popup/add-folder-modal-popup.component';
import { CustomResponse } from 'app/common/models/custom-response';

declare var Metronic, Layout , Demo,TableManaged,swal:any;
@Component({
    selector: 'app-select-campaign',
    templateUrl: './select-campaign-type-component.html',
    styleUrls: ['../../../assets/css/pricing-table.css'],
    providers: [HomeComponent,CampaignAccess]
  })

export class SelectCampaignTypeComponent implements OnInit{

    emailTypes = ['Video Campaign','Regular Campaign'];
    roleName:Roles=new Roles();
    hasSocialStatusRole = false;
    isOrgAdmin = false;
    isSocialCampaignAccess = true;
    isOnlyPartner = false;
    changeClass = 'col-xs-12';
    videoCampaign = false;
    emailCampaign = false;
    socialCampaign = false;
    eventCampaign = false;
    customResponse:CustomResponse = new CustomResponse();
    @ViewChild('addFolderModalPopupComponent') addFolderModalPopupComponent: AddFolderModalPopupComponent;
    constructor(private logger:XtremandLogger,private router:Router,public refService:ReferenceService,public authenticationService:AuthenticationService,
      public campaignService: CampaignService, public userService:UserService, public campaignAccess: CampaignAccess,
      public homeComponent:HomeComponent){
        this.logger.info("select-campaign-type constructor loaded");
        let roles = this.authenticationService.getRoles();
        if(roles.indexOf(this.roleName.socialShare)>-1|| roles.indexOf(this.roleName.allRole)>-1){
            this.hasSocialStatusRole = true;
        }
        if(roles.indexOf(this.roleName.orgAdminRole)>-1){
            this.isOrgAdmin = true;
        }
        this.isOnlyPartner = this.authenticationService.isOnlyPartner();
    }
   cssClassChange(){
      const countOfTrues = [this.campaignAccess.videoCampaign,this.campaignAccess.emailCampaign, this.campaignAccess.socialCampaign, this.campaignAccess.eventCampaign
      ,this.campaignAccess.smsCampaign].filter(Boolean).length;
      if(countOfTrues>=4) { this.changeClass = 'col-xs-12 col-sm-3';
      }else if(countOfTrues === 4) { this.changeClass = 'col-xs-12 col-sm-3';
      } else if (countOfTrues === 3) { this.changeClass = 'col-xs-12 col-sm-4';
      } else if (countOfTrues === 2) { this.changeClass = 'col-xs-12 col-sm-6';
      } else if (countOfTrues === 1) { this.changeClass = 'col-xs-12'; }

    }
    getOrgCampaignTypes(){
      this.campaignService.getOrgCampaignTypes( this.refService.companyId).subscribe(
      data=>{
        this.campaignAccess.videoCampaign = data.video;
        this.campaignAccess.emailCampaign = data.regular;
        this.campaignAccess.socialCampaign = data.social;
        this.campaignAccess.eventCampaign = data.event
        this.campaignAccess.smsCampaign = data.sms;
        this.campaignAccess.landingPageCampaign = data.landingPageCampaign;
        this.refService.smsCampaign = data.sms;
        this.cssClassChange();
      });
    }
    getCompanyIdByUserId(){
      try {
        this.refService.getCompanyIdByUserId(this.authenticationService.user.id).subscribe(
          (result: any) => {
            if (result !== "") {
              console.log(result);
              this.refService.companyId = result;
              this.getOrgCampaignTypes();
            }
          }, (error: any) => { console.log(error); }
        );
      } catch (error) { console.log(error);  }
     }
    ngOnInit() {
        try{
            Metronic.init();
            Layout.init();
            Demo.init();
            TableManaged.init();
 		this.getCompanyIdByUserId(); 
        }catch(error){
            this.logger.error("error in select-campaign-type ngOnInit()", error);
        }
    }

    goToCreateCampaignSection(type:string){
      this.campaignService.hasCampaignCreateAccess()
            .subscribe(
                (data: any) => {
                   if(data.access){
                    this.refService.selectedCampaignType = type;
                      if(type=="regular" || type=="video" || type=="landingPage"){
                        this.router.navigate(["/home/campaigns/create"]);
                      }else if(type=="eventCampaign"){
                        this.router.navigate(["/home/campaigns/event"]); 
                      }else if(type=="social"){
                        this.router.navigate(["/home/campaigns/social"]); 
                      }
                   }else{
                    this.authenticationService.forceToLogout();
                   }
                },
                (error: string) => {
                    this.authenticationService.forceToLogout();
                }
            );
    }

     

     openCreateFolderPopup(){
      this.customResponse = new CustomResponse();
      this.addFolderModalPopupComponent.openPopup();
  }

  showSuccessMessage(message:any){
    this.customResponse = new CustomResponse('SUCCESS',message, true);
  }


}
