import { Component, OnInit, Input, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import {SaveVideoFile} from '../../models/save-video-file';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { VideoUtilService } from '../../services/video-util.service';
declare var videojs, Metronic, Layout, $ , Demo, QuickSidebar, Index, Tasks, require: any;

@Component({
    selector: 'app-campaign-report-video',
    templateUrl: './campaign-report-video.component.html',
    styleUrls: ['./campaign-report-video.component.css', '../../../../assets/css/video-css/video-js.custom.css']
})
export class CampaignReportVideoComponent implements OnInit, OnDestroy , AfterViewInit {
    @Input() selectedVideo: SaveVideoFile;
    private _elementRef: ElementRef;
    private videoJSplayer: any;
    public videoUrl: string;
    public is360Value: boolean;
    public overLayValue: string;
    public posterImagePath: string;
    public isFistNameChecked: boolean;
    public firstName: string;
    public lastName: string;
    public isOverlay: boolean;
    public videoOverlaySubmit: string;
    public isSkipChecked: boolean;
    model: any = {};
    public percent: number;
    public options: any;
    constructor(elementRef: ElementRef, private authenticationService: AuthenticationService,
     private videoUtilService: VideoUtilService) {
            this._elementRef = elementRef;
            this.percent = 80;
            this.options = {
            barColor: '#ef1e25',
            trackColor: '#f9f9f9',
            scaleColor: '#dfe0e0',
            scaleLength: 5,
            lineCap: 'round',
            lineWidth: 3,
            size: 180,
            rotate: 0,
            animate: {
                duration: 1000,
                enabled: true
            }
            };
    }
    defaultVideoSettings() {
        console.log('default settings called');
        $('.video-js').css('color', this.selectedVideo.playerColor);
        $('.video-js .vjs-play-progress').css('background-color', this.selectedVideo.playerColor);
        $('.video-js .vjs-volume-level').css('background-color', this.selectedVideo.playerColor);
        $('.video-js .vjs-control-bar').css('background-color', this.selectedVideo.controllerColor);
        if (this.selectedVideo.allowFullscreen === false) {
           $('.video-js .vjs-fullscreen-control').hide();
        } else {    $('.video-js .vjs-fullscreen-control').show();
        }
    }
    defaultVideoControllers() {
        if (this.selectedVideo.enableVideoController === false) { $('.video-js .vjs-control-bar').hide();
       } else { $('.video-js .vjs-control-bar').show(); }
    }
    transperancyControllBar(value: any) {
        const rgba = this.videoUtilService.convertHexToRgba(this.selectedVideo.controllerColor, value);
        $('.video-js .vjs-control-bar').css('background-color', rgba);
    }
      checkingCallToActionValues() {
        if (this.isFistNameChecked === true && this.videoUtilService.validateEmail(this.model.email_id)
         && this.firstName.length !== 0 && this.lastName.length !== 0) {
        this.isOverlay = false;
            console.log(this.model.email_id + 'mail ' + this.firstName + ' and last name ' + this.lastName);
        } else if (this.isFistNameChecked === false
         && this.videoUtilService.validateEmail(this.model.email_id)) { this.isOverlay = false;
          } else { this.isOverlay = true; }
    }
    campaignVideoCallToAction() {
        this.isFistNameChecked = this.selectedVideo.name;
        this.firstName = this.authenticationService.user.firstName;
        this.lastName = this.authenticationService.user.lastName;
        this.isSkipChecked = this.selectedVideo.skip;
        this.model.email_id = this.authenticationService.user.emailId;
        if (this.selectedVideo.callACtion === true && this.selectedVideo.startOfVideo === true) {
        this.videoOverlaySubmit = 'PLAY';
        this.overLayValue = 'StartOftheVideo';
        } else if (this.selectedVideo.callACtion === true && this.selectedVideo.endOfVideo === true) {
            this.videoOverlaySubmit = 'SUBMIT';
              this.overLayValue = 'EndOftheVideo';
        } else {
             this.overLayValue = 'removeCallAction';
        }
    }
    skipClose() {
         $('#overlay-modal').hide();
         if (this.videoJSplayer) {
         this.videoJSplayer.play(); }
    }
    repeatPlayVideo() {
        $('#overlay-modal').hide();
        if (this.videoJSplayer) {
        this.videoJSplayer.play(); }
   }
     show360ModalDialog() {
     $('#overLayDialog').append( $('#overlay-modal').show());
    // $('#videoId').append( $('#overlay-modal').show());
   }
    ngOnInit() {
        this.posterImagePath = this.selectedVideo.imagePath;
        this.campaignVideoCallToAction();
        QuickSidebar.init();
        Index.init();
        Index.initDashboardDaterange();
        Index.initJQVMAP();
        Index.initCalendar();
        Index.initCharts();
        Index.initChat();
        Index.initMiniCharts();
        Tasks.initDashboardWidget();
    }
    ngAfterViewInit() {
        console.log('called ng after view init');
         $('#newPlayerVideo').empty();
       if (this.selectedVideo.is360video !== true) {
         this.is360Value = false;
         this.playNormalVideo();
       } else {
           this.play360Video();
       }
         this.defaultVideoSettings();
         this.transperancyControllBar(this.selectedVideo.transparency);
       if (this.selectedVideo.enableVideoController === false) {
           this.defaultVideoControllers(); }
    } // ng After view closed
     playNormalVideo() {
        $('.p-video').remove();
         $('head').append('<link href="assets/js/indexjscss/video-hls-player/video-hls-js.css" class="h-video" rel="stylesheet">');
         $('head').append('<script src="assets/js/indexjscss/video-hls-player/video-hls.js" type="text/javascript" class="h-video"  />');
 $('head').append('<script src="assets/js/indexjscss/video-hls-player/videojs.hls.min.js" type="text/javascript"  class="h-video"/>');
         $('head').append('<script src="assets/js/indexjscss/videojs-playlist.js" type="text/javascript"  class="h-video" />');
         $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"" type="text/javascript"  class="h-video" />');
         this.is360Value = false;
const str = '<video id="videoId" poster=' + this.posterImagePath + 'preload="none"  class="video-js vjs-default-skin" controls></video>';
             $('#newPlayerVideo').append(str);
             this.videoUrl = this.selectedVideo.videoPath;
             this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
             this.videoUrl = this.videoUrl + '._mobinar.m3u8?access_token=' + this.authenticationService.access_token;
             $('#newPlayerVideo video').append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
              $('#videoId').css('height', '250px');
              $('#videoId').css('width', '532px');
              $('.video-js .vjs-tech').css('width', '100%');
              $('.video-js .vjs-tech').css('height', '100%');
               const self = this;
              this.videoJSplayer = videojs('videoId', {}, function() {
                 const player = this;
                 const document: any = window.document;
                 const isValid = self.overLayValue;
                this.ready(function() {
                       $('.video-js .vjs-tech').css('width', '100%');
                       $('.video-js .vjs-tech').css('height', '100%');
                   if (isValid === 'StartOftheVideo' ) {
                       $('.vjs-big-play-button').css('display', 'none');
                       self.show360ModalDialog();
                     //  $('#videoId').append( $('#overlay-modal').show());
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
              this.on('ended', function() {
                  if (isValid === 'EndOftheVideo') {
                      $('.vjs-big-play-button').css('display', 'none');
                      $('#videoId').append( $('#overlay-modal').show());
                      self.show360ModalDialog();
                  } else if (isValid !== 'EndOftheVideo') {
                       $('.vjs-big-play-button').css('display', 'none');
                       $('#overlay-modal').hide(); player.pause();
                      } else { $('#overlay-modal').hide(); player.pause(); }
                     $('#repeatPlay').click(function(){
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
    }
    play360Video() {
        this.is360Value = true;
        console.log('Loaded 360 Video');
        $('.h-video').remove();
        $('head').append('<script src="assets/js/indexjscss/360-video-player/video.js" type="text/javascript" class="p-video"/>');
        $('head').append('<script src="assets/js/indexjscss/360-video-player/three.js" type="text/javascript" class="p-video" />');
        $('head').append('<link href="assets/js/indexjscss/360-video-player/videojs-panorama.min.css" rel="stylesheet" class="p-video">');
$('head').append('<script src="assets/js/indexjscss/360-video-player/videojs-panorama.v5.js" type="text/javascript" class="p-video" />');
        $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"" type="text/javascript"  class="p-video" />');
const str = '<video id=videoId poster=' + this.posterImagePath +' class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
                $('#newPlayerVideo').append(str);
                 this.videoUrl = this.selectedVideo.videoPath;
                 this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
                 this.videoUrl = this.videoUrl + '.mp4?access_token=' + this.authenticationService.access_token;
                // this.videoUrl = 'https://yanwsh.github.io/videojs-panorama/assets/shark.mp4'; // need to commet
                 $('#newPlayerVideo video').append('<source src="' + this.videoUrl + '" type="video/mp4">');
                const newValue = this;
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
                     const isValid = newValue.overLayValue;
                    player.ready(function() {
                        if (isValid === 'StartOftheVideo' ) {
                        //  $('#videoId').append( $('#overlay-modal').show());
                          $('.vjs-big-play-button').css('display', 'block');
                        newValue.show360ModalDialog();
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
                     player.on('ended', function() {
                         if (isValid === 'EndOftheVideo') {
                    //     $('#videoId').append( $('#overlay-modal').show());
                         newValue.show360ModalDialog();
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
                $('#videoId').css('width', '532px');
                $('#videoId').css('height', '250px');
        }
    ngOnDestroy() {
        console.log('Deinit - Destroyed Component');
      if ( this.is360Value !== true) {
          this.videoJSplayer.dispose();
       } else if (this.videoJSplayer) {
            this.videoJSplayer.dispose();
       } else { }
          $('.h-video').remove();
          $('.p-video').remove();
      }
}
