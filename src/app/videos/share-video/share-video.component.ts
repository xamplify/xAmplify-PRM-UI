import { Component, ElementRef, OnInit, OnDestroy, Input, Inject, AfterViewInit, Renderer} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HashLocationStrategy, Location, LocationStrategy , PathLocationStrategy } from '@angular/common';
import { VideoFileService} from '../services/video-file.service';
import { SaveVideoFile} from '../models/save-video-file';
import { Category} from '../models/category';
import { AuthenticationService} from '../../core/services/authentication.service';
import { Logger } from 'angular2-logger/core';
import { UtilService } from '../services/util.service';
import { ShareButton, ShareProvider } from 'ng2-sharebuttons';
import { DOCUMENT } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
// import {DomAdapter, getDOM} from '@angular/platform-browser/src/dom/dom_adapter';
declare var $, videojs: any;
// import {BrowserDomAdapter} from 'angular2/platform/browser';
// import { Meta ,MetaDefinition} from '../../core/services/angular2-meta.service';
import { Meta, MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-share-video',
  templateUrl: './share-video.component.html',
  styleUrls: ['../../../assets/css/video-css/video-js.custom.css'],
  providers: [UtilService]
})
export class ShareVideoComponent implements OnInit {
embedVideoFile: SaveVideoFile;
saveVideoFile: SaveVideoFile;
private videoJSplayer: any;
public imgURL: string;
public videoUrl: string;
model: any = {};
public isPlay = false;
public isThumb: boolean;
public isPlayButton: boolean;
public isOverlay: boolean;  // for disabled the play video button in the videojs overlay
public email_id: string;
public firstproperty: string;
public lastproperty: string;
public isSkipChecked: boolean; // isSkiped means to hide the videojs overlay for users
public showOverLay: boolean; // for show the videojs overlay modal at the start or end of the video
public isFistpropertyChecked: boolean;
public lowerTextValue: string;
public upperTextValue: string;
public videoOverlaySubmit: string;
public overLayValue: string; // vid
public posterImagePath: string;
public is360Value: boolean;
public valueRange: number;

twitterButtons: any;
googleButtons: any;
facebookButtons: any;
metatags: any;
public embedUrl: string;
public routerAlias: string;
public routerType: string;
public sub: Subscription;
public title: string;
public description: string;
 // private _dom: DomAdapter = getDOM();
// @Inject(DOCUMENT) private document:any , ,private metaService:Meta
  constructor(private router: Router, private route: ActivatedRoute, private videoFileService: VideoFileService,
            private _logger: Logger, private utilService: UtilService, private metaService: Meta,
            @Inject(DOCUMENT) private document: any, private renderer: Renderer) {
            console.log('share component constructor called');
            console.log('url is on angular 2' + document.location.href);
            this.embedUrl = document.location.href;
        }
  getVideo(alias: string , viewby: string) {
    this.videoFileService.getVideo(alias, viewby)
        .subscribe(
        data => {
          this.embedVideoFile = data;
          console.log(data);
          this.posterImagePath = this.embedVideoFile.imagePath;
          this.lowerTextValue = this.embedVideoFile.lowerText;
          this.upperTextValue = this.embedVideoFile.upperText;
          this.is360Value  =  this.embedVideoFile.is360video;
          this.imgURL =  this.embedVideoFile.gifImagePath;
          this.title = this.embedVideoFile.title;
          this.description = this.embedVideoFile.description;
        if(this.embedVideoFile.startOfVideo === true) {this.videoOverlaySubmit = 'PLAY'; }
        else {  this.videoOverlaySubmit = 'SUBMIT'; }

        if (this.embedVideoFile.startOfVideo === true && this.embedVideoFile.callACtion === true ) {
            this.overLayValue = 'StartOftheVideo';
            this.videoOverlaySubmit = 'PLAY';
            this.isPlay = true;
        }
        else if ( this.embedVideoFile.endOfVideo === true && this.embedVideoFile.callACtion === true) {
            this.overLayValue = 'EndOftheVideo';
            this.isPlay = false;
            this.videoOverlaySubmit = 'SUBMIT';
        }
        else {this.overLayValue = 'removeCallAction';  }

        if(this.embedVideoFile.is360video === true){
         this.play360Video();
        }
        else{
          this.playNormalVideo();
        }
       this.checkingCallToActionValues();
       this.defaultVideoSettings();
       this.transperancyControllBar(this.valueRange);
       if (this.embedVideoFile.enableVideoController === false)
       { this.defaultVideoControllers();}
        this.defaultValues();
            console.log(this.videoUrl);
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
            //  this.metaService.addTag({ property: 'og:title', content: 'Xtremand Videos' });
            //  this.metaService.addTag({ property: 'og:description', content: ogDescription });
            //  this.metaService.addTag({ property: 'og:site_name', content: 'My Favourite Albums'});
            //  this.metaService.addTag({ property: 'og:url', content: this.embedUrl});
            //  this.metaService.addTag({ property: 'og:image', content: this.imgURL});
            const selector = 'property="og:title"';
            const contentValue =   this.metaService.getTag(selector);
            this.metaService.getTag(selector);
         //  let contentValue =  document.head.querySelector("[property=og:title]");
           console.log(contentValue);
            this.metaService.updateTag({ content: 'New Updated tags info'}, "property='og:title'");
            this.metaService.updateTag({content:'Embed videos'},"property ='twitter:card'");
         console.log(this.metaService.getTag(selector));
    });
  }
  ngAfterViewInit(){
    //  alert("called ngafter");
  //    $(".addthis_sharing_toolbox").load(location.href + " .addthis_sharing_toolbox");
  }
  ngOnInit() {
     $('#overlay-modal').hide();
     console.log('Share video component ngOnInit called');
    // this.routerType = this.route.snapshot.params['type'];
    // this.routerAlias = this.route.snapshot.params['alias'];
     this.sub = this.route.params.subscribe(
        (params: any) => {
            const typealias = params.typealias;
            const type = typealias.split("%");
            this.routerType = type[0];
            this.routerAlias = type[1];
         }
        );
     console.log( this.routerType  + ' and ' + this.routerAlias);
     this.getVideo(this.routerAlias, this.routerType);
     console.log(this.embedVideoFile);
     this.googleButtons = new ShareButton(
        ShareProvider.GOOGLEPLUS,              // choose the button from ShareProvider
        "<img src='assets/images/google+.png' style='height: 32px;'>",    // set button template
        'twitter'                           // set button classes
      );

   this.twitterButtons = new ShareButton(
       ShareProvider.TWITTER,              // choose the button from ShareProvider
       "<img src='assets/images/twitter.png' style='height: 32px;'>",    // set button template
       'twitter'                           // set button classes
     );

this.facebookButtons = new ShareButton(
       ShareProvider.FACEBOOK,              // choose the button from ShareProvider
       "<img src='assets/images/facebook.png' style='height: 32px;'>",    // set button template
       'fb'                           // set button classes
     );
  }
   defaultValues() {
        this.valueRange = this.embedVideoFile.transparency;
        this.isFistpropertyChecked = this.embedVideoFile.name;
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
        }
        else { 	$('.video-js .vjs-fullscreen-control').show();
        }
    }
    checkingCallToActionValues() {
        if (this.isFistpropertyChecked === true && this.validateEmail(this.model.email_id)
         && this.firstproperty.length !== 0 && this.lastproperty.length !== 0) {
        this.isOverlay = false;
            console.log(this.model.email_id + 'mail ' + this.firstproperty + ' and last property ' + this.lastproperty);
        }
        else if (this.isFistpropertyChecked === false
         && this.validateEmail(this.model.email_id)) { this.isOverlay = false; }
        else { this.isOverlay = true; }
    }
     validateEmail(email: string) {
        const validation = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return validation.test(email);
    }
    skipClose() {
         $('#overlay-modal').hide();
       //  $('.video-js .vjs-control-bar').show();
         if(this.videoJSplayer){
         this.videoJSplayer.play();}
    }
    repeatPlayVideo(){
        $('#overlay-modal').hide();
     //   $('.video-js .vjs-control-bar').show();
        if(this.videoJSplayer){
        this.videoJSplayer.play();}
   }
   play360Video() {
    this.is360Value = true;
   // $('embed_video_player').empty();
    console.log('Loaded 360 Video');
    $('.h-video').remove();
    $('head').append('<script src="assets/js/indexjscss/360-video-player/video.js" type="text/javascript"  class="p-video"/>');
    $('head').append('<script src="assets/js/indexjscss/360-video-player/three.js" type="text/javascript"  class="p-video" />');
    $('head').append('<link href="assets/js/indexjscss/360-video-player/videojs-panorama.min.css" rel="stylesheet"  class="p-video">');
$('head').append('<script src="assets/js/indexjscss/360-video-player/videojs-panorama.v5.js" type="text/javascript"  class="p-video" />');
    $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"" type="text/javascript"  class="p-video" />');
const str = '<video id=videoId class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
            $("#newPlayerVideo").append(str);
             this.videoUrl = this.embedVideoFile.videoPath;
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
                         key: function(e: any) {  return (e.which === 83);},
                         handler: function(player: any, options: any, e: any) {
                             if (player.paused()) {  player.play();} else { player.pause(); }  } },
                     complexKey: {  key: function(e: any) { return (e.ctrlKey && e.which === 68);},
                         handler: function(player: any, options: any, event: any) {
                             if (options.enableMute) { player.muted(!player.muted()); }}
                     },
                     numbersKey: {
                         key: function(event: any) { return ((event.which > 47 && event.which < 59) ||
                              (event.which > 95 && event.which < 106)); },
                         handler: function(player: any, options: any, event: any) {
                             if (options.enableModifiersForNumbers || !(event.metaKey || event.ctrlKey || event.altKey)) {
                                 var sub = 48;
                                 if (event.which > 95) { sub = 96; }
                                 var number = event.which - sub;
                                 player.currentTime(player.duration() * number * 0.1); }  } },
                     emptyHotkey: { },
                     withoutKey: { handler: function(player: any, options: any, event: any) { console.log('withoutKey handler');}},
                     withoutHandler: { key: function(e: any) { return true;}},
                     malformedKey: { key: function() {  console.log(' The Key function must return a boolean.');},
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
                      $('#videoId').append( $('#overlay-modal').show());
                    $('.vjs-big-play-button').css('display', 'block');
                   // newValue.show360ModalDialog();
                    }
                    else if(isValid !== 'StartOftheVideo' ) {
                      $('#overlay-modal').hide(); player.play(); }
                  //  if (isValid === 'removeCallAction'){ $('#overlay-modal').hide();player.play(); }
                    else { $('#overlay-modal').hide();
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
                     $('#videoId').append( $('#overlay-modal').show());
                //     newValue.show360ModalDialog();
                     $('.video-js .vjs-control-bar').hide();
                    }
                     else if(isValid !== 'EndOftheVideo') {
                        $('#overlay-modal').hide(); player.pause();}
                   //  if (isValid === 'removeCallAction'){$('#overlay-modal').hide(); player.pause();}
                     else { $('#overlay-modal').hide(); player.pause(); }
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
               })
              }
              });
            $('#videoId').css('width', '640px');
            $('#videoId').css('height', '318px');
    }
    showEditModalDialog(){
    //  $('#overLayDialog').append( $('#overlay-modal').show());
      // $('#edit_video_player').append( $('#overlay-modal').show());
      $('#overlay-modal').hide();
    }
    show360ModalDialog(){
    // $('#overLayDialog').append( $('#overlay-modal').show());
    // $('#videoId').append( $('#overlay-modal').show());
    $('#overlay-modal').hide();
  }
    playNormalVideo() {
       $('.p-video').remove();
        $('head').append('<link href="assets/js/indexjscss/video-hls-player/video-hls-js.css" class="h-video" rel="stylesheet">');
        $('head').append('<script src="assets/js/indexjscss/video-hls-player/video-hls.js" type="text/javascript" class="h-video"  />');
       $('head').append('<script src="assets/js/indexjscss/video-hls-player/videojs.hls.min.js" type="text/javascript"  class="h-video"/>');
        $('head').append('<script src="assets/js/indexjscss/videojs-playlist.js" type="text/javascript"  class="h-video" />');
        $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"" type="text/javascript"  class="h-video" />');
        this.is360Value = false;
  const str = '<video id="videoId"  poster=' +this.posterImagePath +' preload="none"  class="video-js vjs-default-skin" controls></video>';
            $("#newPlayerVideo").append(str);
            this.videoUrl = this.embedVideoFile.videoPath;
            this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
            this.videoUrl =  this.videoUrl + '_mobinar.m3u8';
            $("#newPlayerVideo video").append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
             $("#videoId").css("height", "318px");
             $("#videoId").css("width", "640px");
             $(".video-js .vjs-tech").css("width", "100%");
             $(".video-js .vjs-tech").css("height", "100%");
              const self = this;
             this.videoJSplayer = videojs('videoId', {}, function() {
                const player = this;
                const document: any = window.document;
                const isValid = self.overLayValue;
               this.ready(function() {
                      $(".video-js .vjs-tech").css("width", "100%");
                      $(".video-js .vjs-tech").css("height", "100%");
                  if (isValid === 'StartOftheVideo' ) {
                      $('.vjs-big-play-button').css('display', 'none');
                    //  self.showEditModalDialog();
                      $('#videoId').append( $('#overlay-modal').show());
                    }
                 else if(isValid !== 'StartOftheVideo' ) {
                      $('.vjs-big-play-button').css('display', 'none');
                      $('#overlay-modal').hide(); player.play(); }
                // if (isValid === 'removeCallAction'){ $('#overlay-modal').hide(); }
                 else { $('#overlay-modal').hide(); }
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
                   //  self.showEditModalDialog();
                }
                 else if(isValid !== 'EndOftheVideo') {
                      $('.vjs-big-play-button').css('display', 'none');
                      $('#overlay-modal').hide(); player.pause();}
               /*  if (isValid === 'removeCallAction'){ 
                      $('.vjs-big-play-button').css('display', 'none');
                      $('#overlay-modal').hide(); player.pause();} */
                 else { $('#overlay-modal').hide(); player.pause(); }
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
                         key: function(e: any) {  return (e.which === 83);},
                         handler: function(player: any, options: any, e: any) {
                             if (player.paused()) {  player.play();} else { player.pause(); }  } },
                     complexKey: {  key: function(e: any) { return (e.ctrlKey && e.which === 68);},
                         handler: function(player: any, options: any, event: any) {
                             if (options.enableMute) { player.muted(!player.muted()); }}
                     },
                     numbersKey: {
                         key: function(event: any) { return ((event.which > 47 && event.which < 59) ||
                              (event.which > 95 && event.which < 106)); },
                         handler: function(player: any, options: any, event: any) {
                             if (options.enableModifiersForNumbers || !(event.metaKey || event.ctrlKey || event.altKey)) {
                                 var sub = 48;
                                 if (event.which > 95) { sub = 96; }
                                 var number = event.which - sub;
                                 player.currentTime(player.duration() * number * 0.1); }  } },
                     emptyHotkey: { },
                     withoutKey: { handler: function(player: any, options: any, event: any) { console.log('withoutKey handler');}},
                     withoutHandler: { key: function(e: any) { return true;}},
                     malformedKey: { key: function() {  console.log(' The Key function must return a boolean.');},
                         handler: function(player: any, options: any, event: any) { }
                     } }  }); });
  //    this.videoPlayListSourceM3U8();
   }
    defaultVideoControllers() {
        if (this.embedVideoFile.enableVideoController === false) { $('.video-js .vjs-control-bar').hide();}
        else { $('.video-js .vjs-control-bar').show();}
    }
    transperancyControllBar(value: any) {
        const rgba = this.utilService.convertHexToRgba(this.embedVideoFile.controllerColor, value);
        $('.video-js .vjs-control-bar').css('background-color', rgba);
        this.valueRange = value;
        console.log(this.valueRange);
    }
    videoPlayListSourceM3U8() {
      this.videoUrl = this.embedVideoFile.videoPath;
      this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
      this.videoUrl = this.videoUrl + '_mobinar.m3u8';
      const self = this;
      this.videoJSplayer.playlist([{ sources: [{  src: self.videoUrl, type: 'application/x-mpegURL' }]}]);
   }
   videoPlayListSourceMP4() {
        this.videoUrl = this.embedVideoFile.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '.mp4';
        const self = this;
        this.videoJSplayer.playlist([{ sources: [{  src: self.videoUrl, type: 'video/mp4' }]}]);
    }
  ngOnDestroy() {
     console.log('Deinit - Destroyed Component');
     if(this.videoJSplayer) {
        this.videoJSplayer.dispose(); }
          $('.h-video').remove();
          $('.p-video').remove();
     this.sub.unsubscribe();
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
