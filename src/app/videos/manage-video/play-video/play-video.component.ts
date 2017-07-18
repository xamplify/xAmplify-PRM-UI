import { Component, ElementRef, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SaveVideoFile } from '../../models/save-video-file';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { PagerService } from '../../../core/services/pager.service';
import { User } from '../../../core/models/user';
import { Pagination } from '../../../core/models/pagination';
import { VideoFileService } from '../../services/video-file.service';
import { VideoUtilService } from '../../services/video-util.service';
import { XtremandLog } from '../../models/xtremand-log';
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
    selector: 'app-play-video',
    templateUrl: './play-video.component.html',
    styleUrls: ['./play-video.component.css', '../../../../assets/css/video-css/video-js.custom.css',
        '../../../../assets/css/video-css/videojs-overlay.css', '../../../../assets/css/about-us.css',
        '../../../../assets/css/todo.css', '../edit-video/edit-video.component.css'],
    providers: [Pagination, XtremandLog]
})
export class PlayVideoComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() totalRecords: number;
    @Input() selectedVideo: SaveVideoFile;
    public allVideos: Array<SaveVideoFile>;
    private _elementRef: ElementRef;
    public user: User = new User();
    model: any = {};
    selectedPosition: number;
    public embedSrcPath: string;
    embedWidth = '640';
    embedHeight = '360';
    videoSizes: string[];
    videosize = '640 × 360';
    public embedFullScreen = 'allowfullscreen';
    isFullscreen: boolean;
    public videoUrl: string;
    private videoJSplayer: any;
    public posterImg: string;
    public likes: boolean;
    public comments: boolean;
    public shareVideo: boolean;
    public embedVideo: boolean;
    public isPlayButton: boolean;
    public isSkipChecked: boolean;
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
    public likesValues: number;
    public disLikesValues: number;
    public shareValues: boolean;
    public is360Value: boolean;
    public embedUrl: string;
    public ClipboardName: string;
    public imagepath: string;
    // logging info details
    public sessionId: string;
    public deviceInfo: any;
    LogAction: typeof LogAction = LogAction;
    public persons;
    public replyVideo: boolean;
    constructor(elementRef: ElementRef, private authenticationService: AuthenticationService, private router: Router,
        private videoFileService: VideoFileService, private videoUtilService: VideoUtilService, private pagination: Pagination,
        private xtremandLog: XtremandLog, private deviceService: Ng2DeviceService, private pagerService: PagerService) {
        this._elementRef = elementRef;
        this.videoSizes = this.videoUtilService.videoSizes;
        this.disLikesValues = 0;
        this.likesValues = 2;
        this.isFullscreen = true;
        this.ClipboardName = 'Copy to ClipBoard';
    }
    embedSourcePath(alias: string, viewBy: string) {
        this.embedSrcPath = document.location.href;
        this.embedSrcPath = this.embedSrcPath.substring(0, this.embedSrcPath.lastIndexOf('#')) + '#/embedVideo' + viewBy + alias;
        console.log(this.embedSrcPath);
    }
    checkCallToActionAvailable() {
        if (this.selectedVideo.startOfVideo === true && this.selectedVideo.callACtion === true) {
            this.overLayValue = 'StartOftheVideo';
            this.videoOverlaySubmit = 'PLAY';
            this.isPlay = true;
        } else if (this.selectedVideo.endOfVideo === true && this.selectedVideo.callACtion === true) {
            this.overLayValue = 'EndOftheVideo';
            this.isPlay = false;
            this.videoOverlaySubmit = 'SUBMIT';
        } else {
            this.overLayValue = 'removeCallAction';
        }
    }

    playVideoInfo(selectedVideo: SaveVideoFile) {
        this.posterImg = this.selectedVideo.imagePath + '?access_token=' + this.authenticationService.access_token;
        this.videoUrl = this.selectedVideo.videoPath;
        // call to action values
        this.isFistNameChecked = this.selectedVideo.name; // need  the value from server
        this.isPlayButton = this.selectedVideo.name;  // need to get the value from server
        this.isSkipChecked = this.selectedVideo.skip; // need to get the value from server
        // video controlls
        this.likes = this.selectedVideo.allowLikes;
        this.comments = this.selectedVideo.allowComments;
        this.shareVideo = this.selectedVideo.allowSharing;
        this.embedVideo = this.selectedVideo.allowEmbed;
        console.log(this.selectedVideo);
        this.is360Value = this.selectedVideo.is360video;
        this.embedSourcePath(this.selectedVideo.alias, this.selectedVideo.viewBy);
        this.embedUrl = 'https://aravindu.com/xtremandApp/embed-video/' + this.selectedVideo.viewBy + '/' + this.selectedVideo.alias;
    }
    showOverlayModal() {
        $('#modalDialog').append($('#overlay-modal').show());
    }
    shareClick() {
        window.open('http://localhost:4200/embed-video/' + this.selectedVideo.viewBy + '/' + this.selectedVideo.alias,
            'mywindow', 'menubar=1,resizable=1,width=670,height=420');
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
                    $('#videoId').css("height", "318px");
                    $("#videoId").css("width", "auto");
                    $(".video-js .vjs-tech").css("width", "100%");
                    $(".video-js .vjs-tech").css("height", "100%");
                    const self = this;
                    this.videoJSplayer = videojs('videoId', {}, function () {
                        const player = this;
                        const document: any = window.document;
                        let startDuration;
                        self.replyVideo = false;
                        const isValid = self.overLayValue;
                        this.ready(function () {
                            $(".video-js .vjs-tech").css("width", "100%");
                            $(".video-js .vjs-tech").css("height", "100%");
                            if (isValid === 'StartOftheVideo') {
                                $('.vjs-big-play-button').css('display', 'none');
                                //  $("#overlay-modal").css("display","block !important");
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
                            self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime()).toString();
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
                            self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime()).toString();
                            self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime()).toString();
                            self.videoLogAction(self.xtremandLog);
                        });
                        this.on('pause', function () {
                            if (self.xtremandLog.actionId !== self.LogAction.videoPlayer_movieReachEnd) {
                                console.log('pused and current time' + self.trimCurrentTime(player.currentTime()));
                                self.xtremandLog.actionId = self.LogAction.pauseVideo;
                                self.xtremandLog.startTime = new Date();
                                self.xtremandLog.endTime = new Date();
                                self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime()).toString();
                                self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime()).toString();
                                self.videoLogAction(self.xtremandLog);
                            }
                        });
                        this.on('ended', function () {
                            const time = player.currentTime();
                            console.log(time);
                            self.replyVideo = true;
                            $('.vjs-big-play-button').css('display', 'block');
                            console.log('video ended attempts' + self.replyVideo);
                            self.xtremandLog.actionId = self.LogAction.videoPlayer_movieReachEnd;
                            self.xtremandLog.startTime = new Date();
                            self.xtremandLog.endTime = new Date();
                            self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime()).toString();
                            self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime()).toString();
                            self.videoLogAction(self.xtremandLog);
                            if (isValid === 'EndOftheVideo') {
                                //   $('#play_video_player_demo1').append( $('#overlay-modal').show());
                                self.showOverlayModal();
                            } else if (isValid !== 'EndOftheVideo') {
                                $('#overlay-modal').hide(); // player.pause();
                            } else {
                                $('#overlay-modal').hide();
                                // player.pause();
                                $('.vjs-big-play-button').css('display', 'block');
                            }
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
                                            var sub = 48;
                                            if (event.which > 95) { sub = 96; }
                                            var number = event.which - sub;
                                            player.currentTime(player.duration() * number * 0.1);
                                        }
                                    }
                                },
                                emptyHotkey: {},
                                withoutKey: { handler: function (player: any, options: any, event: any) { 
                                    console.log('withoutKey handler'); } },
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
            });
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
        if (this.isFistNameChecked === true && this.videoUtilService.validateEmail(this.model.email_id)
            && this.firstName.length !== 0 && this.lastName.length !== 0) {
            this.isOverlay = false;
            console.log(this.model.email_id + 'mail ' + this.firstName + ' and last name ' + this.lastName);
        } else if (this.isFistNameChecked === false && this.videoUtilService.validateEmail(this.model.email_id)) {
            this.isOverlay = false;
        } else { this.isOverlay = true; }
    }
    embedCode() {
        this.ClipboardName = 'Copied !';
        (<HTMLInputElement>document.getElementById('embed_code')).select();
        document.execCommand('copy');
    }
    closeEmbedModal() {
        this.ClipboardName = 'Copy to ClipBoard';
    }
    trimCurrentTime(currentTime) {
        return Math.round(currentTime * 100) / 100;
    }
    saveCallToActionUserForm() {
        $('#overlay-modal').hide();
        if (this.videoJSplayer) {
            if (this.videoOverlaySubmit === 'PLAY') {
                this.videoJSplayer.play();
            } else { this.videoJSplayer.pause(); }
        }
        console.log(this.model.email_id);
        if (this.authenticationService.user.emailId === this.model.email_id) {
            this.user.emailId = this.model.email_id;
            this.user.firstName = this.authenticationService.user.firstName;
            this.user.lastName = this.authenticationService.user.lastName;
        } else {
            this.user.emailId = this.model.email_id;
            this.user.firstName = this.firstName;
            this.user.lastName = this.lastName;
        }
        console.log(this.user);
        this.videoFileService.saveCalltoActionUser(this.user)
            .subscribe((result: any) => {
                console.log('Save user Form call to acton is successfull' + result);
            });
    }
    repeatPlayVideo() {
        $('#overlay-modal').hide();
        if (this.videoJSplayer) {
            this.videoJSplayer.play();
        }
    }
    skipOverlay() {
        $('#overlay-modal').hide();
        if (this.videoJSplayer) {
            this.videoJSplayer.play();
        }
    }
    ngOnInit() {
        this.createSessionId();
        this.deviceDectorInfo();
        this.xtremandLogDefaultActions();
        this.loadAllVideos(this.pagination);
        $('#overlay-modal').hide();
        this.model.email_id = this.authenticationService.user.emailId;
        this.firstName = this.authenticationService.user.firstName;
        this.lastName = this.authenticationService.user.lastName;

        if (this.videoUtilService.validateEmail(this.model.email_id)) {
            this.isOverlay = false;
        } else { this.isOverlay = true; }

        this.playVideoInfo(this.selectedVideo);
        this.checkCallToActionAvailable();
    }
    loadAllVideos(pagination: Pagination) {
        this.pagination.maxResults = 13;
        // this.pagination.maxResults = this.totalRecords;
        try {
            this.videoFileService.loadVideoFiles(pagination)
                .subscribe((result: any) => {
                    this.allVideos = result.listOfMobinars;
                    this.totalRecords = result.totalRecords;
                    pagination.totalRecords = this.totalRecords;
                    for (let i = 0; i < this.allVideos.length; i++) {
                        this.imagepath = this.allVideos[i].imagePath + '?access_token=' + this.authenticationService.access_token;
                        this.allVideos[i].imagePath = this.imagepath;  // this piece code need to remove
                    }
                    for (let i = 0; i < this.allVideos.length; i++) {
                        if (this.selectedVideo.id === this.allVideos[i].id) {
                            this.allVideos.splice(i, 1);
                            break;
                        }
                    }
                    pagination = this.pagerService.getPagedItems(pagination, this.allVideos);
                },
                (error: string) => {
                    console.log(error);
                },
                () => console.log('load All videos completed:' + this.allVideos),
            );
        } catch (error) {
            //   this.logger.error('erro in load All videos :' + error);
        }
    }
    setPage(page: number) {
        if (page !== this.pagination.pageIndex) {
            this.pagination.pageIndex = page;
            this.loadAllVideos(this.pagination);
        }
    }
    defaultVideoOptions() {
        $('.video-js').css('color', this.selectedVideo.playerColor);
        $('.video-js .vjs-play-progress').css('background-color', this.selectedVideo.playerColor);
        $('.video-js .vjs-volume-level').css('background-color', this.selectedVideo.playerColor);
        $('.video-js .vjs-control-bar').css('background-color', this.selectedVideo.controllerColor);
        $('.vjs-control-bar').css('background-color', this.selectedVideo.controllerColor);
        if (this.selectedVideo.allowFullscreen === false) {
            $('.video-js .vjs-fullscreen-control').hide();
        } else {
            $('.video-js .vjs-fullscreen-control').show();
        }
    }
    defaultVideoControllers() {
        if (this.selectedVideo.enableVideoController === false) {
            $('.video-js .vjs-control-bar').hide();
        } else {
            $('.video-js .vjs-control-bar').show();
        }
    }
    transperancyControllBar(value: any) {
        const rgba = this.videoUtilService.convertHexToRgba(this.selectedVideo.controllerColor, value);
        $('.video-js .vjs-control-bar').css('background-color', rgba);
    }
    play360Video() {
        this.is360Value = true;
        $('#newPlayerVideo').empty();
        $('.h-video').remove();
        $('head').append('<script src="assets/js/indexjscss/360-video-player/video.js" type="text/javascript"  class="p-video"/>');
        $('head').append('<script src="assets/js/indexjscss/360-video-player/three.js" type="text/javascript"  class="p-video" />');
        $('head').append('<link href="assets/js/indexjscss/360-video-player/videojs-panorama.min.css" rel="stylesheet"  class="p-video">');
        $('head').append('<script src="assets/js/indexjscss/360-video-player/videojs-panorama.v5.js" type="text/javascript"  class="p-video" />');
        $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"" type="text/javascript"  class="p-video" />');
        let str = '<video id=videoId  poster=' + this.posterImg + ' class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
        $('#newPlayerVideo').append(str);
        this.videoUrl = this.selectedVideo.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '.mp4?access_token=' + this.authenticationService.access_token;
        // this.videoUrl = 'https://yanwsh.github.io/videojs-panorama/assets/shark.mp4'; /// need to comment
        $('#newPlayerVideo video').append('<source src="' + this.videoUrl + '" type="video/mp4">');
        $("#videoId").css("height", "318");
        $("#videoId").css("width", "auto");
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
                                var sub = 48;
                                if (event.which > 95) { sub = 96; }
                                var number = event.which - sub;
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
                const isValid = self.overLayValue;
                self.replyVideo = false;
                let startDuration;
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
                        $('#overlay-modal').hide();
                        player.play();
                    });
                    $('#playorsubmit').click(function () {
                        $('#overlay-modal').hide();
                        if (self.videoOverlaySubmit === 'PLAY') { player.play(); }
                    });
                });
                player.on('pause', function () {
                    if (self.xtremandLog.actionId !== self.LogAction.videoPlayer_movieReachEnd) {
                        console.log('pused and current time' + self.trimCurrentTime(player.currentTime()));
                        self.xtremandLog.actionId = self.LogAction.pauseVideo;
                        self.xtremandLog.startTime = new Date();
                        self.xtremandLog.endTime = new Date();
                        self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime()).toString();
                        self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime()).toString();
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
                    self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime()).toString();
                    self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime()).toString();
                    self.videoLogAction(self.xtremandLog);
                });
                player.on('seeking', function () {
                    const seekigTime = self.trimCurrentTime(player.currentTime());
                    self.xtremandLog.actionId = self.LogAction.videoPlayer_slideSlider;
                    self.xtremandLog.startTime = new Date();
                    self.xtremandLog.endTime = new Date();
                    self.xtremandLog.startDuration = startDuration;
                    self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime()).toString();
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
                    self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime()).toString();
                    self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime()).toString();
                    self.videoLogAction(self.xtremandLog);
                    $('.vjs-big-play-button').css('display', 'none');
                    if (isValid === 'EndOftheVideo') {
                        self.showOverlayModal();
                        $('.video-js .vjs-control-bar').hide();
                    } else if (isValid !== 'EndOftheVideo') {
                        $('#overlay-modal').hide(); // player.pause();
                    } else {
                        $('#overlay-modal').hide(); // player.pause();
                    }
                    $('#replay-video1').click(function () {
                        $('#overlay-modal').hide();
                        player.play();
                    });
                    $('#skipOverlay').click(function () {
                        $('#overlay-modal').hide();
                         player.pause();
                        // $('.video-js .vjs-control-bar').hide();
                         $('.vjs-big-play-button').css('display', 'block');
                    });
                    $('#playorsubmit').click(function () {
                        $('#overlay-modal').hide();
                          player.pause();
                        //    $('.video-js .vjs-control-bar').hide();
                         $('.vjs-big-play-button').css('display', 'block');
                    });
                });
                player.on('click', function () { });
            }
        });
        $('#videoId').css('width', 'auto');
        $('#videoId').css('height', '318px');
    }
    playNormalVideoFiles() {
        $('.p-video').remove();
        $('head').append('<link href="assets/js/indexjscss/video-hls-player/video-hls-js.css" class="h-video" rel="stylesheet">');
        $('head').append('<script src="assets/js/indexjscss/video-hls-player/video-hls.js" type="text/javascript" class="h-video"  />');
        $('head').append('<script src="assets/js/indexjscss/video-hls-player/videojs.hls.min.js" type="text/javascript"  class="h-video"/>');
        $('head').append('<script src="assets/js/indexjscss/videojs-playlist.js" type="text/javascript"  class="h-video" />');
        $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"" type="text/javascript"  class="h-video" />');
    }
    playNormalVideo() {
        const str = '<video id=videoId  poster=' + this.posterImg + ' preload="none"  class="video-js vjs-default-skin" controls></video>';
        $("#newPlayerVideo").append(str);
        $("#videoId").css("height", "318px");
        $("#videoId").css("width", "auto");
        this.videoUrl = this.selectedVideo.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
        $("#newPlayerVideo video").append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
        const self = this;
        this.videoJSplayer = videojs('videoId', {}, function () {
            const player = this;
            let startDuration;
            self.replyVideo = false;
            const document: any = window.document;
            $(".video-js .vjs-tech").css("width", "100%");
            $(".video-js .vjs-tech").css("height", "100%");
            const aspectRatio = 320 / 640;
            const isValid = self.overLayValue;
            this.ready(function () {
                if (isValid === 'StartOftheVideo') {
                    $('.vjs-big-play-button').css('display', 'none');
                    //  $("#overlay-modal").css("display","block !important");
                    self.showOverlayModal();
                    player.pause();
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
                self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime()).toString();
                self.videoLogAction(self.xtremandLog);
            });
            this.on('timeupdate', function () {
                startDuration = self.trimCurrentTime(player.currentTime());
                // var  startDuration = player.currentTime();
                // console.log(this.currentTime());
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
                self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime()).toString();
                self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime()).toString();
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
                    self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime()).toString();
                    self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime()).toString();
                    self.videoLogAction(self.xtremandLog);
                }
            });
            this.on('ended', function () {
                const whereYouAt = player.currentTime();
                console.log(whereYouAt);
                self.replyVideo = true;
                $('.vjs-big-play-button').css('display', 'block');
                console.log('video ended attempts' + self.replyVideo);
                self.xtremandLog.actionId = self.LogAction.videoPlayer_movieReachEnd;
                self.xtremandLog.startTime = new Date();
                self.xtremandLog.endTime = new Date();
                self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime()).toString();
                self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime()).toString();
                self.videoLogAction(self.xtremandLog);
                if (isValid === 'EndOftheVideo') {
                    self.showOverlayModal();
                } else if (isValid !== 'EndOftheVideo') {
                    $('#overlay-modal').hide(); // player.pause();
                } else {
                    $('#overlay-modal').hide();
                    //  player.pause();
                    $('.vjs-big-play-button').css('display', 'none');
                }
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
                                var sub = 48;
                                if (event.which > 95) { sub = 96; }
                                var number = event.which - sub;
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
            error => console.log(error));
    }
    createSessionId() {
        this.sessionId = UUID.UUID();
        console.log(this.sessionId);
    }
    videoLogAction(xtremandLog: XtremandLog) {
        this.videoFileService.logVideoActions(xtremandLog).subscribe(
            (result: any) => {
                console.log('successfully logged the actions');
                console.log(this.xtremandLog.actionId);
            });
    }

}
