import { Component, ElementRef, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { Router} from '@angular/router';
import { SaveVideoFile } from '../../models/save-video-file';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user';
import { VideoFileService } from '../../services/video-file.service';
import { UtilService } from '../../services/util.service';
declare var Metronic, Layout, Demo, $, videojs: any;

@Component({
    selector: 'app-play-video',
    templateUrl: './play-video.component.html',
    styleUrls: ['./play-video.component.css', '../../../../assets/css/video-css/video-js.custom.css',
        '../../../../assets/css/video-css/videojs-overlay.css', '../../../../assets/css/about-us.css',
        '../../../../assets/css/todo.css', '../edit-video/edit-video.component.css']
})
export class PlayVideoComponent implements OnInit, AfterViewInit {
    @Input() videos: Array<SaveVideoFile>;
    @Input() selectedVideo: SaveVideoFile;
    private _elementRef: ElementRef;
    public user: User = new User();
    model: any = {};
    selectedPosition: number;
    public images = 'http://localhost:3000/embed-video/75eb5693-1865-4002-af66-ea6d1dd1d874';
    embedWidth = '640';
    embedHeight = '360';
    videoSizes: string[];
    videosize = '640 × 360';
    public embedFullScreen = 'allowfullscreen';
    isFullscreen: boolean;
    public videoUrl: string;
    private videoJSplayer: any;
    private videoJSplayerNew: any;
    public setValueForSrc: boolean;
    public posterImg: string;
    public likes: boolean;
    public comments: boolean;
    public shareVideo: boolean;
    public embedVideo: boolean;
    public isPlayButton: boolean;
    public isSkipChecked: boolean;
    public upperTextValue: string;
    public lowerTextValue: string;
    public isOverlay: boolean;
    public videoOverlaySubmit: string;
    public isPlay: boolean;
    public email_id: string;
    public firstName: string;
    public lastName: string;
    public overLayValue: string;
    public isFistNameChecked: boolean;
    public videoStartTime: number;
    public durationTime: number;
    public startOfthevideo: boolean;
    public endOfthevideo: boolean;
    public checkCalltoAction = false;
    public videoId = false;
    public likesValues: number;
    public disLikesValues: number;
    public title: string;
    public shareValues: boolean;
    public alias: string;
    public valueRange: number;
    public selectedVideoAlias: string;
    public is360Value: boolean;
    public new360video: string;
    public video360running: boolean;
    constructor(elementRef: ElementRef, private authenticationService: AuthenticationService,private router: Router,
    private videoFileService: VideoFileService, private userService: UserService , private utilService: UtilService) {
        this._elementRef = elementRef;
        this.videoSizes = this.utilService.videoSizes;
        this.disLikesValues = 0;
        this.likesValues = 2;
        this.isFullscreen = true;
    }
    checkCallToActionAvailable() {
        if (this.selectedVideo.startOfVideo === true && this.selectedVideo.callACtion === true ) {
            this.overLayValue = 'StartOftheVideo';
            this.videoOverlaySubmit = 'PLAY';
            this.isPlay = true;
        //    localStorage.setItem('isOverlayValue', JSON.stringify(this.overLayValue)); 
        }
        else if(this.selectedVideo.endOfVideo === true && this.selectedVideo.callACtion === true) {
            this.overLayValue = 'EndOftheVideo';
            this.isPlay = false;
            this.videoOverlaySubmit = 'SUBMIT';
         //   localStorage.setItem('isOverlayValue', JSON.stringify(this.overLayValue)); 
        }
        else {
            this.overLayValue = 'removeCallAction';
       //     localStorage.setItem('isOverlayValue', JSON.stringify(this.overLayValue));
        }
    }

    playVideoInfo(selectedVideo: SaveVideoFile) {
        this.selectedVideoAlias = this.selectedVideo.alias;
        this.posterImg = this.selectedVideo.imagePath;
        this.videoUrl = this.selectedVideo.videoPath;
       // call to action values
        this.valueRange = this.selectedVideo.transparency;
        this.lowerTextValue = this.selectedVideo.lowerText;
        this.upperTextValue = this.selectedVideo.upperText;
        this.isFistNameChecked = this.selectedVideo.name; // need  the value from server 
        this.isPlayButton = this.selectedVideo.name;  // need to get the value from server
        this.isSkipChecked = this.selectedVideo.skip; // need to get the value from server
        this.startOfthevideo =  this.selectedVideo.startOfVideo;
        this.endOfthevideo  = this.selectedVideo.endOfVideo;
       // this.checkCalltoAction = this.selectedVideo.callACtion;
       // video controlls
        this.likes = this.selectedVideo.allowLikes;
        this.comments = this.selectedVideo.allowComments;
        this.shareVideo = this.selectedVideo.allowSharing;
        this.embedVideo = this.selectedVideo.allowEmbed;
        console.log(this.selectedVideo);
        this.title = this.selectedVideo.title;
        this.alias = this.selectedVideo.alias;
        this.is360Value = this.selectedVideo.is360video;
    }
   showOverlayModal(){
        //  $("#videoId").append($("#overlay-modal").show());
         $("#modalDialog").append($("#overlay-modal").show());
   }
    showVideo(videoFile: SaveVideoFile, position: number) {
       console.log('videoComponent showVideo() ' + position);
    //    $('.h-video').remove();
    //    $('.p-video').remove();
        if (this.selectedVideo) {
             console.log('videoComponent showVideo() re adding the existing video' + this.selectedPosition);
             this.videos.push(this.selectedVideo);
          }
       this.videoFileService.getVideo(videoFile.alias, videoFile.viewBy)
         .subscribe((saveVideoFile: SaveVideoFile) => {
            this.selectedVideo = saveVideoFile;
            console.log(this.selectedVideo);
           for (let i = 0; i < this.videos.length; i ++) {
             if (this.selectedVideo.id === this.videos[i].id) {
                this.videos.splice(i, 1);
                break;
              }
           }
        this.selectedPosition = position;
        this.playVideoInfo(this.selectedVideo);
        this.posterImg =  this.selectedVideo.imagePath;
        this.checkCallToActionAvailable();
   //    $('head').append('<link href="assets/js/indexjscss/video-hls-player/video-hls-js.css" rel="stylesheet">');
        if(this.selectedVideo.is360video){
            this.play360Video();
        }else{
        $("#newPlayerVideo").empty();
        $("#videoId").remove();
        this.playNormalVideoFiles();
        const str = '<video id="videoId"  poster=' +this.posterImg +' preload="none"  class="video-js vjs-default-skin" controls></video>';
            $("#newPlayerVideo").append(str);
            this.videoUrl = this.selectedVideo.videoPath;
            this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
            this.videoUrl =  this.videoUrl + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
            $("#newPlayerVideo video").append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
             $("#videoId").css("height", "318px");
             $("#videoId").css("width", "auto");
             $(".video-js .vjs-tech").css("width", "100%");
             $(".video-js .vjs-tech").css("height", "100%");
              const self = this;
             this.videoJSplayer = videojs('videoId', {}, function() {
                const player = this;
                const document: any = window.document;
              //  let isValid = JSON.parse(localStorage.getItem('isOverlayValue')); 
                const isValid = self.overLayValue;
               this.ready(function() {
                      $(".video-js .vjs-tech").css("width", "100%");
                      $(".video-js .vjs-tech").css("height", "100%");
                     if (isValid === 'StartOftheVideo' ) {
                          $('.vjs-big-play-button').css('display', 'none');
                        //  $("#overlay-modal").css("display","block !important");
                            self.showOverlayModal();
                            player.pause();
                     }
                     else if(isValid !== 'StartOftheVideo' ) {
                        $('#overlay-modal').hide();
                         $('.vjs-big-play-button').css('display', 'block');
                         player.play();
                        }
                 //   else if (isValid === 'removeCallAction'){ $('#overlay-modal').hide();player.play(); }
                     else {
                         $('#overlay-modal').hide();
                          $('.vjs-big-play-button').css('display', 'block');
                         player.play(); }
                });
                this.on('seeking', function() {
                });
                this.on('timeupdate', function() {
                });
                this.on('play', function() {
                    $('.vjs-big-play-button').css('display', 'none');
                });
                this.on('pause', function() {
                });
                this.on('ended', function() {
                //  isValid = JSON.parse(localStorage.getItem('isOverlayValue'));
                    var whereYouAt = player.currentTime();
                    console.log(whereYouAt);
                     if (isValid === 'EndOftheVideo') {
                      //   $('#play_video_player_demo1').append( $('#overlay-modal').show());
                       self.showOverlayModal();
                     }
                     else if(isValid !== 'EndOftheVideo') {
                         $('#overlay-modal').hide(); player.pause();}
                   //  else if (isValid === 'removeCallAction'){$('#overlay-modal').hide(); player.pause();}
                     else {
                         $('#overlay-modal').hide();
                         player.pause();
                         $('.vjs-big-play-button').css('display', 'none'); }
                });
                this.on('fullscreenchange', function () {
                    var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                    var event = state ? 'FullscreenOn' : 'FullscreenOff';
                    if(event === "FullscreenOn"){
                        $(".vjs-tech").css("width", "100%");
                        $(".vjs-tech").css("height", "100%");
                    }else if(event==="FullscreenOff"){
                        $("#videoId").css("width", "auto");
                        $("#videoId").css("height", "318px");
                    }
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
                  }
       this.defaultVideoOptions();
       this.transperancyControllBar(this.valueRange);
       if (this.selectedVideo.enableVideoController === false)
          { this.defaultVideoControllers(); }
      });
    }
    likesValuesDemo() {
        this.likesValues += 1;
    }
    disLikesValuesDemo() {
        this.disLikesValues += 1;
    }
    embedFulScreenValue() {
        if ( this.isFullscreen === true ) {this.embedFullScreen = 'allowfullscreen';}
        else{ this.embedFullScreen = ''; }
    }
    embedVideoSizes() {
        if (this.videosize === this.videoSizes[0]) { this.embedWidth = '1280'; this.embedHeight = '720'; }
        else if (this.videosize === this.videoSizes[1]) { this.embedWidth = '560'; this.embedHeight = '315'; }
        else if (this.videosize === this.videoSizes[2]) { this.embedWidth = '853'; this.embedHeight = '480'; }
        else { this.embedWidth = '640'; this.embedHeight = '360'; }
    }
    checkingCallToActionValues() {
        if (this.isFistNameChecked === true && this.utilService.validateEmail(this.model.email_id)
        && this.firstName.length !== 0 && this.lastName.length !== 0) {
        this.isOverlay = false;
            console.log(this.model.email_id + 'mail ' + this.firstName + ' and last name ' + this.lastName);
        }
        else if (this.isFistNameChecked === false && this.utilService.validateEmail(this.model.email_id)) { this.isOverlay = false; }
        else { this.isOverlay = true; }
    }
    embedCode() {
        (<HTMLInputElement>document.getElementById('embed_code')).select();
        document.execCommand('copy');
    }
    trimCurrentTime(currentTime) {
        return Math.round(currentTime * 100) / 100;
    }
    saveCallToActionUserForm() {
        $('#overlay-modal').hide();
        if(this.videoJSplayer){
        if(this.videoOverlaySubmit === 'PLAY'){ this.videoJSplayer.play(); }
        else { this.videoJSplayer.pause(); }}
        console.log(this.model.email_id);
        if (this.userService.loggedInUserData.emailId === this.model.email_id) {
            this.user.emailId = this.model.email_id;
            this.user.firstName = this.userService.loggedInUserData.firstName;
            this.user.lastName = this.userService.loggedInUserData.lastName;
        }
        else {
            this.user.emailId = this.model.email_id;
            this.user.firstName = this.firstName;
            this.user.lastName = this.lastName;
        }
        console.log(this.user);
        this.videoFileService.saveCalltoActionUser(this.user)
            .subscribe( (result: any) => {
                console.log('Save user Form call to acton is successfull' + result); });
       }
     repeatPlayVideo() {
        $('#overlay-modal').hide();
       if (this.videoJSplayer) {
        this.videoJSplayer.play(); }
     }
     skipOverlay(){
        $('#overlay-modal').hide();
        if(this.videoJSplayer){
        this.videoJSplayer.play();}
    }
    ngOnInit() {
        for (let i = 0; i < this.videos.length; i ++) {
          if (this.selectedVideo.id === this.videos[i].id) {
              this.videos.splice(i, 1);
              break;
          }
        }
        this.setValueForSrc = true;
        this.model.email_id = this.userService.loggedInUserData.emailId;
        this.firstName = this.userService.loggedInUserData.firstName;
        this.lastName = this.userService.loggedInUserData.lastName;

        if (this.utilService.validateEmail(this.model.email_id)) { this.isOverlay = false; }
        else {this.isOverlay = true; }

        this.playVideoInfo(this.selectedVideo);
        this.checkCallToActionAvailable();
    }
    defaultVideoOptions(){
        $('.video-js').css('color', this.selectedVideo.playerColor);
        $('.video-js .vjs-play-progress').css('background-color', this.selectedVideo.playerColor);
        $('.video-js .vjs-volume-level').css('background-color', this.selectedVideo.playerColor);
        $('.video-js .vjs-control-bar').css('background-color', this.selectedVideo.controllerColor);
        $('.vjs-control-bar').css('background-color', this.selectedVideo.controllerColor);
        if (this.selectedVideo.allowFullscreen === false) {
           $('.video-js .vjs-fullscreen-control').hide();
        }
        else { 	$('.video-js .vjs-fullscreen-control').show();
        }
    }
    defaultVideoControllers() {
        if (this.selectedVideo.enableVideoController === false) { $('.video-js .vjs-control-bar').hide(); }
        else { $('.video-js .vjs-control-bar').show(); }
    }
      transperancyControllBar(value: any) {
        const rgba = this.utilService.convertHexToRgba(this.selectedVideo.controllerColor, value);
        $('.video-js .vjs-control-bar').css('background-color', rgba);
        this.valueRange = value;
        console.log(this.valueRange);
    }
   play360Video() {
        this.is360Value = true;
        this.video360running = true;
         $("#newPlayerVideo").empty();
         $('.h-video').remove();
         $('head').append('<script src="assets/js/indexjscss/360-video-player/video.js" type="text/javascript"  class="p-video"/>');
         $('head').append('<script src="assets/js/indexjscss/360-video-player/three.js" type="text/javascript"  class="p-video" />');
         $('head').append('<link href="assets/js/indexjscss/360-video-player/videojs-panorama.min.css" rel="stylesheet"  class="p-video">');
  $('head').append('<script src="assets/js/indexjscss/360-video-player/videojs-panorama.v5.js" type="text/javascript"  class="p-video" />');
         $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"" type="text/javascript"  class="p-video" />');
     var str = '<video id=videoId  poster=' +this.posterImg +' class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
            $("#newPlayerVideo").append(str);
             this.videoUrl = this.selectedVideo.videoPath;
             this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
             this.videoUrl = this.videoUrl + '.mp4?access_token=' + this.authenticationService.access_token;
            // this.videoUrl = 'https://yanwsh.github.io/videojs-panorama/assets/shark.mp4'; /// need to comment
             this.new360video = this.videoUrl;
             $('#newPlayerVideo video').append('<source src="' + this.videoUrl + '" type="video/mp4">');
             $("#videoId").css("height", "318");
             $("#videoId").css("width", "auto");
             var player = videojs('videoId').ready(function() {
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
             const self = this;
             player.panorama({
                autoMobileOrientation: true,
                clickAndDrag: true,
                clickToToggle: true,
                callback: function () {
                // const isValid = JSON.parse(localStorage.getItem('isOverlayValue'));
                 const isValid = self.overLayValue;
                 // player.ready();
                  player.ready(function() {
                    if (isValid === 'StartOftheVideo' ) {
                      $('.vjs-big-play-button').css('display', 'none');
                    //  $('#videoId').append( $('#overlay-modal').show());
                      self.showOverlayModal();
                      player.pause();
                  }
                    else if(isValid !== 'StartOftheVideo' ) {
                      $('#overlay-modal').hide(); player.play(); }
               //    else if (isValid === 'removeCallAction'){ $('#overlay-modal').hide(); player.play(); }
                    else { $('#overlay-modal').hide();
                        player.play();
                     }
                      $('#skipOverlay').click(function(){
                         $('#overlay-modal').hide();
                         player.play();
                      });
                      $('#playorsubmit').click(function(){
                         $('#overlay-modal').hide();
                         if(self.videoOverlaySubmit === 'PLAY'){ player.play(); }
                     });
                 });
                 player.on('ended', function() {
                     $('.vjs-big-play-button').css('display', 'none');
                     if (isValid === 'EndOftheVideo') {
                    // $('#videoId').append( $('#overlay-modal').show());
                      self.showOverlayModal();
                     $('.video-js .vjs-control-bar').hide();
                    }
                     else if(isValid !== 'EndOftheVideo') {
                        $('#overlay-modal').hide(); player.pause();}
                   //  else if (isValid === 'removeCallAction'){ $('#overlay-modal').hide(); player.pause();}
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
                 player.on('click', function(){});
              }
              });
            $('#videoId').css('width', 'auto');
            $('#videoId').css('height', '318px');
    }
    playNormalVideoFiles(){
       $('.p-video').remove();
       $('head').append('<link href="assets/js/indexjscss/video-hls-player/video-hls-js.css" class="h-video" rel="stylesheet">');
       $('head').append('<script src="assets/js/indexjscss/video-hls-player/video-hls.js" type="text/javascript" class="h-video"  />');
       $('head').append('<script src="assets/js/indexjscss/video-hls-player/videojs.hls.min.js" type="text/javascript"  class="h-video"/>');
       $('head').append('<script src="assets/js/indexjscss/videojs-playlist.js" type="text/javascript"  class="h-video" />');
       $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"" type="text/javascript"  class="h-video" />');
    }
    playNormalVideo(){
       var str = '<video id=videoId  poster="'+this.posterImg+'" preload="none"  class="video-js vjs-default-skin" controls></video>';
        $("#newPlayerVideo").append(str);
        $("#videoId").css("height", "318px");
        $("#videoId").css("width", "auto");
        this.videoUrl = this.selectedVideo.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl =  this.videoUrl + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
        $("#newPlayerVideo video").append('<source src='+this.videoUrl+' type="application/x-mpegURL">');
        const self = this;
        this.videoJSplayer = videojs('videoId', {}, function() {
            const player = this;
            console.log('testing url value is :'+self.videoUrl);
            var document:any = window.document;
             $(".video-js .vjs-tech").css("width", "100%");
             $(".video-js .vjs-tech").css("height", "100%");
            const aspectRatio = 320/640;
         //   let isValid = JSON.parse(localStorage.getItem('isOverlayValue'));
            let isValid = self.overLayValue;
            this.ready(function() {
                 if (isValid === 'StartOftheVideo' ) {
                      $('.vjs-big-play-button').css('display', 'none');
                    //  $("#overlay-modal").css("display","block !important");
                   //   $('#videoId').append( $('#overlay-modal').show());
                     self.showOverlayModal();
                    }
                 else if(isValid !== 'StartOftheVideo' ) {
                     $('#overlay-modal').hide(); player.play();
                    }
                // else if (isValid === 'removeCallAction'){$('#overlay-modal').hide(); }
                 else { $('#overlay-modal').hide(); }
            });
            this.on('seeking', function() {
                // Mobinar.logging.logAction(data.id,'videoPlayer_slideSlider',startDuration,trimCurrentTime(player.currentTime()));
            });
            this.on('timeupdate', function() {
                // var  startDuration = player.trimCurrentTime(player.currentTime());
                // var  startDuration = player.currentTime();
                // console.log(this.currentTime());
            });
            this.on('play', function() {
                $('.vjs-big-play-button').css('display', 'none');
                //   console.log('play:'+player.duration());
                // Mobinar.logging.logAction(data.id,'playVideo',trimCurrentTime(player.currentTime()),
                // trimCurrentTime(player.currentTime()));

            });
            this.on('pause', function() {
                //      $('.vjs-big-play-button').css('display', 'block');
                //  console.log("video paused at "+player.currentTime());
                //  Mobinar.logging.logAction(data.id,'pauseVideo',trimCurrentTime(player.currentTime()),
                // trimCurrentTime(player.currentTime()));
            });
            this.on('ended', function() {
           //   isValid = JSON.parse(localStorage.getItem('isOverlayValue'));
                const whereYouAt = player.currentTime();
                console.log(whereYouAt);
                 if (isValid === 'EndOftheVideo') {
                  //   $('#videoId').append( $('#overlay-modal').show());
                    self.showOverlayModal();
                    }
                 else if(isValid !== 'EndOftheVideo') {
                     $('#overlay-modal').hide(); player.pause();}
              //   else if (isValid === 'removeCallAction'){ $('#overlay-modal').hide(); player.pause();}
                 else {
                     $('#overlay-modal').hide();
                     player.pause();
                     $('.vjs-big-play-button').css('display', 'none'); }
            });
            this.on('fullscreenchange', function () {
                var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                var event = state ? 'FullscreenOn' : 'FullscreenOff';
                if(event==="FullscreenOn"){
                    $(".vjs-tech").css("width", "100%");
                    $(".vjs-tech").css("height", "100%");
                }else if(event==="FullscreenOff"){
                    $("#videoId").css("width", "auto");
                    $("#videoId").css("height", "318px");
                }
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
    }
  ngAfterViewInit() {
       console.log('called ng after view init');
        $('#newPlayerVideo').empty();
      if(this.selectedVideo.is360video !== true) {
        this.playNormalVideoFiles();
        this.is360Value = false;
        this.playNormalVideo();
      } // if close
      else {
          this.play360Video();
      }
        this.defaultVideoOptions();
        this.transperancyControllBar(this.valueRange);
        if (this.selectedVideo.enableVideoController === false)
         { this.defaultVideoControllers(); }
     }
    ngOnDestroy() {
        console.log('Deinit - Destroyed Component');
        if (this.videoJSplayer) {
        this.videoJSplayer.dispose(); }
      //  localStorage.removeItem('isOverlayValue');
        $('.h-video').remove();
        $('.p-video').remove();
    }
}
