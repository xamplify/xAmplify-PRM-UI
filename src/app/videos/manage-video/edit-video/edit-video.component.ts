import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef,AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileDropDirective, FileItem } from 'ng2-file-upload';
import { VideoFileService } from '../../services/video-file.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ReferenceService } from '../../../core/services/reference.service';
import { SaveVideoFile } from '../../models/save-video-file';
import { Category } from '../../models/category';
import { ShareButton, ShareProvider } from 'ng2-sharebuttons';
import { CeiboShare } from 'ng2-social-share';
import { User} from '../../../core/models/user';
import { UserService} from '../../../core/services/user.service';
declare var $, videojs: any;

@Component({
    selector: 'app-edit-video',
    templateUrl: './edit-video.component.html',
   styleUrls : ['./edit-video.component.css', '../../../../assets/css/video-css/video-js.custom.css' ,
   '../../../../assets/css/video-css/videojs-overlay.css', '../../../../assets/css/video-css/customImg.css',
   '../../../../assets/css/about-us.css', '../../../../assets/css/todo.css',
   '../../../../assets/css/daterangepicker-bs3.css', '../../../../assets/css/bootstrap-datepicker3.min.css'] 
})
export class EditVideoComponent implements OnInit,AfterViewInit {

    public imgURL: string = '';
    // public imgURL = 'http://139.59.1.205:9090/vod/images/125/03022017/flight1486153663429_play1.gif';
    public images = 'http://localhost:3000/embed-video/75eb5693-1865-4002-af66-ea6d1dd1d874';
    public linkurl = 'https://www.youtube.com/watch?v=IPf4rGw3XHw';

    public encodeImage = encodeURIComponent(this.imgURL);

    public saveVideoFile: SaveVideoFile;
    public defaultImagePath: string;
    public defaultSaveImagePath: string;
    public defaultGifImagePath: string;

    metatags: Object;
    private compPlayerColor: string = '#eeeefd';
    private compControllerColor: string = '#eeeefe';
    public uploader: FileUploader;

    twitterButton: any;
    stags = 'Hello, World';
    sdescription = 'This is a test';
    sharevideo: any;
    playlist: any;

    googleButton: any;
    facebookButton: any;

    private videoJSplayer: any;
    public videoUrl: string;

    @Output() notifyParent: EventEmitter<SaveVideoFile>;

    public file_srcs: string[] = [];
    public imageFilesfirst: string;
    public imageFilessecond: string;
    public imageFilesthird: string;

    public imageValue1: string;
    public imageValue2: string;
    public imageValue3: string;

    public giffirst: string;
    public gifsecond: string;
    public gifthird: string;

    public gifValue1: string;
    public gifValue2: string;
    public gifValue3: string;

    public newTags: string[] = [];

    public categories: Category[];

    submitted = false;
    active = true;
    videoForm: FormGroup;

    model: any = {};
    public manageVideos: boolean;
    public editVideo: boolean;
    public titleOfVideo: string;
    public ownThumbnail: boolean = false;
    public openOwnThumbnail: boolean = false;
    public thumbnailRadioOpen: boolean = true;
    public fileItem: FileItem;
    public ownThumb: boolean;
    public comments: boolean;
    public likes: boolean;
    public fileObject: File;

    public titleDiv: boolean;
    public colorControl: boolean;
    public callaction: boolean;
    public controlPlayers: boolean;
    public share: boolean;
    public shareVideos: boolean;
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
    public videoViews: number;
    public isPlay = false;
    public isThumb: boolean;
    public isPlayButton: boolean;
    embedWidth = '640';
    embedHeight = '360';
    videoSizes: string[] = ['1280 × 720', '560 × 315', '853 × 480', '640 × 360'];
    videosize = '640 × 360';
    public embedFullScreen = 'allowfullscreen';
    isFullscreen: boolean;
    enableCalltoAction: boolean;
    public callActionValue :boolean;
    public valueRange: number;
    public isOverlay: boolean;  // for disabled the play video button in the videojs overlay
    public email_id: string;
    public firstName: string;
    public lastName: string;
    public isSkipChecked: boolean; // isSkiped means to hide the videojs overlay for users
    public showOverLay: boolean; // for show the videojs overlay modal at the start or end of the video
    public isFistNameChecked: boolean;
    public lowerTextValue: string;
    public upperTextValue: string;
    public lastNameValid = false;
    public videoOverlaySubmit: string;
    public user: User = new User();
    public isValidated: boolean;

    public overLayValue: string; // videojs value overlay

    public isCallactionLast: boolean;
    public startCalltoAction: boolean;   // not required for start of the video
    public endCalltoAction: boolean;   // not required for end of the video
    public callendValue: boolean;
    public endValue :boolean;
    public is360Value: boolean;

    public maxLengthvalue = 120;
    public characterleft = 0;
    public publish = [{ id: 1, name: 'PRIVATE' }, { id: 2, name: 'PUBLIC' }, { id: 3, name: 'UNLISTED' }];

    constructor(private referenceService: ReferenceService,
        private videoFileService: VideoFileService, private router: Router,
        private route: ActivatedRoute, private fb: FormBuilder, private changeDetectorRef: ChangeDetectorRef,
        private authenticationService: AuthenticationService, private userService: UserService) {

        this.saveVideoFile = this.videoFileService.saveVideoFile;
        this.titleOfVideo = this.videoFileService.actionValue;
        console.log('EditVideoComponent constructor saveVedioFile : ' + this.saveVideoFile);

        this.defaultImagePath = this.saveVideoFile.imagePath + '?access_token=' + this.authenticationService.access_token;
        this.defaultSaveImagePath = this.saveVideoFile.imagePath;
        this.categories = this.referenceService.refcategories;
        console.log('video url is ' + this.videoUrl);
        
        this.videoUrl = this.saveVideoFile.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
        
        console.log('User data of loggdin');
        console.log(this.userService.loggedInUserData);

        this.isFullscreen = false;
        // this.isOverlay = true;
        this.showOverLay = true;
        
        if (this.saveVideoFile.allowFullscreen == false){ $('.video-js .vjs-fullscreen-control').css('display','none');}
        else {$('.video-js .vjs-fullscreen-control').css('display','block');}
        
        
        this.model.email_id = this.userService.loggedInUserData.emailId;
        this.firstName = this.userService.loggedInUserData.firstName;
        this.lastName = this.userService.loggedInUserData.lastName;

        if ( this.validateEmail(this.model.email_id) )
           { this.isOverlay = false; }
        else { this.isOverlay = true; }
       
        this.enableCalltoAction = this.saveVideoFile.callACtion;  // call action value 
        this.callActionValue = this.saveVideoFile.callACtion;
        this.startCalltoAction = this.saveVideoFile.startOfVideo;
        this.endCalltoAction = this.saveVideoFile.endOfVideo;
       
        if(this.saveVideoFile.startOfVideo == true){this.videoOverlaySubmit = 'PLAY';}
        else {  this.videoOverlaySubmit = 'SUBMIT';}
        
        if (this.saveVideoFile.startOfVideo === true && this.saveVideoFile.callACtion==true ) {
            this.overLayValue = 'StartOftheVideo';
            this.startCalltoAction = true;
            this.endCalltoAction = false;
            this.videoOverlaySubmit = 'PLAY';
            this.isPlay = true;
            localStorage.setItem('isOverlayValue', JSON.stringify(this.overLayValue)); /// setted the value true here in localstorge
        }
        else if(this.saveVideoFile.endOfVideo === true && this.saveVideoFile.callACtion==true) {
            this.endCalltoAction = true;
            this.startCalltoAction = false;
            this.overLayValue = 'EndOftheVideo';
            this.isPlay = false;
            this.videoOverlaySubmit = 'SUBMIT';
            localStorage.setItem('isOverlayValue', JSON.stringify(this.overLayValue)); /// setted the value false here in localstorge
        }
        else {
            this.overLayValue = 'removeCallAction';
            localStorage.setItem('isOverlayValue', JSON.stringify(this.overLayValue));
            
        }
        // share details
        this.share = true;
        this.sharevideo = this.saveVideoFile.videoPath;
        this.lowerTextValue = this.saveVideoFile.lowerText;
        this.upperTextValue = this.saveVideoFile.upperText;

        if (this.saveVideoFile.upperText == null){
            this.characterleft = this.maxLengthvalue;}
        else{
            this.characterleft = this.maxLengthvalue - this.saveVideoFile.upperText.length;}

        this.isPlayButton = this.saveVideoFile.name;
        console.log(this.isPlayButton);
        console.log(this.sharevideo);

        this.titleDiv = true;
        this.colorControl = this.controlPlayers = this.callaction = false;
        this.isValidated = true;

        this.metatags = {
            'title': 'Meta Tags NEw',
            'description': 'sdsdgsddssdkghsdkjglkdjsg',
            'image': 'http://139.59.1.205:9090/vod/images/125/03022017/flight1486153663429_play1.gif'
        };

        // this.seoMetaService.updateMetaTags(this.metatags);
        //   this.metaService.setTitle('Xtremand');
        this.likesValues = 2;
        this.disLikesValues = 0;
        this.videoViews = 0;
        console.log('controller value is in constructor' + this.compControllerColor);
        console.log('video path is ' + this.videoFileService.saveVideoFile.videoPath);
        this.ownThumb = false;
        this.fileObject = null;
        this.uploader = new FileUploader({
            allowedMimeType: ['image/jpeg', 'image/pjpeg', 'image/jpeg', 'image/pjpeg', 'image/png'],
            maxFileSize: 10 * 1024 * 1024, // 10 MB
        });
        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
            console.log('file object for image file');
            console.log(file);
            //  this.fileItem = file;
            //  console.log(this.fileItem);
            //  this.saveVideoFile.imageFile = file;
            this.ownThumb = true;
            this.ownThumbnail = false;
            // console.log('image file vlaue is :');
            // validateOwnThumbnail('imageFile',this.fileItem,'ownThumb');
            //  console.log(this.saveVideoFile.imageFile);

        };

        this.notifyParent = new EventEmitter<SaveVideoFile>();
    }  // closed constructor

    onChange(event: any) {
        const fileList: FileList = event.target.files;
        this.fileObject = fileList[0];
        console.log('file path is :');
        console.log(this.fileObject);
    }

    changeImgRadio1() {
        this.openOwnThumbnail = false;
        this.ownThumbnail = false;
        this.saveVideoFile.imageFile = null;
        this.file_srcs = [];
        console.log('radio button clicked 1st');
        this.saveVideoFile.imagePath = this.imageValue1;
        console.log(this.saveVideoFile.imagePath);
        this.defaultImagePath = this.saveVideoFile.imagePath + '?access_token=' + this.authenticationService.access_token;;
        this.defaultSaveImagePath = this.saveVideoFile.imagePath;
        this.imgBoolean1 = true;
        this.imgBoolean2 = this.imgBoolean3 = false;
    }
    changeImgRadio2() {
        this.openOwnThumbnail = false;
        this.ownThumbnail = false;
        this.saveVideoFile.imageFile = null;
        this.file_srcs = [];
        console.log('radio button clicked 2nd');
        this.saveVideoFile.imagePath = this.imageValue2;

        this.defaultImagePath = this.saveVideoFile.imagePath + '?access_token=' + this.authenticationService.access_token;;
        console.log(this.saveVideoFile.imagePath);
        this.defaultSaveImagePath = this.saveVideoFile.imagePath;
        this.imgBoolean2 = true;
        this.imgBoolean1 = this.imgBoolean3 = false;
    }
    changeImgRadio3() {
        this.openOwnThumbnail = false;
        this.ownThumbnail = false;
        this.saveVideoFile.imageFile = null;
        this.file_srcs = [];
        console.log('radio button clicked 3rd');
        this.saveVideoFile.imagePath = this.imageValue3;
        console.log(this.imageValue3);
        console.log(this.saveVideoFile.imagePath);
        this.defaultImagePath = this.saveVideoFile.imagePath + '?access_token=' + this.authenticationService.access_token;;
        this.defaultSaveImagePath = this.saveVideoFile.imagePath;
        this.imgBoolean1 = this.imgBoolean2 = false;
        this.imgBoolean3 = true;
    }
    changeRadio() {
        this.ownThumbnail = true;
        this.openOwnThumbnail = true;
        this.ownThumb = true;
        this.isThumb = false;
        this.file_srcs = [];
        console.log('radio button clicked');
        console.log('own thumb nail value is :' + this.ownThumb);
        this.thumbnailRadioOpen = false;
    }
    changeThumbRadio() {
        this.openOwnThumbnail = false;
        this.thumbnailRadioOpen = true;
        this.ownThumbnail = false;
        this.fileObject = null;
        this.isThumb = true;
    }
    changeGifRadio1() {
        this.gifBoolean1 = true;
        this.gifBoolean2 = this.gifBoolean3 = false;
        this.saveVideoFile.gifImagePath = this.gifValue1;
        this.defaultGifImagePath = this.saveVideoFile.gifImagePath;
    }
    changeGifRadio2() {
        this.gifBoolean2 = true;
        this.gifBoolean1 = this.gifBoolean3 = false;
        this.saveVideoFile.gifImagePath = this.gifValue2;
        this.defaultGifImagePath = this.saveVideoFile.gifImagePath;

    }
    changeGifRadio3() {
        this.gifBoolean1 = this.gifBoolean2 = false;
        this.gifBoolean3 = true;
        this.saveVideoFile.gifImagePath = this.gifValue3;
        this.defaultGifImagePath = this.saveVideoFile.gifImagePath;
    }

    fileChangefile(input: any) {
        this.ownThumbnail = false;
        this.isThumb = true;
        console.log('file change method called');
        this.readFiles(input.files);
    }
    readFile(file: any, reader: any, callback: any) {
        reader.onload = () => {
            callback(reader.result);
        }
        reader.readAsDataURL(file);
    }
    readFiles(files: any, index = 0) {
        const reader = new FileReader();
        if (index in files) {
            this.readFile(files[index], reader, (result: any) => {
                this.file_srcs.push(result);
                this.readFiles(files, index + 1);
            });
        } else {
            this.changeDetectorRef.detectChanges();
        }
    }

    titleDivChange(event: boolean) {
        console.log('title div value is :'+event);
        this.titleDiv = event;
        this.colorControl = this.controlPlayers = this.callaction = false;
    }
    colorControlChange(event: boolean) {
        console.log('colorControl div value is :'+event);
        this.colorControl = event;
        this.titleDiv  = this.controlPlayers = this.callaction = false;
    }
    controlPlayerChange(event: any) {
        console.log('contrl player div value is :'+event);
        this.controlPlayers = event;
        this.colorControl = this.titleDiv = this.callaction =false;
    }

    callToActionChange(event: any) {
        this.callaction = event;
        this.controlPlayers= this.colorControl=this.titleDiv  = false;
    }
    likesValuesDemo() {
        this.likesValues += 1;
    }
    disLikesValuesDemo() {
        this.disLikesValues += 1;
    }
    embedFulScreenValue() {
        if ( this.isFullscreen === true ) {this.embedFullScreen = 'allowfullscreen';}
        else{ this.embedFullScreen = ''; }
    }

    embedVideoSizes() {
        if (this.videosize === this.videoSizes[0]) { this.embedWidth = '1280'; this.embedHeight = '720'; }
        else if (this.videosize === this.videoSizes[1]) { this.embedWidth = '560'; this.embedHeight = '315'; }
        else if (this.videosize === this.videoSizes[2]) { this.embedWidth = '853'; this.embedHeight = '480'; }
        else { this.embedWidth = '640'; this.embedHeight = '360'; }
    }
    convertHexToRgba(hex: string, opacity: number) {
        hex = hex.replace('#', '');
        let r: number, g: number, b: number;
        if (hex.length === 3) {
            r = parseInt(hex.substring(0, 1), 16);
            g = parseInt(hex.substring(1, 2), 16);
            b = parseInt(hex.substring(2, 3), 16);
        }
        else {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }
        const result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
        return result;
    }
    transperancyControllBar(value: any) {
        const rgba = this.convertHexToRgba(this.saveVideoFile.controllerColor, value);
        $('.video-js .vjs-control-bar').css('background-color', rgba);
        this.valueRange = value;
        console.log(this.valueRange);
    }

    play360Video(){
        $('.h-video').remove();
        $('head').append('<script src="https://yanwsh.github.io/videojs-panorama/videojs/v5/video.min.js"  class="p-video"  />');
        var player = videojs('example_video_11');
        console.log(player);
        player.panorama({
            autoMobileOrientation: true,
            clickAndDrag: true,
            clickToToggle: true,
            callback: function () {
              player.ready();
            }
          });
    }
    playNormalVideo(){
        $('.p-video').remove();
        $('head').append('<script src="assets/js/indexjscss/video.js"  class="h-video"  />');
        $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"  class="h-video"  />');
        $('head').append('<script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-hls/5.5.0/videojs-contrib-hls.js"  class="h-video"  />');
        $('head').append('<script src="assets/js/indexjscss/videojs-playlist.js"  class="h-video"  />');
        $('head').append('<script src="assets/js/indexjscss/RecordRTC.js"  class="h-video"  />');
        $('head').append('<script src="assets/js/indexjscss/videojs.record.js"  class="h-video"  />');
       // var player = videojs('example_video_11');
       // player.ready();
    
    }
    // video control methods
    allowComments(event: boolean) {
        this.comments = event;
        this.saveVideoFile.allowComments = this.comments;
        console.log('allow comments after event' + this.comments);
    }
    allowLikes(event: boolean) {
        this.likes = event;
        this.saveVideoFile.allowLikes = this.likes;
        console.log('allow comments after event' + this.likes);
    }

    changePlayerColor(event: any) {
        console.log('player color value changed' + event);
        this.saveVideoFile.playerColor = event;
        $('.video-js').css('color', this.saveVideoFile.playerColor);
        $('.video-js .vjs-play-progress').css('background-color', this.saveVideoFile.playerColor);
        $('.video-js .vjs-volume-level').css('background-color', this.saveVideoFile.playerColor);
    }
    changeControllerColor(event: any) {
        console.log('controller color value changed' + event);
        this.saveVideoFile.controllerColor = event;
        $('.video-js .vjs-control-bar').css('background-color', this.saveVideoFile.controllerColor);
    }

    changeFullscreen(event: any) {
        this.saveVideoFile.allowFullscreen = event
        if (this.saveVideoFile.allowFullscreen == false){ $('.video-js .vjs-fullscreen-control').hide();}
        else {$('.video-js .vjs-fullscreen-control').show();}
    }

    allowSharing(event: boolean) {
        console.log('allow sharing ' + event);
        this.shareValues = this.saveVideoFile.allowSharing = event;
        // this.saveVideoFile.allowSharing = this.shareValues;
        // console.log(this.saveVideoFile.allowSharing);
    }
    allowEmbedVideo(event: boolean) {
        this.embedVideo = this.saveVideoFile.allowEmbed = event;
        // this.saveVideoFile.allowEmbed = this.embedVideo;
    }

    enableVideoControllers(event: boolean) {
        this.saveVideoFile.enableVideoController = event;
        if (this.saveVideoFile.enableVideoController === false) { $('.video-js .vjs-control-bar').hide();}
        else { $('.video-js .vjs-control-bar').show();}
    }
    defaultVideoControllers() {
        if (this.saveVideoFile.enableVideoController === false) { $('.video-js .vjs-control-bar').hide();}
        else { $('.video-js .vjs-control-bar').show();}
    }

    embedCode() {
        (<HTMLInputElement>document.getElementById('embed_code')).select();
        document.execCommand('copy');
    }

    openWindow() {
        window.open('http://localhost:4200/embed-video/' + this.saveVideoFile.alias,
            'mywindow', 'menubar=1,resizable=1,width=610,height=420');
    }

    defaultImagePaths() {
        if (this.saveVideoFile.imagePath === this.imageValue1) {
        this.imgBoolean1 = true; this.imgBoolean2 = this.imgBoolean3 = false;
        }
        else if (this.saveVideoFile.imagePath === this.imageValue2) {
        this.imgBoolean2 = true; this.imgBoolean1 = this.imgBoolean3 = false;
        }
        else { this.imgBoolean3 = true; this.imgBoolean1 = this.imgBoolean2 = false; }
    }

    defaultGifPaths() {
        if (this.saveVideoFile.gifImagePath === this.gifValue1) { this.gifBoolean1 = true; this.gifBoolean2 = this.gifBoolean3 = false; }
        else if (this.saveVideoFile.gifImagePath === this.gifValue2) {
             this.gifBoolean2 = true; this.gifBoolean1 = this.gifBoolean3 = false; }
        else { this.gifBoolean3 = true; this.gifBoolean1 = this.gifBoolean2 = false; }

    }
    defaultSettings() {
        console.log('default settings called');
        this.likes = this.saveVideoFile.allowLikes;
        this.comments = this.saveVideoFile.allowComments;
        this.shareValues = this.saveVideoFile.allowSharing;
        this.embedVideo = this.saveVideoFile.allowEmbed;
        this.valueRange = this.saveVideoFile.transparency;
        this.isFistNameChecked = this.saveVideoFile.name;
        this.isSkipChecked = this.saveVideoFile.skip;
        $('.video-js').css('color', this.saveVideoFile.playerColor);
        $('.video-js .vjs-play-progress').css('background-color', this.saveVideoFile.playerColor);
        $('.video-js .vjs-volume-level').css('background-color', this.saveVideoFile.playerColor);
        $('.video-js .vjs-control-bar').css('background-color', this.saveVideoFile.controllerColor);

        if (this.saveVideoFile.allowFullscreen === false) {
        	//$('.vjs-fullscreen.vjs-user-inactive').css('cursor', 'none');
        	// $('.vjs-hidden').css('display','none');
        	$('.video-js .vjs-fullscreen-control').hide();
        	//this.videoJSplayer.isFullscreen(true);
        	
        	}
        else {
        //	$('.video-js .vjs-fullscreen-control').show();
        	//$('.vjs-fullscreen.vjs-user-inactive').css('cursor', 'block');
        	 $('.vjs-hidden').css('display','block');
        //	this.videoJSplayer.isFullscreen(false);
        	}

    }

    changeUpperText(upperText: string) {
        this.upperTextValue = this.saveVideoFile.upperText = upperText;
        this.characterleft = this.maxLengthvalue - upperText.length;
    }

    changeLowerText(lowerText: string) {
        this.lowerTextValue = this.saveVideoFile.lowerText = lowerText;
    }

    enableCallToActionMethodTest(event: any) {
       this.enableCalltoAction = this.saveVideoFile.callACtion = event;
        const newValue = true;       
        const isCheckedcallaction = localStorage.setItem('iscallAction', JSON.stringify(newValue));
        const endvalue =  JSON.parse(localStorage.getItem('callEndValue'));
        // this.endValue = this.callendValue;
        if(event==true &&this.callActionValue == false && this.saveVideoFile.startOfVideo == true){
              this.isCallactionLast = true;
              $('#overlay-modal').show();
              this.videoJSplayer.pause();
              this.videoOverlaySubmit = 'PLAY';
              this.isPlay = true;
        }
        else if(event ==true && this.callActionValue == false && this.saveVideoFile.endOfVideo == true){
              this.isCallactionLast = true;
              $('#overlay-modal').show();
              this.videoJSplayer.pause();
              this.isPlay = false;
              this.videoOverlaySubmit = 'SUBMIT';
        }
        else if(event==true &&this.callActionValue == true && this.saveVideoFile.startOfVideo == true){
            this.isCallactionLast = true;
            $('#overlay-modal').show();
            this.videoJSplayer.pause();
            this.videoOverlaySubmit = 'PLAY';
            this.isPlay = true;
      }
       else if(event ==true && this.callActionValue == true && this.saveVideoFile.endOfVideo == true){
            this.isCallactionLast = true;
            $('#overlay-modal').show();
            this.videoJSplayer.pause();
            this.isPlay = false;
            this.videoOverlaySubmit = 'SUBMIT';
      }
       else if(endvalue==false && this.callActionValue == true && event===true && this.saveVideoFile.startOfVideo===true){
           $('#overlay-modal').show();
             this.isCallactionLast = false;
             this.videoJSplayer.pause();
          }
       else if(endvalue==false&& this.callActionValue == true && event===true && this.saveVideoFile.endOfVideo===true){
           $('#overlay-modal').show();
             this.isCallactionLast = false;
             this.videoJSplayer.pause();
          }
       else if(endvalue==true && event == true && this.saveVideoFile.endOfVideo === true){
            this.isCallactionLast = false;
            $('#overlay-modal').show();
            this.videoJSplayer.pause();
        }
        else if(endvalue==true && event===true && this.saveVideoFile.startOfVideo===true){
            $('#overlay-modal').show();
              this.isCallactionLast = false;
              this.videoJSplayer.pause();
           }
        
         else if(endvalue==false && event===true && this.saveVideoFile.startOfVideo===true){
             $('#overlay-modal').show();
               this.isCallactionLast = true;
               this.videoJSplayer.pause();
            }
         else if(endvalue==false && event===true && this.saveVideoFile.endOfVideo===true){
             $('#overlay-modal').show();
               this.isCallactionLast = true;
               this.videoJSplayer.pause();
            }
        else {
            this.isCallactionLast = false;
          //  this.saveVideoFile.callACtion = this.enableCalltoAction = false;
             $('#overlay-modal').hide();
             this.videoJSplayer.play();
        }
    }
    skipClose() {
         $('#overlay-modal').hide();
         this.videoJSplayer.play();
    } 
    repeatPlayVideo(){
        $('#overlay-modal').hide();
        this.videoJSplayer.play();
   }
    validateEmail(email: string) {
        const validation = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return validation.test(email);
    }

    checkingCallToActionValues() {
        if (this.isFistNameChecked === true && this.validateEmail(this.model.email_id) && this.firstName.length != 0 && this.lastName.length != 0) {
        this.isOverlay = false;
            console.log(this.model.email_id + 'mail ' + this.firstName + ' and last name ' + this.lastName);
        }
        else if (this.isFistNameChecked === false && this.validateEmail(this.model.email_id)) { this.isOverlay = false; }
        else { this.isOverlay = true; }
    }

    callToActionNames() {
        console.log(this.saveVideoFile.name + 'after changed value');
        const event = (<HTMLInputElement>document.getElementById('asknames')).checked;
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
        if (event === true) { this.startCalltoAction = true;  this.endCalltoAction = false; }
        else {  this.endCalltoAction = true; this.startCalltoAction = false; }
    }
    endCallToactionOverlay(event: boolean) {
        if (event === true) { this.endCalltoAction = true;  this.startCalltoAction = false; }
        else {  this.startCalltoAction = true;  this.endCalltoAction = false;}
    }
   
    is360VideoCheck(event :boolean){
        if(event ==true) { this.saveVideoFile.is360video = true;
               this.is360Value = this.saveVideoFile.is360video = true;}
        else {this.is360Value = this.saveVideoFile.is360video = false;}
    }
    
    ngOnInit() {

        this.categories = this.referenceService.refcategories;
        console.log(this.saveVideoFile);
        console.log('EditVideoComponent ngOnit: ');

        this.saveVideoFile.categories = this.categories;
        this.imageFilesfirst = this.saveVideoFile.imageFiles[0] + '?access_token=' + this.authenticationService.access_token;
        this.imageFilessecond = this.saveVideoFile.imageFiles[1] + '?access_token=' + this.authenticationService.access_token;
        this.imageFilesthird = this.saveVideoFile.imageFiles[2] + '?access_token=' + this.authenticationService.access_token;

        this.imageValue1 = this.saveVideoFile.imageFiles[0];
        this.imageValue2 = this.saveVideoFile.imageFiles[1];
        this.imageValue3 = this.saveVideoFile.imageFiles[2];

        this.giffirst = this.saveVideoFile.gifFiles[0] + '?access_token=' + this.authenticationService.access_token;
        this.gifsecond = this.saveVideoFile.gifFiles[1] + '?access_token=' + this.authenticationService.access_token;
        this.gifthird = this.saveVideoFile.gifFiles[2] + '?access_token=' + this.authenticationService.access_token;

        this.gifValue1 = this.saveVideoFile.gifFiles[0];
        this.gifValue2 = this.saveVideoFile.gifFiles[1];
        this.gifValue3 = this.saveVideoFile.gifFiles[2];

        if (this.videoFileService.actionValue == 'Save' && this.saveVideoFile.playerColor == 'FFFFFF' && this.saveVideoFile.controllerColor == 'FFFFFF') {
            this.compPlayerColor = '#f5f5f5';
            this.saveVideoFile.playerColor = this.compPlayerColor;
            console.log('first player color value is ' + this.saveVideoFile.playerColor);
            this.compControllerColor = '#2f2f2f';
            this.saveVideoFile.controllerColor = this.compControllerColor;
            console.log('second controller color value is ' + this.saveVideoFile.controllerColor);
        }
        else {
            this.compPlayerColor = this.saveVideoFile.playerColor;
            this.compControllerColor = this.saveVideoFile.controllerColor;
            console.log('setted  playercolor value is :' + this.compPlayerColor);
            console.log('setted  controllcolor value is :' + this.compControllerColor);
        }

        this.saveVideoFile = {
            id: this.saveVideoFile.id,
            title: this.saveVideoFile.title,
            viewBy: this.saveVideoFile.viewBy,
            categoryId: this.saveVideoFile.categoryId,
            categories: this.saveVideoFile.categories,
            tags: this.saveVideoFile.tags,
            customerId: this.saveVideoFile.customerId,
            imagePath: this.saveVideoFile.imagePath,
            imageFile: this.saveVideoFile.imageFile,
            gifImagePath: this.saveVideoFile.gifImagePath,
            description: this.saveVideoFile.description,
            playerColor: this.saveVideoFile.playerColor,
            enableVideoController: this.saveVideoFile.enableVideoController,
            controllerColor: this.saveVideoFile.controllerColor,
            allowSharing: this.saveVideoFile.allowSharing,
            enableSettings: this.saveVideoFile.enableSettings,
            allowFullscreen: this.saveVideoFile.allowFullscreen,
            allowComments: this.saveVideoFile.allowComments,
            allowLikes: this.saveVideoFile.allowLikes,
            enableCasting: this.saveVideoFile.enableCasting,
            allowEmbed: this.saveVideoFile.allowEmbed,
            transparency: this.saveVideoFile.transparency,
            action: this.saveVideoFile.action,
            callACtion : this.saveVideoFile.callACtion,
            name: this.saveVideoFile.name,
            skip: this.saveVideoFile.skip,
            upperText: this.saveVideoFile.upperText,
            lowerText: this.saveVideoFile.lowerText,
            startOfVideo: this.saveVideoFile.startOfVideo,
            endOfVideo: this.saveVideoFile.endOfVideo,
            error: this.saveVideoFile.error,
            imageFiles: this.saveVideoFile.imageFiles,
            gifFiles: this.saveVideoFile.gifFiles,
            videoLength: this.saveVideoFile.videoLength,
            bitRate: this.saveVideoFile.bitRate,
            videoPath: this.saveVideoFile.videoPath,
            uploadedDate: this.saveVideoFile.uploadedDate,
            uploadedBy: this.saveVideoFile.uploadedBy,
            alias: this.saveVideoFile.alias,
            is360video : this.saveVideoFile.is360video,
        };
        this.buildForm();
        this.defaultSettings();
        if (this.saveVideoFile.enableVideoController === false)
           { this.defaultVideoControllers();}
        this.defaultImagePaths();
        this.defaultGifPaths();
        try {
        }
        catch (err) {
            console.log('error');
        }

        this.googleButton = new ShareButton(
                ShareProvider.GOOGLEPLUS,              //choose the button from ShareProvider
                "<img src='../../assets/images/google+.png' style='height: 32px;'>",    //set button template
                'twitter'                           //set button classes
              );
        
       this.twitterButton = new ShareButton(
               ShareProvider.TWITTER,              //choose the button from ShareProvider
               "<img src='../../assets/images/twitter.png' style='height: 32px;'>",    //set button template
               'twitter'                           //set button classes
             );
       
       this.facebookButton = new ShareButton(
               ShareProvider.FACEBOOK,              //choose the button from ShareProvider
               "<img src='../../assets/images/facebook.png' style='height: 32px;'>",    //set button template
               'fb'                           //set button classes
             );
    }

    
    ngAfterViewInit() {
        let newSelf = this;
        this.videoJSplayer = videojs(document.getElementById('edit_video_player'), {}, function() {
             // this.play();
           //  const callActinLast = JSON.parse(localStorage.getItem('isCallactionLast'));
        	const player = this;
             const valueEnd = true;
             const isValid = JSON.parse(localStorage.getItem('isOverlayValue')); // gettting local storage value here isValid value is true
             console.log( player.callendValue);
             console.log(player.isValidated); // isValidated is undefined ..value setted in constructor
                  this.ready(function() {
                	  // const isCallActionChanged = localStorage.getItem('iscallAction');
                      // this.bigPlayButton.hide();
                      console.log($('#rangeValue').length);
                      if (isValid === 'StartOftheVideo' ) {
                          localStorage.setItem('callEndValue', JSON.stringify(valueEnd));
                          $('#edit_video_player').append(
                              $('#overlay-modal').show()
                          );
                          $('#replay-video').click(function() {
                              $('#overlay-modal').hide();
                              player.play();
                          });
                          $('#skipOverlay').click(function() {
                              $('#overlay-modal').hide();
                               player.play();
                          });
                      }
                      else if(isValid!= 'StartOftheVideo' ) {
                          $('#overlay-modal').hide();
                          player.play();
                      }
                      else if (isValid ==='removeCallAction'){
                          $('#overlay-modal').hide();
                        //  player.play();
                       }
                      else {
                          $('#overlay-modal').hide();
                      }
                  });
             this.on('ended', function() {
             player.callendValue = false;
             localStorage.setItem('callEndValue', JSON.stringify(player.callendValue));
             console.log(player.callendValue);
           //  const isCallActionChanged = localStorage.getItem('iscallAction');
                 if (isValid === 'EndOftheVideo' ) {
                   // $('.vjs-big-play-button').css('display', 'none');
                  // this.bigPlayButton.hide();
                // player.callendValue = true;
                 // localStorage.setItem('callEndValue', JSON.stringify(player.callendValue)); 
                     $('#edit_video_player').append(
                         $('#overlay-modal').show()
                     );

                     $('#replay-video').click(function() {
                         $('#overlay-modal').hide();
                         player.play();
                     });
                     $('#replay-video1').click(function() {
                         $('#overlay-modal').hide();
                         player.play();
                     });
                     $('#skipOverlay').click(function() {
                         $('#overlay-modal').hide();
                          player.play();
                     });
                 }  // ended if condition
                 else if(isValid!='EndOftheVideo'){
                   //   localStorage.setItem('callEndValue', JSON.stringify(player.callendValue)); 
                     $('#overlay-modal').hide();
                      player.pause();
                 }
                 else if (isValid ==='removeCallAction'){
                        $('#overlay-modal').hide();
                       player.pause();
                 }
                 else {
                      $('#overlay-modal').hide();
                      player.pause();
                 }
             }); 

           /*  this.on('contextmenu', function(e) {
                 e.preventDefault();
             }); */

             this.hotkeys({
                 volumeStep: 0.1,
                 seekStep: 5,
                 enableMute: true,
                 enableFullscreen: true,
                 enableNumbers: false,
                 enableVolumeScroll: true,
                 fullscreenKey: function(event: any, player: any) {
                     // override fullscreen to trigger when pressing the F key or Ctrl+Enter
                     return ((event.which === 70) || (event.ctrlKey && event.which === 13));
                 },
                 customKeys: {
                     // Add new simple hotkey
                     simpleKey: {
                         key: function(e: any) {
                             // Toggle something with S Key
                             return (e.which === 83);
                         },
                         handler: function(player: any, options: any, e: any) {
                             // Example
                             if (player.paused()) {
                                 player.play();
                             } else {
                                 player.pause();
                             }
                         }
                     },
                     // Add new complex hotkey
                     complexKey: {
                         key: function(e: any) {
                             // Toggle something with CTRL + D Key
                             return (e.ctrlKey && e.which === 68);
                         },
                         handler: function(player: any, options: any, event: any) {
                             // Example
                             if (options.enableMute) {
                                 player.muted(!player.muted());
                             }
                         }
                     },
                     // Override number keys example from https://github.com/ctd1500/videojs-hotkeys/pull/36
                     numbersKey: {
                         key: function(event: any) {
                             // Override number keys
                             return ((event.which > 47 && event.which < 59) || (event.which > 95 && event.which < 106));
                         },
                         handler: function(player: any, options: any, event: any) {
                             // Do not handle if enableModifiersForNumbers set to false and keys are Ctrl, Cmd or Alt
                             if (options.enableModifiersForNumbers || !(event.metaKey || event.ctrlKey || event.altKey)) {
                                 var sub = 48;
                                 if (event.which > 95) {
                                     sub = 96;
                                 }
                                 var number = event.which - sub;
                                 player.currentTime(player.duration() * number * 0.1);
                             }
                         }
                     },
                     emptyHotkey: {
                     },
                     withoutKey: {
                         handler: function(player: any, options: any, event: any) {
                             console.log('withoutKey handler');
                         }
                     },
                     withoutHandler: {
                         key: function(e: any) {
                             return true;
                         }
                     },
                     malformedKey: {
                         key: function() {
                             console.log('I have a malformed customKey. The Key function must return a boolean.');
                         },
                         handler: function(player: any, options: any, event: any) {
                             // Empty
                         }
                     }
                 }
             });

         });
        const self = this;
        this.videoJSplayer.playlist([
             {
                 sources: [{  src: self.videoUrl, type: 'application/x-mpegURL' }]
             }
            ]);

    }
    /*********************************Save Video*******************************/
    buildForm(): void {
        this.videoForm = this.fb.group({
            'title': [this.saveVideoFile.title, [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(50)
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
            'callACtion' :[this.saveVideoFile.callACtion],
            'name': [this.saveVideoFile.name],
            'skip': [this.saveVideoFile.skip],
            'upperText': [this.saveVideoFile.upperText, Validators.required],
            'lowerText': [this.saveVideoFile.lowerText, Validators.required],
            'startOfVideo': [this.saveVideoFile.startOfVideo],
            'endOfVideo': [this.saveVideoFile.endOfVideo],
            'is360video':[this.saveVideoFile.is360video],
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
    formErrors = {
        'title': '',
        'viewBy': '',
        'categoryId': '',
        'tags': '',
        'imageFile': '',
        'gifImagePath': '',
        'description': '',
        'upperText': '',
        'lowerText': '',
    };

    validationMessages = {
        'title': {
            'required': 'Title is required.',
            'minlength': 'Title must be at least 4 characters long.',
            'maxlength': 'Title cannot be more than 24 characters long.',
        },
        'viewBy': {
            'required': 'Publish is required'
        },
        'category': {
            'required': 'Category is required'
        },
        'tags': {
            'required': 'Tag is required'
        },
        'imageFile': {
            'required': 'Image file is required'
        },
        'gifImagePath': {
            'required': 'Gif is required'
        },
        'description': {
            'required': 'Description is required',
            'minlength': 'Title must be at least 5 characters long.'
        },
        'upperText': {

            'required': 'upper text is required',
        },
        'lowerText': {

            'required': 'lower text is required',
        },
    };

    saveVideo() {
        if ((this.fileObject == undefined && this.ownThumbnail == false && this.openOwnThumbnail == false) ||
            (this.fileObject != undefined && this.ownThumbnail == false && this.ownThumb == true)) {
            this.submitted = true;
            this.saveVideoFile = this.videoForm.value;
            this.saveVideoFile.playerColor = this.compPlayerColor;
            this.saveVideoFile.controllerColor = this.compControllerColor;
            this.saveVideoFile.startOfVideo = this.startCalltoAction;
            this.saveVideoFile.endOfVideo = this.endCalltoAction;

            console.log('video path is ' + this.videoFileService.saveVideoFile.videoPath);
            console.log('savevideo file controller value is ' + this.saveVideoFile.controllerColor);
            console.log('controller value is ' + this.compControllerColor);

            if (this.fileObject == undefined) {
                console.log('file object for form data in image file :');
                this.saveVideoFile.imageFile = null;
                console.log(this.saveVideoFile.imageFile);
            }
            else {
                const formData: FormData = new FormData();
                formData.append('file', this.fileObject);
                this.saveVideoFile.imageFile = formData;
                // this.saveVideoFile.imageFile = this.fileObject;
            }

            console.log(this.saveVideoFile.tags);
            const tags = this.saveVideoFile.tags;
            for (let i = 0; i < tags.length; i++) {
                if (this.videoFileService.actionValue == 'Save') {
                    this.newTags[i] = tags[i]['value'];
                }
                else {
                    let tag = tags[i];
                    if (tag['value'] != undefined) {
                        this.newTags[i] = tag['value'];
                    } else {
                        this.newTags[i] = tag;
                    }
                }
            }
            this.saveVideoFile.tags = this.newTags;
            console.log(this.saveVideoFile.tags);

            // this.saveVideoFile.imagePath = this.defaultImagePath;
            this.saveVideoFile.imagePath = this.defaultSaveImagePath;
            console.log('image path ' + this.defaultImagePath);
            this.saveVideoFile.gifImagePath = this.defaultGifImagePath;
            this.saveVideoFile.is360video = this.is360Value;

            if (this.videoFileService.actionValue == 'Save') {
                this.saveVideoFile.action = 'save';
                this.videoFileService.showSave = true;
                this.videoFileService.showUpadte = false;
            }
            else {
                this.saveVideoFile.action = 'update';
                this.videoFileService.showSave = false;
                this.videoFileService.showUpadte = true;
            }
            // console.log('video object is ' + JSON.stringify(this.saveVideoFile));
            this.saveVideoFile.transparency = this.valueRange;
            this.saveVideoFile.callACtion = this.enableCalltoAction;
            console.log(this.saveVideoFile.transparency);
            console.log(this.saveVideoFile);
            return this.videoFileService.saveVideo(this.saveVideoFile)
                .subscribe((result: any) => {
                    if (this.saveVideoFile != null) {
                        // console.log('save video data :' + this.saveVideoFile);
                        this.saveVideoFile = result;
                        console.log('this category in edit page ' + this.videoFileService.saveVideoFile.categoryId);
                        this.notifyParent.emit(this.saveVideoFile);
                    }
                    else {
                        console.log('save video data object is null please try again:' + this.saveVideoFile);
                        const message = 'video details are null';
                    }
                }),
                () => console.log(this.saveVideoFile);
        }// if closed
        else {
            console.log('image file is :');
            console.log(this.fileObject);
            console.log(this.saveVideoFile.imageFile);

        }
    }
    saveCallToActionUserForm() {
        console.log(this.model.email_id);

        if (this.userService.loggedInUserData.emailId == this.model.email_id) {
            this.user.emailId = this.model.email_id;
            this.user.firstName = this.userService.loggedInUserData.firstName;
            this.user.lastName = this.userService.loggedInUserData.lastName;
        }
        else {
            this.user.emailId = this.model.email_id;
            this.user.firstName = this.firstName;
            this.user.lastName = this.lastName;
        }
        console.log(this.user);
        this.videoFileService.saveCalltoActionUser(this.user)
            .subscribe(
            (result: any) => {
                console.log('Save user Form call to acton is successfull');
                console.log(result);
            },
            (error: string) => {
                      //  this.referenceService.showError(error, "save call to action user","Edit Video Component")
             }
            );
    }

    cancelVideo() {
        console.log('EditVideoComponent : cancelVideo() ');
        this.videoFileService.showSave = false;
        this.videoFileService.showUpadte = false;
        this.notifyParent.emit(null);

    }
    ngOnDestroy() {
        console.log('Deinit - Destroyed Component');
        this.videoJSplayer.dispose();
        this.videoFileService.actionValue = ''; // need to change to empty
        localStorage.removeItem('isOverlayValue');
        localStorage.removeItem('callEndValue');
        localStorage.removeItem('iscallAction');
        console.log(this.endValue);
    }

}
