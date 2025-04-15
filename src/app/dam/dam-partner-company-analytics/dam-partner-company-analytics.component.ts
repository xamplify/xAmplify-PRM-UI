import { Component, OnInit,Renderer } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'app/core/services/util.service';
import { SaveVideoFile } from 'app/videos/models/save-video-file';
import { VideoFileService } from 'app/videos/services/video-file.service';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { Ng2DeviceService } from 'ng2-device-detector';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { AssetDetailsViewDto } from '../models/asset-details-view-dto';
import { User } from 'app/core/models/user';
import { ParterService } from 'app/partners/services/parter.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';

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
  isFromApprovalModule: boolean = false;
  openSelectDigitalSignatureModalPopUp: boolean = false;
  sharedAssetPath: any;
  assetDetailsViewDto : AssetDetailsViewDto = new AssetDetailsViewDto();
  formData: any = new FormData();
  damPartnerUserId: any;
  isVendorSignatureRequiredAfterPartnerSignature: boolean = false;
  /* XNFR-923 */
  isPartnerSignatureRequired:boolean = false;
  sendTestEmailIconClicked: boolean;
  isHeaderCheckBoxChecked: boolean = false;
  isSendReminderEnabled: boolean = false;
  selectedCompanyIds: number[] = [];
  selectedEmailTemplateId: any;
  selectedEmailId: String;
  selectedItem : any;
  vanityTemplates : boolean = false;
  selectedPartners:any[]=[];
  isAllPartnerSignesCompleted:boolean =false;
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,
    public xtremandLogger:XtremandLogger,public pagerService:PagerService,public damService:DamService,public router: Router,
    public route:ActivatedRoute,private utilService:UtilService,private videoFileService:VideoFileService,public renderer:Renderer, public deviceService: Ng2DeviceService, 
    private parterService:ParterService, private vanityURLService: VanityURLService) { 
      this.referenceService.renderer = this.renderer;
    }

  ngOnInit() {
    this.referenceService.startLoader(this.httpRequestLoader);
     /****XNFR-169****/
     this.isFromApprovalModule = this.router.url.indexOf(RouterUrlConstants.approval) > -1;
     this.viewType = this.route.snapshot.params['viewType'];
     this.categoryId = this.route.snapshot.params['categoryId'];
     this.folderViewType = this.route.snapshot.params['folderViewType'];
     if(this.folderViewType=="fl"){
       this.folderListView = true;
     }
    this.partnerModuleCustomName = this.authenticationService.getPartnerModuleCustomName();
    this.damId = atob(this.route.snapshot.params['damId']);
    this.breadCrumb = this.partnerModuleCustomName+" Companies";
    let partnerFilter = this.authenticationService.getLocalStorageItemByKey(XAMPLIFY_CONSTANTS.filterPartners);
    if (partnerFilter != null && (partnerFilter === false || partnerFilter === 'false')) {
      this.pagination.partnerTeamMemberGroupFilter = false;
    } else {
      this.pagination.partnerTeamMemberGroupFilter = true;
    }

   
    this.getIsPartnerSignatureRequiredAndGetPartnerSignatureCount(this.damId);
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
    this.isSendReminderEnabled = false;
    this.isHeaderCheckBoxChecked = false;
    this.referenceService.loading(this.httpRequestLoader, true);
		this.damService.findPartnerCompanies(pagination,this.damId).
    	subscribe((result: any) => {
			let data = result.data;
			pagination.totalRecords = data.totalRecords;
			pagination = this.pagerService.getPagedItems(pagination, data.list);
      let map = result.map;
      this.isPublished = map['isPublished'];
      this.isAllPartnerSignesCompleted = pagination.pagedItems.every(item => item.partnerSignatureCompleted);

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
    if (this.isFromApprovalModule) {
      this.goBackToManageApproval();
    } else {
      this.referenceService.navigateToManageAssetsByViewType(this.folderViewType, this.viewType, this.categoryId, false);
    }
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

  viewAnalytics(company: any) {
    let damPartnerId = company.damPartnerId;
    let prefixUrl = "";
    if (this.isFromApprovalModule) {
      prefixUrl = RouterUrlConstants['home'] + RouterUrlConstants['dam'] + RouterUrlConstants['approval'] + RouterUrlConstants['damPartnerAnalytics'];
    } else {
      prefixUrl = RouterUrlConstants['home'] + RouterUrlConstants['dam'] + RouterUrlConstants['damPartnerAnalytics'];
    }
    let url = prefixUrl + '/' + this.referenceService.encodePathVariable(this.damId) + '/' + this.referenceService.encodePathVariable(damPartnerId);
    this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.viewType, this.folderViewType, this.folderListView);
  }

  goBackToManageApproval() {
    let url = RouterUrlConstants['home'] + RouterUrlConstants['manageApproval'];
    this.referenceService.goToRouter(url);
  }

  //XNFR-833
  downloadAsset(company:any){
    this.utilService.getJSONLocation().subscribe(
      (response: any) => {
        let param = this.getLocationDetails(response, company.damPartnerAlias, company);
        param.id = company.partnerDamId;
        let completeUrl = this.authenticationService.REST_URL + "dam/downloadpc?access_token=" + this.authenticationService.access_token;
        this.referenceService.post(param, completeUrl);
      }, (_error: any) => {
        this.xtremandLogger.error("Error In Fetching Location Details");
      }
    );
  }

  viewAsset(company: any){
    // this.saveGeoLocationAnalytics(this.assetId);
    this.referenceService.preivewAssetForPartnerOnNewHost(company.damPartnerId);
  }

  getLocationDetails(response: any, alias: string, company: any) {
		let deviceInfo = this.deviceService.getDeviceInfo();
		if (deviceInfo.device === 'unknown') {
			deviceInfo.device = 'computer';
		}
		let param : any = {
			'alias': alias,
			'loggedInUserId': company.partnerUserId,
			'deviceType': deviceInfo.device,
			'os': deviceInfo.os,
			'city': response.city,
			'country': response.country,
			'isp': response.isp,
			'ipAddress': response.query,
			'state': response.regionName,
			'zip': response.zip,
			'latitude': response.lat,
			'longitude': response.lon,
			'countryCode': response.countryCode,
			'timezone': response.timezone
		};
		return param;
	}

  addSignature(company: any){
    this.getAssetDetailsById(company.damPartnerId);
    this.damPartnerUserId = company.partnerUserId;
  }

  notifySelectDigitalSignatureCloseModalPopUp(event){
		if(event == 'close'){
			this.openSelectDigitalSignatureModalPopUp = false;
		}
	}

  notifySignatureSelection(event){
    let formData = new FormData();
    formData.append("uploadedFile", event, event['name']);
    this.assetDetailsViewDto.selectedSignaturePath = 'http://localhost:8000/signatures/94105361/draw-signature.png'
    this.uploadSignature(formData);
   }

     uploadSignature(formData : FormData) {
      this.referenceService.loading(this.httpRequestLoader, true);
      this.assetDetailsViewDto.loggedInUserId = this.damPartnerUserId;
        this.damService.uploadVendorSignature(this.assetDetailsViewDto, formData).subscribe(
          (response: any) => {
            this.referenceService.loading(this.httpRequestLoader, false);
            this.findPartnerCompanies(this.pagination);
          },
          (error: string) => {
            this.xtremandLogger.errorPage(error);
            this.referenceService.loading(this.httpRequestLoader, false);
          }
        );
    }

    getAssetDetailsById(damPartnerId:any){
      this.damService.getSharedAssetDetailsByIdForVendor(damPartnerId)
        .subscribe(
          (response: any) => {
            if (response.access) {
              if (response.statusCode == 200) {
                this.assetDetailsViewDto = response.data;
                this.sharedAssetPath = this.assetDetailsViewDto.sharedAssetPath;
                this.openSelectDigitalSignatureModalPopUp = true;        
              } 
            }
          },
          (error: string) => {
            this.xtremandLogger.errorPage(error);
          },
        );
    }

    getIsVendorSignatureRequiredAfterPartnerSignatureCompleted(damId : any){
      this.damService.getIsVendorSignatureRequiredAfterPartnerSignatureCompleted(damId)
      .subscribe(
        (response: any) => {
            if (response.statusCode == 200) {
              this.isVendorSignatureRequiredAfterPartnerSignature = response.data;
            }
        },
        (error: string) => {
          this.xtremandLogger.errorPage(error);
        },
      );
    }
    
    getIsPartnerSignatureRequiredAndGetPartnerSignatureCount(damId : any){
      this.damService.getIsPartnerSignatureRequiredAndGetPartnerSignatureCount(damId)
      .subscribe(
        (response: any) => {
            if (response.statusCode == 200) {
              this.isPartnerSignatureRequired = true;
            }
        },
        (error: string) => {
          this.xtremandLogger.errorPage(error);
        },
        ()=>{
          this.pagination = this.utilService.sortOptionValues(this.partnerCompaniesSortOption.selectedDamPartnerCompaniesDropDownOption, this.pagination);
          this.findPartnerCompanies(this.pagination);
          this.findVideoDetails();
          this.getIsVendorSignatureRequiredAfterPartnerSignatureCompleted(this.damId);      
        }
      );
    }

  
  updateSelectionState(): void {
    const currentPageItems = this.pagination.pagedItems;

    currentPageItems
      .filter(item => item.isSelected)
      .forEach(item => {
        if (!this.selectedCompanyIds.includes(item.companyId)) {
          this.selectedCompanyIds.push(item.companyId);
        }
      });

    currentPageItems
      .filter(item => !item.isSelected)
      .forEach(item => {
        const index = this.selectedCompanyIds.indexOf(item.companyId);
        if (index !== -1) {
          this.selectedCompanyIds.splice(index, 1);
        }
      });

    this.isSendReminderEnabled = this.selectedCompanyIds.length > 0;
    this.isHeaderCheckBoxChecked = currentPageItems.every(item => item.isSelected);
    this.selectedItem = currentPageItems;
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const currentPageItems = this.pagination.pagedItems;

    currentPageItems.forEach(item => {
      item.isSelected = !item.partnerSignatureCompleted && checked;

      if (checked) {
        if (!this.selectedCompanyIds.includes(item.companyId) ) {
          this.selectedCompanyIds.push(item.companyId);
        }
      } else {
        const index = this.selectedCompanyIds.indexOf(item.companyId);
        if (index !== -1) {
          this.selectedCompanyIds.splice(index, 1);
        }
      }
    });
    this.updateSelectionState();
  }


  sendTestEmailModalPopupEventReceiver() {
    this.selectedEmailTemplateId = 0;
    this.sendTestEmailIconClicked = false;
    this.vanityTemplates = false;
  }


  sendRemainderToIndividulCompany(compnayId:number){
    this.pagination.selectedPartnerCompanyIds = [];
    this.pagination.selectedPartnerCompanyIds=[compnayId];
    this.getPartnerDetailsByCompanies();
  }

  private getPartnerDetailsByCompanies() {
    this.selectedPartners =[]
    this.pagination.damId = this.damId;
    this.damService.getPartnersByDamIdAndCompanyIds(this.pagination).subscribe(
      response => {
        if (response.statusCode === 200) {

          const selectedPartners = response.data;
          this.selectedPartners = selectedPartners;
          if(this.selectedPartners != null && this.selectedPartners.length>0){
            const emailIds = selectedPartners.map(partner => partner.emailId);
            const emailIdsString = emailIds.join(', ');
            this.selectedEmailId = emailIdsString;
            this.sendTestEmailIconClicked = true;
          }else{
            this.customResponse = new CustomResponse('ERROR', 'Selected partner(s) not signed up', true);
          }
 
        } else if (response.statusCode === 400) {
          console.error("Error: Invalid email ID or other bad request.");
        } else {
          console.error("Unexpected status code:", response.statusCode);
        }
      },
      (error) => {
        console.error("Error fetching template ID:", error);
      }
    );
  }
  sendReminder(){
    this.pagination.selectedPartnerCompanyIds = [];
    this.pagination.selectedPartnerCompanyIds=this.pagination.pagedItems.filter(partner=>partner.isSelected).map(partner=>partner.companyId);
    this.getPartnerDetailsByCompanies();
  }

  sendPartnerSignatureReminder() {

    let partnerDetailsDto :Pagination = new Pagination();
    partnerDetailsDto.damId = this.damId
    partnerDetailsDto.partners = this.selectedPartners;
    partnerDetailsDto.userId = this.authenticationService.getUserId();

    this.vanityURLService.sendPartnerSignatureReminder(partnerDetailsDto).subscribe(
      response => {
        if (response.statusCode != 200) {
          console.error("Error: Invalid email ID or other bad request.");
        }

        this.sendTestEmailIconClicked = false;
        this.isHeaderCheckBoxChecked = false;
        this.referenceService.loading(this.httpRequestLoader, false);
        this.customResponse = new CustomResponse('SUCCESS', 'Email Sent to selected partners', true);
        this.searchPartnerCompanies();
      },
      (error) => {
        this.sendTestEmailIconClicked = false;
        this.referenceService.loading(this.httpRequestLoader, false);
        this.customResponse = new CustomResponse('ERROR', 'Something went wrong in sending an email.', true);
        this.searchPartnerCompanies();
      }
    );
  }
}

