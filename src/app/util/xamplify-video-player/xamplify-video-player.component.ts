import { Component, OnInit,EventEmitter,Output,Input } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { EnvService } from 'app/env.service';
import { SaveVideoFile } from 'app/videos/models/save-video-file';
import { VideoFileService } from 'app/videos/services/video-file.service';
import { VideoUtilService } from 'app/videos/services/video-util.service';

declare const $:any, videojs: any;
@Component({
  selector: 'app-xamplify-video-player',
  templateUrl: './xamplify-video-player.component.html',
  styleUrls: ['./xamplify-video-player.component.css']
})
export class XamplifyVideoPlayerComponent implements OnInit {

  modalPopupId= "xamplify-video-player-modal-popup";
  videoTitle = "This is Video Title";
  fullScreenMode =false;
  @Input() videoId = 0;
  @Output() xamplifyVideoPlayerEmitter = new EventEmitter();
  videoFile: SaveVideoFile = new SaveVideoFile();
  modalPopupLoader = false;
  videoWidth: string;
  videoUrl: string;
  videoJSplayer: any;
  posterImg: string;
  replyVideo: boolean;
  pauseVideo: boolean;
  overLaySet: boolean;
  videoStatusCode = 0;
  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService,public videoFileService:VideoFileService,
    public videoUtilService:VideoUtilService,private envService:EnvService ) { }
 
 

  playNormalVideo() {
    const str = '<video id=xamplify-video-player-id  poster=' + this.posterImg + ' preload="none"  class="video-js vjs-default-skin" controls ></video>';
    $('#xamplify-video-player').append(str);
    $('#xamplify-video-player-id').css('height', this.videoWidth);
    $('#xamplify-video-player-id').css('width', 'auto');
    this.videoUrl = this.videoFile.videoPath;
    this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
    if(this.envService.CLIENT_URL.indexOf("localhost")>-1){
      this.videoUrl = "https://aravindu.com/vod/videos/54888/26062023/MSDhoni1831687796167215_mobinar.m3u8?access_token=" + this.authenticationService.access_token;
    }else{
     this.videoUrl = this.videoUrl + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
    }
    $('#xamplify-video-player video').append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
    const self = this;
    const overrideNativevalue = this.referenceService.getBrowserInfoForNativeSet();
    this.videoJSplayer = videojs('xamplify-video-player-id', {
        html5: {
            hls: {
                overrideNative: overrideNativevalue
            },
            nativeVideoTracks: !overrideNativevalue,
            nativeAudioTracks: !overrideNativevalue,
            nativeTextTracks: !overrideNativevalue
        },
        inactivityTimeout: 0
       }, function () {
        const player = this;
        self.replyVideo = false;
        const document: any = window.document;
        $('.video-js .vjs-tech').css('width', '100%');
        $('.video-js .vjs-tech').css('height', '100%');
        const aspectRatio = 320 / 640;
        let isCallActionthere = false;
        this.ready(function () {
            $('#overLayImage').append($('#overlay-logo').show());
            $('#overlay-modal').hide(); 
            player.play();
        });
        this.on('seeking', function () {
            
        });
        this.on('timeupdate', function () {
            
        });
        this.on('play', function () {
            self.pauseVideo = false;
            $('.vjs-big-play-button').css('display', 'none');
        });
        this.on('pause', function () {
            self.pauseVideo = true;
        });
        this.on('ended', function () {
            self.pauseVideo = true;
            $('#imageDivHide').css('cssText', 'display:block');
            self.replyVideo = true;
            $('#overlay-modal').hide();
            $('.vjs-big-play-button').css('display', 'none');
            $('#repeatPlay').click(function () {
                $('#overlay-modal').hide();
                player.play();
            });
            $('#skipOverlay').click(function () {
                isCallActionthere = false;
                $('#overlay-modal').hide();
                player.pause();
            });
            $('#playorsubmit').click(function () {
                isCallActionthere = false;
                $('#overlay-modal').hide();
                player.pause();
            });
        });
        this.on('fullscreenchange', function () {
            const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
            const event = state ? 'FullscreenOn' : 'FullscreenOff';
            if (event === 'FullscreenOn') {
                $('.vjs-tech').css('width', '100%');
                $('.vjs-tech').css('height', '100%');
                self.fullScreenMode = true;
                $('#xamplify-video-player-id').append($('#overlay-logo').show());
            } else if (event === 'FullscreenOff') {
                $('#xamplify-video-player-id').css('width', 'auto');
                $('#xamplify-video-player-id').css('height', self.videoWidth);
                self.fullScreenMode = false;
                self.overLaySet = false;
                $('#overLayImage').append($('#overlay-logo').show());
                if (isCallActionthere === true) {
                    self.overLaySet = false;
                    self.fullScreenMode = false;
                    $('#overlay-modal').css('width', 'auto');
                    $('#overlay-modal').css('height', self.videoWidth);
                    $('#xamplify-video-player-id').append($('#overlay-modal').hide());
                    $('#overlay-modal').css('width', '100%');
                    $('#overlay-modal').css('height', self.videoWidth);
                }
            }
        });
        this.on('contextmenu', function (e) {
            e.preventDefault();
        });
        this.on('mouseover', function(){
            this.userActive(true)
            $('#imageDivHide').css('cssText', 'display:block');
        });
        this.on('mouseleave', function(){
            setTimeout(()=>{
               if(!self.pauseVideo){
                   $('#imageDivHide').css('cssText', 'display:none');
                   this.userActive(false)
                }
                },3000);
        });
        this.hotkeys({
            volumeStep: 0.1, seekStep: 5, enableMute: true,
            enableFullscreen: false, enableNumbers: false,
            enableVolumeScroll: true,
            fullscreenKey: function (event: any, player: any) {
                return ((event.which === 70) || (event.ctrlKey && event.which === 13));
            },
            customKeys: {
                simpleKey: {
                    key: function (e: any) { return (e.which === 83); },
                    handler: function (player: any, options: any, e: any) {
                        if (player.paused()) { player.play(); } else { player.pause(); }
                    }
                },
                complexKey: {
                    key: function (e: any) { return (e.ctrlKey && e.which === 68); },
                    handler: function (player: any, options: any, event: any) {
                        if (options.enableMute) { player.muted(!player.muted()); }
                    }
                },
                numbersKey: {
                    key: function (event: any) {
                        return ((event.which > 47 && event.which < 59) ||
                            (event.which > 95 && event.which < 106));
                    },
                    handler: function (player: any, options: any, event: any) {
                        if (options.enableModifiersForNumbers || !(event.metaKey || event.ctrlKey || event.altKey)) {
                            let sub = 48;
                            if (event.which > 95) { sub = 96; }
                            let number = event.which - sub;
                            player.currentTime(player.duration() * number * 0.1);
                        }
                    }
                },
                emptyHotkey: {},
                withoutKey: { handler: function (player: any, options: any, event: any) { console.log('withoutKey handler'); } },
                withoutHandler: { key: function (e: any) { return true; } },
                malformedKey: {
                    key: function () { console.log(' The Key function must return a boolean.'); },
                    handler: function (player: any, options: any, event: any) { }
                }
            }
        });
    });
  }

  play360Video() {
    $('#xamplify-video-player').empty();
    $('.h-video').remove();
    this.videoUtilService.player360VideoJsFiles();
    this.videoUtilService.video360withm3u8();
    let str = '<video id=videoId  poster=' + this.posterImg + ' class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
    $('#xamplify-video-player').append(str);
    this.videoUrl = this.videoFile.videoPath;
    this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
    if(this.envService.CLIENT_URL.indexOf("localhost")>-1){
        this.videoUrl = "https://aravindu.com/vod/videos/54888/26062023/MSDhoni1831687796167215_mobinar.m3u8?access_token=" + this.authenticationService.access_token;
      }else{
       this.videoUrl = this.videoUrl + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
      }
    $('#xamplify-video-player video').append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
    $('#xamplify-video-player-id').css('height', this.videoWidth);
    $('#xamplify-video-player-id').css('width', 'auto');
    const player = videojs('videoId').ready(function () {
        this.hotkeys({
            volumeStep: 0.1, seekStep: 5, enableMute: true,
            enableFullscreen: false, enableNumbers: false,
            enableVolumeScroll: true,
            fullscreenKey: function (event: any, player: any) {
                return ((event.which === 70) || (event.ctrlKey && event.which === 13));
            },
            customKeys: {
                simpleKey: {
                    key: function (e: any) { return (e.which === 83); },
                    handler: function (player: any, options: any, e: any) {
                        if (player.paused()) { player.play(); } else { player.pause(); }
                    }
                },
                complexKey: {
                    key: function (e: any) { return (e.ctrlKey && e.which === 68); },
                    handler: function (player: any, options: any, event: any) {
                        if (options.enableMute) { player.muted(!player.muted()); }
                    }
                },
                numbersKey: {
                    key: function (event: any) {
                        return ((event.which > 47 && event.which < 59) ||
                            (event.which > 95 && event.which < 106));
                    },
                    handler: function (player: any, options: any, event: any) {
                        if (options.enableModifiersForNumbers || !(event.metaKey || event.ctrlKey || event.altKey)) {
                            let sub = 48;
                            if (event.which > 95) { sub = 96; }
                            let number = event.which - sub;
                            player.currentTime(player.duration() * number * 0.1);
                        }
                    }
                },
                emptyHotkey: {},
                withoutKey: { handler: function (player: any, options: any, event: any) { console.log('withoutKey handler'); } },
                withoutHandler: { key: function (e: any) { return true; } },
                malformedKey: {
                    key: function () { console.log(' The Key function must return a boolean.'); },
                    handler: function (player: any, options: any, event: any) { }
                }
            }
        });
    });
    const self = this;
    player.panorama({
        autoMobileOrientation: true,
        clickAndDrag: true,
        clickToToggle: true,
        callback: function () {
            self.replyVideo = false;
            let isCallActionthere = false;
            const document: any = window.document;
            player.ready(function () {
                $('#overLayImage').append($('#overlay-logo').show());
                $('.video-js .vjs-control-bar .vjs-VR-control').css('cssText', 'color:' + self.videoFile.playerColor + '!important');
                $('#overlay-modal').hide();
                player.play();
                $('#skipOverlay').click(function () {
                    isCallActionthere = false;
                    self.fullScreenMode = false;
                    $('#overlay-modal').hide();
                    player.play();
                });
                $('#playorsubmit').click(function () {
                    isCallActionthere = false;
                    self.fullScreenMode = false;
                    $('#overlay-modal').hide();
                    player.play();
                });
            });
            player.on('pause', function () {
               
            });
            player.on('play', function () {
                
            });
            player.on('seeking', function () {
                
            });
            player.on('timeupdate', function () {
                
            });
            player.on('ended', function () {
                const time = player.currentTime();
                self.replyVideo = true;
                $('.vjs-big-play-button').css('display', 'block');
                $('.vjs-big-play-button').css('display', 'none');
                $('#overlay-modal').hide(); // player.pause();
                $('#repeatPlay').click(function () {
                    $('#overlay-modal').hide();
                    player.play();
                });
                $('#skipOverlay').click(function () {
                    isCallActionthere = false;
                    $('#overlay-modal').hide();
                    player.pause();
                });
                $('#playorsubmit').click(function () {
                    isCallActionthere = false;
                    $('#overlay-modal').hide();
                    player.pause();
                });
            });
            player.on('fullscreenchange', function () {
                const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                const event = state ? 'FullscreenOn' : 'FullscreenOff';
                if (event === 'FullscreenOn') {
                    $('.vjs-tech').css('width', '100%');
                    $('.vjs-tech').css('height', '100%');
                    self.fullScreenMode = true;
                    $('#xamplify-video-player-id').append($('#overlay-logo').show());
                } else if (event === 'FullscreenOff') {
                    $('#xamplify-video-player-id').css('width', 'auto');
                    $('#xamplify-video-player-id').css('height', self.videoWidth);
                    self.fullScreenMode = false;
                    $('#overLayImage').append($('#overlay-logo').show());
                }
            });
            player.on('click', function () { });
        }
    });
    $('#xamplify-video-player-id').css('width', 'auto');
    $('#xamplify-video-player-id').css('height', this.videoWidth);
}


  ngOnInit() {
    if(window.innerHeight<= 600 || window.innerWidth<= 768 ){ 
      this.videoWidth = '260px';
    }else if(window.innerWidth <= 992) {
      this.videoWidth = '360px';
    }else{  
      this.videoWidth = '360px';
    }
    this.modalPopupLoader = true;
    $('#xamplify-video-player').empty();
    this.referenceService.openModalPopup(this.modalPopupId);
    this.videoFileService.getVideoById(this.videoId,'DRAFT').subscribe(
      (response: any)=>{
        if(response.message=='NO MOBINARS FOUND FOR SPECIFIED ID'){
            this.videoStatusCode = 404;
        }else{
            this.videoStatusCode = 200;
            this.videoFile = response;
            if(this.videoFile.is360video){
                this.play360Video();
            }else{
                $('#xamplify-video-player').empty();
                $('#xamplify-video-player-id').remove();
                this.loadNormalVideoJsFiles();
                this.playNormalVideo();
            }
            this.defaultVideoOptions();
            this.transperancyControllBar(this.videoFile.transparency);
            if (!this.videoFile.enableVideoController) {
                 this.defaultVideoControllers();
             }
        }
        this.modalPopupLoader = false;
      },error=>{
          this.referenceService.showSweetAlertServerErrorMessage();
          this.close();
      }
    );
  }

  defaultVideoOptions() {
    this.videoUtilService.videoColorControlls(this.videoFile);
    if (!this.videoFile.allowFullscreen) {
        $('.video-js .vjs-fullscreen-control').hide();
    } else {
        $('.video-js .vjs-fullscreen-control').show();
    }
}
defaultVideoControllers() {
    if (!this.videoFile.enableVideoController) {
        $('.video-js .vjs-control-bar').hide();
    } else {
        $('.video-js .vjs-control-bar').show();
    }
}
transperancyControllBar(value: any) {
    const color: any = this.videoFile.controllerColor;
    const rgba = this.videoUtilService.transparancyControllBarColor(color, value);
    $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
}

  loadNormalVideoJsFiles() {
    $('.p-video').remove();
    this.videoUtilService.normalVideoJsFiles();
}

  close(){
    this.referenceService.closeModalPopup(this.modalPopupId);
    this.callEmitter();
  }

  callEmitter(){
    this.xamplifyVideoPlayerEmitter.emit();
  }

}
