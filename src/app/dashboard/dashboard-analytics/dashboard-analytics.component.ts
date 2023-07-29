import { Component, OnInit,OnDestroy } from '@angular/core';
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
import { CampaignService } from 'app/campaigns/services/campaign.service';
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
   mergeTagForGuide:any;
  constructor(public envService:EnvService,public authenticationService: AuthenticationService,public userService: UserService,
    public referenceService: ReferenceService,public xtremandLogger: XtremandLogger,public properties: Properties,public campaignService:CampaignService,
    public dashBoardService:DashboardService,public utilService:UtilService,public router:Router,private route: ActivatedRoute, private vanityURLService:VanityURLService,
    public videoFileService: VideoFileService) {

    this.loggedInUserId = this.authenticationService.getUserId();
    this.vanityLoginDto.userId = this.loggedInUserId;
    /***XNFR-134***/
    let companyProfileName = this.authenticationService.companyProfileName;
    if (companyProfileName !== undefined && companyProfileName !== "") {
      this.vanityLoginDto.vendorCompanyProfileName = companyProfileName;
      this.vanityLoginDto.vanityUrlFilter = true;
    }else{
      this.vanityLoginDto.vanityUrlFilter = false;
    }
    this.isOnlyUser = this.authenticationService.isOnlyUser();
    this.utilService.setRouterLocalStorage('dashboard');
    this.hasCampaignRole = this.referenceService.hasRole(this.referenceService.roles.campaignRole);
    this.showSandboxText = (("https://xamplify.co/"==envService.CLIENT_URL||"http://localhost:4200/"==envService.CLIENT_URL) && !this.authenticationService.vanityURLEnabled);
    
}

  ngOnInit() {
    localStorage.removeItem('assetName');
    localStorage.removeItem('campaignReport');
    localStorage.removeItem('saveVideoFile');
    this.getMergeTagForGuide();
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
  }
  getMergeTagForGuide(){
    if(this.authenticationService.isOnlyPartner()) {
      this.mergeTagForGuide = 'partner_account_dashboard';
    } else {
      this.mergeTagForGuide = 'vendor_account_dashboard';
    }
  }
  ngOnDestroy(){
    $('#customizeCampaignModal').modal('hide');
  }

  getDefaultPage(userId: number) {
    this.ngxLoading = true;
    this.userService.getUserDefaultPage(userId)
        .subscribe(
            data => {
                if (data.includes('dashboard')) {
                    this.userDefaultPage.isCurrentPageDefaultPage = true;
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
    this.referenceService.loading(this.topFourCampaignsLoader,true);
    this.referenceService.loading(this.emailStatisticsLoader,true);
    this.topFourLoading = true;  
    this.campaignService.getUserCampaignReportForVanityURL(this.dashboardAnalyticsDto)
        .subscribe(
            data => {
                this.userCampaignReport = data['userCampaignReport'];
                this.launchedCampaignsMaster = data['listLaunchedCampaingns'];
            },
            error => { 
               this.topFourLoading = false;
               this.xtremandLogger.error(error); 
              },
            () => {
                this.xtremandLogger.info('Finished getUserCampaignReport()');
                this.topFourLoading = false;
                if (this.userCampaignReport == null) {
                    this.userCampaignReport = new CampaignReport();
                    this.userCampaignReport.userId = this.loggedInUserId;
                    this.userCampaignReport.campaignReportOption = 'RECENT';
                }
                this.setLaunchedCampaignsChild(this.userCampaignReport);
                this.listCampaignInteractionsData(this.loggedInUserId, this.userCampaignReport.campaignReportOption);
            }
        ); 
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

this.campaignService.listCampaignInteractionsDataForVanityURL(this.dashboardAnalyticsDto,reportType)
    .subscribe(
        data => {
            this.topFourCampaignErrorResponse  = new CustomResponse();
            this.xtremandLogger.info(data);
            this.campaigns = data;
            this.xtremandLogger.log(data);
            this.referenceService.loading(this.topFourCampaignsLoader,false);
            const campaignIdArray = data.map(function (a) { return a[0]; });
            this.totalCampaignsCount = this.campaigns.length;
            this.referenceService.loading(this.emailStatisticsLoader,false);
                this.topFourLoading = false;
            if (this.totalCampaignsCount >= 1) {
                this.getCampaignsEamailBarChartReports(campaignIdArray);
            }else{
                this.referenceService.loading(this.emailStatisticsLoader,false);
                this.topFourLoading = false;
            }
        },
        error => { 
            this.topFourLoading = false;
            this.referenceService.showServerError(this.topFourCampaignsLoader);
            this.referenceService.showServerError(this.emailStatisticsLoader);
            this.topFourCampaignErrorResponse = new CustomResponse('ERROR','Please Contact Admin.',true);
         },
        () => this.xtremandLogger.info('Finished listCampaign()')
    );
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
  if (userCampaignReport.userId == null) {
      userCampaignReport.userId = this.loggedInUserId;
  }
  this.campaignService.saveUserCampaignReport(userCampaignReport)
      .subscribe(
          data => {
              this.userCampaignReport = data;
              this.setCampaignReportResponse('SUCCESS', 'Campaign Report Option saved successfully.');
              this.listCampaignInteractionsData(userCampaignReport.userId, userCampaignReport.campaignReportOption);
          },
          error => {
              this.setCampaignReportResponse('ERROR', 'An Error occurred while saving the details.');
          },
          () => this.xtremandLogger.info('Finished saveUserCampaignReport()')
      );
}

setCampaignReportResponse(response: string, responseMessage: string) {
  this.userCampaignReport.response = response;
  this.userCampaignReport.responseMessage = responseMessage;
}

onSelectionChangeCampaignReportOption(userCampaignReportOption: string) {
    this.userCampaignReport.campaignReportOption = userCampaignReportOption;
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

// refreshCampaignBarcharts() {
//     this.getCampaignsEamailBarChartReports();
// }

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
    this.router.navigate(['/home/campaigns/'+campaign[0]+'/details']);
  }

  showSubmitDealSuccess() {
    this.showDealForm = false;
    this.customResponse = new CustomResponse('SUCCESS', "Deal Submitted Successfully", true);
  }

  closeDealForm() {
    this.showDealForm = false;
  }

  showSubmitLeadSuccess() {
    this.customResponse = new CustomResponse('SUCCESS', "Lead Submitted Successfully", true);
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
           console.log(this.skin);
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
      
      
}
