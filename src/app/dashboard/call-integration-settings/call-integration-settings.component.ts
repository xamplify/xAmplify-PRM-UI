import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { CallIntegrationService } from 'app/core/services/call-integration.service';
import { ReferenceService } from 'app/core/services/reference.service';

declare var swal: any, $: any;

@Component({
  selector: 'app-call-integration-settings',
  templateUrl: './call-integration-settings.component.html',
  styleUrls: ['./call-integration-settings.component.css']
})
export class CallIntegrationSettingsComponent implements OnInit {

  @Input() integrationType: string;
  @Output() closeEvent = new EventEmitter<any>();
  @Output() unlinkEvent = new EventEmitter<any>();
  @Output() refreshEvent = new EventEmitter<any>();

  customResponse: CustomResponse = new CustomResponse();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();

  ngxloading: boolean;
  activeCallDetails: any;
  callIntegrationDetails: any;

  constructor(public referenceService: ReferenceService, public authenticationService: AuthenticationService, public callIntegrationService: CallIntegrationService, public properties: Properties) { }

  ngOnInit() {
    this.getIntegrationDetails();
  }

  getIntegrationDetails() {
    this.ngxloading = true;
    let self = this;
    self.callIntegrationService.getIntegrationDetails(this.integrationType.toLowerCase())
      .subscribe(
        data => {
          this.ngxloading = false;
          if (data.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
            this.callIntegrationDetails = data.data;
          }
        },
        error => {
          this.ngxloading = false;
        }
      );
  }

  activateCallIntegration() {
    try {
      let self = this;
      swal({
        title: 'Are you sure?',
        text: "Click Yes to mark this as your active Call Integration",
        type: 'warning',
        showCancelButton: true,
        swalConfirmButtonColor: '#54a7e9',
        swalCancelButtonColor: '#999',
        confirmButtonText: 'Yes, activate!'

      }).then(function () {
        let request: any = {};
        request.type = self.integrationType;
        self.setActiveCall(request);
      }, function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
    } catch (error) {
      this.referenceService.showServerError(this.httpRequestLoader);
    }
  }

  setActiveCall(request: any) {
    this.ngxloading = true;
    this.callIntegrationService.setActiveCall(request)
      .subscribe(
        data => {
          this.ngxloading = false;
          if (data.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
            this.getIntegrationDetails();
            this.refreshEvent.emit();
          }
        });
  }

  unlinkCallIntegration() {
    try {
      let self = this;
      swal({
        title: 'Are you sure?',
        text: "Unlinking call, click Yes to continue.",
        type: 'warning',
        showCancelButton: true,
        swalConfirmButtonColor: '#54a7e9',
        swalCancelButtonColor: '#999',
        confirmButtonText: 'Yes, delete!'

      }).then(function () {
        self.ngxloading = true;
        self.callIntegrationService.unlinkCall(self.integrationType.toLowerCase())
          .subscribe(
            data => {
              if (data.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
                self.unlinkEvent.emit(data.message);
              }
              self.ngxloading = false;
            }, error => {
              self.ngxloading = false;
            });
      }, function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
    } catch (error) {
      this.referenceService.showServerError(this.httpRequestLoader);
    }
  }

  closeSettings() {
    this.closeEvent.emit();
  }

}
