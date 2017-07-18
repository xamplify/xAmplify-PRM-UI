import { Component, ElementRef, OnInit, OnDestroy, Input, Inject, AfterViewInit, Renderer} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HashLocationStrategy, Location, LocationStrategy , PathLocationStrategy } from '@angular/common';
import { VideoFileService} from '../services/video-file.service';
import { SaveVideoFile} from '../models/save-video-file';
import { Logger } from 'angular2-logger/core';
import { VideoUtilService } from '../services/video-util.service';
import { User } from '../../core/models/user';
import { ShareButton, ShareProvider } from 'ng2-sharebuttons';
import { DOCUMENT } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { ActionLog } from '../models/action';
declare var $, videojs: any;
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { Ng2DeviceService } from 'ng2-device-detector';
import { UUID } from 'angular2-uuid';
// logging info details
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
  selector: 'app-share-video',
  templateUrl: './share-video.component.html',
  styleUrls: ['../../../assets/css/video-css/video-js.custom.css'],
  providers: [VideoUtilService, ActionLog]
})
export class ShareVideoComponent implements OnInit, OnDestroy {
embedVideoFile: SaveVideoFile;
public user: User = new User();
private videoJSplayer: any;
public imgURL: string;
public videoUrl: string;
model: any = {};
public isPlay = false;
public isPlayButton: boolean;
public isOverlay: boolean;  // for disabled the play video button in the videojs overlay
public email_id: string;
public firstName: string;
public lastName: string;
public isSkipChecked: boolean; // isSkiped means to hide the videojs overlay for users
public showOverLay: boolean; // for show the videojs overlay modal at the start or end of the video
public isFistNameChecked: boolean;
public videoOverlaySubmit: string;
public overLayValue: string;
public posterImagePath: string;
public is360Value: boolean;
public embedUrl: string;
public routerAlias: string;
public routerType: string;
public sub: Subscription;
public title: string;
public upperTextValue: string;
public lowerTextValue: string;
public description: string;
public shareUrl: string;
// logging info details
public sessionId: string;
public deviceInfo: any;
LogAction: typeof LogAction = LogAction;
public persons;
public replyVideo: boolean;
  constructor(private router: Router, private route: ActivatedRoute, private videoFileService: VideoFileService,
              private logger: Logger, private videoUtilService: VideoUtilService, private metaService: Meta,
              private http: Http, private actionLog: ActionLog, private deviceService: Ng2DeviceService) {
                console.log('share component constructor called');
                console.log('url is on angular 2' + document.location.href);
                this.embedUrl = document.location.href;
             }
  shareMetaTags() {
    return this.http.get(this.shareUrl)
      .map( this.extractData )
      .catch( this.handleError )
      .subscribe((result: any) => { });
   }
  getVideo(alias: string , viewby: string) {
    this.videoFileService.getVideo(alias, viewby)
        .subscribe(
         (result: SaveVideoFile) => {
          this.embedVideoFile = result;
          console.log(result);
          this.xtremandLogDefaultActions();
          this.posterImagePath = this.embedVideoFile.imagePath;
          this.is360Value  =  this.embedVideoFile.is360video;
          this.imgURL =  this.embedVideoFile.gifImagePath;
          this.title = this.embedVideoFile.title;
          this.description = this.embedVideoFile.description;
          this.upperTextValue = this.embedVideoFile.upperText;
          this.lowerTextValue = this.embedVideoFile.lowerText;
        if (this.embedVideoFile.startOfVideo === true) {
            this.videoOverlaySubmit = 'PLAY';
        } else {  this.videoOverlaySubmit = 'SUBMIT'; }

        if (this.embedVideoFile.startOfVideo === true && this.embedVideoFile.callACtion === true ) {
            this.overLayValue = 'StartOftheVideo';
            this.videoOverlaySubmit = 'PLAY';
            this.isPlay = true;
        } else if ( this.embedVideoFile.endOfVideo === true && this.embedVideoFile.callACtion === true) {
            this.overLayValue = 'EndOftheVideo';
            this.isPlay = false;
            this.videoOverlaySubmit = 'SUBMIT';
        } else {this.overLayValue = 'removeCallAction';  }

        if (this.embedVideoFile.is360video === true) {
         this.play360Video();
        } else {
          this.playNormalVideo();
        }
       this.checkingCallToActionValues();
       this.defaultVideoSettings();
     //  this.transperancyControllBar(this.embedVideoFile.transparency);
       if (this.embedVideoFile.enableVideoController === false) {
           this.defaultVideoControllers();
          }
        this.defaultCallToActionValues();
            console.log(this.videoUrl);
 this.shareUrl = 'http://aravindu.com/xtremand-share/video?viewBy=' + this.embedVideoFile.viewBy + '&alias=' + this.embedVideoFile.alias;
         this.imgURL = this.embedVideoFile.gifImagePath;
         console.log(this.shareUrl);
         this.shareMetaTags();
          // twitter og info
            const twiettrDec = 'Xtremand is the only complete studio album by Jeff Buckley, released on August 23,';
            const twitterCard: MetaDefinition = { property: 'twitter:card', content: 'Tags summary' };
            const twitterSite: MetaDefinition = { property: 'twitter:site', content: '@michlbrmly'};
            const twitterTitle: MetaDefinition = { property: 'twitter:title', content: 'Xtremand Meta tags' };
            const twitterDesc: MetaDefinition = { property: 'twitter:description', content : twiettrDec};
            const twitterImage: MetaDefinition = { property: 'twitter:image', content : this.imgURL };
            const twitterUrl: MetaDefinition = { property: 'twitter:url', content: this.embedUrl };
           // open graph meta tags info
            // const ogDescription  = 'Xtremand is the only complete studio album by Jeff Buckley, released on August 23';
            // const ogtitle: MetaDefinition   =  { property: 'og:title', content: 'Xtremand Meta tags' };
            // const ogSiteproperty: MetaDefinition = { property: 'og:site_name', content: 'My Favourite Albums'};
            // const ogUrl: MetaDefinition = { property: 'og:url', content: this.embedUrl};
            // const ogdesc: MetaDefinition = { property: 'og:description', content: ogDescription };
            // const ogImage: MetaDefinition = { property: 'og:image', content: this.imgURL};
            //  this.metaService.addTags([ogtitle, ogSiteproperty, ogdesc, ogUrl, ogImage, twitterCard, twitterSite, twitterTitle,
            //  twitterDesc, twitterImage, twitterUrl], true);
            // const selector = 'property="og:title"';
            // const contentValue =   this.metaService.getTag(selector);
            // this.metaService.getTag(selector);
            // this.metaService.updateTag({ content: 'New Updated tags info'}, "property='og:title'");
            // this.metaService.updateTag({content:'Embed videos'},"property ='twitter:card'");
            // console.log(this.metaService.getTag(selector));
    });
  }
  ngOnInit() {
     $('#overlay-modal').hide();
     console.log('Share video component ngOnInit called');
     this.createSessionId();
     this.deviceDectorInfo();
     this.loacationDetails();
     this.routerType = this.route.snapshot.params['type'];
     this.routerAlias = this.route.snapshot.params['alias'];
   /*  this.sub = this.route.params.subscribe(
        (params: any) => {
            const typealias = params.typealias;
            const type = typealias.split("%");
            this.routerType = type[0];
            this.routerAlias = type[1];
         }
        );*/
     console.log( this.routerType  + ' and ' + this.routerAlias);
     this.getVideo(this.routerAlias, this.routerType);
     console.log(this.embedVideoFile);
  }
   defaultCallToActionValues() {
        this.isFistNameChecked = this.embedVideoFile.name;
        this.isSkipChecked = this.embedVideoFile.skip;
    }
    defaultVideoSettings() {
        console.log('default settings called');
        $('.video-js').css('color', this.embedVideoFile.playerColor);
        $('.video-js .vjs-play-progress').css('background-color', this.embedVideoFile.playerColor);
        $('.video-js .vjs-volume-level').css('background-color', this.embedVideoFile.playerColor);
        $('.video-js .vjs-control-bar').css('background-color', this.embedVideoFile.controllerColor);
        if (this.embedVideoFile.allowFullscreen === false) {
           $('.video-js .vjs-fullscreen-control').hide();
        } else { $('.video-js .vjs-fullscreen-control').show();
        }
    }
    checkingCallToActionValues() {
        if (this.isFistNameChecked === true && this.validateEmail(this.model.email_id)
         && this.firstName.length !== 0 && this.lastName.length !== 0) {
        this.isOverlay = false;
            console.log(this.model.email_id + 'mail ' + this.firstName + ' and last property ' + this.lastName);
        } else if (this.isFistNameChecked === false
         && this.validateEmail(this.model.email_id)) { this.isOverlay = false;
         } else { this.isOverlay = true; }
    }
     validateEmail(email: string) {
        const validation = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return validation.test(email);
    }
    skipClose() {
         $('#overlay-modal').hide();
       //  $('.video-js .vjs-control-bar').show();
         if (this.videoJSplayer) {
         this.videoJSplayer.play(); }
    }
    repeatPlayVideo() {
        $('#overlay-modal').hide();
     //   $('.video-js .vjs-control-bar').show();
        if (this.videoJSplayer) {
        this.videoJSplayer.play(); }
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
             this.videoUrl = this.embedVideoFile.videoPath;
             this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
             this.videoUrl = this.videoUrl + '.mp4';
           //  this.videoUrl = 'https://yanwsh.github.io/videojs-panorama/assets/shark.mp4'; // need to commet
             $('#newPlayerVideo video').append('<source src="' + this.videoUrl + '" type="video/mp4">');
            const player360 = this;
            const player = videojs('videoId').ready(function() {
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
                // const isValid = JSON.parse(localStorage.getItem('isOverlayValue'));
                 // player.ready();
                 const isValid = player360.overLayValue;
                 let startDuration;
                 player360.replyVideo = false;
                player.ready(function() {
                    if (isValid === 'StartOftheVideo' ) {
                      $('#videoId').append( $('#overlay-modal').show());
                      $('.vjs-big-play-button').css('display', 'block');
                   // newValue.show360ModalDialog();
                    } else if (isValid !== 'StartOftheVideo' ) {
                      $('#overlay-modal').hide(); player.play();
                    } else { $('#overlay-modal').hide();
                        player.play();
                     }
                      $('#skipOverlay').click(function(){
                         $('#overlay-modal').hide();
                         player.play();
                      });
                      $('#playorsubmit').click(function(){
                         $('#overlay-modal').hide();
                         player.play();
                     });
                 });
                player.on('play', function() {
                 const seekigTime  = player360.trimCurrentTime(player.currentTime());
                 console.log('ply button pressed ');
                       $('.vjs-big-play-button').css('display', 'none');
                    console.log('play button clicked and current time' + player360.trimCurrentTime(player.currentTime()));
                       if (player360.replyVideo === true) {
                          player360.actionLog.actionId = player360.LogAction.replyVideo;
                          player360.replyVideo = false;
                     } else {
                          player360.actionLog.actionId = player360.LogAction.playVideo;
                     }
                     player360.actionLog.startTime = new Date();
                     player360.actionLog.endTime = new Date();
                     player360.actionLog.startDuration = player360.trimCurrentTime(player.currentTime()).toString();
                     player360.actionLog.stopDuration = player360.trimCurrentTime(player.currentTime()).toString();
                     console.log(player360.actionLog.actionId);
                     player360.videoLogAction(player360.actionLog);
               });
                 player.on('pause', function() {
                  if (player360.actionLog.actionId !== player360.LogAction.videoPlayer_movieReachEnd) {
                     console.log('pused and current time' + player360.trimCurrentTime(player.currentTime()));
                     player360.actionLog.actionId = player360.LogAction.pauseVideo;
                     player360.actionLog.startTime = new Date();
                     player360.actionLog.endTime = new Date();
                     player360.actionLog.startDuration = player360.trimCurrentTime(player.currentTime()).toString();
                     player360.actionLog.stopDuration = player360.trimCurrentTime(player.currentTime()).toString();
                     player360.videoLogAction(player360.actionLog);
                     }
                  });
                player.on('seeking', function() {
                      const seekigTime  = player360.trimCurrentTime(player.currentTime());
                     player360.actionLog.actionId = player360.LogAction.videoPlayer_slideSlider;
                     player360.actionLog.startTime = new Date();
                     player360.actionLog.endTime = new Date();
                     player360.actionLog.startDuration = startDuration;
                     player360.actionLog.stopDuration = player360.trimCurrentTime(player.currentTime()).toString();
                     player360.videoLogAction(player360.actionLog);
                });
                player.on('timeupdate', function() {
                   startDuration = player360.trimCurrentTime(player.currentTime());
                });
                 player.on('ended', function() {
                    const time = player.currentTime();
                    console.log(time);
                    player.videoFileService.replyVideo = true;
                    player360.replyVideo = true;
                    player.videoFileService.replyVideo = true;
                    player360.actionLog.actionId = player360.LogAction.videoPlayer_movieReachEnd;
                    player360.actionLog.startTime = new Date();
                    player360.actionLog.endTime = new Date();
                    player360.actionLog.startDuration = player360.trimCurrentTime(player.currentTime()).toString();
                    player360.actionLog.stopDuration = player360.trimCurrentTime(player.currentTime()).toString();
                    player360.videoLogAction(player360.actionLog);
                     if (isValid === 'EndOftheVideo') {
                     $('#videoId').append( $('#overlay-modal').show());
                //     newValue.show360ModalDialog();
                     $('.video-js .vjs-control-bar').hide();
                    } else if (isValid !== 'EndOftheVideo') {
                        $('#overlay-modal').hide(); player.pause();
                    } else { $('#overlay-modal').hide(); player.pause(); }
                      $('#repeatPlay').click(function(){
                        player.play();
                      });
                      $('#skipOverlay').click(function(){
                         $('#overlay-modal').hide();
                         player.pause();
                     //    $('.video-js .vjs-control-bar').hide();
                      });
                      $('#playorsubmit').click(function(){
                         $('#overlay-modal').hide();
                         player.pause();
                     //    $('.video-js .vjs-control-bar').hide();
                     });
                  });
               player.on('click', function(){
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
  const str = '<video id="videoId" poster=' + this.posterImagePath +'  preload="none"  class="video-js vjs-default-skin" controls></video>';
            $('#newPlayerVideo').append(str);
            this.videoUrl = this.embedVideoFile.videoPath;
            this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
            this.videoUrl =  this.videoUrl + '_mobinar.m3u8';  // need to remove it
            $('#newPlayerVideo video').append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
           //  this.videoUrl = this.videoUrl + '.mp4?access_token=fab3819f-ee3f-4e39-aa23-c3c330784bc6';
          //   $("#newPlayerVideo video").append('<source src='+this.videoUrl+' type="video/mp4">');
             $('#videoId').css('height', '318px');
             $('#videoId').css('width', '640px');
             $('.video-js .vjs-tech').css('width', '100%');
             $('.video-js .vjs-tech').css('height', '100%');
              const self = this;
             this.videoJSplayer = videojs('videoId', {}, function() {
                const player = this;
                let startDuration;
                 self.replyVideo = false;
                const document: any = window.document;
                const isValid = self.overLayValue;
               this.ready(function() {
                      $('.video-js .vjs-tech').css('width', '100%');
                      $('.video-js .vjs-tech').css('height', '100%');
                  if (isValid === 'StartOftheVideo' ) {
                      $('.vjs-big-play-button').css('display', 'none');
                      $('#videoId').append( $('#overlay-modal').show());
                    } else if (isValid !== 'StartOftheVideo' ) {
                      $('.vjs-big-play-button').css('display', 'none');
                      $('#overlay-modal').hide(); player.play();
                      } else { $('#overlay-modal').hide(); }
                     $('#skipOverlay').click(function(){
                       $('#overlay-modal').hide();
                       player.play();
                    });
                    $('#playorsubmit').click(function(){
                       $('#overlay-modal').hide();
                       player.play();
                    });
                  });
               this.on('play', function() {
                 const seekigTime  = self.trimCurrentTime(player.currentTime());
                 console.log('ply button pressed ');
                       $('.vjs-big-play-button').css('display', 'none');
                    console.log('play button clicked and current time' + self.trimCurrentTime(player.currentTime()));
                       if (self.replyVideo === true) {
                          self.actionLog.actionId = self.LogAction.replyVideo;
                          self.replyVideo = false;
                     } else {
                          self.actionLog.actionId = self.LogAction.playVideo;
                     }
                     self.actionLog.startTime = new Date();
                     self.actionLog.endTime = new Date();
                     self.actionLog.startDuration = self.trimCurrentTime(player.currentTime()).toString();
                     self.actionLog.stopDuration = self.trimCurrentTime(player.currentTime()).toString();
                     console.log(self.actionLog.actionId);
                     self.videoLogAction(self.actionLog);
               });
                 this.on('pause', function() {
                  if (self.actionLog.actionId !== self.LogAction.videoPlayer_movieReachEnd) {
                     console.log('pused and current time' + self.trimCurrentTime(player.currentTime()));
                     self.actionLog.actionId = self.LogAction.pauseVideo;
                     self.actionLog.startTime = new Date();
                     self.actionLog.endTime = new Date();
                     self.actionLog.startDuration = self.trimCurrentTime(player.currentTime()).toString();
                     self.actionLog.stopDuration = self.trimCurrentTime(player.currentTime()).toString();
                     self.videoLogAction(self.actionLog);
                     }
                  });
                this.on('seeking', function() {
                      const seekigTime  = self.trimCurrentTime(player.currentTime());
                     self.actionLog.actionId = self.LogAction.videoPlayer_slideSlider;
                     self.actionLog.startTime = new Date();
                     self.actionLog.endTime = new Date();
                     self.actionLog.startDuration = startDuration;
                     self.actionLog.stopDuration = self.trimCurrentTime(player.currentTime()).toString();
                     self.videoLogAction(self.actionLog);
                });
                this.on('timeupdate', function() {
                   startDuration = self.trimCurrentTime(player.currentTime());
                });
             this.on('ended', function() {
                   const time = player.currentTime();
                    console.log(time);
                    self.replyVideo = true;
                    console.log('video ended attempts' + self.replyVideo);
                    self.actionLog.actionId = self.LogAction.videoPlayer_movieReachEnd;
                    self.actionLog.startTime = new Date();
                    self.actionLog.endTime = new Date();
                    self.actionLog.startDuration = self.trimCurrentTime(player.currentTime()).toString();
                    self.actionLog.stopDuration = self.trimCurrentTime(player.currentTime()).toString();
                    self.videoLogAction(self.actionLog);
                 if (isValid === 'EndOftheVideo') {
                     $('.vjs-big-play-button').css('display', 'none');
                     $('#videoId').append( $('#overlay-modal').show());
                 } else if (isValid !== 'EndOftheVideo') {
                      $('.vjs-big-play-button').css('display', 'none');
                      $('#overlay-modal').hide(); //  player.pause();
                     } else { $('#overlay-modal').hide(); // player.pause(); 
                      }
                    $('#repeatPlay').click(function(){
                      self.replyVideo = true;
                       player.play();
                    });
                     $('#skipOverlay').click(function(){
                       $('#overlay-modal').hide();
                    });
                    $('#playorsubmit').click(function(){
                       $('#overlay-modal').hide();
                    });
             });
             this.on('contextmenu', function(e) {
                 e.preventDefault();
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
    trimCurrentTime(currentTime) {
        return Math.round(currentTime * 100) / 100;
    }
    defaultVideoControllers() {
        if (this.embedVideoFile.enableVideoController === false) { $('.video-js .vjs-control-bar').hide();
      } else { $('.video-js .vjs-control-bar').show(); }
    }
    transperancyControllBar(value: any) {
        const rgba = this.videoUtilService.convertHexToRgba(this.embedVideoFile.controllerColor, value);
        $('.video-js .vjs-control-bar').css('background-color', rgba);
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
     // the below code is used for logging //////////////////////////////

 deviceDectorInfo() {
      console.log('device info in component');
      this.deviceInfo = this.deviceService.getDeviceInfo();
      console.log(this.deviceInfo);
      this.loacationDetails();
 }
 xtremandLogDefaultActions() {
        // router info
        this.actionLog.videoAlias = this.embedVideoFile.alias;
        // device detector
        this.actionLog.deviceType = this.deviceInfo.device;
        this.actionLog.os = this.deviceInfo.os;
        // location detector
         console.log(this.actionLog);
        this.actionLog.sessionId = this.sessionId;
      }
    defaultLocationJsonValues(data: any) {
        this.actionLog.city = data.city;
        this.actionLog.country = data.country;
        this.actionLog.isp = data.isp;
        this.actionLog.ipAddress = data.query;
        this.actionLog.state = data.regionName;
        this.actionLog.zip = data.zip;
        this.actionLog.latitude = data.lat;
        this.actionLog.longitude = data.lon;
        this.actionLog.countryCode = data.countryCode;
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
   videoLogAction(actionLog: ActionLog) {
       this.videoFileService.logVideoActions(actionLog).subscribe(
       (result: any) => {
         console.log('successfully logged the actions');
         console.log(this.actionLog.actionId);
     });
    }
   saveCallToActionUserForm() {
        $('#overlay-modal').hide();
        if (this.videoJSplayer) {
        if (this.videoOverlaySubmit === 'PLAY') {
            this.videoJSplayer.play();
         }else { this.videoJSplayer.pause(); }}
        this.logger.debug(this.model.email_id);
        this.user.emailId = this.model.email_id;
        this.user.firstName = this.firstName;
        this.user.lastName = this.lastName;
        this.logger.debug(this.user);
        this.videoFileService.saveCalltoActionUser(this.user)
            .subscribe( (result: any) => {
                this.logger.info('Save user Form call to acton is successfull' + result); });
       }
shareMethod() {
        this.actionLog.actionId = this.LogAction.shareMobinar;
        this.actionLog.startTime = new Date();
        this.actionLog.endTime = new Date();
        this.actionLog.startDuration = this.trimCurrentTime(new Date().getTime()).toString();
        this.actionLog.stopDuration = this.trimCurrentTime(new Date().getTime()).toString();
        this.videoLogAction(this.actionLog);
}
  ngOnDestroy() {
     this.logger.info('Deinit - Destroyed Share-Video Component');
     if (this.videoJSplayer) {
        this.videoJSplayer.dispose(); }
          $('.h-video').remove();
          $('.p-video').remove();
    //  this.sub.unsubscribe();
    // og info
    //  this.metaService.removeTag("property='og:title'");
    //  this.metaService.removeTag("property='og:site_name'");
    //  this.metaService.removeTag("property='og:url'");
    //  this.metaService.removeTag("property='og:description'");
    //  this.metaService.removeTag("property='og:image'");
    // twitter og info
    //  this.metaService.removeTag("property='twitter:card'");
    //  this.metaService.removeTag("property='twitter:site'");
    //  this.metaService.removeTag("property='twitter:title'");
    //  this.metaService.removeTag("property='twitter:description'");
    //  this.metaService.removeTag("property='twitter:url'");
    //  this.metaService.removeTag("property='twitter:image'");
  }
}
