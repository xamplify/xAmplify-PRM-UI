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
  assetApprovalEnabledForCompany: boolean = false;
  tracksApprovalEnabledForCompany: boolean = false;
  playbooksApprovalEnabledForCompany: boolean = false;
  disableSaveChangesButton: boolean = false;
  ngxLoading: boolean = false;
  loggedInUserId: number;
  approvalStatusSettingsDto: any;

  isAssetCheckBoxEnabled: boolean = false;
  isTracksCheckBoxEnabled: boolean = false;
  isPlaybooksCheckBoxEnabled: boolean = false;

  isValidAssetSettings: boolean = false;
  isValidPlaybooksSettings: boolean = false;
  isValidTracksSettings: boolean = false;


  constructor(private referenceService: ReferenceService,
    private damService: DamService,
    private callActionSwitch: CallActionSwitch,
    private properties: Properties,
    private authenticationService: AuthenticationService
  ) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.callActionSwitch.size = 'normal';
    this.getApprovalConfigurationSettings();
  }

  getApprovalConfigurationSettings() {
    this.ngxLoading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.damService.getApprovalConfigurationSettingsByUserId(this.loggedInUserId)
      .subscribe(
        result => {
          if (result.data && result.statusCode == 200) {
            this.approvalStatusSettingsDto = result.data;
            this.assetApprovalEnabledForCompany = this.approvalStatusSettingsDto.approvalRequiredForAssets;
            this.tracksApprovalEnabledForCompany = this.approvalStatusSettingsDto.approvalRequiredForTracks;
            this.playbooksApprovalEnabledForCompany = this.approvalStatusSettingsDto.approvalRequiredForPlaybooks;
          }
          this.ngxLoading = false;
          this.referenceService.loading(this.httpRequestLoader, false);
          this.isAssetCheckBoxEnabled = !this.assetApprovalEnabledForCompany;
          this.isTracksCheckBoxEnabled = !this.tracksApprovalEnabledForCompany;
          this.isPlaybooksCheckBoxEnabled = !this.playbooksApprovalEnabledForCompany;
        }, error => {
          this.ngxLoading = false;
          this.referenceService.loading(this.httpRequestLoader, false);
        },() => {
          this.validteSaveButton();
        });
  }

  onToggleChange(event: any, moduleType: string): void {
    if (moduleType.toUpperCase() === 'DAM') {
      this.assetApprovalEnabledForCompany = event;
      this.isAssetCheckBoxEnabled = false;
    } else if (moduleType.toUpperCase() === 'TRACKS') {
      this.tracksApprovalEnabledForCompany = event;
      this.isTracksCheckBoxEnabled = false;
    } else if (moduleType.toUpperCase() === 'PLAYBOOKS') {
      this.playbooksApprovalEnabledForCompany = event;
      this.isPlaybooksCheckBoxEnabled = false;
    }
    this.validteSaveButton();
  }  


  validteSaveButton(): void {
    this.isValidAssetSettings = this.assetApprovalEnabledForCompany || (!this.assetApprovalEnabledForCompany && this.isAssetCheckBoxEnabled);
    this.isValidTracksSettings = this.tracksApprovalEnabledForCompany || (!this.tracksApprovalEnabledForCompany && this.isTracksCheckBoxEnabled);
    this.isValidPlaybooksSettings = this.playbooksApprovalEnabledForCompany || (!this.playbooksApprovalEnabledForCompany && this.isPlaybooksCheckBoxEnabled);

    this.disableSaveChangesButton = !(this.isValidAssetSettings && this.isValidTracksSettings && this.isValidPlaybooksSettings);
  }

  updateCheckBox(event: any, moduleType: string): void {
    const isChecked = event.target.checked;
    if (moduleType.toUpperCase() === 'DAM') {
      this.isAssetCheckBoxEnabled = isChecked;
      this.isValidAssetSettings = !isChecked;
    } else if (moduleType.toUpperCase() === 'TRACKS') {
      this.isTracksCheckBoxEnabled = isChecked;
      this.isValidTracksSettings = !isChecked;
    } else if (moduleType.toUpperCase() === 'PLAYBOOKS') {
      this.isPlaybooksCheckBoxEnabled = isChecked;
      this.isValidPlaybooksSettings = !isChecked;
    }
    this.validteSaveButton();
  }
  
  
  save() {
    const saveAssetApprovalStatus = {
      loggedInUserId: this.loggedInUserId,
      assetApprovalEnabledForCompany: this.assetApprovalEnabledForCompany,
      tracksApprovalEnabledForCompany: this.tracksApprovalEnabledForCompany,
      playbooksApprovalEnabledForCompany: this.playbooksApprovalEnabledForCompany
    };
    this.ngxLoading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.damService.updateApprovalConfigurationSettings(saveAssetApprovalStatus)
      .subscribe(
        result => {
          this.ngxLoading = false;
          this.referenceService.loading(this.httpRequestLoader, false);
          if (result.statusCode == 200) {
            this.assetApprovalCustomResponse = new CustomResponse('SUCCESS', "Settings Updated Successfully", true);
          } else {
            this.assetApprovalCustomResponse = new CustomResponse('ERROR', this.properties.SOMTHING_WENT_WRONG, true);
          }
          this.referenceService.scrollSmoothToTop();
        }, error => {
          this.ngxLoading = false;
          this.referenceService.loading(this.httpRequestLoader, false);
          this.assetApprovalCustomResponse = new CustomResponse('ERROR', this.properties.SOMTHING_WENT_WRONG, true);
        }
      );
  }

}
