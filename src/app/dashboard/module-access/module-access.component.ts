import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { ActivatedRoute } from '@angular/router';
import { CustomResponse } from 'app/common/models/custom-response';
import { CampaignAccess } from 'app/campaigns/models/campaign-access';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-module-access',
  templateUrl: './module-access.component.html',
  styleUrls: ['./module-access.component.css']
})
export class ModuleAccessComponent implements OnInit {

  companyId: any;
  customResponse: CustomResponse = new CustomResponse();
  campaignAccess = new CampaignAccess();
  moduleAccessList: any = [];
  constructor(public authenticationService: AuthenticationService, private dashboardService: DashboardService, public route: ActivatedRoute, private referenceService: ReferenceService) { }

  ngOnInit() {
    this.companyId = this.route.snapshot.params['alias'];
    this.getModuleAccessByCompanyId();
  }

  getModuleAccessByCompanyId() {
    if (this.companyId) {
      this.dashboardService.getAccess(this.companyId).subscribe(result => {
        this.campaignAccess = result;
      }, error => {
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
