import { Component, OnInit } from '@angular/core';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from '../dashboard.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { SortOption } from 'app/core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';
import { SearchableDropdownDto } from 'app/core/models/searchable-dropdown-dto';
import { CustomAnimation } from 'app/core/models/custom-animation';


declare var $:any;
@Component({
  selector: 'app-integration-details',
  templateUrl: './integration-details.component.html',
  styleUrls: ['./integration-details.component.css'],
  providers :[Properties,SortOption],
  animations :[CustomAnimation]
})
export class IntegrationDetailsComponent implements OnInit {
  
  integrationsPagination = new Pagination();
  integrationsLoader = true;
  customResponse:CustomResponse = new CustomResponse();
  sortOption:SortOption = new SortOption();
  updateLoader = false;
  companiesSearchableDropDownDto: SearchableDropdownDto = new SearchableDropdownDto();
  selectedCompanyId = 0;
	dropdownDataLoading = true;
  isDropDownLoadingError = false;  
  isAccessOrRefreshTokenEdited = false;
  selectedIntegratedDetails:any;

  constructor(public authenticationService:AuthenticationService, public referenceService:ReferenceService,public pagerService:PagerService,
    public dashboardService:DashboardService,public properties:Properties,public utilService:UtilService) { }

  ngOnInit() {
  }

  openModalPopup() {
    this.integrationsPagination = new Pagination();
    this.customResponse = new CustomResponse();
    this.companiesSearchableDropDownDto = new SearchableDropdownDto();
    this.selectedCompanyId = 0;
    this.isAccessOrRefreshTokenEdited = false;
    this.referenceService.openModalPopup("integration-details-modal");
    this.findAllIntegrations(this.integrationsPagination);
    this.findAllCompanyNames();
}

closeModal(){
  this.referenceService.closeModalPopup("integration-details-modal")
}

findAllCompanyNames() {
  this.isDropDownLoadingError = false;
  this.dropdownDataLoading = true;
  this.dashboardService.findAllIntegrationCompanyNames().subscribe(
    response => {
      this.setSearchableDropdownData(response);
    }, error => {
      this.dropdownDataLoading = false;
      this.isDropDownLoadingError = true;
    });
}
  setSearchableDropdownData(response: any) {
    this.companiesSearchableDropDownDto.data = response.data;
		this.companiesSearchableDropDownDto.placeHolder = "Please Select Company";
		this.dropdownDataLoading = false;
    this.isDropDownLoadingError = false;
  }

  findAllIntegrations(pagination:Pagination){
    this.referenceService.scrollToModalBodyTopByClass();
    this.integrationsLoader = true;
    this.customResponse = new CustomResponse();
    this.dashboardService.findAllIntegrations(pagination).subscribe(
        response=>{
          const data = response.data;
          pagination.totalRecords = data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, data.list);
          this.integrationsLoader = false;
        },error=>{
          this.integrationsLoader = false;
          this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
        });
  }

  navigateIntegrationsByPageNumber(event:any){
    this.integrationsPagination.pageIndex = event.page;
    this.findAllIntegrations(this.integrationsPagination);
  }

  viewMoreColumns(integrationDetails:any){
    this.integrationsPagination.pagedItems.forEach((element) => {
      let id = element.id;
      let clickedId = integrationDetails.id;
      if(clickedId!=id){
          element.expand =false;
      }
  });
    integrationDetails.expand = !integrationDetails.expand;
  }

  copyInputMessage(inputElement, type: string, index: number) {
    $(".copied-text-success-message").hide();
    $('#copied-access-token-message-' + index).hide();
    $('#copied-refresh-token-message-' + index).hide();
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    if (type === "Access Token") {
        $('#copied-access-token-message-' + index).show(500);
        $('#copy-access-token-span-' + index).css({ 'margin-bottom': '32px' });
    } else {
      $('#copied-refresh-token-message-' + index).show(500);
      $('#copy-refresh-token-span-' + index).css({ 'margin-bottom': '32px' });
    }
}

/*************************Sort********************** */
sortBy(text: any) {
  this.sortOption.selectedIntegrationDetailsDropDownOption = text;
  this.getAllFilteredResults();
}

searchIntegrationDetailsOnKeyPress(keyCode:number){
  if(keyCode==13){
    this.searchIntegrationDetails();
  }
}


/*************************Search********************** */
searchIntegrationDetails() {
  this.getAllFilteredResults();
}

getAllFilteredResults() {
  this.integrationsPagination.pageIndex = 1;
  this.integrationsPagination.searchKey = this.sortOption.searchKey;
  this.integrationsPagination = this.utilService.sortOptionValues(this.sortOption.selectedIntegrationDetailsDropDownOption, this.integrationsPagination);
  this.findAllIntegrations(this.integrationsPagination);
}

searchableDropdownEventReceiver(event:any){
  if(event!=null){
    let id = event['id'];
    this.integrationsPagination.companyId = id;
  }else{
    this.integrationsPagination = new Pagination();
  }
  this.getAllFilteredResults();
}

editAccessOrRefreshToken(integrationDetails:any){
  this.selectedIntegratedDetails = integrationDetails;
  this.isAccessOrRefreshTokenEdited = true;
}

updateDetails(){
  this.updateLoader = true;
  console.log(this.selectedIntegratedDetails);
  this.dashboardService.updateAccessTokenAndRefreshToken(this.selectedIntegratedDetails).subscribe(
      response=>{
        this.referenceService.showSweetAlertSuccessMessage("Details Updated Successfully");
        this.findAllIntegrations(this.integrationsPagination);
        this.updateLoader = false;
      },error=>{
        this.updateLoader = false;
        this.referenceService.showSweetAlertServerErrorMessage();
      });
}

}
