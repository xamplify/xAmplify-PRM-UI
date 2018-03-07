import {
    Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewInit,
    style, state, animate, transition, trigger
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileItem } from 'ng2-file-upload';
import { VideoFileService } from '../../services/video-file.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ReferenceService } from '../../../core/services/reference.service';
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';
import { SaveVideoFile } from '../../models/save-video-file';
import { Category } from '../../models/category';
import { CallActionSwitch } from '../../models/call-action-switch';
import { CallAction } from '../../models/call-action';
import { User } from '../../../core/models/user';
import { DefaultVideoPlayer } from '../../models/default-video-player';
import { VideoUtilService } from '../../services/video-util.service';
declare var swal, videojs, QuickSidebar, Metronic, Demo, Layout, Index, $: any;

@Component({
    selector: 'app-edit-video',
    templateUrl: './edit-video.component.html',
    styleUrls: ['./edit-video.component.css', './foundation-themes.scss', './call-action.css',
        '../../../../assets/css/video-css/video-js.custom.css', '../../../../assets/css/todo.css',
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
    providers: [CallActionSwitch]
})
export class EditVideoComponent implements OnInit, AfterViewInit, OnDestroy {
    @Output() notifyParent: EventEmitter<SaveVideoFile>;
    saveVideoFile: SaveVideoFile;
    tempVideoFile: SaveVideoFile;
    embedModelVideo: SaveVideoFile;
    categories: Category[];
    uploader: FileUploader;
    videoLogoUploader: FileUploader;
    user: User = new User();
    defaultPlayerValues: DefaultVideoPlayer;
    callAction: CallAction = new CallAction();
    videoForm: FormGroup;
    fileItem: FileItem;
    imageUrlPath: SafeUrl;
    defaultImagePath: any;
    defaultSaveImagePath: string;
    defaultGifImagePath: string;
    compPlayerColor: string;
    compControllerColor: string;
    tempPlayerColor: string;
    tempControllerColor: string;
    videoJSplayer: any;
    videoUrl: string;
    imageFilesfirst: string;
    imageFilessecond: string;
    imageFilesthird: string;
    giffirst: string;
    gifsecond: string;
    gifthird: string;
    newTags: string[] = [];
    ownThumbnail = false;
    openOwnThumbnail = false;
    thumbnailRadioOpen = true;
    ownThumb: boolean;
    comments: boolean;
    likes: boolean;
    titleDiv: boolean;
    colorControl: boolean;
    callaction: boolean;
    controlPlayers: boolean;
    shareValues: boolean;
    embedVideo: boolean;
    imgBoolean1: boolean;
    imgBoolean2: boolean;
    imgBoolean3: boolean;
    gifBoolean1: boolean;
    gifBoolean2: boolean;
    gifBoolean3: boolean;
    likesValues: number;
    disLikesValues: number;
    isThumb: boolean;
    enableCalltoAction: boolean;
    valueRange: number;
    is360Value: boolean;
    maxLengthvalue = 75;
    characterleft = 0;
    maxlengthvalueLowerText = 50;
    lowerCharacterleft = 0;
    publish: any;
    formErrors: any;
    validationMessages: any;
    value360: boolean;
    embedUrl: string;
    upperTextValid: boolean;
    lowerTextValid: boolean;
    isValidTitle = false;
    editVideoTitle: string;
    defaultSettingValue: boolean;
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
    checkTag: string;
    isThisDraftVideo = false;
    selectedImagePath: string;
    saveButtonTitle: string;
    isDisable = false;
    brandLogoUrl: any; 
    logoDescriptionUrl: string;
    isLogoThere: boolean;
    constructor(public referenceService: ReferenceService, public callActionSwitch: CallActionSwitch,
        public videoFileService: VideoFileService, public fb: FormBuilder, public changeDetectorRef: ChangeDetectorRef,
        public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger,
        public sanitizer: DomSanitizer, public videoUtilService: VideoUtilService) {
        this.saveVideoFile = this.videoFileService.saveVideoFile;
        this.tempVideoFile = this.videoFileService.saveVideoFile;
        this.tempControllerColor = this.tempVideoFile.controllerColor;
        this.tempPlayerColor = this.tempVideoFile.playerColor;
        this.defaultPlayerValues = this.referenceService.defaultPlayerSettings;
        this.defaultSettingValue = this.saveVideoFile.defaultSetting;
        this.enableVideoControl = this.saveVideoFile.enableVideoController;
        this.editVideoTitle = this.saveVideoFile.title;
        this.publish = this.videoUtilService.publishUtil;
        this.validationMessages = this.videoUtilService.validationMessages;
        this.formErrors = this.videoUtilService.formErrors;
        if (this.saveVideoFile.viewBy === 'DRAFT') {
            this.isThisDraftVideo = true;
            this.saveVideoFile.viewBy = 'PRIVATE';
            this.saveButtonTitle = 'Save';
        } else { this.saveButtonTitle = 'Update'; }
        this.formErrors = this.videoUtilService.formErrors;
        this.defaultImagePath = this.saveVideoFile.imagePath + '?access_token=' + this.authenticationService.access_token;
        this.defaultSaveImagePath = this.saveVideoFile.imagePath;
        this.selectedImagePath = this.saveVideoFile.imagePath;
        this.callAction.email_id = this.authenticationService.user.emailId;
        this.callAction.firstName = this.authenticationService.user.firstName;
        this.callAction.lastName = this.authenticationService.user.lastName;
        this.callAction.isFistNameChecked = this.saveVideoFile.name;
        this.callAction.isSkipChecked = this.saveVideoFile.skip;
        this.is360Value = this.value360 = this.saveVideoFile.is360video;
        this.brandLogoUrl = this.saveVideoFile.brandingLogoUri;
        if (this.videoUtilService.validateEmail(this.callAction.email_id)) {
            this.callAction.isOverlay = false;
        } else { this.callAction.isOverlay = true; }
        this.enableCalltoAction = this.saveVideoFile.callACtion;  // call action value
        this.callActionOverlayboolean(this.saveVideoFile.startOfVideo, this.saveVideoFile.endOfVideo);
        if (this.saveVideoFile.startOfVideo && this.saveVideoFile.callACtion) {
            this.callActionValues('StartOftheVideo', true, false, 'PLAY');
        } else if (this.saveVideoFile.endOfVideo && this.saveVideoFile.callACtion) {
            this.callActionValues('EndOftheVideo', false, true, 'SUBMIT');
        } else {
            this.callAction.overLayValue = 'removeCallAction';
        }
        // share details
        if (this.saveVideoFile.upperText == null) {
            this.characterleft = this.maxLengthvalue;
        } else { this.characterleft = this.maxLengthvalue - this.saveVideoFile.upperText.length; }
        if (this.saveVideoFile.lowerText == null) {
            this.lowerCharacterleft = this.maxlengthvalueLowerText;
        } else { this.lowerCharacterleft = this.maxlengthvalueLowerText - this.saveVideoFile.lowerText.length; }
        this.titleDivChange();
        this.likesValues = 0;
        this.disLikesValues = 0;
        this.xtremandLogger.log('video path is ' + this.videoFileService.saveVideoFile.videoPath);
        this.ownThumb = false;
        this.uploader = new FileUploader({
            allowedMimeType: ['image/jpg', 'image/jpeg', 'image/png'],
            maxFileSize: 10 * 1024 * 1024, // 10 MB
            url: this.authenticationService.REST_URL + "videos/upload-own-thumbnail?userId=" + this.authenticationService.user.id + "&access_token=" + this.authenticationService.access_token
        });
        this.uploader.onAfterAddingFile = (fileItem) => {
            fileItem.withCredentials = false;
            console.log(fileItem);
           // this.ownThumb = true;
            this.ownThumbnail = false;
            this.imageUrlPath = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
            this.uploader.queue[0].upload();
        };
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            console.log(response); 
            this.isThumb = true;
            this.saveVideoFile.imagePath = JSON.parse(response).path;
            this.defaultSaveImagePath = this.saveVideoFile.imagePath;
        }
        this.videoLogoUploader = new FileUploader({
            allowedMimeType: ['image/jpg', 'image/jpeg', 'image/png'],
            maxFileSize: 10 * 1024 * 1024, // 10 MB
            url: this.authenticationService.REST_URL + "videos/upload-branding-logo?userId="+this.authenticationService.user.id + "&videoDefaultSetting=false&access_token=" + this.authenticationService.access_token
        });
        this.videoLogoUploader.onAfterAddingFile = (fileItem) => {
            fileItem.withCredentials = false;
            this.brandLogoUrl = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
            console.log(this.brandLogoUrl);
            this.fileLogoSelected(fileItem._file);
            this.videoLogoUploader.queue[0].upload();
        };
        this.videoLogoUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            if(JSON.parse(response).message === null){
              this.isLogoThere = false;
            } else {
            this.brandLogoUrl = this.saveVideoFile.brandingLogoUri = JSON.parse(response).path;
            console.log(response);
            if(this.logoDescriptionUrl) { this.isLogoThere = true; } else { this.isLogoThere = false; }
            }
        }
        this.notifyParent = new EventEmitter<SaveVideoFile>();
    }
    fileLogoSelected(event: File){
    (<HTMLInputElement>document.getElementById('fileLogoSelectedid')).value = '';
     const fileList: File = event;
        if (fileList) {
            const file: File = fileList;
            console.log(file);
            const isSupportfile: any = file.type;
            if (isSupportfile === 'image/jpg' || isSupportfile === 'image/jpeg' || isSupportfile === 'image/png') {
                return true;
            }
            else {
                this.videoLogoUploader.queue.length=0;
                this.videoLogoUploader = undefined;
                (<HTMLInputElement>document.getElementById('fileLogoSelectedid')).value = '';
                return false;
            }
        } 
    }

    public startsWithAt(control: FormControl) {
        try {
            let checkTag: string;
            if (control.value.charAt(0) === ' ' && checkTag.length === 0) {
                return { 'startsWithAt': true };
            }
            return null;
        } catch (error) { console.log('empty tag'); }
    }

    public validatorsTag = [this.startsWithAt];

    shareClick() {
        this.videoFileService.getShortnerUrlAlias(this.saveVideoFile.viewBy, this.saveVideoFile.alias)
            .subscribe((result: any) => {
                this.embedUrl = this.authenticationService.SERVER_URL + 'embed/' + result.alias;
                this.shareMetaTags(this.embedUrl);
                this.videoUtilService.modalWindowPopUp(this.embedUrl, 670, 500);
            });
    }
    shareMetaTags(shareShortUrl: string) {
        this.videoFileService.shareMetaTags(shareShortUrl).subscribe((result: any) => { },
            (error: any) => { this.xtremandLogger.error(error); });
    }
   embedModal(){
       this.embedModelVideo = this.saveVideoFile;
    }
    // call to action values
    callActionValues(overlayValue: string, startCallAction: boolean, endCallAction: boolean, videoPlaybutton: string) {
        this.callAction.overLayValue = overlayValue;
        this.callAction.startCalltoAction = startCallAction;
        this.callAction.endCalltoAction = endCallAction;
        this.callAction.videoOverlaySubmit = videoPlaybutton;
    }
    // clear videojs logo
    clearLogo(){
      this.brandLogoUrl = undefined;
      this.isLogoThere = false;
    }
    // image path and gif image path methods
    clearOwnThumbnail() {
        this.imageUrlPath = false;
        this.ownThumb = false;
        this.ownThumbnail = true;
        this.isThumb = false;
        this.defaultSaveImagePath = this.selectedImagePath;
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
    setSelectedImageValues() {
        this.openOwnThumbnail = this.ownThumbnail = false;
        this.saveVideoFile.imageFile = null;
    }
    selectedImgFirst() {
        this.setSelectedImageValues();
        this.saveVideoFile.imagePath = this.saveVideoFile.imageFiles[0];
        this.defaultImagePath = this.saveVideoFile.imagePath + '?access_token=' + this.authenticationService.access_token;
        this.defaultSaveImagePath = this.saveVideoFile.imagePath;
        this.settingDefaultImagePath(true, false, false);
    }
    selectedImgSecond() {
        this.setSelectedImageValues();
        this.saveVideoFile.imagePath = this.saveVideoFile.imageFiles[1];
        this.defaultImagePath = this.saveVideoFile.imagePath + '?access_token=' + this.authenticationService.access_token;
        this.defaultSaveImagePath = this.saveVideoFile.imagePath;
        this.settingDefaultImagePath(false, true, false);
    }
    selectedImgThird() {
        this.setSelectedImageValues();
        this.saveVideoFile.imagePath = this.saveVideoFile.imageFiles[2];
        this.defaultImagePath = this.saveVideoFile.imagePath + '?access_token=' + this.authenticationService.access_token;
        this.defaultSaveImagePath = this.saveVideoFile.imagePath;
        this.settingDefaultImagePath(false, false, true);
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
        this.defaultSaveImagePath = this.selectedImagePath;
    }
    selectedGifFirst() {
        this.settingDefaultGifImagePath(true, false, false);
        this.saveVideoFile.gifImagePath = this.saveVideoFile.gifFiles[0];
        this.defaultGifImagePath = this.saveVideoFile.gifImagePath;
    }
    selectedGifSecond() {
        this.settingDefaultGifImagePath(false, true, false);
        this.saveVideoFile.gifImagePath = this.saveVideoFile.gifFiles[1];
        this.defaultGifImagePath = this.saveVideoFile.gifImagePath;
    }
    selectedGifThird() {
        this.settingDefaultGifImagePath(false, false, true);
        this.saveVideoFile.gifImagePath = this.saveVideoFile.gifFiles[2];
        this.defaultGifImagePath = this.saveVideoFile.gifImagePath;
    }
    // div hide and show methods
    divChanageValues(titleDiv: boolean, colorControl: boolean, controlPlayers: boolean, callaction: boolean) {
        this.titleDiv = titleDiv; this.colorControl = colorControl;
        this.controlPlayers = controlPlayers; this.callaction = callaction;
    }
    titleDivChange() { 
        this.divChanageValues(true, false, false, false);
     }
    colorControlChange() {
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        this.divChanageValues(false, true, false, false);
        const disable = this;
        this.loadRangeDisable = false;
        setTimeout(function () {
            if (disable.defaultSettingValue) {
                disable.disableTransperancy(true);
                disable.disablePlayerSettingnew = true;
            } else {
                disable.disableTransperancy(false);
                disable.disablePlayerSettingnew = false;
            }
        }, 1);
    }
    controlPlayerChange() {
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        this.divChanageValues(false, false, true, false);
        const disable = this;
        this.loadRangeDisable = false;
        setTimeout(function () {
            disable.disablePlayerSettingnew = disable.defaultSettingValue ? true : false;
        }, 1);
    }
    callToActionChange() {
        $('html,body').animate({ scrollTop: 275 }, 'slow');
        this.divChanageValues(false, false, false, true);
        const disable = this;
        setTimeout(function () {
            if (disable.saveVideoFile.callACtion) {
                disable.disableCalltoAction(false);
            } else { disable.disableCalltoAction(true); }
        }, 1);
    }
    // like and dis like methods
    likesValuesDemo() {
        this.likesValues += 1;
    }
    disLikesValuesDemo() {
        this.disLikesValues += 1;
    }
    // embed video methods
    closeEmbedModal(event) {
        console.log('closed model success');
        this.embedModelVideo = undefined;
    }
    // normal and 360 video methods
    setVideoIdHeightWidth() {
        $('#videoId').css('height', '299px');
        $('#videoId').css('width', 'auto');
    }
    setNewPlayerIdHeightWidth() {
        $('#newPlayerVideo').css('height', '299px');
        $('#newPlayerVideo').css('width', 'auto');
    }
    setOverlayModalHeightWidth() {
        $('#overlay-modal').css('width', 'auto');
        $('#overlay-modal').css('height', '299px');
    }
    play360Video() {
        this.is360Value = true;
        $('edit_video_player').empty();
        $('.h-video').remove();
        this.videoUtilService.player360VideoJsFiles();
        const str = '<video id=videoId poster=' + this.defaultImagePath + ' class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
        $('#newPlayerVideo').append(str);
        this.videoPlayListSourceChange();
        this.videoUrl = this.videoUrl + '.mp4?access_token=' + this.authenticationService.access_token;
        $('#newPlayerVideo video').append('<source src="' + this.videoUrl + '" type="video/mp4">');
        this.setVideoIdHeightWidth();
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
                const isValid = newThis.callAction.overLayValue;
                const document: any = window.document;
                let isCallActionthere = false;
                newThis.setVideoIdHeightWidth();
                newThis.setNewPlayerIdHeightWidth();
                $('.video-js .vjs-control-bar .vjs-VR-control').css('cssText', 'color:' + newThis.saveVideoFile.playerColor + '!important');
                player.ready(function () {
                    if (isValid === 'StartOftheVideo') {
                        player.play();
                        player.pause();
                        $('.vjs-big-play-button').css('display', 'none');
                        newThis.showEditModalDialog();
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
                            newThis.fullScreenMode = false;
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
                        newThis.fullScreenMode = true;
                    } else if (event === 'FullscreenOff') {
                        newThis.setVideoIdHeightWidth();
                        newThis.fullScreenMode = false;
                        newThis.overLaySet = false;
                        if (isCallActionthere === true) {
                            newThis.overLaySet = false;
                            newThis.fullScreenMode = false;
                            newThis.setOverlayModalHeightWidth();
                            $('#videoId').append($('#overlay-modal').hide());
                            newThis.showEditModalDialog();
                        }
                    }
                });
                player.on('click', function () {
                });
            }
        });
        this.setVideoIdHeightWidth();
    }
    // video controller methods
    transperancyControllBar(value: any) {
        const color: any = this.saveVideoFile.controllerColor;
        const rgba = this.videoUtilService.transparancyControllBarColor(color, value);
        $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
        this.valueRange = value;
        this.xtremandLogger.log(this.valueRange);
    }
    allowComments(event: boolean) {
        this.saveVideoFile.allowComments = this.comments = this.newComments = event;
    }
    allowLikes(event: boolean) {
        this.saveVideoFile.allowLikes = this.newAllowLikes = this.likes = event;
    }
    defaultPlayerSettingsCondition(playerSettings: any) {
        // future work is there on enable casting and enable settings.
        try {
            this.valueRange = playerSettings.transparency;
            this.newEnableController = playerSettings.enableVideoController;
            this.comments = this.newComments = playerSettings.allowComments; // done
            this.newFullScreen = playerSettings.allowFullscreen;
            this.likes = this.newAllowLikes = playerSettings.allowLikes; // done
            this.embedVideo = this.newAllowEmbed = playerSettings.allowEmbed; // done
            this.newEnableCasting = playerSettings.enableCasting; // need to work
            this.newEnableSetting = playerSettings.enableSettings; // need to work
            this.shareValues = this.newAllowSharing = playerSettings.allowSharing; // done
            this.newValue360 = playerSettings.is360video; // no need to chagne. after saving the video, this option will affect
            this.changeFullscreenCondtion(this.newFullScreen);
        } catch (error) { console.log('error' + error); }

    }
    defaultSettingValuesBoolean(event: boolean) { this.defaultSettingValue = this.disablePlayerSettingnew = event; }
    disableTransperancy(event: boolean) { (<HTMLInputElement>document.getElementById('rangeValue')).disabled = event; }
    playerColorsChange(playercolor: string, controlcolor: string) {
        this.compPlayerColor = playercolor; this.compControllerColor = controlcolor;
    }
    defaultPlayerSettingsValues(event: boolean) {
        try {
            if (event) {
                this.defaultSettingValuesBoolean(event);
                if (!this.loadRangeDisable) { this.disableTransperancy(event); }
                this.brandLogoUrl = this.defaultPlayerValues.brandingLogoUri;
                this.logoDescriptionUrl = this.defaultPlayerValues.brandingLogoDescUri;
                this.playerColorsChange(this.defaultPlayerValues.playerColor, this.defaultPlayerValues.controllerColor);
                this.changePlayerColor(this.compPlayerColor);
                this.changeControllerColor(this.compControllerColor);
                this.changeTransperancyControllBar(this.defaultPlayerValues.transparency, this.compControllerColor);
                if (!this.loadNgOninit) { this.enableVideoControllers(this.defaultPlayerValues.enableVideoController); }
                this.defaultPlayerSettingsCondition(this.defaultPlayerValues);
                if(this.brandLogoUrl && this.logoDescriptionUrl) {this.isLogoThere = true; } else {
                    this.isLogoThere = false;
                }
            } else {
                this.defaultSettingValuesBoolean(event);
                if (!this.loadRangeDisable) { this.disableTransperancy(event); }
                this.brandLogoUrl = this.tempVideoFile.brandingLogoUri;
                this.logoDescriptionUrl = this.tempVideoFile.brandingLogoDescUri;
                this.playerColorsChange(this.tempPlayerColor, this.tempControllerColor);
                this.changePlayerColor(this.compPlayerColor);
                this.changeControllerColor(this.compControllerColor);
                this.changeTransperancyControllBar(this.tempVideoFile.transparency, this.compControllerColor);
                if (!this.loadNgOninit) { this.enableVideoControllers(this.tempVideoFile.enableVideoController); }
                this.defaultPlayerSettingsCondition(this.tempVideoFile);
                if(this.brandLogoUrl && this.logoDescriptionUrl) {this.isLogoThere = true; } else {
                    this.isLogoThere = false;
                }
            }
            this.loadNgOninit = false;
        } catch (error) { console.log(error); }
    }
    changePlayerColor(event: any) {
        this.compPlayerColor = this.saveVideoFile.playerColor = event;
        $('.video-js .vjs-play-progress').css('background-color', this.saveVideoFile.playerColor);
        $('.video-js .vjs-big-play-button').css('cssText', 'color:' + this.saveVideoFile.playerColor + '!important');
        $('.video-js .vjs-play-control').css('cssText', 'color:' + this.saveVideoFile.playerColor + '!important');
        $('.video-js .vjs-volume-menu-button').css('cssText', 'color:' + this.saveVideoFile.playerColor + '!important');
        $('.video-js .vjs-volume-level').css('cssText', 'background-color:' + this.saveVideoFile.playerColor + '!important');
        $('.video-js .vjs-remaining-time-display').css('cssText', 'color:' + this.saveVideoFile.playerColor + '!important');
        $('.video-js .vjs-fullscreen-control').css('cssText', 'color:' + this.saveVideoFile.playerColor + '!important');
        $('.video-js .vjs-volume-panel').css('cssText', 'color:' + this.saveVideoFile.playerColor + '!important');
        $('.vjs-VR-control .vjs-control .vjs-button').css('cssText', 'color:'+this.saveVideoFile.playerColor+'!important');
        $('.video-js .vjs-control-bar .vjs-VR-control').css('cssText', 'color:' + this.saveVideoFile.playerColor + '!important');
        $('.vjs-VR-control .vjs-control .vjs-button enable').css('cssText', 'color:' + this.saveVideoFile.playerColor + '!important');
    }
    changeControllerColor(event: any) {
        this.compControllerColor = this.saveVideoFile.controllerColor = event;
        const rgba = this.videoUtilService.transparancyControllBarColor(event, this.valueRange);
        $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
    }
    changeTransperancyControllBar(value: number, color: string) {
        const rgba = this.videoUtilService.transparancyControllBarColor(color, value);
        $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
    }
    changeFullscreenCondtion(event: boolean) {
        if (!event) {
            $('.video-js .vjs-fullscreen-control').hide();
        } else { $('.video-js .vjs-fullscreen-control').show(); }
    }
    changeFullscreen(event: any) {
        this.newFullScreen = this.saveVideoFile.allowFullscreen = event;
        if (!this.saveVideoFile.allowFullscreen) {
            $('.video-js .vjs-fullscreen-control').hide();
        } else { $('.video-js .vjs-fullscreen-control').show(); }
    }
    allowSharing(event: boolean) {
        this.shareValues = this.newAllowSharing = this.saveVideoFile.allowSharing = event;
    }
    allowEmbedVideo(event: boolean) {
        this.newAllowEmbed = this.embedVideo = this.saveVideoFile.allowEmbed = event;
    }
    enableCastings(event: boolean) {
        this.newEnableCasting = this.saveVideoFile.enableCasting = event;
    }
    enableSettings(event: boolean) {
        this.newEnableSetting = this.saveVideoFile.enableSettings = event;
    }
    controllBarShow() {
        $('.video-js .vjs-control-bar').show();
    }
    controllBarHide() {
        $('.video-js .vjs-control-bar').hide();
    }
    enableVideoControllers(event: boolean) {
        this.newEnableController = event;
        if (!this.newEnableController) {
            this.controllBarHide();
        } else { this.controllBarShow(); }
    }
    defaultVideoControllers() {
        if (!this.newEnableController) {
            this.controllBarHide();
        } else { this.controllBarShow(); }
    }
    is360VideoCondition(event: boolean) {
        this.saveVideoFile.is360video = this.newValue360 = this.value360 = event;
    }
    is360VideoCheck(event: boolean) {
        if (event) {
            this.is360VideoCondition(event);
        } else { this.is360VideoCondition(event); }
    }
    // call to action methods
    changeUpperText(upperText: string) {
        this.saveVideoFile.upperText = upperText;
        this.characterleft = this.maxLengthvalue - upperText.length;
        this.upperTextValid = upperText.length === 0 ? false : true;
    }
    changeLowerText(lowerText: string) {
        this.saveVideoFile.lowerText = lowerText;
        this.lowerCharacterleft = this.maxlengthvalueLowerText - lowerText.length;
        this.lowerTextValid = lowerText.length === 0 ? false : true;
    }
    enableCallToActionMethodTest(event: any) {
        this.enableCalltoAction = this.saveVideoFile.callACtion = event;
        if (event && this.saveVideoFile.startOfVideo) {
            this.disableCalltoAction(false);
            if (this.videoJSplayer) {
                this.showEditModalDialog();
                this.videoJSplayer.pause();
            } else { this.showEditModalDialog(); }
            this.callAction.videoOverlaySubmit = 'PLAY';
        } else if (event && this.saveVideoFile.endOfVideo) {
            this.disableCalltoAction(false);
            if (this.videoJSplayer) {
                this.showEditModalDialog();
                this.videoJSplayer.pause();
            } else { this.showEditModalDialog(); }
            this.callAction.videoOverlaySubmit = 'SUBMIT';
        } else {
            this.disableCalltoAction(true);
            $('#overlay-modal').hide();
            if (this.videoJSplayer) { this.videoJSplayer.pause(); }
        }
    }
    setCallToActionText(isUpperTextValid: boolean, isLowerTextValid: boolean) {
        this.upperTextValid = isUpperTextValid;
        this.lowerTextValid = isLowerTextValid;
    }

    disableCalltoAction(event: boolean) {
        (<HTMLInputElement>document.getElementById('names')).disabled = event;
        (<HTMLInputElement>document.getElementById('isSkiped')).disabled = event;
        (<HTMLInputElement>document.getElementById('upperValue')).disabled = event;
        (<HTMLInputElement>document.getElementById('lowerValue')).disabled = event;
        if ((this.saveVideoFile.upperText == null && this.saveVideoFile.lowerText === null)) {
            this.setCallToActionText(event, event);
        } else if ((this.saveVideoFile.upperText.length === 0 && this.saveVideoFile.lowerText.length === 0)) {
            this.setCallToActionText(event, event);
        } else if (!event) {
            this.setCallToActionText(!(this.saveVideoFile.upperText.length === 0), !(this.saveVideoFile.lowerText.length === 0));
        } else {
            this.setCallToActionText(true, true);
        }
    }
    checkingCallToActionValues() {
        if (this.callAction.isFistNameChecked && this.videoUtilService.validateEmail(this.callAction.email_id)
            && this.callAction.firstName.length !== 0 && this.callAction.lastName.length !== 0) {
            this.callAction.isOverlay = false;
        } else if (!this.callAction.isFistNameChecked && this.videoUtilService.validateEmail(this.callAction.email_id)) {
            this.callAction.isOverlay = false;
        } else { this.callAction.isOverlay = true; }
    }
    callToActionNames() {
        const event = (<HTMLInputElement>document.getElementById('names')).checked;
        this.callAction.isFistNameChecked = this.saveVideoFile.name = event;
    }
    allowViewersToSkipped() {
        console.log(this.saveVideoFile.skip + 'after changed value');
        const event = (<HTMLInputElement>document.getElementById('isSkiped')).checked;
        this.callAction.isSkipChecked = this.saveVideoFile.skip = event;
    }
    callActionOverlayboolean(startValue: boolean, endValue: boolean) {
        this.callAction.startCalltoAction = this.saveVideoFile.startOfVideo = startValue;
        this.callAction.endCalltoAction = this.saveVideoFile.endOfVideo = endValue;
    }
    startCallToactionOverlay(event: boolean) {
        if (event) {
            this.callActionOverlayboolean(true, false);
        } else { this.callActionOverlayboolean(false, true); }
    }
    endCallToactionOverlay(event: boolean) {
        if (event) {
            this.callActionOverlayboolean(false, true);
        } else { this.callActionOverlayboolean(true, false); }
    }
    // video source chage methods
    videoPlayListSourceChange() {
        this.videoUrl = this.saveVideoFile.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
    }
    videoPlayListSourceM3U8() {
        this.videoPlayListSourceChange();
        this.videoUrl = this.videoUrl + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
        const self = this;
        this.videoJSplayer.playlist([{ sources: [{ src: self.videoUrl, type: 'application/x-mpegURL' }] }]);
    }
    videoPlayListSourceMP4() {
        this.videoPlayListSourceChange();
        this.videoUrl = this.videoUrl + '.mp4?access_token=' + this.authenticationService.access_token;
        const self = this;
        this.videoJSplayer.playlist([{ sources: [{ src: self.videoUrl, type: 'video/mp4' }] }]);
    }
    // default methods when component initilized
    settingDefaultImagePath(image1: boolean, image2: boolean, image3: boolean) {
        this.imgBoolean1 = image1; this.imgBoolean2 = image2; this.imgBoolean3 = image3;
    }
    defaultImagePaths() {
        if (this.saveVideoFile.imagePath === this.saveVideoFile.imageFiles[0]) {
            this.settingDefaultImagePath(true, false, false);
        } else if (this.saveVideoFile.imagePath === this.saveVideoFile.imageFiles[1]) {
            this.settingDefaultImagePath(false, true, false);
        } else if (this.saveVideoFile.imagePath === this.saveVideoFile.imageFiles[2]) {
            this.settingDefaultImagePath(false, false, true);
        } else { this.settingDefaultImagePath(false, false, false); }
    }
    settingDefaultGifImagePath(gifimage1: boolean, gifimage2: boolean, gifimage3: boolean) {
        this.gifBoolean1 = gifimage1; this.gifBoolean2 = gifimage2; this.gifBoolean3 = gifimage3;
    }
    defaultGifPaths() {
        if (this.saveVideoFile.gifImagePath === this.saveVideoFile.gifFiles[0]) {
            this.settingDefaultGifImagePath(true, false, false);
        } else if (this.saveVideoFile.gifImagePath === this.saveVideoFile.gifFiles[1]) {
            this.settingDefaultGifImagePath(false, true, false);
        } else if (this.saveVideoFile.gifImagePath = this.saveVideoFile.gifFiles[2]) {
            this.settingDefaultGifImagePath(false, false, true);
        } else { this.settingDefaultGifImagePath(false, false, false); }
    }
    defaultVideoControllValues(videoFile: any) {
        try {
            this.likes = videoFile.allowLikes;
            this.comments = videoFile.allowComments;
            this.shareValues = videoFile.allowSharing;
            this.embedVideo = videoFile.allowEmbed;
        } catch (error) { console.log('error'); }
    }
    showEditModalDialog() {
        if(this.videoJSplayer){
            const self = this;
            this.videoJSplayer.play();
            setTimeout(()=>{
            self.videoJSplayer.pause();
           }, 1);
        }
        $('#overLayDialog').append($('#overlay-modal').show());
    }
    settingImagePaths(i: number) {
        return this.saveVideoFile.imageFiles[i] + '?access_token=' + this.authenticationService.access_token;
    }
    settingGifPaths(i: number) {
        return this.saveVideoFile.gifFiles[i] + '?access_token=' + this.authenticationService.access_token;
    }
    settingImageGifPaths() {
        this.imageFilesfirst = this.settingImagePaths(0);
        this.imageFilessecond = this.settingImagePaths(1);
        this.imageFilesthird = this.settingImagePaths(2);
        this.giffirst = this.settingGifPaths(0);
        this.gifsecond = this.settingGifPaths(1);
        this.gifthird = this.settingGifPaths(2);
    }
    skipOverplay() {
        $('#overlay-modal').hide();
    }
    repeatPlay() {
        $('#overlay-modal').hide();
        if (this.videoJSplayer) {
            this.videoJSplayer.play();
        }
    }
    logoDescription(event: string){
        this.logoDescriptionUrl = event;
        if(this.logoDescriptionUrl) { this.isLogoThere = true; }
        else { this.isLogoThere = false; }
    }
    ngOnInit() {
        $('#overLayImage').append($('#overlay-logo').show());
        Metronic.init();
        Layout.init();
        Demo.init();
        Index.init();
        QuickSidebar.init();
        console.log(this.referenceService.videoTitles);
        this.removeVideoTitlesWhiteSpaces();
        this.loadRangeDisable = true;
        $('#overlay-modal').hide();
        console.log('EditVideoComponent ngOnit: ');
        this.categories = this.referenceService.refcategories;
        console.log(this.saveVideoFile);
        this.saveVideoFile.categories = this.categories;
        this.settingImageGifPaths();
        //   this.defaultVideoControllValues(this.saveVideoFile);
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
            this.videoUtilService.normalVideoJsFiles();
            this.is360Value = false;
            const callactionValue = this;
            const overrideNativeValue = this.referenceService.getBrowserInfoForNativeSet();
            this.videoJSplayer = videojs(document.getElementById('edit_video_player'), {
                html5: {
                    hls: {
                        overrideNative: overrideNativeValue
                    },
                    nativeVideoTracks: !overrideNativeValue,
                    nativeAudioTracks: !overrideNativeValue,
                    nativeTextTracks: !overrideNativeValue
                  }
                 }, function () {
                    const player = this;
                    const isValid = callactionValue.callAction.overLayValue;
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
                                callactionValue.fullScreenMode = false;
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
                            callactionValue.fullScreenMode = true;
                        } else if (event === 'FullscreenOff') {
                            callactionValue.setVideoIdHeightWidth();
                            callactionValue.fullScreenMode = false;
                            callactionValue.overLaySet = false;
                            if (isCallActionthere) {
                                callactionValue.overLaySet = false;
                                callactionValue.fullScreenMode = false;
                                callactionValue.setOverlayModalHeightWidth();
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
        try {
            this.defaultPlayerSettingsValues(this.defaultSettingValue);
        } catch (error) { console.log('error'); }
        //  true ///need to change the true value to dynamic value
        if (!this.newEnableController) { this.defaultVideoControllers(); }
        this.changeDetectorRef.detectChanges();
    }
    /*********************************Save Video*******************************/
    buildForm(): void {
        this.videoForm = this.fb.group({
            'title': [this.saveVideoFile.title, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(255)
            ]
            ],
            'id': [this.saveVideoFile.id],
            'uploadedUserId': [this.saveVideoFile.uploadedUserId],
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
            'views': [this.saveVideoFile.views],
            'watchedFully': [this.saveVideoFile.watchedFully],
            'brandingLogoUri': [this.saveVideoFile.brandingLogoUri],
            'brandingLogoDescUri': [this.saveVideoFile.brandingLogoDescUri]
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
    saveVideo() {
        this.validVideoTitle(this.saveVideoFile.title);
        const titleUpdatedValue = this.saveVideoFile.title.replace(/\s\s+/g, ' ');
        const descriptionData = this.saveVideoFile.description.replace(/\s\s+/g, ' ');
        if (this.isValidTitle === false) {
            // if(this.saveButtonTitle === 'Save') { this.saveButtonTitle = 'saving..'} ;
            this.saveButtonTitle = this.saveButtonTitle==='Save'? 'Saving': 'Updating'; 
            this.isDisable = true;
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
            this.saveVideoFile.startOfVideo = this.callAction.startCalltoAction;
            this.saveVideoFile.endOfVideo = this.callAction.endCalltoAction;
            this.saveVideoFile.brandingLogoUri = this.brandLogoUrl;
            if(this.logoDescriptionUrl === '' || this.logoDescriptionUrl === null){
            this.saveVideoFile.brandingLogoDescUri = null;
            } else 
             {  this.saveVideoFile.brandingLogoDescUri = this.logoDescriptionUrl; }
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
                this.setShowSaveUpdateValues(true, false);
            } else {
                this.saveVideoFile.action = 'update';
                this.setShowSaveUpdateValues(false, true);
            }
            this.saveVideoFile.callACtion = this.enableCalltoAction;
            this.xtremandLogger.info(this.saveVideoFile);
            return this.videoFileService.saveVideo(this.saveVideoFile)
                .subscribe((result: any) => {
                    if (this.saveVideoFile != null) {
                        this.saveVideoFile = result;
                        this.notifyParent.emit(this.saveVideoFile);
                        this.videoFileService.videoViewBy = 'Save';
                     //   this.saveButtonTitle = 'Save';
                        this.isDisable = false;
                    } else {
                        this.isDisable = false;
                      //  this.saveButtonTitle = 'Save';
                        this.xtremandLogger.log('save video data object is null please try again:' + this.saveVideoFile);
                    }
                },
                (error: any) => {
                    this.isDisable = false;
                  //  this.saveButtonTitle = 'Save';
                    this.xtremandLogger.error('Edit video Component : saveVideo File method():' + error);
                    this.xtremandLogger.errorPage(error);
                }),
                () => this.xtremandLogger.log(this.saveVideoFile);
        } else { if (this.titleDiv !== true) { this.titleDivChange(); } }
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
        if (descriptionValue.replace(/\s/g, '').length) {
            this.emptyDescription = false;
        } else { this.emptyDescription = true; }
    }
    saveCallToActionUserForm() {
        $('#overlay-modal').hide();
        if (this.videoJSplayer) {
            if (this.callAction.videoOverlaySubmit === 'PLAY') {
                this.videoJSplayer.play();
            } else { this.videoJSplayer.pause(); }
        }
        this.user.emailId = this.callAction.email_id;
        this.user.firstName = this.callAction.firstName;
        this.user.lastName = this.callAction.lastName;
        this.xtremandLogger.debug(this.user);
    }
    setShowSaveUpdateValues(showSave: boolean, showUpadte: boolean) {
        this.videoFileService.showSave = showSave;
        this.videoFileService.showUpadte = showUpadte;
    }
    cancelVideo() {
        this.xtremandLogger.log('EditVideoComponent : cancelVideo() ');
        this.setShowSaveUpdateValues(false, false);
        this.notifyParent.emit(null);
    }
    ngOnDestroy() {
        this.xtremandLogger.info('Deinit - Destroyed Edit-Video Component');
        if (this.is360Value !== true || this.videoJSplayer) { this.videoJSplayer.dispose(); }
        this.videoFileService.actionValue = ''; // need to change to empty
        $('.h-video').remove();
        $('.p-video').remove();
        this.tempVideoFile = null;
    }
}
