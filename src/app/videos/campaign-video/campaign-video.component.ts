import { Component, ElementRef, OnInit, OnDestroy, Input, Inject, AfterViewInit, Renderer} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HashLocationStrategy, Location, LocationStrategy , PathLocationStrategy } from '@angular/common';
import { VideoFileService} from '../services/video-file.service';
import { SaveVideoFile} from '../models/save-video-file';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Logger } from 'angular2-logger/core';
import { XtremandLog } from '../models/xtremand-log';
declare var $, videojs: any;
import { Ng2DeviceService } from 'ng2-device-detector';
import { UUID } from 'angular2-uuid';
enum LogAction {
    playVideo = 1,
    pauseVideo = 2,
    contactButtonPressed= 3,
    callButtonPressed = 4,
    emailButtonPressed = 5,
    chatButtonPressed = 6,
    applePayButtonPressed = 7,
    videoPlayer_slideSlider = 8,
    videoPlayer_movieReachEnd = 9,
    replyVideo = 10,
    videoStopped = 11,
    shareMobinar = 12,
    email_Opened = 13,
    email_GIF_clicked = 14,
}

@Component({
  selector: 'app-public-video',
  templateUrl: './campaign-video.component.html',
  styleUrls: ['./campaign-video.component.css'],
  providers: [XtremandLog]
})
export class CampaignVideoComponent implements OnInit , OnDestroy {
campaignVideoFile: SaveVideoFile;
private videoJSplayer: any;
public videoUrl: string;
public posterImagePath: string;
public is360Value: boolean;
public title: string;
public description: string;
public publicRouterUrl: string;
public typeValue: string;
public videoAlias: string;
public campaignAlias: string;
public userAlias: string;
public locationJson: any;
public deviceInfo: any;
public sessionId: string = null;
public videoLength: string;
public replyVideo: boolean;
public logVideoViewValue: boolean;
public timeValue: any;
LogAction: typeof LogAction = LogAction;
  constructor(private router: Router, private route: ActivatedRoute, private videoFileService: VideoFileService,
            private _logger: Logger, private http: Http, private authenticationService: AuthenticationService,
            private activatedRoute: ActivatedRoute, private xtremandLog: XtremandLog, private deviceService: Ng2DeviceService) {
            console.log('share component constructor called');
            console.log('url is on angular 2' + document.location.href);
            this.publicRouterUrl = document.location.href;
            this.logVideoViewValue = true;
            }
LoginThroghCampaign() {
   this.router.navigate( ['/login']);
}
deviceDectorInfo() {
      console.log('device info in component');
      this.deviceInfo = this.deviceService.getDeviceInfo();
      console.log(this.deviceInfo);
      this.loacationDetails();
 }
 xtremandLogDefaultActions() {
        // router info
        this.xtremandLog.userAlias =  this.userAlias;
        this.xtremandLog.videoAlias = this.videoAlias;
        this.xtremandLog.campaignAlias = this.campaignAlias;
        // device detector
        this.xtremandLog.deviceType = this.deviceInfo.device;
        this.xtremandLog.os = this.deviceInfo.os;
        // location detector
         console.log(this.xtremandLog);
        this.xtremandLog.sessionId = this.sessionId;
      }
    defaultLocationJsonValues(data: any) {
        this.xtremandLog.city = data.city;
        this.xtremandLog.country = data.country;
        this.xtremandLog.isp = data.isp;
        this.xtremandLog.ipAddress = data.query;
        this.xtremandLog.state = data.regionName;
        this.xtremandLog.zip = data.zip;
        this.xtremandLog.latitude = data.lat;
        this.xtremandLog.longitude = data.lon;
        this.xtremandLog.countryCode = data.countryCode;
    }
  getCampaignVideo() {
    this.videoFileService.showCampaignVideo(this.typeValue, this.videoAlias, this.campaignAlias, this.userAlias)
        .subscribe(
         (result: SaveVideoFile) => {
          this.campaignVideoFile = result;
          console.log(result);
          this.posterImagePath = this.campaignVideoFile.imagePath;
          this.is360Value  =  this.campaignVideoFile.is360video;
          this.title = this.campaignVideoFile.title;
          this.description = this.campaignVideoFile.description;
          this.videoLength = this.truncateHourZeros(this.campaignVideoFile.videoLength);
          console.log(this.videoLength);
        if (this.campaignVideoFile.is360video === true) {
         this.play360Video();
        } else {
          this.playNormalVideo();
        }
       this.defaultVideoSettings();
          console.log(this.videoUrl);
    });
  }
 truncateHourZeros(length){
    const val = length.split(":");
    if (val.length == 3 && val[0] == "00") {
        length = val[1]+":"+val[2];
    }
    return length;
   }
    getCurrentTimeValues(time: any) {
        const whereYouAt = time;
        const minutes = Math.floor(whereYouAt / 60);
        const seconds = Math.floor(whereYouAt);
        const x = minutes < 10 ? "0" + minutes : minutes;
        const y = seconds < 10 ? "0" + seconds : seconds;
        const timeValue = x + ":" + y;
        this.videoFileService.campaignTimeValue = timeValue;
   }
     timeConversion(totalSeconds: number) {
        const MINUTES_IN_AN_HOUR = 60;
        const SECONDS_IN_A_MINUTE = 60;
        const seconds = totalSeconds % SECONDS_IN_A_MINUTE;
        const totalMinutes = totalSeconds / SECONDS_IN_A_MINUTE;
        const minutes = totalMinutes % MINUTES_IN_AN_HOUR;
        const hours = totalMinutes / MINUTES_IN_AN_HOUR;
        return this.addZeros(hours)+ ":" + this.addZeros(minutes) + ":" + this.addZeros(seconds);
    }
     addZeros(val: number) {
       const value = val;
        return value.toString().length == 1 ? "0" + value: value;
    }
  loacationDetails() {
    this.videoFileService.getJSONLocation()
    .subscribe(
     (data: any) => {
       this.defaultLocationJsonValues(data);
        console.log(data);
        },
     error => console.log(error));
  }
  createSessionId() {
    this.sessionId = UUID.UUID();
    console.log(this.sessionId);
  }
  ngOnInit() {
     this.createSessionId();
     console.log('public video component ngOnInit called');
     this.deviceDectorInfo();
     this.activatedRoute.queryParams.subscribe(
        ( param: any ) => {
            this.typeValue = param['type'];
            this.videoAlias = param['videoAlias'];
            this.campaignAlias = param['campaignAlias'];
            this.userAlias = param['userAlias'];
        });
     this.xtremandLogDefaultActions();
     this.getCampaignVideo();
  }
    defaultVideoSettings() {
        console.log('default settings called');
        $('.video-js').css('color', this.campaignVideoFile.playerColor);
        $('.video-js .vjs-play-progress').css('background-color', this.campaignVideoFile.playerColor);
        $('.video-js .vjs-volume-level').css('background-color', this.campaignVideoFile.playerColor);
        $('.video-js .vjs-control-bar').css('background-color', this.campaignVideoFile.controllerColor);
   }
    trimCurrentTime(currentTime) {
        return Math.round(currentTime * 100) / 100;
    }
    videoLogAction(xtremandLog: XtremandLog) {
       this.videoFileService.logCampaignVideoActions(xtremandLog).subscribe(
       (result: any) => {
         console.log('successfully logged the actions');
     });
    }
    logVideoViewsCount() {
    this.videoFileService.logVideoViews(this.campaignVideoFile.alias).subscribe(
    (result: any) => {
        console.log('successfully logged view count');
    });
    }
    play360Video() {
    this.is360Value = true;
    console.log('Loaded 360 Video');
    $('.h-video').remove();
    $('head').append('<script src="assets/js/indexjscss/360-video-player/video.js" type="text/javascript"  class="p-video"/>');
    $('head').append('<script src="assets/js/indexjscss/360-video-player/three.js" type="text/javascript"  class="p-video" />');
    $('head').append('<link href="assets/js/indexjscss/360-video-player/videojs-panorama.min.css" rel="stylesheet"  class="p-video">');
$('head').append('<script src="assets/js/indexjscss/360-video-player/videojs-panorama.v5.js" type="text/javascript"  class="p-video" />');
    $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"" type="text/javascript"  class="p-video" />');
const str = '<video id=videoId poster=' + this.posterImagePath +' class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
            $('#newPlayerVideo').append(str);
             this.videoUrl = this.campaignVideoFile.videoPath;
             this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
             this.videoUrl = this.videoUrl + '.mp4';
           //  this.videoUrl = 'https://yanwsh.github.io/videojs-panorama/assets/shark.mp4'; // need to commet
             $('#newPlayerVideo video').append('<source src="' + this.videoUrl + '" type="video/mp4">');
            const selfPanorama = this;
            const player = videojs('videoId', { "controls": true, "autoplay": false, "preload": "auto" }).ready(function() {
                  this.hotkeys({
                 volumeStep: 0.1, seekStep: 5, enableMute: true,
                 enableFullscreen: false, enableNumbers: false,
                 enableVolumeScroll: true,
                 fullscreenKey: function(event: any, player: any) {
                      return ((event.which === 70) || (event.ctrlKey && event.which === 13));
                 },
                 customKeys: {
                     simpleKey: {
                         key: function(e: any) {  return (e.which === 83); },
                         handler: function(player: any, options: any, e: any) {
                             if (player.paused()) {  player.play(); } else { player.pause(); }  } },
                     complexKey: {  key: function(e: any) { return (e.ctrlKey && e.which === 68); },
                         handler: function(player: any, options: any, event: any) {
                             if (options.enableMute) { player.muted(!player.muted()); }}
                     },
                     numbersKey: {
                         key: function(event: any) { return ((event.which > 47 && event.which < 59) ||
                              (event.which > 95 && event.which < 106)); },
                         handler: function(player: any, options: any, event: any) {
                             if (options.enableModifiersForNumbers || !(event.metaKey || event.ctrlKey || event.altKey)) {
                                 let sub = 48;
                                 if (event.which > 95) { sub = 96; }
                                 const number = event.which - sub;
                                 player.currentTime(player.duration() * number * 0.1); }  } },
                     emptyHotkey: { },
                     withoutKey: { handler: function(player: any, options: any, event: any) { console.log('withoutKey handler'); }},
                     withoutHandler: { key: function(e: any) { return true; }},
                     malformedKey: { key: function() {  console.log(' The Key function must return a boolean.'); },
                         handler: function(player: any, options: any, event: any) { }
                     } }  });
                });
            player.panorama({
                autoMobileOrientation: true,
                clickAndDrag: true,
                clickToToggle: true,
                 callback: function () {
                    const playerVideo = this;
                     selfPanorama.replyVideo = false;
                    const document: any = window.document;
                    let startDuration;
                   player.on('play', function() {
                    $('.vjs-big-play-button').css('display', 'none');
                    console.log('play button clicked and current time' + selfPanorama.trimCurrentTime(player.currentTime()));
                       if (selfPanorama.replyVideo === true) {
                          selfPanorama.xtremandLog.actionId = selfPanorama.LogAction.replyVideo;
                          selfPanorama.replyVideo = false;
                     } else {
                          selfPanorama.xtremandLog.actionId = selfPanorama.LogAction.playVideo;
                     }
                     selfPanorama.xtremandLog.startTime = new Date();
                     selfPanorama.xtremandLog.endTime = new Date();
                     selfPanorama.xtremandLog.startDuration = selfPanorama.trimCurrentTime(player.currentTime()).toString();
                     selfPanorama.xtremandLog.stopDuration = selfPanorama.trimCurrentTime(player.currentTime()).toString();
                     if (selfPanorama.logVideoViewValue === true) {
                       selfPanorama.videoLogAction(selfPanorama.xtremandLog);
                       selfPanorama.logVideoViewsCount();
                       selfPanorama.logVideoViewValue = false;
                     }
                      selfPanorama.getCurrentTimeValues(player.currentTime());
                   });
                   player.on('pause', function() {
                     console.log('pused and current time' + selfPanorama.trimCurrentTime(player.currentTime()));
                     selfPanorama.xtremandLog.actionId = selfPanorama.LogAction.pauseVideo;
                     selfPanorama.xtremandLog.startTime = new Date();
                     selfPanorama.xtremandLog.endTime = new Date();
                     selfPanorama.xtremandLog.startDuration = selfPanorama.trimCurrentTime(player.currentTime()).toString();
                     selfPanorama.xtremandLog.stopDuration = selfPanorama.trimCurrentTime(player.currentTime()).toString();
                     selfPanorama.videoLogAction(selfPanorama.xtremandLog);
                     selfPanorama.getCurrentTimeValues(player.currentTime());
                  });
                  player.on('seeking', function() {
                     const seekigTime  = selfPanorama.trimCurrentTime(player.currentTime());
                     selfPanorama.xtremandLog.actionId = selfPanorama.LogAction.videoPlayer_slideSlider;
                     selfPanorama.xtremandLog.startTime = new Date();
                     selfPanorama.xtremandLog.endTime = new Date();
                     selfPanorama.xtremandLog.startDuration = startDuration;
                     selfPanorama.xtremandLog.stopDuration = selfPanorama.trimCurrentTime(player.currentTime()).toString();
                     selfPanorama.videoLogAction(selfPanorama.xtremandLog);
                  });
                  player.on('timeupdate', function() {
                      startDuration = selfPanorama.trimCurrentTime(player.currentTime());
                  });
                  player.on('ended', function() {
                    const whereYouAt = player.currentTime();
                    console.log(whereYouAt);
                    selfPanorama.replyVideo = true;
                    selfPanorama.logVideoViewValue = true;
                    $('.vjs-big-play-button').css('display', 'block');
                    selfPanorama.xtremandLog.actionId = selfPanorama.LogAction.videoPlayer_movieReachEnd;
                    selfPanorama.xtremandLog.startTime = new Date();
                    selfPanorama.xtremandLog.endTime = new Date();
                    selfPanorama.xtremandLog.startDuration = selfPanorama.trimCurrentTime(player.currentTime()).toString();
                    selfPanorama.xtremandLog.stopDuration = selfPanorama.trimCurrentTime(player.currentTime()).toString();
                    selfPanorama.videoLogAction(selfPanorama.xtremandLog);
                  });
                  player.on('fullscreenchange', function () {
                    console.log('fullscreen changed');
                    const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                    const event = state ? 'FullscreenOn' : 'FullscreenOff';
                    if (event === "FullscreenOn") {
                        $(".vjs-tech").css("width", "100%");
                        $(".vjs-tech").css("height", "100%");
                    }else if (event === "FullscreenOff") {
                        $("#videoId").css("width", "auto");
                        $("#videoId").css("height", "318px");
                    }
                 });
                 player.on('click', function(){
                   console.log('clicked function ');
                 });
              }
              });
            $('#videoId').css('width', '640px');
            $('#videoId').css('height', '318px');
    }
    playNormalVideo() {
       $('.p-video').remove();
        $('head').append('<link href="assets/js/indexjscss/video-hls-player/video-hls-js.css" class="h-video" rel="stylesheet">');
        $('head').append('<script src="assets/js/indexjscss/video-hls-player/video-hls.js" type="text/javascript" class="h-video"  />');
       $('head').append('<script src="assets/js/indexjscss/video-hls-player/videojs.hls.min.js" type="text/javascript"  class="h-video"/>');
        $('head').append('<script src="assets/js/indexjscss/videojs-playlist.js" type="text/javascript"  class="h-video" />');
        $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"" type="text/javascript"  class="h-video" />');
        this.is360Value = false;
  const str = '<video id="videoId" poster=' + this.posterImagePath + '  class="video-js vjs-default-skin" controls></video>';
            $('#newPlayerVideo').append(str);
            this.videoUrl = this.campaignVideoFile.videoPath;
            this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
           this.videoUrl =  this.videoUrl + '_mobinar.m3u8';
          //  this.videoUrl =  'http://vjs.zencdn.net/v/oceans.mp4';
            $('#newPlayerVideo video').append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
        //     $('#newPlayerVideo video').append('<source src=' + this.videoUrl + ' type="video/mp4">');
             $('#videoId').css('height', '318px');
             $('#videoId').css('width', '640px');
             $('.video-js .vjs-tech').css('width', '100%');
             $('.video-js .vjs-tech').css('height', '100%');
              const self = this;
             this.videoJSplayer = videojs('videoId',  { "controls": true, "autoplay": false, "preload": "auto" }, function() {
                    const player = this;
                    self.replyVideo = false;
                    const document: any = window.document;
                    let startDuration;
                    self.logVideoViewValue = true;
                    this.on('play', function() {
                    $('.vjs-big-play-button').css('display', 'none');
                    console.log('play button clicked and current time' + self.trimCurrentTime(player.currentTime()));
                     if (self.replyVideo === true) {
                          self.xtremandLog.actionId = self.LogAction.replyVideo;
                     } else {
                          self.xtremandLog.actionId = self.LogAction.playVideo;
                     }
                     self.xtremandLog.startTime = new Date();
                     self.xtremandLog.endTime = new Date();
                     self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime()).toString();
                     self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime()).toString();
                     self.getCurrentTimeValues(player.currentTime());
                      if (self.logVideoViewValue === true) {
                       self.videoLogAction(self.xtremandLog);
                       self.logVideoViewsCount();
                       self.logVideoViewValue = false;
                     }
                    });
                    this.on('pause', function() {
                     console.log('pused and current time' + self.trimCurrentTime(player.currentTime()));
                     const time =  self.timeConversion(player.currentTime());
                     console.log(time);
                     console.log(self.truncateHourZeros(time).toString());
                        self.xtremandLog.actionId = self.LogAction.pauseVideo;
                        self.xtremandLog.startTime = new Date();
                        self.xtremandLog.endTime = new Date();
                        self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime()).toString();
                        self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime()).toString();
                        self.videoLogAction(self.xtremandLog);
                        self.getCurrentTimeValues(player.currentTime());
                    });
                    this.on('timeupdate', function() {
                      startDuration = self.trimCurrentTime(player.currentTime());
                    });
                    this.on('seeking', function() {
                   //  self.replyVideo = false;
                   //  self.videoFileService.replyVideo = false;
                     const seekigTime  = self.trimCurrentTime(player.currentTime());
                     self.xtremandLog.actionId = self.LogAction.videoPlayer_slideSlider;
                     self.xtremandLog.startDuration = startDuration;
                     self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime()).toString();
                     self.xtremandLog.startTime = new Date();
                     self.xtremandLog.endTime = new Date();
                     self.videoLogAction(self.xtremandLog);
                  });
                  this.on('ended', function() {
                     const whereYouAt = player.currentTime();
                     console.log(whereYouAt);
                     self.logVideoViewValue = true;
                     self.replyVideo = true;
                     self.videoFileService.replyVideo = true;
                     $('.vjs-big-play-button').css('display', 'block');
                     self.xtremandLog.actionId = self.LogAction.videoPlayer_movieReachEnd;
                     self.xtremandLog.startTime = new Date();
                     self.xtremandLog.endTime = new Date();
                     self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime()).toString();
                     self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime()).toString();
                     self.videoLogAction(self.xtremandLog);
                  });
                  this.on('fullscreenchange', function () {
                    console.log('fullscreen changed');
                    const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                    const event = state ? 'FullscreenOn' : 'FullscreenOff';
                    if (event === "FullscreenOn") {
                        $(".vjs-tech").css("width", "100%");
                        $(".vjs-tech").css("height", "100%");
                    }else if (event === "FullscreenOff") {
                        $("#videoId").css("width", "auto");
                        $("#videoId").css("height", "318px");
                    }
                  });
                  player.on('click', function(){
                  console.log('clicked function ');
                  });
                 this.hotkeys({
                    volumeStep: 0.1, seekStep: 5, enableMute: true,
                    enableFullscreen: false, enableNumbers: false,
                    enableVolumeScroll: true,
                    fullscreenKey: function(event: any, player: any) {
                        return ((event.which === 70) || (event.ctrlKey && event.which === 13));
                    },
                    customKeys: {
                      simpleKey: {
                         key: function(e: any) {  return (e.which === 83); },
                         handler: function(player: any, options: any, e: any) {
                             if (player.paused()) {  player.play(); } else { player.pause(); }  } },
                      complexKey: {  key: function(e: any) { return (e.ctrlKey && e.which === 68); },
                         handler: function(player: any, options: any, event: any) {
                             if (options.enableMute) { player.muted(!player.muted()); }}
                      },
                      numbersKey: {
                         key: function(event: any) { return ((event.which > 47 && event.which < 59) ||
                              (event.which > 95 && event.which < 106)); },
                         handler: function(player: any, options: any, event: any) {
                             if (options.enableModifiersForNumbers || !(event.metaKey || event.ctrlKey || event.altKey)) {
                                 let sub = 48;
                                 if (event.which > 95) { sub = 96; }
                                 const number = event.which - sub;
                                 player.currentTime(player.duration() * number * 0.1); }  } },
                     emptyHotkey: { },
                     withoutKey: { handler: function(player: any, options: any, event: any) { console.log('withoutKey handler'); }},
                     withoutHandler: { key: function(e: any) { return true; }},
                     malformedKey: { key: function() {  console.log(' The Key function must return a boolean.'); },
                         handler: function(player: any, options: any, event: any) { }
                     } }  }); });
  //    this.videoPlayListSourceM3U8();
   }
   extractData( res: Response ) {
       const body = res.json();
       console.log(body);
       return body || {};
    }
    handleError( error: any ) {
        const errMsg = ( error.message ) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw( errMsg );
     }
  ngOnDestroy() {
     console.log('Deinit - Destroyed Component');
     if (this.videoJSplayer) {
        this.videoJSplayer.dispose(); }
          $('.h-video').remove();
          $('.p-video').remove();
  }
}
