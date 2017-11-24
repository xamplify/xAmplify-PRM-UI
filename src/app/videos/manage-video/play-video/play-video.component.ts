import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { ReferenceService } from '../../../core/services/reference.service';
import { PagerService } from '../../../core/services/pager.service';
import { VideoFileService } from '../../services/video-file.service';
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';
import { VideoUtilService } from '../../services/video-util.service';
import { Ng2DeviceService } from 'ng2-device-detector';
import { UUID } from 'angular2-uuid';
import { CallAction } from '../../models/call-action';
import { SaveVideoFile } from '../../models/save-video-file';
import { User } from '../../../core/models/user';
import { Pagination } from '../../../core/models/pagination';
import { XtremandLog } from '../../models/xtremand-log';
import { HttpRequestLoader } from '../../../core/models/http-request-loader';
declare var $, videojs, QuickSidebar, Metronic, Layout, Demo, Index: any;
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
    selector: 'app-play-video',
    templateUrl: './play-video.component.html',
    styleUrls: ['./play-video.component.css', '../../../../assets/css/video-css/video-js.custom.css',
        '../../../../assets/css/video-css/videojs-overlay.css', '../../../../assets/css/about-us.css',
        '../../../../assets/css/todo.css', '../edit-video/edit-video.component.css',
        '../edit-video/call-action.css'],
    providers: [Pagination, XtremandLog, HttpRequestLoader]
})
export class PlayVideoComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() totalRecords: number;
    @Input() selectedVideo: SaveVideoFile;
    allVideos: Array<SaveVideoFile>;
    user: User = new User();
    callAction: CallAction = new CallAction();
    selectedPosition: number;
    embedSrcPath: string;
    embedWidth = '640';
    embedHeight = '360';
    videoSizes: string[];
    videosize = '640 × 360';
    embedFullScreen = 'allowfullscreen';
    isFullscreen: boolean;
    videoUrl: string;
    videoJSplayer: any;
    posterImg: string;
    likes: boolean;
    comments: boolean;
    shareVideo: boolean;
    embedVideo: boolean;
    durationTime: number;
    likesValues: number;
    disLikesValues: number;
    shareValues: boolean;
    is360Value: boolean;
    embedUrl: string;
    ClipboardName: string;
    // logging info details
    sessionId: string;
    deviceInfo: any;
    LogAction: typeof LogAction = LogAction;
    replyVideo: boolean;
    overLaySet = false;
    fullScreenMode = false;
    showRelatedMessage: boolean;
    isThisDraftVideo = false;
    hasVideoRole = false;
    hasAllAccess = false;
    loggedInUserId = 0;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    constructor(public authenticationService: AuthenticationService, public router: Router,
        public videoFileService: VideoFileService, public videoUtilService: VideoUtilService, public pagination: Pagination,
        public xtremandLog: XtremandLog, public deviceService: Ng2DeviceService, public xtremandLogger: XtremandLogger,
        public pagerService: PagerService, public referenceService: ReferenceService) {
        this.videoSizes = this.videoUtilService.videoSizes;
        this.disLikesValues = 0;
        this.likesValues = 0;
        this.isFullscreen = true;
        this.ClipboardName = 'Copy to ClipBoard';
        this.loggedInUserId = this.authenticationService.getUserId();
        this.hasVideoRole = this.referenceService.hasRole(this.referenceService.roles.videRole);
        this.hasAllAccess = this.referenceService.hasAllAccess();
    }
    embedSourcePath(alias: string, viewBy: string) {
        this.embedSrcPath = this.authenticationService.APP_URL + 'embed/' +
        this.selectedVideo.viewBy.toLowerCase() + '/' + this.selectedVideo.alias;
        console.log(this.embedSrcPath);
    }
    checkCallToActionAvailable() {
        if (this.selectedVideo.startOfVideo === true && this.selectedVideo.callACtion === true) {
            this.callAction.overLayValue = 'StartOftheVideo';
            this.callAction.videoOverlaySubmit = 'PLAY';
        } else if (this.selectedVideo.endOfVideo === true && this.selectedVideo.callACtion === true) {
            this.callAction.overLayValue = 'EndOftheVideo';
            this.callAction.videoOverlaySubmit = 'SUBMIT';
        } else {
            this.callAction.overLayValue = 'removeCallAction';
        }
    }
    playVideoInfo(selectedVideo: SaveVideoFile) {
        this.posterImg = this.selectedVideo.imagePath + '?access_token=' + this.authenticationService.access_token;
        this.videoUrl = this.selectedVideo.videoPath;
        // call to action values
        this.callAction.isFistNameChecked = this.selectedVideo.name; // need  the value from server
        this.callAction.isSkipChecked = this.selectedVideo.skip; // need to get the value from server
        // video controlls
        this.likes = this.selectedVideo.allowLikes;
        this.comments = this.selectedVideo.allowComments;
        this.shareVideo = this.selectedVideo.allowSharing;
        this.embedVideo = this.selectedVideo.allowEmbed;
        console.log(this.selectedVideo);
        this.is360Value = this.selectedVideo.is360video;
        if (this.selectedVideo.viewBy === 'DRAFT') {
            this.isThisDraftVideo = true;
        } else { this.isThisDraftVideo = false; }
        this.embedSourcePath(this.selectedVideo.alias, this.selectedVideo.viewBy);
    }
    showOverlayModal() {
        $('#modalDialog').append($('#overlay-modal').show());
    }
    shareClick() {
        const shareUrl = this.authenticationService.APP_URL+ 'embed/'+this.selectedVideo.viewBy.toLowerCase() + '/' + this.selectedVideo.alias; 
        this.videoUtilService.modalWindowPopUp(shareUrl, 670, 500);
    }
    showVideo(videoFile: SaveVideoFile, position: number) {
        this.createSessionId();  // creating new session id
        console.log('videoComponent showVideo() ' + position);
        if (this.selectedVideo) {
            console.log('videoComponent showVideo() re adding the existing video' + this.selectedPosition);
            this.allVideos.push(this.selectedVideo);
            this.pagination.pagedItems.push(this.selectedVideo);
        }
        this.videoFileService.getVideo(videoFile.alias, videoFile.viewBy)
            .subscribe((saveVideoFile: SaveVideoFile) => {
                this.selectedVideo = saveVideoFile;
                this.xtremandLogDefaultActions();  // loggin info method
                console.log(this.selectedVideo);
                for (let i = 0; i < this.pagination.pagedItems.length; i++) {
                    if (this.selectedVideo.id === this.pagination.pagedItems[i].id) {
                        this.pagination.pagedItems.splice(i, 1);
                        break;
                    }
                }
                this.selectedPosition = position;
                this.playVideoInfo(this.selectedVideo);
                this.checkCallToActionAvailable();
                if (this.selectedVideo.is360video) {
                    this.play360Video();
                } else {
                    $('#newPlayerVideo').empty();
                    $('#videoId').remove();
                    this.playNormalVideoFiles();
                    const str = '<video id="videoId"  poster=' + this.posterImg + ' preload="none"  autoplay= "false" class="video-js vjs-default-skin" controls></video>';
                    $('#newPlayerVideo').append(str);
                    this.videoUrl = this.selectedVideo.videoPath;
                    this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
                    this.videoUrl = this.videoUrl + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
                    $('#newPlayerVideo video').append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
                    $('#videoId').css('height', '318px');
                    $('#videoId').css('width', 'auto');
                    $('.video-js .vjs-tech').css('width', '100%');
                    $('.video-js .vjs-tech').css('height', '100%');
                    const self = this;
                    this.videoJSplayer = videojs('videoId', {}, function () {
                        const player = this;
                        const document: any = window.document;
                        let startDuration;
                        self.replyVideo = false;
                        let isCallActionthere = false;
                        const isValid = self.callAction.overLayValue;
                        this.ready(function () {
                            $('.video-js .vjs-tech').css('width', '100%');
                            $('.video-js .vjs-tech').css('height', '100%');
                            if (isValid === 'StartOftheVideo') {
                                $('.vjs-big-play-button').css('display', 'none');
                                self.showOverlayModal();
                                player.pause();
                            } else if (isValid !== 'StartOftheVideo') {
                                $('#overlay-modal').hide();
                                $('.vjs-big-play-button').css('display', 'none');
                                player.play();
                            } else {
                                $('#overlay-modal').hide();
                                $('.vjs-big-play-button').css('display', 'none');
                                player.play();
                            }
                        });
                        this.on('seeking', function () {
                            const seekigTime = self.trimCurrentTime(player.currentTime());
                            self.xtremandLog.actionId = self.LogAction.videoPlayer_slideSlider;
                            self.xtremandLog.startTime = new Date();
                            self.xtremandLog.endTime = new Date();
                            self.xtremandLog.startDuration = startDuration;
                            self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime());
                            console.log(self.xtremandLog);
                            // self.videoLogAction(self.xtremandLog);
                        });
                        this.on('timeupdate', function () {
                            startDuration = self.trimCurrentTime(player.currentTime());
                        });
                        this.on('play', function () {
                            $('.vjs-big-play-button').css('display', 'none');
                            console.log('play button clicked and current time' + self.trimCurrentTime(player.currentTime()));
                            console.log('replay video count:' + self.replyVideo);
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
                            self.videoLogAction(self.xtremandLog);
                        });
                        this.on('pause', function () {
                            if (self.xtremandLog.actionId !== self.LogAction.videoPlayer_movieReachEnd) {
                                console.log('pused and current time' + self.trimCurrentTime(player.currentTime()));
                                self.xtremandLog.actionId = self.LogAction.pauseVideo;
                                self.xtremandLog.startTime = new Date();
                                self.xtremandLog.endTime = new Date();
                                self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime());
                                self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime());
                                self.videoLogAction(self.xtremandLog);
                            }
                        });
                        this.on('ended', function () {
                            const time = player.currentTime();
                            console.log(time);
                            self.replyVideo = true;
                            console.log('video ended attempts' + self.replyVideo);
                            self.xtremandLog.actionId = self.LogAction.videoPlayer_movieReachEnd;
                            self.xtremandLog.startTime = new Date();
                            self.xtremandLog.endTime = new Date();
                            self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime());
                            self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime());
                            self.videoLogAction(self.xtremandLog);
                            if (isValid === 'EndOftheVideo') {
                                const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                                const event = state ? 'FullscreenOn' : 'FullscreenOff';
                                if (event === 'FullscreenOn') {
                                    isCallActionthere = true;
                                    self.overLaySet = true;
                                    self.fullScreenMode = true;
                                    $('#overlay-modal').css('width', '100%');
                                    $('#overlay-modal').css('height', '100%');
                                    $('#videoId').append($('#overlay-modal').show());
                                } else {
                                    self.overLaySet = false;
                                    self.showOverlayModal();
                                }
                            } else if (isValid !== 'EndOftheVideo') {
                                $('#overlay-modal').hide(); // player.pause();
                            } else {
                                $('#overlay-modal').hide();
                            }
                            $('#repeatPlay').click(function () {
                                $('#overlay-modal').hide();
                                player.play();
                            });
                            $('#skipOverlay').click(function () {
                                isCallActionthere = false;
                                self.fullScreenMode = false;
                                $('#overlay-modal').hide();
                                player.pause();
                            });
                            $('#playorsubmit').click(function () {
                                isCallActionthere = false;
                                self.fullScreenMode = false;
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
                            } else if (event === 'FullscreenOff') {
                                $('#videoId').css('width', 'auto');
                                $('#videoId').css('height', '318px');
                                self.fullScreenMode = false;
                                self.overLaySet = false;
                                if (isCallActionthere === true) {
                                    self.overLaySet = false;
                                    self.fullScreenMode = false;
                                    $('#videoId').append($('#overlay-modal').hide());
                                    self.showOverlayModal();
                                    $('#overlay-modal').css('width', '100%');
                                    $('#overlay-modal').css('height', '318px');
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
                                            let number = event.which - sub;
                                            player.currentTime(player.duration() * number * 0.1);
                                        }
                                    }
                                },
                                emptyHotkey: {},
                                withoutKey: {
                                    handler: function (player: any, options: any, event: any) {
                                        console.log('withoutKey handler');
                                    }
                                },
                                withoutHandler: { key: function (e: any) { return true; } },
                                malformedKey: {
                                    key: function () { console.log(' The Key function must return a boolean.'); },
                                    handler: function (player: any, options: any, event: any) { }
                                }
                            }
                        });
                    });
                }
                this.defaultVideoOptions();
                this.transperancyControllBar(this.selectedVideo.transparency);
                if (this.selectedVideo.enableVideoController === false) { this.defaultVideoControllers(); }
            },
            (error: any) => {
                console.log('Play video component : show play videos method ():' + error);
                this.xtremandLogger.errorPage(error);
            }
            );
    }
    likesValuesDemo() {
        this.likesValues += 1;
    }
    disLikesValuesDemo() {
        this.disLikesValues += 1;
    }
    embedFulScreenValue() {
        if (this.isFullscreen === true) {
            this.embedFullScreen = 'allowfullscreen';
        } else { this.embedFullScreen = ''; }
    }
    embedVideoSizes() {
        if (this.videosize === this.videoSizes[0]) {
            this.embedWidth = '1280'; this.embedHeight = '720';
        } else if (this.videosize === this.videoSizes[1]) {
            this.embedWidth = '560'; this.embedHeight = '315';
        } else if (this.videosize === this.videoSizes[2]) {
            this.embedWidth = '853'; this.embedHeight = '480';
        } else { this.embedWidth = '640'; this.embedHeight = '360'; }
    }
    checkingCallToActionValues() {
        if (this.callAction.isFistNameChecked === true && this.videoUtilService.validateEmail(this.callAction.email_id)
            && this.callAction.firstName.length !== 0 && this.callAction.lastName.length !== 0) {
            this.callAction.isOverlay = false;
            console.log(this.callAction.email_id + 'mail ' + this.callAction.firstName + ' and last name ' + this.callAction.lastName);
        } else if (this.callAction.isFistNameChecked === false && this.videoUtilService.validateEmail(this.callAction.email_id)) {
            this.callAction.isOverlay = false;
        } else { this.callAction.isOverlay = true; }
    }
    embedCode() {
        this.ClipboardName = 'Copied !';
        (<HTMLInputElement>document.getElementById('embed_code')).select();
        document.execCommand('copy');
    }
    closeEmbedModal() {
        this.ClipboardName = 'Copy to Clipboard';
        $('#myModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop fade in').remove();
    }
    trimCurrentTime(currentTime) {
        return Math.round(currentTime * 100) / 100;
    }
    saveCallToActionUserForm() {
        $('#overlay-modal').hide();
        if (this.videoJSplayer) {
            if (this.callAction.videoOverlaySubmit === 'PLAY') { this.videoJSplayer.play();
            } else { this.videoJSplayer.pause(); }
        }
        console.log(this.callAction.email_id);
        if (this.authenticationService.user.emailId === this.callAction.email_id) {
            this.user.emailId = this.callAction.email_id;
            this.user.firstName = this.authenticationService.user.firstName;
            this.user.lastName = this.authenticationService.user.lastName;
        } else {
            this.user.emailId = this.callAction.email_id;
            this.user.firstName = this.callAction.firstName;
            this.user.lastName = this.callAction.lastName;
        }
        console.log(this.user);
        // this.videoFileService.saveCalltoActionUser(this.user)
        //     .subscribe((result: any) => {
        //         console.log('Save user Form call to acton is successfull' + result);
        //     });
    }
    ngOnInit() {
        Metronic.init();
        Layout.init();
        Demo.init();
        Index.init();
        QuickSidebar.init();
        this.createSessionId();
        this.deviceDectorInfo();
        this.xtremandLogDefaultActions();
        this.loadAllVideos(this.pagination);
        $('#overlay-modal').hide();
        this.callAction.email_id = this.authenticationService.user.emailId;
        this.callAction.firstName = this.authenticationService.user.firstName;
        this.callAction.lastName = this.authenticationService.user.lastName;

        if (this.videoUtilService.validateEmail(this.callAction.email_id)) {
            this.callAction.isOverlay = false;
        } else { this.callAction.isOverlay = true; }

        this.playVideoInfo(this.selectedVideo);
        this.checkCallToActionAvailable();
    }
    loadAllVideos(pagination: Pagination) {
        this.pagination.maxResults = 13;
        try {
            this.referenceService.loading(this.httpRequestLoader, true);
            this.videoFileService.loadVideoFiles(pagination)
                .subscribe((result: any) => {
                    this.allVideos = result.listOfMobinars;
                    this.totalRecords = result.totalRecords;
                    pagination.totalRecords = this.totalRecords;
                    for (let i = 0; i < this.allVideos.length; i++) {
                        const imagepath = this.allVideos[i].imagePath + '?access_token=' + this.authenticationService.access_token;
                        this.allVideos[i].imagePath = imagepath;  // this piece code need to remove
                    }
                    for (let i = 0; i < this.allVideos.length; i++) {
                        if (this.selectedVideo.id === this.allVideos[i].id) {
                            this.allVideos.splice(i, 1);
                            break;
                        }
                    }
                    if (this.allVideos.length === 0) {
                        this.showRelatedMessage = true;
                    } else { this.showRelatedMessage = false; }
                    pagination = this.pagerService.getPagedItems(pagination, this.allVideos);
                    this.referenceService.loading(this.httpRequestLoader, false);
                },
                (error: any) => {
                    console.log(error);
                    this.xtremandLogger.errorPage(error);
                },
                () => console.log('load All videos completed:' + this.allVideos),
            );
        } catch (error) {
              this.xtremandLogger.error('erro in load All videos :' + error);
        }
    }
    setPage(page: number) {
            this.pagination.pageIndex = page;
            this.loadAllVideos(this.pagination);
    }
    defaultVideoOptions() {
           this.videoUtilService.videoColorControlls(this.selectedVideo);
        if (!this.selectedVideo.allowFullscreen) {
            $('.video-js .vjs-fullscreen-control').hide();
        } else {
            $('.video-js .vjs-fullscreen-control').show();
        }
    }
    defaultVideoControllers() {
        if (!this.selectedVideo.enableVideoController) {
            $('.video-js .vjs-control-bar').hide();
        } else {
            $('.video-js .vjs-control-bar').show();
        }
    }
    transperancyControllBar(value: any) {
        const color: any = this.selectedVideo.controllerColor;
        const  rgba = this.videoUtilService.transparancyControllBarColor(color, value);
        $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
    }
    titleCheckLength(title: string) {
        if (title.length > 18) { title = title.substring(0, 18) + '...'; }
        return title;
    }
    play360Video() {
        this.is360Value = true;
        $('#newPlayerVideo').empty();
        $('.h-video').remove();
        this.videoUtilService.player360VideoJsFiles();
        let str = '<video id=videoId  poster=' + this.posterImg + ' class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
        $('#newPlayerVideo').append(str);
        this.videoUrl = this.selectedVideo.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '.mp4?access_token=' + this.authenticationService.access_token;
        $('#newPlayerVideo video').append('<source src="' + this.videoUrl + '" type="video/mp4">');
        $('#videoId').css('height', '318px');
        $('#videoId').css('width', 'auto');
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
                const isValid = self.callAction.overLayValue;
                self.replyVideo = false;
                let startDuration;
                let isCallActionthere = false;
                const document: any = window.document;
                player.ready(function () {
                    if (isValid === 'StartOftheVideo') {
                        $('.vjs-big-play-button').css('display', 'none');
                        self.showOverlayModal();
                        player.pause();
                    } else if (isValid !== 'StartOftheVideo') {
                        $('#overlay-modal').hide(); player.play();
                    } else {
                        $('#overlay-modal').hide();
                        player.play();
                    }
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
                    if (self.xtremandLog.actionId !== self.LogAction.videoPlayer_movieReachEnd) {
                        console.log('pused and current time' + self.trimCurrentTime(player.currentTime()));
                        self.xtremandLog.actionId = self.LogAction.pauseVideo;
                        self.xtremandLog.startTime = new Date();
                        self.xtremandLog.endTime = new Date();
                        self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime());
                        self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime());
                        self.videoLogAction(self.xtremandLog);
                    }
                });
                player.on('play', function () {
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
                    self.videoLogAction(self.xtremandLog);
                });
                player.on('seeking', function () {
                    const seekigTime = self.trimCurrentTime(player.currentTime());
                    self.xtremandLog.actionId = self.LogAction.videoPlayer_slideSlider;
                    self.xtremandLog.startTime = new Date();
                    self.xtremandLog.endTime = new Date();
                    self.xtremandLog.startDuration = startDuration;
                    self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime());
                    self.videoLogAction(self.xtremandLog);
                });
                player.on('timeupdate', function () {
                    startDuration = self.trimCurrentTime(player.currentTime());
                });
                player.on('ended', function () {
                    const time = player.currentTime();
                    console.log(time);
                    self.replyVideo = true;
                    $('.vjs-big-play-button').css('display', 'block');
                    console.log('video ended attempts' + self.replyVideo);
                    self.xtremandLog.actionId = self.LogAction.videoPlayer_movieReachEnd;
                    self.xtremandLog.startTime = new Date();
                    self.xtremandLog.endTime = new Date();
                    self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime());
                    self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime());
                    self.videoLogAction(self.xtremandLog);
                    $('.vjs-big-play-button').css('display', 'none');
                    if (isValid === 'EndOftheVideo') {
                        const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                        const event = state ? 'FullscreenOn' : 'FullscreenOff';
                        if (event === 'FullscreenOn') {
                            isCallActionthere = true;
                            self.overLaySet = true;
                            self.fullScreenMode = true;
                            $('#overlay-modal').css('width', '100%');
                            $('#overlay-modal').css('height', '100%');
                            $('#videoId').append($('#overlay-modal').show());
                        } else {
                            self.overLaySet = false;
                            self.showOverlayModal();
                        }
                    } else if (isValid !== 'EndOftheVideo') {
                        $('#overlay-modal').hide(); // player.pause();
                    } else {
                        $('#overlay-modal').hide(); // player.pause();
                    }
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
                    } else if (event === 'FullscreenOff') {
                        $('#videoId').css('width', 'auto');
                        $('#videoId').css('height', '318px');
                        if (isCallActionthere === true) {
                            self.overLaySet = false;
                            self.fullScreenMode = false;
                            $('#overlay-modal').css('width', 'auto');
                            $('#overlay-modal').css('height', '318px');
                            $('#videoId').append($('#overlay-modal').hide());
                            self.showOverlayModal();
                            $('#overlay-modal').css('width', '100%');
                            $('#overlay-modal').css('height', '318px');
                        }
                    }
                });
                player.on('click', function () { });
            }
        });
        $('#videoId').css('width', 'auto');
        $('#videoId').css('height', '318px');
    }
    playNormalVideoFiles() {
        $('.p-video').remove();
        this.videoUtilService.normalVideoJsFiles();
    }
    playNormalVideo() {
        const str = '<video id=videoId  poster=' + this.posterImg + ' preload="none"  class="video-js vjs-default-skin" controls></video>';
        $('#newPlayerVideo').append(str);
        $('#videoId').css('height', '318px');
        $('#videoId').css('width', 'auto');
        this.videoUrl = this.selectedVideo.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
        $('#newPlayerVideo video').append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
        const self = this;
        this.videoJSplayer = videojs('videoId', {}, function () {
            const player = this;
            let startDuration;
            self.replyVideo = false;
            const document: any = window.document;
            $('.video-js .vjs-tech').css('width', '100%');
            $('.video-js .vjs-tech').css('height', '100%');
            const aspectRatio = 320 / 640;
            const isValid = self.callAction.overLayValue;
            let isCallActionthere = false;
            this.ready(function () {
                if (isValid === 'StartOftheVideo') {
                    $('.vjs-big-play-button').css('display', 'none');
                    //  $("#overlay-modal").css("display","block !important");
                    self.showOverlayModal();
                    //   player.pause();
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
                } else if (isValid !== 'StartOftheVideo') {
                    $('#overlay-modal').hide(); player.play();
                } else { $('#overlay-modal').hide(); player.play(); }
            });
            this.on('seeking', function () {
                const seekigTime = self.trimCurrentTime(player.currentTime());
                self.xtremandLog.actionId = self.LogAction.videoPlayer_slideSlider;
                self.xtremandLog.startTime = new Date();
                self.xtremandLog.endTime = new Date();
                self.xtremandLog.startDuration = startDuration;
                self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime());
                self.videoLogAction(self.xtremandLog);
            });
            this.on('timeupdate', function () {
                startDuration = self.trimCurrentTime(player.currentTime());
            });
            this.on('play', function () {
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
            });
            this.on('pause', function () {
                console.log('pused and current time' + self.trimCurrentTime(player.currentTime()));
                if (self.xtremandLog.actionId !== self.LogAction.videoPlayer_movieReachEnd) {
                    console.log('pused and current time' + self.trimCurrentTime(player.currentTime()));
                    self.xtremandLog.actionId = self.LogAction.pauseVideo;
                    self.xtremandLog.startTime = new Date();
                    self.xtremandLog.endTime = new Date();
                    self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime());
                    self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime());
                    self.videoLogAction(self.xtremandLog);
                }
            });
            this.on('ended', function () {
                const whereYouAt = player.currentTime();
                console.log(whereYouAt);
                self.replyVideo = true;
                //  $('.vjs-big-play-button').css('display', 'block');
                console.log('video ended attempts' + self.replyVideo);
                self.xtremandLog.actionId = self.LogAction.videoPlayer_movieReachEnd;
                self.xtremandLog.startTime = new Date();
                self.xtremandLog.endTime = new Date();
                self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime());
                self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime());
                self.videoLogAction(self.xtremandLog);
                if (isValid === 'EndOftheVideo') {
                    //  self.showOverlayModal();
                    const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                    const event = state ? 'FullscreenOn' : 'FullscreenOff';
                    if (event === 'FullscreenOn') {
                        isCallActionthere = true;
                        self.overLaySet = true;
                        self.fullScreenMode = true;
                        $('#overlay-modal').css('width', '100%');
                        $('#overlay-modal').css('height', '100%');
                        $('#videoId').append($('#overlay-modal').show());
                    } else {
                        self.overLaySet = false;
                        self.showOverlayModal();
                    }
                } else if (isValid !== 'EndOftheVideo') {
                    $('#overlay-modal').hide(); // player.pause();
                } else {
                    $('#overlay-modal').hide();
                    //  player.pause();
                    $('.vjs-big-play-button').css('display', 'none');
                }
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
                } else if (event === 'FullscreenOff') {
                    $('#videoId').css('width', 'auto');
                    $('#videoId').css('height', '318px');
                    self.fullScreenMode = false;
                    self.overLaySet = false;
                    if (isCallActionthere === true) {
                        self.overLaySet = false;
                        self.fullScreenMode = false;
                        $('#overlay-modal').css('width', 'auto');
                        $('#overlay-modal').css('height', '318px');
                        $('#videoId').append($('#overlay-modal').hide());
                        self.showOverlayModal();
                        $('#overlay-modal').css('width', '100%');
                        $('#overlay-modal').css('height', '318px');
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
    ngAfterViewInit() {
        console.log('called ng after view init');
        $('#newPlayerVideo').empty();
        if (this.selectedVideo.is360video !== true) {
            this.playNormalVideoFiles();
            this.is360Value = false;
            this.playNormalVideo();
        } else {
            this.play360Video();
        }
        this.defaultVideoOptions();
        this.transperancyControllBar(this.selectedVideo.transparency);
        if (this.selectedVideo.enableVideoController === false) { this.defaultVideoControllers(); }
    }
    ngOnDestroy() {
        console.log('Deinit - Destroyed Play-Video Component');
        if (this.videoJSplayer) {
            this.videoJSplayer.dispose();
        }
        $('.h-video').remove();
        $('.p-video').remove();
        this.closeEmbedModal();
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
        this.xtremandLog.userAlias = this.authenticationService.user.alias;
        this.xtremandLog.videoAlias = this.selectedVideo.alias;
        this.xtremandLog.campaignAlias = null;
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
    loacationDetails() {
        this.videoFileService.getJSONLocation()
            .subscribe(
            (data: any) => {
                this.defaultLocationJsonValues(data);
                console.log(data);
            },
            (error: any) => {
                this.xtremandLogger.log(error);
                this.xtremandLogger.errorPage(error);
            }
            );
    }
    createSessionId() {
        this.sessionId = UUID.UUID();
        console.log(this.sessionId);
    }
    videoLogAction(xtremandLog: XtremandLog) {
        // this.videoFileService.logCampaignVideoActions(xtremandLog).subscribe(
        //     (result: any) => {
        //         console.log('successfully logged the actions');
        //         console.log(this.xtremandLog.actionId);
        //     });
    }
}
