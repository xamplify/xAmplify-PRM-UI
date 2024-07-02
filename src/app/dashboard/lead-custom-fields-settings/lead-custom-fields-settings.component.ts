import { Component, OnInit } from '@angular/core';
import { LeadsService } from 'app/leads/services/leads.service';
import { LeadCustomFieldDto } from 'app/leads/models/lead-custom-field';
import { CustomResponse } from 'app/common/models/custom-response';
import { ReferenceService } from 'app/core/services/reference.service';
declare var $: any;

@Component({
  selector: 'app-lead-custom-fields-settings',
  templateUrl: './lead-custom-fields-settings.component.html',
  styleUrls: ['./lead-custom-fields-settings.component.css'],
  providers: [LeadsService]
})
export class LeadCustomFieldsSettingsComponent implements OnInit {

  constructor(private leadService: LeadsService, public referenceService: ReferenceService) { }
  ngxloading: boolean;
  customFieldsDtosLoader = false;
  leadCustomFields = new Array<LeadCustomFieldDto>();
  customResponse: CustomResponse = new CustomResponse();
  isValid: boolean = false;

  ngOnInit() {
    this.getLeadFields();
  }

  getLeadFields() {
    this.ngxloading = true;
    this.customFieldsDtosLoader = true;
    this.leadService.getLeadCustomFields().subscribe(data => {
      if (data.statusCode == 200) {
        this.ngxloading = false;
        this.customFieldsDtosLoader = false;
        this.leadCustomFields = data.data;
      }
    },
      error => {
        this.ngxloading = false;
        this.customFieldsDtosLoader = false;
      }
    );
  }

  validateAndSubmit() {
    this.isValid = true;
    let errorMessage = "";
    this.leadCustomFields.forEach(field => {
      if ($.trim(field.displayName).length <= 0) {
        this.isValid = false;
         errorMessage = "Please enter the display name";
      }
    });

    if (this.isValid) {
      this.saveLeadCustomFields();
    } else {
      this.customResponse = new CustomResponse('ERROR', errorMessage, true);
      this.referenceService.goToTop();
    }
  }

  saveLeadCustomFields() {
    this.ngxloading = true;
    this.customFieldsDtosLoader = true;
    this.leadService.saveCustomLeadFields(this.leadCustomFields).subscribe(data => {
      if (data.statusCode == 200) {
        this.customResponse = new CustomResponse('SUCCESS', "Submitted Successfully", true);
        this.ngxloading = false;
        this.customFieldsDtosLoader = false;
        this.referenceService.goToTop();
        this.getLeadFields();
      }
    },
      error => {
        this.ngxloading = false;
        this.customFieldsDtosLoader = false;
        let errorMessage = this.referenceService.getApiErrorMessage(error);
        this.customResponse = new CustomResponse('ERROR', errorMessage, true);
      }
    );
  }

}

