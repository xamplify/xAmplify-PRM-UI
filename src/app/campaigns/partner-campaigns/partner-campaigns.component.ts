import { Component, OnInit, OnDestroy,ViewChild,Renderer } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignService } from '../services/campaign.service';
import { SocialService } from '../../social/services/social.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Campaign } from '../models/campaign';
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
import {AddMoreReceiversComponent} from '../add-more-receivers/add-more-receivers.component';
import {ModulesDisplayType } from 'app/util/models/modules-display-type';
import {Properties} from 'app/common/models/properties';
declare var $,swal: any;

@Component({
    selector: 'app-partner-campaigns',
    templateUrl: './partner-campaigns.component.html',
    styleUrls: ['./partner-campaigns.component.css'],
    providers: [Pagination, HttpRequestLoader,LandingPageService,Properties]
})
export class PartnerCampaignsComponent implements OnInit,OnDestroy {
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
    loadingEmailTemplate: boolean =false;
    isListView: boolean = false;
    isFolderGridView:boolean  = false;
    isGridView:boolean = false;
    categoryId:number = 0;
    exportObject:any = {};
    modulesDisplayType = new ModulesDisplayType();
    socialCampaign: any;
    socialAccountsLoader: boolean;

    constructor(private campaignService: CampaignService, private router: Router, private xtremandLogger: XtremandLogger,
        public pagination: Pagination, private pagerService: PagerService, public utilService:UtilService,
        public referenceService: ReferenceService, private socialService: SocialService,
        public authenticationService: AuthenticationService,private route: ActivatedRoute,private emailTemplateService:EmailTemplateService,
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
        this.modulesDisplayType = this.referenceService.setDefaultDisplayType(this.modulesDisplayType);
    }
    showMessageOnTop() {
        $(window).scrollTop(0);
    }

    listCampaign(pagination: Pagination) {
        this.referenceService.startLoader(this.httpRequestLoader);
        if(this.campaignType=="regular"){
            pagination.campaignType = "REGULAR";
        }else if(this.campaignType=="video"){
            pagination.campaignType="VIDEO";
        }else if(this.campaignType=="social"){
            pagination.campaignType = "SOCIAL";
        }else if(this.campaignType=="event"){
          pagination.campaignType = "EVENT";
        }else if(this.campaignType=="page" || this.campaignType=="landingPage"){
            pagination.campaignType = "LANDINGPAGE";
        }
        else{
            pagination.campaignType = "NONE";
        }
        if ( this.role == "Vendor" ) {
            pagination.filterValue = this.referenceService.vendorDetails.id;
            pagination.filterKey = "customerId";
        }else{
            pagination.filterValue = null;
            pagination.filterKey = null;
            // Added by Vivek for Vanity URL Partner Campaings
            if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
                pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
                pagination.vanityUrlFilter = true;
            }
        }
        this.campaignService.listPartnerCampaigns(this.pagination,this.superiorId)
          .subscribe(
            data => {
               if(data.access){
                this.authenticationService.sessinExpriedMessage = "";
                this.campaigns = data.campaigns;
                $.each(this.campaigns,function(index:number,campaign:any){
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
            () => this.xtremandLogger.info("Finished listPartnerCampaigns()", this.campaigns)
            );
    }

    setPage(event) {
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

    // getNumberOfItemsPerPage(items: any) {
    //     this.itemsSize = items;
    //     this.getAllFilteredResults(this.pagination);
    // }
    getAllFilteredResults(pagination: Pagination) {
      //  this.pagination.pageIndex = 1;
        this.pagination.searchKey = this.searchKey;
        this.pagination = this.utilService.sortOptionValues(this.selectedSortedOption, this.pagination);
        // let sortedValue = this.selectedSortedOption.value;
        // if (sortedValue != "") {
        //     let options: string[] = sortedValue.split("-");
        //     this.pagination.sortcolumn = options[0];
        //     this.pagination.sortingOrder = options[1];
        // }
        // if (this.itemsSize.value == 0) {
        //     this.pagination.maxResults = this.pagination.totalRecords;
        // } else {
        //     this.pagination.maxResults = this.itemsSize.value;
        // }
        this.listCampaign(this.pagination);
    }

    eventHandler(event){ if(event===13){ this.searchCampaigns();}}

    ngOnInit() {
        try {
            if(this.router.url.endsWith('/')){
                this.setViewType('Folder-Grid');
            }else{
                this.pagination.pageIndex = 1;
                this.campaignType = this.route.snapshot.params['type'];
                this.categoryId = this.route.snapshot.params['categoryId'];
                if(this.categoryId!=undefined){
                    this.pagination.categoryId = this.categoryId;
                    this.pagination.categoryType = 'c';
                }
                let showList = this.modulesDisplayType.isListView || this.modulesDisplayType.isGridView || this.categoryId!=undefined;
                if(showList || this.campaignType!="all"){
                    if(!this.modulesDisplayType.isListView && !this.modulesDisplayType.isGridView){
                        this.modulesDisplayType.isListView = true;
                        this.modulesDisplayType.isGridView = false;
                    }
                    this.modulesDisplayType.isFolderListView = false;
                    this.modulesDisplayType.isFolderGridView = false;
                    this.listCampaign(this.pagination);
                }else if(this.modulesDisplayType.isFolderGridView){
                    this.setViewType('Folder-Grid');
                }else if(this.modulesDisplayType.isFolderListView){
                    this.setViewType('Folder-List');
                }
            }
           
        } catch (error) {
            this.xtremandLogger.error("error in partner-campaigns.component.ts init() ", error);
        }
    }
   
    filterCampaigns(type: string) {
        if ( this.role == "Vendor" ) {
            this.router.navigate( ['/home/campaigns/vendor/' + type] );
        } else {
            if(type=="landingPage"){
                type = "page";
            }
            if(this.router.url.indexOf("/partner/f/")>-1){
                this.router.navigate( ['/home/campaigns/partner/f/'+this.categoryId+'/' + type] );
            }else{
                this.router.navigate( ['/home/campaigns/partner/' + type] );
            }
            
        }
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
            error => {
                    this.customResponse = new CustomResponse("ERROR","This campaign cannot be redistributed.Please contact admin",true);
                    
                },
            () => console.log()
            );
    }
    reDistributeCampaign(campaign:any){
        this.authenticationService.sessinExpriedMessage = "";
        this.customResponse = new CustomResponse();
        this.referenceService.goToTop();
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
            this.navigateToManageSection(viewType);    
        }else if("Grid"==viewType){
            this.modulesDisplayType.isListView = false;
            this.modulesDisplayType.isGridView = true;
            this.modulesDisplayType.isFolderGridView = false;
            this.modulesDisplayType.isFolderListView = false;
            this.navigateToManageSection(viewType);    
        }else if("Folder-Grid"==viewType){
            this.modulesDisplayType.isListView = false;
            this.modulesDisplayType.isGridView = false;
            this.modulesDisplayType.isFolderGridView = true;
            this.modulesDisplayType.isFolderListView = false;
            this.exportObject['type'] = 5;
            this.exportObject['folderType'] = viewType;
            this.exportObject['partnerCompanyId'] = this.referenceService.companyId;
            if(this.categoryId>0){
                this.router.navigateByUrl('/home/campaigns/partner/all/');
            }
            
        }else if("Folder-List"==viewType){
            this.modulesDisplayType.isListView = false;
            this.modulesDisplayType.isGridView = false;
            this.modulesDisplayType.isFolderGridView = false;
            this.modulesDisplayType.isFolderListView = true;
			this.exportObject['folderType'] = viewType;
            this.exportObject['type'] = 5;
            this.exportObject['partnerCompanyId'] = this.referenceService.companyId;
        }
    }


    navigateToManageSection(viewType:string){
        if("List"==viewType && (this.categoryId==undefined || this.categoryId==0)){
            this.modulesDisplayType.isListView = true;
            this.modulesDisplayType.isGridView = false;
            this.modulesDisplayType.isFolderGridView = false;
            this.modulesDisplayType.isFolderListView = false;
            this.listCampaign(this.pagination);
        }else if("Grid"==viewType && (this.categoryId==undefined || this.categoryId==0)){
            this.modulesDisplayType.isGridView = true;
            this.modulesDisplayType.isFolderGridView = false;
            this.modulesDisplayType.isFolderListView = false;
            this.modulesDisplayType.isListView = false;
            this.listCampaign(this.pagination);
        }else if(this.modulesDisplayType.defaultDisplayType=="FOLDER_GRID" || this.modulesDisplayType.defaultDisplayType=="FOLDER_LIST"
                 &&  (this.categoryId==undefined || this.categoryId==0)){
           this.modulesDisplayType.isFolderGridView = false;
           this.modulesDisplayType.isFolderListView = false;
           if("List"==viewType){
            this.modulesDisplayType.isGridView = false;
            this.modulesDisplayType.isListView = true;
           }else{
            this.modulesDisplayType.isGridView = true;
            this.modulesDisplayType.isListView = false;
           }
           this.listCampaign(this.pagination);
        }else if(this.router.url.endsWith('/')){
            this.router.navigateByUrl('/home/campaigns/partner/all');
        }
    }


    getUpdatedValue(event:any){
        let viewType = event.viewType;
        if(viewType!=undefined){
            this.setViewType(viewType);
        }
        
    }

    downloadFile(campaign:any,type:string){
        this.customResponse = new CustomResponse();
        this.ngxloading = true;
        this.authenticationService.checkPartnerAccess(this.loggedInUserId)
        .subscribe(
            data => {
                let access = data.access;
                this.ngxloading = false;
                if(access){
                    window.open(this.authenticationService.REST_URL+"campaign/download/"+campaign.campaignId+"/"+this.loggedInUserId+"/"+type+"?access_token="+this.authenticationService.access_token,"_blank");
                }else{
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
    
}
