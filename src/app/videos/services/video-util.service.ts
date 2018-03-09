import { Injectable } from '@angular/core';
import { SaveVideoFile } from '../models/save-video-file';
import { DefaultVideoPlayer } from '../models/default-video-player';
declare var $: any;

@Injectable()
export class VideoUtilService {
    videoTempDefaultSettings: DefaultVideoPlayer;
    selectedVideoId: number;
    videoViewsData: any;
    timePeriod: string;
    timePeriodValue: string;
    selectedVideo: SaveVideoFile = null;
    clipboardName: string;
    videoSizes = ['1280 × 720', '853 × 480', '640 × 360','560 × 315'];
    publishUtil = [{ id: 1, name: 'PRIVATE' }, { id: 2, name: 'PUBLIC' }, { id: 3, name: 'UNLISTED' }];
    formErrors = {
        'title': '', 'viewBy': '', 'categoryId': '', 'tags': '', 'imageFile': '', 'gifImagePath': '',
        'description': '', 'upperText': '', 'lowerText': '',
    };
    noSpaceMesg = 'No Space Left on the device Please Contact the admin.!!';
    maxSubscriptionMesg = 'Maximum Disk Space Reached for you subscription.!! Please Contact the admin.';
    codecNotSupportMesg  = 'Codec is not supported for this video..We are unable to ' +
    'process your video file. Please upload another video file!!';
    maxSizeOverMesg = 'Your video size is more than the maximum video file size(800 MB)' +
     'Please upload another video file within the limit!!';
    errorNullMesg = 'Something went wrong !! Please Contact the admin.!!';
    sortVideos = [
        { 'name': 'Sort By', 'value': '' },
        { 'name': 'Title(A-Z)', 'value': 'title-ASC' },
        { 'name': 'Title(Z-A)', 'value': 'title-DESC' },
        { 'name': 'Created Time(ASC)', 'value': 'createdTime-ASC' },
        { 'name': 'Created Time(DESC)', 'value': 'createdTime-DESC' },
        { 'name': 'ViewBy(ASC)', 'value': 'viewBy-ASC' },
        { 'name': 'ViewBy(DESC)', 'value': 'viewBy-DESC' },
    ];
     sortMonthDates = [{ 'name': 'Current month views', 'value': 'current-month' },
        { 'name': 'Month wise views', 'value': 'month' },
        { 'name': 'Quarterly views', 'value': 'quarter' }, { 'name': 'Yearly views', 'value': 'year' }];
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
            'required': 'Description is required',
            'minlength': 'Title must be at least 5 characters long.'
        },
        'upperText': { 'required': 'upper text is required', },
        'lowerText': { 'required': 'lower text is required', },
    };
    videojshotkeys() {
        $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"" type="text/javascript"  class="p-video" />');
    }
    player360VideoJsFiles() {
         $('head').append('<link href="assets/js/indexjscss/video-hls-player/video-hls-js.css" class="p-video" rel="stylesheet">');
         $('head').append('<script src="assets/js/indexjscss/360-video-player/video.js" type="text/javascript"  class="p-video"/>');
         $('head').append('<script src="assets/js/indexjscss/360-video-player/three.js" type="text/javascript"  class="p-video" />');
         $('head').append('<link href="assets/js/indexjscss/360-video-player/videojs-panorama-test.min.css" rel="stylesheet"  class="p-video">');
         $('head').append('<script src="assets/js/indexjscss/360-video-player/videojs-panorama.min.js" type="text/javascript"  class="p-video" />');
         this.videojshotkeys();
    }
    normalVideoJsFiles() {
        $('head').append('<link href="assets/js/indexjscss/video-hls-player/video-hls-js.css" class="h-video" rel="stylesheet">');
        $('head').append('<script src="assets/js/indexjscss/video-hls-player/video6.4.0.js" type="text/javascript" class="h-video"  />');
        $('head').append('<script src="assets/js/indexjscss/video-hls-player/videojs-flash.js" type="text/javascript" class="h-video"  />');
        $('head').append('<script src="assets/js/indexjscss/video-hls-player/videojs-contrib-hls.js" type="text/javascript"  class="h-video"/>');   
         $('head').append('<script src="assets/js/indexjscss/videojs-playlist.js" type="text/javascript"  class="h-video" />');
        this.videojshotkeys();
    }
    
    constructor() { }
    validateEmail(email: string) {
        const validation = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return validation.test(email);
    }
    transparancyControllBarColor(color: string, value: number) {
        if (color.includes('rgba')) { color = this.convertRgbToHex(color); }
        if (color === '#fff') {  color = '#fbfbfb';
        } else if (color === '#ccc') { color = '#cccddd';  }
        const rgba = this.convertHexToRgba(color, value);
        return rgba;
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
        $('.vjs-VR-control vjs-control vjs-button ').css('cssText', 'color:'+videoFile.playerColor+'!important');
        $('.video-js .vjs-control-bar .vjs-VR-control').css('cssText', 'color:' + videoFile.playerColor + '!important');
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
}
