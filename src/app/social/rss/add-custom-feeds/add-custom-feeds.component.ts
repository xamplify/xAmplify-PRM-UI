import { Component, OnInit } from '@angular/core';
import { SocialCampaign } from '../../models/social-campaign';
import { SocialStatus } from '../../models/social-status';
import { SocialStatusContent } from '../../models/social-status-content';
import { SocialStatusProvider } from '../../models/social-status-provider';
import { CustomResponse } from '../../../core/models/custom-response';
import { ResponseType } from '../../../core/models/response-type';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { PagerService } from '../../../core/services/pager.service';
import { SocialService } from '../../services/social.service';
import { VideoFileService } from '../.././../videos/services/video-file.service';
import { VideoUtilService } from '../../../videos/services/video-util.service';
import { Pagination } from '../../../core/models/pagination';
import { CallActionSwitch } from '../../../videos/models/call-action-switch';
import { ReferenceService } from '../../../core/services/reference.service';
import { Properties } from '../../../common/models/properties';
import { Router, ActivatedRoute } from '@angular/router';
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';
import { SaveVideoFile } from '../../../videos/models/save-video-file';

declare var $, flatpickr, videojs, swal: any;
@Component({
  selector: 'app-add-custom-feeds',
  templateUrl: './add-custom-feeds.component.html',
  styleUrls: ['./add-custom-feeds.component.css','../../../../assets/css/video-css/video-js.custom.css'],
  providers: [PagerService, Pagination, CallActionSwitch, Properties]
})
export class AddCustomFeedsComponent implements OnInit {
  loading = false;
  socialCampaign = new SocialCampaign();
  socialStatus = new SocialStatus();
  socialStatusList = new Array<SocialStatus>();
  socialStatusResponse = new Array<SocialStatus>();
  socialStatusProviders = new Array<SocialStatusProvider>();
  customResponse:CustomResponse = new CustomResponse();
  userId:number  = 0;
  videosPagination: Pagination = new Pagination();
  paginationType: string = "";
  videoUrl: string;
  posterImage: string;
  videoGifImage: string;
  videoJSplayer: any;
  selectedVideo: SaveVideoFile;
  savedURL: string;
  isAdd = true;
  constructor(private socialService:SocialService,private videoFileService:VideoFileService,private authenticationService:AuthenticationService,public pagerService:PagerService,private router: Router, public videoUtilService: VideoUtilService,
    private logger: XtremandLogger, public callActionSwitch: CallActionSwitch, private route: ActivatedRoute,
    public referenceService: ReferenceService) {
    this.resetCustomResponse();
    this.userId = this.authenticationService.getUserId();
    if (this.socialService.selectedCustomFeed === undefined) {
		this.socialStatus = new SocialStatus();
      if (this.router.url.indexOf("home/rss/edit-custom-feed") > -1) {
        this.router.navigate(["/home/rss/manage-custom-feed"]);
      }
  }

  if(this.socialService.selectedCustomFeed != undefined){
    this.isAdd = false;
    this.socialStatus = this.socialService.selectedCustomFeed;
    }

    
   }

  ngOnInit() {

  }

 

  fileChange(event: any, socialStatus: SocialStatus) {
    const files = event.target.files;
    this.loading = true;
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
              this.loading = false;
              console.log(socialStatus);
            },
            error => {this.loading = false;},
            () => console.log('Finished')
          );
      }
    } else {
      this.loading = false;
    }

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
        if (!file.type.startsWith("image")) {
          this.setCustomResponse(ResponseType.Warning, "We can't quite use that type of file. Could you try one of the following instead: JPG, JPEG, GIF, PNG?");
          return false;
        }
        console.log(file.name + ': ' + file.size);
      }
      return true;
    }
  }

  resetCustomResponse() {
    this.customResponse.type = null;
    this.customResponse.statusText = null;
    this.socialStatusResponse = [];
    this.customResponse.statusArray = [];
  }

  setCustomResponse(type: ResponseType, statusText: string) {
    this.customResponse.type = type;
    this.customResponse.statusText = statusText;
    $('html, body').animate({
      scrollTop: $('.page-content').offset().top
    }, 500);
  }

  save(isPublish:boolean){
    this.resetCustomResponse();
    if (this.validate()) {
      this.loading = true;
      this.socialStatus.userId = this.userId;
      this.socialStatus.publishToPartners = isPublish;
      this.socialService.saveFeed(this.socialStatus)
        .subscribe(
          data => {
            this.referenceService.isCreated = true;
            this.router.navigate(["/home/rss/manage-custom-feed"]);
          },
          error => {
            this.loading = false;
            this.setCustomResponse(ResponseType.Error, 'Error while adding the feed.');
          },
          () => {
            this.loading = false;
          }
        );
    }
  }

 

  validate() {
    let isValid = true;
    let statusMessage = $.trim(this.socialStatus.statusMessage);
    if (statusMessage.length==0 && this.socialStatus.socialStatusContents.length === 0) {
      this.setCustomResponse(ResponseType.Warning, 'Feed can not be empty');
     isValid = false;
    }
    return isValid;
  }

  /**********Upload Video***************** */
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

  closeModal() {
    this.paginationType = 'updatestatuscontactlists';
    this.videosPagination = new Pagination();
  }

  videoPlayListSource(videoUrl: string) {
    this.videoUrl = videoUrl;
    const self = this;
    this.videoJSplayer.playlist([{ sources: [{ src: self.videoUrl, type: 'application/x-mpegURL' }] }]);
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
      this.videoJSplayer = videojs('videoId', {
        autoplay: true,
        html5: {
          hls: {
            overrideNative: overrideNativevalue
          },
          nativeVideoTracks: !overrideNativevalue,
          nativeAudioTracks: !overrideNativevalue,
          nativeTextTracks: !overrideNativevalue
        }
      });
    }
    this.videoControllColors(videoFile);
    $('#list-videos-table > tbody > tr').click(function () {
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
    const player = videojs('videoId', { autoplay: false, });
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

  selectVideo(videoFile: SaveVideoFile) {
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
  }

  openRssModal(socialStatus: SocialStatus) {
    $('#rssModal').modal('show');
  }


  addToPost(feed: any) {
    let socialStatus = this.socialStatus;
    socialStatus.statusMessage = feed.link;
    socialStatus.ogImage = feed.thumbnail ? feed.thumbnail : 'https://via.placeholder.com/100x100?text=preview';
    socialStatus.ogTitle = feed.title;
    socialStatus.ogDescription = feed.description;
    socialStatus.validLink = true;
    socialStatus.ogt = true;
    $('#rssModal').modal('hide');
  }

  navigateRssHome(navigateUrl: string) {
    $('#rssModal').modal('hide');
    this.router.navigate([navigateUrl]);
  }

  populateRssFeed(feed: any) {
    this.socialStatus.statusMessage = feed.link;
    this.socialStatus.ogImage = feed.thumbnail ? feed.thumbnail : 'https://via.placeholder.com/100x100?text=preview';
    this.socialStatus.ogTitle = feed.title;
    this.socialStatus.ogDescription = feed.description;
    this.socialStatus.validLink = true;
    this.socialStatus.ogt = true;
    this.socialStatusList[0] = this.socialStatus;
  }

  onKeyPress(event: KeyboardEvent) {
    let enteredURL = this.socialStatus.statusMessage.toLowerCase();
    if (enteredURL.length === 0) {
      this.socialStatus.statusMessage = ""
      this.clearRssOgTagsFeed();
    } else {
      if (!this.isUrlValid(enteredURL)) {
        this.socialStatus.statusMessage = enteredURL;
        this.clearRssOgTagsFeed();
      } else {
        if (this.isUrlValid(enteredURL) && enteredURL !== this.savedURL) {
          this.getOgTagsData(enteredURL);
        }
      }
    }
  }

  isUrlValid(url: string): Boolean {
    let regex = "^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$";
    var pattern = new RegExp(regex);
    return pattern.test(url);
  }

  getOgTagsData(url: string) {
    let req = { "userId": this.userId, "q": url };
    this.socialService.getOgMetaTags(req).subscribe(data => {
      let response = data.data;
      if (response !== undefined && response !== '') {
        this.socialStatus.statusMessage = response.link;
        this.socialStatus.ogImage = response.imageUrl ? response.imageUrl : 'https://via.placeholder.com/100x100?text=preview';
        this.socialStatus.ogTitle = response.title;
        this.socialStatus.ogDescription = response.description;
        this.socialStatus.validLink = true;
        this.socialStatus.ogt = true;
        this.socialStatusList[0] = this.socialStatus;
        this.savedURL = url;
      }
    }, error => {    
      this.clearRssOgTagsFeed();  
      console.log(error);
    }, () => console.log("Campaign Names Loaded"));
  }

  clearRssOgTagsFeed() {
    this.socialStatus.ogImage = ""
    this.socialStatus.ogTitle = "";
    this.socialStatus.ogDescription = "";
    this.socialStatus.validLink = false;
    this.socialStatus.ogt = false;
    this.savedURL = '';
  }

  /***********************Update*************************** */
  update(){
    this.resetCustomResponse();
    if (this.validate()) {
      this.loading = true;
      this.socialStatus.userId = this.userId;
      this.socialService.updateFeed(this.socialStatus)
        .subscribe(
          data => {
            this.referenceService.isUpdated = true;
            this.router.navigate(["/home/rss/manage-custom-feed"]);
          },
          error => {
            this.loading = false;
            this.setCustomResponse(ResponseType.Error, 'Error while adding the feed.');
          },
          () => {
            this.loading = false;
          }
        );
    }
  }
 

}
