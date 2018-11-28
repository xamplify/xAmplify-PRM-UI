import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Roles } from '../../core/models/roles';
declare var Metronic, Layout , Demo,TableManaged:any;
@Component({
    selector: 'app-select-campaign',
    templateUrl: './select-campaign-type-component.html',
    styleUrls: ['../../../assets/css/pricing-table.css']
  })

export class SelectCampaignTypeComponent implements OnInit{

    emailTypes = ['Video Campaign','Regular Campaign'];
    roleName:Roles=new Roles();
    hasSocialStatusRole = false;
    isOrgAdmin = false;
    isSocialCampaignAccess = true;
    isOnlyPartner = false;
    constructor(private logger:XtremandLogger,private router:Router,public refService:ReferenceService,public authenticationService:AuthenticationService){
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

    ngOnInit() {
        try{
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
