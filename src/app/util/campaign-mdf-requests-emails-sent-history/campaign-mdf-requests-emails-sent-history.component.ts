import { Component, OnInit } from '@angular/core';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { SortOption } from 'app/core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';
import { SearchableDropdownDto } from 'app/core/models/searchable-dropdown-dto';
import { CustomAnimation } from 'app/core/models/custom-animation';
import { CampaignService } from 'app/campaigns/services/campaign.service';



@Component({
  selector: 'app-campaign-mdf-requests-emails-sent-history',
  templateUrl: './campaign-mdf-requests-emails-sent-history.component.html',
  styleUrls: ['./campaign-mdf-requests-emails-sent-history.component.css'],
  providers :[Properties,SortOption],
  animations :[CustomAnimation]
})
export class CampaignMdfRequestsEmailsSentHistoryComponent implements OnInit {

  emailsHistoryPagination = new Pagination();
  httpRequestLoader = true;
  customResponse:CustomResponse = new CustomResponse();
  sortOption:SortOption = new SortOption();

    constructor(public authenticationService:AuthenticationService, public referenceService:ReferenceService,public pagerService:PagerService,
      public properties:Properties,public utilService:UtilService,public campaignService:CampaignService) { }

  ngOnInit() {
  }

openModalPopup(campaignId:number){
  this.httpRequestLoader = true;
  this.emailsHistoryPagination = new Pagination();
  this.emailsHistoryPagination.campaignId = campaignId;
  this.customResponse = new CustomResponse();
  this.referenceService.openModalPopup("campaign-mdf-emails-history-modal");
  this.findCampaignMdfEmailsHistory(this.emailsHistoryPagination);
}


  findCampaignMdfEmailsHistory(emailsHistoryPagination: Pagination) {
    this.referenceService.scrollToModalBodyTopByClass();
    this.httpRequestLoader = true;
    this.customResponse = new CustomResponse();
    this.campaignService.findCampaignMdfEmailsHistory(emailsHistoryPagination).subscribe(
        response=>{
          const data = response.data;
          emailsHistoryPagination.totalRecords = data.totalRecords;
          emailsHistoryPagination = this.pagerService.getPagedItems(emailsHistoryPagination, data.list);
          this.httpRequestLoader = false;
        },error=>{
          this.httpRequestLoader = false;
          this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
        });
  }

  closeModal(){
    this.emailsHistoryPagination = new Pagination();
    this.customResponse = new CustomResponse();
    this.referenceService.closeModalPopup("campaign-mdf-emails-history-modal");
  }

}
