import {
    Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewInit,
    style, state, animate, transition, trigger
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileDropDirective, FileItem } from 'ng2-file-upload';
import { VideoFileService } from '../../services/video-file.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ReferenceService } from '../../../core/services/reference.service';
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';
import { SaveVideoFile } from '../../models/save-video-file';
import { Category } from '../../models/category';
import { User } from '../../../core/models/user';
import { DefaultVideoPlayer } from '../../models/default-video-player';
import { VideoUtilService } from '../../services/video-util.service';
declare var $, videojs, swal: any;

@Component({
    selector: 'app-edit-video',
    templateUrl: './edit-video.component.html',
    styleUrls: ['./edit-video.component.css', './foundation-themes.scss', './call-action.css',
        '../../../../assets/css/video-css/video-js.custom.css',
        '../../../../assets/css/video-css/videojs-overlay.css', '../../../../assets/css/video-css/customImg.css',
    ],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [   // :enter is alias to 'void => *'
                style({ opacity: 0 }),
                animate(500, style({ opacity: 1 }))
            ]),
            transition(':leave', [   // :leave is alias to '* => void'
                animate(500, style({ opacity: 0 }))
            ])
        ])
    ],
})
export class EditVideoComponent implements OnInit, AfterViewInit, OnDestroy {
    @Output() notifyParent: EventEmitter<SaveVideoFile>;
    public saveVideoFile: SaveVideoFile;
    public tempVideoFile: SaveVideoFile;
    public categories: Category[];
    public uploader: FileUploader;
    public user: User = new User();
    public defaultPlayerValues: DefaultVideoPlayer;
    videoForm: FormGroup;
    public fileItem: FileItem;
    public imageUrlPath: SafeUrl;
    public defaultImagePath: any;
    public defaultSaveImagePath: string;
    public defaultGifImagePath: string;
    public compPlayerColor: string;
    public compControllerColor: string;
    public videoJSplayer: any;
    public videoUrl: string;
    public imageFilesfirst: string;
    public imageFilessecond: string;
    public imageFilesthird: string;
    public giffirst: string;
    public gifsecond: string;
    public gifthird: string;
    public newTags: string[] = [];
    submitted = false;
    active = true;
    model: any = {};
    public titleOfVideo: string;
    public ownThumbnail = false;
    public openOwnThumbnail = false;
    public thumbnailRadioOpen = true;
    public ownThumb: boolean;
    public comments: boolean;
    public likes: boolean;
    public titleDiv: boolean;
    public colorControl: boolean;
    public callaction: boolean;
    public controlPlayers: boolean;
    public shareValues: boolean;
    public embedVideo: boolean;
    public imgBoolean1: boolean;
    public imgBoolean2: boolean;
    public imgBoolean3: boolean;
    public gifBoolean1: boolean;
    public gifBoolean2: boolean;
    public gifBoolean3: boolean;
    public likesValues: number;
    public disLikesValues: number;
    public isPlay = false;
    public isThumb: boolean;
    public isPlayButton: boolean;
    embedWidth = '640';
    embedHeight = '360';
    videoSizes: string[];
    videosize = '640 × 360';
    public embedFullScreen = 'allowfullscreen';
    isFullscreen: boolean;
    enableCalltoAction: boolean;
    public valueRange: number;
    public isOverlay: boolean;  // for disabled the play video button in the videojs overlay
    public email_id: string;
    public firstName: string;
    public lastName: string;
    public isSkipChecked: boolean; // isSkiped means to hide the videojs overlay for users
    public showOverLay: boolean; // for show the videojs overlay modal at the start or end of the video
    public isFistNameChecked: boolean;
    public lastNameValid = false;
    public videoOverlaySubmit: string;
    public overLayValue: string; // videojs value overlay
    public startCalltoAction: boolean;   // not required for start of the video
    public endCalltoAction: boolean;   // not required for end of the video
    public is360Value: boolean;
    public maxLengthvalue = 75;
    public characterleft = 0;
    public maxlengthvalueLowerText = 50;
    public lowerCharacterleft = 0;
    public publish: any;
    public formErrors: any;
    public value360: boolean;
    public embedUrl: string;
    public ClipboardName: string;
    public disableStart: boolean;
    public disableEnd: boolean;
    public upperTextValid: boolean;
    public lowerTextValid: boolean;
    public isValidTitle = false;
    public editVideoTitle: string;
    public defaultSettingValue: boolean;
    newEnableController: boolean;
    newComments: boolean;
    newFullScreen: boolean;
    newAllowLikes: boolean;
    newAllowEmbed: boolean;
    newEnableCasting: boolean;
    newEnableSetting: boolean;
    newAllowSharing: boolean;
    newValue360: boolean;
    disablePlayerSettingnew: boolean;
    loadRangeDisable: boolean;
    enableVideoControl: boolean;
    loadNgOninit = true;
    videoTitlesValues = [];
    overLaySet = false;
    fullScreenMode = false;
    emptyTitle = false;
    emptyDescription = false;
    public onTextValue = 'ON';
    public offTextValue = 'OFF';
     _onColorBswitch = 'success';
    _offColorBswitch = 'warning';
    public size = 'normal';
    public animate = true;
    public checkTag: string;
    constructor(public referenceService: ReferenceService,
        public videoFileService: VideoFileService, public router: Router, public route: ActivatedRoute, 
        public fb: FormBuilder, public changeDetectorRef: ChangeDetectorRef,
        public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger,
        public sanitizer: DomSanitizer, public videoUtilService: VideoUtilService) {
        this.saveVideoFile = this.videoFileService.saveVideoFile;
        this.tempVideoFile = this.videoFileService.saveVideoFile;
        this.defaultPlayerValues = this.referenceService.defaultPlayerSettings;
        this.defaultSettingValue = this.saveVideoFile.defaultSetting;
        this.enableVideoControl = this.saveVideoFile.enableVideoController;
        this.titleOfVideo = this.videoFileService.actionValue;
        this.editVideoTitle = this.saveVideoFile.title;
        this.videoSizes = this.videoUtilService.videoSizes;
        this.publish = this.videoUtilService.publishUtil;
        if (this.saveVideoFile.viewBy === 'DRAFT') {
            this.saveVideoFile.viewBy = 'PRIVATE';
        }
        this.formErrors = this.videoUtilService.formErrors;
        this.ClipboardName = 'Copy to Clipboard';
        this.defaultImagePath = this.saveVideoFile.imagePath + '?access_token=' + this.authenticationService.access_token;
        this.defaultSaveImagePath = this.saveVideoFile.imagePath;
        this.isFullscreen = true;
        this.showOverLay = true;
        this.model.email_id = this.authenticationService.user.emailId;
        this.firstName = this.authenticationService.user.firstName;
        this.lastName = this.authenticationService.user.lastName;
        this.isFistNameChecked = this.saveVideoFile.name;
        this.isSkipChecked = this.saveVideoFile.skip;
        this.is360Value = this.value360 = this.saveVideoFile.is360video;
        if (this.videoUtilService.validateEmail(this.model.email_id)) {
            this.isOverlay = false;
        } else { this.isOverlay = true; }
        this.enableCalltoAction = this.saveVideoFile.callACtion;  // call action value
        this.startCalltoAction = this.saveVideoFile.startOfVideo;
        this.endCalltoAction = this.saveVideoFile.endOfVideo;
        if (this.saveVideoFile.startOfVideo === true) {
            this.videoOverlaySubmit = 'PLAY';
        } else { this.videoOverlaySubmit = 'SUBMIT'; }
        if (this.saveVideoFile.startOfVideo === true && this.saveVideoFile.callACtion === true) {
            this.overLayValue = 'StartOftheVideo';
            this.startCalltoAction = true;
            this.endCalltoAction = false;
            this.videoOverlaySubmit = 'PLAY';
            this.isPlay = true;
        } else if (this.saveVideoFile.endOfVideo === true && this.saveVideoFile.callACtion === true) {
            this.endCalltoAction = true;
            this.startCalltoAction = false;
            this.overLayValue = 'EndOftheVideo';
            this.isPlay = false;
            this.videoOverlaySubmit = 'SUBMIT';
        } else {
            this.overLayValue = 'removeCallAction';
        }
        // share details
        if (this.saveVideoFile.upperText == null) {
            this.characterleft = this.maxLengthvalue;
        } else { this.characterleft = this.maxLengthvalue - this.saveVideoFile.upperText.length; }
        if (this.saveVideoFile.lowerText == null) {
            this.lowerCharacterleft = this.maxlengthvalueLowerText;
        } else { this.lowerCharacterleft = this.maxlengthvalueLowerText - this.saveVideoFile.lowerText.length; }
        this.isPlayButton = this.saveVideoFile.name;
        // this.titleDiv = true;
        // this.colorControl = this.controlPlayers = this.callaction = false;
        this.openStartingDivs();
        this.likesValues = 2;
        this.disLikesValues = 0;
        this.xtremandLogger.log('video path is ' + this.videoFileService.saveVideoFile.videoPath);
        this.ownThumb = false;
        this.uploader = new FileUploader({
            allowedMimeType: ['image/jpg', 'image/jpeg', 'image/png'],
            maxFileSize: 10 * 1024 * 1024, // 10 MB
        });
        this.uploader.onAfterAddingFile = (fileItem) => {
            fileItem.withCredentials = false;
            this.ownThumb = true;
            this.ownThumbnail = false;
            this.imageUrlPath = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
        };
        this.notifyParent = new EventEmitter<SaveVideoFile>();
        this.embedUrl = this.authenticationService.APP_URL + 'embed-video/' + this.saveVideoFile.viewBy + '/' + this.saveVideoFile.alias;
        // need to modify this code for embed video modal popup
   }  // closed constructor

   openStartingDivs() {
        this.titleDiv = true;
        this.colorControl = this.controlPlayers = this.callaction = false;
    }
     public startsWithAt(control: FormControl) {
        let checkTag: string;
        if (control.value.charAt(0) === ' ' &&  checkTag.length === 0) {
            return { 'startsWithAt': true };
        }
        return null;
    }

    public validatorsTag = [this.startsWithAt];

    shareClick() {
        window.open(this.authenticationService.APP_URL + '/embed-video/' + this.saveVideoFile.viewBy + '/' + this.saveVideoFile.alias,
        'mywindow', 'menubar=1,resizable=1,width=670,height=485');
    }
    // image path and gif image path methods
    clearOwnThumbnail() {
        this.imageUrlPath = false;
        this.ownThumb = false;
        this.ownThumbnail = true;
        this.isThumb = false;
    }
    ownThumbnailfileChange(event: any) {
        const fileList: FileList = event.target.files;
        console.log(fileList[0].type);
        if (fileList.length > 0) {
            const file: File = fileList[0];
            const isSupportfile: any = fileList[0].type;
            if (isSupportfile === 'image/jpg' || isSupportfile === 'image/jpeg' || isSupportfile === 'image/png') {
            this.videoFileService.saveOwnThumbnailFile(file)
                .subscribe((result: any) => {
                    this.xtremandLogger.log(result);
                    this.isThumb = true;
                    this.saveVideoFile.imagePath = result.path;
                    this.defaultSaveImagePath = this.saveVideoFile.imagePath;
                });
             } else {
                 (<HTMLInputElement>document.getElementById('ownFileuplad')).value = '';
                 this.xtremandLogger.log('not supported image thumbnail file');
                }
        }
    }
    selectedImgFirst() {
        this.openOwnThumbnail = false;
        this.ownThumbnail = false;
        this.saveVideoFile.imageFile = null;
        this.saveVideoFile.imagePath = this.saveVideoFile.imageFiles[0];
        this.defaultImagePath = this.saveVideoFile.imagePath + '?access_token=' + this.authenticationService.access_token;
        this.defaultSaveImagePath = this.saveVideoFile.imagePath;
        this.imgBoolean1 = true;
        this.imgBoolean2 = this.imgBoolean3 = false;
    }
    selectedImgSecond() {
        this.openOwnThumbnail = false;
        this.ownThumbnail = false;
        this.saveVideoFile.imageFile = null;
        this.saveVideoFile.imagePath = this.saveVideoFile.imageFiles[1];
        this.defaultImagePath = this.saveVideoFile.imagePath + '?access_token=' + this.authenticationService.access_token;
        this.defaultSaveImagePath = this.saveVideoFile.imagePath;
        this.imgBoolean2 = true;
        this.imgBoolean1 = this.imgBoolean3 = false;
    }
    selectedImgThird() {
        this.openOwnThumbnail = false;
        this.ownThumbnail = false;
        this.saveVideoFile.imageFile = null;
        this.saveVideoFile.imagePath = this.saveVideoFile.imageFiles[2];
        this.defaultImagePath = this.saveVideoFile.imagePath + '?access_token=' + this.authenticationService.access_token;
        this.defaultSaveImagePath = this.saveVideoFile.imagePath;
        this.imgBoolean1 = this.imgBoolean2 = false;
        this.imgBoolean3 = true;
    }
    selectedOwnThumnailOption() {
        this.ownThumbnail = true;
        this.openOwnThumbnail = true;
        this.ownThumb = true;
        this.isThumb = false;
        this.thumbnailRadioOpen = false;
    }
    changeImageThumbnailOption() {
        this.openOwnThumbnail = false;
        this.thumbnailRadioOpen = true;
        this.ownThumbnail = false;
        this.isThumb = true;
        this.imageUrlPath = false;
    }
    selectedGifFirst() {
        this.gifBoolean1 = true;
        this.gifBoolean2 = this.gifBoolean3 = false;
        this.saveVideoFile.gifImagePath = this.saveVideoFile.gifFiles[0];
        this.defaultGifImagePath = this.saveVideoFile.gifImagePath;
    }
    selectedGifSecond() {
        this.gifBoolean2 = true;
        this.gifBoolean1 = this.gifBoolean3 = false;
        this.saveVideoFile.gifImagePath = this.saveVideoFile.gifFiles[1];
        this.defaultGifImagePath = this.saveVideoFile.gifImagePath;
    }
    selectedGifThird() {
        this.gifBoolean1 = this.gifBoolean2 = false;
        this.gifBoolean3 = true;
        this.saveVideoFile.gifImagePath = this.saveVideoFile.gifFiles[2];
        this.defaultGifImagePath = this.saveVideoFile.gifImagePath;
    }
    // div hide and show methods
    titleDivChange(event: boolean) {
        this.titleDiv = event;
        this.colorControl = this.controlPlayers = this.callaction = false;
    }
    colorControlChange(event: boolean) {
        this.colorControl = event;
        this.titleDiv = this.controlPlayers = this.callaction = false;
        const disable = this;
        this.loadRangeDisable = false;
        setTimeout(function () {
            if (disable.defaultSettingValue === true) {
                disable.disableRange(true);
                disable.disablePlayerSettingnew = true;
            } else {
                disable.disableRange(false);
                disable.disablePlayerSettingnew = false;
            }
        }, 1);
    }
    controlPlayerChange(event: any) {
        this.controlPlayers = event;
        this.colorControl = this.titleDiv = this.callaction = false; const disable = this;
        this.loadRangeDisable = false;
        setTimeout(function () {
            if (disable.defaultSettingValue === true) {
                disable.disablePlayerSettingnew = true;
            } else { disable.disablePlayerSettingnew = false; }
        }, 1);
    }
    callToActionChange(event: any) {
        this.callaction = event;
        this.controlPlayers = this.colorControl = this.titleDiv = false;
        const disable = this;
        setTimeout(function () {
            if (disable.saveVideoFile.callACtion === true) {
                disable.disableCalltoAction(false);
            } else { disable.disableCalltoAction(true); }
        }, 1);
    }
    disableRange(event: boolean) {
        (<HTMLInputElement>document.getElementById('rangeValue')).disabled = event;
    }
    // like and dis like methods
    likesValuesDemo() {
        this.likesValues += 1;
    }
    disLikesValuesDemo() {
        this.disLikesValues += 1;
    }
    // embed video methods
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
    embedCode() {
        this.ClipboardName = 'Copied !';
        (<HTMLInputElement>document.getElementById('embed_code')).select();
        document.execCommand('copy');
    }
    closeEmbedModal() {
        this.ClipboardName = 'Copy to Clipboard';
    }
    // normal and 360 video methods
    play360Video() {
        this.is360Value = true;
        $('edit_video_player').empty();
        this.xtremandLogger.log('Loaded 360 Video');
        $('.h-video').remove();
        $('head').append('<script src="assets/js/indexjscss/360-video-player/video.js" type="text/javascript"  class="p-video"/>');
        $('head').append('<script src="assets/js/indexjscss/360-video-player/three.js" type="text/javascript"  class="p-video" />');
        $('head').append('<link href="assets/js/indexjscss/360-video-player/videojs-panorama.min.css" rel="stylesheet"  class="p-video">');
        $('head').append('<script src="assets/js/indexjscss/360-video-player/videojs-panorama.v5.js" type="text/javascript"  class="p-video" />');
        $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"" type="text/javascript"  class="p-video" />');
        const str = '<video id=videoId poster=' + this.defaultImagePath + ' class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
        $('#newPlayerVideo').append(str);
        this.videoUrl = this.saveVideoFile.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '.mp4?access_token=' + this.authenticationService.access_token;
        //   this.videoUrl = 'https://yanwsh.github.io/videojs-panorama/assets/shark.mp4'; // need to commet
        $('#newPlayerVideo video').append('<source src="' + this.videoUrl + '" type="video/mp4">');
        $('#videoId').css('height', '299px');
        $('#videoId').css('width', 'auto');
        const newThis = this;
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
        player.panorama({
            autoMobileOrientation: true,
            clickAndDrag: true,
            clickToToggle: true,
            callback: function () {
                // player.ready();
                const isValid = newThis.overLayValue;
                const document: any = window.document;
                let isCallActionthere = false;
               $('#videoId').css('height', '299px');
               $('#videoId').css('width', 'auto');
                $('#newPlayerVideo').css('height', '299px');
               $('#newPlayerVideo').css('width', 'auto');
                player.ready(function () {
                    if (isValid === 'StartOftheVideo') {
                        player.play();
                        player.pause();
                        $('.vjs-big-play-button').css('display', 'none');
                        newThis.show360ModalDialog();
                    } else if (isValid !== 'StartOftheVideo') {
                        $('#overlay-modal').hide(); player.play();
                    } else {
                        $('#overlay-modal').hide();
                        player.play();
                    }
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
                player.on('ended', function () {
                    if (isValid === 'EndOftheVideo') {
                        const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                        const event = state ? 'FullscreenOn' : 'FullscreenOff';
                        if (event === 'FullscreenOn') {
                            isCallActionthere = true;
                            newThis.overLaySet = true;
                            newThis.fullScreenMode = true;
                            $('#overlay-modal').css('width', '100%');
                            $('#overlay-modal').css('height', '100%');
                            $('#videoId').append($('#overlay-modal').show());
                        } else {
                            newThis.overLaySet = false;
                            newThis.showEditModalDialog();
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
                        $('.vjs-tech').css('width', '100%');
                        $('.vjs-tech').css('height', '100%');
                    } else if (event === 'FullscreenOff') {
                        $('#videoId').css('width', 'auto');
                        $('#videoId').css('height', '299px');
                        newThis.fullScreenMode = false;
                        newThis.overLaySet = false;
                        if (isCallActionthere === true) {
                            newThis.overLaySet = false;
                            newThis.fullScreenMode = false;
                            $('#overlay-modal').css('width', 'auto');
                            $('#overlay-modal').css('height', '299px');
                            $('#videoId').append($('#overlay-modal').hide());
                            newThis.showEditModalDialog();
                        }
                    }
                });
                player.on('click', function () {
                });
            }
        });
        $('#videoId').css('width', 'auto');
        $('#videoId').css('height', '299px');
    }
    // video controller methods
    transperancyControllBar(value: any) {
        let color: any;
        if (this.saveVideoFile.controllerColor === '#fff') {
            color = '#fbfbfb';
        } else if (this.saveVideoFile.controllerColor === '#ccc') { 
            color = '#cccddd';
        } else { color = this.saveVideoFile.controllerColor; }
        const rgba = this.videoUtilService.convertHexToRgba(color, value);
       // $('.video-js .vjs-control-bar').css('background-color', rgba);
         $('.video-js .vjs-control-bar').css('cssText', 'background-color:'+rgba+'!important');
        this.valueRange = value;
        this.xtremandLogger.log(this.valueRange);
    }
    allowComments(event: boolean) {
        this.comments = event;
        this.saveVideoFile.allowComments = this.comments;
        this.newComments = event;
        console.log('allow comments after event' + this.comments);
    }
    allowLikes(event: boolean) {
        this.likes = event;
        this.saveVideoFile.allowLikes = this.likes;
        this.newAllowLikes = event;
        console.log('allow comments after event' + this.likes);
    }
    defaultPlayerSettingsValues(event: boolean) {
        if (event === true) {
            this.disablePlayerSettingnew = true;
            if (this.loadRangeDisable !== true) {
                (<HTMLInputElement>document.getElementById('rangeValue')).disabled = event;
            }
            this.compPlayerColor = this.defaultPlayerValues.playerColor;
            this.compControllerColor = this.defaultPlayerValues.controllerColor;
            this.valueRange = this.defaultPlayerValues.transparency;
            this.changePlayerColor(this.compPlayerColor);
            this.changeControllerColor(this.compControllerColor);
            if (this.loadNgOninit === false) {
                this.enableVideoControllers(this.defaultPlayerValues.enableVideoController);
            }
            this.newEnableController = this.defaultPlayerValues.enableVideoController;
            this.newComments = this.defaultPlayerValues.allowComments;
            this.newFullScreen = this.defaultPlayerValues.allowFullscreen;
            this.newAllowLikes = this.defaultPlayerValues.allowLikes;
            this.newAllowEmbed = this.defaultPlayerValues.allowEmbed;
            this.newEnableCasting = this.defaultPlayerValues.enableCasting;
            this.newEnableSetting = this.defaultPlayerValues.enableSettings;
            this.newAllowSharing = this.defaultPlayerValues.allowSharing;
            this.newValue360 = this.defaultPlayerValues.is360video;
        } else {
            if (this.loadRangeDisable !== true) {
                (<HTMLInputElement>document.getElementById('rangeValue')).disabled = event;
            }
            this.disablePlayerSettingnew = false;
            this.valueRange = this.tempVideoFile.transparency;
            this.compPlayerColor = this.tempVideoFile.playerColor;
            this.compControllerColor = this.tempVideoFile.controllerColor;
            this.changeControllerColor(this.tempVideoFile.controllerColor);
            this.changePlayerColor(this.tempVideoFile.playerColor);
            if (this.loadNgOninit === false) {
                this.enableVideoControllers(this.tempVideoFile.enableVideoController);
            }
            this.newEnableController = this.tempVideoFile.enableVideoController;
            this.newComments = this.tempVideoFile.allowComments;
            this.newFullScreen = this.tempVideoFile.allowFullscreen;
            this.newAllowLikes = this.tempVideoFile.allowLikes;
            this.newAllowEmbed = this.tempVideoFile.allowEmbed;
            this.newEnableCasting = this.tempVideoFile.enableCasting;
            this.newEnableSetting = this.tempVideoFile.enableSettings;
            this.newAllowSharing = this.tempVideoFile.allowSharing;
            this.newValue360 = this.tempVideoFile.is360video;
        }
        this.loadNgOninit = false;
    }
    changePlayerColor(event: any) {
        console.log('player color value changed' + event);
        this.saveVideoFile.playerColor = event;
        this.compPlayerColor = event;
        $('.video-js').css('color', this.saveVideoFile.playerColor);
        $('.video-js .vjs-play-progress').css('background-color', this.saveVideoFile.playerColor);
        $('.video-js .vjs-volume-level').css('background-color', this.saveVideoFile.playerColor);
       // this.transperancyControllBar(this.valueRange);
    }
    changeControllerColor(event: any) {
        this.saveVideoFile.controllerColor = event;
        this.compControllerColor = event;
        $('.video-js .vjs-control-bar').css('cssText','background-color:'+this.saveVideoFile.controllerColor+'!important');
    //    $('.video-js .vjs-control-bar').css('background-color', this.saveVideoFile.controllerColor);
     //   this.transperancyControllBar(this.valueRange);
    }
    changeFullscreen(event: any) {
        this.saveVideoFile.allowFullscreen = event;
        this.newFullScreen = event;
        if (this.saveVideoFile.allowFullscreen === false) {
            $('.video-js .vjs-fullscreen-control').hide();
        } else { $('.video-js .vjs-fullscreen-control').show(); }
    }
    allowSharing(event: boolean) {
        console.log('allow sharing ' + event);
        this.newAllowSharing = event;
        this.shareValues = this.saveVideoFile.allowSharing = event;
    }
    allowEmbedVideo(event: boolean) {
        this.newAllowEmbed = event;
        this.embedVideo = this.saveVideoFile.allowEmbed = event;
    }
    enableCastings(event: boolean) {
        this.newEnableCasting = event;
        this.saveVideoFile.enableCasting = event;
    }
    enableSettings(event: boolean) {
        this.newEnableSetting = event;
        this.saveVideoFile.enableSettings = event;
    }
    enableVideoControllers(event: boolean) {
        this.newEnableController = event;
        if (this.newEnableController === false) {
            $('.video-js .vjs-control-bar').hide();
        } else { $('.video-js .vjs-control-bar').show(); }
    }
    defaultVideoControllers() {
        if (this.newEnableController === false) {
            $('.video-js .vjs-control-bar').hide();
        } else { $('.video-js .vjs-control-bar').show(); }
    }
    is360VideoCheck(event: boolean) {
        if (event === true) {
            this.saveVideoFile.is360video = true;
            this.newValue360 = true;
            this.value360 = true;
        } else {
            this.saveVideoFile.is360video = false;
            this.newValue360 = false;
            this.value360 = false;
        }
    }
    // call to action methods
    changeUpperText(upperText: string) {
        this.saveVideoFile.upperText = upperText;
        this.characterleft = this.maxLengthvalue - upperText.length;
        if (upperText.length === 0) {
            this.upperTextValid = false;
        } else { this.upperTextValid = true; }
    }
    changeLowerText(lowerText: string) {
        this.saveVideoFile.lowerText = lowerText;
        this.lowerCharacterleft = this.maxlengthvalueLowerText - lowerText.length;
        if (lowerText.length === 0) {
            this.lowerTextValid = false;
        } else { this.lowerTextValid = true; }
    }
    enableCallToActionMethodTest(event: any) {
        this.enableCalltoAction = this.saveVideoFile.callACtion = event;
        if (event === true && this.saveVideoFile.startOfVideo === true) {
            this.disableCalltoAction(false);
            if (this.videoJSplayer) {
                $('#overLayDialog').append($('#overlay-modal').show());
                this.videoJSplayer.pause();
            } else { $('#overLayDialog').append($('#overlay-modal').show()); }
            this.videoOverlaySubmit = 'PLAY';
            this.isPlay = true;
        } else if (event === true && this.saveVideoFile.endOfVideo === true) {
            this.disableCalltoAction(false);
            if (this.videoJSplayer) {
                $('#overLayDialog').append($('#overlay-modal').show());
                this.videoJSplayer.pause();
            } else {
                $('#overLayDialog').append($('#overlay-modal').show());
            }
            this.videoOverlaySubmit = 'SUBMIT';
            this.isPlay = false;
        } else {
            this.disableCalltoAction(true);
            $('#overlay-modal').hide();
            if (this.videoJSplayer) { this.videoJSplayer.pause(); }
        }
    }
    disableCalltoAction(event: boolean) {
        (<HTMLInputElement>document.getElementById('names')).disabled = event;
        (<HTMLInputElement>document.getElementById('isSkiped')).disabled = event;
        (<HTMLInputElement>document.getElementById('upperValue')).disabled = event;
        (<HTMLInputElement>document.getElementById('lowerValue')).disabled = event;
        this.disableStart = event;
        this.disableEnd = event;
        if ((this.saveVideoFile.upperText == null && this.saveVideoFile.lowerText === null) && event === false) {
            this.upperTextValid = false;
            this.lowerTextValid = false;
        } else if ((this.saveVideoFile.upperText == null && this.saveVideoFile.lowerText === null) && event === true) {
            this.upperTextValid = true;
            this.lowerTextValid = true;
        } else if ((this.saveVideoFile.upperText.length === 0 && this.saveVideoFile.lowerText.length === 0) && event === false) {
            this.upperTextValid = false;
            this.lowerTextValid = false;
        } else if (this.saveVideoFile.upperText.length === 0 && this.saveVideoFile.lowerText.length === 0 && event === true) {
            this.upperTextValid = true;
            this.lowerTextValid = true;
        } else if ((this.saveVideoFile.upperText.length === 0 && this.saveVideoFile.lowerText.length !== 0) && event === false) {
            this.upperTextValid = false;
            this.lowerTextValid = true;
        } else if (this.saveVideoFile.lowerText.length === 0 && this.saveVideoFile.upperText.length !== 0 && event === false) {
            this.lowerTextValid = false;
            this.upperTextValid = true;
        } else {
            this.upperTextValid = true;
            this.lowerTextValid = true;
        }
    }
    skipClose() {
        $('#overlay-modal').hide();
        //  $('.video-js .vjs-control-bar').show();
        if (this.videoJSplayer) {
            this.videoJSplayer.play();
        }
    }
    repeatPlayVideo() {
        $('#overlay-modal').hide();
        //   $('.video-js .vjs-control-bar').show();
        if (this.videoJSplayer) {
            this.videoJSplayer.play();
        }
    }
    checkingCallToActionValues() {
        if (this.isFistNameChecked === true && this.videoUtilService.validateEmail(this.model.email_id)
            && this.firstName.length !== 0 && this.lastName.length !== 0) {
            this.isOverlay = false;
            console.log(this.model.email_id + 'mail ' + this.firstName + ' and last name ' + this.lastName);
        } else if (this.isFistNameChecked === false
            && this.videoUtilService.validateEmail(this.model.email_id)) {
            this.isOverlay = false;
        } else { this.isOverlay = true; }
    }

    callToActionNames() {
        console.log(this.saveVideoFile.name + 'after changed value');
        const event = (<HTMLInputElement>document.getElementById('names')).checked;
        this.isPlayButton = this.isFistNameChecked = this.saveVideoFile.name = event;
    }
    allowViewersToSkipped() {
        console.log(this.saveVideoFile.skip + 'after changed value');
        const event = (<HTMLInputElement>document.getElementById('isSkiped')).checked;
        this.saveVideoFile.skip = event;
        console.log(this.saveVideoFile.skip);
        this.isSkipChecked = this.saveVideoFile.skip;
    }
    startCallToactionOverlay(event: boolean) {
        if (event === true) {
            this.startCalltoAction = this.saveVideoFile.startOfVideo = true;
            this.endCalltoAction = this.saveVideoFile.endOfVideo = false;
        } else {
            this.endCalltoAction = this.saveVideoFile.endOfVideo = true;
            this.startCalltoAction = this.saveVideoFile.startOfVideo = false;
        }
    }
    endCallToactionOverlay(event: boolean) {
        if (event === true) {
            this.startCalltoAction = this.saveVideoFile.startOfVideo = false;
            this.endCalltoAction = this.saveVideoFile.endOfVideo = true;
        } else {
            this.startCalltoAction = this.saveVideoFile.startOfVideo = true;
            this.endCalltoAction = this.saveVideoFile.endOfVideo = false;
        }
    }
    // video source chage methods
    videoPlayListSourceM3U8() {
        this.videoUrl = this.saveVideoFile.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
        const self = this;
        this.videoJSplayer.playlist([{ sources: [{ src: self.videoUrl, type: 'application/x-mpegURL' }] }]);
    }
    videoPlayListSourceMP4() {
        this.videoUrl = this.saveVideoFile.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '.mp4?access_token=' + this.authenticationService.access_token;
        const self = this;
        this.videoJSplayer.playlist([{ sources: [{ src: self.videoUrl, type: 'video/mp4' }] }]);
    }
    // default methods when component initilized
    defaultImagePaths() {
        if (this.saveVideoFile.imagePath === this.saveVideoFile.imageFiles[0]) {
            this.imgBoolean1 = true; this.imgBoolean2 = this.imgBoolean3 = false;
        } else if (this.saveVideoFile.imagePath === this.saveVideoFile.imageFiles[1]) {
            this.imgBoolean2 = true; this.imgBoolean1 = this.imgBoolean3 = false;
        } else if (this.saveVideoFile.imagePath === this.saveVideoFile.imageFiles[2]) {
            this.imgBoolean3 = true; this.imgBoolean1 = this.imgBoolean2 = false;
        } else { this.imgBoolean1 = this.imgBoolean2 = this.imgBoolean3 = false; }
    }
    defaultGifPaths() {
        if (this.saveVideoFile.gifImagePath === this.saveVideoFile.gifFiles[0]) {
            this.gifBoolean1 = true; this.gifBoolean2 = this.gifBoolean3 = false;
        } else if (this.saveVideoFile.gifImagePath === this.saveVideoFile.gifFiles[1]) {
            this.gifBoolean2 = true; this.gifBoolean1 = this.gifBoolean3 = false;
        } else if (this.saveVideoFile.gifImagePath = this.saveVideoFile.gifFiles[2]) {
            this.gifBoolean3 = true; this.gifBoolean1 = this.gifBoolean2 = false;
        } else { this.gifBoolean1 = this.gifBoolean2 = this.gifBoolean3 = false; }
    }
    defaultVideoControllValues(videoFile: any) {
        this.likes = videoFile.allowLikes;
        this.comments = videoFile.allowComments;
        this.shareValues = videoFile.allowSharing;
        this.embedVideo = videoFile.allowEmbed;
    }
    defaultVideoSettings() {
        console.log('default settings called');
        $('.video-js').css('color', this.saveVideoFile.playerColor);
        $('.video-js .vjs-play-progress').css('background-color', this.saveVideoFile.playerColor);
        $('.video-js .vjs-volume-level').css('background-color', this.saveVideoFile.playerColor);
        if (this.saveVideoFile.controllerColor === '#fff') {
            const event = '#fbfbfb';
            $('.video-js .vjs-control-bar').css('background-color', event);
        } else { $('.video-js .vjs-control-bar').css('background-color', this.saveVideoFile.controllerColor); }
        if (this.saveVideoFile.allowFullscreen === false) {
            $('.video-js .vjs-fullscreen-control').hide();
        } else { $('.video-js .vjs-fullscreen-control').show(); }
    }
    showEditModalDialog() {
        $('#overLayDialog').append($('#overlay-modal').show());
    }
    show360ModalDialog() {
        $('#overLayDialog').append($('#overlay-modal').show());
    }
    ngOnInit() {
        console.log(this.referenceService.videoTitles);
        this.removeVideoTitlesWhiteSpaces();
        this.loadRangeDisable = true;
        $('#overlay-modal').hide();
        console.log('EditVideoComponent ngOnit: ');
        this.categories = this.referenceService.refcategories;
        console.log(this.saveVideoFile);
        this.saveVideoFile.categories = this.categories;
        this.imageFilesfirst = this.saveVideoFile.imageFiles[0] + '?access_token=' + this.authenticationService.access_token;
        this.imageFilessecond = this.saveVideoFile.imageFiles[1] + '?access_token=' + this.authenticationService.access_token;
        this.imageFilesthird = this.saveVideoFile.imageFiles[2] + '?access_token=' + this.authenticationService.access_token;
        this.giffirst = this.saveVideoFile.gifFiles[0] + '?access_token=' + this.authenticationService.access_token;
        this.gifsecond = this.saveVideoFile.gifFiles[1] + '?access_token=' + this.authenticationService.access_token;
        this.gifthird = this.saveVideoFile.gifFiles[2] + '?access_token=' + this.authenticationService.access_token;
        this.likes = this.saveVideoFile.allowLikes;
        this.comments = this.saveVideoFile.allowComments;
        this.shareValues = this.saveVideoFile.allowSharing;
        this.embedVideo = this.saveVideoFile.allowEmbed;
        try {
            this.buildForm();
            this.defaultImagePaths();
            this.defaultGifPaths();
        } catch (error) {
            console.log('error' + error);
        }
    }
    ngAfterViewInit() {
        $('#edit_video_player').empty();
        $('#newPlayerVideo').empty();
        if (this.saveVideoFile.is360video !== true) {
            $('.p-video').remove();
            $('head').append('<link href="assets/js/indexjscss/video-hls-player/video-hls-js.css" class="h-video" rel="stylesheet">');
            $('head').append('<script src="assets/js/indexjscss/video-hls-player/video-hls.js" type="text/javascript" class="h-video"  />');
            $('head').append('<script src="assets/js/indexjscss/video-hls-player/videojs.hls.min.js" type="text/javascript"  class="h-video"/>');
            $('head').append('<script src="assets/js/indexjscss/videojs-playlist.js" type="text/javascript"  class="h-video" />');
            $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"" type="text/javascript"  class="h-video" />');
            this.is360Value = false;
            const callactionValue = this;
            this.videoJSplayer = videojs(document.getElementById('edit_video_player'), {}, function () {
                const player = this;
                const isValid = callactionValue.overLayValue;
                console.log(isValid);
                const document: any = window.document;
                let isCallActionthere = false;
                this.ready(function () {
                    if (isValid === 'StartOftheVideo') {
                        $('.video-js.vjs-default-skin .vjs-big-play-button').css('display', 'none');
                        player.play();
                        player.pause();
                        callactionValue.showEditModalDialog();
                    } else if (isValid !== 'StartOftheVideo') {
                        $('.vjs-big-play-button').css('display', 'none');
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
                this.on('ended', function () {
                    if (isValid === 'EndOftheVideo') {
                        $('.vjs-big-play-button').css('display', 'none');
                        const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                        const event = state ? 'FullscreenOn' : 'FullscreenOff';
                        if (event === 'FullscreenOn') {
                            isCallActionthere = true;
                            callactionValue.overLaySet = true;
                            callactionValue.fullScreenMode = true;
                            $('#overlay-modal').css('width', '100%');
                            $('#overlay-modal').css('height', '100%');
                            $('#edit_video_player').append($('#overlay-modal').show());
                        } else {
                            callactionValue.overLaySet = false;
                            callactionValue.showEditModalDialog();
                        }
                    } else if (isValid !== 'EndOftheVideo') {
                        $('.vjs-big-play-button').css('display', 'none');
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
                this.on('fullscreenchange', function () {
                    const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                    const event = state ? 'FullscreenOn' : 'FullscreenOff';
                    if (event === 'FullscreenOn') {
                        $('.vjs-tech').css('width', '100%');
                        $('.vjs-tech').css('height', '100%');
                    } else if (event === 'FullscreenOff') {
                        $('#videoId').css('width', '640px');
                        $('#videoId').css('height', '318px');
                        callactionValue.fullScreenMode = false;
                        callactionValue.overLaySet = false;
                        if (isCallActionthere === true) {
                            callactionValue.overLaySet = false;
                            callactionValue.fullScreenMode = false;
                            $('#edit_video_player').append($('#overlay-modal').hide());
                            callactionValue.showEditModalDialog();
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
            if (this.videoFileService.actionValue === 'Save') {
                this.videoPlayListSourceMP4();
            } else {
                this.videoPlayListSourceM3U8();
            }
        } else {   // playing 360 video
            this.play360Video();
        }
        this.defaultPlayerSettingsValues(this.defaultSettingValue); //  true ///need to change the true value to dynamic value
        this.defaultVideoSettings();
        this.transperancyControllBar(this.valueRange);
        if (this.newEnableController === false) {
            this.defaultVideoControllers();
        }
    }
    /*********************************Save Video*******************************/
    buildForm(): void {
        this.videoForm = this.fb.group({
            'title': [this.saveVideoFile.title, [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(255)
            ]
            ],
            'id': [this.saveVideoFile.id],
            'viewBy': [this.saveVideoFile.viewBy, Validators.required],
            'categoryId': [this.saveVideoFile.categoryId, Validators.required],
            'tags': [this.saveVideoFile.tags, Validators.required],
            'imageFile': [this.saveVideoFile.imageFile],
            'imagePath': [this.saveVideoFile.imagePath],
            'gifImagePath': [this.saveVideoFile.gifImagePath, Validators.required],
            'description': [this.saveVideoFile.description, Validators.required],
            'enableVideoController': [this.saveVideoFile.enableVideoController, Validators.required],
            'allowSharing': [this.saveVideoFile.allowSharing, Validators.required],
            'enableSettings': [this.saveVideoFile.enableSettings, Validators.required],
            'allowFullscreen': [this.saveVideoFile.allowFullscreen, Validators.required],
            'allowComments': [this.saveVideoFile.allowComments, Validators.required],
            'allowLikes': [this.saveVideoFile.allowLikes, Validators.required],
            'enableCasting': [this.saveVideoFile.enableCasting, Validators.required],
            'allowEmbed': [this.saveVideoFile.allowEmbed, Validators.required],
            'playerColor': [this.saveVideoFile.playerColor],
            'controllerColor': [this.saveVideoFile.controllerColor],
            'transparency': [this.saveVideoFile.transparency],
            'action': [this.saveVideoFile.action],
            'callACtion': [this.saveVideoFile.callACtion],
            'name': [this.saveVideoFile.name],
            'skip': [this.saveVideoFile.skip],
            'upperText': [this.saveVideoFile.upperText],
            'lowerText': [this.saveVideoFile.lowerText],
            'startOfVideo': [this.saveVideoFile.startOfVideo],
            'endOfVideo': [this.saveVideoFile.endOfVideo],
            'is360video': [this.saveVideoFile.is360video],
            'defaultSetting': [this.saveVideoFile.defaultSetting],
            'category': [this.saveVideoFile.category],
            'views': [this.saveVideoFile.views]
        });
        this.videoForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));

        this.onValueChanged();
    }

    onValueChanged(data?: any) {
        if (!this.videoForm) { return; }
        const form = this.videoForm;
        for (const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }
    validationMessages = {
        'title': {
            'required': 'Title is required.',
            'minlength': 'Title must be at least 4 characters long.',
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
    saveVideo() {
        this.validVideoTitle(this.saveVideoFile.title);
        const titleUpdatedValue = this.saveVideoFile.title.replace(/\s\s+/g, ' ');
        const descriptionData = this.saveVideoFile.description.replace(/\s\s+/g, ' ');
        if (this.isValidTitle === false) {
            this.submitted = true;
            this.saveVideoFile = this.videoForm.value;
            this.saveVideoFile.defaultSetting = this.defaultSettingValue;
            this.saveVideoFile.playerColor = this.compPlayerColor;
            this.saveVideoFile.controllerColor = this.compControllerColor;
            this.saveVideoFile.transparency = this.valueRange;
            this.saveVideoFile.enableVideoController = this.newEnableController;
            this.saveVideoFile.allowComments = this.newComments;
            this.saveVideoFile.allowFullscreen = this.newFullScreen;
            this.saveVideoFile.allowLikes = this.newAllowLikes;
            this.saveVideoFile.allowEmbed = this.newAllowEmbed;
            this.saveVideoFile.enableCasting = this.newEnableCasting;
            this.saveVideoFile.enableSettings = this.newEnableSetting;
            this.saveVideoFile.allowSharing = this.newAllowSharing;
            this.saveVideoFile.is360video = this.newValue360;
            this.saveVideoFile.startOfVideo = this.startCalltoAction;
            this.saveVideoFile.endOfVideo = this.endCalltoAction;
            console.log('video path is ' + this.videoFileService.saveVideoFile.videoPath);
            console.log('savevideo file controller value is ' + this.saveVideoFile.controllerColor);
            console.log('controller value is ' + this.compControllerColor);
            console.log(this.saveVideoFile.tags);
            const tags = this.saveVideoFile.tags;
            for (let i = 0; i < tags.length; i++) {
                if (this.videoFileService.actionValue === 'Save') {
                    this.newTags[i] = tags[i]['value'];
                } else {
                    const tag = tags[i];
                    if (tag['value'] !== undefined) {
                        this.newTags[i] = tag['value'];
                    } else {
                        this.newTags[i] = tag;
                    }
                }
            }
            // if (this.saveVideoFile.tags.length === 1 && (tags[0]['value'] === '' || tags[0] === '')) {
            //     this.tagsUndefined = true;
            //     this.saveVideoFile.tags.length = 0;
            //     this.openStartingDivs();
            // }
            this.saveVideoFile.tags = this.newTags;
            console.log(this.saveVideoFile.tags);
            this.saveVideoFile.title = titleUpdatedValue;
            this.saveVideoFile.description = descriptionData;
            this.saveVideoFile.imagePath = this.defaultSaveImagePath;
            this.xtremandLogger.log('image path ' + this.defaultImagePath);
            this.saveVideoFile.gifImagePath = this.defaultGifImagePath;
            this.saveVideoFile.imageFile = null;
            if (this.videoFileService.actionValue === 'Save') {
                this.saveVideoFile.action = 'save';
                this.videoFileService.showSave = true;
                this.videoFileService.showUpadte = false;
            } else {
                this.saveVideoFile.action = 'update';
                this.videoFileService.showSave = false;
                this.videoFileService.showUpadte = true;
            }
            this.saveVideoFile.callACtion = this.enableCalltoAction;
            this.xtremandLogger.info(this.saveVideoFile.transparency);
            this.xtremandLogger.info(this.saveVideoFile);
                return this.videoFileService.saveVideo(this.saveVideoFile)
                    .subscribe((result: any) => {
                        if (this.saveVideoFile != null) {
                            this.saveVideoFile = result;
                            this.notifyParent.emit(this.saveVideoFile);
                            this.videoFileService.videoViewBy = 'Save';
                        } else {
                            this.xtremandLogger.log('save video data object is null please try again:' + this.saveVideoFile);
                        }
                    },
                    (error: any) => {
                        this.xtremandLogger.error('Edit video Component : saveVideo File method():' + error);
                        this.xtremandLogger.errorPage(error);
                    } ),
                    () => this.xtremandLogger.log(this.saveVideoFile);
           } else { if ( this.titleDiv !== true ) { this.openStartingDivs(); } }
    }
    validVideoTitle(videoTitle: string) {
        this.saveVideoFile.title = videoTitle;
        console.log(videoTitle.length);
        if (videoTitle.replace(/\s/g, '').length) {
        this.emptyTitle = false;
        } else { this.emptyTitle = true; }
        if ((this.videoFileService.videoViewBy !== 'DRAFT' && this.videoFileService.actionValue === 'Update') &&
            (videoTitle.replace(/\s/g, '') === this.editVideoTitle.replace(/\s/g, ''))) {
            this.isValidTitle = false;
        } else {
            videoTitle = videoTitle.replace(/\s/g, '');
            this.isValidTitle = this.checkVideoTitleAvailability(this.videoTitlesValues, videoTitle.toLowerCase());
        }
    }
    checkVideoTitleAvailability(arr, val) {
        this.xtremandLogger.log(arr.indexOf(val) > -1);
        return arr.indexOf(val) > -1;
    }
    removeVideoTitlesWhiteSpaces() {
        for (let i = 0; i < this.referenceService.videoTitles.length; i++) {
            this.videoTitlesValues.push(this.referenceService.videoTitles[i].replace(/\s/g, ''));
        }
        this.xtremandLogger.debug(this.videoTitlesValues);
    }
    descriptionInput(descriptionValue: string) {
        this.saveVideoFile.description = descriptionValue;
        console.log(descriptionValue.length);
        if (descriptionValue.replace(/\s/g, '').length) {
        this.emptyDescription = false;
        } else { this.emptyDescription = true; }
    }
    saveCallToActionUserForm() {
        $('#overlay-modal').hide();
        if (this.videoJSplayer) {
            if (this.videoOverlaySubmit === 'PLAY') {
                this.videoJSplayer.play();
            } else { this.videoJSplayer.pause(); }
        }
        this.user.emailId = this.model.email_id;
        this.user.firstName = this.firstName;
        this.user.lastName = this.lastName;
        this.xtremandLogger.debug(this.user);
    }
    cancelVideo() {
        this.xtremandLogger.log('EditVideoComponent : cancelVideo() ');
        this.videoFileService.showSave = false;
        this.videoFileService.showUpadte = false;
        this.notifyParent.emit(null);
    }
    ngOnDestroy() {
        this.xtremandLogger.info('Deinit - Destroyed Edit-Video Component');
        if (this.is360Value !== true) {
            this.videoJSplayer.dispose();
        } else if (this.videoJSplayer) {
            this.videoJSplayer.dispose();
        } else { }
        this.videoFileService.actionValue = ''; // need to change to empty
        $('.h-video').remove();
        $('.p-video').remove();
        this.tempVideoFile = null;
    }
}
