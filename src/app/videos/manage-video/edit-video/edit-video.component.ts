import { Component, OnInit, Input, Output, Renderer, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileDropDirective, FileItem } from 'ng2-file-upload';
import { VideoFileService } from '../../services/video-file.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ReferenceService } from '../../../core/services/reference.service';
import { SaveVideoFile } from '../../models/save-video-file';
import { Category } from '../../models/category';
import { ShareButton, ShareProvider } from 'ng2-sharebuttons';
import { CeiboShare } from 'ng2-social-share';
import { User } from '../../../core/models/user';
import { UserService } from '../../../core/services/user.service';
import { UtilService } from '../../services/util.service';
declare var $, videojs, swal: any;

@Component({
   selector: 'app-edit-video',
   templateUrl: './edit-video.component.html',
   styleUrls : ['./edit-video.component.css', './foundation-themes.scss', '../../../../assets/css/video-css/video-js.custom.css' ,
   '../../../../assets/css/video-css/videojs-overlay.css', '../../../../assets/css/video-css/customImg.css',
   '../../../../assets/css/about-us.css', '../../../../assets/css/todo.css',
   '../../../../assets/css/daterangepicker-bs3.css', '../../../../assets/css/bootstrap-datepicker3.min.css']
})
export class EditVideoComponent implements OnInit, AfterViewInit {

    public imgURL = '';
    // public imgURL = 'http://139.59.1.205:9090/vod/images/125/03022017/flight1486153663429_play1.gif';
    public linkurl = 'http://aravindu.com/embed-video/e47c4a80-1be0-4b32-8098-a327baac05f2';
    public encodeImage = encodeURIComponent(this.imgURL);
    @Output() notifyParent: EventEmitter<SaveVideoFile>;
    public saveVideoFile: SaveVideoFile;
    public categories: Category[];
    public uploader: FileUploader;
    public user: User = new User();
    videoForm: FormGroup;
    public fileItem: FileItem;
    public fileObject: File;
    metatags: Object;
    public imageUrlPath: SafeUrl;
    public defaultImagePath: any;
    public defaultSaveImagePath: string;
    public defaultGifImagePath: string;
    private compPlayerColor = '#eeeefd';
    private compControllerColor = '#eeeefe';
    twitterButton: any;
    sharevideo: any;
    googleButton: any;
    facebookButton: any;
    private videoJSplayer: any;
    public playlist: any;
    public videoUrl: string;
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
    submitted = false;
    active = true;
    model: any = {};
    public manageVideos: boolean;
    public editVideo: boolean;
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
    public share: boolean;
    public shareVideos: boolean;
    public shareValues: boolean;
    public embedVideo:  boolean;
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
    videoSizes: string[] ;
    videosize = '640 × 360';
    public embedFullScreen = 'allowfullscreen';
    isFullscreen: boolean;
    fullScreen: boolean;
    enableCalltoAction: boolean;
    public callActionValue: boolean;
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
    public overLayValue: string; // videojs value overlay
    public startCalltoAction: boolean;   // not required for start of the video
    public endCalltoAction: boolean;   // not required for end of the video
    public is360Value: boolean;
    public maxLengthvalue = 120;
    public characterleft = 0;
    public publish: any;
    public formErrors: any;
    public selectedVideoFilePath: string;
    public value360: boolean;
    public isCallAction: string;
    public embedSrcPath: string;
    constructor(private referenceService: ReferenceService,
        private videoFileService: VideoFileService, private router: Router,
        private route: ActivatedRoute, private fb: FormBuilder, private changeDetectorRef: ChangeDetectorRef,
        private authenticationService: AuthenticationService, private userService: UserService,
        private sanitizer: DomSanitizer , private utilService: UtilService) {
        this.saveVideoFile = this.videoFileService.saveVideoFile;
        this.titleOfVideo = this.videoFileService.actionValue;
        this.videoSizes = this.utilService.videoSizes;
        this.publish = this.utilService.publishUtil;
        this.formErrors  = this.utilService.formErrors;
        console.log('EditVideoComponent constructor saveVedioFile : ' + this.saveVideoFile);
        this.defaultImagePath = this.saveVideoFile.imagePath + '?access_token=' + this.authenticationService.access_token;
        this.defaultSaveImagePath = this.saveVideoFile.imagePath;
        console.log(this.userService.loggedInUserData);
        this.isFullscreen = true;
        this.showOverLay = true;
        this.model.email_id = this.userService.loggedInUserData.emailId;
        this.firstName = this.userService.loggedInUserData.firstName;
        this.lastName = this.userService.loggedInUserData.lastName;
        this.is360Value = this.value360 =  this.saveVideoFile.is360video;
        if ( this.utilService.validateEmail(this.model.email_id) )
           { this.isOverlay = false; }
        else { this.isOverlay = true; }

        this.enableCalltoAction = this.saveVideoFile.callACtion;  // call action value
        this.callActionValue = this.saveVideoFile.callACtion;
        this.startCalltoAction = this.saveVideoFile.startOfVideo;
        this.endCalltoAction = this.saveVideoFile.endOfVideo;

        if(this.saveVideoFile.startOfVideo === true) {this.videoOverlaySubmit = 'PLAY'; }
        else {  this.videoOverlaySubmit = 'SUBMIT'; }

        if (this.saveVideoFile.startOfVideo === true && this.saveVideoFile.callACtion === true ) {
            this.overLayValue = 'StartOftheVideo';
            this.startCalltoAction = true;
            this.endCalltoAction = false;
            this.videoOverlaySubmit = 'PLAY';
            this.isPlay = true;
        //    localStorage.setItem('isOverlayValue', JSON.stringify(this.overLayValue)); /// setted the value true here in localstorge
        }
        else if ( this.saveVideoFile.endOfVideo === true && this.saveVideoFile.callACtion === true) {
            this.endCalltoAction = true;
            this.startCalltoAction = false;
            this.overLayValue = 'EndOftheVideo';
            this.isPlay = false;
            this.videoOverlaySubmit = 'SUBMIT';
          //  localStorage.setItem('isOverlayValue', JSON.stringify(this.overLayValue)); /// setted the value false here in localstorge
        }
        else {
            this.overLayValue = 'removeCallAction';
         //   localStorage.setItem('isOverlayValue', JSON.stringify(this.overLayValue));
        }
        // share details
        this.share = true;
        this.sharevideo = this.saveVideoFile.videoPath;
        this.lowerTextValue = this.saveVideoFile.lowerText;
        this.upperTextValue = this.saveVideoFile.upperText;

        if (this.saveVideoFile.upperText == null) {
            this.characterleft = this.maxLengthvalue; }
        else{ this.characterleft = this.maxLengthvalue - this.saveVideoFile.upperText.length; }
        this.isPlayButton = this.saveVideoFile.name;
        this.titleDiv = true;
        this.colorControl = this.controlPlayers = this.callaction = false;
        this.metatags = {
            'title': 'Meta Tags NEw',
            'description': 'sdsdgsddssdkghsdkjglkdjsg',
            'image': 'http://139.59.1.205:9090/vod/images/125/03022017/flight1486153663429_play1.gif'
        };
        this.likesValues = 2;
        this.disLikesValues = 0;
        this.videoViews = 0;
        console.log('video path is ' + this.videoFileService.saveVideoFile.videoPath);
        this.ownThumb = false;
        this.fileObject = null;
        this.uploader = new FileUploader({
            allowedMimeType: ['image/jpeg', 'image/pjpeg', 'image/jpeg', 'image/pjpeg', 'image/png'],
            maxFileSize: 10 * 1024 * 1024, // 10 MB
        });
        this.uploader.onAfterAddingFile = (fileItem) => {
              fileItem.withCredentials = false;
              this.ownThumb = true;
              this.ownThumbnail = false;
              this.imageUrlPath  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
         };
        this.notifyParent = new EventEmitter<SaveVideoFile>();
    }  // closed constructor

  // image path and gif image path methods
    removeOwnThumbnail() {
      this.imageUrlPath = false;
      this.ownThumb = false;
      this.ownThumbnail = true;
    }
    changeImgRadio1() {
        this.openOwnThumbnail = false;
        this.ownThumbnail = false;
        this.saveVideoFile.imageFile = null;
        this.saveVideoFile.imagePath = this.imageValue1;
        this.defaultImagePath = this.saveVideoFile.imagePath + '?access_token=' + this.authenticationService.access_token;
        this.defaultSaveImagePath = this.saveVideoFile.imagePath;
        this.imgBoolean1 = true;
        this.imgBoolean2 = this.imgBoolean3 = false;
    }
    changeImgRadio2() {
        this.openOwnThumbnail = false;
        this.ownThumbnail = false;
        this.saveVideoFile.imageFile = null;
        this.saveVideoFile.imagePath = this.imageValue2;
        this.defaultImagePath = this.saveVideoFile.imagePath + '?access_token=' + this.authenticationService.access_token;
        this.defaultSaveImagePath = this.saveVideoFile.imagePath;
        this.imgBoolean2 = true;
        this.imgBoolean1 = this.imgBoolean3 = false;
    }
    changeImgRadio3() {
        this.openOwnThumbnail = false;
        this.ownThumbnail = false;
        this.saveVideoFile.imageFile = null;
        this.saveVideoFile.imagePath = this.imageValue3;
        this.defaultImagePath = this.saveVideoFile.imagePath + '?access_token=' + this.authenticationService.access_token;
        this.defaultSaveImagePath = this.saveVideoFile.imagePath;
        this.imgBoolean1 = this.imgBoolean2 = false;
        this.imgBoolean3 = true;
    }
    changeRadio() {
        this.ownThumbnail = true;
        this.openOwnThumbnail = true;
        this.ownThumb = true;
        this.isThumb = false;
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

// div hide and show methods
    titleDivChange(event: boolean) {
        this.titleDiv = event;
        this.colorControl = this.controlPlayers = this.callaction = false;
    }
    colorControlChange(event: boolean) {
        this.colorControl = event;
        this.titleDiv  = this.controlPlayers = this.callaction = false;
       // this.transperancyControllBar(this.valueRange);
    }
    controlPlayerChange(event: any) {
        this.controlPlayers = event;
        this.colorControl = this.titleDiv = this.callaction = false;
    }
    callToActionChange(event: any) {
        this.callaction = event;
        this.controlPlayers = this.colorControl = this.titleDiv  = false;
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
        if ( this.isFullscreen === true ) {this.embedFullScreen = 'allowfullscreen';}
        else{ this.embedFullScreen = ''; }
    }
    embedVideoSizes() {
        if (this.videosize === this.videoSizes[0]) { this.embedWidth = '1280'; this.embedHeight = '720'; }
        else if (this.videosize === this.videoSizes[1]) { this.embedWidth = '560'; this.embedHeight = '315'; }
        else if (this.videosize === this.videoSizes[2]) { this.embedWidth = '853'; this.embedHeight = '480'; }
        else { this.embedWidth = '640'; this.embedHeight = '360'; }
    }
    embedCode() {
        (<HTMLInputElement>document.getElementById('embed_code')).select();
        document.execCommand('copy');
    }
 // share window popup
    openWindow() {
        window.open('http://localhost:4200/embed-video/' + this.saveVideoFile.viewBy + '/' + this.saveVideoFile.alias,
            'mywindow', 'menubar=1,resizable=1,width=610,height=420');
    }
// normal and 360 video methods
    play360Video() {
    this.is360Value = true;
    $('edit_video_player').empty();
    console.log('Loaded 360 Video');
    $('.h-video').remove();
    $('head').append('<script src="assets/js/indexjscss/360-video-player/video.js" type="text/javascript"  class="p-video"/>');
    $('head').append('<script src="assets/js/indexjscss/360-video-player/three.js" type="text/javascript"  class="p-video" />');
    $('head').append('<link href="assets/js/indexjscss/360-video-player/videojs-panorama.min.css" rel="stylesheet"  class="p-video">');
$('head').append('<script src="assets/js/indexjscss/360-video-player/videojs-panorama.v5.js" type="text/javascript"  class="p-video" />');
    $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"" type="text/javascript"  class="p-video" />');
   const str = '<video id=videoId poster='+this.defaultImagePath +' class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
            $("#newPlayerVideo").append(str);
             this.videoUrl = this.saveVideoFile.videoPath;
             this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
             this.videoUrl = this.videoUrl + '.mp4?access_token=' + this.authenticationService.access_token;
          //   this.videoUrl = 'https://yanwsh.github.io/videojs-panorama/assets/shark.mp4'; // need to commet
             $('#newPlayerVideo video').append('<source src="' + this.videoUrl + '" type="video/mp4">');
            const newValue = this;
            const player = videojs('videoId').ready(function() {
                  this.hotkeys({
                 volumeStep: 0.1, seekStep: 5, enableMute: true,
                 enableFullscreen: false, enableNumbers: false,
                 enableVolumeScroll: true,
                 fullscreenKey: function(event: any, player: any) {
                      return ((event.which === 70) || (event.ctrlKey && event.which === 13));
                 },
                 customKeys: {
                     simpleKey: {
                         key: function(e: any) {  return (e.which === 83);},
                         handler: function(player: any, options: any, e: any) {
                             if (player.paused()) {  player.play();} else { player.pause(); }  } },
                     complexKey: {  key: function(e: any) { return (e.ctrlKey && e.which === 68);},
                         handler: function(player: any, options: any, event: any) {
                             if (options.enableMute) { player.muted(!player.muted()); }}
                     },
                     numbersKey: {
                         key: function(event: any) { return ((event.which > 47 && event.which < 59) ||
                              (event.which > 95 && event.which < 106)); },
                         handler: function(player: any, options: any, event: any) {
                             if (options.enableModifiersForNumbers || !(event.metaKey || event.ctrlKey || event.altKey)) {
                                 var sub = 48;
                                 if (event.which > 95) { sub = 96; }
                                 var number = event.which - sub;
                                 player.currentTime(player.duration() * number * 0.1); }  } },
                     emptyHotkey: { },
                     withoutKey: { handler: function(player: any, options: any, event: any) { console.log('withoutKey handler');}},
                     withoutHandler: { key: function(e: any) { return true;}},
                     malformedKey: { key: function() {  console.log(' The Key function must return a boolean.');},
                         handler: function(player: any, options: any, event: any) { }
                     } }  });
                });
            player.panorama({
                autoMobileOrientation: true,
                clickAndDrag: true,
                clickToToggle: true,
                callback: function () {
                // const isValid = JSON.parse(localStorage.getItem('isOverlayValue'));
                 // player.ready();
                 const isValid = newValue.overLayValue;
                player.ready(function() {
                    if (isValid === 'StartOftheVideo' ) {
                    //  $('#videoId').append( $('#overlay-modal').show());
                    $('.vjs-big-play-button').css('display', 'none');
                    newValue.show360ModalDialog();
                    }
                    else if(isValid !== 'StartOftheVideo' ) {
                      $('#overlay-modal').hide(); player.play(); }
                  //  if (isValid === 'removeCallAction'){ $('#overlay-modal').hide();player.play(); }
                    else { $('#overlay-modal').hide();
                        player.play();
                     }
                      $('#skipOverlay').click(function(){
                         $('#overlay-modal').hide();
                         player.play();
                      });
                      $('#playorsubmit').click(function(){
                         $('#overlay-modal').hide();
                         player.play();
                     });
                 });
                 player.on('ended', function() {
                     if (isValid === 'EndOftheVideo') {
                   //  $('#videoId').append( $('#overlay-modal').show());
                     newValue.show360ModalDialog();
                     $('.video-js .vjs-control-bar').hide();
                    }
                     else if(isValid !== 'EndOftheVideo') {
                        $('#overlay-modal').hide(); player.pause();}
                   //  if (isValid === 'removeCallAction'){$('#overlay-modal').hide(); player.pause();}
                     else { $('#overlay-modal').hide(); player.pause(); }
                      $('#repeatPlay').click(function(){
                        player.play();
                      });
                      $('#skipOverlay').click(function(){
                         $('#overlay-modal').hide();
                         player.pause();
                     //    $('.video-js .vjs-control-bar').hide();
                      });
                      $('#playorsubmit').click(function(){
                         $('#overlay-modal').hide();
                         player.pause();
                     //    $('.video-js .vjs-control-bar').hide();
                     });
                  });
               player.on('click', function(){
               })
              }
              });
            $('#videoId').css('width', 'auto');
            $('#videoId').css('height', '299px');
    }
    // video controller methods
      transperancyControllBar(value: any) {
        const rgba = this.utilService.convertHexToRgba(this.saveVideoFile.controllerColor, value);
        $('.video-js .vjs-control-bar').css('background-color', rgba);
        this.valueRange = value;
        console.log(this.valueRange);
    }
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
        this.transperancyControllBar(this.valueRange);
    }
    changeControllerColor(event: any) {
        console.log('controller color value changed' + event);
        this.saveVideoFile.controllerColor = event;
        $('.video-js .vjs-control-bar').css('background-color', this.saveVideoFile.controllerColor);
        this.transperancyControllBar(this.valueRange);
    }
    changeFullscreen(event: any) {
        this.saveVideoFile.allowFullscreen = event;
        if (this.saveVideoFile.allowFullscreen == false){ $('.video-js .vjs-fullscreen-control').hide();}
        else {$('.video-js .vjs-fullscreen-control').show();}
    }
    allowSharing(event: boolean) {
        console.log('allow sharing ' + event);
        this.shareValues = this.saveVideoFile.allowSharing = event;
    }
    allowEmbedVideo(event: boolean) {
        this.embedVideo = this.saveVideoFile.allowEmbed = event;
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
    is360VideoCheck(event: boolean){
        if (event === true) { this.saveVideoFile.is360video = true;
        this.value360= true}
        else { this.saveVideoFile.is360video = false;
        this.value360 = false}
    }
    // call to action methods
    changeUpperText(upperText: string) {
        this.upperTextValue = this.saveVideoFile.upperText = upperText;
        this.characterleft = this.maxLengthvalue - upperText.length;
    }
    changeLowerText(lowerText: string) {
        this.lowerTextValue = this.saveVideoFile.lowerText = lowerText;
    }
    enableCallToActionMethodTest(event: any) {
       this.enableCalltoAction = this.saveVideoFile.callACtion = event;
        if(event === true && this.saveVideoFile.startOfVideo === true)
           {
              if(this.videoJSplayer){
              // $('#edit_video_player').append(  $('#overlay-modal').show());
                 $('#overLayDialog').append( $('#overlay-modal').show());
               this.videoJSplayer.pause();
              }
              else{
                // $('#videoId').append(  $('#overlay-modal').show());
                   $('#overLayDialog').append( $('#overlay-modal').show());
              }
              this.videoOverlaySubmit = 'PLAY';
              this.isPlay = true;
            }
        else if(event === true && this.saveVideoFile.endOfVideo === true) {
               if(this.videoJSplayer){
                //  $('#edit_video_player').append( $('#overlay-modal').show() );
                   $('#overLayDialog').append( $('#overlay-modal').show());
                  this.videoJSplayer.pause();
                }
                else{
                //  $('#videoId').append( $('#overlay-modal').show() );
                   $('#overLayDialog').append( $('#overlay-modal').show());
                 }
              this.videoOverlaySubmit = 'SUBMIT';
              this.isPlay = false; }
        else { $('#overlay-modal').hide();
              if(this.videoJSplayer){
                this.videoJSplayer.pause();
             }
        }
    }
    skipClose() {
         $('#overlay-modal').hide();
       //  $('.video-js .vjs-control-bar').show();
         if(this.videoJSplayer){
         this.videoJSplayer.play();}
    }
    repeatPlayVideo(){
        $('#overlay-modal').hide();
     //   $('.video-js .vjs-control-bar').show();
        if(this.videoJSplayer){
        this.videoJSplayer.play();}
   }
    checkingCallToActionValues() {
        if (this.isFistNameChecked === true && this.utilService.validateEmail(this.model.email_id)
         && this.firstName.length !== 0 && this.lastName.length !== 0) {
        this.isOverlay = false;
            console.log(this.model.email_id + 'mail ' + this.firstName + ' and last name ' + this.lastName);
        }
        else if (this.isFistNameChecked === false
         && this.utilService.validateEmail(this.model.email_id)) { this.isOverlay = false; }
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
        if (event === true) {
            this.startCalltoAction = this.saveVideoFile.startOfVideo = true;
            this.endCalltoAction = this.saveVideoFile.endOfVideo = false;
            }
        else {
             this.endCalltoAction  =  this.saveVideoFile.endOfVideo = true;
             this.startCalltoAction = this.saveVideoFile.startOfVideo = false;
           }
    }
    endCallToactionOverlay(event: boolean) {
        if (event === true) {
            this.startCalltoAction = this.saveVideoFile.startOfVideo = false;
            this.endCalltoAction = this.saveVideoFile.endOfVideo = true;
         }
        else {
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
        this.videoJSplayer.playlist([{ sources: [{  src: self.videoUrl, type: 'application/x-mpegURL' }]}]);
    }
   videoPlayListSourceMP4() {
        this.videoUrl = this.saveVideoFile.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '.mp4?access_token=' + this.authenticationService.access_token;
        const self = this;
        this.videoJSplayer.playlist([{ sources: [{  src: self.videoUrl, type: 'video/mp4' }]}]);
    }
    // default methods when component initilized
    defaultImagePaths() {
        if (this.saveVideoFile.imagePath === this.imageValue1) {
        this.imgBoolean1 = true; this.imgBoolean2 = this.imgBoolean3 = false; }
        else if (this.saveVideoFile.imagePath === this.imageValue2) {
        this.imgBoolean2 = true; this.imgBoolean1 = this.imgBoolean3 = false; }
        else { this.imgBoolean3 = true; this.imgBoolean1 = this.imgBoolean2 = false; }
    }
    defaultGifPaths() {
        if (this.saveVideoFile.gifImagePath === this.gifValue1) { this.gifBoolean1 = true; this.gifBoolean2 = this.gifBoolean3 = false; }
        else if (this.saveVideoFile.gifImagePath === this.gifValue2) {
             this.gifBoolean2 = true; this.gifBoolean1 = this.gifBoolean3 = false; }
        else { this.gifBoolean3 = true; this.gifBoolean1 = this.gifBoolean2 = false; }
    }
    defaultValues(){
        this.likes = this.saveVideoFile.allowLikes;
        this.comments = this.saveVideoFile.allowComments;
        this.shareValues = this.saveVideoFile.allowSharing;
        this.embedVideo = this.saveVideoFile.allowEmbed;
        this.valueRange = this.saveVideoFile.transparency;
        this.isFistNameChecked = this.saveVideoFile.name;
        this.isSkipChecked = this.saveVideoFile.skip;
    }
    defaultVideoSettings() {
        console.log('default settings called');
        $('.video-js').css('color', this.saveVideoFile.playerColor);
        $('.video-js .vjs-play-progress').css('background-color', this.saveVideoFile.playerColor);
        $('.video-js .vjs-volume-level').css('background-color', this.saveVideoFile.playerColor);
        $('.video-js .vjs-control-bar').css('background-color', this.saveVideoFile.controllerColor);
        if (this.saveVideoFile.allowFullscreen === false) {
           $('.video-js .vjs-fullscreen-control').hide();
        }
        else { 	$('.video-js .vjs-fullscreen-control').show();
        }
    }
    showEditModalDialog(){
      $('#overLayDialog').append( $('#overlay-modal').show());
      // $('#edit_video_player').append( $('#overlay-modal').show());
    }
    show360ModalDialog(){
     $('#overLayDialog').append( $('#overlay-modal').show());
    // $('#videoId').append( $('#overlay-modal').show());
   }
   embedSourcePath(alias: string, viewBy: string){
    this.embedSrcPath = document.location.href;
    this.embedSrcPath = this.embedSrcPath.substring(0, this.embedSrcPath.lastIndexOf('#')) + '#/embedVideo' + viewBy + alias;
    console.log(this.embedSrcPath);
    }
    ngOnInit() {
        $('#overlay-modal').hide();
        console.log('EditVideoComponent ngOnit: ');
        this.categories = this.referenceService.refcategories;
        console.log(this.saveVideoFile);
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

        if (this.videoFileService.actionValue === 'Save' && this.saveVideoFile.playerColor === 'FFFFFF'
         && this.saveVideoFile.controllerColor === 'FFFFFF') {
            this.compPlayerColor = '#f5f5f5';
            this.saveVideoFile.playerColor = this.compPlayerColor;
            this.compControllerColor = '#2f2f2f';
            this.saveVideoFile.controllerColor = this.compControllerColor;
        }
        else {
            this.compPlayerColor = this.saveVideoFile.playerColor;
            this.compControllerColor = this.saveVideoFile.controllerColor;
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
        try {
        this.buildForm();
        this.defaultValues();
        this.defaultImagePaths();
        this.defaultGifPaths();
        this.embedSourcePath(this.saveVideoFile.alias, this.saveVideoFile.viewBy);
        }
        catch (err) {
            console.log('error' + err);
        }
    }
    ngAfterViewInit() {
        $('#edit_video_player').empty();
        $('#newPlayerVideo').empty();
      if(this.saveVideoFile.is360video !== true) {
        $('.p-video').remove();
        $('head').append('<link href="assets/js/indexjscss/video-hls-player/video-hls-js.css" class="h-video" rel="stylesheet">');
        $('head').append('<script src="assets/js/indexjscss/video-hls-player/video-hls.js" type="text/javascript" class="h-video"  />');
       $('head').append('<script src="assets/js/indexjscss/video-hls-player/videojs.hls.min.js" type="text/javascript"  class="h-video"/>');
        $('head').append('<script src="assets/js/indexjscss/videojs-playlist.js" type="text/javascript"  class="h-video" />');
        $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"" type="text/javascript"  class="h-video" />');
        this.is360Value = false;
        const callactionValue = this;
        this.videoJSplayer = videojs(document.getElementById('edit_video_player'), {}, function() {
             const player = this;
           //  const isValid = JSON.parse(localStorage.getItem('isOverlayValue'));
             const isValid = callactionValue.overLayValue;
             console.log(isValid);
             this.ready(function() {
                 if (isValid === 'StartOftheVideo' ) {
                      $('.vjs-big-play-button').css('display', 'none');
                      callactionValue.showEditModalDialog();
                   //   $('#edit_video_player').append( $('#overlay-modal').show());
                    }
                 else if(isValid !== 'StartOftheVideo' ) {
                      $('.vjs-big-play-button').css('display', 'none');
                      $('#overlay-modal').hide(); player.play(); }
                // if (isValid === 'removeCallAction'){ $('#overlay-modal').hide(); }
                 else { $('#overlay-modal').hide(); }
                     $('#skipOverlay').click(function(){
                       $('#overlay-modal').hide();
                       player.play();
                    });
                    $('#playorsubmit').click(function(){
                       $('#overlay-modal').hide();
                       player.play();
                    });
                  });
             this.on('ended', function() {
                 if (isValid === 'EndOftheVideo') {
                     $('.vjs-big-play-button').css('display', 'none');
                   //  $('#edit_video_player').append( $('#overlay-modal').show());
                     callactionValue.showEditModalDialog();
                }
                 else if(isValid !== 'EndOftheVideo') {
                      $('.vjs-big-play-button').css('display', 'none');
                      $('#overlay-modal').hide(); player.pause();}
               /*  if (isValid === 'removeCallAction'){ 
                      $('.vjs-big-play-button').css('display', 'none');
                      $('#overlay-modal').hide(); player.pause();} */
                 else { $('#overlay-modal').hide(); player.pause(); }
                    $('#repeatPlay').click(function(){
                       player.play();
                    });
                     $('#skipOverlay').click(function(){
                       $('#overlay-modal').hide();
                    });
                    $('#playorsubmit').click(function(){
                       $('#overlay-modal').hide();
                    });
             });
             this.on('contextmenu', function(e) {
                 e.preventDefault();
             });
             this.hotkeys({
                 volumeStep: 0.1, seekStep: 5, enableMute: true,
                 enableFullscreen: false, enableNumbers: false,
                 enableVolumeScroll: true,
                 fullscreenKey: function(event: any, player: any) {
                      return ((event.which === 70) || (event.ctrlKey && event.which === 13));
                 },
                 customKeys: {
                     simpleKey: {
                         key: function(e: any) {  return (e.which === 83);},
                         handler: function(player: any, options: any, e: any) {
                             if (player.paused()) {  player.play();} else { player.pause(); }  } },
                     complexKey: {  key: function(e: any) { return (e.ctrlKey && e.which === 68);},
                         handler: function(player: any, options: any, event: any) {
                             if (options.enableMute) { player.muted(!player.muted()); }}
                     },
                     numbersKey: {
                         key: function(event: any) { return ((event.which > 47 && event.which < 59) ||
                              (event.which > 95 && event.which < 106)); },
                         handler: function(player: any, options: any, event: any) {
                             if (options.enableModifiersForNumbers || !(event.metaKey || event.ctrlKey || event.altKey)) {
                                 var sub = 48;
                                 if (event.which > 95) { sub = 96; }
                                 var number = event.which - sub;
                                 player.currentTime(player.duration() * number * 0.1); }  } },
                     emptyHotkey: { },
                     withoutKey: { handler: function(player: any, options: any, event: any) { console.log('withoutKey handler');}},
                     withoutHandler: { key: function(e: any) { return true;}},
                     malformedKey: { key: function() {  console.log(' The Key function must return a boolean.');},
                         handler: function(player: any, options: any, event: any) { }
                     } }  }); });
     if (this.videoFileService.actionValue === 'Save') {
          this.videoPlayListSourceMP4();
         }
     else {
          this.videoPlayListSourceM3U8();
     }
 } // if condition closed
    else{                       // playing 360 video
        this.play360Video();
    }
     this.defaultVideoSettings();
     this.transperancyControllBar(this.valueRange);
     if (this.saveVideoFile.enableVideoController === false)
      { this.defaultVideoControllers();}
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
            'is360video': [this.saveVideoFile.is360video],
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
            'maxlength': 'Title cannot be more than 24 characters long.',
        },
        'viewBy': { 'required': 'Publish is required' },
        'category': {  'required': 'Category is required'  },
        'tags': {   'required': 'Tag is required'  },
        'imageFile': {  'required': 'Image file is required'  },
        'gifImagePath': { 'required': 'Gif is required'  },
        'description': { 'required': 'Description is required',
            'minlength': 'Title must be at least 5 characters long.' },
        'upperText': {  'required': 'upper text is required', },
        'lowerText': { 'required': 'lower text is required', },
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
                if (this.videoFileService.actionValue === 'Save') {
                    this.newTags[i] = tags[i]['value'];
                }
                else {
                    let tag = tags[i];
                    if (tag['value'] !== undefined) {
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
            this.saveVideoFile.is360video = this.value360;

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
                    if (this.saveVideoFile != null) { this.saveVideoFile = result;
                        this.notifyParent.emit(this.saveVideoFile); }
                    else {
                        console.log('save video data object is null please try again:' + this.saveVideoFile);
                        swal('ERROR', this.saveVideoFile.error, 'error');
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
     /*  $('#overlay-modal').hide();
        if(this.videoOverlaySubmit === 'PLAY'){
            this.videoJSplayer.play();
        }
        else {
             this.videoJSplayer.pause();
        } */
         console.log(this.model.email_id);
        if (this.userService.loggedInUserData.emailId === this.model.email_id) {
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
            .subscribe( (result: any) => { console.log('Save user Form call to acton is successfull' +result);},
            (error: string) => {// this.referenceService.showError(error, "save call to action user","Edit Video Component")
             } );
        }
    cancelVideo() {
        console.log('EditVideoComponent : cancelVideo() ');
        this.videoFileService.showSave = false;
        this.videoFileService.showUpadte = false;
        this.notifyParent.emit(null);
    }
    ngOnDestroy() {
        console.log('Deinit - Destroyed Component');
      if( this.is360Value !== true){
          this.videoJSplayer.dispose();
       }
       else if(this.videoJSplayer){
            this.videoJSplayer.dispose();
       }
       else { 
        }
        this.videoFileService.actionValue = ''; // need to change to empty
      //  localStorage.removeItem('isOverlayValue');
          $('.h-video').remove();
          $('.p-video').remove();
      }

   }
