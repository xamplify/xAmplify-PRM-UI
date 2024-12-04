import { Component, OnInit, OnDestroy,ViewChild,Renderer,Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignService } from 'app/campaigns/services/campaign.service';
import { SocialService } from '../../social/services/social.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Campaign } from 'app/campaigns/models/campaign';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { EmailTemplateService } from '../../email-template/services/email-template.service';
import { UtilService } from 'app/core/services/util.service';
import {PreviewLandingPageComponent} from '../../landing-pages/preview-landing-page/preview-landing-page.component';
import { LandingPageService } from '../../landing-pages/services/landing-page.service';
import { SenderMergeTag } from '../../core/models/sender-merge-tag';
import {AddMoreReceiversComponent} from 'app/campaigns/add-more-receivers/add-more-receivers.component';
import {ModulesDisplayType } from 'app/util/models/modules-display-type';
import {VanityURLService} from 'app/vanity-url/services/vanity.url.service';
import { CampaignTemplateDownloadHistoryComponent } from 'app/campaigns/campaign-template-download-history/campaign-template-download-history.component';
import { CampaignAccess } from 'app/campaigns/models/campaign-access';
import { SweetAlertParameterDto } from 'app/common/models/sweet-alert-parameter-dto';
import { Properties } from 'app/common/models/properties';

declare var $:any,swal: any;

@Component({
  selector: 'app-redistribute-campaigns-list-view-util',
  templateUrl: './redistribute-campaigns-list-view-util.component.html',
  styleUrls: ['./redistribute-campaigns-list-view-util.component.css','../../campaigns/partner-campaigns/partner-campaigns.component.css'],
  providers: [Pagination, HttpRequestLoader,LandingPageService,CampaignAccess,Properties]
})
export class RedistributeCampaignsListViewUtilComponent implements OnInit,OnDestroy {

  ngxloading: boolean;
  campaigns: Campaign[];
  pager: any = {};
  pagedItems: any[];
  totalRecords = 1;
  searchKey = "";
  campaignSuccessMessage = "";
  superiorId = 0;
  loggedInUserId = 0;
  campaignName:string;
  sortByDropDown = [
      { 'name': 'Sort By', 'value': 'createdTime-DESC' },
      { 'name': 'Campaign Name (A-Z)', 'value': 'campaign-ASC' },
      { 'name': 'Campaign Name (Z-A)', 'value': 'campaign-DESC' },
      { 'name': 'Company Name (A-Z)', 'value': 'company-ASC' },
      { 'name': 'Company Name (Z-A)', 'value': 'company-DESC' },
      { 'name': 'Date Received (ASC)', 'value': 'createdTime-ASC' },
      { 'name': 'Date Received (DESC)', 'value': 'createdTime-DESC' }
  ];

  numberOfItemsPerPage = [
      { 'name': '12', 'value': '12' },
      { 'name': '24', 'value': '24' },
      { 'name': '48', 'value': '48' },
      { 'name': 'All', 'value': '0' },
  ]

  public selectedSortedOption: any = this.sortByDropDown[0];
  public itemsSize: any = this.numberOfItemsPerPage[0];
  public isError: boolean = false;
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  campaignType:string;
  role = '';
  customResponse: CustomResponse = new CustomResponse();
  senderMergeTag:SenderMergeTag = new SenderMergeTag();
  @ViewChild('previewLandingPageComponent') previewLandingPageComponent: PreviewLandingPageComponent;
  @ViewChild('addMoreReceivers') adddMoreReceiversComponent: AddMoreReceiversComponent;
  @ViewChild('campaignTemplateDownloadHistoryComponent') campaignTemplateDownloadHistoryComponent: CampaignTemplateDownloadHistoryComponent;
  loadingEmailTemplate: boolean =false;
  isListView: boolean = false;
  isFolderGridView:boolean  = false;
  isGridView:boolean = false;
  categoryId:number = 0;
  exportObject:any = {};
  modulesDisplayType = new ModulesDisplayType();
  @Input() folderListViewInput:any;
  @Output() updatedItemsCount = new EventEmitter();
  socialAccountsLoader  =false;
  socialCampaign: any;
  campaignAccess:CampaignAccess = new CampaignAccess();
  showSweetAlert = false;
  sweetAlertParameterDto:SweetAlertParameterDto = new SweetAlertParameterDto();
  oneClickLaunchParentCampaignId = 0;
  constructor(private campaignService: CampaignService, private router: Router, private xtremandLogger: XtremandLogger,
      public pagination: Pagination, private pagerService: PagerService, public utilService:UtilService,
      public referenceService: ReferenceService, private socialService: SocialService,
      public authenticationService: AuthenticationService,private emailTemplateService:EmailTemplateService,
      public renderer:Renderer,public properties:Properties) {
      this.referenceService.renderer = this.renderer;
      let superiorId = parseInt(localStorage.getItem('superiorId'));
      if(isNaN(superiorId)){
          this.superiorId = this.authenticationService.getUserId();
      }else{
          this.superiorId = superiorId;
      }
      this.loggedInUserId = this.authenticationService.getUserId();
      this.referenceService.manageRouter = false;
      const currentUrl = this.router.url;
      if ( currentUrl.includes( 'campaigns/vendor' ) ) {
          this.role = "Vendor"
      } else {
          this.role = "Partner"
      }
      this.modulesDisplayType.isListView = true;
  }
  showMessageOnTop() {
      $(window).scrollTop(0);
  }

  listCampaign(pagination: Pagination) {
      this.referenceService.startLoader(this.httpRequestLoader);
      if ( this.role == "Vendor" ) {
          pagination.filterValue = this.referenceService.vendorDetails.id;
          pagination.filterKey = "customerId";
      }else{
          pagination.filterValue = null;
          pagination.filterKey = null;
      }
      if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
        this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
        this.pagination.vanityUrlFilter = true;
    }
      this.campaignService.listPartnerCampaigns(this.pagination,this.superiorId)
        .subscribe(
          data => {
              if(data.access){
                this.campaigns = data.campaigns;
                $.each(this.campaigns,function(index,campaign){
                    campaign.displayTime = new Date(campaign.utcTimeInString);
                });
                this.totalRecords = data.totalRecords;
                pagination.totalRecords = data.totalRecords;
                pagination = this.pagerService.getPagedItems(pagination, data.campaigns);
                this.referenceService.stopLoader(this.httpRequestLoader);
              }else{
                this.authenticationService.forceToLogout();
              }
           
          },
          error => {
              this.xtremandLogger.errorPage(error);
          },
          () => {this.callFolderListViewEmitter()}
          );
  }

  callFolderListViewEmitter() {
    this.exportObject['categoryId'] = this.categoryId;
    this.exportObject['itemsCount'] = this.pagination.totalRecords;	
    this.updatedItemsCount.emit(this.exportObject);
}

  setPage(event:any) {
      this.pagination.pageIndex = event.page;
      this.listCampaign(this.pagination);
  }

  searchCampaigns() {
      this.getAllFilteredResults(this.pagination);
  }

  getSortedResult(text: any) {
      this.selectedSortedOption = text;
      this.getAllFilteredResults(this.pagination);
  }


  getAllFilteredResults(pagination: Pagination) {
      this.pagination.searchKey = this.searchKey;
      this.pagination = this.utilService.sortOptionValues(this.selectedSortedOption, this.pagination);
      this.listCampaign(this.pagination);
  }

  eventHandler(event){ if(event===13){ this.searchCampaigns();}}

  ngOnInit() {
      try {
        this.getCampaignTypes();
      } catch (error) {
          this.xtremandLogger.error("error in partner-campaigns.component.ts init() ", error);
      }
  }

  getCampaignTypes(){
    this.referenceService.startLoader(this.httpRequestLoader);
      this.campaignService.getCampaignTypes().subscribe(
        response=>{
            let campaignAccess = response.data;
            this.campaignAccess.emailCampaign = campaignAccess.regular;
            this.campaignAccess.videoCampaign = campaignAccess.video;
            this.campaignAccess.socialCampaign = campaignAccess.social;
            this.campaignAccess.eventCampaign = campaignAccess.event;
            this.campaignAccess.landingPageCampaign = campaignAccess.page;
            this.campaignAccess.survey = campaignAccess.survey;
        },_error=>{
            this.referenceService.showSweetAlertErrorMessage("Unable to fetch campaign types");
            this.referenceService.stopLoader(this.httpRequestLoader);
        },()=>{
            this.referenceService.stopLoader(this.httpRequestLoader);
            this.pagination.pageIndex = 1;
            this.campaignType = "all";
           if(this.folderListViewInput!=undefined){
             this.categoryId = this.folderListViewInput['categoryId'];
             }
           if(this.categoryId!=undefined){
               this.pagination.categoryId = this.categoryId;
               this.pagination.categoryType = 'c';
           }
           this.listCampaign(this.pagination);
        }
      );
  }
 
  filterCampaigns(type: string) {
      this.campaignType = type;
    if(this.campaignType=="regular"){
        this.pagination.campaignType = "REGULAR";
    }else if(this.campaignType=="video"){
        this.pagination.campaignType="VIDEO";
    }else if(this.campaignType=="social"){
        this.pagination.campaignType = "SOCIAL";
    }else if(this.campaignType=="event"){
        this.pagination.campaignType = "EVENT";
    }else if(this.campaignType=="page" || this.campaignType=="landingPage"){
        this.pagination.campaignType = "LANDINGPAGE";
    }else if(this.campaignType=="survey"){
        this.pagination.campaignType = "SURVEY";
    }else{
        this.pagination.campaignType = "NONE";
    }
    this.listCampaign(this.pagination);
  }

  showCampaignPreview(campaign:any){
      this.loadingEmailTemplate = true;
      this.campaignName = campaign.campaignName;
      let htmlContent = "#email-template-content";
      $(htmlContent).empty();
      $('.modal .modal-body').css('overflow-y', 'auto');
      $("#email_template_preivew").modal('show');
      $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
      this.campaignService.getPartnerTemplatePreview(campaign.campaignId, this.authenticationService.getUserId()).subscribe(
          (response: any) => {
              if (response.statusCode == 200) {
                  let emailTemplateBody = response.data;
                  $(htmlContent).append(emailTemplateBody);
                  this.loadingEmailTemplate = false;
              } else {
                  swal("Please Contact Admin!", "No Template Found", "error");
                  $("#email_template_preivew").modal('hide');
              }
          },
          (error: any) => {
              swal("Please Contact Admin!", "Unable to load  template", "error"); 
              this.loadingEmailTemplate = false;
              this.xtremandLogger.log(error);
              $("#email_template_preivew").modal('hide');
          });
  }
  getCampaignById(campaignId) {
      //this.ngxloading = true;
      var obj = { 'campaignId': campaignId }
      this.campaignService.getCampaignById( obj )
        .subscribe(
            data => {
       if(data.campaignTypeInString=='LANDINGPAGE'){
           console.log(data);
                  let landingPage = data.landingPage;
                  if(landingPage!=undefined){
                      landingPage.showPartnerCompanyLogo = true;
                      landingPage.partnerId = this.authenticationService.getUserId();
                      this.previewLandingPageComponent.showPreview(landingPage);
                  }else{
                      swal("Page Not Found","","error");
                      this.ngxloading = false;
                  }
                  
              }else{
                  const emailTemplate = data.emailTemplate;
                  this.campaignName = data.campaignName;
                  if(emailTemplate!=undefined){
                      this.previewEmailTemplate(emailTemplate, data);
                  }else{
                      swal("EmailTemplate Not Found","","error");
                      this.ngxloading = false;
                  }

              }
            },
            error => { this.xtremandLogger.errorPage( error ) },
            () => console.log()
        );
  }
  previewEmailTemplate(emailTemplate: any, campaign:Campaign){
      this.emailTemplateService.getAllCompanyProfileImages(campaign.userId).subscribe(
          ( data: any ) => {
            let body = emailTemplate.body;
            let self  =this;
            $.each(data,function(index,value){
                body = body.replace(value, self.authenticationService.MEDIA_URL+campaign.companyLogo);
            });
            body = body.replace("https://xamp.io/vod/replace-company-logo.png", this.authenticationService.MEDIA_URL+campaign.companyLogo);
            if(this.referenceService.hasMyMergeTagsExits(body)){
                let data = {};
                data['emailId'] = this.authenticationService.userProfile.emailId;
                this.referenceService.getMyMergeTagsInfoByEmailId(data).subscribe(
                        response => {
                            if(response.statusCode==200){
                                body = this.referenceService.replaceMyMergeTags(response.data, body);
                                body = body.replace(this.senderMergeTag.aboutUsGlobal,response.data.aboutUs);
                                this.setUpdatedBody(body,emailTemplate,campaign);
                            }
                        },
                        error => {
                            this.xtremandLogger.error(error);
                            this.setUpdatedBody(body,emailTemplate,campaign);
                        }
                    );
               }else{
                   this.setUpdatedBody(body,emailTemplate,campaign);
               }
            },
            error => { this.ngxloading = false;this.xtremandLogger.error("error in getAllCompanyProfileImages("+campaign.userId+")", error); },
            () =>  this.xtremandLogger.info("Finished getAllCompanyProfileImages()")
            );

  }
  
  setUpdatedBody(body:any,emailTemplate:any,campaign:Campaign){
      emailTemplate.body = body;
      this.referenceService.previewEmailTemplate(emailTemplate, campaign);
      this.ngxloading = false;
  }

  getEventCampaignId(campaignid){
    this.campaignService.getEventCampaignById(campaignid).subscribe(
      (result)=>{
        result.data.emailTemplateDTO.body = result.data.emailTemplateDTO.body.replace( "https://aravindu.com/vod/images/us_location.png", " " );
        this.campaignName = result.data.campaign;
        
        $("#email-template-content").empty();
        $("#email-template-title").empty();
        
        let userProfile = this.authenticationService.userProfile;
        let partnerLogo = userProfile.companyLogo;
        let partnerCompanyUrl = userProfile.websiteUrl;
        if(result.data.nurtureCampaign || userProfile.id!=result.data.id){
            result.data.emailTemplateDTO.body = this.referenceService.replacePartnerLogo(result.data.emailTemplateDTO.body,partnerLogo,partnerCompanyUrl,result.data);
        }
        let body = result.data.emailTemplateDTO.body;
        let data = {};
        data['emailId'] = this.authenticationService.userProfile.emailId;
        this.referenceService.getMyMergeTagsInfoByEmailId(data).subscribe(
                response => {
                    if(response.statusCode==200){
                        body = body.replace(this.senderMergeTag.aboutUsGlobal,response.data.aboutUs);
                        this.showPreviewBody(body);
                    }
                },
                error => {
                    this.xtremandLogger.error(error);
                    this.showPreviewBody(body);
                }
            );
       });
    }
  showPreviewBody(body:string){
      $("#email-template-content").append(body);
      $('.modal .modal-body').css('overflow-y', 'auto');
      $("#email_template_preivew").modal('show');
      $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
  }

  navigateSocialCampaign(campaign:any) {
      this.socialService.getSocialCampaignByCampaignId( campaign.campaignId )
      .subscribe(
          data => {
              this.router.navigate(['/home/campaigns/social', data.socialStatusList[0].alias]);
          },
          error => { this.xtremandLogger.errorPage(error) },
          () => console.log()
          );
  }
  reDistributeCampaign(campaign:any){
      if(campaign.campaignType.indexOf('SOCIAL') > -1){
          this.navigateSocialCampaign(campaign);
      } else if(campaign.campaignType.indexOf('EVENT') > -1) {
        this.campaignService.reDistributeEvent = true;
        this.router.navigate(['/home/campaigns/re-distribute-event/'+campaign.campaignId]);
      }
      else {
      const data = { 'campaignId': campaign.campaignId,'userId':this.superiorId }
      this.campaignService.getParnterCampaignById(data)
          .subscribe(
              data => {
                  if(data.access){
                    this.campaignService.reDistributeCampaign = data;
                    this.campaignService.isExistingRedistributedCampaignName = false;
                    this.router.navigate(['/home/campaigns/re-distribute-campaign']);
                  }else{
                    this.authenticationService.forceToLogout();
                  }
                 
              },
              error => { this.xtremandLogger.errorPage(error) },
              () => console.log()
          )
      }

  }
  
  inviteMore(campaign:Campaign){
      this.adddMoreReceiversComponent.eventRedistributionMessage = "This Campaign already redistributed would you like to add more contacts?";
      this.adddMoreReceiversComponent.showPopup(campaign);
  }
  
  ngOnDestroy() {
      this.adddMoreReceiversComponent.eventRedistributionMessage = ""
  }
  setViewType(viewType:string){
      if("List"==viewType){
          this.modulesDisplayType.isListView = true;
          this.modulesDisplayType.isGridView = false;
          this.modulesDisplayType.isFolderGridView = false;
          this.modulesDisplayType.isFolderListView = false;
      }else if("Grid"==viewType){
          this.modulesDisplayType.isListView = false;
          this.modulesDisplayType.isGridView = true;
          this.modulesDisplayType.isFolderGridView = false;
          this.modulesDisplayType.isFolderListView = false;
      }
  }


 showSocialCampaignPreview(campaign:any){
        this.socialAccountsLoader = true;
        this.campaignName = campaign.campaignName;
        $('.modal .modal-body').css('overflow-y', 'auto');
        $("#social-campaign-preview").modal('show');
        $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
        this.socialService.getSocialCampaignByCampaignId(campaign.campaignId)
        .subscribe(
        data => {
          this.socialCampaign = data;
          this.socialAccountsLoader = false;
        },
        (error: any) => {
            this.socialAccountsLoader = false;
            swal("Please Contact Admin!", "Unable to show preview", "error"); 
            this.loadingEmailTemplate = false;
            this.xtremandLogger.log(error);
            $("#email_template_preivew").modal('hide');
        });
    }


    downloadFile(campaign:any,type:string){
        this.customResponse = new CustomResponse();
        this.ngxloading = true;
        this.authenticationService.checkPartnerAccess(this.loggedInUserId)
        .subscribe(
            data => {
                let access = data.access;
                if(access){
                    let param: any = {
                        'campaignId': campaign.campaignId,
                        'loggedInUserId': this.loggedInUserId,
                        'downloadType': type
                    };
                    let completeUrl = this.authenticationService.REST_URL + "campaign/download?access_token=" + this.authenticationService.access_token;
                    this.referenceService.post(param, completeUrl);
                    this.ngxloading = false;
                }else{
                    this.ngxloading = false;
                    this.authenticationService.forceToLogout();
                }
            },
            error => {
                this.ngxloading = false;
                this.customResponse = new CustomResponse('ERROR',"Unable to download.Please try after sometime",true);
             },
            () => console.log()
        );
    }

 viewDownloadedHistory(campaign:any){
    this.campaignTemplateDownloadHistoryComponent.viewHistoryForPartners(campaign);
  }

   /**********XNFR-125*******/
  launchOneClickCampaign(campaign:any){
    this.oneClickCampaignLaunched(campaign.campaignId);
      
  }
 /**********XNFR-125*******/
  oneClickCampaignLaunched(campaignId:number){
    this.customResponse = new CustomResponse();
    this.oneClickLaunchParentCampaignId = campaignId;
    this.ngxloading = true;
    this.campaignService.isOneClickLaunchCampaignRedistributed(campaignId).
    subscribe(
        response=>{
            this.ngxloading = false;
            let map = response['map'];
            let isCampaignRedistributed = map["isCampaignRedistributed"];
            let isShareLeadListExists = map["isShareLeadListExists"];
            if(isCampaignRedistributed){
                this.customResponse = new CustomResponse("ERROR",this.properties.oneClickLaunchCampaignRedistributedErrorMessage,true);
                this.listCampaign(this.pagination);
            }else if(!isShareLeadListExists){
                this.customResponse = new CustomResponse("ERROR",this.properties.emptyOneClickLaunchCampaignErrorMessage,true);
            }else{
                this.openSweetAlert();
            }
        },error=>{
            this.oneClickLaunchParentCampaignId = 0;
            this.ngxloading = false;
            this.referenceService.showSweetAlertServerErrorMessage();
        }
    )
  }
 /**********XNFR-125*******/
  openSweetAlert(){
    this.showSweetAlert = true;
    let message = "Campaign will be redistributed to the share leads";
    this.sweetAlertParameterDto.text=message;
    this.sweetAlertParameterDto.confirmButtonText = "Yes";
  }
 /**********XNFR-125*******/
  receiveEvent(event:any){
    this.showSweetAlert = false;
      if(event){
        this.referenceService.showSweetAlertProcessingLoader('We are launching the campaign');
        let timeZoneId = this.referenceService.getBrowserTimeZone();
        let vanityUrlDomainName = "";
        let vanityUrlCampaign = false;    
        /********Vanity Url Related Code******************** */
        if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
            vanityUrlDomainName = this.authenticationService.companyProfileName;
            vanityUrlCampaign = true;
        }
        const data = {
            'userId': this.superiorId ,
            'timeZoneId': timeZoneId,
            'parentCampaignId':this.oneClickLaunchParentCampaignId,
            'vanityUrlDomainName':vanityUrlDomainName,
            'vanityUrlCampaign':vanityUrlCampaign
        }
        this.campaignService.redistributeOneClickLaunchCampaign(data)
        .subscribe(response=>{
            this.referenceService.closeSweetAlert();
            if(response.access){
                if(response.statusCode==2015){
                    this.referenceService.scrollSmoothToTop();
                    this.customResponse = new CustomResponse('ERROR',this.properties.oneClickLaunchCampaignExpiredMessage,true);
                }else if(response.statusCode==404){
                    this.customResponse = new CustomResponse('ERROR',this.properties.emptyOneClickLaunchCampaignErrorMessage,true);
                    this.referenceService.scrollSmoothToTop();
                }else{
                    this.ngxloading = true;
                    this.referenceService.campaignSuccessMessage = "NOW";
                    this.router.navigate(["/home/campaigns/manage"]);
                }
            }else{
                this.authenticationService.forceToLogout();
            }
        },error=>{
            this.referenceService.closeSweetAlert();
            this.referenceService.showSweetAlertServerErrorMessage();
        });

      }
  }

  openEmailTemplateInNewTab(campaign:any){
    this.referenceService.previewSharedVendorCampaignEmailTemplateInNewTab(campaign.campaignId);
  }
}
