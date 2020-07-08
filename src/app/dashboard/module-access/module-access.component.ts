import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { ActivatedRoute } from '@angular/router';
import { CustomResponse } from 'app/common/models/custom-response';
import { CampaignAccess } from 'app/campaigns/models/campaign-access';
import { ReferenceService } from 'app/core/services/reference.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';

@Component({
  selector: 'app-module-access',
  templateUrl: './module-access.component.html',
  styleUrls: ['./module-access.component.css'],
  providers:[HttpRequestLoader]
})
export class ModuleAccessComponent implements OnInit {

  companyId: any;
  userAlias:any;
  customResponse: CustomResponse = new CustomResponse();
  campaignAccess = new CampaignAccess();
  moduleAccessList: any = [];
  companyAndUserDetails:any;
  companyLoader = true;
  moduleLoader = true;
  constructor(public authenticationService: AuthenticationService, private dashboardService: DashboardService, public route: ActivatedRoute, public referenceService: ReferenceService) { }

  ngOnInit() {
    this.companyId = this.route.snapshot.params['alias'];
    this.userAlias = this.route.snapshot.params['userAlias'];
    this.getCompanyAndUserDetails();
    this.getModuleAccessByCompanyId();
  }
  getCompanyAndUserDetails() {
    this.dashboardService.getCompanyDetailsAndUserId(this.companyId,this.userAlias).subscribe(result => {
      this.companyLoader = false;
      this.companyAndUserDetails = result;
    }, error => {
      this.companyLoader = false;
      this.customResponse = new CustomResponse('ERROR', 'Something went wrong.', true);
    });

  }

  getModuleAccessByCompanyId() {
    if (this.companyId) {
      this.dashboardService.getAccess(this.companyId).subscribe(result => {
        this.campaignAccess = result;
        this.moduleLoader = false;
      }, error => {
        this.moduleLoader = false;
        this.customResponse = new CustomResponse('ERROR', 'Something went wrong.', true);
      });
    }
  }

  updateModuleAccess() {
    this.campaignAccess.companyId = this.companyId;
    this.dashboardService.changeAccess(this.campaignAccess).subscribe(result => {
      if (result.statusCode === 200) {
        this.customResponse = new CustomResponse('SUCCESS', "Modules updated successfully", true);
        this.getModuleAccessByCompanyId();
        this.referenceService.goToTop();
      }
    }, error => {
      this.customResponse = new CustomResponse('Error', "Something went wrong.", true);
    });
  }
}
