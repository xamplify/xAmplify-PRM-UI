import { Component, OnInit, Input,OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';
import { SaveVideoFile } from '../../../videos/models/save-video-file';

import { SocialCampaign } from '../../models/social-campaign';
import { SocialStatusDto } from '../../models/social-status-dto';
import { SocialStatus } from '../../models/social-status';
import { SocialConnection } from '../../models/social-connection';
import { SocialStatusContent } from '../../models/social-status-content';
import { SocialStatusProvider } from '../../models/social-status-provider';

import { ContactList} from '../../../contacts/models/contact-list';
import { CustomResponse } from '../../../core/models/custom-response';
import { ResponseType } from '../../../core/models/response-type';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { PagerService } from '../../../core/services/pager.service';
import { SocialService } from '../../services/social.service';
import { VideoFileService } from '../.././../videos/services/video-file.service';
import { ContactService } from '../.././../contacts/services/contact.service';
import { VideoUtilService } from '../../../videos/services/video-util.service';
import { Pagination } from '../../../core/models/pagination';
import { CallActionSwitch } from '../../../videos/models/call-action-switch';
import { ReferenceService } from '../../../core/services/reference.service';
import { Properties } from '../../../common/models/properties';
import { Country } from '../../../core/models/country';
import { Timezone } from '../../../core/models/timezone';
import { CampaignService } from 'app/campaigns/services/campaign.service';
declare var $, flatpickr, videojs, swal: any;

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.css', '../../../../assets/css/video-css/video-js.custom.css'],
  providers: [PagerService, Pagination, CallActionSwitch,Properties]
})
export class UpdateStatusComponent implements OnInit, OnDestroy {
  @Input('isSocialCampaign') isSocialCampaign = false;
  @Input('alias') alias: string;
  videoUrl: string;
  posterImage: string;
  videoGifImage: string;
  videoJSplayer: any;
  selectedVideo: SaveVideoFile;
  userId: number;
  isCampaignNameExist:boolean;
  isRedirectEnabled: boolean;
  socialCampaign = new SocialCampaign();
  socialStatus = new SocialStatus();
  selectedAccounts: number = 0;
  isCustomizeButtonClicked: boolean = false;
  socialStatusList = new Array<SocialStatus>();
  socialStatusResponse = new Array<SocialStatus>();
  socialStatusProviders = new Array<SocialStatusProvider>();
  isAllSelected: boolean = false;
  loading: boolean = false;
  loadingCalendar: boolean = false;
  socialConnections = new Array<SocialConnection>();
  countries: Country[];
  timezones: Timezone[];
  countryId: number;
  scheduledTimeInString: string;

  previewContactList = new ContactList();
  socialStatusDtos = new Array<any>();
  customResponse = new CustomResponse();

  contactListsPagination: Pagination = new Pagination();
  contactsPagination: Pagination = new Pagination();
  videosPagination: Pagination = new Pagination();
  paginationType: string;
  location:any;
  channelCampaign: boolean;
  isEditSocialStatus: boolean = false;
  isPreviewVideo: boolean = false;
  campaignNames = [];
  events = [];
  constructor(private _location: Location, public socialService: SocialService,
    private videoFileService: VideoFileService, public properties:Properties,
    public authenticationService: AuthenticationService, private contactService: ContactService,
    private pagerService: PagerService, private router: Router, public videoUtilService: VideoUtilService,
    private logger: XtremandLogger, public callActionSwitch: CallActionSwitch, private route: ActivatedRoute,
    public referenceService:ReferenceService,public campaignService:CampaignService){
    this.channelCampaign = true;
    this.location = this.router.url;
    this.resetCustomResponse();
    this.userId = this.authenticationService.getUserId();
    this.countries = this.referenceService.getCountries();
    this.countryId = this.countries[0].id;
    this.onSelectCountry(this.countryId);
    // this.initializeSocialStatus();
  }
  resetCustomResponse() {
    this.customResponse.type = null;
    this.customResponse.statusText = null;
    this.socialStatusResponse = [];
    this.customResponse.statusArray = [];
  }
  changeChannelCampaign(){
    this.channelCampaign = !this.channelCampaign;
    this.contactListsPagination.maxResults = 12;
    if(!this.channelCampaign){
      this.loadAllContactLists(this.contactListsPagination);
    } else {
      this.loadContactLists(this.contactListsPagination);
    }
  }
  loadAllContactLists(contactListsPagination:Pagination){
    this.paginationType = 'loadAllContacts';
    contactListsPagination.filterKey = null;
    contactListsPagination.filterValue = null;
    this.contactService.loadAllContacts(this.userId,contactListsPagination).subscribe(data=>{
      contactListsPagination.totalRecords = data.totalRecords;
      contactListsPagination = this.pagerService.getPagedItems(contactListsPagination, data.listOfUserLists);
    },
    error=> {
      console.log(error);
    });
  }
  setCustomResponse(type: ResponseType, statusText: string) {
    this.customResponse.type = type;
    this.customResponse.statusText = statusText;
    $('html, body').animate({
      scrollTop: $('.page-content').offset().top
    }, 500);
  }
  videoControllColors(videoFile: SaveVideoFile) {
    this.videoUtilService.videoColorControlls(videoFile);
    const rgba = this.videoUtilService.transparancyControllBarColor(videoFile.controllerColor, videoFile.transparency);
    $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
  }
  previewVideo(videoFile: SaveVideoFile) {    
    this.resetCustomResponse();
    this.selectedVideo = videoFile;
    this.posterImage = videoFile.imagePath;
    this.videoUrl = this.selectedVideo.videoPath;
    this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
    this.videoUrl = this.videoUrl + '.mp4?access_token=' + this.authenticationService.access_token;
    if (this.selectedVideo.is360video) {
         this.play360video(this.selectedVideo);
    } else {
          $('#newPlayerVideo').empty();
          $('#videoId').remove();
          $('.p-video').remove();
          this.videoUtilService.normalVideoJsFiles();
          const str = '<video id="videoId"  poster=' + this.posterImage + ' preload="none"  autoplay= "false" class="video-js vjs-default-skin" controls></video>';
          $('#newPlayerVideo').append(str);
          this.videoUrl = this.selectedVideo.videoPath;
          this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
          this.videoUrl = this.videoUrl + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
          $('#newPlayerVideo video').append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
          $('#videoId').css('height', '315px');
          $('#videoId').css('width', '100%');
          $('.video-js .vjs-tech').css('width', '100%');
          $('.video-js .vjs-tech').css('height', '100%');
          const self = this;
          const overrideNativevalue = true;
          this.videoJSplayer = videojs('videoId',  {
            autoplay : true,
            html5: {
              hls: {
                  overrideNative: overrideNativevalue
              },
              nativeVideoTracks: !overrideNativevalue,
              nativeAudioTracks: !overrideNativevalue,
              nativeTextTracks: !overrideNativevalue
              } }  );
      }
      this.videoControllColors(videoFile);
    $('#list-videos-table > tbody > tr').click(function() {
      $('input[type=radio]', this).attr('checked', 'checked');
    }
    );
    }
     play360video(videoFile) {
        this.resetCustomResponse();
        $('#newPlayerVideo').empty();
        $('.h-video').remove();
        this.videoUtilService.player360VideoJsFiles();
        const str = '<video id=videoId  poster=' + this.posterImage + ' class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
        $('#newPlayerVideo').append(str);
        this.videoUrl = this.selectedVideo.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '.mp4?access_token=' + this.authenticationService.access_token;
        $('#newPlayerVideo video').append('<source src="' + this.videoUrl + '" type="video/mp4">');
        const player = videojs('videoId', { autoplay : false, });
        const self = this;
        player.panorama({
            autoMobileOrientation: true,
            clickAndDrag: true,
            clickToToggle: true,
            callback: function () {
                player.ready(function () {
                  player.play();
                  $('.video-js .vjs-control-bar .vjs-VR-control').css('cssText', 'color:' + self.selectedVideo.playerColor + '!important');
                });
            }
        });
        this.videoControllColors(videoFile);
        $('#videoId').css('width', '100%');
        $('#videoId').css('height', '315px');
    }

    selectVideo(videoFile: SaveVideoFile){
      this.selectedVideo = videoFile;
    }

     addVideo() {
       this.resetCustomResponse();
       this.socialStatus.statusMessage = this.selectedVideo.title;
       const socialStatusContent: SocialStatusContent = new SocialStatusContent();
       socialStatusContent.videoId = this.selectedVideo.id;
       socialStatusContent.fileName = this.selectedVideo.title;
       socialStatusContent.fileType = 'video';
       socialStatusContent.filePath = this.selectedVideo.gifImagePath;
       this.socialStatus.socialStatusContents = [];
       this.socialStatus.socialStatusContents[0] = (socialStatusContent);
       $('#listVideosModal').modal('hide');
      //  this.videoJSplayer.dispose();
     }

  removeItem(socialStatus: SocialStatus, socialStatusContent: SocialStatusContent) {
    this.resetCustomResponse();
    socialStatus.socialStatusContents = socialStatus.socialStatusContents.filter(item => item.fileName !== socialStatusContent.fileName);
  }

  validateImageUpload(files: any, socialStatus: SocialStatus) {
    this.resetCustomResponse();
    this.customResponse.statusArray = [];
    const uploadedFilesCount = files.length;
    const existingFilesCount = socialStatus.socialStatusContents.length;
    if ((uploadedFilesCount + existingFilesCount) > 4) {
      this.setCustomResponse(ResponseType.Warning, 'You can upload maximum 4 images.');
      return false;
    } else if ((socialStatus.socialStatusContents.length === 1) &&
      (Array.from(socialStatus.socialStatusContents)[0].fileType === 'video')) {
      this.setCustomResponse(ResponseType.Warning, 'You can include up to 4 photos or 1 video in a post.');
      return false;
    } else {
      for (const file of files) {
        if (file.size > 3145728) {
          // File size should not be more than 3 MB
          this.setCustomResponse(ResponseType.Warning, 'Accepted image size is less than 3MB');
          this.customResponse.statusArray.push('The Uploaded Image: ' + file.name + ' size is ' + Math.round(file.size / 1024 / 1024 * 100) / 100 + ' MB');
          return false;
        } 
        if(!file.type.startsWith("image")){
          this.setCustomResponse(ResponseType.Warning, "We can't quite use that type of file. Could you try one of the following instead: JPG, JPEG, GIF, PNG?");
          return false;
        }
        console.log(file.name + ': ' + file.size);
      }
      return true;
    }
  }
  fileChange(event: any, socialStatus: SocialStatus) {
    console.log(socialStatus);
    console.log(this.socialStatusList);
    const files = event.target.files;
    if (this.validateImageUpload(files, socialStatus)) {
      if (files.length > 0) {
        const formData: FormData = new FormData();
        for (const file of files) {
          formData.append('files', file, file.name);
        }

        this.socialService.uploadMedia(formData)
          .subscribe(
          data => {
            for (const i of Object.keys(data)) {
              const socialStatusContent = data[i];
              socialStatus.socialStatusContents.push(socialStatusContent);
            }
            console.log(socialStatus);
          },
          error => console.log(error),
          () => console.log('Finished')
          );
      }
    } else {
      // alert('error');
    }

  }

  updateAgain(socialStatus: SocialStatus) {
    this.initializeSocialStatus();
    this.socialStatus.statusMessage = socialStatus.statusMessage;
    this.socialStatus.shareNow = true;

    this.updateStatus();
  }

  validate() {
    let isValid = true;
    this.socialStatusList.forEach(data => {
      if(!data.statusMessage && data.socialStatusContents.length === 0){
        this.setCustomResponse( ResponseType.Warning, 'Status can not be empty' );
          isValid = false;
          return false;
      }
    })
    if(isValid)
      return this.isSocialCampaign ? this.isValidSocialCampaign() : this.isValidUpdateStatus();
  }

  isSocialAccountsSelected() {
      if ( this.selectedAccounts < 1 ) {
          this.setCustomResponse( ResponseType.Warning, 'Please select the accounts to post the status.' );
          return false;
      } else {
          return true;
      }
  }

  isValidSocialCampaign() {
    this.validateCampaignName(this.socialCampaign.campaignName);
      let isValid = true;
      isValid = this.isSocialAccountsSelected();

      if ( !this.socialCampaign.campaignName ) {
          isValid = false;
          this.setCustomResponse( ResponseType.Warning, 'Please provide campaign name' );
      } else if(this.isCampaignNameExist) {
          isValid = false;
          this.setCustomResponse( ResponseType.Warning, 'Please provide another campaign name' );
      }
      else if ( this.socialCampaign.campaignName && this.socialCampaign.userListIds.length === 0 && !this.authenticationService.isOnlyPartner() ) {
          isValid = false;
          this.setCustomResponse( ResponseType.Warning, 'Please select one or more Partner lists.' );
      }
      return isValid;
  }

  isValidUpdateStatus() {
    return this.isSocialAccountsSelected();
  }

  isValidredistributeSocialCampaign(){
    let isValid = true;
    isValid = this.isSocialAccountsSelected();
    if ( !this.socialCampaign.campaignName ) {
      isValid = false;
      this.setCustomResponse( ResponseType.Warning, 'Please provide campaign name' );
    }
    return isValid;
  }

  redistributeSocialCampaign(){
    this.resetCustomResponse();
    this.socialCampaign.socialStatusProviderList = [];
    this.socialCampaign.userId = this.userId;
    
    this.socialCampaign.parentCampaignId = this.socialCampaign.campaignId;
    this.socialCampaign.campaignId = null;
    this.socialStatusProviders.forEach(data => {
      if(data.selected)
        this.socialCampaign.socialStatusProviderList.push(data)
    });
    if(this.isValidredistributeSocialCampaign()){
      this.loading = true;
      this.socialService.redistributeSocialCampaign(this.socialCampaign)
        .subscribe(
        data => {
          this.socialCampaign.campaignName = null;
          this.socialStatusResponse = data.socialStatusList;
          if (data.publishStatus !== 'FAILURE') {
            let message =  this.socialCampaign.shareNow ? 'redistributed':'scheduled';
            this.setCustomResponse(ResponseType.Success, 'Campaign ' + message + ' successfully.');
            
            this.isRedirectEnabled = true;
            setTimeout(() => {
              this.redirect();
            }, 10000);

          }
          else if (data.publishStatus === 'FAILURE')
            this.setCustomResponse(ResponseType.Error, 'An Error occurred while redistributing the social campaign.');

          $('input:checkbox').removeAttr('checked');
          $('#contact-list-table tr').removeClass("highlight");
        },
        error => {
          this.setCustomResponse(ResponseType.Error, 'An Error occurred while redistributing the social campaign.');
          this.customResponse.statusArray = [];
          this.customResponse.statusArray.push(error);
          this.loading = false;
        },
        () => {
          this.initializeSocialStatus();
          this.socialCampaign.userListIds = [];
          this.loading = false;
        }
        );
    }

    console.log(this.socialCampaign);
  }

  createSocialCampaign() {
    this.resetCustomResponse();
    this.socialCampaign.socialCampaign = this.isSocialCampaign;
    $('html, body').animate({
      scrollTop: $('#us-right').offset().top
    }, 500);
    if (this.validate()) {
      this.loading = true;
      this.socialStatusResponse = [];
      this.socialCampaign.userId = this.userId;
      this.socialCampaign.socialStatusList = this.socialStatusList;

      this.socialService.createSocialCampaign(this.socialCampaign)
        .subscribe(
        data => {
          this.socialCampaign.campaignName = null;
          this.socialStatusResponse = data.socialStatusList;
          
          if (data.publishStatus !== 'FAILURE') {
            let message = this.socialCampaign.shareNow ? 'launched':'scheduled';
            this.setCustomResponse(ResponseType.Success, 'Campaign ' + message + ' successfully.');
            this.isRedirectEnabled = true;
            setTimeout(() => {
              this.redirect();
            }, 10000);

          }
          else if (data.publishStatus === 'FAILURE')
            this.setCustomResponse(ResponseType.Error, 'An Error occurred while creating the social campaign.');

          $('input:checkbox').removeAttr('checked');
          $('#contact-list-table tr').removeClass("highlight");
        },
        error => {
          this.setCustomResponse(ResponseType.Error, 'An Error occurred while creating the social campaign.');
          this.customResponse.statusArray = [];
          this.customResponse.statusArray.push(error);
          this.loading = false;
        },
        () => {
          this.initializeSocialStatus();
          this.socialCampaign.userListIds = [];
          this.loading = false;
        }
        );
    }
  }

  redirect() {
    if (this.authenticationService.isOnlyPartner()) {
      this.router.navigate(['home/campaigns/partner/social']);
    }
    else {
      this.router.navigate(['/home/campaigns/manage']);
    }
  }

  updateStatus() {
    if (this.validate()) {
      this.loading = true;
      this.socialStatusResponse = [];
      this.socialService.postStatus(this.socialStatusList)
        .subscribe(
        data => {
          this.initializeSocialStatus();
          $('#calendar').fullCalendar('removeEvents');
          this.socialStatusResponse = data;
          this.customResponse.statusText = null;
        },
        error => {
          this.loading = false;
          console.log(error);
          this.setCustomResponse(ResponseType.Error, 'Error while posting the update.');
        },
        () => {
          this.loading = false;
          this.listEvents();
        }
        );
    }
  }

  shareLater() {
    this.resetCustomResponse();

    let isValid = true;
    if (this.countryId === 0) {
      isValid = false;
      this.setCustomResponse(ResponseType.Warning, 'Please select your country from the dropdown list');
    }

    if (!this.scheduledTimeInString) {
      isValid = false;
      this.setCustomResponse(ResponseType.Warning, 'Please select schedule date and time');
    }
    if(isValid){
      this.socialCampaign.shareNow = false;
      this.socialCampaign.scheduledTimeInString = this.scheduledTimeInString;
      this.socialCampaign.timeZone = $('#timezoneId option:selected').val();
      
      this.socialStatusList.forEach(data => {
        data.shareNow = false;
        data.scheduledTimeInString = this.scheduledTimeInString;
        data.timeZone = $('#timezoneId option:selected').val();
      });
      this.shareNow();
    }
  }

  shareNow() {
    this.socialStatusList.forEach(data => {
      data.userId = this.userId;
      // if (this.isUrl(data.statusMessage))
      //   data.validLink = true;
      if (data.shareNow) {
        data.scheduledTime = new Date();
        data.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      }
    });
    if (!this.isSocialCampaign)
      this.updateStatus();
    else if (this.isSocialCampaign && !this.alias)
      this.createSocialCampaign();
    else if (this.isSocialCampaign && this.alias)
      this.redistributeSocialCampaign();
  }

  deleteStatus(socialStatus: SocialStatus) {
    this.loading = true;
    this.socialService.deleteStatus(socialStatus)
      .subscribe(
      data => {
        this.setCustomResponse(ResponseType.Success, 'Status has been deleted successfully.');
        $('#calendar').fullCalendar('removeEvents');
        this.listEvents();
        this.initializeSocialStatus();
      },
      error => {
        this.loading = false;
        this.setCustomResponse(ResponseType.Error, error)
      },
      () =>  this.loading = false
      );
  }

  initializeSocialStatus() {
    this.socialStatusList = [];
    this.isAllSelected = false;
    this.selectedAccounts = 0;
    let socialStatus = new SocialStatus();
    socialStatus.userId = this.userId;
    this.socialCampaign.userListIds = [];
    socialStatus.id = null;
    this.socialStatusList.push(socialStatus);
    this.listSocialStatusProviders();
    this.isEditSocialStatus = false;
  }

  listSocialConnections() {
    this.socialService.listAccounts(this.userId, 'ALL', 'ALL')
      .subscribe(
      result => {
        this.socialService.socialConnections = result;
        this.socialConnections = result;
      },
      error => console.log(error),
      () => {
        this.initializeSocialStatus();
      });
  }

  listSocialStatusProviders() {
    this.socialStatusProviders = new Array<SocialStatusProvider>();
    for (const i in this.socialConnections) {
      if (this.socialConnections[i].active) {
        let source = this.socialConnections[i].source;
        if(this.socialConnections[i].source !== 'GOOGLE') {
          const socialStatusProvider = new SocialStatusProvider();
          socialStatusProvider.socialConnection = this.socialConnections[i];
          this.socialStatusProviders.push(socialStatusProvider);
        }
      }
    }
  }
  openListVideosModal(socialStatus: SocialStatus) {
    this.socialStatus = socialStatus;
    $('#listVideosModal').modal('show');
    if (this.videosPagination.pagedItems.length === 0) {
      $('#preview-section').hide();
      this.listVideos(this.videosPagination);
    }
  }

  closeListVideosModal() {
    $('#listVideosModal').modal('hide');
    // this.videoJSplayer.dispose();
    this.closeModal();
  }

  editSocialStatus(socialStatus: SocialStatus) {
    this.resetCustomResponse();
    $('#fc-event-' + socialStatus.id).modal('hide');
    $('html,body').animate({scrollTop: 0}, 'slow');
    this.initializeSocialStatus();
    this.isEditSocialStatus = true;
    socialStatus.shareNow = true;
    this.socialStatusList[0] = socialStatus;
    this.socialStatusProviders = [];
    this.socialStatusProviders[0] = socialStatus.socialStatusProvider;
    this.toggleSelectAll();
  }

  showScheduleOption(divId: string) {$('#' + divId).removeClass('hidden'); $('#post-actions-button-group').addClass('hidden');}
  hideScheduleOption(divId: string) {
    $('#' + divId).addClass('hidden');
    $('#post-actions-button-group').removeClass('hidden');
    this.resetCustomResponse();
  }

  videoPlayListSource(videoUrl: string) {
    this.videoUrl = videoUrl;
    const self = this;
    this.videoJSplayer.playlist([{sources: [{src: self.videoUrl, type: 'application/x-mpegURL'}]}]);
  }

  /*****************LOAD VIDEOS WITH PAGINATION START *****************/

  listVideos(videosPagination: Pagination) {
    this.paginationType = 'updatestatusvideos';
    this.videoFileService.videoType = 'myVideos';
    this.videoFileService.loadVideoFiles(videosPagination)
      .subscribe((result: any) => {
        if (result.totalRecords > 0) {
          $('#preview-section').show();
          videosPagination.totalRecords = result.totalRecords;
          videosPagination = this.pagerService.getPagedItems(videosPagination, result.listOfMobinars);
          // this.previewVideo(videosPagination.pagedItems[0]);
        }
      });
      () => console.log('listVideos() completed:')
  }

  /*****************LOAD VIDEOS WITH PAGINATION END *****************/

  /*****************LOAD CONTACTLISTS WITH PAGINATION START *****************/

  loadContactLists(contactListsPagination: Pagination) {
    this.paginationType = 'updatestatuscontactlists';
     if(this.authenticationService.isOnlyPartner()) { this.socialCampaign.isPartner = false;}
     this.contactListsPagination.filterKey = 'isPartnerUserList';
     this.contactListsPagination.filterValue = this.socialCampaign.isPartner; /// if its true normal contacts wil come, partner contacts for false
     this.contactService.loadContactLists(contactListsPagination)
      .subscribe(
      (data: any) => {
        contactListsPagination.totalRecords = data.totalRecords;
        contactListsPagination = this.pagerService.getPagedItems(contactListsPagination, data.listOfUserLists);
      },
      (error: any) => {
        this.logger.error(error);
      },
      () => this.logger.info('MangeContactsComponent loadContactLists() finished')
      );
  }

  /*****************LOAD CONTACTLISTS WITH PAGINATION END *****************/

  /*****************LOAD CONTACTS BY CONTACT LIST ID WITH PAGINATION START *****************/
  loadContactsOnPreview(contactList: ContactList, pagination: Pagination) {
    pagination.pageIndex = 1;
    this.contactsPagination.maxResults = 12;
    this.loadContacts(contactList, pagination);
  }

  loadContacts(contactList: ContactList, pagination: Pagination) {
    this.paginationType = 'updatestatuscontacts';
    this.previewContactList = contactList;
    this.contactService.loadUsersOfContactList(this.previewContactList.id, pagination).subscribe(
      (data: any) => {
        pagination.totalRecords = data.totalRecords;
        this.contactsPagination = this.pagerService.getPagedItems(pagination, data.listOfUsers);
        $('#contactsModal').modal('show');
      },
      error =>
        () => console.log('loadContacts() finished')
    );
  }

  setPage(event:any){
   if(event.type ==='updatestatuscontacts'){
    this.contactsPagination.pageIndex = event.page;
    this.loadContacts(this.previewContactList, this.contactsPagination);
   }
   else if(event.type === 'updatestatuscontactlists' && this.paginationType !== 'loadAllContacts'){
    this.contactListsPagination.pageIndex = event.page;
    this.loadContactLists(this.contactListsPagination);
   }
   else if(event.type === 'updatestatuscontactlists' && this.paginationType === 'loadAllContacts'){
    this.contactListsPagination.pageIndex = event.page;
    this.loadAllContactLists(this.contactListsPagination);
   }
   else if(event.type ==='updatestatusvideos'){
    this.videosPagination.pageIndex = event.page;
    this.listVideos(this.videosPagination);
   }
  }
  paginationDropDown(pagination: Pagination){
    if(this.paginationType ==='updatestatuscontacts'){ this.loadContacts(this.previewContactList, pagination);}
    else if(this.paginationType === 'updatestatuscontactlists'){ this.loadContactLists(pagination); }
    else if(this.paginationType ==='updatestatusvideos'){ this.listVideos(pagination);}
    else if(this.paginationType==='loadAllContacts') {this.loadAllContactLists(pagination) }
  }
  closeModal(){
    this.paginationType = 'updatestatuscontactlists';
    this.contactsPagination =  new Pagination();
    this.videosPagination =  new Pagination();
  }
  /*****************LOAD CONTACTS BY CONTACT LIST ID WITH PAGINATION END *****************/

  constructCalendar() {
    const self = this;
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      views: {
        listDay: {buttonText: 'list day'},
        listWeek: {buttonText: 'list week'}
      },
      defaultView: 'month',
      timeFormat: 'h:mm a',
      timezone: 'local',
      eventOrder: "-start",
      eventLimit: true,
      viewRender: function(view: any, element: any){
        self.listEvents();
      },
      eventRender: function(event: any, element: any) {
        element.find('.fc-time').addClass('fc-time-title mr5');
        element.find('.fc-title').addClass('fc-time-title ml5');
        element.find('.fc-time-title').wrapAll('<div class="fc-right-block col-xs-11 flex pull-right p0 mr-10"></div>');

        const socialStatusProvider = event.data.socialStatusProvider;
        let str = '';
          if ('FACEBOOK' === socialStatusProvider.socialConnection.source) {
            str += '<i class="fa fa-social pull-right fa-facebook white p-10"></i>';
            element.css('background', '#3b5998');
          } else if ('TWITTER' === socialStatusProvider.socialConnection.source) {
            str += '<i class="fa fa-social pull-right fa-twitter  white p-10"></i>';
            element.css('background', '#1da1f2');
          } else if ('GOOGLE' === socialStatusProvider.socialConnection.source) {
            str += '<i class="fa fa-social pull-right fa-google  white p-10"></i>';
            element.css('background', '#d95535');
          } else if ('LINKEDIN' === socialStatusProvider.socialConnection.source) {
            str += '<i class="fa fa-social pull-right fa-linkedin  white p-10"></i>';
            element.css('background', '#007bb5');
          }

        element.find('.fc-right-block')
          .after($(`<div id = ${event.id} class="fc-left-block col-xs-1 p0"> ${str} </div>`));
        $(element).popover({
          container: 'body',
          html: true,
          placement: 'auto',
          trigger: 'hover',
          content: function () {
            return $('#fc-' + event.id).html();
          }
        });
      },
      eventClick: function(event) {
       self.editSocialStatus(event.data.socialStatus);
    }
    });
  }

  listEvents() {
    $('#calendar').fullCalendar('removeEvents');
    var view = $('#calendar').fullCalendar('getView');
    var request = { startTime: view.start._d, endTime: view.end._d, userId: this.userId };
    this.loadingCalendar = true;
    const self = this;
    this.socialService.listEvents(request)
      .subscribe(
      data => {
        this.events = [];
        for (const i of Object.keys(data)) {
          const socialStatus = data[i];
          const socialStatusDto = new SocialStatusDto();
          socialStatusDto.socialStatus = socialStatus;
          socialStatusDto.socialStatusContents = socialStatus.socialStatusContents;
          socialStatusDto.socialStatusProvider = socialStatus.socialStatusProvider;

          this.socialStatusDtos.push(socialStatusDto);

            let event: any = {id: socialStatus.id+'-'+socialStatusDto.socialStatusProvider.id, 
            title: socialStatus.statusMessage.substring(0, 10), 
            start: socialStatus.scheduledTime, 
            data: socialStatusDto, 
            editable: false, 
            allDay: false}; 
          // $('#calendar').fullCalendar('renderEvent', event, true);
          this.events.push(event);
        }
        $('#calendar').fullCalendar('addEventSource', this.events); 
      },
      error => console.log(error),
      () => {
        this.loadingCalendar = false;
      }
      );
  }

  highlightRow(contactListId: number) {
    const isChecked = $('#' + contactListId).is(':checked');
    if (isChecked) {
      if (!this.socialCampaign.userListIds.includes(contactListId)) {
        this.socialCampaign.userListIds.push(contactListId);
      }
      $('#' + contactListId).parent().closest('tr').addClass('highlight');
    } else {
      this.socialCampaign.userListIds.splice($.inArray(contactListId, this.socialCampaign.userListIds), 1);
      $('#' + contactListId).parent().closest('tr').removeClass('highlight');
    }
  }

  getSocialCampaign(socialCampaignAlias: string) {
    this.socialService.getSocialCampaignByAlias(socialCampaignAlias)
      .subscribe(
      data => {
        this.socialCampaign = data;
        this.socialCampaign.shareNow = true;
        this.socialCampaign.isPartner = true;
        this.socialCampaign.userListIds = [];
        this.socialStatusList = [];
        this.isCustomizeButtonClicked = true;
      },
      error => this.router.navigate(['/home/error/404']),
      () => {
        this.listSocialStatusProviders();
      }
      );
  }

  toggleContactLists() {
    this.socialCampaign.isPartner = !this.socialCampaign.isPartner;
    this.contactListsPagination.pageIndex = 1;
    this.loadContactLists(this.contactListsPagination);
  }
  loadCampaignNames(userId:number){
    this.campaignService.getCampaignNames(userId).subscribe(data => { this.campaignNames.push(data); },
    error => console.log( error ), () => console.log( "Campaign Names Loaded" ) );
  }

  validateCampaignName(campaignName:string){
    const lowerCaseCampaignName = $.trim(campaignName.toLowerCase()); //Remove all spaces
    this.isCampaignNameExist = this.campaignNames[0].includes(lowerCaseCampaignName) ? true: false;
  }

  ngOnInit() {
    flatpickr('.flatpickr', {
      enableTime: true,
      minDate: new Date(),
      dateFormat: 'm/d/Y h:i K',
      time_24hr: false
    });
    this.listSocialConnections();
    // this.listEvents();
    this.constructCalendar();
    // $('#schedule-later-div').hide();

    if ( this.isSocialCampaign ) {
      this.socialCampaign.isPartner = this.authenticationService.isOnlyPartner() ? false : true;
        if(this.alias) {
          this.getSocialCampaign(this.alias);
        }
        this.loadContactLists( this.contactListsPagination );
        this.loadCampaignNames(this.userId);
    }
  }

  ngOnDestroy() {
    if (this.videoJSplayer !== undefined) {
      // this.videoJSplayer.dispose();
    }
    $('.profile-video').remove();
    this.videoFileService.videoType = '';
    $('#listVideosModal').modal('hide');
    $('#contactsModal').modal('hide');
  }

  toggleSocialStatusProvider(socialStatusProvider: SocialStatusProvider) {
    socialStatusProvider.selected = !socialStatusProvider.selected;
    this.selectedAccounts = socialStatusProvider.selected ? this.selectedAccounts + 1 : this.selectedAccounts - 1;



    if (this.isSocialCampaign && this.alias) {
      if (socialStatusProvider.selected) {
        let likeSocialAccount = 0;
        this.socialCampaign.socialStatusList.forEach(data => {
          if (data.socialStatusProvider.socialConnection.source === socialStatusProvider.socialConnection.source)
            likeSocialAccount++;
        })

        if (likeSocialAccount >= 1) {
          socialStatusProvider.socialStatusList = [];
          this.socialCampaign.socialStatusList.forEach(data => {
            if (data.socialStatusProvider.socialConnection.source === socialStatusProvider.socialConnection.source){
              // let socialStatus = new SocialStatus();
              // socialStatus.statusMessage = socialStatusProvider.socialConnection.source === 'TWITTER' ? data.statusMessage.substring(0, 280) : data.statusMessage;
              // data.socialStatusContents.forEach(data => socialStatus.socialStatusContents.push(data));
              // socialStatus.socialStatusProvider = data.socialStatusProvider;
              let socialStatus = JSON.parse(JSON.stringify(data));
              socialStatus.statusMessage = socialStatusProvider.socialConnection.source === 'TWITTER' ? data.statusMessage.substring(0, 280) : data.statusMessage;
              socialStatusProvider.socialStatusList.push(socialStatus);
            }
          })
        } else {
          socialStatusProvider.socialStatusList = [];
          this.socialCampaign.socialStatusList.forEach(data=> {
              // let socialStatus = new SocialStatus();
              // socialStatus.statusMessage = socialStatusProvider.socialConnection.source === 'TWITTER' ? data.statusMessage.substring(0, 280) : data.statusMessage;
              // data.socialStatusContents.forEach(data => socialStatus.socialStatusContents.push(data));
              // socialStatus.socialStatusProvider = data.socialStatusProvider;
              let socialStatus = JSON.parse(JSON.stringify(data));
              socialStatus.statusMessage = socialStatusProvider.socialConnection.source === 'TWITTER' ? data.statusMessage.substring(0, 280) : data.statusMessage;
              socialStatusProvider.socialStatusList.push(socialStatus);
          })
        }
        socialStatusProvider.socialStatusList[0].selected = true;
      }
    } else {
      if (socialStatusProvider.selected) {
        if (this.isCustomizeButtonClicked) {
          if (this.selectedAccounts <= 1) {
            this.socialStatusList[0].socialStatusProvider = socialStatusProvider;
          } else {
            let socialStatusData = this.socialStatusList[0];
            this.socialStatusList.push(this.copyContent(socialStatusData, socialStatusProvider));
          }
        } else {
          this.socialStatusList[0].socialStatusProvider = socialStatusProvider;
        }
      } else if (!socialStatusProvider.selected) {
        if (this.isCustomizeButtonClicked) {
          // possibility to have more than one socialStatusList
          if (this.socialStatusList.length > 1) {
            this.socialStatusList = this.socialStatusList.filter(function (obj) {
              return obj.socialStatusProvider.socialConnection.id !== socialStatusProvider.socialConnection.id;
            });
          } else {
            this.socialStatusList[0] = new SocialStatus();
            delete this.socialStatusList[0].socialStatusProvider;
          }
        } else {
          if (this.selectedAccounts === 0) {
            this.socialStatusList[0] = new SocialStatus();
            delete this.socialStatusList[0].socialStatusProvider;
          }
        }
      }
    }

  this.isAllSelected = (this.selectedAccounts === this.socialStatusProviders.length) ? true: false;
  }

  copyContent(targetSocialStatus: SocialStatus, socialStatusProvider: SocialStatusProvider){
        let socialStatus = new SocialStatus();

        socialStatus.statusMessage = socialStatusProvider.socialConnection.source === 'TWITTER' ? targetSocialStatus.statusMessage.substring(0, 280) : targetSocialStatus.statusMessage;
        targetSocialStatus.socialStatusContents.forEach(data => socialStatus.socialStatusContents.push(data));
        socialStatus.socialStatusProvider = socialStatusProvider;
        socialStatus.userId = this.userId;

        return socialStatus;
  }

  customizeEachNetwork() {
    let socialStatusData = this.socialStatusList[0];
    this.socialStatusList = [];
    this.socialStatusProviders.forEach(data => {
      if(data.selected){
        this.socialStatusList.push(this.copyContent(socialStatusData, data));
      }
    })
    this.isCustomizeButtonClicked = true;
  }

  undoCustomizeEachNetwork() {
    let socialStatusData = this.socialStatusList[0];
    this.socialStatusList = [];
    this.socialStatusList[0] = socialStatusData;
    this.isCustomizeButtonClicked = false;
  }

  toggleSelectAll(){
    this.isAllSelected = ! this.isAllSelected;
    this.selectedAccounts = 0;
    if(this.isAllSelected){
      this.socialStatusProviders.forEach(data => {
          data.selected = false;
          this.toggleSocialStatusProvider(data);
      })
    }else {
      this.socialStatusList.length = 1;
      this.socialStatusProviders.forEach(data => data.selected = false);
    }
  }

  isUrl(s): boolean {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
  }

  dismissMessage(socialStatus: SocialStatus){
    this.socialStatusResponse = this.socialStatusResponse.filter(item => item !== socialStatus);
  }

  save() {
    this.socialService.saveAccounts( this.socialConnections )
        .subscribe(
        result => {},
        error => console.log( error ),
        () => {
            this.socialService.socialConnections = this.socialConnections;
            this.listSocialStatusProviders();
            $('#manageAccountsModal').modal('hide');
        } );

  }

  onSelectCountry(countryId){
    this.timezones = this.referenceService.getTimeZonesByCountryId(countryId);
  }
  cancel() {
    this._location.back(); // <-- go back to previous location on cancel
  }
}
