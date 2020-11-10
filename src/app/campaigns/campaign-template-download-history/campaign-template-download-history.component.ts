import { Component, OnInit } from '@angular/core';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CampaignService } from '../services/campaign.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { ReferenceService } from '../../core/services/reference.service';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';

declare var $:any;
@Component({
  selector: 'app-campaign-template-download-history',
  templateUrl: './campaign-template-download-history.component.html',
  styleUrls: ['./campaign-template-download-history.component.css'],
  providers: [HttpRequestLoader,Pagination,Properties]

})
export class CampaignTemplateDownloadHistoryComponent implements OnInit {

   historyLoader:HttpRequestLoader = new HttpRequestLoader();
   historyPagination:Pagination = new Pagination();
   loggedInUserId:number = 0;
   historyResponse:CustomResponse = new CustomResponse();
   campaignName:string = "";
   historyList: Array<any> = new Array<any>();
  constructor(public properties: Properties,public pagerService:PagerService,private campaignService:CampaignService,private authencticationService:AuthenticationService,private referenceService:ReferenceService) {
    this.loggedInUserId = this.authencticationService.getUserId();
   }

  ngOnInit() {
  }

  viewHistoryForPartners(campaign:any){
    this.referenceService.startLoader(this.historyLoader);
    $('#campaignTemplateDownloadHistoryPopup').modal('show');
    this.historyPagination.userId = this.loggedInUserId;
    this.historyPagination.campaignId = campaign.campaignId;
    this.campaignName = campaign.campaignName;
    this.listHistory(this.historyPagination);
  }

  listHistory(pagination: Pagination) {
		this.referenceService.loading(this.historyLoader, true);
		this.campaignService.viewDownloadHistoryForPartners(pagination).subscribe((result: any) => {
			if (result.statusCode === 200) {
				let data = result.data;
				pagination.totalRecords = data.totalRecords;
				$.each(data.list, function (_index: number, history: any) {
					history.displayTime = new Date(history.downloadedTimeInUTCString);
        });
        this.historyList = data.list;
				//pagination = this.pagerService.getPagedItems(pagination, data.list);
			}
			this.referenceService.loading(this.historyLoader, false);
		}, error => {
			this.historyResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
		});
	}

  closePopup(){
    $('#campaignTemplateDownloadHistoryPopup').modal('hide');
  }

}
