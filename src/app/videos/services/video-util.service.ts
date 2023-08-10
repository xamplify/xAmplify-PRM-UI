import { Injectable } from '@angular/core';
import { SaveVideoFile } from '../models/save-video-file';
import { DefaultVideoPlayer } from '../models/default-video-player';
declare var $: any;

@Injectable()
export class VideoUtilService {
	 damId: number = 0;
    videoTempDefaultSettings: DefaultVideoPlayer;
    selectedVideoId: number;
    videoViewsData: any;
    timePeriod: string;
    timePeriodValue: string;
    selectedVideo: SaveVideoFile = null;
    publishUtil = [{ id: 1, name: 'PRIVATE'}, { id: 2, name: 'PUBLIC' }, { id: 3, name: 'UNLISTED' }];
    formErrors = {
        'title': '', 'viewBy': '', 'categoryId': '', 'tags': '', 'imageFile': '', 'gifImagePath': '',
        'description': '', 'upperText': '', 'lowerText': '',
    };
    noSpaceMesg = 'No Space Left on the device Please Contact the admin.!!';
    maxSubscriptionMesg = 'Maximum Disk Space Reached for you subscription.!! Please Contact the admin.';
    codecNotSupportMesg = 'Codec is not supported for this video..We are unable to ' +
        'process your video file. Please upload another video file!!';
    maxSizeOverMesg = 'Your video size is more than the maximum video file size(800 MB)' +
        'Please upload another video file within the limit!!';
    fileTypeMessage = 'Invalid video file Format.Please Upload supported video files only';
    errorNullMesg = 'Uh oh! Looks like something went wrong during the video upload. Please try again';
    sortVideos = [
        { 'name': 'Sort By', 'value': '' },
        { 'name': 'Title (A-Z)', 'value': 'title-ASC' },
        { 'name': 'Title (Z-A)', 'value': 'title-DESC' },
        { 'name': 'Upload Date (ASC)', 'value': 'createdTime-ASC' },
        { 'name': 'Upload Date (DESC)', 'value': 'createdTime-DESC' },
        // { 'name': 'Type (ASC)', 'value': 'viewBy-ASC' },
        // { 'name': 'Type (DESC)', 'value': 'viewBy-DESC' },
    ];
    sortMonthDates = [{ 'name': 'Current Month', 'value': 'current-month' },
    { 'name': 'By Month', 'value': 'month' },
    { 'name': 'By Quarter', 'value': 'quarter' }, { 'name': 'By Year', 'value': 'year' }];
    sortMintuesDates = [{ 'name': 'Today', 'value': 'today' }, { 'name': 'By Month', 'value': 'month' },
     { 'name': 'By Quarter', 'value': 'quarter' }, { 'name': 'By Year', 'value': 'year' }];
    validationMessages = {
        'title': {
            'required': 'Title is required.',
            'maxlength': 'Title cannot be more than 256 characters long.',
        },
        'viewBy': { 'required': 'Publish is required' },
        'category': { 'required': 'Category is required' },
        'tags': { 'required': 'Tag is required' },
        'imageFile': { 'required': 'Image file is required' },
        'gifImagePath': { 'required': 'Gif is required' },
        'description': {
            'required': 'Please enter a video description.',
            'minlength': 'Title must be at least 5 characters long.'
        },
        'upperText': { 'required': 'upper text is required', },
        'lowerText': { 'required': 'lower text is required', },
    };
    videojshotkeys() {
        $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"" type="text/javascript"  class="p-video" />');
    }
    player360VideoJsFiles() {
        try{
        $('head').append('<link href="assets/js/indexjscss/video-hls-player/video-hls-js.css" class="p-video" rel="stylesheet">');
        $('head').append('<script src="assets/js/indexjscss/360-video-player/videojs-testing.js" type="text/javascript"  class="p-video"/>');
        $('head').append('<script src="assets/js/indexjscss/360-video-player/new-three.js" type="text/javascript"  class="p-video" />');
        $('head').append('<link href="assets/js/indexjscss/360-video-player/videojs-panorama-test.min.css" rel="stylesheet"  class="p-video">');
        $('head').append('<script src="assets/js/indexjscss/360-video-player/videojs-panorama.min.js" type="text/javascript"  class="p-video" />');
        this.videojshotkeys();
        } catch(error){ console.log(error);}

    }
    normalVideoJsFiles() {
       // $('head').append('<link href="assets/js/indexjscss/video-hls-player/video-hls-js.css" class="h-video" rel="stylesheet">');
        $('head').append('<link href="assets/js/indexjscss/video-hls-player/video-js7.4.1.css" class="h-video" rel="stylesheet">')
       // $('head').append('<script src="assets/js/indexjscss/video-hls-player/video6.4.0.js" type="text/javascript" class="h-video"  />');
       
        /****XNFR-329****/
       $('head').append('<script src="assets/js/indexjscss/video-hls-player/video7.4.1.js" type="text/javascript" class="h-video"  />');
       $('head').append('<script src="assets/js/indexjscss/video-hls-player/videojs-http-source-selector.js" type="text/javascript" class="h-video"  />');
       $('head').append('<script src="assets/js/indexjscss/video-hls-player/videojs-contrib-quality-levels.js" type="text/javascript" class="h-video"  />');
       $('head').append('<script src="assets/js/indexjscss/videojs-playlist.js" type="text/javascript"  class="h-video" />');
       $('head').append('<script src="assets/js/indexjscss/video-hls-player/videojs-flash.js" type="text/javascript" class="h-video"  />');
       $('head').append('<script src="assets/js/indexjscss/video-hls-player/video-testing-contrib-hls.js" type="text/javascript"  class="h-video"/>');
       /****XNFR-329****/
        this.videojshotkeys();
    }
    video360withm3u8(){
       $('head').append('<script src="assets/js/indexjscss/video-hls-player/video-testing-contrib-hls.js" type="text/javascript"  class="h-video"/>');
    }
    constructor() { }
    validateEmail(email: string) {
        const validation = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return validation.test(email);
    }
    transparancyControllBarColor(color: string, value: number) {
      if(color && value){
      if (color.includes('rgba')) { color = this.convertRgbToHex(color); }
        if (color === '#fff') {
            color = '#fbfbfb';
        } else if (color === '#ccc') { color = '#cccddd'; }
        const rgba = this.convertHexToRgba(color, value);
        return rgba;
      }
    }
    convertHexToRgba(hex: string, opacity: number) {
        hex = hex.replace('#', '');
        let r: number, g: number, b: number;
        if (hex.length === 3) {
            r = parseInt(hex.substring(0, 1), 16);
            g = parseInt(hex.substring(1, 2), 16);
            b = parseInt(hex.substring(2, 3), 16);
        } else {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }
        const result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
        return result;
    }
    convertRgbToHex(rgb) {
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
    }
    truncateHourZeros(length) {
        const val = length.split(':');
        if (val.length === 3 && val[0] === '00') { length = val[1] + ':' + val[2]; }
        return length;
    }
    nFormatter(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num;
    }
    videoColorControlls(videoFile: SaveVideoFile) {
        $('.video-js .vjs-big-play-button').css('cssText', 'color:' + videoFile.playerColor + '!important');
        $('.video-js .vjs-play-control').css('cssText', 'color:' + videoFile.playerColor + '!important');
        $('.video-js .vjs-volume-menu-button').css('cssText', 'color:' + videoFile.playerColor + '!important');
        $('.video-js .vjs-volume-level').css('cssText', 'background-color:' + videoFile.playerColor + '!important');
        $('.video-js .vjs-play-progress').css('cssText', 'background-color:' + videoFile.playerColor + '!important');
        $('.video-js .vjs-remaining-time-display').css('cssText', 'color:' + videoFile.playerColor + '!important');
        $('.video-js .vjs-fullscreen-control').css('cssText', 'color:' + videoFile.playerColor + '!important');
        $('.video-js .vjs-volume-panel').css('cssText', 'color:' + videoFile.playerColor + '!important');
        $('.vjs-VR-control vjs-control vjs-button ').css('cssText', 'color:' + videoFile.playerColor + '!important');
        $('.video-js .vjs-control-bar .vjs-VR-control').css('cssText', 'color:' + videoFile.playerColor + '!important');
        $('.video-js .vjs-playback-rate').css('cssText', 'color:' + videoFile.playerColor + '!important');
        $('.video-js .vjs-menu-button .vjs-menu-button-popup .vjs-icon-cog .vjs-button').css('cssText', 'color:' + videoFile.playerColor + '!important');
        $('.video-js .vjs-http-source-selector .vjs-menu-button .vjs-menu-button-popup .vjs-control .vjs-button').css('cssText', 'color:' + videoFile.playerColor + '!important');
        $('.video-js .vjs-http-source-selector .vjs-menu-button .vjs-menu-button-popup .vjs-control .vjs-button').css('cssText', 'background-color:' + videoFile.playerColor + '!important');
        this.setDefaultPlayBackRateText();
    }

    setDefaultPlayBackRateText(){
        $('.vjs-playback-rate-value').text('1x');
      }

    modalWindowPopUp(url, width, height) {
        let leftPosition, topPosition;
        leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
        topPosition = (window.screen.height / 2) - ((height / 2) + 50);
        window.open(url, "Window2",
            "status=no,height=" + height + ",width=" + width + ",resizable=yes,left="
            + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY="
            + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no");
    }
    isStartsWith(logoLink:string){
       if(logoLink === "" ||logoLink === undefined || logoLink === null){ }
       else if( logoLink.startsWith("http")){ }
       else { logoLink = 'http://'+logoLink; }
       return logoLink;
    }
    setCalltoAction(callAction, user){
      callAction.email_id = user.emailId;
      callAction.firstName = user.firstName;
      callAction.lastName = user.lastName;
      return callAction;
    }
    errorVideoHandler(event) { event.target.src = "assets/images/default-image.jpg"; }
}
