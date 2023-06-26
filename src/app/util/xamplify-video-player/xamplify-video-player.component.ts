import { Component, OnInit,EventEmitter,Output,Input,AfterViewInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { SaveVideoFile } from 'app/videos/models/save-video-file';
import { VideoFileService } from 'app/videos/services/video-file.service';
import { VideoUtilService } from 'app/videos/services/video-util.service';
declare const $:any, videojs: any;
@Component({
  selector: 'app-xamplify-video-player',
  templateUrl: './xamplify-video-player.component.html',
  styleUrls: ['./xamplify-video-player.component.css']
})
export class XamplifyVideoPlayerComponent implements OnInit,AfterViewInit {

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
  is360Value: boolean;
  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService,public videoFileService:VideoFileService,
    public videoUtilService:VideoUtilService ) { }
 
  ngAfterViewInit(): void {
    
  }

  playNormalVideo() {
    const str = '<video id=videoId  poster=' + this.posterImg + ' preload="none"  class="video-js vjs-default-skin" controls ></video>';
    $('#xamplify-video-player').append(str);
    $('#videoId').css('height', this.videoWidth);
    $('#videoId').css('width', 'auto');
    this.videoUrl = this.videoFile.videoPath;
    this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
   // this.videoUrl = this.videoUrl + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
   this.videoUrl = "https://aravindu.com/vod/videos/54888/18102022/LASTOVEROFT20WORLDCUPFINAL200716130245623293601666036094431_mobinar.m3u8?access_token=" + this.authenticationService.access_token;
    $('#xamplify-video-player video').append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
    const self = this;
    const overrideNativevalue = this.referenceService.getBrowserInfoForNativeSet();
    this.videoJSplayer = videojs('videoId', {
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
            $('#overlay-modal').hide(); player.play();
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
                $('#videoId').append($('#overlay-logo').show());
            } else if (event === 'FullscreenOff') {
                $('#videoId').css('width', 'auto');
                $('#videoId').css('height', self.videoWidth);
                self.fullScreenMode = false;
                self.overLaySet = false;
                $('#overLayImage').append($('#overlay-logo').show());
                if (isCallActionthere === true) {
                    self.overLaySet = false;
                    self.fullScreenMode = false;
                    $('#overlay-modal').css('width', 'auto');
                    $('#overlay-modal').css('height', self.videoWidth);
                    $('#videoId').append($('#overlay-modal').hide());
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
    this.videoFileService.getVideoById(this.videoId, 'DRAFT').subscribe(
      (videoFile: SaveVideoFile)=>{
        this.videoFile = videoFile;
        this.playNormalVideoFiles();
        this.is360Value = false;
        this.playNormalVideo();
        this.modalPopupLoader = false;
      },error=>{
          this.referenceService.showSweetAlertServerErrorMessage();
          this.close();
      }
    );
  }
  playNormalVideoFiles() {
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
