import { Component, ElementRef, OnInit, OnDestroy, Input, Inject, AfterViewInit, Renderer } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { VideoFileService } from '../services/video-file.service';
import { SaveVideoFile } from '../models/save-video-file';
import { Logger } from 'angular2-logger/core';
import { VideoUtilService } from '../services/video-util.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { User } from '../../core/models/user';
import { ShareButton, ShareProvider } from 'ngx-sharebuttons';
import { Subscription } from 'rxjs/Subscription';
import { XtremandLog } from '../models/xtremand-log';
declare var $, videojs: any;
import { Ng2DeviceService } from 'ng2-device-detector';
import { UUID } from 'angular2-uuid';
// logging info details
enum LogAction {
    playVideo = 1,
    pauseVideo = 2,
    contactButtonPressed = 3,
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
    styleUrls: ['./share-video.component.css', '../../../assets/css/video-css/video-js.custom.css'],
    providers: [VideoUtilService, XtremandLog]
})
export class ShareVideoComponent implements OnInit, OnDestroy {
    embedVideoFile: SaveVideoFile;
    public user: User = new User();
    public videoJSplayer: any;
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
    public timeValue: any;
    public logVideoViewValue: boolean;
    public overLaySet = false;
    public fullScreenMode = false;
    public seekStart = null;
    public seekStart360 = null;
    constructor(public router: Router, public route: ActivatedRoute, public videoFileService: VideoFileService,
        public logger: Logger, public videoUtilService: VideoUtilService, public xtremandLogger: XtremandLogger,
        public http: Http, public xtremandLog: XtremandLog, public deviceService: Ng2DeviceService) {
        this.xtremandLogger.log('share component constructor called');
        console.log('url is on angular 2' + document.location.href);
        this.embedUrl = document.location.href;
        this.logVideoViewValue = true;
    }
    // setConfirmUnload(on) {
    // window.onbeforeunload = (on) ? this.setMessage : null;
    // }
    setMessage() {
        this.videoStoppedEvent();
        return 'you have message';
    }
    shareMetaTags() {
        return this.http.get(this.shareUrl)
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe((result: any) => { }, (error: any) => { this.xtremandLogger.errorPage(error); });
    }
    getVideo(alias: string, viewby: string) {
        this.videoFileService.getVideo(alias, viewby)
            .subscribe(
            (result: SaveVideoFile) => {
                this.embedVideoFile = result;
                console.log(result);
                this.xtremandLogDefaultActions();
                this.posterImagePath = this.embedVideoFile.imagePath;
                this.is360Value = this.embedVideoFile.is360video;
                this.imgURL = this.embedVideoFile.gifImagePath;
                this.title = this.embedVideoFile.title;
                this.description = this.embedVideoFile.description;
                this.upperTextValue = this.embedVideoFile.upperText;
                this.lowerTextValue = this.embedVideoFile.lowerText;
                if (this.embedVideoFile.startOfVideo === true) {
                    this.videoOverlaySubmit = 'PLAY';
                } else { this.videoOverlaySubmit = 'SUBMIT'; }

                if (this.embedVideoFile.startOfVideo === true && this.embedVideoFile.callACtion === true) {
                    this.overLayValue = 'StartOftheVideo';
                    this.videoOverlaySubmit = 'PLAY';
                    this.isPlay = true;
                } else if (this.embedVideoFile.endOfVideo === true && this.embedVideoFile.callACtion === true) {
                    this.overLayValue = 'EndOftheVideo';
                    this.isPlay = false;
                    this.videoOverlaySubmit = 'SUBMIT';
                } else { this.overLayValue = 'removeCallAction'; }

                if (this.embedVideoFile.is360video === true) {
                    this.play360Video();
                } else {
                    this.playNormalVideo();
                }
                this.defaultVideoSettings();
                this.transperancyControllBar(this.embedVideoFile.transparency);
                if (this.embedVideoFile.enableVideoController === false) {
                    this.defaultVideoControllers();
                }
                this.defaultCallToActionValues();
                console.log(this.videoUrl);
                this.shareUrl = 'http://aravindu.com/xtremand-share/video?viewBy=' + this.embedVideoFile.viewBy
                    + '&alias=' + this.embedVideoFile.alias;
                this.imgURL = this.embedVideoFile.gifImagePath;
                console.log(this.shareUrl);
                this.shareMetaTags();
            }, (error: any) => { this.xtremandLogger.errorPage(error); });
    }
    ngOnInit() {
        //  this.setConfirmUnload(true);
        $('#overlay-modal').hide();
        console.log('Share video component ngOnInit called');
        this.createSessionId();
        this.deviceDectorInfo();
        this.loacationDetails();
        this.routerType = this.route.snapshot.params['type'];
        this.routerAlias = this.route.snapshot.params['alias'];
        console.log(this.routerType + ' and ' + this.routerAlias);
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
        } else {
            $('.video-js .vjs-fullscreen-control').show();
        }
    }
    checkingCallToActionValues() {
        if (this.isFistNameChecked === true && this.videoUtilService.validateEmail(this.model.email_id)
            && this.firstName.length !== 0 && this.lastName.length !== 0) {
            this.isOverlay = false;
            console.log(this.model.email_id + 'mail ' + this.firstName + ' and last property ' + this.lastName);
        } else if (this.isFistNameChecked === false && this.videoUtilService.validateEmail(this.model.email_id)) {
            this.isOverlay = false;
        } else { this.isOverlay = true; }
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
        const str = '<video id=videoId poster=' + this.posterImagePath + ' class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
        $('#newPlayerVideo').append(str);
        this.videoUrl = this.embedVideoFile.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '.mp4';
        //  this.videoUrl = 'https://yanwsh.github.io/videojs-panorama/assets/shark.mp4'; // need to commet
        $('#newPlayerVideo video').append('<source src="' + this.videoUrl + '" type="video/mp4">');
        const player360 = this;
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
        player.panorama({
            autoMobileOrientation: true,
            clickAndDrag: true,
            clickToToggle: true,
            callback: function () {
                const isValid = player360.overLayValue;
                let startDuration;
                let isCallActionthere = false;
                const document: any = window.document;
                player360.replyVideo = false;
                player.ready(function () {
                    player360.xtremandLog.startDuration = 0;
                    player360.xtremandLog.startDuration = 0;
                    if (isValid === 'StartOftheVideo') {
                        $('#videoId').append($('#overlay-modal').show());
                    } else if (isValid !== 'StartOftheVideo') {
                        $('#overlay-modal').hide(); player.play();
                    } else { $('#overlay-modal').hide(); player.play(); }
                    $('#skipOverlay').click(function () {
                        isCallActionthere = false;
                        $('#overlay-modal').hide();
                        player.play();
                    });
                    $('#playorsubmit').click(function () {
                        isCallActionthere = false;
                        $('#overlay-modal').hide();
                        player.play();
                    });
                });
                player.on('play', function () {
                    player360.videoFileService.pauseAction = false;
                    const seekigTime = player360.trimCurrentTime(player.currentTime());
                    console.log('ply button pressed ');
                    $('.vjs-big-play-button').css('display', 'none');
                    console.log('play button clicked and current time' + player360.trimCurrentTime(player.currentTime()));
                    if (player360.replyVideo === true) {
                        player360.xtremandLog.actionId = player360.LogAction.replyVideo;
                        player360.replyVideo = false;
                    } else {
                        player360.xtremandLog.actionId = player360.LogAction.playVideo;
                    }
                    player360.xtremandLog.startTime = new Date();
                    player360.xtremandLog.endTime = new Date();
                    player360.xtremandLog.startDuration = player360.trimCurrentTime(player.currentTime());
                    player360.xtremandLog.stopDuration = player360.trimCurrentTime(player.currentTime());
                    console.log(player360.xtremandLog.actionId);
                    player360.videoLogAction(player360.xtremandLog);
                    if (player360.logVideoViewValue === true) {
                        player360.logVideoViewsCount();
                        player360.logVideoViewValue = false;
                    }
                });
                player.on('pause', function () {
                    player360.videoFileService.pauseAction = false;
                    console.log('pused and current time' + player360.trimCurrentTime(player.currentTime()));
                    player360.xtremandLog.actionId = player360.LogAction.pauseVideo;
                    player360.xtremandLog.startTime = new Date();
                    player360.xtremandLog.endTime = new Date();
                    player360.xtremandLog.startDuration = player360.trimCurrentTime(player.currentTime());
                    player360.xtremandLog.stopDuration = player360.trimCurrentTime(player.currentTime());
                    player360.videoLogAction(player360.xtremandLog);
                });
                player.on('seeking', function () {
                    const seekigTime = player360.trimCurrentTime(player.currentTime());
                    player360.videoFileService.pauseAction = true;
                    if (player360.seekStart360 === null) {
                        player360.seekStart360 = player360.trimCurrentTime(player.currentTime());
                    };
                });
                player.on('seeked', function () {
                    player360.videoFileService.pauseAction = true;
                    console.log('seeked from', player360.seekStart360);
                    console.log('previous value', player360.seekStart360, 'current time:',
                        player360.trimCurrentTime(player.currentTime()));
                    player360.xtremandLog.actionId = player360.LogAction.videoPlayer_slideSlider;
                    player360.xtremandLog.startDuration = player360.seekStart360;
                    player360.xtremandLog.stopDuration = player360.trimCurrentTime(player.currentTime());
                    if (player360.xtremandLog.startDuration === player360.xtremandLog.stopDuration) {
                        player360.xtremandLog.startDuration = player360.videoFileService.campaignTimeValue;
                        console.log('previuse time is ' + player360.videoFileService.campaignTimeValue);
                    }
                    player360.xtremandLog.startTime = new Date();
                    player360.xtremandLog.endTime = new Date();
                    player360.videoLogAction(player360.xtremandLog);
                    // player360.getCurrentTimeValues(player.currentTime());
                    player360.seekStart360 = null;
                    //  self.videoFileService.pauseAction = false;
                });
                player.on('timeupdate', function () {
                    startDuration = player360.trimCurrentTime(player.currentTime());
                });
                player.on('ended', function () {
                    const time = player.currentTime();
                    console.log(time);
                    player360.replyVideo = true;
                    player360.videoFileService.replyVideo = true;
                    player360.xtremandLog.actionId = player360.LogAction.videoPlayer_movieReachEnd;
                    player360.xtremandLog.startTime = new Date();
                    player360.xtremandLog.endTime = new Date();
                    player360.xtremandLog.startDuration = player360.trimCurrentTime(player.currentTime());
                    player360.xtremandLog.stopDuration = player360.trimCurrentTime(player.currentTime());
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
                            $('#videoId').append($('#overlay-modal').show());
                        }
                    } else if (isValid !== 'EndOftheVideo') {
                        $('#overlay-modal').hide(); player.pause();
                    } else { $('#overlay-modal').hide(); player.pause(); }
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
                        $(".vjs-tech").css("width", "100%");
                        $(".vjs-tech").css("height", "100%");
                    } else if (event === "FullscreenOff") {
                        $("#videoId").css("width", "auto");
                        $("#videoId").css("height", "318px");
                        player360.fullScreenMode = false;
                        player360.overLaySet = false;
                        if (isCallActionthere === true) {
                            player360.overLaySet = false;
                            player360.fullScreenMode = false;
                            $("#overlay-modal").css("width", "auto");
                            $("#overlay-modal").css("height", "318px");
                            $('#videoId').append($('#overlay-modal').hide());
                            //  player360.showEditModalDialog();
                        }
                    }
                });
                player.on('click', function () {
                });
            }
        });
        $('#videoId').css('width', 'auto');
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
        const str = '<video id="videoId" poster=' + this.posterImagePath + '  preload="none"  class="video-js vjs-default-skin" controls></video>';
        $('#newPlayerVideo').append(str);
        this.videoUrl = this.embedVideoFile.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '_mobinar.m3u8';  // need to remove it
        $('#newPlayerVideo video').append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
        $('#videoId').css('height', '318px');
        $('#videoId').css('width', 'auto');
        $('.video-js .vjs-tech').css('width', '100%');
        $('.video-js .vjs-tech').css('height', '100%');
        const self = this;
        this.videoJSplayer = videojs('videoId', {}, function () {
            const player = this;
            let startDuration;
            self.replyVideo = false;
            let isCallActionthere = false;
            const document: any = window.document;
            const isValid = self.overLayValue;
            this.ready(function () {
                self.videoFileService.pauseAction = false;
                self.xtremandLog.startDuration = 0;
                self.xtremandLog.stopDuration = 0;
                $('.video-js .vjs-tech').css('width', '100%');
                $('.video-js .vjs-tech').css('height', '100%');
                if (isValid === 'StartOftheVideo') {
                    $('.vjs-big-play-button').css('display', 'none');
                    $('#videoId').append($('#overlay-modal').show());
                } else if (isValid !== 'StartOftheVideo') {
                    $('.vjs-big-play-button').css('display', 'none');
                    $('#overlay-modal').hide(); player.play();
                } else { $('#overlay-modal').hide(); }
                $('#skipOverlay').click(function () {
                    isCallActionthere = false;
                    $('#overlay-modal').hide();
                    player.play();
                });
                $('#playorsubmit').click(function () {
                    isCallActionthere = false;
                    $('#overlay-modal').hide();
                    player.play();
                });
            });
            this.on('play', function () {
                self.videoFileService.pauseAction = false;
                const seekigTime = self.trimCurrentTime(player.currentTime());
                console.log('ply button pressed ');
                $('.vjs-big-play-button').css('display', 'none');
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
                const seekigTime = self.trimCurrentTime(player.currentTime());
                if (self.seekStart === null) {
                    self.seekStart = self.trimCurrentTime(player.currentTime());
                }
                console.log('enter into seeking');
            });
            this.on('seeked', function () {
                self.videoFileService.pauseAction = true;
                console.log('seeked from', self.seekStart);
                console.log('previous value', self.seekStart, 'current time:', self.trimCurrentTime(player.currentTime()));
                self.xtremandLog.actionId = self.LogAction.videoPlayer_slideSlider;
                self.xtremandLog.startDuration = self.seekStart;
                self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime());
                if (self.xtremandLog.startDuration === self.xtremandLog.stopDuration) {
                    self.xtremandLog.startDuration = self.videoFileService.campaignTimeValue;
                    console.log('previuse time is ' + self.videoFileService.campaignTimeValue);
                }
                self.xtremandLog.startTime = new Date();
                self.xtremandLog.endTime = new Date();
                self.videoLogAction(self.xtremandLog);
                self.seekStart = null;
            });
            this.on('timeupdate', function () {
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
                        $("#videoId").css("width", "auto");
                        $("#videoId").css("height", "318px");
                        $("#overlay-modal").css("width", "100%");
                        $("#overlay-modal").css("height", "100%");
                        $('#videoId').append($('#overlay-modal').show());
                    } else {
                        self.overLaySet = false;
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
                    player.play();
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
                } else if (event === "FullscreenOff") {
                    $("#videoId").css("width", "auto");
                    $("#videoId").css("height", "318px");
                    self.fullScreenMode = false;
                    self.overLaySet = false;
                    if (isCallActionthere === true) {
                        self.overLaySet = false;
                        self.fullScreenMode = false;
                        $("#overlay-modal").css("width", "auto");
                        $("#overlay-modal").css("height", "318px");
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
    getCurrentTimeValues(time: any) {
        const whereYouAt = time;
        const minutes = Math.floor(whereYouAt / 60);
        const seconds = Math.floor(whereYouAt);
        const x = minutes < 10 ? "0" + minutes : minutes;
        const y = seconds < 10 ? "0" + seconds : seconds;
        const timeValue = x + ":" + y;
        console.log(this.timeValue);
        this.videoFileService.timeValue = timeValue;
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
        const rgba = this.videoUtilService.convertHexToRgba(this.embedVideoFile.controllerColor, value);
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
                this.xtremandLogger.errorPage(error);
            });
    }
    createSessionId() {
        this.sessionId = UUID.UUID();
        console.log(this.sessionId);
        this.deviceDectorInfo();
    }
    videoLogAction(xtremandLog: XtremandLog) {
        this.videoFileService.logEmbedVideoActions(xtremandLog).subscribe(
            (result: any) => {
                console.log('successfully logged the actions');
                console.log(this.xtremandLog.actionId);
            });
    }
    logVideoViewsCount() {
        this.videoFileService.logVideoViews(this.embedVideoFile.alias).subscribe(
            (result: any) => {
                console.log('successfully logged view count');
            });
    }
    saveCallToActionUserForm() {
        $('#overlay-modal').hide();
        if (this.videoJSplayer) {
            if (this.videoOverlaySubmit === 'PLAY') {
                this.videoJSplayer.play();
            } else { this.videoJSplayer.pause(); }
        }
        this.logger.debug(this.model.email_id);
        this.user.emailId = this.model.email_id;
        this.user.firstName = this.firstName;
        this.user.lastName = this.lastName;
        this.logger.debug(this.user);
        this.videoFileService.saveCalltoActionUser(this.user)
            .subscribe((result: any) => {
                this.logger.info('Save user Form call to acton is successfull' + result);
            },
            (error: any) => { this.xtremandLogger.errorPage(error); });
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
    ngOnDestroy() {
        // this.setConfirmUnload(false);
        this.logger.info('Deinit - Destroyed Share-Video Component');
        this.videoStoppedEvent();
        if (this.videoJSplayer) {
            this.videoJSplayer.dispose();
        }
        $('.h-video').remove();
        $('.p-video').remove();
        this.videoFileService.replyVideo = false;
        //  this.sub.unsubscribe();
    }
}
