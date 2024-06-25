import { XtremandLogger } from './../../error-pages/xtremand-logger.service';
import { Component, OnInit } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { SearchableDropdownDto } from 'app/core/models/searchable-dropdown-dto';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from '../dashboard.service';
import { CustomAnimation } from 'app/core/models/custom-animation';


@Component({
  selector: 'app-update-email-address',
  templateUrl: './update-email-address.component.html',
  styleUrls: ['./update-email-address.component.css'],
  animations :[CustomAnimation]
})
export class UpdateEmailAddressComponent implements OnInit {

  updateEmailAddressLoader = false;
  updateEmailAddressResponse:CustomResponse = new CustomResponse();
  updateEmailAddressStatusCode = 0;
  updatedEmailAddress = "";
  isSearchableDropdownHidden = false;
  dropdownDataLoading = true;
  emailAddressesSearchableDropDownDto:SearchableDropdownDto = new SearchableDropdownDto();
  selectedEmailAddress = "";
  isValidExistingEmailAddress = true;
  existingEmailAddressErrorMessage = "";
  isValidUpdatedEmailAddress = true;
  existingEmailAddress = "";
  isUpdateButtonDisabled = true;
  isUpdatedEmailAddressDisplayed = false;
  isFooterDisplayed = false;
  constructor(public referenceService:ReferenceService,public dashboardService:DashboardService) { }

  ngOnInit() {
  }

  updateEmailAddress(){

  }

  closeUpdateEmailAddressAccountModal(){
    this.referenceService.closeModalPopup("update-email-address-modal");
    this.existingEmailAddress = "";
    this.updatedEmailAddress = "";
  }

  openModalPopup(){
    this.referenceService.openModalPopup("update-email-address-modal");
  }

  validateExistingEmailAddress(){
    
  }


  
}
