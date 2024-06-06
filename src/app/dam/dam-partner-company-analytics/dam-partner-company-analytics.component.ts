import { Component, OnInit } from '@angular/core';
import { Properties } from 'app/common/models/properties';
import { HttpRequestLoader } from './../../core/models/http-request-loader';
import { SortOption } from 'app/core/models/sort-option';
import { CustomResponse } from 'app/common/models/custom-response';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { DamService } from '../services/dam.service';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from 'app/core/services/util.service';
import { SaveVideoFile } from 'app/videos/models/save-video-file';
import { VideoFileService } from 'app/videos/services/video-file.service';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';

@Component({
  selector: 'app-dam-partner-company-analytics',
  templateUrl: './dam-partner-company-analytics.component.html',
  styleUrls: ['./dam-partner-company-analytics.component.css'],
  providers:[Properties,HttpRequestLoader,SortOption]
})
export class DamPartnerCompanyAnalyticsComponent implements OnInit {

  customResponse:CustomResponse = new CustomResponse();
  properties:Properties = new Properties();
  pagination:Pagination = new Pagination();
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  partnerCompaniesSortOption: SortOption = new SortOption();
  initLoader = true;
  damId:any;
  viewType: string;
  categoryId: number;
  folderViewType: string;
  folderListView = false;
  selectedVideo: SaveVideoFile;
  campaignReport : boolean = false;
  isPublished = false;
  partnerModuleCustomName = "";
  breadCrumb  = "Analytics";
  isVideoAnalyticsLoaded = false;
  isVideoFile = false;
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,
    public xtremandLogger:XtremandLogger,public pagerService:PagerService,public damService:DamService,
    public route:ActivatedRoute,private utilService:UtilService,private videoFileService:VideoFileService) { }

  ngOnInit() {
    this.referenceService.startLoader(this.httpRequestLoader);
     /****XNFR-169****/
     this.viewType = this.route.snapshot.params['viewType'];
     this.categoryId = this.route.snapshot.params['categoryId'];
     this.folderViewType = this.route.snapshot.params['folderViewType'];
     if(this.folderViewType=="fl"){
       this.folderListView = true;
     }
    this.partnerModuleCustomName = this.authenticationService.getPartnerModuleCustomName();
    this.damId = atob(this.route.snapshot.params['damId']);
    this.breadCrumb = this.partnerModuleCustomName+" Companies";
    this.pagination.partnerTeamMemberGroupFilter = true;
    this.findPartnerCompanies(this.pagination);
    this.findVideoDetails();
  }

  findVideoDetails() {
    this.isVideoAnalyticsLoaded = false;
    this.videoFileService.findVideoById(this.damId).subscribe(
      (response: any)=>{
        let statusCode = response.statusCode;
        if(statusCode==200){
          this.isVideoFile = true;
          let videoFile = response.data;
          let access = response.access;
          if (access) {
            if (videoFile.imageFiles == null || videoFile.gifFiles == null) {
              videoFile.gifFiles = []; videoFile.imageFiles = [];
            }
            videoFile.damId = this.damId;
            this.videoFileService.saveVideoFile = videoFile;
            this.referenceService.selectedVideoLogo = videoFile.brandingLogoUri;
            this.referenceService.selectedVideoLogodesc = videoFile.brandingLogoDescUri;
            this.videoFileService.campaignReport = true;
            this.selectedVideo = videoFile;
            this.breadCrumb = this.partnerModuleCustomName+" Companies & Video Analytics";
          } else {
            this.authenticationService.forceToLogout();
          }
        }
        this.isVideoAnalyticsLoaded = true;
        
      },error=>{
        this.xtremandLogger.errorPage(error);
      });
  }
  findPartnerCompanies(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
		this.damService.findPartnerCompanies(pagination,this.damId).
    	subscribe((result: any) => {
			let data = result.data;
			pagination.totalRecords = data.totalRecords;
			pagination = this.pagerService.getPagedItems(pagination, data.list);
      let map = result.map;
      this.isPublished = map['isPublished'];
      if(!this.isPublished){
        this.customResponse = new CustomResponse('INFO','This asset has not been published yet. Please publish it to view the analytics.',true);
      }
      this.stopLoaders();
		}, error => {
			this.xtremandLogger.error(error);
			this.xtremandLogger.errorPage(error);
		});
  }

  /********************Pagaination&Search Code*****************/

  /*************************Sort********************** */
  sortPartnerCompanies(text: any) {
    this.partnerCompaniesSortOption.selectedDamPartnerCompaniesDropDownOption = text;
    this.getAllFilteredResults();
  }


  /*************************Search********************** */
  searchPartnerCompanies() {
    this.getAllFilteredResults();
  }


  /************Page************** */
  navigateToNextPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.findPartnerCompanies(this.pagination);
  }

  getAllFilteredResults() {
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = this.partnerCompaniesSortOption.searchKey;
    this.pagination = this.utilService.sortOptionValues(this.partnerCompaniesSortOption.selectedDamPartnerCompaniesDropDownOption, this.pagination);
    this.findPartnerCompanies(this.pagination);
  }
  searchPartnerCompaniesOnEnter(keyCode: any) { if (keyCode === 13) { this.searchPartnerCompanies(); } }
  /********************Pagaination&Search Code*****************/

  stopLoaders() {
    this.referenceService.loading(this.httpRequestLoader, false);
    this.initLoader = false;
  }

  goBack() {
    this.referenceService.navigateToManageAssetsByViewType(this.folderViewType,this.viewType,this.categoryId,false);
  }

  refreshList() {
    this.findPartnerCompanies(this.pagination);
  }

  viewDetailedAnalytics(partner: any) {
    let encodedDamId = this.referenceService.encodePathVariable(this.damId);
    let encodedDamPartnerId = this.referenceService.encodePathVariable(partner.damPartnerId);
    let encodedUserId = this.referenceService.encodePathVariable(partner.userId);
    this.referenceService.navigateToRouterByViewTypes("/home/dam/vda/" + encodedDamId + "/" + encodedDamPartnerId + "/" + encodedUserId,this.categoryId,this.viewType,this.folderViewType,this.folderListView);
  }

  getSelectedIndex(index: any) {
    this.pagination.partnerTeamMemberGroupFilter = index == 1;
    this.findPartnerCompanies(this.pagination);
  }

  viewAnalytics(company:any){
    let damPartnerId = company.damPartnerId;
    let prefixUrl = RouterUrlConstants['home']+RouterUrlConstants['dam']+RouterUrlConstants['damPartnerAnalytics'];
    let url = prefixUrl+'/'+this.referenceService.encodePathVariable(this.damId)+'/'+this.referenceService.encodePathVariable(damPartnerId);
		this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.viewType, this.folderViewType, this.folderListView);
  }

}
