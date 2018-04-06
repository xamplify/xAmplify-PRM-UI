import { CampaignType } from '../models/campaign-type';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { EmailTemplate } from '../../email-template/models/email-template';
import { CustomResponse } from '../../common/models/custom-response';

import { CampaignService } from '../services/campaign.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ContactService } from '../../contacts/services/contact.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';

import { validateCampaignSchedule } from '../../form-validator';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { Pagination } from '../../core/models/pagination';

declare var $: any;
@Component({
  selector: 'app-partner-campaigns',
  templateUrl: './partner-campaigns.component.html',
  styleUrls: ['./partner-campaigns.component.css'],
  providers: [DatePipe, CallActionSwitch]
})
export class PartnerCampaignsComponent implements OnInit {
  campaigns: any;
  emailTemplate: EmailTemplate;
  userLists: any;
  isNurture: boolean;
  campaign: any;
  videoFile: any;
  public campaignLaunchOptions = ['NOW', 'SCHEDULE', 'SAVE'];
  campaignLaunchForm: FormGroup;
  buttonName = "Launch";
  isScheduleSelected = false;
  campaignType: string;

  contactListPagination:Pagination;
  selectedUserlistIds = [];
  customResponse: CustomResponse = new CustomResponse();

  formErrors = {
    'campaignName': '',
    'fromName': '',
    'subjectLine': '',
    'email': '',
    'preHeader': '',
    'message': '',
    'scheduleCampaign': '',
    'launchTime': '',
    'contactListId': '',
    'countryId': ''
  };

  validationMessages = {
    'campaignName': {
      'required': 'Name is required.',
      'minlength': 'Title must be at least 4 characters long.',
      'maxlength': 'Title cannot be more than 24 characters long.',
    },
    'fromName': {
      'required': 'From Name is required'
    },
    'subjectLine': {
      'required': 'subject line is required'
    },
    'email': {
      'required': 'email is required',
      'pattern': 'Invalid Email Id'
    },
    'preHeader': {
      'required': 'preHeader is required'
    },

    'message': {
      'required': 'message is required'
    },
    'scheduleCampaign': {
      'required': 'please select the schedule campaign'
    },
    'launchTime': {
      'required': 'please select the launch time'
    },
    'contactListId': {
      'pattern': 'please select atleast one contact list'
    },
    'countryId': {
      'required': 'Country is required.',
      'invalidCountry': 'Country is required.'
    },


  };

  constructor(private router: Router,
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    private authenticationService: AuthenticationService,
    private contactService:ContactService,
    public callActionSwitch: CallActionSwitch,
    private formBuilder: FormBuilder,
    private xtremandLogger: XtremandLogger) {
      this.contactListPagination = new Pagination();
          this.contactListPagination.filterKey = 'isPartnerUserList';
          this.contactListPagination.filterValue = false;
     }

  listPartnerCampaigns(userId: number, campaignType: string) {
    this.campaignService.listPartnerCampaigns(userId, campaignType)
      .subscribe(
      result => { this.campaigns = result; },
      error => console.log(error),
      () => { });
  }

  filterCampaigns(type: string) {
    this.router.navigate(['/home/campaigns/partner/' + type]);
  }

  nurtureCampaign(campaignId: number) {
    this.isNurture = true;
    const data = { 'campaignId': campaignId }
    this.campaignService.getCampaignById(data)
      .subscribe(
      result => {
        this.campaign = result;
        const userProfile = this.authenticationService.userProfile;
        this.campaign.email = userProfile.emailId;
        this.campaign.fromName = $.trim(userProfile.firstName + " " + userProfile.lastName);
        this.setEmailIdAsFromName();

        this.validateLaunchForm();
        this.loadContactList(this.contactListPagination);
      },
      error => console.log(error),
      () => { });
  }

  setEmailIdAsFromName() {
    if (this.campaign.fromName.length === 0) {
      this.campaign.fromName = this.campaign.email;
    }
  }

  setEmailOpened(event: any) {
    this.campaign.emailOpened = event;
  }

  setVideoPlayed(event: any) {
    this.campaign.videoPlayed = event;
  }

  validateLaunchForm(): void {
    this.campaignLaunchForm = this.formBuilder.group({
      'scheduleCampaign': [this.campaign.scheduleCampaign, Validators.required],
      'launchTime': [this.campaign.scheduleTime],
      'timeZoneId': [this.campaign.timeZoneId],
      'countryId': [this.campaign.countryId]
    }, {
        validator: validateCampaignSchedule('scheduleCampaign', 'launchTime')
      }
    );
    this.campaignLaunchForm.valueChanges
      .subscribe(data => this.onLaunchValueChanged(data));

    this.onLaunchValueChanged(); // (re)set validation messages now
  }

  //campaign lunch form value changed method 
  onLaunchValueChanged(data?: any) {
    if (!this.campaignLaunchForm) { return; }
    const form = this.campaignLaunchForm;
    const value = this.campaignLaunchForm['_value'].scheduleCampaign;
    if (value == "NOW") {
      this.buttonName = "Launch";
    } else if (value == "SAVE") {
      this.buttonName = "Save";
    } else if (value == "SCHEDULE") {
      this.buttonName = "Schedule";
    }
    if (this.campaignLaunchForm['_value'].scheduleCampaign != null) { this.isScheduleSelected = true }
    for (const field of Object.keys(this.formErrors)) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key of Object.keys(control.errors)) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  previewVideo(videoFile: any) {
    this.videoFile = videoFile;
  }

  closePreviewVideoModal(event: any) {
    this.videoFile = undefined;
  }

  previewEmailTemplate(emailTemplate:EmailTemplate){
      const body = emailTemplate.body;
      let emailTemplateName = emailTemplate.name;
      if(emailTemplateName.length>50){
          emailTemplateName = emailTemplateName.substring(0, 50)+"...";
      }
      $("#htmlContent").empty();
      $("#email-template-title").empty();
      $("#email-template-title").append(emailTemplateName);
      $('#email-template-title').prop('title',emailTemplate.name);
      $("#htmlContent").append(body);
      $('.modal .modal-body').css('overflow-y', 'auto'); 
      $("#email_template_preivew").modal('show');
  }

    loadContactList(contactListPagination:Pagination) {
        this.contactService.loadContactLists(contactListPagination)
            .subscribe(
              (data:any) => {
                this.xtremandLogger.info("contactListPagination:-->", data);
                this.userLists = data["listOfUserLists"];
              },
              (error:string) => this.xtremandLogger.errorPage(error),
              () => this.xtremandLogger.info("Finished loadContactList()", this.contactListPagination)
            )
    }
    launchCampaign(){
        var data = this.getCampaignData("");
            this.campaignService.saveCampaign( data )
            .subscribe(
            response => {
                this.isNurture = true;
                if(response.statusCode == 2000){
                    this.customResponse = new CustomResponse('SUCCESS', 'Campaign has been launched successfully.', true);
                }else{
                    this.customResponse = new CustomResponse('ERROR', 'An error occurred while launching the campaign.', true);
                }
            },
            error => {
              this.xtremandLogger.errorPage(error);
              this.customResponse = new CustomResponse('ERROR', 'An error occurred while launching the campaign.', true);            
          },
            () => this.xtremandLogger.info("Finished launchCampaign()")
        ); 
    return false;
    }  

    getCampaignData( emailId: string ) {
        let campaignType = CampaignType.REGULAR;
        if("regular" === this.campaignType){
            campaignType = CampaignType.REGULAR;
        }else if("video" === this.campaignType){
            campaignType = CampaignType.VIDEO;
        }
        const data = {
            'campaignName': this.campaign.campaignName,
            'fromName': this.campaign.fromName,
            'subjectLine': this.campaign.subjectLine,
            'email': this.campaign.email,
            'preHeader': this.campaign.preHeader,
            'emailOpened': this.campaign.emailOpened,
            'videoPlayed': this.campaign.videoPlayed,
            'replyVideo': true,
            'channelCampaign':false,
            'enableCoBrandingLogo':this.campaign.enableCoBrandingLogo,
            'socialSharingIcons': true,
            'userId': this.authenticationService.getUserId(),
            'selectedVideoId': this.campaign.selectedVideoId,
            'partnerVideoSelected':this.campaign.partnerVideoSelected,
            'userListIds': this.selectedUserlistIds,
            "optionForSendingMials": "MOBINAR_SENDGRID_ACCOUNT",
            "scheduleCampaign": this.campaignLaunchForm.value.scheduleCampaign,
            'scheduleTime': this.campaignLaunchForm.value.launchTime,
            'timeZoneId':"Asia/Calcutta",
            'campaignId': 0,
            'selectedEmailTemplateId': this.campaign.emailTemplate.id,
            'regularEmail': this.campaign.regularEmail,
            'testEmailId': emailId,
            'campaignReplies':[],
            'campaignUrls':[],
            'campaignType':campaignType,
            'country':"---Please Select Country---",
            'createdFromVideos':this.campaign.createdFromVideos
        };
        return data;
    } 

  highlightRow(contactListId: number) {
    const isChecked = $('#' + contactListId).is(':checked');
    if (isChecked) {
      if (!this.selectedUserlistIds.includes(contactListId)) {
        this.selectedUserlistIds.push(contactListId);
      }
      $('#' + contactListId).parent().closest('tr').addClass('highlight');
    } else {
      this.selectedUserlistIds.splice($.inArray(contactListId, this.selectedUserlistIds), 1);
      $('#' + contactListId).parent().closest('tr').removeClass('highlight');
    }
  }             

  ngOnInit() {
    this.campaignType = this.route.snapshot.params['type'];
    const userId = this.authenticationService.getUserId();

    this.listPartnerCampaigns(userId, this.campaignType);
  }

}
