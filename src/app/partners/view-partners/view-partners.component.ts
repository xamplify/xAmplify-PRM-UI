import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { ParterService } from '../services/parter.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { SortOption } from '../../core/models/sort-option';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CustomResponse } from '../../common/models/custom-response';
import { UtilService } from '../../core/services/util.service';
import { $ } from 'protractor';
@Component({
  selector: 'app-view-partners',
  templateUrl: './view-partners.component.html',
  styleUrls: ['./view-partners.component.css'],
  providers: [Pagination, HttpRequestLoader, SortOption]
})
export class ViewPartnersComponent implements OnInit {
  customResponse:CustomResponse = new CustomResponse();
  pagination:Pagination = new Pagination();
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  journeyLoader:HttpRequestLoader = new HttpRequestLoader();
  sortOption:SortOption = new SortOption();
  journeyHistroies:Array<any> = new Array<any>();
  selectedPartner:any;
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,
    private xtremandLogger:XtremandLogger,private utilService:UtilService,private pagerService:PagerService,
    private partnerService:ParterService,public router: Router,private route:ActivatedRoute) { }

  ngOnInit() {
    this.findAllPartnerCompanies(this.pagination);
  }

  findAllPartnerCompanies(pagination:Pagination){
    this.referenceService.startLoader(this.httpRequestLoader);
    this.partnerService.findAllPartnerCompanies(pagination).
    subscribe(
      result=>{
        let data = result.data;
        pagination.totalRecords = data.totalRecords;
        this.sortOption.totalRecords = data.totalRecords;
        pagination = this.pagerService.getPagedItems(pagination, data.list);
        this.referenceService.stopLoader(this.httpRequestLoader);
      },error=>{
        this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
        this.referenceService.stopLoader(this.httpRequestLoader);
      });
  }

  navigateToNextPage(event: any) {
		this.pagination.pageIndex = event.page;
		this.findAllPartnerCompanies(this.pagination);
	}

	partnersSearchOnKeyEvent(keyCode: any) { if (keyCode === 13) { this.searchPartners(); } }

	/*************************Sort********************** */
	sortBy(text: any) {
		this.sortOption.selectedDamPartnerDropDownOption = text;
		this.getAllFilteredResults(this.pagination, this.sortOption);
	}
	/*************************Search********************** */
	searchPartners() {
		this.getAllFilteredResults(this.pagination, this.sortOption);
	}
	getAllFilteredResults(pagination: Pagination, sortOption: SortOption) {
		this.customResponse = new CustomResponse();
		pagination.pageIndex = 1;
		pagination.searchKey = sortOption.searchKey;
    //pagination = this.utilService.sortOptionValues(sortOption.selectedDamPartnerDropDownOption, pagination);
    this.findAllPartnerCompanies(pagination);
	}

  showJourney(partner:any){
    this.selectedPartner = partner;
    this.referenceService.showModalPopup("partner-journey-modal");
    this.referenceService.startLoader(this.journeyLoader);
    this.partnerService.findPartnerCompanyJourney(partner.partnershipId).subscribe(
      response=>{
        this.journeyHistroies = response.data;
        this.referenceService.stopLoader(this.journeyLoader);
      },error=>{
        this.referenceService.stopLoader(this.journeyLoader);
        this.referenceService.showSweetAlertServerErrorMessage();
        this.referenceService.closeModalPopup("partner-journey-modal");
      }
    )

  }

}
