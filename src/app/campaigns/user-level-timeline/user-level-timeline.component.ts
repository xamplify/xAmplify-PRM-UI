import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/*****Common Imports**********************/
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
import { PagerService } from 'app/core/services/pager.service';
import { CampaignService } from 'app/campaigns/services/campaign.service';
import { DealRegistrationService } from '../../deal-registration/services/deal-registration.service';
import { LeadsService } from 'app/leads/services/leads.service';
import { Roles } from 'app/core/models/roles';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';


@Component({
  selector: 'app-user-level-timeline',
  templateUrl: './user-level-timeline.component.html',
  styleUrls: ['./user-level-timeline.component.css','../analytics/timeline.css','../analytics/detailed-campaign-analytics/detailed-campaign-analytics.component.css']
})
export class UserLevelTimelineComponent implements OnInit {

  campaignType:string = "";
  userType:string;
  campaignId:any;
  selectedUserId:any;
  redistributedAccountsBySelectedUserId = [];
  loading = false;
  dataLoader = false;
  userLevelCampaignAnalyticsDTO = {};
  emailLogs:Array<any> = new Array<any>();
  campaignDetails = {};
  enableLeads = false;
  createdBySelf = false;
  disabled = false;
  dealButtonText: string = "";
  isDeal = false;
  isDealRegistration = false;
  isDealPreview = false;
  dealId: any;
  leadData: any;
  selectedRow={};
  previousRouterAlias: string;
  navigatedFrom:string;
  analyticsCampaignId:number;
  loggedInUserId: number = 0;
  showRegisterLeadButton = false;
  leadActionType = "add";
  leadId = 0;
  registerLeadButtonError = false;
  campaignName: any;
  showLeadForm: boolean = false;
  showUserLevelTimeLine: boolean = true;
  roleName: Roles = new Roles();
  isOrgAdmin: boolean = false;
  campaignTitle = "";
  canPartnerEditLead:boolean = true;
  /**XNFR-735**/
  isFromContactDetails: boolean = false;
  userListId: number = 0;
  isFromCampaignList:boolean = false;
  isFromEditContacts: boolean;
  /**XNFR-848**/
  isCompanyJourney: boolean = false;
  isFromCompanyJourneyEditContacts: boolean = false;
  companyJourneyId: any;
  constructor(private route: ActivatedRoute,private campaignService:CampaignService, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, private leadsService: LeadsService) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.loading = true;
    this.dataLoader = true;
    this.userType = this.route.snapshot.params['type'];
    this.navigatedFrom = this.route.snapshot.params['navigatedFrom'];
    this.campaignTitle = this.route.snapshot.params['campaignTitle'];
    this.previousRouterAlias = this.userType;
		if(this.userType=="pa" || this.userType=="pm"){
			this.userType = "p";
		}
    this.selectedUserId = this.referenceService.decodePathVariable(this.route.snapshot.params['userId']);
    this.campaignId = this.referenceService.decodePathVariable(this.route.snapshot.params['campaignId']);
	  let analyticsCampaignIdParam = this.route.snapshot.params['analyticsCampaignId'];
    if(analyticsCampaignIdParam!=undefined){
      this.analyticsCampaignId = this.referenceService.decodePathVariable(analyticsCampaignIdParam);
    }
    this.validateCampaignIdAndUserId(this.campaignId,this.selectedUserId);
    const roles = this.authenticationService.getRoles();
    if (roles.indexOf(this.roleName.orgAdminRole) > -1) {
      this.isOrgAdmin = true;
    }
    if (this.navigatedFrom == "cd" || this.navigatedFrom == "ccd" || this.navigatedFrom == "mcd" || this.navigatedFrom == "cjcd"  || this.navigatedFrom == "fcjcd") {
      this.isFromContactDetails = true;
      this.userListId = this.referenceService.decodePathVariable(this.route.snapshot.params['userListId']);
      this.companyJourneyId = this.referenceService.decodePathVariable(this.route.snapshot.params['companyId']);
      let parentNavigation = this.route.snapshot.params['parent'];
      if (parentNavigation != undefined) {
        this.isFromCampaignList = true;
      }
      if (this.navigatedFrom == "cd" || this.navigatedFrom == "ccd") {
        this.isFromEditContacts = true;
      } else if (this.navigatedFrom == "cjcd") {
        this.isCompanyJourney = true;
      } else if (this.navigatedFrom == "fcjcd") {
        this.isFromCompanyJourneyEditContacts = true;
      }
    }
  }

  validateCampaignIdAndUserId(campaignId:number,userId:number){
		this.campaignService.validateCampaignIdAndUserId(campaignId,userId).subscribe(
			response=>{
				if(response.statusCode==200){
					this.getUserLevelTimeLineSeriesData();
				}else{
					this.referenceService.goToPageNotFound();
				}
			},error=>{
				this.xtremandLogger.errorPage(error);
			}
		);
	}

  getUserLevelTimeLineSeriesData(){
    this.loading = true;
    this.dataLoader = true;
    this.campaignService.getUserLevelTimeLineSeriesData(this.campaignId,this.selectedUserId,this.userType).subscribe((result: any) => {
     let timeLineData = result.data;
     this.userLevelCampaignAnalyticsDTO = timeLineData;
     this.emailLogs = timeLineData['emailLogs'];
     this.campaignDetails = timeLineData['campaignDetais'];     
     let launchTimeInUtcString = this.campaignDetails['launchTimeInUTCString'];
     if(launchTimeInUtcString!=""){
      this.campaignDetails['displayTime'] = new Date(launchTimeInUtcString);
     }else{
      this.campaignDetails['displayTime'] = "-";
     }
     this.campaignType = this.campaignDetails['campaignType'];
     this.campaignName = this.campaignDetails['campaignName'];
     this.selectedRow['campaignId'] = this.campaignId;
     this.selectedRow['userId'] = this.selectedUserId;
     this.selectedRow['emailId'] = this.userLevelCampaignAnalyticsDTO['emailId'];
     this.selectedRow['userListId'] = this.campaignDetails['userListId'];
    }, error => {
      this.xtremandLogger.log(error);
      this.xtremandLogger.errorPage(error);
    } ,
        () => {
          this.getDealState();
          this.listautoResponseAnalyticsByCampaignAndUser();
        }
    );
  }

  listautoResponseAnalyticsByCampaignAndUser() {
    try {
      this.loading = true;
      this.dataLoader = true;
      let json = { "pageIndex": 1, "maxResults": 120, "userId": this.selectedUserId, "campaignId": this.campaignId };
      this.campaignService.listautoResponseAnalyticsByCampaignAndUser(json)
        .subscribe(result => {
          const response = result.data.data;
          response.forEach((element, index) => {
            element.time = new Date(element.sentTimeUtcString);
          });
          this.emailLogs.push(...response);
        },
          error => { this.xtremandLogger.errorPage(error);
          },
          () => {
            this.emailLogs.sort((b, a) => new Date(b.time).getTime() - new Date(a.time).getTime());
            this.loading = false;
            this.dataLoader = false;
          })
    } catch (error) { 
      this.xtremandLogger.error('Error in analytics page listautoResponseAnalyticsByCampaignAndUser' + error); 
    }
  }

  goBack(){
    this.loading = true;
    let encodedUserId = this.referenceService.encodePathVariable(this.selectedUserId);
    let encodedCampaignId = this.referenceService.encodePathVariable(this.analyticsCampaignId);
    let url = "/home/campaigns/user-campaigns/"+this.previousRouterAlias+"/"+encodedUserId;
    if (this.isFromContactDetails) {
      let baseUrl = RouterUrlConstants.home;
      let destination = '';
      let encodedUserListId = this.referenceService.encodePathVariable(this.userListId);
      if (this.isFromCampaignList) {
        destination = RouterUrlConstants.campaigns + RouterUrlConstants.userCampaigns + "c/" + encodedUserId + "/" + encodedUserListId;
        if (this.isFromEditContacts) {
          destination += (this.navigatedFrom == "ccd") ? "/" + RouterUrlConstants.ccd : "/" + RouterUrlConstants.cd;
        } else {
          destination += (this.navigatedFrom == "mccd") ? "/mccd" : "/mcd";
        }
      } else if (this.isCompanyJourney) {
        let encodedCompanyId = this.referenceService.encodePathVariable(this.companyJourneyId);
        destination = RouterUrlConstants.contacts + 'company/' + RouterUrlConstants.details + encodedUserListId + "/" + encodedUserId + "/" + encodedCompanyId;
      } else if (this.isFromCompanyJourneyEditContacts) {
        let encodedCompanyId = this.referenceService.encodePathVariable(this.companyJourneyId);
        destination = RouterUrlConstants.contacts + 'ce/' + RouterUrlConstants.details + encodedUserListId + "/" + encodedUserId + "/" + encodedCompanyId;
      } else {
        destination = RouterUrlConstants.contacts;
        if (this.isFromEditContacts) {
          let contactDetailsUrl = RouterUrlConstants.editContacts + RouterUrlConstants.details + encodedUserListId + "/" + encodedUserId;
          destination += (this.navigatedFrom == "ccd") ? RouterUrlConstants.company + contactDetailsUrl : contactDetailsUrl;
        } else {
          let contactDetailsUrl = RouterUrlConstants.manage + '/' + RouterUrlConstants.details + encodedUserListId + "/" + encodedUserId;
          destination += (this.navigatedFrom == "mccd") ? RouterUrlConstants.company + contactDetailsUrl : contactDetailsUrl;
        }
      }
      this.referenceService.goToRouter(baseUrl+destination);
    }else if(this.navigatedFrom!=undefined && encodedCampaignId==undefined){
      this.referenceService.goToRouter(url+"/"+this.navigatedFrom);
    }else if(encodedCampaignId!=undefined && this.navigatedFrom!=undefined ){
      this.referenceService.goToRouter(url+"/"+this.navigatedFrom+"/"+encodedCampaignId+"/"+this.campaignTitle);
    }
    else{
      this.referenceService.goToRouter(url);
    }
  }

 
  getDealState() {
    this.registerLeadButtonError = false;
    if (this.campaignId != null) {
      this.campaignService.showRegisterLeadButton(this.campaignId).
        subscribe(data => {
          if(data.statusCode==200){
            let map = data.map;
            this.disabled = map.disabled;
            this.showRegisterLeadButton = map.showButton;
          }else{
            this.registerLeadButtonError = true;
          }
      },error=>{
          this.registerLeadButtonError = true;
      });
    }

    

    this.leadsService.getLeadByCampaign(this.campaignId, this.selectedUserId, this.loggedInUserId)
    .subscribe(response => {
      let data = response.data;
      if (data == undefined) {
        this.dealButtonText = "Register Lead";
        this.leadActionType = "add";
        this.leadId = 0;
        //this.isDeal = false;
        this.canPartnerEditLead = true;
      } else {
       // this.leadData = data;
        this.dealButtonText = "Update Lead";
        this.leadActionType = "edit";
        this.leadId = data.id;
        this.canPartnerEditLead = data.partnerEditLead;
      }      
    })

  }

  showDealRegistrationForm() {
    if (this.isDeal) {
      this.isDealRegistration = false;
      this.isDealPreview = true;
    } else {
      this.showUserLevelTimeLine = false;
      this.showLeadForm = true;
    }
  }
  previeDeal() {
    this.isDealPreview = true;
  }

  showTimeLineView(){
    this.isDealRegistration = false;
    this.isDealPreview = false;
    this.showLeadForm = false;
    this.showUserLevelTimeLine = true;
    this.getDealState();
  }

  closeLeadForm(){
    this.isDealRegistration = false;
    this.isDealPreview = false;
    this.showLeadForm = false;
    this.showUserLevelTimeLine = true;
    this.getDealState();
  }
  
}
