import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import { ListLoaderValue } from 'app/common/models/list-loader-value';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../services/parter.service';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { CustomResponse } from 'app/common/models/custom-response';

@Component({
  selector: 'app-partner-journey-company-info',
  templateUrl: './partner-journey-company-info.component.html',
  styleUrls: ['./partner-journey-company-info.component.css']
})
export class PartnerJourneyCompanyInfoComponent implements OnInit {
  @Input() partnerCompanyId: any;

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  customResponse: CustomResponse = new CustomResponse();
  loggedInUserId: number = 0;
  companyInfo: any;
  isInfonull = false;
  errorMessage = "";
  filterActiveBg = "";
  filterApplied: any;
  showFilterOption: boolean  = false;
  showFilterDropDown: boolean  = false;
  toDateFilter: string;
  fromDateFilter: string;
  dateFilterText = "Select Date Filter";
  @Output() notifySelectedDateFilters = new EventEmitter();

  constructor(public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public utilService: UtilService, public xtremandLogger: XtremandLogger) {
      this.loggedInUserId = this.authenticationService.getUserId(); 
  }

  ngOnInit() {
    this.getPartnerCompanyInfo();
  }

  getPartnerCompanyInfo() {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.parterService.getPartnerJourneyCompanyInfo(this.partnerCompanyId, this.loggedInUserId).subscribe(
			(response: any) => {	
        this.referenseService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {
          this.companyInfo = response.data;	
          if(!(this.companyInfo != null))
          {
            this.isInfonull = true;
            this.errorMessage = " Partnership has been deleted ";
          }
          if (response.message === 'deactivated') {
            this.errorMessage = " Partnership has been deactivated ";
          }
        }        	
			},
			(_error: any) => {
        this.httpRequestLoader.isServerError = true;
        this.xtremandLogger.error(_error);
			}
		);
  }

  clickFilter() {
    if (!this.filterApplied) {
      this.showFilterOption = !this.showFilterOption;
    } else {
      if (this.showFilterOption) {
        this.showFilterOption = false;
      } else {
        this.showFilterDropDown = true;
      }
    }
    this.customResponse.isVisible = false;
  }

  viewDropDownFilter(){
    this.showFilterOption = true;
    this.showFilterDropDown = false;
  }

  clearFilter() {
    this.fromDateFilter = "";
    this.toDateFilter = "";
    this.setDateFilterOptions();
    this.showFilterDropDown = false;
    this.filterActiveBg = 'defaultFilterACtiveBg';
    this.filterApplied = false;
  }

  validateDateFilter() {
    let isValidFromDateFilter = this.fromDateFilter != undefined && this.fromDateFilter != "";
    let isEmptyFromDateFilter = this.fromDateFilter == undefined || this.fromDateFilter == "";
    let isValidToDateFilter = this.toDateFilter != undefined && this.toDateFilter != "";
    let isEmptyToDateFilter = this.toDateFilter == undefined || this.toDateFilter == "";
    if (isEmptyFromDateFilter && isEmptyToDateFilter) {
      this.customResponse = new CustomResponse('ERROR', "Please provide valid input to filter", true);
    } else {
      let validDates = false;
        if (isValidFromDateFilter && isEmptyToDateFilter) {
          this.customResponse = new CustomResponse('ERROR', "Please pick To Date", true);
        } else if (isValidToDateFilter && isEmptyFromDateFilter) {
          this.customResponse = new CustomResponse('ERROR', "Please pick From Date", true);
        } else {
          var toDate = Date.parse(this.toDateFilter);
          var fromDate = Date.parse(this.fromDateFilter);
          if (fromDate <= toDate) {
            validDates = true;
          } else {
            this.customResponse = new CustomResponse('ERROR', "From Date should be less than To Date", true);
          }
        }

      if (validDates) {
        this.applyFilters();
      }
    }
  }

  applyFilters() {
    this.filterApplied = true;
    this.setDateFilterOptions();
    this.showFilterOption = false;
    this.filterActiveBg = 'filterActiveBg';
  }

  closeFilterOption() {
    this.showFilterOption = false;
  }

  setDateFilterOptions() {
    let obj = {
      "fromDate": this.fromDateFilter,
      "toDate": this.toDateFilter
    }
    this.notifySelectedDateFilters.emit(obj);
  }

}
