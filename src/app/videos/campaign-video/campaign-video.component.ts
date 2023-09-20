import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { VideoFileService } from '../services/video-file.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { VideoUtilService } from '../../videos/services/video-util.service';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Ng2DeviceService } from 'ng2-device-detector';
import { UtilService } from '../../core/services/util.service';

import { SaveVideoFile } from '../models/save-video-file';
import { XtremandLog } from '../models/xtremand-log';
import { LogAction } from '../models/log-action';
import { UUID } from 'angular2-uuid';
import { Processor } from '../../core/models/processor';

declare var $, videojs: any;

@Component({
    selector: 'app-public-video',
    templateUrl: './campaign-video.component.html',
    styleUrls: ['./campaign-video.component.css','../../../assets/css/loader.css'],
    providers: [XtremandLog,Processor]
})
export class CampaignVideoComponent implements OnInit, OnDestroy {
    campaignVideoFile: SaveVideoFile;
    videoJSplayer: any;
    videoUrl: string;
    posterImagePath: string;
    is360Value: boolean;
    publicRouterUrl: string;
    alias: string;
    typeValue: string;
    videoAlias: string=null;
    campaignAlias: string=null;
    userAlias: string=null;
    templateId: number=null;
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
    enterIntoSeeking = false;
    currentTimeinTimeUpdate = 0;
    previousTimeinTimeUpdate = 0;
    timeUpdateChanged = false;
    counter = 0;
    beforeTimeChange = 0;
    previousTime = 0.0;
    currentTime = 0.0;
    endTimeUpdate: any;
    startTimeUpdate: any;
    previousTimeSlider: any;
    seekbarPreviousTime = false;
    seekbarTimestored = 0;
    fullScreenMode = false;
    logoLink: string;
    logoImageUrlPath: string;
    templateName: string;
    customCampaignError = 'Sorry !This campaign has been removed.'
    campaignVideoTemplate = '<h3 style="color:blue;text-align: center;">Your campaign has been Launched successfully<h3>' +
    '<div class="portlet light">' +
    ' <div class="portlet-body clearfix">' +
    '<div class="col-xs-12 col-sm-12 col-md-12" style="padding:0">' +
    '<div id="newPlayerVideo"><div id="overlay-logo-bee"><a href=' + this.logoLink+' target="_blank" >'+
    '<img id="image"  style="position:relative;top: 47px;right: -813px;width: 63px;z-index:9" src='+this.authenticationService.MEDIA_URL + this.logoImageUrlPath+'></a></div></div>' +
    '<div id="title" class="col-xs-12" style="padding:0"></div>' +
    '<div class="col-xs-12 col-sm-12 col-md-12">' +
    '</div></div>';
    errorHtml:any;
    campaignVideoTemplate2 = '<br /><br /><div id="newPlayerVideo">'+
    '<div id="overlay-logo-bee"><a href='+this.logoLink+' target="_blank" >'+
    '<img id="image"  style="position:absolute;top:46px;float: right;left: 440px;width:63px;z-index:9" src='+this.authenticationService.MEDIA_URL + this.logoImageUrlPath+'></a></div></div>';

    constructor(public router: Router, public route: ActivatedRoute, public videoFileService: VideoFileService,
        public http: Http, public authenticationService: AuthenticationService, public referService: ReferenceService,
        public activatedRoute: ActivatedRoute, public xtremandLog: XtremandLog, public deviceService: Ng2DeviceService,
        public videoUtilService: VideoUtilService, public xtremandLogger: XtremandLogger, public utilService: UtilService,public processor:Processor) {
        this.xtremandLogger.log('share component constructor called');
        this.xtremandLogger.log('url is on angular 2' + document.location.href);
        this.publicRouterUrl = document.location.href;
        this.logVideoViewValue = true;
    }
    errorMessage(){
    	  this.errorHtml =  '<div class="page-content"><div class="portlet light" style="border: navajowhite;">' +
    	    ' <div class="portlet-body clearfix">' +
    	    '<h3 style="color: blue;text-align: center;margin-top: 150px;font-weight: bold;" >'+this.customCampaignError+'</h3></div></div></div>';

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
    replaceUpdateBody(updatedBody: any) {
        updatedBody = updatedBody.replace("view in browser", '');
        updatedBody = updatedBody.replace("SocialUbuntuURL", '');
        updatedBody = updatedBody.replace("Loading socialubuntu URL...", '');
        updatedBody = updatedBody.replace("Loading xamplify URL...", '');
        updatedBody = updatedBody.replace("&lt;SocialUbuntuURL&gt;", "javascript:void(0)");
        updatedBody = updatedBody.replace("<SocialUbuntuURL>", "javascript:void(0)");
        updatedBody = updatedBody.replace("&lt;SocialUbuntuImgURL&gt;", '');
        updatedBody = updatedBody.replace("<SocialUbuntuImgURL>", '');
        updatedBody = updatedBody.replace("<emailOpenImgURL>", '');
        updatedBody = updatedBody.replace("<Company_name>", '');
        updatedBody = updatedBody.replace("<Company_Logo>", '');
        updatedBody = updatedBody.replace("<Title_here>", '');
        //updatedBody = updatedBody.replace('<a href="<unsubscribeURL>">click here</a>',"");
        //updatedBody = updatedBody.replace("click here", "");
        //updatedBody = updatedBody.replace("If you'd like to unsubscribe and stop receiving these emails","");
       // updatedBody = updatedBody.replace("If you'd like to unsubscribe and stop receiving these emails click here"," ");
        return updatedBody;
    }
    getCampaignVideo() {
        this.processor.set(this.processor);
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
                    'actionId': 14,
                    'alias':this.alias
                };
                console.log(this.emailLog);
                this.videoFileService.showCampaignVideo(this.emailLog)
                    .subscribe(
                    (result: any) => {
                        this.campaignVideoFile = result.videofile;
                        this.templatehtml = result.templatehtml;
                        console.log(this.templatehtml);
                        this.campaignAlias = result.campaignAlias;
                        this.userAlias = result.userAlias;
                        this.videoAlias = result.videoAlias;
                        this.templateId = result.templateId;
                        this.logoLink = this.campaignVideoFile.brandingLogoDescUri;
                        if(!this.logoLink.startsWith("http") || this.logoLink.startsWith("https")){
                            this.logoLink="//"+this.logoLink;
                        }
                        this.logoImageUrlPath = this.campaignVideoFile.brandingLogoUri;
                        this.xtremandLogDefaultActions();
                        let checkVideoTag: any
                        console.log(this.templatehtml);
                        let updatedBody = this.templatehtml;
                        updatedBody = updatedBody.replace(".image_block img+div{display:none}", ".image_block img+div {display: block !important;}");
               
                        if (updatedBody.includes("video-tag")) {
                            this.templateName = 'defaultTemplate';
                            updatedBody = this.replaceUpdateBody(updatedBody);
                           // updatedBody = updatedBody.replace("video-tag", "newPlayerVideo");
                            updatedBody = updatedBody.replace('<div id="video-tag"></div>', '<div id="newPlayerVideo">'+
                            '<div id="overlay-logo-bee"><a href='+this.logoLink+' target="_blank" >'+
                            '<img id="image"  style="position: absolute;top: 45px;width: 68px; z-index: 9;right: 29px;" src='+this.authenticationService.MEDIA_URL + this.logoImageUrlPath+'></a></div></div>');
                            this.templatehtml = updatedBody;
                            checkVideoTag = 'default';
                            document.getElementById('para').innerHTML = this.templatehtml;
                        }
                        else if (updatedBody.includes('src="https://xamp.io/vod/images/xtremand-video.gif"') || updatedBody.includes('src="https://release.xamp.io/vod/images/xtremand-video.gif"')) {
                            this.templateName = 'beeTemplate';
                            updatedBody = this.replaceUpdateBody(updatedBody);
                            updatedBody = updatedBody.replace('<a href="https://dummyurl.com"', 'javascript:void(0)');
                            
                            
                            updatedBody = updatedBody.replace('src="https://release.xamp.io/vod/images/xtremand-video.gif"', '></a><div id="newPlayerVideo">'+
                                    '<div id="overlay-logo-bee" style="position: absolute;z-index: 9;"><a href='+this.logoLink+' target="_blank" >'+
                                    '<img id="image" style="position:absolute;top:10px;float: right;left: 440px;width:63px;z-index:9" src='+this.authenticationService.MEDIA_URL + this.logoImageUrlPath+'></a></div></div> <a ');
                            
                            
                            updatedBody = updatedBody.replace('src="https://xamp.io/vod/images/xtremand-video.gif"', '></a><div id="newPlayerVideo">'+
                            '<div id="overlay-logo-bee" style="position: absolute;z-index: 9;"><a href='+this.logoLink+' target="_blank" >'+
                            '<img id="image" style="position:absolute;top:10px;float: right;left: 440px;width:63px;z-index:9" src='+this.authenticationService.MEDIA_URL + this.logoImageUrlPath+'></a></div></div> <a ');
                            updatedBody = updatedBody.replace("Image", '');
                            updatedBody = updatedBody.replace('javascript:void(0) target="_blank">', '');
                            updatedBody = updatedBody.replace('javascript:void(0) target="_blank" tabindex="-1">', '');
                            updatedBody = updatedBody.replace('javascript:void(0) target="_blank" style="outline:none" tabindex="-1">', '');
                            this.templatehtml = updatedBody;
                            console.log(this.templatehtml);
                            checkVideoTag = 'beeTemplate';
                            document.getElementById('para').innerHTML = this.templatehtml;
                        }  else if (updatedBody.includes('src="https://aravindu.com/vod/images/xtremand-video.gif"')) {
                        // remove this else part in future
                            this.templateName = 'beeTemplate';
                            updatedBody = this.replaceUpdateBody(updatedBody);
                            updatedBody = updatedBody.replace('<a href="https://dummyurl.com"', 'javascript:void(0)');
                            updatedBody = updatedBody.replace('src="https://aravindu.com/vod/images/xtremand-video.gif"', '></a><div id="newPlayerVideo">'+
                            '<div id="overlay-logo-bee"><a href='+this.logoLink+' target="_blank" >'+
                            '<img id="image" style="position:relative;top:10px;float: right;right: 10px;width:63px;z-index:9" src='+this.authenticationService.MEDIA_URL + this.logoImageUrlPath+'></a></div></div> <a ');
                            updatedBody = updatedBody.replace("Image", '');
                            updatedBody = updatedBody.replace('javascript:void(0) target="_blank">', '');
                            updatedBody = updatedBody.replace('javascript:void(0) target="_blank" style="outline:none" tabindex="-1">', '');
                            this.templatehtml = updatedBody;
                            console.log(this.templatehtml);
                            checkVideoTag = 'beeTemplate';
                            document.getElementById('para').innerHTML = this.templatehtml;
                        }
                        else {
                            this.templateName = 'uploadedTemplate';
                            updatedBody = updatedBody.replace("view in browser", '');
                            //updatedBody = updatedBody.replace("click here","");
                           // updatedBody = updatedBody.replace('<a href="<unsubscribeURL>">click here</a>',"");
                            console.log(this.templatehtml);
                            if (updatedBody.includes('<a href="&lt;SocialUbuntuURL&gt;"')) {
                                updatedBody = updatedBody.replace('<a href="&lt;SocialUbuntuURL&gt;">', '<div id="newPlayerVideo"></div><a>');
                            } else if (updatedBody.includes('<a href="<SocialUbuntuURL>">')) {
                                updatedBody = updatedBody.replace('<a href="<SocialUbuntuURL>">', '<div id="newPlayerVideo"><div id="overlay-logo-bee"><a href='+this.logoLink+' target="_blank" >'+
                                '<img id="overlay-logo-bee"  style="position: relative; top: 137px; width: 63px;z-index: 9;left: 402px;" src='+this.authenticationService.MEDIA_URL + this.logoImageUrlPath+'></div>'+
                                +'</div><a>');
                            } else if (updatedBody.includes("<a href='<SocialUbuntuURL>'>")) {
                                updatedBody = updatedBody.replace("<a href='<SocialUbuntuURL>'>", '<div id="newPlayerVideo"><div id="overlay-logo-bee"><a href='+this.logoLink+' target="_blank" >'+
                                 '<img id="overlay-logo-bee"  style="position: relative; top: 137px; width: 63px;z-index: 9;left: 402px;" src='+this.authenticationService.MEDIA_URL + this.logoImageUrlPath+'></div>'+
                                +'</div><a>');
                            }
                            else {
                            	updatedBody = updatedBody.replace('<p><br /><img src="https://release.xamp.io/vod/images/xtremand-video.gif" /></p>', this.campaignVideoTemplate2);
                            	updatedBody = updatedBody.replace('<p><br /><img src="https://aravindu.com/vod/images/xtremand-video.gif" /></p>', this.campaignVideoTemplate2);
                            	updatedBody = updatedBody.replace('<br><img src=https://release.xamp.io/vod/images/xtremand-video.gif><p><img src="" /></p>', this.campaignVideoTemplate2);
                            	updatedBody = updatedBody.replace('<br><img src=https://aravindu.com/vod/images/xtremand-video.gif><p><img src="" /></p>', this.campaignVideoTemplate2);
                            	updatedBody = updatedBody.replace('<br><img src=https://aravindu.com/vod/images/xtremand-video.gif>', this.campaignVideoTemplate2);
                            	updatedBody = updatedBody.replace('<br><img src=https://release.xamp.io/vod/images/xtremand-video.gif>', this.campaignVideoTemplate2);
                            }
                            updatedBody = updatedBody.replace("<emailOpenImgURL>", '');
                            updatedBody = updatedBody.replace("<SocialUbuntuImgURL>", '');
                            updatedBody = updatedBody.replace("SocialUbuntuImgURL", '');
                            updatedBody = updatedBody.replace("&lt;SocialUbuntuURL&gt;", "javascript:void(0)");
                            this.templatehtml = updatedBody;
                            console.log(this.templatehtml);
                            checkVideoTag = 'uploadtemplate';
                            document.getElementById('para').innerHTML = this.templatehtml;
                            console.log(this.campaignVideoTemplate);
                        }
                        console.log(this.templatehtml);
                        this.posterImagePath = this.campaignVideoFile.imagePath;
                        this.is360Value = this.campaignVideoFile.is360video;
                        if (this.campaignVideoFile.is360video) {
                            try {
                                this.play360Video();
                            } catch (err) {
                                document.getElementById('para').innerHTML = this.errorHtml;
                                $('html').css('background-color','white');​​​​​​​​​​​​​​​​​​​​​
                            }
                        } else {
                            try {
                                this.playNormalVideoCampaign();
                            } catch (err) {
                                document.getElementById('para').innerHTML = this.errorHtml;
                                $('html').css('background-color','white');​​​​​​​​​​​​​​​​​​​​​
                            }
                        }
                        this.defaultVideoSettings();
                        // $('#newPlayerVideo').append($('#overlay-logo').show());
                        if(!this.logoImageUrlPath){ $('#image').css('display','none');​​​​​​​​​​​​​​​​​​​​​  }
                        if(checkVideoTag==='default') { $('#videoId').css({'width': '479px','height': '279px','margin':'0 auto'});
                        } else {  this.cssOverride(); }
                        console.log(this.videoUrl);
                        this.processor.remove(this.processor);
                    }, (error: any) => {
                        this.processor.remove(this.processor);
                        this.xtremandLogger.error('campagin video Component : cmapaign video File method():' + error);
                        this.xtremandLogger.error(error);
                        //this.customCampaignError = error._body;
                        this.customCampaignError = JSON.parse(error._body).message;
                        this.errorMessage();
                        document.getElementById('para').innerHTML = this.errorHtml;
                    }
                    );
            },
            error => console.log(error));
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
    setVideoBranLogo(){
        $('#overLayImage').append($('#overlay-logo').show());
    }
    ngOnInit() {
        $('#overlay-logo').hide();
        $('body').css('cssText', 'background-color: white !important');
        this.createSessionId();
        this.xtremandLogger.log('public video component ngOnInit called');
        this.deviceDectorInfo();
        this.alias = this.activatedRoute.snapshot.params['alias'];
        this.getCampaignVideo();
    }

    defaultVideoSettings() {
        this.xtremandLogger.log('default settings called');
        this.videoUtilService.videoColorControlls(this.campaignVideoFile);
        const rgba = this.videoUtilService.transparancyControllBarColor(this.campaignVideoFile.controllerColor, this.campaignVideoFile.transparency);
        $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
    }
    trimCurrentTime(currentTime) {
        return Math.round(currentTime * 100) / 100;
    }
    videoLogAction(xtremandLog: XtremandLog) {
      console.log(this.alias);
      xtremandLog.alias = this.alias;
        if(xtremandLog.actionId === 8) { xtremandLog.startDuration = this.seekbarTimestored;
        console.log(xtremandLog.startDuration);
        this.videoFileService.seekbarTime = this.seekbarTimestored;
        }
        console.log(xtremandLog);
        console.log(xtremandLog.actionId);
        this.videoFileService.logCampaignVideoActions(xtremandLog).subscribe(
            (result: any) => {
                this.xtremandLogger.log('successfully logged the actions' + xtremandLog.actionId);
                xtremandLog.previousId = result.id;
            },
            (error: any) => {
                console.log('successfully skipped unused logged the actions' + xtremandLog.actionId);
            });
    }
    logVideoViewsCount() {
        this.videoFileService.logVideoViews(this.campaignVideoFile.alias,this.alias).subscribe(
            (result: any) => {
                console.log('successfully logged view count');
            });
    }
     play360Video() {
        this.is360Value = true;
        console.log('Loaded 360 Video');
        $('.h-video').remove();
        this.videoUtilService.player360VideoJsFiles();
        this.videoUtilService.video360withm3u8();
        const str = '<video id=videoId poster=' + this.posterImagePath + ' class="video-js vjs-default-skin" crossorigin="anonymous" autoplay controls ></video>';
        $('#newPlayerVideo').append(str);
        this.videoUrl = this.campaignVideoFile.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
        $('#newPlayerVideo video').append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');

       // this.videoUrl = this.videoUrl + '.mp4';
       // $('#newPlayerVideo video').append('<source src="' + this.videoUrl + '" type="video/mp4">');
        $('#videoId').css('height', '413px');
        $('#videoId').css('width', 'auto');
        const selfPanorama = this;
        const player = videojs('videoId', {
             "controls": true,
             "autoplay": true,
             "preload": "auto",
             "customControlsOnMobile": true,
             "nativeControlsForTouch": true,
              playbackRates: [0.5, 1, 1.5, 2]
             }).ready(function () {
            this.hotkeys({
                volumeStep: 0.1, seekStep: 5, enableMute: false,
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
        player.panorama({
            autoMobileOrientation: true,
            clickAndDrag: true,
            clickToToggle: true,
            VREnable: true,
            initFov: 100,
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
                    player.play();
                    this.play();

                    $('.video-js .vjs-control-bar .vjs-VR-control').css('cssText', 'color:' + selfPanorama.campaignVideoFile.playerColor + '!important');
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
                        selfPanorama.logVideoViewsCount();
                        selfPanorama.logVideoViewValue = false;
                    }
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
                });
                player.on('seeking', function(){
                 console.log(selfPanorama.trimCurrentTime(player.currentTime()));
                 if(selfPanorama.seekbarPreviousTime === false){
                    console.log(' enter into seek bar previous time is: '+selfPanorama.previousTime);
                    selfPanorama.seekbarTimestored = selfPanorama.previousTime;
                    console.log(selfPanorama.seekbarTimestored);
                    selfPanorama.seekbarPreviousTime = true;
                  }
                 selfPanorama.timeUpdateChanged = true;
                 const timeoutTime = 300;
                 const beforeCounter = selfPanorama.counter + 1;
                 if (player.cache_.currentTime === player.duration()) {
                    return;
                    // when video starts over, calls seek
                 }
                 selfPanorama.beforeTimeChange = selfPanorama.beforeTimeChange || player.cache_.currentTime;
                 setTimeout(function() {
                    if (beforeCounter === selfPanorama.counter) {
                        console.log('before seek', selfPanorama.previousTime, '\nafter seek', player.currentTime() - (timeoutTime / 1000));
                           selfPanorama.xtremandLog.actionId = selfPanorama.LogAction.videoPlayer_slideSlider;
                            selfPanorama.xtremandLog.startDuration = startDuration;
                            console.log(selfPanorama.xtremandLog.startDuration);
                            selfPanorama.xtremandLog.stopDuration = player.currentTime() - (timeoutTime / 1000);
                            selfPanorama.xtremandLog.startTime = selfPanorama.startTimeUpdate;
                            selfPanorama.xtremandLog.endTime = new Date();
                            selfPanorama.videoLogAction(selfPanorama.xtremandLog);
                        selfPanorama.counter = 0;
                        selfPanorama.beforeTimeChange = 0;
                    }
                 }, timeoutTime);
                 selfPanorama.counter++;
                });
                player.on('seeked', function(){
                    selfPanorama.seekbarPreviousTime = false;
                    selfPanorama.videoFileService.seekbarTime = 0;
                    console.log('seeked completed'+ selfPanorama.videoFileService.seekbarTime);
                });
                player.on('timeupdate', function () {
                    if(selfPanorama.timeUpdateChanged === true){
                        selfPanorama.previousTimeinTimeUpdate = selfPanorama.trimCurrentTime(player.currentTime());
                        selfPanorama.timeUpdateChanged = false;
                        console.log(selfPanorama.previousTimeinTimeUpdate);
                    }
                    selfPanorama.previousTime = selfPanorama.currentTime;
                    selfPanorama.currentTime = player.currentTime();
                    selfPanorama.startTimeUpdate = selfPanorama.endTimeUpdate;
                    selfPanorama.endTimeUpdate = new Date();
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
                        selfPanorama.setFullscreenValue('FullscreenOn');
                        $('#videoId').append($('#overlay-logo').show());
                    } else if (event === "FullscreenOff") {
                        if(selfPanorama.templateName=== 'defaultTemplate'){ $("#videoId").css("width", "479px");
                          $("#videoId").css("height", "279px");  }  else {  $("#videoId").css("width", "500px");
                          $("#videoId").css("height", "279px"); }
                       selfPanorama.setFullscreenValue('FullscreenOff');
                       $('#overlay-logo').hide()
                    }
                });
                player.on('click', function () {
                    console.log('clicked function ');
                });
            }
        });
        $('#videoId').css('height', '413px');
    }
     cssOverride(){
      $('#videoId').css({'width': '500px','height': '279px', 'margin-left': '-2px'});
      $('.nl-container').css({'table-layout': 'auto'});
     }
      playNormalVideoCampaign() {
        $('.p-video').remove();
        this.videoUtilService.normalVideoJsFiles();
        this.is360Value = false;
        const str = '<video id="videoId" poster=' + this.posterImagePath + '  preload="none"  class="video-js vjs-default-skin" muted="muted" controls></video>';
        $('#newPlayerVideo').append(str);
        this.videoUrl = this.campaignVideoFile.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '_mobinar.m3u8';  // need to remove it
        $('#newPlayerVideo video').append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
        $('.video-js .vjs-tech').css('width', '100%');
        $('.video-js .vjs-tech').css('height', '100%');
        const self = this;
        const overrideNativeValue = this.referService.getBrowserInfoForNativeSet();
            this.videoJSplayer = videojs('videoId', {
             playbackRates: [0.5, 1, 1.5, 2],
            
                // "controls": true,
                // "autoplay": false,
                // "preload": "auto",
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
                    const document: any = window.document;
                    $('.video-js .vjs-tech').css('width', '100%');
                    $('.video-js .vjs-tech').css('height', '100%');
                    this.ready(function () {
                        self.videoFileService.pauseAction = false;
                        self.xtremandLog.startDuration = 0;
                        self.xtremandLog.stopDuration = 0;
                     //   $('.video-js .vjs-control-bar .vjs-VR-control').css('cssText', 'color:' + self.campaignVideoFile.playerColor + '!important');
                        player.play();
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
                    });
                    this.on('fullscreenchange', function () {
                        const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                        const event = state ? 'FullscreenOn' : 'FullscreenOff';
                        if (event === "FullscreenOn") {
                            $(".vjs-tech").css("width", "100%");
                            $(".vjs-tech").css("height", "100%");
                            self.setFullscreenValue('FullscreenOn');
                            $('#videoId').append($('#overlay-logo').show());
                        } else if (event === "FullscreenOff") {
                           if(self.templateName=== 'defaultTemplate'){ $("#videoId").css("width", "479px");
                           $("#videoId").css("height", "279px");  }  else {  $("#videoId").css("width", "500px");
                           $("#videoId").css("height", "279px"); }
                            self.setFullscreenValue('FullscreenOff');
                            $('#overlay-logo').hide()
                        }
                    });
                    this.on('contextmenu', function (e) {
                        e.preventDefault();
                    });
                    this.hotkeys({
                        volumeStep: 0.1, seekStep: 5, enableMute: false,
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
            $('#videoId').css('height', '304px');
    }
   setFullscreenValue(event: string){
    if(event ==='FullscreenOn'){
        this.fullScreenMode = true;
    } else {
        this.fullScreenMode = false;
    }
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
    ngOnDestroy() {
        this.videoStoppedEvent();
        this.videoLogAction(this.xtremandLog);
        console.log('Deinit - Destroyed Component');
        if (this.videoJSplayer) { this.videoJSplayer.dispose(); }
        $('.h-video').remove();
        $('.p-video').remove();
    }
}
