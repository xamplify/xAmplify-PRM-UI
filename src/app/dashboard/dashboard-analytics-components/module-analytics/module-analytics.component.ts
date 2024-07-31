import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from "../../dashboard.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import {DashboardAnalyticsDto} from "app/dashboard/models/dashboard-analytics-dto";
import { ReferenceService } from 'app/core/services/reference.service';
import {DashboardModuleAnalyticsViewDto} from "app/dashboard/models/dashboard-module-analytics-view-dto";
import {VanityURLService} from "app/vanity-url/services/vanity.url.service";
import { LeadsService } from 'app/leads/services/leads.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { IntegrationService } from 'app/core/services/integration.service';

@Component({
  selector: 'app-module-analytics',
  templateUrl: './module-analytics.component.html',
  styleUrls: ['./module-analytics.component.css'],
  providers: [LeadsService]
})
export class ModuleAnalyticsComponent implements OnInit {
  dashboardAnalyticsDto:DashboardAnalyticsDto = new DashboardAnalyticsDto();
  dashboardModuleAnalyticsViewDtos: Array<DashboardModuleAnalyticsViewDto> = new Array<DashboardModuleAnalyticsViewDto>();
  loader = true;
  ngxLoading = false;
  showLeadForm: boolean = false;
  actionType: string = "add";
  leadId: number = 0;
  customResponse: CustomResponse = new CustomResponse();
  showDealForm: boolean;
  isRegisterDealEnabled:boolean = true;
  @Output() notifyShowDealForm = new EventEmitter();
  @Output() notifyShowLeadForm = new EventEmitter();
  @Output() notifyLeadSuccess = new EventEmitter();
  @Input() applyFilter:boolean;
  constructor(public router: Router,public xtremandLogger:XtremandLogger,public dashboardService: DashboardService,
    public authenticationService: AuthenticationService,public referenceService:ReferenceService,private route: ActivatedRoute,private vanityUrlService:VanityURLService,
    public integrationService:IntegrationService) { 

    }

  ngOnInit() {
    this.dashboardAnalyticsDto = this.vanityUrlService.addVanityUrlFilterDTO(this.dashboardAnalyticsDto);
    this.dashboardAnalyticsDto.applyFilter = this.applyFilter;
    this.getModulesAnaltyics();
  }

  getModulesAnaltyics(){
    this.dashboardService.getModuleAnalytics(this.dashboardAnalyticsDto)
    .subscribe(
      response => {
        this.dashboardModuleAnalyticsViewDtos = response.data;
        this.loader = false;
      },
      error => this.xtremandLogger.log(error),
      () => {
        if (this.authenticationService.module.showAddLeadsAndDealsOptionInTheDashboard && this.authenticationService.vanityURLEnabled) {
          this.getVendorRegisterDealValue();
        }
       }
  );
  }

  goToManage(dto:DashboardModuleAnalyticsViewDto){
    if(dto.hasAccess){
      this.ngxLoading = true;
      let moduleId = dto.moduleId;
      if(moduleId==1){
        this.router.navigate(["/home/campaigns/manage"]);
      }else if(moduleId==2){
        this.router.navigate(["/home/partners/analytics"]);
      }else if(moduleId==3){
        this.router.navigate(["/home/content/videos"]);
      }else if(moduleId==4){
        this.router.navigate(["/home/dashboard/vendors"]);
      }else if(moduleId==5){
        this.router.navigate(["/home/contacts/manage"]);
      }else if(moduleId==6){
        this.router.navigate(["/home/social/manage/all"]);
      }else if(moduleId==7){
        this.router.navigate(["/home/emailtemplates"]);
      }else if(moduleId==8){
        this.router.navigate(["/home/team/add-team"]);
      }else if(moduleId==9){
        this.router.navigate(["/home/partners/manage"]);
      }else if(moduleId==10){
        this.router.navigate(["/home/forms/manage"]);
      }
    }
    }

   
     resetValues(){
       this.showLeadForm = false;
     }

     showSubmitLeadSuccess() { 
      if (this.actionType == 'edit') {
        this.customResponse = new CustomResponse('SUCCESS', "Lead Updated Successfully", true);
      } else {
        this.customResponse = new CustomResponse('SUCCESS', "Lead Submitted Successfully", true);
      }
      this.notifyLeadSuccess.emit();
      this.showLeadForm = false;
    }

    addDeal() {   
      //this.showDealForm = true;
      //this.actionType = "add";
      this.notifyShowDealForm.emit();
    }

    addLead() {      
      this.notifyShowLeadForm.emit();    
    }

  getVendorRegisterDealValue() {
    this.ngxLoading = true;
    this.integrationService.getVendorRegisterDealValue(this.authenticationService.getUserId(), this.authenticationService.companyProfileName).subscribe(
      data => {
        if (data.statusCode == 200) {
          this.isRegisterDealEnabled = data.data
        }
        this.ngxLoading = false;
      }, error => {
        this.ngxLoading = false;
      }
    )
  }

}
