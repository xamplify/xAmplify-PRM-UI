import { Component, OnInit,Output,EventEmitter,Input } from '@angular/core';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { Properties } from '../models/properties';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { SortOption } from 'app/core/models/sort-option';
import { CustomResponse } from '../models/custom-response';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { UtilService } from 'app/core/services/util.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
declare var $:any;

@Component({
  selector: 'app-share-dashboard-buttons',
  templateUrl: './share-dashboard-buttons.component.html',
  styleUrls: ['./share-dashboard-buttons.component.css'],
  providers: [Pagination,HttpRequestLoader,Properties,SortOption]
})
export class ShareDashboardButtonsComponent implements OnInit {

  pagination:Pagination = new Pagination();
  sortOption:SortOption = new SortOption();
  customResponse:CustomResponse = new CustomResponse();
  @Output() shareDashboardButtonsEventEmitter = new EventEmitter();
  @Input() selectedUserListId = 0;
  @Input() contact:any;
  selectedDashboardButtonIds = [];
  isHeaderCheckBoxChecked = false;
  firstName = "";
  lastName = "";
  companyName = "";
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();

  constructor(private authenticationService:AuthenticationService,
    private referenceService:ReferenceService,private pagerService:PagerService,private utilService:UtilService,
    private xtremandLogger:XtremandLogger,private vanityUrlService:VanityURLService) { }

  ngOnInit() {
    this.referenceService.startLoader(this.httpRequestLoader);
    this.pagination.userListId = this.selectedUserListId;
    let contact = this.contact;
    if(contact!=undefined){
      this.pagination.partnerOrContactEmailId = contact.emailId;
      this.pagination.partnerId = contact.id;
      this.firstName = contact.firstName;
      this.lastName = contact.lastName;
      this.companyName = contact.contactCompany;
    }else{
      this.pagination.partnerId = 0;
    }
    this.findDashboardButtons(this.pagination);
  }


  findDashboardButtons(pagination: Pagination) {
     this.customResponse = new CustomResponse();
    this.referenceService.startLoader(this.httpRequestLoader);
    this.referenceService.scrollToModalBodyTopByClass();
    this.vanityUrlService.findAllUnPublishedAndFilteredPublishedDashboardButtons(this.pagination).subscribe(
      response => {
        const data = response.data;
        pagination.totalRecords = data.totalRecords;
        this.sortOption.totalRecords = data.totalRecords;
        pagination = this.pagerService.getPagedItems(pagination, data.list);
        /*******Header checkbox will be chcked when navigating through page numbers*****/
        var dashboardButtonIds = pagination.pagedItems.map(function(a) { return a.id; });
        var items = $.grep(this.selectedDashboardButtonIds, function(element: any) {
            return $.inArray(element, dashboardButtonIds) !== -1;
        });
        if (items.length == dashboardButtonIds.length) {
            this.isHeaderCheckBoxChecked = true;
        } else {
            this.isHeaderCheckBoxChecked = false;
        }
       this.referenceService.stopLoader(this.httpRequestLoader);
      }, error => {
        this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
      });
  }

}
