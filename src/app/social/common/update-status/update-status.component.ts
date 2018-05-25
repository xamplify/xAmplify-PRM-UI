import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';
import {SaveVideoFile} from '../../../videos/models/save-video-file';

import {SocialStatusDto} from '../../models/social-status-dto';
import {SocialStatus} from '../../models/social-status';
import {SocialStatusContent} from '../../models/social-status-content';
import {SocialStatusProvider} from '../../models/social-status-provider';

import {ContactList} from '../../../contacts/models/contact-list';
import {Campaign} from '../../../campaigns/models/campaign';

import {CustomResponse} from '../../../core/models/custom-response';
import {ResponseType} from '../../../core/models/response-type';

import {AuthenticationService} from '../../../core/services/authentication.service';
import {PagerService} from '../../../core/services/pager.service';
import {SocialService} from '../../services/social.service';
import {TwitterService} from '../../services/twitter.service';
import {FacebookService} from '../../services/facebook.service';
import {VideoFileService} from '../.././../videos/services/video-file.service';
import {ContactService} from '../.././../contacts/services/contact.service';
import {VideoUtilService} from '../../../videos/services/video-util.service';
import {Pagination} from '../../../core/models/pagination';
import {CallActionSwitch} from '../../../videos/models/call-action-switch';
import { ReferenceService } from '../../../core/services/reference.service';

declare var $, flatpickr, videojs: any;

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.css', '../../../../assets/css/video-css/video-js.custom.css'],
  providers: [PagerService, Pagination, CallActionSwitch]
})
export class UpdateStatusComponent implements OnInit, OnDestroy {
  @Input('isSocialCampaign') isSocialCampaign = false;
  @Input('alias') alias: string;
  videoUrl: string;
  posterImage: string;
  videoJSplayer: any;
  selectedVideo: SaveVideoFile;
  userId: number;
  socialStatus = new SocialStatus();
  previewContactList = new ContactList();
  socialStatusDtos = new Array<SocialStatusDto>();
  customResponse = new CustomResponse();

  contactListsPagination: Pagination = new Pagination();
  contactsPagination: Pagination = new Pagination();
  videosPagination: Pagination = new Pagination();
  paginationType: string;

  constructor(private socialService: SocialService, private twitterService: TwitterService,
    private facebookService: FacebookService, private videoFileService: VideoFileService,
    public authenticationService: AuthenticationService, private contactService: ContactService,
    private pagerService: PagerService, private router: Router, public videoUtilService: VideoUtilService,
    private logger: XtremandLogger, public callActionSwitch: CallActionSwitch, private route: ActivatedRoute,
    public referenceService:ReferenceService)
    {
    this.resetCustomResponse();
    this.userId = this.authenticationService.getUserId();
    this.socialStatus.userId = this.userId;
  }
  resetCustomResponse() {
    this.customResponse.type = null;
    this.customResponse.statusText = null;
  }

  setCustomResponse(type: ResponseType, statusText: string) {
    this.customResponse.type = type;
    this.customResponse.statusText = statusText;
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
  addVideo() {
    this.resetCustomResponse();
    console.log(this.socialStatus.socialStatusContents.length);
    if (this.socialStatus.socialStatusContents.length > 0 &&
      (Array.from(this.socialStatus.socialStatusContents)[0].fileType !== 'video')) {
      this.setCustomResponse(ResponseType.Warning, 'You can include up to 4 photos or 1 video in a post.');
    } else {
      this.socialStatus.statusMessage = this.selectedVideo.title;
      const socialStatusContent: SocialStatusContent = new SocialStatusContent();
      socialStatusContent.id = this.selectedVideo.id;
      socialStatusContent.fileName = this.selectedVideo.title;
      socialStatusContent.fileType = 'video';
      socialStatusContent.filePath = this.videoUrl;
      this.socialStatus.socialStatusContents.push(socialStatusContent);
    }
    $('#listVideosModal').modal('hide');
  }

  removeItem(i: number, socialStatusContent: SocialStatusContent) {
    this.resetCustomResponse();
    console.log(socialStatusContent + '' + i);
    this.socialService.removeMedia(socialStatusContent.fileName)
      .subscribe(
      data => {
        $('#preview-' + i).remove('slow');
        this.socialStatus.socialStatusContents.splice(i);
        this.resetCustomResponse();
      },
      error => console.log(error),
      () => console.log('Finished')
      );
  }

  validateImageUpload(files: any) {
    this.resetCustomResponse();
    this.customResponse.statusArray = [];
    const uploadedFilesCount = files.length;
    const existingFilesCount = this.socialStatus.socialStatusContents.length;
    if ((uploadedFilesCount + existingFilesCount) > 4) {
      this.setCustomResponse(ResponseType.Warning, 'You can upload maximum 4 images.');
      return false;
    } else if ((this.socialStatus.socialStatusContents.length === 1) &&
      (Array.from(this.socialStatus.socialStatusContents)[0].fileType === 'video')) {
      this.setCustomResponse(ResponseType.Warning, 'You can include up to 4 photos or 1 video in a Tweet.');
      return false;
    } else {
      for (const file of files) {
        if (file.size > 3145728) {
          // File size should not be more than 3 MB
          this.setCustomResponse(ResponseType.Warning, 'Accepted image size is less than 3MB');
          this.customResponse.statusArray.push(
            'The Uploaded Image: ' + file.name + ' size is ' + Math.round(file.size / 1024 / 1024 * 100) / 100 + ' MB');
          return false;
        }
        console.log(file.name + ': ' + file.size);
      }
      return true;
    }
  }
  fileChange(event: any) {
    const files = event.target.files;
    if (this.validateImageUpload(files)) {
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
              this.socialStatus.socialStatusContents.push(socialStatusContent);
            }
            console.log(this.socialStatus);
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
    return this.isSocialCampaign ? this.isValidSocialCampaign() : this.isValidUpdateStatus();
  }

  countSelectedSocialAccounts() {
    return this.socialStatus.socialStatusProviders.filter((x, i) => {return x.selected;}).length;
  }

  isSocialAccountsSelected() {
    if (this.countSelectedSocialAccounts() < 1) {
      this.setCustomResponse(ResponseType.Warning, 'Please select the accounts to post the status.');
      return false;
    } else {
      return true;
    }
  }

  isValidSocialCampaign() {
    let isValid = true;
    isValid = this.isSocialAccountsSelected();

    if (!this.socialStatus.campaignName) {
      isValid = false;
      this.setCustomResponse(ResponseType.Warning, 'Please provide campaign name');
    }
    return isValid;
  }

  isValidUpdateStatus() {
    return this.isSocialAccountsSelected();
  }

  createSocialCampaign() {
    this.resetCustomResponse();
    this.socialStatus.socialCampaign = this.isSocialCampaign;
    $('html, body').animate({
      scrollTop: $('#us-right').offset().top
    }, 500);
    if (this.validate()) {
      this.setCustomResponse(ResponseType.Loading, 'Creating Social Campaign');
      this.socialStatus.socialStatusProviders = this.filterSelectedSocialProviders(this.socialStatus.socialStatusProviders);

      this.socialStatus.userId = this.userId;

      this.socialService.updateStatus(this.socialStatus)
        .subscribe(
        data => {
          this.setCustomResponse(ResponseType.Success, 'Status posted Successfully');
          this.socialStatus.campaignName = null;
          $('input:checkbox').removeAttr('checked');
          $('#contact-list-table tr').removeClass("highlight");
        },
        error => {
          this.setCustomResponse(ResponseType.Error, 'An Error occurred while creating the social campaign.');
          this.customResponse.statusArray = [];
          this.customResponse.statusArray.push(error);
        },
        () => {
          this.initializeSocialStatus();
          this.socialStatus.userListIds = [];
        }
        );
    }
  }

  filterSelectedSocialProviders(socialStatusProviders: Array<SocialStatusProvider>) {
    socialStatusProviders = socialStatusProviders.filter(function(obj) {
      return obj.selected === true;
    });
    return socialStatusProviders;
  }

  updateStatus() {
    if (this.validate()) {
      this.socialStatus.socialStatusProviders = this.filterSelectedSocialProviders(this.socialStatus.socialStatusProviders);
      this.setCustomResponse(ResponseType.Loading, 'Updating Status');
      this.socialService.updateStatus(this.socialStatus)
        .subscribe(
        data => {
          this.initializeSocialStatus();
          $('#full-calendar').fullCalendar('removeEvents');
          this.listEvents();
          this.setCustomResponse(ResponseType.Success, 'Status posted Successfully');
        },
        error => {
          console.log(error);
          this.setCustomResponse(ResponseType.Error, 'Error while posting the update.');
        },
        () => console.log('Finished')
        );
    }
  }

  schedule() {
    this.socialStatus.shareNow = false;
    this.updateStatus();
  }

  deleteStatus(socialStatus: SocialStatus) {
    this.setCustomResponse(ResponseType.Loading, 'Please Wait while we are processing your request.');
    this.socialService.deleteStatus(socialStatus)
      .subscribe(
      data => {
        this.setCustomResponse(ResponseType.Success, 'Status has been deleted successfully.');
        $('#full-calendar').fullCalendar('removeEvents');
        this.listEvents();
        this.initializeSocialStatus();
      },
      error => this.setCustomResponse(ResponseType.Error, 'An Error occurred while deleting the status.'),
      () => console.log('Finished')
      );
  }

  initializeSocialStatus() {
    this.socialStatus.socialStatusContents = new Array<SocialStatusContent>();
    this.socialStatus.id = null;
    this.socialStatus.statusMessage = '';
    this.socialStatus.shareNow = true;

    this.listSocialStatusProviders();
  }

  listSocialConnections() {
    this.socialService.listAccounts(this.userId, 'ALL', 'ALL')
      .subscribe(
      result => {
        this.socialService.socialConnections = result;
        console.table(result);
      },
      error => console.log(error),
      () => {
        this.initializeSocialStatus();
      });
  }

  listSocialStatusProviders() {
    const socialConnections = this.socialService.socialConnections;
    this.socialStatus.socialStatusProviders = new Array<SocialStatusProvider>();
    for (const i in socialConnections) {
      if (socialConnections[i].active) {
        const socialStatusProvider = new SocialStatusProvider();
        socialStatusProvider.socialConnection = socialConnections[i];
        this.socialStatus.socialStatusProviders.push(socialStatusProvider);
      }
    }
  }
  openListVideosModal() {
    $('#listVideosModal').modal('show');
    if (this.videosPagination.pagedItems.length === 0) {
      $('#preview-section').hide();
      this.listVideos(this.videosPagination);
    }
  }

  closeListVideosModal() {
    $('#listVideosModal').modal('hide');
    this.videoJSplayer.pause();
    this.videoJSplayer.currentTime(0);
    this.closeModal();
  }

  editSocialStatus(socialStatus: SocialStatus) {
    this.resetCustomResponse();
    $('#fc-event-' + socialStatus.id).modal('hide');
    $('html,body').animate({scrollTop: 0}, 'slow');
    this.initializeSocialStatus();
    this.socialStatus = socialStatus;
    for (const i of Object.keys(this.socialStatus.socialStatusProviders)) {
      this.socialStatus.socialStatusProviders[i].selected = true;
    }
  }

  showScheduleOption(divId: string) {$('#' + divId).removeClass('hidden');}
  hideScheduleOption(divId: string) {$('#' + divId).addClass('hidden');}

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
          this.previewVideo(videosPagination.pagedItems[0]);
        }
      });
      () => console.log('listVideos() completed:')
  }

  /*****************LOAD VIDEOS WITH PAGINATION END *****************/

  /*****************LOAD CONTACTLISTS WITH PAGINATION START *****************/

  loadContactLists(contactListsPagination: Pagination) {
    this.paginationType = 'updatestatuscontactlists';
    this.contactListsPagination.filterKey = 'isPartnerUserList';
    this.contactListsPagination.filterValue = this.socialStatus.isPartner;
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
   else if(event.type === 'updatestatuscontactlists'){
    this.contactListsPagination.pageIndex = event.page;
    this.loadContactLists(this.contactListsPagination);
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
  }
  closeModal(){
    this.paginationType = 'updatestatuscontactlists';
    this.contactsPagination =  new Pagination();
    this.videosPagination =  new Pagination();
  }
  /*****************LOAD CONTACTS BY CONTACT LIST ID WITH PAGINATION END *****************/

  constructCalendar() {
    const self = this;
    $('#full-calendar').fullCalendar({
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
      timeFormat: 'h:mm',
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
            html: true,
            placement: 'auto',
            trigger : 'hover',
            content: function() {
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
    const self = this;
    this.socialService.listEvents(this.userId)
      .subscribe(
      data => {
        for (const i of Object.keys(data)) {
          const socialStatus = data[i];
          for (const j of Object.keys(socialStatus.socialStatusProviders)) {
          const socialStatusDto = new SocialStatusDto();
          socialStatusDto.socialStatus = socialStatus;
          socialStatusDto.socialStatusContents = socialStatus.socialStatusContents;
          socialStatusDto.socialStatusProvider = socialStatus.socialStatusProviders[j];

          this.socialStatusDtos.push(socialStatusDto);

            const event = {
            title: socialStatus.statusMessage,
            start: socialStatus.scheduledTimeUser,
            id: socialStatus.id+'-'+socialStatusDto.socialStatusProvider.id,
            data: socialStatusDto,
          };
          $('#full-calendar').fullCalendar('renderEvent', event, true);
          }

        }
      },
      error => console.log(error),
      () => {
        flatpickr('.flatpickr', {
          enableTime: true,
          minDate: new Date()
        });
        console.log('listEvents() finished');
      }
      );
  }

  highlightRow(contactListId: number) {
    const isChecked = $('#' + contactListId).is(':checked');
    if (isChecked) {
      if (!this.socialStatus.userListIds.includes(contactListId)) {
        this.socialStatus.userListIds.push(contactListId);
      }
      $('#' + contactListId).parent().closest('tr').addClass('highlight');
    } else {
      this.socialStatus.userListIds.splice($.inArray(contactListId, this.socialStatus.userListIds), 1);
      $('#' + contactListId).parent().closest('tr').removeClass('highlight');
    }
  }

  toggleContactListCheckbox(contactListId: number) {
    const isChecked = $('#' + contactListId).is(':checked');
    $('#' + contactListId).prop('checked', isChecked);
    this.highlightRow(contactListId);
  }

  getSocialCampaign(socialCampaignAlias: string) {
    this.socialService.getSocialCampaignByAlias(socialCampaignAlias)
      .subscribe(
      data => {
        this.socialStatus = data;
        this.socialStatus.shareNow = true;
        this.socialStatus.isPartner = true;
        this.socialStatus.emailOpened = false;
      },
      error => this.router.navigate(['/home/error/404']),
      () => {
        this.listSocialStatusProviders();
      }
      );
  }

  toggleContactLists() {
    this.socialStatus.isPartner = !this.socialStatus.isPartner;
    this.contactListsPagination.pageIndex = 1;
    this.loadContactLists(this.contactListsPagination);
  }

  ngOnInit() {
    this.listSocialConnections();
    this.listEvents();
    this.constructCalendar();
    $('#schedule-later-div').hide();

    if ( this.isSocialCampaign ) {
        this.socialStatus.isPartner = this.authenticationService.isOnlyPartner() ? false : true;
        this.loadContactLists( this.contactListsPagination );
    }
    if (this.isSocialCampaign && this.alias) {
      this.getSocialCampaign(this.alias);
    }
  }

  ngOnDestroy() {
    if (this.videoJSplayer !== undefined) {
      this.videoJSplayer.dispose();
    }
    $('.profile-video').remove();
    this.videoFileService.videoType = '';
  }
}
