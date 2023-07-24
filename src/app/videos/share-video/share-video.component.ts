import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from '../../core/services/authentication.service';
import { VideoFileService } from '../services/video-file.service';
import { SaveVideoFile } from '../models/save-video-file';
import { VideoUtilService } from '../services/video-util.service';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Ng2DeviceService } from 'ng2-device-detector';
import { UUID } from 'angular2-uuid';

import { User } from '../../core/models/user';
import { XtremandLog } from '../models/xtremand-log';
import { CallAction } from '../models/call-action';
import { LogAction } from '../models/log-action';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';

declare var $, videojs: any;

@Component({
    selector: 'app-share-video',
    templateUrl: './share-video.component.html',
    styleUrls: ['./share-video.component.css', '../../../assets/css/video-css/call-action.css',
    '../../../assets/css/video-css/video-js.custom.css','../../../assets/css/loader.css'],
    providers: [VideoUtilService, XtremandLog]
})
export class ShareVideoComponent implements OnInit, OnDestroy {
    embedVideoFile: SaveVideoFile;
    user: User = new User();
    callAction: CallAction = new CallAction();
    videoJSplayer: any;
    imgURL: string;
    videoUrl: string;
    posterImagePath: string;
    is360Value: boolean;
    title: string;
    upperTextValue: string;
    lowerTextValue: string;
    description: string;
    shareUrl: string;
    // logging info details
    sessionId: string;
    deviceInfo: any;
    LogAction: typeof LogAction = LogAction;
    replyVideo: boolean;
    logVideoViewValue: boolean;
    overLaySet = false;
    fullScreenMode = false;
    seekStart = null;
    seekStart360 = null;
    uploadedDate: any;
    categoryName: any;
    shortnerAliasUrl: any;
    shareShortUrl: any;
    shortnerUrlAlias: string;
    counter = 0;
    beforeTimeChange = 0;
    previousTime = 0.0;
    currentTime = 0.0;
    endTimeUpdate: any;
    startTimeUpdate: any;
    shareURL: any;
    seekbarPreviousTime = false;
    seekbarTimestored = 0;
    logoImageUrlPath: string;
    logoLink: string;
    errorMessage:string;
    callToActionErrorMessage: any;
    isCallToActionError = false;

    constructor(public router: Router, public route: ActivatedRoute, public videoFileService: VideoFileService,
        public videoUtilService: VideoUtilService, public xtremandLogger: XtremandLogger, public http: Http,
        public xtremandLog: XtremandLog, public deviceService: Ng2DeviceService, public referService: ReferenceService,
        public authenticationService: AuthenticationService, private vanityURLService:VanityURLService) {
        this.xtremandLogger.log('share component constructor called');
        console.log('url is on angular 2' + document.location.href);
        this.shareUrl = document.location.href;
        this.logVideoViewValue = true;
        this.callAction.isOverlay = true;
        console.log(this.shareUrl);
    }
    // setConfirmUnload(on) {
    // window.onbeforeunload = (on) ? this.setMessage : null;
    // }
    setMessage() {
        this.videoStoppedEvent();
        return 'you have message';
    }

    getVideo(shortnerUrlAlias: string) {
      try{
      this.videoFileService.getVideoByShortenerUrlAlias(shortnerUrlAlias)
            .subscribe(
            (result: any) => {
                let message: any = '';
                this.embedVideoFile = result;
                if (result.message !== undefined && result.message == "NO MOBINARS FOUND FOR SPECIFIED ID") {
                    message = "NO MOBINARS FOUND FOR SPECIFIED ID";
                    //  this.router.navigate(['/undefined']);
                }
                this.xtremandLogDefaultActions();
                this.posterImagePath = this.embedVideoFile.imagePath;
                this.is360Value = this.embedVideoFile.is360video;
                this.imgURL = this.embedVideoFile.gifImagePath;
                this.title = this.embedVideoFile.title;
                this.description = this.embedVideoFile.description;
                this.uploadedDate = this.embedVideoFile.uploadedDate;
                this.categoryName = this.embedVideoFile.category.name;
                this.upperTextValue = this.embedVideoFile.upperText;
                this.lowerTextValue = this.embedVideoFile.lowerText;
                this.logoLink = this.embedVideoFile.brandingLogoDescUri;
                this.logoImageUrlPath = this.embedVideoFile.brandingLogoUri;
                if (this.embedVideoFile.startOfVideo === true) {
                    this.callAction.videoOverlaySubmit = 'PLAY';
                } else { this.callAction.videoOverlaySubmit = 'SUBMIT'; }

                if (this.embedVideoFile.startOfVideo === true && this.embedVideoFile.callACtion === true) {
                    this.callAction.overLayValue = 'StartOftheVideo';
                    this.callAction.videoOverlaySubmit = 'PLAY';
                } else if (this.embedVideoFile.endOfVideo === true && this.embedVideoFile.callACtion === true) {
                    this.callAction.overLayValue = 'EndOftheVideo';
                    this.callAction.videoOverlaySubmit = 'SUBMIT';
                } else { this.callAction.overLayValue = 'removeCallAction'; }

                if (message === '') {
                    if (this.embedVideoFile.is360video === true) {
                        try {
                            this.play360Video();
                        } catch (err) {
                           // this.router.navigate(['/embed/' + this.routerType + '/' + this.routerAlias + '/']);
                        }
                    } else {
                        try {
                            this.playNormalVideo();
                        } catch (err) {
                           // this.router.navigate(['/embed/' + this.routerType + '/' + this.routerAlias + '/']);
                        }
                    }
                } else if (message === "NO MOBINARS FOUND FOR SPECIFIED ID") {
                    this.router.navigate(['/no-videos-found']);
                }
                this.defaultVideoSettings();
                this.transperancyControllBar(this.embedVideoFile.transparency);
                if (this.embedVideoFile.enableVideoController === false) {
                    this.defaultVideoControllers();
                }
                this.defaultCallToActionValues();
                console.log(this.videoUrl);
                this.embedVideoFile.viewBy = this.embedVideoFile.viewBy.toLowerCase();
            }, (error: any) => {
                this.xtremandLogger.error(error);
                this.errorMessage = JSON.parse(error._body).message;
               // this.router.navigate(['/no-videos-found']);
            });
          }catch(error){ this.xtremandLogger.error('error');}
    }
    setVideoIdHeightWidth() {
        const height = this.shareUrl.includes('embed')? window.innerHeight-9: '360px';
        const width = this.shareUrl.includes('embed')? window.innerWidth-9: '640px';
        $('#videoId').css('height', height);
        $('#videoId').css('width', width);
    }
    setOverlayModalHeightWidth() {
        const height = this.shareUrl.includes('embed')? window.innerHeight: '360px';
        const width = this.shareUrl.includes('embed')? window.innerWidth: '640px';
        $('#overlay-modal').css('width', width);
        $('#overlay-modal').css('height', height);
    }
    ngOnInit() {
       try{        
        if(this.vanityURLService.isVanityURLEnabled()){
            this.vanityURLService.checkVanityURLDetails();
        }

       //  this.setConfirmUnload(true);
        $('body').css('cssText', 'background-color: white !important');
        $('#overlay-modal').hide();
        console.log('Share video component ngOnInit called');
        this.createSessionId();
        this.deviceDectorInfo();
        this.loacationDetails();
        this.shortnerUrlAlias = this.route.snapshot.params['alias'];
        this.shareShortUrl = this.authenticationService.SHARE_URL + this.shortnerUrlAlias;
        this.getVideo(this.shortnerUrlAlias);
        console.log(this.embedVideoFile);
      }catch(error){ this.xtremandLogger.error('error');}
    }
    defaultCallToActionValues() {
        this.callAction.isFistNameChecked = this.embedVideoFile.name;
        this.callAction.isSkipChecked = this.embedVideoFile.skip;
    }
    defaultVideoSettings() {
        console.log('default settings called');
        this.videoUtilService.videoColorControlls(this.embedVideoFile);
        if (this.embedVideoFile.allowFullscreen === false) {
            $('.video-js .vjs-fullscreen-control').hide();
        } else {
            $('.video-js .vjs-fullscreen-control').show();
        }
    }
    checkingCallToActionValues() {
        
        if(this.callAction.email_id){
            this.callAction.email_id = this.callAction.email_id.trim();
        }
        
        if (this.callAction.isFistNameChecked === true && this.videoUtilService.validateEmail(this.callAction.email_id)
            && this.callAction.firstName && this.callAction.lastName) {
            this.callAction.isOverlay = false;
            console.log(this.callAction.email_id + 'mail ' + this.callAction.firstName + ' and last property ' + this.callAction.lastName);
        } else if (this.callAction.isFistNameChecked === false && this.videoUtilService.validateEmail(this.callAction.email_id)) {
            this.callAction.isOverlay = false;
        } else { this.callAction.isOverlay = true; }
    }

    play360Video() {
        this.is360Value = true;
        console.log('Loaded 360 Video');
        $('.h-video').remove();
        this.videoUtilService.player360VideoJsFiles();
        this.videoUtilService.video360withm3u8();
        const str = '<video id=videoId poster=' + this.posterImagePath + ' class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
        $('#newPlayerVideo').append(str);
        this.videoUrl = this.embedVideoFile.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
        //this.videoUrl = 'https://xamp.io/vod/videos/14626/24042019/xAmpemailtemplatesmodule1556137162081_mobinar.m3u8?access_token=09956128-2c5d-4284-8cd1-01aa36d286a4';
        $('#newPlayerVideo video').append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
        const player360 = this;
        this.videoJSplayer = videojs('videoId', {
             "controls": true,
             "autoplay": false,
             "preload": "auto",
             "customControlsOnMobile": true,
             "nativeControlsForTouch": true
        }).ready(function () {
            this.hotkeys({
                volumeStep: 0.1, seekStep: 5, enableMute: true,
                enableFullscreen: false, enableNumbers: false,
                enableVolumeScroll: true,
                 playbackRates: [0.5, 1, 1.5, 2],
                fullscreenKey: function (event: any, player: any) {
                    return ((event.which === 70) || (event.ctrlKey && event.which === 13));
                },
                customKeys: {
                    simpleKey: {
                        key: function (e: any) { return (e.which === 83); },
                        handler: function (player: any, options: any, e: any) {
                            if (player.paused()) { player.play(); } else { player.pause(); }
                        }
                    }, complexKey: {
                        key: function (e: any) { return (e.ctrlKey && e.which === 68); },
                        handler: function (player: any, options: any, event: any) {
                            if (options.enableMute) { player.muted(!player.muted()); }
                        }
                    }, numbersKey: {
                        key: function (event: any) {
                            return ((event.which > 47 && event.which < 59) ||
                                (event.which > 95 && event.which < 106));
                        },
                        handler: function (player: any, options: any, event: any) {
                            if (options.enableModifiersForNumbers || !(event.metaKey || event.ctrlKey || event.altKey)) {
                                let sub = 48; if (event.which > 95) { sub = 96; }
                                const number = event.which - sub;
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
        let self = this;
        player360.videoJSplayer.panorama({
            autoMobileOrientation: true,
            clickAndDrag: true,
            clickToToggle: true,
            callback: function () {
                const isValid = player360.callAction.overLayValue;
                let startDuration;
                let isCallActionthere = false;
                const document: any = window.document;
                player360.replyVideo = false;
                player360.videoJSplayer.ready(function () {
                    player360.xtremandLog.startDuration = 0;
                    player360.xtremandLog.startDuration = 0;
                    $('#overLayImage').append($('#overlay-logo').show());
                     $('.video-js .vjs-control-bar .vjs-VR-control').css('cssText', 'color:' + player360.embedVideoFile.playerColor + '!important');
                    if (isValid === 'StartOftheVideo') {
                        $('#videoId').append($('#overlay-modal').show());
                        player360.videoJSplayer.pause();
                    } else if (isValid !== 'StartOftheVideo') {
                       /// player360.videoJSplayer.play();
                        $('#overlay-modal').hide();
                    } else {
                       player360.videoJSplayer.play();
                       $('#overlay-modal').hide();
                      }
                    $('#skipOverlay').click(function () {
                        isCallActionthere = false;
                        $('#overlay-modal').hide();
                        //player360.videoJSplayer.play();
                    });
                    // $('#playorsubmit').click(function () {
                    //     isCallActionthere = false;
                    //     $('#overlay-modal').hide();
                    //     player360.videoJSplayer.play();
                    // });
                });
                player360.videoJSplayer.on('play', function () {
                    player360.videoFileService.pauseAction = false;
                    const seekigTime = player360.trimCurrentTime( player360.videoJSplayer.currentTime());
                    console.log('ply button pressed ');
                    $('.vjs-big-play-button').css('display', 'none');
                    console.log('play button clicked and current time' + player360.trimCurrentTime( player360.videoJSplayer.currentTime()));
                    if (player360.replyVideo === true) {
                        player360.xtremandLog.actionId = player360.LogAction.replyVideo;
                        player360.replyVideo = false;
                    } else {
                        player360.xtremandLog.actionId = player360.LogAction.playVideo;
                    }
                    player360.xtremandLog.startTime = new Date();
                    player360.xtremandLog.endTime = new Date();
                    player360.xtremandLog.startDuration = player360.trimCurrentTime( player360.videoJSplayer.currentTime());
                    player360.xtremandLog.stopDuration = player360.trimCurrentTime( player360.videoJSplayer.currentTime());
                    console.log(player360.xtremandLog.actionId);
                    player360.videoLogAction(player360.xtremandLog);
                    if (player360.logVideoViewValue === true) {
                        player360.logVideoViewsCount();
                        player360.logVideoViewValue = false;
                    }
                });
                player360.videoJSplayer.on('pause', function () {
                    player360.videoFileService.pauseAction = false;
                    console.log('pused and current time' + player360.trimCurrentTime( player360.videoJSplayer.currentTime()));
                    player360.xtremandLog.actionId = player360.LogAction.pauseVideo;
                    player360.xtremandLog.startTime = new Date();
                    player360.xtremandLog.endTime = new Date();
                    player360.xtremandLog.startDuration = player360.trimCurrentTime( player360.videoJSplayer.currentTime());
                    player360.xtremandLog.stopDuration = player360.trimCurrentTime( player360.videoJSplayer.currentTime());
                    player360.videoLogAction(player360.xtremandLog);
                });
                player360.videoJSplayer.on('seeking', function () {
                if(player360.seekbarPreviousTime === false){
                    console.log(' enter into seek bar previous time is: '+player360.previousTime);
                    player360.seekbarTimestored = player360.previousTime;
                    console.log(player360.seekbarTimestored);
                    player360.seekbarPreviousTime = true;
                  }
                 const timeoutTime = 300;
                 const beforeCounter = player360.counter + 1;
                 if ( player360.videoJSplayer.cache_.currentTime ===  player360.videoJSplayer.duration()) {
                    return;
                 }
                 player360.beforeTimeChange = player360.beforeTimeChange ||  player360.videoJSplayer.cache_.currentTime;
                 setTimeout(function() {
                    if (beforeCounter === player360.counter) {
                        console.log('before seek', player360.beforeTimeChange, '\nafter seek',  player360.videoJSplayer.currentTime() - (timeoutTime / 1000));
                           player360.xtremandLog.actionId = player360.LogAction.videoPlayer_slideSlider;
                            player360.xtremandLog.startDuration = player360.previousTime;
                            player360.xtremandLog.stopDuration =  player360.videoJSplayer.currentTime() - (timeoutTime / 1000);
                            player360.xtremandLog.startTime = player360.startTimeUpdate;
                            player360.xtremandLog.endTime = new Date();
                            player360.videoLogAction(player360.xtremandLog);
                        player360.counter = 0;
                        player360.beforeTimeChange = 0;
                    }
                 }, timeoutTime);
                 player360.counter++;
                });
                player360.videoJSplayer.on('seeked', function(){
                    player360.seekbarPreviousTime = false;
                    player360.videoFileService.seekbarTime = 0;
                    console.log('seeked completed'+ player360.videoFileService.seekbarTime);
                });
                player360.videoJSplayer.on('timeupdate', function () {
                    player360.previousTime = player360.currentTime;
                    player360.currentTime =  player360.videoJSplayer.currentTime();
                    player360.startTimeUpdate = player360.endTimeUpdate;
                    player360.endTimeUpdate = new Date();
                    startDuration = player360.trimCurrentTime( player360.videoJSplayer.currentTime());
                });
                player360.videoJSplayer.on('ended', function () {
                    const time =  player360.videoJSplayer.currentTime();
                    console.log(time);
                    player360.replyVideo = true;
                    player360.videoFileService.replyVideo = true;
                    player360.xtremandLog.actionId = player360.LogAction.videoPlayer_movieReachEnd;
                    player360.xtremandLog.startTime = new Date();
                    player360.xtremandLog.endTime = new Date();
                    player360.xtremandLog.startDuration = player360.trimCurrentTime( player360.videoJSplayer.currentTime());
                    player360.xtremandLog.stopDuration = player360.trimCurrentTime( player360.videoJSplayer.currentTime());
                    player360.videoLogAction(player360.xtremandLog);
                    if (isValid === 'EndOftheVideo') {
                        //    $('#videoId').append( $('#overlay-modal').show());
                        //     newValue.show360ModalDialog();
                        //    $('.video-js .vjs-control-bar').hide();
                        const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                        const event = state ? 'FullscreenOn' : 'FullscreenOff';
                        if (event === "FullscreenOn") {
                            isCallActionthere = true;
                            player360.overLaySet = true;
                            player360.fullScreenMode = true;
                            $("#overlay-modal").css("width", "100%");
                            $("#overlay-modal").css("height", "100%");
                            $('#videoId').append($('#overlay-modal').show());
                        } else {
                            player360.overLaySet = false;
                            player360.fullScreenMode = false;
                            $('#videoId').append($('#overlay-modal').show());
                        }
                    } else if (isValid !== 'EndOftheVideo') {
                        $('#overlay-modal').hide();  player360.videoJSplayer.pause();
                    } else { $('#overlay-modal').hide();  player360.videoJSplayer.pause(); }
                    $('#repeatPlay').click(function () {
                        $('#overlay-modal').hide();
                       // player360.videoJSplayer.play();
                    });
                    $('#skipOverlay').click(function () {
                        isCallActionthere = false;
                        $('#overlay-modal').hide();
                        player360.videoJSplayer.pause();
                    });
                    $('#playorsubmit').click(function () {
                        isCallActionthere = false;
                        $('#overlay-modal').hide();
                        player360.videoJSplayer.pause();
                    });
                });
                player360.videoJSplayer.on('fullscreenchange', function () {
                    const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                    const event = state ? 'FullscreenOn' : 'FullscreenOff';
                    if (event === 'FullscreenOn') {
                        $(".vjs-tech").css("width", "100%");
                        $(".vjs-tech").css("height", "100%");
                        player360.fullScreenMode = true;
                        $('#videoId').append($('#overlay-logo').show());
                    } else if (event === "FullscreenOff") {
                        // $("#videoId").css("width", window.innerWidth);
                        // $("#videoId").css("height", window.innerHeight);
                        player360.setVideoIdHeightWidth();
                        player360.fullScreenMode = false;
                        player360.overLaySet = false;
                        if (isCallActionthere === true) {
                            player360.overLaySet = false;
                            player360.fullScreenMode = false;
                            // $("#overlay-modal").css("width", window.innerWidth);
                            // $("#overlay-modal").css("height", window.innerHeight);
                            player360.setOverlayModalHeightWidth();
                            $('#videoId').append($('#overlay-modal').hide());
                            //  player360.showEditModalDialog();
                        }
                    }
                });
                player360.videoJSplayer.on('click', function () {
                });
            }
        });
        // $('#videoId').css('width', window.innerWidth);
        // $('#videoId').css('height', window.innerHeight);
        this.setVideoIdHeightWidth();
    }

    playNormalVideo() {
        $('.p-video').remove();
        this.videoUtilService.normalVideoJsFiles();
        this.is360Value = false;
        const str = '<video id="videoId" poster=' + this.posterImagePath + '  preload="none"  class="video-js vjs-default-skin" muted="muted" controls></video>';
        $('#newPlayerVideo').append(str);
        this.videoUrl = this.embedVideoFile.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '_mobinar.m3u8';  // need to remove it

       //this.videoUrl = 'https://xamp.io/vod/videos/14626/24042019/xAmpemailtemplatesmodule1556137162081_mobinar.m3u8?access_token=09956128-2c5d-4284-8cd1-01aa36d286a4';
        $('#newPlayerVideo video').append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
        this.setVideoIdHeightWidth();
        $('.video-js .vjs-tech').css('width', '100%');
        $('.video-js .vjs-tech').css('height', '100%');
        const self = this;
        const overrideNativeValue = this.referService.getBrowserInfoForNativeSet();
            this.videoJSplayer = videojs('videoId', {
                "controls": true,
                "autoplay": false,
                "preload": "auto",
                html5: {
                    hls: {
                        overrideNative: overrideNativeValue
                    },
                    nativeVideoTracks: !overrideNativeValue,
                    nativeAudioTracks: !overrideNativeValue,
                    nativeTextTracks: !overrideNativeValue
                } }, function() {
                    const player = this;
                    let startDuration;
                    self.replyVideo = false;
                    let isCallActionthere = false;
                    const document: any = window.document;
                    const isValid = self.callAction.overLayValue;
                    this.ready(function () {
                        self.videoFileService.pauseAction = false;
                        self.xtremandLog.startDuration = 0;
                        self.xtremandLog.stopDuration = 0;
                        $('#videoId').append($('#overlay-logo').show());
                        $('.video-js .vjs-control-bar .vjs-VR-control').css('cssText', 'color:' + self.embedVideoFile.playerColor + '!important');
                        $('.video-js .vjs-tech').css('width', '100%');
                        $('.video-js .vjs-tech').css('height', '100%');
                        if (isValid === 'StartOftheVideo') {
                            $('.vjs-big-play-button').css('display', 'none');
                            $('#videoId').append($('#overlay-modal').show());
                            player.pause();
                        } else if (isValid !== 'StartOftheVideo') {
                            $('#overlay-modal').hide();
                           // player.play();
                        } else { $('#overlay-modal').hide();  player.play(); }
                        $('#skipOverlay').click(function () {
                            isCallActionthere = false;
                            $('#overlay-modal').hide();
                          //  player.play();
                        });
                       
                    });
                    this.on('play', function () {
                        self.videoFileService.pauseAction = false;
                        const seekigTime = self.trimCurrentTime(player.currentTime());
                        console.log('ply button pressed ');
                       // $('.vjs-big-play-button').css('display', 'none');
                        console.log('play button clicked and current time' + self.trimCurrentTime(player.currentTime()));
                        if (self.replyVideo === true) {
                            self.xtremandLog.actionId = self.LogAction.replyVideo;
                            self.replyVideo = false;
                        } else {
                            self.xtremandLog.actionId = self.LogAction.playVideo;
                        }
                        self.xtremandLog.startTime = new Date();
                        self.xtremandLog.endTime = new Date();
                        self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime());
                        self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime());
                        console.log(self.xtremandLog.actionId);
                        self.videoLogAction(self.xtremandLog);
                        if (self.logVideoViewValue === true) {
                            self.logVideoViewsCount();
                            self.logVideoViewValue = false;
                        }
                    });
                    this.on('pause', function () {
                        self.videoFileService.pauseAction = false;
                        console.log('pused and current time' + self.trimCurrentTime(player.currentTime()));
                        self.xtremandLog.actionId = self.LogAction.pauseVideo;
                        self.xtremandLog.startTime = new Date();
                        self.xtremandLog.endTime = new Date();
                        self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime());
                        self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime());
                        self.videoLogAction(self.xtremandLog);
                    });
                    this.on('seeking', function () {
                        self.videoFileService.pauseAction = true;
                        if(self.seekbarPreviousTime === false){
                            console.log(' enter into seek bar previous time is: '+self.previousTime);
                            self.seekbarTimestored = self.previousTime;
                            console.log(self.seekbarTimestored);
                            self.seekbarPreviousTime = true;
                        }
                        const timeoutTime = 300;
                            const beforeCounter = self.counter + 1;
                            if (player.cache_.currentTime === player.duration()) {
                                return;
                            }
                            self.beforeTimeChange = self.beforeTimeChange || player.cache_.currentTime;
                            setTimeout(function() {
                                if (beforeCounter === self.counter) {
                                    console.log('before seek', self.beforeTimeChange, '\nafter seek', player.currentTime() - (timeoutTime / 1000));
                                    self.xtremandLog.actionId = self.LogAction.videoPlayer_slideSlider;
                                        self.xtremandLog.startDuration = self.previousTime;
                                        self.xtremandLog.stopDuration = player.currentTime() - (timeoutTime / 1000);
                                    //   self.trimCurrentTime(player.currentTime()-(timeoutTime / 1000))
                                        self.xtremandLog.startTime = self.startTimeUpdate;
                                        self.xtremandLog.endTime = new Date();
                                        self.videoLogAction(self.xtremandLog);
                             self.counter = 0;
                             self.beforeTimeChange = 0;
                          }
                     }, timeoutTime);
                      self.counter++;
                    });
                     this.on('seeked', function(){
                        self.seekbarPreviousTime = false;
                        self.videoFileService.seekbarTime = 0;
                        console.log('seeked completed'+ self.videoFileService.seekbarTime);
                    });
                    this.on('timeupdate', function () {
                        self.previousTime = self.currentTime;
                        self.currentTime = player.currentTime();
                        self.startTimeUpdate = self.endTimeUpdate;
                        self.endTimeUpdate = new Date();
                        startDuration = self.trimCurrentTime(player.currentTime());
                    });
                    this.on('ended', function () {
                        const time = player.currentTime();
                        console.log(time);
                        self.replyVideo = true;
                        self.logVideoViewValue = true;
                        self.videoFileService.replyVideo = true;
                        console.log('video ended attempts' + self.replyVideo);
                        self.xtremandLog.actionId = self.LogAction.videoPlayer_movieReachEnd;
                        self.xtremandLog.startTime = new Date();
                        self.xtremandLog.endTime = new Date();
                        self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime());
                        self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime());
                        self.videoLogAction(self.xtremandLog);
                        if (isValid === 'EndOftheVideo') {
                            $('.vjs-big-play-button').css('display', 'none');
                            const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                            const event = state ? 'FullscreenOn' : 'FullscreenOff';
                            if (event === "FullscreenOn") {
                                isCallActionthere = true;
                                self.overLaySet = true;
                                self.fullScreenMode = true;
                                // $("#videoId").css("width", window.innerWidth);
                                // $("#videoId").css("height", window.innerHeight);
                                self.setVideoIdHeightWidth();
                                $("#overlay-modal").css("width", "100%");
                                $("#overlay-modal").css("height", "100%");
                                $('#videoId').append($('#overlay-modal').show());
                            } else {
                                self.overLaySet = false;
                                self.fullScreenMode = false;
                                $('#videoId').append($('#overlay-modal').show());
                            }
                        } else if (isValid !== 'EndOftheVideo') {
                            $('.vjs-big-play-button').css('display', 'none');
                            $('#overlay-modal').hide(); //  player.pause();
                        } else {
                            $('#overlay-modal').hide(); // player.pause();
                        }
                        $('#repeatPlay').click(function () {
                            $('#overlay-modal').hide();
                            self.replyVideo = true;
                            //player.play();
                        });
                        $('#skipOverlay').click(function () {
                            isCallActionthere = false;
                            $('#overlay-modal').hide();
                        });
                        $('#playorsubmit').click(function () {
                            isCallActionthere = false;
                            player.pause();
                            $('#overlay-modal').hide();
                        });
                    });
                    this.on('fullscreenchange', function () {
                        const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                        const event = state ? 'FullscreenOn' : 'FullscreenOff';
                        if (event === "FullscreenOn") {
                            $(".vjs-tech").css("width", "100%");
                            $(".vjs-tech").css("height", "100%");
                            self.fullScreenMode = true;
                            $('#videoId').append($('#overlay-logo').show());
                        } else if (event === "FullscreenOff") {
                            // $("#videoId").css("width",  window.innerWidth);
                            // $("#videoId").css("height", window.innerHeight);
                            self.setVideoIdHeightWidth();
                            self.fullScreenMode = false;
                            self.overLaySet = false;
                            if (isCallActionthere === true) {
                                self.overLaySet = false;
                                self.fullScreenMode = false;
                                // $("#overlay-modal").css("width",  window.innerWidth);
                                // $("#overlay-modal").css("height", window.innerHeight);
                                self.setOverlayModalHeightWidth();
                                $('#videoId').append($('#overlay-modal').show());
                            }
                        }
                    });
                    this.on('contextmenu', function (e) {
                        e.preventDefault();
                    });
                    this.hotkeys({
                        volumeStep: 0.1, seekStep: 5, enableMute: true,
                        enableFullscreen: false, enableNumbers: false,
                        enableVolumeScroll: true,
                         playbackRates: [0.5, 1, 1.5, 2],
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
                                        const number = event.which - sub;
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
        //    this.videoPlayListSourceM3U8();
    }
    trimCurrentTime(currentTime) {
        return Math.round(currentTime * 100) / 100;
    }
    defaultVideoControllers() {
        if (this.embedVideoFile.enableVideoController === false) {
            $('.video-js .vjs-control-bar').hide();
        } else { $('.video-js .vjs-control-bar').show(); }
    }
    transperancyControllBar(value: any) {
        const color: any = this.embedVideoFile.controllerColor;
        const rgba = this.videoUtilService.transparancyControllBarColor(color, value);
        $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
    }
    extractData(res: Response) {
        const body = res.json();
        console.log(body);
        return body || {};
    }
    handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(errMsg);
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
        this.xtremandLog.videoAlias = this.embedVideoFile.alias;
        // device detector
        this.xtremandLog.deviceType = this.deviceInfo.device;
        if (this.xtremandLog.deviceType === 'unknown') {
            this.xtremandLog.deviceType = 'computer';
        }
        this.xtremandLog.os = this.deviceInfo.os;
        // location detector
        console.log(this.xtremandLog);
        this.xtremandLog.sessionId = this.sessionId;
        this.xtremandLog.userId = 0;
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
    loacationDetails() {
        this.videoFileService.getJSONLocation()
            .subscribe(
            (data: any) => {
                this.defaultLocationJsonValues(data);
                console.log(data);
            },
            (error: any) => {
                console.log(error);
                //  this.errorPage = true;
                this.xtremandLogger.error(error);
            });
    }
    createSessionId() {
        this.sessionId = UUID.UUID();
        console.log(this.sessionId);
        this.deviceDectorInfo();
    }
    videoLogAction(xtremandLog: XtremandLog) {
        if(xtremandLog.actionId === 8) { xtremandLog.startDuration = this.seekbarTimestored;
        console.log(xtremandLog.startDuration);
        this.videoFileService.seekbarTime = this.seekbarTimestored;
        }
        this.videoFileService.logEmbedVideoActions(xtremandLog).subscribe(
            (result: any) => {
                xtremandLog.previousId = result.id;
                console.log('successfully logged the actions');
                console.log(this.xtremandLog.actionId);
            });
    }
    logVideoViewsCount() {
        this.videoFileService.logVideoViews(this.embedVideoFile.alias,this.shortnerUrlAlias).subscribe(
            (result: any) => {
                console.log('successfully logged view count');
            });
    }
    playVideoJs(){
    	 $('#overlay-modal').hide();
         if (this.videoJSplayer) {
             if (this.callAction.videoOverlaySubmit === 'PLAY') {
                 this.videoJSplayer.play();
             } else { this.videoJSplayer.pause(); }
      }
    }
    saveCallToActionUserForm() {
        this.xtremandLogger.debug(this.callAction.email_id);
        // this.user.emailId = this.toLowerString(this.callAction.email_id);
        // this.user.firstName = this.callAction.firstName;
        // this.user.lastName = this.callAction.lastName;
        // this.xtremandLogger.debug(this.user);
        const emailLogReport = {
          'emailId': this.toLowerString(this.callAction.email_id),'firstName': this.callAction.firstName,
          'lastName': this.callAction.lastName, 'sessionId': this.sessionId
        };
        this.xtremandLogger.debug(emailLogReport);
        this.videoFileService.saveCalltoActionUser(emailLogReport, this.embedVideoFile.id)
            .subscribe((result: any) => {
               this.xtremandLogger.info('Save user Form call to acton is successfull' + result);
                if(result.statusCode === 200){
                this.xtremandLog.userId = result.id;
                this.playVideoJs();
                this.videoJSplayer.play();
               }else if(result.statusCode === 409){
            	   this.isCallToActionError = true;
            	   this.callToActionErrorMessage = result.errorMessage;
               }
               // this.referService.shareUserId = result.id;
                },
              (error: any) => {
                //  this.errorPage = true;
                this.xtremandLogger.error(error);
                this.playVideoJs();
              },
            ()=>{ });
    }
    toLowerString(mail: string) {
        return mail.toLowerCase();
    }

    sharedSuccess() {
        this.xtremandLog.actionId = 12;
        this.xtremandLog.startTime = new Date();
        this.xtremandLog.endTime = new Date();
        this.xtremandLog.startDuration = 0;
        this.xtremandLog.stopDuration = 0;
        this.videoLogAction(this.xtremandLog);
    }
    videoStoppedEvent() {
        this.xtremandLog.actionId = this.LogAction.videoStopped;
        this.xtremandLog.startTime = new Date();
        this.xtremandLog.endTime = new Date();
        console.log(this.xtremandLog);
        this.videoLogAction(this.xtremandLog);
    }

    @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHander(event) {
        this.xtremandLog.actionId = this.LogAction.videoStopped;
        this.xtremandLog.startTime = new Date();
        this.xtremandLog.endTime = new Date();
        console.log(this.xtremandLog);
        this.videoLogAction(this.xtremandLog);
        // event.returnValue = "Are you sure?";
    }

    onResize(event) {
      const innerWidth = event.target.innerWidth;
      console.log(innerWidth);
      if (innerWidth >= 767) {
        //alert('hieght 767');
        
      }
   }
    ngOnDestroy() {
        // this.setConfirmUnload(false);
        this.xtremandLogger.info('Deinit - Destroyed Share-Video Component');
        this.videoStoppedEvent();
        if (this.videoJSplayer) {
            this.videoJSplayer.dispose();
        }
        $('.h-video').remove();
        $('.p-video').remove();
        this.videoFileService.replyVideo = false;
        //this.referService.shareUserId = 0;
        //  this.sub.unsubscribe();
    }
}
