import { CustomResponse } from 'app/common/models/custom-response';
import { Component, OnInit } from '@angular/core';
import { Properties } from 'app/common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from '../dashboard.service';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';

@Component({
  selector: 'app-quick-links',
  templateUrl: './quick-links.component.html',
  styleUrls: ['./quick-links.component.css'],
  providers: [Properties]
})
export class QuickLinksComponent implements OnInit {

  quickLinks:Array<any> = new Array<any>();
  isPartnerLoggedInThroughVanityUrl = false;
  isQuickLinksApiLoading = true;
  quickLinksPagination:Pagination = new Pagination();
  companyId = 0;
  customResponse:CustomResponse = new CustomResponse();
  searchKey: string;
  constructor(public referenceService:ReferenceService,public properties:Properties,public authenticationService:AuthenticationService,public pagerService:PagerService,
    public dashboardService:DashboardService) { }

  ngOnInit() {
    this.findAllQuickLinks(this.quickLinksPagination);
  }

  findAllQuickLinks(quickLinksPagination: Pagination) {
    this.isQuickLinksApiLoading = true;
    this.dashboardService.findAllQuickLinks(quickLinksPagination).subscribe(
        response=>{
          let data = response.data;
          this.quickLinks = data.list;
          let map = response.map;
          this.companyId = map['companyId'];
          this.isPartnerLoggedInThroughVanityUrl = map['isPartnerLoggedInThroughVanityUrl'];
          quickLinksPagination.totalRecords = data.totalRecords;
          quickLinksPagination = this.pagerService.getPagedItems(quickLinksPagination, this.quickLinks);
          
          this.isQuickLinksApiLoading = false;
        },error=>{
          this.isQuickLinksApiLoading = false;
          this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        });
  }

  navigateBetweenPageNumbers(event:any){
    this.quickLinksPagination.pageIndex = event.page;
    this.findAllQuickLinks(this.quickLinksPagination);
  }

  searchQuickLinks() {
		this.quickLinksPagination.pageIndex = 1;
		this.quickLinksPagination.searchKey = this.searchKey;
    this.findAllQuickLinks(this.quickLinksPagination);
	}

  searchQuickLinksOnKeyPress(keyCode:any){
    if (keyCode === 13) { 
      this.searchQuickLinks();
    }
  }

  navigate(quickLink:any){
    this.referenceService.navigateToQuickLinksAnalytics(quickLink,this.isPartnerLoggedInThroughVanityUrl);
  }
  
}
