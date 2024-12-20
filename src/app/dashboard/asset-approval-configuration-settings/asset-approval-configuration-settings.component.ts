import { Component, OnInit } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DamService } from 'app/dam/services/dam.service';
import { CallActionSwitch } from 'app/videos/models/call-action-switch';

@Component({
  selector: 'app-asset-approval-configuration-settings',
  templateUrl: './asset-approval-configuration-settings.component.html',
  styleUrls: ['./asset-approval-configuration-settings.component.css'],
  providers: [HttpRequestLoader, CallActionSwitch, Properties, DamService]
})
export class AssetApprovalConfigurationSettingsComponent implements OnInit {

  assetApprovalCustomResponse: CustomResponse = new CustomResponse();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  isChecked: boolean = false;
  isAssetApprovalEnabledForCompany: boolean = false;
  disableSaveChangesButton: boolean = false;
  companyId: number;
  ngxLoading: boolean = false;

  constructor(private referenceService: ReferenceService,
    private damService: DamService,
    private callActionSwitch: CallActionSwitch,
    private properties: Properties,
    private authenticationService: AuthenticationService
  ) {
    this.companyId = this.referenceService.companyId;
  }

  ngOnInit() {
    this.callActionSwitch.size = 'normal';
    this.getAssetApprovalStatusByCompanyId();
  }

  getAssetApprovalStatusByCompanyId() {
    this.ngxLoading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.damService.getAssetApprovalStatusByCompanyId(this.companyId)
      .subscribe(
        result => {
          this.ngxLoading = false;
          this.referenceService.loading(this.httpRequestLoader, false);
          this.isAssetApprovalEnabledForCompany = result.data;
          this.isChecked = !this.isAssetApprovalEnabledForCompany;
          this.disableSaveChangesButton = false;
        }, error => {
          this.ngxLoading = false;
          this.isAssetApprovalEnabledForCompany = false;
          this.referenceService.loading(this.httpRequestLoader, false);
        });
  }

  onToggleChange(event: any) {
    this.isAssetApprovalEnabledForCompany = event;
    if (event) {
      this.disableSaveChangesButton = false;
    } else {
      this.isChecked = false;
      this.disableSaveChangesButton = true;
    }
  }

  updateCheckBox(event: any): void {
    this.disableSaveChangesButton = !event.target.checked;
  }

  save() {
    const saveAssetApprovalStatus = {
      companyId: this.companyId,
      loggedInUserId: this.authenticationService.getUserId(),
      approvalRequiredForAssetsByCompany: this.isAssetApprovalEnabledForCompany
    };
    this.ngxLoading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.damService.updateAssetApprovalStatus(saveAssetApprovalStatus)
      .subscribe(
        result => {
          this.ngxLoading = false;
          this.referenceService.loading(this.httpRequestLoader, false);
          if (result.statusCode == 200) {
            this.assetApprovalCustomResponse = new CustomResponse('SUCCESS', "Settings Updated Successfully", true);
          } else {
            this.assetApprovalCustomResponse = new CustomResponse('ERROR', this.properties.SOMTHING_WENT_WRONG, true);
          }
        }, error => {
          this.ngxLoading = false;
          this.referenceService.loading(this.httpRequestLoader, false);
          this.assetApprovalCustomResponse = new CustomResponse('ERROR', this.properties.SOMTHING_WENT_WRONG, true);
        }
      );
  }

}
