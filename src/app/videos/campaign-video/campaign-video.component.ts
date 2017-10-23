import { Component, ElementRef, OnInit, OnDestroy, Input, Inject, HostListener, AfterViewInit, Renderer } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { VideoFileService } from '../services/video-file.service';
import { SaveVideoFile } from '../models/save-video-file';
import { AuthenticationService } from '../../core/services/authentication.service';
import { VideoUtilService } from '../../videos/services/video-util.service';
import { XtremandLog } from '../models/xtremand-log';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Ng2DeviceService } from 'ng2-device-detector';
import { UUID } from 'angular2-uuid';
import { UtilService } from '../../core/services/util.service';
declare var $, videojs: any;

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
    selector: 'app-public-video',
    templateUrl: './campaign-video.component.html',
    styleUrls: ['./campaign-video.component.css'],
    providers: [XtremandLog]
})
export class CampaignVideoComponent implements OnInit, OnDestroy {
    campaignVideoFile: SaveVideoFile;
    videoJSplayer: any;
    videoUrl: string;
    posterImagePath: string;
    is360Value: boolean;
    title: string;
    description: string;
    publicRouterUrl: string;
    typeValue: string;
    videoAlias: string;
    campaignAlias: string;
    userAlias: string;
    templateId: number;
    locationJson: any;
    deviceInfo: any;
    sessionId: string = null;
    videoLength: string;
    replyVideo: boolean;
    logVideoViewValue: boolean;
    timeValue: any;
    seekStart = null;
    seekStart360 = null;
    uploadedDate: any;
    categoryName: any;
    LogAction: typeof LogAction = LogAction;
    emailLog: any;
    templatehtml: string;
    defaultTemplate: boolean;
    campaignVideoTemplate = '<h3 style="color:blue;text-align: center;">Your campaign has been Launched successfully<h3>' +
    '<div class="portlet light" style="padding:5px 5px 690px 17px">' +
    ' <div class="portlet-body">' +
    '<div class="col-xs-12 col-sm-12 col-md-12" style="padding:0">' +
    '<div id="newPlayerVideo"></div>' +
    '<div id="title" class="col-xs-12" style="padding:0"></div>' +
    '<div class="col-xs-12 col-sm-12 col-md-12">' +
    '</div></div>';
    errorHtml = '<div class="portlet light" style="padding:5px 5px 300px 17px">' +
    '<h3 style="color:blue;text-align: center;margin-top:204px;" >Sorry!!!. This campaign has been removed</h3></div>';

    constructor(public router: Router, public route: ActivatedRoute, public videoFileService: VideoFileService,
        public http: Http, public authenticationService: AuthenticationService,
        public activatedRoute: ActivatedRoute, public xtremandLog: XtremandLog, public deviceService: Ng2DeviceService,
        public videoUtilService: VideoUtilService, public xtremandLogger: XtremandLogger, public utilService: UtilService) {
        console.log('share component constructor called');
        console.log('url is on angular 2' + document.location.href);
        this.publicRouterUrl = document.location.href;
        this.logVideoViewValue = true;
    }
    LoginThroghCampaign() {
        this.router.navigate(['/login']);
    }
    deviceDectorInfo() {
        console.log('device info in component');
        this.deviceInfo = this.deviceService.getDeviceInfo();
        console.log(this.deviceInfo);
        this.loacationDetails();
    }
    xtremandLogDefaultActions() {
        // router info
        this.xtremandLog.userAlias = this.userAlias;
        this.xtremandLog.videoAlias = this.videoAlias;
        this.xtremandLog.campaignAlias = this.campaignAlias;
        // device detector
        if (this.deviceInfo.device === 'unknown') {
            this.xtremandLog.deviceType = 'computer';
        } else { this.xtremandLog.deviceType = this.deviceInfo.device; }
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

    getCampaignVideo() {
        this.utilService.getJSONLocation()
            .subscribe(
            (data: any) => {
                console.log("data :" + data);

                this.deviceInfo = this.deviceService.getDeviceInfo();
                if (this.deviceInfo.device === 'unknown') {
                    this.deviceInfo.device = 'computer';
                }

                this.emailLog = {
                    'userAlias': this.userAlias,
                    'campaignAlias': this.campaignAlias,
                    'templateId': this.templateId,
                    'time': new Date(),
                    'deviceType': this.deviceInfo.device,
                    'os': this.deviceInfo.os,
                    'city': data.city,
                    'country': data.country,
                    'isp': data.isp,
                    'ipAddress': data.query,
                    'state': data.regionName,
                    'zip': data.zip,
                    'latitude': data.lat,
                    'longitude': data.lon,
                    'countryCode': data.countryCode,
                    'videoAlias': this.videoAlias,
                    'actionId': 14
                };
                console.log("emailLog" + this.emailLog);
                this.videoFileService.showCampaignVideo(this.typeValue, this.emailLog)
                    .subscribe(
                    (result: any) => {
                        this.campaignVideoFile = result.videofile;
                        this.templatehtml = result.templatehtml;
                        console.log(this.templatehtml);
                        let updatedBody = this.templatehtml;
                        if (updatedBody.includes("video-tag")) {
                            this.defaultTemplate = true;
                            updatedBody = updatedBody.replace("view in browser", '');
                            updatedBody = updatedBody.replace("SocialUbuntuURL", '');
                            updatedBody = updatedBody.replace("Loading socialubuntu URL...", '');
                            updatedBody = updatedBody.replace("<SocialUbuntuImgURL>", '');
                            updatedBody = updatedBody.replace("&lt;SocialUbuntuURL&gt;", "javascript:void(0)");
                            updatedBody = updatedBody.replace("<SocialUbuntuURL>", "javascript:void(0)");
                            updatedBody = updatedBody.replace("https://dummyurl.com", "javascript:void(0)");
                            updatedBody = updatedBody.replace("https://aravindu.com/vod/images/xtremand-video.gif", '');
                            updatedBody = updatedBody.replace("&lt;SocialUbuntuImgURL&gt;", '');
                            updatedBody = updatedBody.replace("<emailOpenImgURL>", '');
                            updatedBody = updatedBody.replace("<Company_name>", '');
                            updatedBody = updatedBody.replace("<Company_Logo>", '');
                            updatedBody = updatedBody.replace("<Title_here>", '');
                            updatedBody = updatedBody.replace("video-tag", "newPlayerVideo");
                            this.templatehtml = updatedBody;
                            document.getElementById('para').innerHTML = this.templatehtml;
                        } else if (updatedBody.includes('class="img-container center fullwidth"')) {
                            updatedBody = updatedBody.replace("<SocialUbuntuImgURL>", '');
                            updatedBody = updatedBody.replace("&lt;SocialUbuntuURL&gt;", "javascript:void(0)");
                            updatedBody = updatedBody.replace("<SocialUbuntuURL>", "javascript:void(0)");
                            updatedBody = updatedBody.replace("https://dummyurl.com", "javascript:void(0)");
                            updatedBody = updatedBody.replace("https://aravindu.com/vod/images/xtremand-video.gif", '');
                            updatedBody = updatedBody.replace("&lt;SocialUbuntuImgURL&gt;", '');
                            updatedBody = updatedBody.replace("<emailOpenImgURL>", '');
                            updatedBody = updatedBody.replace("<Company_name>", '');
                            updatedBody = updatedBody.replace("<Company_Logo>", '');
                            updatedBody = updatedBody.replace("<Title_here>", '');
                            updatedBody = updatedBody.replace("Image", '');
                            updatedBody = updatedBody.replace('class="img-container center fullwidth"', 'id="newPlayerVideo"');
                            this.templatehtml = updatedBody;
                            this.defaultTemplate = false;
                            document.getElementById('para').innerHTML = this.templatehtml;
                        } else {
                            updatedBody = updatedBody.replace("view in browser", '');
                            updatedBody = updatedBody.replace("SocialUbuntuURL", '');
                            console.log(this.templatehtml);
                            if (updatedBody.includes('<a href="&lt;SocialUbuntuURL&gt;"')) {
                                updatedBody = updatedBody.replace('<a href="&lt;SocialUbuntuURL&gt;">', '<div id="newPlayerVideo"></div><a>');
                            } else if (updatedBody.includes("<a href='<SocialUbuntuURL>'>") && !updatedBody.includes("newPlayerVideo")) {
                                updatedBody = updatedBody.replace("<a href='<SocialUbuntuURL>'>", '<div id="newPlayerVideo"></div><a>');
                            } else {
                                updatedBody = this.campaignVideoTemplate;
                            }
                            updatedBody = updatedBody.replace("<emailOpenImgURL>", '');
                            updatedBody = updatedBody.replace("<SocialUbuntuImgURL>", '');
                            updatedBody = updatedBody.replace("SocialUbuntuImgURL", '');
                            updatedBody = updatedBody.replace("&lt;SocialUbuntuURL&gt;", "javascript:void(0)");
                            this.templatehtml = updatedBody;
                            console.log(this.templatehtml);
                            document.getElementById('para').innerHTML = this.templatehtml;
                            console.log(this.campaignVideoTemplate);
                        }
                        console.log(this.templatehtml);
                        console.log(result);
                        this.posterImagePath = this.campaignVideoFile.imagePath;
                        this.is360Value = this.campaignVideoFile.is360video;
                        this.title = this.campaignVideoFile.title;
                        this.description = this.campaignVideoFile.description;
                        this.uploadedDate = this.campaignVideoFile.uploadedDate;
                        this.categoryName = this.campaignVideoFile.category.name;
                        this.videoLength = this.truncateHourZeros(this.campaignVideoFile.videoLength);
                        console.log(this.videoLength);
                        if (this.campaignVideoFile.is360video === true) {
                            try {
                                this.play360Video();
                            } catch (err) {
                                // this.router.navigate(['/user/showCampaignVideo/campaign-video-not-found']);
                                document.getElementById('para').innerHTML = this.errorHtml;
                            }
                        } else {
                            try {
                                this.playNormalVideo();
                            } catch (err) {
                                //  this.router.navigate(['/user/showCampaignVideo/campaign-video-not-found']);
                                document.getElementById('para').innerHTML = this.errorHtml;
                            }
                        }
                        this.defaultVideoSettings();
                        console.log(this.videoUrl);
                    }, (error: any) => {
                        this.xtremandLogger.error('campagin video Component : cmapaign video File method():' + error);
                        this.xtremandLogger.error(error);
                        document.getElementById('para').innerHTML = this.errorHtml;
                        //  this.router.navigate(['/user/showCampaignVideo/campaign-video-not-found']);
                    }
                    );
            },
            error => console.log(error));
    }
    truncateHourZeros(length) {
        const val = length.split(":");
        if (val.length == 3 && val[0] == "00") {
            length = val[1] + ":" + val[2];
        }
        return length;
    }
    getCurrentTimeValues(time: any) {
        const whereYouAt = time;
        const minutes = Math.floor(whereYouAt / 60);
        const seconds = Math.floor(whereYouAt);
        const x = minutes < 10 ? "0" + minutes : minutes;
        const y = seconds < 10 ? "0" + seconds : seconds;
        const timeValue = x + ":" + y;
        this.timeValue = timeValue;
        console.log('enter int o get current time' + timeValue);
    }
    timeConversion(totalSeconds: number) {
        const MINUTES_IN_AN_HOUR = 60;
        const SECONDS_IN_A_MINUTE = 60;
        const seconds = totalSeconds % SECONDS_IN_A_MINUTE;
        const totalMinutes = totalSeconds / SECONDS_IN_A_MINUTE;
        const minutes = totalMinutes % MINUTES_IN_AN_HOUR;
        const hours = totalMinutes / MINUTES_IN_AN_HOUR;
        return this.addZeros(hours) + ":" + this.addZeros(minutes) + ":" + this.addZeros(seconds);
    }
    addZeros(val: number) {
        const value = val;
        return value.toString().length == 1 ? "0" + value : value;
    }
    loacationDetails() {
        this.videoFileService.getJSONLocation()
            .subscribe(
            (data: any) => {
                this.defaultLocationJsonValues(data);
                this.xtremandLogger.log(data);
            },
            (error: any) => {
                this.xtremandLogger.log(error);
                this.xtremandLogger.error(error);
            });
    }
    createSessionId() {
        this.sessionId = UUID.UUID();
        this.xtremandLogger.log(this.sessionId);
    }
    ngOnInit() {
        this.createSessionId();
        this.xtremandLogger.log('public video component ngOnInit called');
        this.deviceDectorInfo();
        this.activatedRoute.queryParams.subscribe(
            (param: any) => {
                this.typeValue = param['type'];
                this.videoAlias = param['videoAlias'];
                this.campaignAlias = param['campaignAlias'];
                this.userAlias = param['userAlias'];
                this.templateId = param['templateId'];
            },
            (error: any) => {
                this.xtremandLogger.log(error);
                this.xtremandLogger.error(error);
            });
        this.xtremandLogDefaultActions();
        this.getCampaignVideo();
    }
    defaultVideoSettings() {
        this.xtremandLogger.log('default settings called');
        // $('.video-js').css('color', this.campaignVideoFile.playerColor);
        // $('.video-js .vjs-play-progress').css('background-color', this.campaignVideoFile.playerColor);
        // $('.video-js .vjs-volume-level').css('background-color', this.campaignVideoFile.playerColor);
        // $('.video-js .vjs-control-bar').css('background-color', this.campaignVideoFile.controllerColor);
        $('.video-js .vjs-big-play-button').css('cssText', 'color:' + this.campaignVideoFile.playerColor + '!important');
        $('.video-js .vjs-play-control').css('cssText', 'color:' + this.campaignVideoFile.playerColor + '!important');
        $('.video-js .vjs-volume-menu-button').css('cssText', 'color:' + this.campaignVideoFile.playerColor + '!important');
        $('.video-js .vjs-volume-level').css('cssText', 'background-color:' + this.campaignVideoFile.playerColor + '!important');
        $('.video-js .vjs-play-progress').css('cssText', 'background-color:' + this.campaignVideoFile.playerColor + '!important');
        $('.video-js .vjs-remaining-time-display').css('cssText', 'color:' + this.campaignVideoFile.playerColor + '!important');
        $('.video-js .vjs-fullscreen-control').css('cssText', 'color:' + this.campaignVideoFile.playerColor + '!important');
        const rgba = this.videoUtilService.transparancyControllBarColor(this.campaignVideoFile.controllerColor, this.campaignVideoFile.transparency);
        $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
    }
    trimCurrentTime(currentTime) {
        return Math.round(currentTime * 100) / 100;
    }
    videoLogAction(xtremandLog: XtremandLog) {
        this.videoFileService.logCampaignVideoActions(xtremandLog).subscribe(
            (result: any) => {
                this.xtremandLogger.log('successfully logged the actions' + xtremandLog.actionId);
            },
            (error: any) => {
                console.log('successfully skipped unused logged the actions' + xtremandLog.actionId);
            });
    }
    logVideoViewsCount() {
        this.videoFileService.logVideoViews(this.campaignVideoFile.alias).subscribe(
            (result: any) => {
                console.log('successfully logged view count');
            });
    }
    play360Video() {
        this.is360Value = true;
        console.log('Loaded 360 Video');
        $('.h-video').remove();
        this.videoUtilService.player360VideoJsFiles();
        const str = '<video id=videoId poster=' + this.posterImagePath + ' class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
        $('#newPlayerVideo').append(str);
        this.videoUrl = this.campaignVideoFile.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '.mp4';
        $('#newPlayerVideo video').append('<source src="' + this.videoUrl + '" type="video/mp4">');
        $('#videoId').css('height', '413px');
        $('#videoId').css('width', 'auto');
        const selfPanorama = this;
        const player = videojs('videoId', { "controls": true, "autoplay": false, "preload": "auto" }).ready(function () {
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
        player.panorama({
            autoMobileOrientation: true,
            clickAndDrag: true,
            clickToToggle: true,
            callback: function () {
                const playerVideo = this;
                selfPanorama.replyVideo = false;
                const document: any = window.document;
                let startDuration;
                selfPanorama.videoFileService.replyVideo = false;
                player.ready(function () {
                    selfPanorama.videoFileService.pauseAction = false;
                    selfPanorama.xtremandLog.startDuration = 0;
                    selfPanorama.xtremandLog.stopDuration = 0;
                });
                player.on('play', function () {
                    selfPanorama.videoFileService.pauseAction = false;
                    $('.vjs-big-play-button').css('display', 'none');
                    console.log('play button clicked and current time' + selfPanorama.trimCurrentTime(player.currentTime()));
                    if (selfPanorama.replyVideo === true) {
                        selfPanorama.xtremandLog.actionId = selfPanorama.LogAction.replyVideo;
                        selfPanorama.replyVideo = false;
                    } else {
                        selfPanorama.xtremandLog.actionId = selfPanorama.LogAction.playVideo;
                    }
                    selfPanorama.xtremandLog.startTime = new Date();
                    selfPanorama.xtremandLog.endTime = new Date();
                    selfPanorama.xtremandLog.startDuration = selfPanorama.trimCurrentTime(player.currentTime());
                    selfPanorama.xtremandLog.stopDuration = selfPanorama.trimCurrentTime(player.currentTime());
                    selfPanorama.videoLogAction(selfPanorama.xtremandLog);
                    if (selfPanorama.logVideoViewValue === true) {
                        selfPanorama.videoLogAction(selfPanorama.xtremandLog);
                        selfPanorama.logVideoViewsCount();
                        selfPanorama.logVideoViewValue = false;
                    }
                    //  selfPanorama.getCurrentTimeValues(player.currentTime());
                });
                player.on('pause', function () {
                    selfPanorama.videoFileService.pauseAction = false;
                    console.log('pused and current time' + selfPanorama.trimCurrentTime(player.currentTime()));
                    selfPanorama.xtremandLog.actionId = selfPanorama.LogAction.pauseVideo;
                    selfPanorama.xtremandLog.startTime = new Date();
                    selfPanorama.xtremandLog.endTime = new Date();
                    selfPanorama.xtremandLog.startDuration = selfPanorama.trimCurrentTime(player.currentTime());
                    selfPanorama.xtremandLog.stopDuration = selfPanorama.trimCurrentTime(player.currentTime());
                    selfPanorama.videoLogAction(selfPanorama.xtremandLog);
                    //     selfPanorama.getCurrentTimeValues(player.currentTime());
                });
                player.on('seeking', function () {
                    const seekigTime = selfPanorama.trimCurrentTime(player.currentTime());
                    selfPanorama.videoFileService.pauseAction = true;
                    if (selfPanorama.seekStart360 === null) {
                        selfPanorama.seekStart360 = selfPanorama.trimCurrentTime(player.currentTime());
                    };
                });
                player.on('seeked', function () {
                    selfPanorama.videoFileService.pauseAction = true;
                    console.log('seeked from', selfPanorama.seekStart360);
                    console.log('previous value', selfPanorama.seekStart360, 'current time:',
                        selfPanorama.trimCurrentTime(player.currentTime()));
                    selfPanorama.xtremandLog.actionId = selfPanorama.LogAction.videoPlayer_slideSlider;
                    selfPanorama.xtremandLog.startDuration = selfPanorama.seekStart360;
                    selfPanorama.xtremandLog.stopDuration = selfPanorama.trimCurrentTime(player.currentTime());
                    if (selfPanorama.xtremandLog.startDuration === selfPanorama.xtremandLog.stopDuration) {
                        selfPanorama.xtremandLog.startDuration = selfPanorama.videoFileService.campaignTimeValue;
                        console.log('previuse time is ' + selfPanorama.videoFileService.campaignTimeValue);
                    }
                    selfPanorama.xtremandLog.startTime = new Date();
                    selfPanorama.xtremandLog.endTime = new Date();
                    selfPanorama.videoLogAction(selfPanorama.xtremandLog);
                    // selfPanorama.getCurrentTimeValues(player.currentTime());
                    selfPanorama.seekStart360 = null;
                    //  self.videoFileService.pauseAction = false;
                });
                player.on('timeupdate', function () {
                    startDuration = selfPanorama.trimCurrentTime(player.currentTime());
                });
                player.on('ended', function () {
                    const whereYouAt = player.currentTime();
                    console.log(whereYouAt);
                    selfPanorama.replyVideo = true;
                    selfPanorama.logVideoViewValue = true;
                    selfPanorama.videoFileService.replyVideo = true;
                    $('.vjs-big-play-button').css('display', 'block');
                    selfPanorama.xtremandLog.actionId = selfPanorama.LogAction.videoPlayer_movieReachEnd;
                    selfPanorama.xtremandLog.startTime = new Date();
                    selfPanorama.xtremandLog.endTime = new Date();
                    selfPanorama.xtremandLog.startDuration = selfPanorama.trimCurrentTime(player.currentTime());
                    selfPanorama.xtremandLog.stopDuration = selfPanorama.trimCurrentTime(player.currentTime());
                    selfPanorama.videoLogAction(selfPanorama.xtremandLog);
                });
                player.on('fullscreenchange', function () {
                    console.log('fullscreen changed');
                    const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                    const event = state ? 'FullscreenOn' : 'FullscreenOff';
                    if (event === "FullscreenOn") {
                        $(".vjs-tech").css("width", "100%");
                        $(".vjs-tech").css("height", "100%");
                    } else if (event === "FullscreenOff") {
                        $("#videoId").css("width", "auto");
                        $("#videoId").css("height", "413px");
                    }
                });
                player.on('click', function () {
                    console.log('clicked function ');
                });
            }
        });
        $('#videoId').css('width', 'auto');
        $('#videoId').css('height', '413px');
    }
    playNormalVideo() {
        $('.p-video').remove();
        this.videoUtilService.normalVideoJsFiles();
        this.is360Value = false;
        const str = '<video id="videoId" poster=' + this.posterImagePath + '  class="video-js vjs-default-skin" controls></video>';
        $('#newPlayerVideo').append(str);
        this.videoUrl = this.campaignVideoFile.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '_mobinar.m3u8';
        $('#newPlayerVideo video').append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
        $('#videoId').css('height', '413px');
        $('#videoId').css('width', 'auto');
        $('.video-js .vjs-tech').css('width', '100%');
        $('.video-js .vjs-tech').css('height', '100%');
        const self = this;
        this.videoJSplayer = videojs('videoId', { "controls": true, "autoplay": false, "preload": "auto" }, function () {
            const player = this;
            self.replyVideo = false;
            const document: any = window.document;
            let startDuration;
            let seekCurrentTime = false;
            self.logVideoViewValue = true;
            self.videoFileService.pauseAction = false;
            let seekCheck = false;
            this.ready(function () {
                $('.video-js .vjs-tech').css('width', '100%');
                $('.video-js .vjs-tech').css('height', '100%');
                $('.vjs-big-play-button').css('display', 'block');
                self.xtremandLog.startDuration = 0;
                self.xtremandLog.stopDuration = 0;
            });
            this.on('play', function () {
                seekCheck = false;
                self.videoFileService.pauseAction = false;
                $('.vjs-big-play-button').css('display', 'none');
                console.log('play button clicked and current time' + self.trimCurrentTime(player.currentTime()));
                if (self.replyVideo === true) {
                    self.xtremandLog.actionId = self.LogAction.replyVideo;
                    self.replyVideo = false;
                    self.videoFileService.pauseAction = false;
                } else {
                    self.xtremandLog.actionId = self.LogAction.playVideo;
                }
                self.xtremandLog.startTime = new Date();
                self.xtremandLog.endTime = new Date();
                self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime());
                self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime());
                //    self.getCurrentTimeValues(player.currentTime());
                self.videoLogAction(self.xtremandLog);
                if (self.logVideoViewValue === true) {
                    self.logVideoViewsCount();
                    self.logVideoViewValue = false;
                }
                if (seekCheck === false) {
                    self.videoFileService.campaignTimeValue = self.trimCurrentTime(player.currentTime());
                }
            });
            this.on('pause', function () {
                seekCheck = false;
                self.videoFileService.pauseAction = false;
                console.log('pused and current time' + self.trimCurrentTime(player.currentTime()));
                const time = self.timeConversion(player.currentTime());
                console.log(time);
                console.log(self.truncateHourZeros(time).toString());
                self.xtremandLog.actionId = self.LogAction.pauseVideo;
                self.xtremandLog.startTime = new Date();
                self.xtremandLog.endTime = new Date();
                self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime());
                self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime());
                self.videoLogAction(self.xtremandLog);
                //   self.getCurrentTimeValues(player.currentTime());
                if (seekCheck === false) {
                    self.videoFileService.campaignTimeValue = self.trimCurrentTime(player.currentTime());
                }
            });
            this.on('timeupdate', function () {
                if (seekCurrentTime === true) {
                    startDuration = self.trimCurrentTime(player.currentTime());
                    self.videoFileService.campaignTimeValue = startDuration;
                    console.log('time update in seek bare' + startDuration);
                    //  self.getCurrentTimeValues(player.currentTime());
                }
            });
            this.on('seeking', function () {
                self.videoFileService.pauseAction = true;
                seekCurrentTime = true;
                if (self.seekStart === null) {
                    self.seekStart = self.trimCurrentTime(player.currentTime());
                }
                // self.getCurrentTimeValues(player.currentTime());
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
                self.getCurrentTimeValues(player.currentTime());
                self.seekStart = null;
                //  self.videoFileService.pauseAction = false;
            });
            this.on('ended', function () {
                const whereYouAt = player.currentTime();
                console.log(whereYouAt);
                self.logVideoViewValue = true;
                self.replyVideo = true;
                self.videoFileService.replyVideo = true;
                $('.vjs-big-play-button').css('display', 'block');
                self.xtremandLog.actionId = self.LogAction.videoPlayer_movieReachEnd;
                self.xtremandLog.startTime = new Date();
                self.xtremandLog.endTime = new Date();
                self.xtremandLog.startDuration = self.trimCurrentTime(player.currentTime());
                self.xtremandLog.stopDuration = self.trimCurrentTime(player.currentTime());
                self.videoLogAction(self.xtremandLog);
            });
            this.on('fullscreenchange', function () {
                console.log('fullscreen changed');
                const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                const event = state ? 'FullscreenOn' : 'FullscreenOff';
                if (event === "FullscreenOn") {
                    $(".vjs-tech").css("width", "100%");
                    $(".vjs-tech").css("height", "100%");
                } else if (event === "FullscreenOff") {
                    $("#videoId").css("width", "auto");
                    $("#videoId").css("height", "413px");
                }
            });
            player.on('click', function () {
                console.log('clicked function ');
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

    videoStoppedEvent() {
        this.xtremandLog.actionId = this.LogAction.videoStopped;
        this.xtremandLog.startTime = new Date();
        this.xtremandLog.endTime = new Date();
        console.log(this.xtremandLog);
        this.videoLogAction(this.xtremandLog);
    }
    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event) {
        this.videoStoppedEvent();
    }
    ngOnDestroy() {
        this.videoStoppedEvent();
        this.videoLogAction(this.xtremandLog);
        console.log('Deinit - Destroyed Component');
        if (this.videoJSplayer) { this.videoJSplayer.dispose(); }
        $('.h-video').remove();
        $('.p-video').remove();
    }
}
