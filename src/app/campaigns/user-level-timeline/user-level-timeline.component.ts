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


@Component({
  selector: 'app-user-level-timeline',
  templateUrl: './user-level-timeline.component.html',
  styleUrls: ['./user-level-timeline.component.css','../analytics/timeline.css','../analytics/detailed-campaign-analytics/detailed-campaign-analytics.component.css']
})
export class UserLevelTimelineComponent implements OnInit {

  campaignType:string = "";
  userType:string;
  campaignId:number;
  selectedUserId:number;
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

  constructor(private route: ActivatedRoute,private campaignService:CampaignService, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, private leadsService: LeadsService) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.loading = true;
    this.dataLoader = true;
    this.userType = this.route.snapshot.params['type'];
    this.navigatedFrom = this.route.snapshot.params['navigatedFrom'];
    this.previousRouterAlias = this.userType;
		if(this.userType=="pa" || this.userType=="pm"){
			this.userType = "p";
		}
    this.selectedUserId = parseInt(this.route.snapshot.params['userId']);
    this.campaignId = parseInt(this.route.snapshot.params['campaignId']);
	  let analyticsCampaignIdParam = this.route.snapshot.params['analyticsCampaignId'];
    if(analyticsCampaignIdParam!=undefined){
      this.analyticsCampaignId = parseInt(analyticsCampaignIdParam);
    }
    this.validateCampaignIdAndUserId(this.campaignId,this.selectedUserId);
    const roles = this.authenticationService.getRoles();
    if (roles.indexOf(this.roleName.orgAdminRole) > -1) {
      this.isOrgAdmin = true;
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
       console.log(launchTimeInUtcString);
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
    let url = "/home/campaigns/user-campaigns/"+this.previousRouterAlias+"/"+this.selectedUserId;
    if(this.navigatedFrom!=undefined && this.analyticsCampaignId==undefined){
      this.referenceService.goToRouter(url+"/"+this.navigatedFrom);
    }else if(this.analyticsCampaignId!=undefined && this.navigatedFrom!=undefined ){
      this.referenceService.goToRouter(url+"/"+this.navigatedFrom+"/"+this.analyticsCampaignId);
    }
    else{
      this.referenceService.goToRouter(url);
    }
  }

  /****************Deal Registration***************************/
  // getDealState() {
  //   this.loading = true;
  //     this.dataLoader = true;
  //   if (this.campaignId>0) {
  //     const obj = { "campaignId": this.campaignId };
  //     this.campaignService.getCampaignById(obj).subscribe(data => {
  //       if (data.nurtureCampaign) {
  //         this.campaignService.getCampaignById({ "campaignId": data.parentCampaignId }).subscribe(parent_campaign => {
  //           if(parent_campaign.userId!=undefined){
  //             this.referenceService.getCompanyIdByUserId(parent_campaign.userId).subscribe(response => {
  //               this.referenceService.getOrgCampaignTypes(response).subscribe(data => {
  //                 this.enableLeads = data.enableLeads;
  //                 this.disabled = false;
  //               });
  //             })
  //           }else{
  //               this.disabled = true;
  //           }
            
  //         }, error => console.log(error))
  //       } else {
  //         if (this.authenticationService.loggedInUserRole != "Team Member") {
  //           if (data.userId == this.authenticationService.getUserId()) {
  //             this.createdBySelf = true;
  //             console.log(this.createdBySelf)
  //           }
  //         } else {
  //           this.dealRegistrationService.getSuperorId(this.authenticationService.getUserId()).subscribe(response => {
  //             if (response.includes(data.userId)) {
  //               this.createdBySelf = true;
  //               console.log(this.createdBySelf)
  //             }
  //           })
  //         }
  //         this.referenceService.getCompanyIdByUserId(data.userId).subscribe(response => {
  //           this.referenceService.getOrgCampaignTypes(response).subscribe(data => {
  //             this.enableLeads = data.enableLeads;
  //             console.log(data)
  //           });
  //         })
  //       }
  //     });
  //     this.loading = false;
  //     this.dataLoader = false;
  //   }

  //   this.dealRegistrationService.getDeal(this.campaignId, this.selectedUserId).subscribe(data => {
  //     this.dealId = data;
  //     if (data == -1) {
  //       this.dealButtonText = "Register Lead";
  //       this.isDeal = false;
  //     } else {
  //       this.dealRegistrationService.getDealById(data, this.selectedUserId).subscribe(response => {
  //         let isDeal = response.data.deal;
  //         if(this.campaignDetails['showRegisterLeadButton'] && !isDeal ){
  //           this.isDeal = false;
  //         }else{
  //           this.isDeal = isDeal;
  //         }
  //         if (this.isDeal) {
  //           this.dealButtonText = "Preview Deal";
  //         } else {
  //           this.dealButtonText = "Update Lead";
  //         }
  //         this.leadData = response.data;
          
  //       })
  //     }
  //   })
  // }

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
      } else {
       // this.leadData = data;
        this.dealButtonText = "Update Lead";
        this.leadActionType = "edit";
        this.leadId = data.id;
      }      
    })

  }

  showDealRegistrationForm() {
    if (this.isDeal) {
      this.isDealRegistration = false;
      this.isDealPreview = true;
    } else {
      //this.isDealRegistration = false;
      //this.isDealPreview = false;
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
