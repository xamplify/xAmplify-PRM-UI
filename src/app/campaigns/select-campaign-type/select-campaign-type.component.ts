import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Roles } from '../../core/models/roles';
import { CampaignService } from '../services/campaign.service';
import { UserService } from 'app/core/services/user.service';
import { CampaignAccess } from '../models/campaign-access';
import { HomeComponent } from 'app/core/home/home.component';

declare var Metronic, Layout , Demo,TableManaged:any;
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
      const countOfTrues = [this.campaignAccess.videoCampaign,this.campaignAccess.emailCampaign, this.campaignAccess.socialCampaign, this.campaignAccess.eventCampaign].filter(Boolean).length;
      if(countOfTrues === 4) { this.changeClass = 'col-xs-12 col-sm-3';
      } else if (countOfTrues === 3) { this.changeClass = 'col-xs-12 col-sm-4';
      } else if (countOfTrues === 2) { this.changeClass = 'col-xs-12 col-sm-6';
      } else if (countOfTrues === 1) { this.changeClass = 'col-xs-12'; }

    }
    getOrgCampaignTypes(){
      this.campaignService.getOrgCampaignTypes( this.refService.companyId).subscribe(
      data=>{
        console.log(data);
        this.campaignAccess.videoCampaign = data.video;
        this.campaignAccess.emailCampaign = data.regular;
        this.campaignAccess.socialCampaign = data.social;
        this.campaignAccess.eventCampaign = data.event
        this.cssClassChange();
      });
    }
    getCompanyId() {
      try {
        this.userService.getVideoDefaultSettings().subscribe(
          (result: any) => {
            if (result !== "") {  this.refService.companyId = result.companyProfile.id;
              this.getOrgCampaignTypes();
            }
          }, (error: any) => { console.log(error); }
        );
      } catch (error) { console.log(error);  } }


    ngOnInit() {
        try{
            if(!this.refService.companyId) { this.getCompanyId(); } else { this.getOrgCampaignTypes();}
            Metronic.init();
            Layout.init();
            Demo.init();
            TableManaged.init();
        }catch(error){
            this.logger.error("error in select-campaign-type ngOnInit()", error);
        }
    }

     createRegularCampaign(){
         this.refService.selectedCampaignType = "regular";
         this.router.navigate(["/home/campaigns/create"]);
     }
     createVideoCampaign(){
         this.refService.selectedCampaignType = "video";
         this.router.navigate(["/home/campaigns/create"]);
     }
     createEventCampaign(){
       if(this.isOrgAdmin || this.hasSocialStatusRole ||this.isOnlyPartner || this.authenticationService.module.isVendor){
        this.refService.selectedCampaignType = "eventCampaign";
        this.router.navigate(["/home/campaigns/event"]); }
     }
     socialMediaCampaign(){
       if(this.isOrgAdmin || this.hasSocialStatusRole ||this.isOnlyPartner || this.authenticationService.module.isVendor){
      //this.refService.selectedCampaignType = "socialCampaign";
       this.router.navigate(["/home/campaigns/social"]); }
     }


}
