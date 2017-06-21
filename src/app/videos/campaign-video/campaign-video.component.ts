import { Component, ElementRef, OnInit, OnDestroy, Input, Inject, AfterViewInit, Renderer} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HashLocationStrategy, Location, LocationStrategy , PathLocationStrategy } from '@angular/common';
import { VideoFileService} from '../services/video-file.service';
import { SaveVideoFile} from '../models/save-video-file';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Logger } from 'angular2-logger/core';
declare var $, videojs: any;
@Component({
  selector: 'app-public-video',
  templateUrl: './campaign-video.component.html',
  styleUrls: ['./campaign-video.component.css']
})
export class CampaignVideoComponent implements OnInit , OnDestroy {
campaignVideoFile: SaveVideoFile;
private videoJSplayer: any;
public videoUrl: string;
public posterImagePath: string;
public is360Value: boolean;
public routerAlias: string;
public routerType: string;
public title: string;
public description: string;
public publicRouterUrl: string;
  constructor(private router: Router, private route: ActivatedRoute, private videoFileService: VideoFileService,
            private _logger: Logger, private http: Http,private authenticationService: AuthenticationService ) {
            console.log('share component constructor called');
            console.log('url is on angular 2' + document.location.href);
            this.publicRouterUrl = document.location.href;
          }
LoginThroghCampaign() {
   this.router.navigate( ['/login']);
} 
  getCampaignVideo(alias: string , viewby: string) {
    this.videoFileService.getVideo(alias, viewby)
        .subscribe(
         (result: SaveVideoFile) => {
          this.campaignVideoFile = result;
          console.log(result);
          this.posterImagePath = this.campaignVideoFile.imagePath;
          this.is360Value  =  this.campaignVideoFile.is360video;
          this.title = this.campaignVideoFile.title;
          this.description = this.campaignVideoFile.description;
        if (this.campaignVideoFile.is360video === true) {
         this.play360Video();
        } else {
          this.playNormalVideo();
        }
       this.defaultVideoSettings();
          console.log(this.videoUrl);
    });
  }
  ngOnInit() {
     console.log('public video component ngOnInit called');
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
     this.getCampaignVideo(this.routerAlias, this.routerType);
     console.log(this.campaignVideoFile);
  }
    defaultVideoSettings() {
        console.log('default settings called');
        $('.video-js').css('color', this.campaignVideoFile.playerColor);
        $('.video-js .vjs-play-progress').css('background-color', this.campaignVideoFile.playerColor);
        $('.video-js .vjs-volume-level').css('background-color', this.campaignVideoFile.playerColor);
        $('.video-js .vjs-control-bar').css('background-color', this.campaignVideoFile.controllerColor);
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
                player.ready(function() {
                      this.play();
                 });
                 player.on('ended', function() {
                      console.log('done !');
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
  const str = '<video id="videoId" poster = " " preload="none"  class="video-js vjs-default-skin" controls></video>';
            $('#newPlayerVideo').append(str);
            this.videoUrl = this.campaignVideoFile.videoPath;
            this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
         //   this.videoUrl =  this.videoUrl + '_mobinar.m3u8';
            this.videoUrl =  'http://vjs.zencdn.net/v/oceans.mp4';
          //  $('#newPlayerVideo video').append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
             $('#newPlayerVideo video').append('<source src=' + this.videoUrl + ' type="video/mp4">');
             $('#videoId').css('height', '318px');
             $('#videoId').css('width', '640px');
             $('.video-js .vjs-tech').css('width', '100%');
             $('.video-js .vjs-tech').css('height', '100%');
              const self = this;
             this.videoJSplayer = videojs('videoId', {}, function() {
                const player = this;
                const document: any = window.document;
               this.ready(function() {
                   player.play();
                  });
             this.on('ended', function() {
                    console.log('done !');
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
