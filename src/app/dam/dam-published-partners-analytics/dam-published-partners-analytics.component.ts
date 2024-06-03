import { Component, OnInit } from '@angular/core';
import { DamService } from '../services/dam.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
import { SortOption } from '../../core/models/sort-option';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { UtilService } from '../../core/services/util.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { SaveVideoFile } from '../../videos/models/save-video-file';
import { VideoFileService } from '../../videos/services/video-file.service';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';

@Component({
  selector: 'app-dam-published-partners-analytics',
  templateUrl: './dam-published-partners-analytics.component.html',
  styleUrls: ['./dam-published-partners-analytics.component.css'],
  providers: [HttpRequestLoader, SortOption, Properties]
})
export class DamPublishedPartnersAnalyticsComponent implements OnInit {
  loggedInUserId: number = 0;
  pagination: Pagination = new Pagination();
  customResponse: CustomResponse = new CustomResponse();
  loggedInUserCompanyId: any;
  listLoader: HttpRequestLoader = new HttpRequestLoader();
  damId: any;
  statusCode = 200;
  selectedVideo: SaveVideoFile;
  campaignReport : boolean = false;
  /****XNFR-169****/
  viewType: string;
  categoryId: number;
  folderViewType: string;
  folderListView = false;
  isAssetPublished: boolean;
  loading: boolean;
  partnerModuleCustomName = "";
  damPartnerId:any;
  constructor(private route: ActivatedRoute, private utilService: UtilService, public sortOption: SortOption, private damService: DamService,
              private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, 
              public referenceService: ReferenceService,private router: Router, public properties: Properties, public videoFileService : VideoFileService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.partnerModuleCustomName = this.authenticationService.getPartnerModuleCustomName();
    /****XNFR-169****/
    this.viewType = this.route.snapshot.params['viewType'];
		this.categoryId = this.route.snapshot.params['categoryId'];
		this.folderViewType = this.route.snapshot.params['folderViewType'];
    if(this.folderViewType=="fl"){
			this.folderListView = true;
		}
  }

  ngOnInit() {
    this.referenceService.loading(this.listLoader, true);
    this.damId = atob(this.route.snapshot.params['damId']);
    this.damPartnerId = atob(this.route.snapshot.params['damPartnerId']);
    this.pagination.id = this.damPartnerId;
    this.findAllPartnerCompanyUsers(this.pagination);
  }

  findAllPartnerCompanyUsers(pagination:Pagination){
    this.referenceService.goToTop();
    this.referenceService.loading(this.listLoader, true);
    this.damService.findPartnerCompanyUsers(pagination).subscribe((result: any) => {
      let data = result.data;
      pagination.totalRecords = data.totalRecords;
      pagination = this.pagerService.getPagedItems(pagination, data.list);
      this.referenceService.loading(this.listLoader, false);
    }, error => {
      this.xtremandLogger.log(error);
      this.xtremandLogger.errorPage(error);
    });
  }

  /********************Pagaination&Search Code*****************/

  /*************************Sort********************** */
  sortBy(text: any) {
    this.sortOption.publishedPartnerAnalyticsSortOption = text;
    this.getAllFilteredResults();
  }


  /*************************Search********************** */
  searchPartners() {
    this.getAllFilteredResults();
  }


  /************Page************** */
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.findAllPartnerCompanyUsers(this.pagination);
  }

  getAllFilteredResults() {
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = this.sortOption.searchKey;
    this.pagination = this.utilService.sortOptionValues(this.sortOption.publishedPartnerAnalyticsSortOption, this.pagination);
    this.findAllPartnerCompanyUsers(this.pagination);
  }
  eventHandler(keyCode: any) { if (keyCode === 13) { this.searchPartners(); } }
  /********************Pagaination&Search Code*****************/

  stopLoaders() {
    this.referenceService.loading(this.listLoader, false);
  }


  goBack() {
    this.loading = true;
    this.referenceService.navigateToManageAssetsByViewType(this.folderViewType,this.viewType,this.categoryId,false);
  }

  refreshPage() {
    this.findAllPartnerCompanyUsers(this.pagination);
  }

  viewDetailedAnalytics(partner: any) {
    this.loading = true;
    let encodedDamId = this.referenceService.encodePathVariable(this.damId);
    let encodedDamPartnerId = this.referenceService.encodePathVariable(partner.damPartnerId);
    let encodedUserId = this.referenceService.encodePathVariable(partner.userId);
    this.referenceService.navigateToRouterByViewTypes("/home/dam/vda/" + encodedDamId + "/" + encodedDamPartnerId + "/" + encodedUserId,this.categoryId,this.viewType,this.folderViewType,this.folderListView);
  }

  getSelectedIndex(index: any) {
    this.pagination.partnerTeamMemberGroupFilter = index == 1;
    this.findAllPartnerCompanyUsers(this.pagination);
  }

  goBackToPartnerCompanies(){
    let prefixUrl = RouterUrlConstants['home']+RouterUrlConstants['dam']+RouterUrlConstants['damPartnerCompanyAnalytics'];
    let url = prefixUrl+this.referenceService.encodePathVariable(this.damId);
    this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.viewType, this.folderViewType, this.folderListView);

  }

}
