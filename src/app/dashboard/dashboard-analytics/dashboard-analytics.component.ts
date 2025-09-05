import { Component, OnInit,OnDestroy, ViewChild, TemplateRef, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { UserDefaultPage } from '../../core/models/user-default-page';
import { UserService } from '../../core/services/user.service';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Properties } from '../../common/models/properties';
import { Campaign } from 'app/campaigns/models/campaign';
import { CampaignReport } from 'app/campaigns/models/campaign-report';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { DashboardService } from '../dashboard.service';
import { UtilService } from 'app/core/services/util.service';
import { DashboardAnalyticsDto } from '../models/dashboard-analytics-dto';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { DealsService } from 'app/deals/services/deals.service';
import { EnvService } from 'app/env.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { DownloadRequestDto } from 'app/util/models/download-request-dto';
import { CustomSkin } from '../models/custom-skin';
import { VideoFileService } from '../../videos/services/video-file.service';
import { Roles } from 'app/core/models/roles';
import { UserGuideDashboardDto } from 'app/guides/models/user-guide-dashboard-dto';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { DragulaService } from 'ng2-dragula';
import { DomSanitizer } from '@angular/platform-browser';

declare var swal, $:any, Highcharts: any;
@Component({
  selector: 'app-dashboard-analytics',
  templateUrl: './dashboard-analytics.component.html',
  styleUrls: ['./dashboard-analytics.component.css'],
  providers: [Properties,HttpRequestLoader, DealsService]

})
export class DashboardAnalyticsComponent implements OnInit,OnDestroy {
  isOnlyUser = false;
  logedInCustomerCompanyName: any;
  userDefaultPage: UserDefaultPage = new UserDefaultPage();
  loggedInUserId: number;
  ngxLoading = false;
  vendorCompanies:any;
  vendorCompanyProfileName:string = "";
  /************Top 4 Campaigns Variables********************** */
  totalRecords: number;
  campaigns: Campaign[];
  launchedCampaignsMaster: any[];
  launchedCampaignsChild: any[] = new Array<any>();
  totalCampaignsCount: number;
  campaignReportType: string;
  campaignReportOptions = ['RECENT', 'TRENDING', 'CUSTOM'];
  countryViewsData: any;
  userCampaignReport: CampaignReport = new CampaignReport();
  topFourCampaignsLoader:HttpRequestLoader = new HttpRequestLoader();
  topFourLoading = false;
  topFourCampaignErrorResponse :CustomResponse = new CustomResponse();
 // campaignIdArray:any[];
   /************Email Statistics*********** */
   trellisBarChartData: any;
   categories: any;
   maxBarChartNumber: number;
   isMaxBarChartNumber = true;
   emailStatisticsLoader:HttpRequestLoader = new HttpRequestLoader();
   dashboardAnalyticsDto:DashboardAnalyticsDto = new DashboardAnalyticsDto();
   hasCampaignRole: boolean;
   showDealForm: boolean = false;
   showLeadForm: boolean = false;
   customResponse: CustomResponse = new CustomResponse();
   showSandboxText = false;
   applyFilter = true;
   hasAccess = false;
   downloadString: string;
   downloadFailedMessage :CustomResponse = new CustomResponse();
   sweetAlert: boolean;
   requestChecking: string;
   showFailMessage: boolean = false;
   vanityLoginDto: VanityLoginDto = new VanityLoginDto();
   downloadRequestDto:DownloadRequestDto = new DownloadRequestDto();
   downloadRequestCustomResponse:CustomResponse = new CustomResponse();
   downloadRequestButtonClicked = false;
   duplicateRequest = false;
   showSweetAlert = false;
   skin:CustomSkin = new CustomSkin();
   userId: number;
    editVideo : boolean = false;
   playVideo : boolean = false;
    /** user guide */
    mergeTagForGuide:any;
    roleName: Roles = new Roles();
    userGuideDashboardDto:UserGuideDashboardDto = new UserGuideDashboardDto();
    /** user guide */

    /***** XNFR-860 *****/
    @ViewChild('dashBoardImages') dashBoardImages: TemplateRef<any>;
    @ViewChild('moduleAnalytics') moduleAnalytics: TemplateRef<any>;
    @ViewChild('newsAndAnnouncement') newsAndAnnouncement: TemplateRef<any>;
    @ViewChild('dashBoardButtons') dashBoardButtons: TemplateRef<any>;
    @ViewChild('opportunityStats') opportunityStats: TemplateRef<any>;
    @ViewChild('vendorActivityAnalytics') vendorActivityAnalytics: TemplateRef<any>;
    @ViewChild('campaignsGrid') campaignsGrid: TemplateRef<any>;
    @ViewChild('campaignStatistics') campaignStatistics: TemplateRef<any>;
    @ViewChild('partnerStatistics') partnerStatistics: TemplateRef<any>;
    @ViewChild('redistributedCampaigns') redistributedCampaigns: TemplateRef<any>;
    @ViewChild('regionalStatistics') regionalStatistics: TemplateRef<any>;
    @ViewChild('prmMdfStatistics') prmMdfStatistics: TemplateRef<any>;
    @ViewChild('prmContent') prmContent: TemplateRef<any>;
    @ViewChild('prmAssets') prmAssets: TemplateRef<any>;
    @ViewChild('prmSharedAssets') prmSharedAssets: TemplateRef<any>;
    @ViewChild('prmTracks') prmTracks: TemplateRef<any>;
    @ViewChild('prmSharedTracks') prmSharedTracks: TemplateRef<any>;
    @ViewChild('prmPlayBooks') prmPlayBooks: TemplateRef<any>;
    @ViewChild('prmSharedPlayBooks') prmSharedPlayBooks: TemplateRef<any>;
    @ViewChild('leadAndDealStatistics') leadAndDealStatistics: TemplateRef<any>;
    @ViewChild('highLevelAnalytics') highLevelAnalytics: TemplateRef<any>;
    @ViewChild('dragContainer') dragContainer: ElementRef;
    templates = [];
    defaultDashboardLayout = [];
    isDestroyed: boolean = false;
    isDraggingEnabled: boolean = false;
    defaultDashboardsettings: boolean = false;
    welcomeCustomResponse: CustomResponse = new CustomResponse();
    /***** XNFR-860 *****/
    @ViewChild('dynamicTemplate') dynamicTemplate: TemplateRef<any>;
    customModalPopup: boolean = false;
    customHtmlBlockIds: any = [];
    customHtmlBlockId: number;

    constructor(public envService: EnvService, public authenticationService: AuthenticationService, public userService: UserService,
        public referenceService: ReferenceService, public xtremandLogger: XtremandLogger, public properties: Properties,
        public dashBoardService: DashboardService, public utilService: UtilService, public router: Router, private route: ActivatedRoute, private vanityURLService: VanityURLService,
        public videoFileService: VideoFileService, private dragulaService: DragulaService, private cdr: ChangeDetectorRef, public sanitizer: DomSanitizer) {

        this.loggedInUserId = this.authenticationService.getUserId();
        this.vanityLoginDto.userId = this.loggedInUserId;
        /***XNFR-134***/
        let companyProfileName = this.authenticationService.companyProfileName;
        if (companyProfileName !== undefined && companyProfileName !== "") {
            this.vanityLoginDto.vendorCompanyProfileName = companyProfileName;
            this.vanityLoginDto.vanityUrlFilter = true;
        } else {
            this.vanityLoginDto.vanityUrlFilter = false;
        }
        this.isOnlyUser = this.authenticationService.isOnlyUser();
        this.utilService.setRouterLocalStorage('dashboard');
        this.hasCampaignRole = this.referenceService.hasRole(this.referenceService.roles.campaignRole);
        this.showSandboxText = (("https://xamplify.co/" == envService.CLIENT_URL || "http://localhost:4200/" == envService.CLIENT_URL) && !this.authenticationService.vanityURLEnabled);

    }

  ngOnInit() {
    localStorage.removeItem('assetName');
    localStorage.removeItem('campaignReport');
    localStorage.removeItem('saveVideoFile');
    let partnerFilter = this.authenticationService.getLocalStorageItemByKey(XAMPLIFY_CONSTANTS.filterPartners);
    if (partnerFilter !== null && partnerFilter !== undefined && (partnerFilter === false || partnerFilter === 'false')) {
        this.applyFilter = false;
    }
    this.getMainContent(this.userId);
    let companyProfileName = this.authenticationService.companyProfileName;
    if(companyProfileName!=undefined){
        this.vendorCompanyProfileName = companyProfileName;
    }
    const currentUser = localStorage.getItem( 'currentUser' );
    if(currentUser!=undefined){
      this.logedInCustomerCompanyName = JSON.parse( currentUser )['logedInCustomerCompanyNeme'];
      
      }
    if(!this.authenticationService.partnershipEstablishedOnlyWithPrmAndLoggedInAsPartner){
        this.loggedInUserId = this.authenticationService.getUserId();
        this.getDefaultPage(this.loggedInUserId);
        this.dashboardAnalyticsDto = this.vanityURLService.addVanityUrlFilterDTO(this.dashboardAnalyticsDto);
        this.getUserCampaignReport();
    }
      /** User Guide **/
      this.getMergeTagForGuide();
        /** User Guide **/
  }
    /** User Guide **/
    getMergeTagForGuide() {
        this.dashBoardService.getUserGuidesForDashBoard(this.vanityLoginDto)
            .subscribe(
                (response) => {
                    this.userGuideDashboardDto = response.data;
                    if (this.userGuideDashboardDto.partnerLoggedInThroughVanityUrl) {
                        if(this.userGuideDashboardDto.prmCompany){
                            this.mergeTagForGuide = 'vanity_prm_partner_account_dashboard';
                        } else {
                        this.mergeTagForGuide = 'vanity_partner_account_dashboard';
                        }
                    } else if (this.userGuideDashboardDto.vendorLoggedInThroughOwnVanityUrl) {
                        if ( this.userGuideDashboardDto.vendorCompany) {
                            this.mergeTagForGuide = 'vanity_vendor_account_dashboard';
                        } else if(this.userGuideDashboardDto.orgAdminCompany){
                            this.mergeTagForGuide = 'vanity_orgadmin_account_dashboard';
                        }else if(this.userGuideDashboardDto.prmCompany) {
                            this.mergeTagForGuide = 'vanity_prm_account_dashboard';
                        } else {
                            this.mergeTagForGuide = 'vanity_marketing_account_dashboard';
                        }
                    } else {
                        if (this.userGuideDashboardDto.orgAdminCompany) {
                            this.mergeTagForGuide = 'orgadmin_account_dashboard';
                        } else if (this.userGuideDashboardDto.vendorCompany) {
                            this.mergeTagForGuide = 'vendor_account_dashboard';
                        } else if (this.userGuideDashboardDto.marketingCompany) {
                            this.mergeTagForGuide = 'marketing_account_dashboard';
                        } else if (this.userGuideDashboardDto.prmCompany) {
                            this.mergeTagForGuide = 'prm_account_dashboard';
                        } else {
                            this.mergeTagForGuide = 'partner_account_dashboard';
                        }
                    }
                },
                error => {
                    console.log(error);
                }
            );
    }
      /** User Guide */
  ngOnDestroy() {
    $('#customizeCampaignModal').modal('hide');
    this.isDraggingEnabled = false;
    this.customHtmlBlockIds = [];
    this.isDestroyed = true;
  }

  getDefaultPage(userId: number) {
    this.ngxLoading = true;
    this.userService.loadUserDefaultPage(userId, this.authenticationService.companyProfileName)
        .subscribe(
            data => {
                if (data.dashboardType.includes('dashboard')) {
                    this.userDefaultPage.isCurrentPageDefaultPage = data.isCurrentPageDefaultPage;
                    this.referenceService.userDefaultPage = 'DASHBOARD';
                }
                this.ngxLoading = false;
            },
            error =>{
                this.xtremandLogger.log(error);
                this.ngxLoading = false;
            }, 
            () => { }
        );
}

    listVendorsByLoggedInUserId(userId: number) {
    this.ngxLoading = true;
    this.dashBoardService.listVendorsByLoggedInUserId(userId)
        .subscribe(
            response => {
               let data = response.data;
               this.vendorCompanies = data;
               this.ngxLoading = false;
            },
            error => {
                this.xtremandLogger.log(error);
                this.ngxLoading = false;
            },
            () => { }
        );
}

setDashboardAsDefaultPage(event: any) {
  this.ngxLoading = true;
  this.referenceService.userDefaultPage = event ? 'DASHBOARD' : 'WELCOME';
  this.userService.setUserDefaultPage(this.authenticationService.getUserId(), this.referenceService.userDefaultPage)
      .subscribe(
          data => {
              this.userDefaultPage.isCurrentPageDefaultPage = event;
              this.userDefaultPage.responseType = 'SUCCESS';
              this.userDefaultPage.responseMessage = this.properties.PROCESS_REQUEST_SUCCESS;
              this.ngxLoading = false;
          },
          error => {
              this.userDefaultPage.responseType = 'ERROR';
              this.userDefaultPage.responseMessage = this.properties.PROCESS_REQUEST_ERROR;
              this.ngxLoading = false;
          },
          () => { }
      );
}

/*******************Top 4 Campaigns Releated Code************************** */
getUserCampaignReport() {

}

setLaunchedCampaignsChild(userCampaignReport: CampaignReport) {
if (('CUSTOM' === userCampaignReport.campaignReportOption) && (null != userCampaignReport.campaigns)) {
    const campaignsArray: string[] = userCampaignReport.campaigns.split(',');

    for (const i of Object.keys(campaignsArray)) {
        const result = this.launchedCampaignsMaster.filter(function (obj) {
            return obj.id === parseInt(campaignsArray[i], 10);
        });
        this.xtremandLogger.log(result);
        if(result[0]){ this.launchedCampaignsChild.push(result[0]); }
    }
    this.launchedCampaignsMaster = this.launchedCampaignsMaster.filter(x => this.launchedCampaignsChild.indexOf(x) < 0);
}
}

listCampaignInteractionsData(userId: number, reportType: string) {

}

validateUserCampaignReport(userCampaignReport: CampaignReport) {
  let isValid = true;
  if ('CUSTOM' === userCampaignReport.campaignReportOption) {
      const campaignIds: string[] = [];

      $('.launchedCampaignsChild > div >h6').each(function () {
          campaignIds.push($(this).attr('id'));
      });
      userCampaignReport.campaigns = campaignIds.toString();
      if (campaignIds.length > 4) {
          this.setCampaignReportResponse('WARNING', 'You can not add more than 4 campaigns.');
          isValid = false;
      }
      if (campaignIds.length === 0) {
          this.setCampaignReportResponse('WARNING', 'Please select campaigns.');
          isValid = false;
      }
  }

  if (isValid) {
      this.saveUserCampaignReport(userCampaignReport);
  } else {
      return false;
  }
}

saveUserCampaignReport(userCampaignReport: CampaignReport) {
  
}

setCampaignReportResponse(response: string, responseMessage: string) {
  this.userCampaignReport.response = response;
  this.userCampaignReport.responseMessage = responseMessage;
}

onSelectionChangeCampaignReportOption(userCampaignReportOption: string) {
    this.userCampaignReport.campaignReportOption = userCampaignReportOption;
    this.setLaunchedCampaignsChild(this.userCampaignReport);
}


/*********Email Statistics******************/
getCampaignsEamailBarChartReports(campaignIdArray) {
    try {
        this.referenceService.loading(this.emailStatisticsLoader,true);
        this.dashBoardService.getCampaignsEmailReports(campaignIdArray).
            subscribe(result => {
                this.xtremandLogger.log(result);
                this.categories = result.campaignNames;
                this.xtremandLogger.log(result.emailOpenedCount.concat(result.emailClickedCount, result.watchedCount))
                this.maxBarChartNumber = Math.max.apply(null, result.emailOpenedCount.concat(result.emailClickedCount, result.watchedCount))
                this.xtremandLogger.log("max number is " + this.maxBarChartNumber);
                if (this.maxBarChartNumber > 0) {
                    this.isMaxBarChartNumber = true;
                    this.generateBarChartForEmailLogs(result.campaignNames, result.emailOpenedCount, result.emailClickedCount, result.watchedCount, this.maxBarChartNumber);
                } else {
                    this.referenceService.loading(this.emailStatisticsLoader,false); 
                    this.isMaxBarChartNumber = false; 
                }
            },
                (error: any) => {
                    this.xtremandLogger.error(error);
                    this.referenceService.showServerError(this.emailStatisticsLoader);
                });
    } catch (error) {
        this.xtremandLogger.error(error);
    }
}

generateBarChartForEmailLogs(names, opened, clicked, watched, maxValue: number) {
    let isDark = this.authenticationService.isDarkForCharts ;
    const charts = [],
        $containers = $('#trellis td'),
        datasets = [{ name: 'Opened', data: opened }, { name: 'Clicked', data: clicked },
        { name: 'Watched', data: watched },
        ];
    $.each(datasets, function (i, dataset) {
        charts.push(new Highcharts.Chart({
            chart: {
                renderTo: $containers[i],
                type: 'bar',
                marginLeft: i === 0 ? 100 : 10,
                backgroundColor   :isDark ? "#2b3c46" : "#fff",
            },
            tooltip: {
                backgroundColor: 'black', 
                style: {
                  color: '#fff' 
                }
              },

            title: {
                text: dataset.name,
                align: 'left',
                x: i === 0 ? 90 : 0,
                style: {
                    // color: '#696666',
                     color   :isDark ?  "#fff" : "#696666",
                    fontWeight: 'normal',
                    fontSize: '13px'
                }
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                bar: {
                    minPointLength: 3
                },
                series: {
                    point: {
                        events: {
                            click: function () {
                            }
                        }
                    }
                }
            },
            xAxis: {
                categories: names,
                labels: {
                    enabled: i === 0,
                    formatter: function () {
                      const text = this.value,
                        formatted = text.length > 10 ? text.substring(0, 10) + '...' : text;
                          return formatted ;
                    },
                    style:{
                        color   :isDark ?  "#fff" : "#696666",
                    }
                }
            },
            exporting: { enabled: false },
            yAxis: {
                allowDecimals: false,
                visible: false,
                title: {
                    text: null
                },
                min: 0,
                max: 10
            },
            legend: {
                enabled: false
            },
            labels: {
                style: {
                    color: 'white',
                    fontSize: '25px'
                }
            },
            series: [dataset]
        }));
    });
    this.topFourLoading = false;
    this.referenceService.loading(this.emailStatisticsLoader,false);
}


filterByCompanyProfileName(){
    if(this.vendorCompanyProfileName!=undefined &&this.vendorCompanyProfileName!=""){
	localStorage.setItem('vanityUrlCompanyProfielName', JSON.stringify(this.vendorCompanyProfileName));
        this.router.navigate(['/home/dashboard/vanity/'+this.vendorCompanyProfileName]);
    }else{
	localStorage.setItem('vanityUrlCompanyProfielName', JSON.stringify(""));
        this.router.navigate(['/home/dashboard/default']);
    }
    
}

showCampaignDetails(campaign:any){
    this.ngxLoading = true;
    this.referenceService.campaignType = campaign[7];
    let campaignId = campaign[0];
    let campaignTitle = campaign[8];
    let encodedCampaignId = this.referenceService.encodePathVariable(campaignId);
    let encodedTitle = this.referenceService.getEncodedUri(campaignTitle);
    this.router.navigate(['/home/campaigns/'+encodedCampaignId+'/'+encodedTitle+'/details']);
  }

  showSubmitDealSuccess() {
    this.showDealForm = false;
    this.customResponse = new CustomResponse('SUCCESS', "Deal Submitted Successfully", true);
  }

  closeDealForm() {
    this.showDealForm = false;
  }

  showSubmitLeadSuccess() {
    this.showLeadForm = false;
    this.customResponse = new CustomResponse('SUCCESS', "Lead Submitted Successfully", true);
  }

  closeLeadForm() {
    this.showLeadForm = false;
  }

  getSelectedIndexFromPopup(event:any){
    this.ngxLoading = true;
    let self = this;
    setTimeout(function() {
    self.ngxLoading = false;
    self.applyFilter = event['selectedOptionIndex'] == 1;
    }, 500);
  }

  

 

    saveDownloadRequest(allowDuplicateRequest:boolean){
        $('#hla-adv-dashboard').addClass('download-loader');
        this.downloadRequestCustomResponse = new CustomResponse();
        this.downloadRequestDto = new DownloadRequestDto();
        this.downloadRequestDto.userId = this.loggedInUserId;
        this.downloadRequestDto.applyFilter = this.applyFilter;
        this.downloadRequestDto.allowDuplicateRequest = allowDuplicateRequest;
        this.dashBoardService.saveHighLevelAnalyticsDownloadRequest(this.downloadRequestDto).
        subscribe(
            response=>{
                let statusCode = response.statusCode;
                if(statusCode==200){
                    this.downloadRequestButtonClicked = false;
                    this.downloadRequestCustomResponse = new CustomResponse('INFO',this.properties.downloadRequestNotificationMessage,true);
                    $('#hla-adv-dashboard').removeClass('download-loader');
                }else if(statusCode==419){
                    this.showSweetAlert = true;
                }
            },error=>{
                $('#hla-adv-dashboard').removeClass('download-loader');
                this.downloadRequestButtonClicked = false;
                this.downloadRequestCustomResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
            }
        );
    }

    saveDuplicateDownloadRequest(event:boolean){
        $('#hla-adv-dashboard').removeClass('download-loader');
        this.downloadRequestButtonClicked = false;
        if(event){
            this.saveDownloadRequest(event);
        }
        this.showSweetAlert = false;
    }
    
    getMainContent(userId:number){
        this.dashBoardService.getTopNavigationBarCustomSkin(this.vanityLoginDto).subscribe(
          (response) =>{
           let cskinMap  = response.data;
           this.skin  = cskinMap.MAIN_CONTENT;
        }
        )
        
    }
    setManageDam(event: any) {
        let input = event;
        let editVideo = input['editVideo'];
        let playVideo = input['playVideo'];
        if (editVideo) {
            this.editVideo = editVideo;
            this.videoFileService.saveVideoFile = input['videoFile'];
            this.videoFileService.actionValue = 'Update';
        } else if (playVideo) {
          this.playVideo = playVideo;
            this.videoFileService.saveVideoFile = input['videoFile'];
            this.videoFileService.actionValue = 'Update';
        }
    }

    update(videoFile: any) {
        if (videoFile != null) {
            this.referenceService.isAssetDetailsUpldated = true;
        }
        this.referenceService.goToRouter("home/dam/manage");
    }

    goToDam() {
        this.referenceService.goToRouter("/home/dam/manage");
    }

    /***** XNFR-860 *****/
    ngAfterViewInit() {
        this.templates = [
            { name: 'dashBoardImages', ref: this.dashBoardImages, index: 1, title: '' },
            { name: 'moduleAnalytics', ref: this.moduleAnalytics, index: 2, title: '' },
            { name: 'newsAndAnnouncement', ref: this.newsAndAnnouncement, index: 3, title: '' },
            { name: 'dashBoardButtons', ref: this.dashBoardButtons, index: 4, title: '' },
            { name: 'opportunityStats', ref: this.opportunityStats, index: 5, title: '' },
            { name: 'vendorActivityAnalytics', ref: this.vendorActivityAnalytics, index: 6, title: '' },
            { name: 'campaignsGrid', ref: this.campaignsGrid, index: 7, title: '' },
            { name: 'campaignStatistics', ref: this.campaignStatistics, index: 8, title: '' },
            { name: 'partnerStatistics', ref: this.partnerStatistics, index: 9, title: '' },
            { name: 'redistributedCampaigns', ref: this.redistributedCampaigns, index: 10, title: '' },
            { name: 'regionalStatistics', ref: this.regionalStatistics, index: 11, title: '' },
            { name: 'prmMdfStatistics', ref: this.prmMdfStatistics, index: 12, title: '' },
            { name: 'prmContent', ref: this.prmContent, index: 13, title: '' },
            { name: 'prmAssets', ref: this.prmAssets, index: 14, title: '' },
            { name: 'prmSharedAssets', ref: this.prmSharedAssets, index: 15, title: '' },
            { name: 'prmTracks', ref: this.prmTracks, index: 16, title: '' },
            { name: 'prmSharedTracks', ref: this.prmSharedTracks, index: 17, title: '' },
            { name: 'prmPlayBooks', ref: this.prmPlayBooks, index: 18, title: '' },
            { name: 'prmSharedPlayBooks', ref: this.prmSharedPlayBooks, index: 19, title: '' },
            { name: 'leadAndDealStatistics', ref: this.leadAndDealStatistics, index: 20, title: '' },
            { name: 'highLevelAnalytics', ref: this.highLevelAnalytics, index: 21, title: '' },
        ];
        this.findDefaultDashboardSettings();
        this.findCustomDashboardLayout();
        this.setUpDragEndSubscription();

    }

    /***** XNFR-860 *****/
    setUpDragEndSubscription() {
        this.dragulaService.dragend.subscribe(() => {
            if (this.dragContainer && this.dragContainer.nativeElement) {
                const newOrder: any[] = [];
                const children = this.dragContainer.nativeElement.children;
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    const templateName = child.id;
                    const template = this.templates.find(t => t.name === templateName);
                    if (template) {
                        newOrder.push(template);
                    } else {
                        this.defaultDashboardLayout.forEach(layout => {
                            if (layout.title === templateName) {
                                newOrder.push(layout);
                            }
                        });
                    }
                }
                this.defaultDashboardLayout = [...newOrder];
                if (!this.isDestroyed) {
                    this.cdr.detectChanges();
                }
            } else {
                console.log("dragContainer or nativeElement is not yet available.");
            }
        });
    }

    /***** XNFR-860 *****/
    findCustomDashboardLayout() {
        this.ngxLoading = true;
        this.defaultDashboardLayout = [];
        $('[data-toggle="tooltip"]').tooltip('hide');
        this.dashBoardService.findCustomDashboardLayout(this.vendorCompanyProfileName)
            .subscribe((response) => {
                if (response) {
                    response.forEach((dashboardLayoutDto, i) => {
                        const matchingTemplate = this.templates.find(template => dashboardLayoutDto.divName === template.name);
                        if (matchingTemplate) {
                            this.defaultDashboardLayout.push(matchingTemplate);
                        } else {
                            this.defaultDashboardLayout.push({
                                name: '', ref: '', index: i + 1, title: dashboardLayoutDto.title,
                                htmlBody: this.sanitizedHtml(dashboardLayoutDto.htmlBody),
                                leftHtmlBody: this.sanitizedHtml(dashboardLayoutDto.leftHtmlBody),
                                rightHtmlBody: this.sanitizedHtml(dashboardLayoutDto.rightHtmlBody),
                                customHtmlBlockId: dashboardLayoutDto.customHtmlBlockId, titleVisible: dashboardLayoutDto.titleVisible
                            });
                        }
                    });
                    if (!this.isDestroyed) {
                        this.cdr.detectChanges();
                    }
                    console.log('Updated Default Dashboard Layout:', this.defaultDashboardLayout);
                } else {
                    this.defaultDashboardLayout = this.templates.map(template => ({ ...template }));
                }
                this.ngxLoading = false;
            }, (error) => {
                console.log(error);
                this.ngxLoading = false;
                this.defaultDashboardLayout = this.templates.map(template => ({ ...template }));
            });
    }

    /***** XNFR-860 *****/
    customizeDashboardLayout() {
        this.ngxLoading = true;
        this.isDraggingEnabled = true;
        $('[data-toggle="tooltip"]').tooltip('hide');
        setTimeout(() => {
            this.ngxLoading = false;
        }, 200);
    }

    /***** XNFR-860 *****/
    updateCustomDashBoardLayout() {
        this.ngxLoading = true;
        const dashboardLayoutDtos = this.defaultDashboardLayout.map(template => ({
            divId: template.index, divName: template.name,
            title: template.title, customHtmlBlockId: template.customHtmlBlockId
        }));
        const customDashboardLayout = {
            userId: this.loggedInUserId,
            ids: this.customHtmlBlockIds,
            companyProfileName: this.vendorCompanyProfileName,
            dashboardLayoutDTOs: dashboardLayoutDtos
        };
        this.welcomeCustomResponse = new CustomResponse();
        this.dashBoardService.updateCustomDashBoardLayout(customDashboardLayout).subscribe((response) => {
            if (response.statusCode == 200) {
                this.isDraggingEnabled = false;
                this.welcomeCustomResponse = new CustomResponse('SUCCESS', response.message, true);
                $('[data-toggle="tooltip"]').tooltip('hide');
            } else {
                this.isDraggingEnabled = true;
                this.welcomeCustomResponse = new CustomResponse('ERROR', response.message, true);
            }
            this.ngxLoading = false;
        }, (error) => {
            console.log(error);
            this.ngxLoading = false;
            this.isDraggingEnabled = true;
            this.welcomeCustomResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        });
    }

    /***** XNFR-860 *****/
    findDefaultDashboardSettings() {
        if (this.vendorCompanyProfileName) {
            this.dashBoardService.findDefaultDashboardSettings(this.vendorCompanyProfileName).subscribe((response) => {
                this.defaultDashboardsettings = response.data;
            }, error => {
                console.log(error);
                this.defaultDashboardsettings = false;
            });
        }
    }

    sanitizedHtml(htmlBody: string) {
        if (htmlBody) {
            return this.sanitizer.bypassSecurityTrustHtml(htmlBody);
        }
    }

    remove(template: any) {
        this.customHtmlBlockIds.push(template.customHtmlBlockId);
        const indexToRemove = this.defaultDashboardLayout.findIndex(layout => layout.title === template.title);
        if (indexToRemove !== -1) {
            this.defaultDashboardLayout.splice(indexToRemove, 1);
        }
    }

    edit(template: any) {
        this.customHtmlBlockId = template.customHtmlBlockId;
        this.customModalPopup = true;
    }

    reLoadLayout(event: any) {
        this.customModalPopup = false;
        if (event) {
            this.referenceService.scrollSmoothToTop();
            this.findCustomDashboardLayout();
        }
    }

}
