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

declare var $:any;
@Component({
  selector: 'app-integration-details',
  templateUrl: './integration-details.component.html',
  styleUrls: ['./integration-details.component.css'],
  providers :[Properties,SortOption]
})
export class IntegrationDetailsComponent implements OnInit {
  
  integrationsPagination = new Pagination();
  integrationsLoader = true;
  customResponse:CustomResponse = new CustomResponse();
  sortOption:SortOption = new SortOption();
  constructor(public authenticationService:AuthenticationService, public referenceService:ReferenceService,public pagerService:PagerService,
    public dashboardService:DashboardService,public properties:Properties,public utilService:UtilService) { }

  ngOnInit() {
  }

  openModalPopup() {
    this.referenceService.openModalPopup("integration-details-modal");
    this.findAllIntegrations(this.integrationsPagination);
}

closeModal(){
  this.referenceService.closeModalPopup("integration-details-modal")
}

  findAllIntegrations(pagination:Pagination){
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
    $(".success").hide();
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


}
