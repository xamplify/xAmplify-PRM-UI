import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileItem } from 'ng2-file-upload';

import { AuthenticationService } from '../../core/services/authentication.service';
import { UploadCloudvideoService } from '../services/upload-cloudvideo.service';
import { VideoFileService } from '../services/video-file.service';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Ng2DeviceService } from 'ng2-device-detector';
import { VideoUtilService } from '../services/video-util.service';
import { SaveVideoFile } from '../models/save-video-file';
import { HomeComponent } from '../../core/home/home.component';

import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { EmailTemplateService } from 'app/email-template/services/email-template.service';
import { CloudContent } from '../models/cloudcontent';

declare var Dropbox, swal, google, QuickSidebar, gapi, downloadFromDropbox, BoxSelect, downloadFromGDrive: any;
declare var $, videojs: any;

@Component({
    selector: 'app-upload-video',
    templateUrl: './upload-video.component.html',
    styleUrls: ['./upload-video.component.css', '../../../assets/css/video-css/video-js.custom.css'],
    providers: [HomeComponent, Properties]
})
export class UploadVideoComponent implements OnInit, OnDestroy {

    processVideoResp: SaveVideoFile;
    URL = this.authenticationService.REST_URL + 'videos/upload-video?userId=' + this.authenticationService.user.id + '&access_token=';
    uploader: FileUploader;
    hasBaseDropZoneOver = false;
    videoPreviewPath: SafeUrl;
    loading: boolean;
    processing: boolean;
    isChecked: boolean;
    isFileDrop: boolean;
    isFileProgress: boolean;
    tempr: any;
    pickerApiLoaded = false;
    cloudDropbox: boolean;
    cloudBox: boolean;
    cloudDrive: boolean;
    camera: boolean;
    cloudOneDrive: boolean;
    isDisable: boolean;
    checkSpeedValue = false;
    redirectPge = false;
    redirectContent = false;
    player: any;
    playerInit = false;
    recordedVideo: any;
    RecordSave = false;
    rageDisabled = false;
    saveVideo: boolean;
    discardVideo: boolean;
    closeModalId: boolean;
    testSpeeddisabled: boolean;
    testSpeedshow: boolean;
    stopButtonDisabled: boolean;
    stopButtonShow: boolean;
    textAreaValue = '';
    changeVolume = 1;
    textAreaDisable: boolean;
    hideSaveDiscard: boolean;
    maxTimeDuration: number;
    sweetAlertDisabled: boolean;
    sweetAlertMesg: string;
    MultipleVideo = false;
    maxVideoSize: number;
    isSelectedVideo = false;
    deviceNotSupported = false;
    deviceInfo = null;
    browserInfo: string;
    videoDisabled = false;
    previewDisabled = false;
    errorIsThere = false;
    maxSizeOver = false;
    cloudStorageSelected = false;
    picker: any;
    uploadeRecordVideo = false;
    isProgressBar = false;
    failedtoUpload = false;
    customResponse: CustomResponse = new CustomResponse();
    recordCustomResponse: CustomResponse = new CustomResponse();
    loggedInUserId:any;
    contentProcessing:boolean;
    cloudContentArr = new Array<CloudContent>();
    videoRecordTimeLess = false;
    videoExtentions =  ['video/m4v', 'video/avi', 'video/mpg', 'video/mp4', 'video/flv', 'video/mov', 'video/wmv', 'video/divx', 'video/f4v', 'video/mpeg', 'video/vob', 'video/xvid', 'video/x-matroska'];

    constructor(public router: Router, public xtremandLogger: XtremandLogger, public authenticationService: AuthenticationService,
        public changeDetectorRef: ChangeDetectorRef, public videoFileService: VideoFileService, public homeComponent: HomeComponent,
        public cloudUploadService: UploadCloudvideoService, public sanitizer: DomSanitizer, public refService: ReferenceService,
        public deviceService: Ng2DeviceService, public videoUtilService: VideoUtilService, public properties: Properties, public emailTemplateService: EmailTemplateService) {
        try {
            this.loggedInUserId = this.authenticationService.getUserId();
            this.deviceInfo = this.deviceService.getDeviceInfo();
            this.browserInfo = this.deviceInfo.browser;
            console.log(this.browserInfo);
            this.isChecked = false;
            this.isDisable = false;
            this.isFileDrop = false;
            this.loading = false;
            this.saveVideo = false;
            this.discardVideo = false;
            this.closeModalId = true;
            this.testSpeedshow = true;
            this.testSpeeddisabled = true;
            this.hideSaveDiscard = true;
            this.isFileProgress = false;
            this.textAreaDisable = true;
            this.maxTimeDuration = 3400; // record video time
            this.maxVideoSize = 800; // upload video size in MB's
            if(this.videoFileService.videoFileSweetAlertMessage){
              swal('Other than video files can be uploaded');
              this.videoFileService.videoFileSweetAlertMessage = false;
            }
          //  $('.addfiles').attr('style', 'float: left; margin-right: 9px;cursor:not-allowed; opacity:1');
            this.uploader = new FileUploader({
                // allowedMimeType: ['video/m4v', 'video/x-flv','video/x-msvideo', 'video/avi', 'video/msvideo','video/mpg', 'video/mp4', 'video/quicktime',
                //     'video/x-ms-wmv', 'video/divx', 'video/x-f4v', 'video/x-matroska', 'video/x-flv', 'video/dvd', 'video/mpeg', 'video/xvid'],

                maxFileSize: this.maxVideoSize * 1024 * 1024, // 800 MB
                url: this.URL + this.authenticationService.access_token
            });
            this.uploader.onAfterAddingFile = (fileItem) => {
                try{
                this.customResponse = new CustomResponse();
                fileItem.withCredentials = false;
             //   $('.addfiles').attr('style', 'float: left; margin-right: 9px;cursor:not-allowed; opacity:0.6');
                console.log(fileItem._file);
                const isSupportfile = fileItem._file.type.toString();
                this.checkMimeTypes(isSupportfile);
                this.videoPreviewPath = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
                this.defaultDesabled();
                console.log(fileItem._file.size);
                } catch(error) { this.xtremandLogger.log(error); }
            };
            this.uploader.onProgressItem = (fileItem: FileItem, progress: any) => {
                this.loading = true;
                this.isFileProgress = true;
                this.isFileDrop = true;
                this.isProgressBar = true;
            };
            this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                this.loading = true;
                this.isProgressBar = false;
                if (response.includes('No space left on device')) {
                    this.customResponse = new CustomResponse( 'ERROR', this.videoUtilService.noSpaceMesg, true );
                    this.setTimoutMethod();
                } else {
                	if(JSON.parse(response).access){
                		this.processVideo(JSON.parse(response).data);
                		}
                		else{
                		this.authenticationService.forceToLogout();
                		}
                	
                    }
              };
              $('head').append('<link href="assets/js/indexjscss/webcam-capture/nvideojs.record.css" rel="stylesheet"  class="r-video">');
              $('head').append('<script src="https://apis.google.com/js/api.js" type="text/javascript"  class="r-video"/>');
              $('head').append('<script src="assets/js/indexjscss/select.js" type="text/javascript"  class="r-video"/>');
              $('head').append('<script src="assets/js/indexjscss/video-hls-player/video6.4.0.js" type="text/javascript"  class="r-video"/>');
              $('head').append('<link href="assets/js/indexjscss/webcam-capture/video-js.css" rel="stylesheet">');
              $('head').append('<script src="assets/js/indexjscss/webcam-capture/nvideojs.record.js" type="text/javascript"  class="r-video"/>');

              if (this.refService.isEnabledCamera === false && !this.isIE() && !this.browserInfo.includes('safari') &&
                !this.browserInfo.includes('edge')) {
                //    this.checkCameraBlock();
                this.refService.isEnabledCamera = true;
              } else if (this.isIE() || this.browserInfo.includes('safari') || this.browserInfo.includes('edge')) {
                this.refService.cameraIsthere = true;
             }
        } catch (err) {
            console.error('ERROR : FileUploadComponent constructor ' + err);
        }
    }
    isIE() {
        const isInternetExplorar = navigator.userAgent;
        /* MSIE used to detect old browsers and Trident used to newer ones*/
        const is_ie = isInternetExplorar.indexOf("MSIE ") > -1 || isInternetExplorar.indexOf("Trident/") > -1;
        return is_ie;
    }

    checkMimeTypes(isSupportfile: string) {
        if (isSupportfile === 'video/mp4' || (this.browserInfo.includes('chrome') && (isSupportfile === 'video/mpeg'))) {
            this.setVideoPreviewTypes(false, true);
        } else if (this.browserInfo.includes('firefox') && (isSupportfile === 'video/mov')) {
            this.setVideoPreviewTypes(false, true);
        } else {  this.setVideoPreviewTypes(true, false); }
    }
    setVideoPreviewTypes(videodisable: boolean, previewdisable: boolean) {
         this.videoDisabled = videodisable;
         this.previewDisabled = previewdisable;
    }
    processVideo(responsePath: any) {
        try{
        if (!this.videoFileService.isProgressBar) { this.cloudStorageDisabled(); }
        const val = this;
        if (this.RecordSave !== true) {  setTimeout(function () {  val.processing = true; }, 100); }
        console.log(responsePath);
        return this.videoFileService.processVideoFile(responsePath)
            .subscribe((result: any) => {
                this.processVideoResp = result;
                console.log(result);
                this.loading = false;
                this.processing = false;
                this.cloudStorageSelected = false;
                this.uploadeRecordVideo = false;
                if (this.processVideoResp != null && this.processVideoResp.error === null) {
                    console.log('process video data :' + JSON.stringify(this.processVideoResp));
                    this.videoFileService.saveVideoFile = this.processVideoResp;
                    if (this.videoFileService.saveVideoFile.imageFiles == null) {
                        this.videoFileService.saveVideoFile.imageFiles = [];
                    }
                    if (this.videoFileService.saveVideoFile.gifFiles == null) {
                        this.videoFileService.saveVideoFile.gifFiles = [];
                    }
                    this.videoFileService.actionValue = 'Save';
                    this.refService.selectedVideoLogo = this.processVideoResp.brandingLogoUri;
                    this.refService.selectedVideoLogodesc = this.processVideoResp.brandingLogoDescUri;
                    console.log(this.videoFileService.actionValue);
                    if (this.redirectPge === false) {
                      //  this.router.navigateByUrl('/home/videos/manage');
                        this.router.navigate(['/home/content/videos']);
                    } else if (this.playerInit === false) {
                        this.videoFileService.actionValue = '';
                        this.videoFileService.isProgressBar = false;
                      //  $('.addfiles').attr('style', 'float: left; margin-right: 9px;cursor:not-allowed; opacity:1');
                    } else {
                        this.videoFileService.actionValue = '';
                        this.videoFileService.isProgressBar = false;
                       // $('.addfiles').attr('style', 'float: left; margin-right: 9px;cursor:not-allowed; opacity:1');
                    }
                } else {   // Maximum Disk Space Reached for you subscription
                    if (this.processVideoResp.error.includes('maximum upload')) {
                        this.processing = false;
                        this.defaultSettings();
                        this.customResponse = new CustomResponse( 'ERROR', this.videoUtilService.maxSubscriptionMesg, true );
                        this.setTimoutMethod();
                    } else if (this.processVideoResp.error.includes('Codec is not supported')) {
                        this.customResponse = new CustomResponse( 'ERROR', this.videoUtilService.codecNotSupportMesg, true );
                        this.setTimoutMethod();
                    } else if (this.processVideoResp.error.includes('No space left on device')){
                        this.customResponse = new CustomResponse( 'ERROR', this.videoUtilService.noSpaceMesg, true );
                        this.setTimoutMethod();
                    } else {
                        this.customResponse = new CustomResponse( 'ERROR', this.videoUtilService.errorNullMesg, true );
                        console.log('process video data object is null please try again:');
                        if (this.RecordSave === true && this.player) {
                            this.player.record().reset();
                            this.modalPopupClosed();
                        }
                        console.log(this.processVideoResp.error);
                    }
                }
            },(error: any) => {
                this.modalPopupClosed();
                this.errorIsThere = true;
                this.xtremandLogger.errorPage(error);
            }),
            () => console.log('process video is:' + this.processVideoResp);
        }catch(error) { this.xtremandLogger.error('Error in upload video, process video method'+error);}
    }
    modalPopupClosed() {
        $('#myModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop fade in').remove();
    }
    checkVideoMimeTypes(type:any){ if(this.videoExtentions.includes(type.type) || (this.isVideo(type.name))){ return true} return false; }
    fileSizeCheck(event: any) {
       try{
        const fileList: FileList = event.target.files;
        console.log(fileList[0].type);
        if (fileList.length > 0 && (fileList[0].type.includes('video')|| this.checkVideoMimeTypes(fileList[0]))) {
            const isSizeExceded: any = fileList[0].size;
            const size = isSizeExceded / (1024 * 1024);
            this.maxSizeOver = size > this.maxVideoSize ? true : false;
            if(this.maxSizeOver){ this.customResponse = new CustomResponse( 'ERROR',this.videoUtilService.maxSizeOverMesg, true );}
        } else{
          this.customResponse = new CustomResponse( 'ERROR',this.videoUtilService.fileTypeMessage, true );
          this.defaultSettings();
        }
     }catch(error) { this.xtremandLogger.error('Error in upload video, fileSizeCheck method'+error);}
    }
    public fileOverBase(e: any): void {
        if (this.isFileDrop === false && this.isFileProgress === false) {
            this.hasBaseDropZoneOver = e;
        } else {
            this.hasBaseDropZoneOver = false;
        }
    }
    setTimoutMethod() {
        this.uploader.queue.length = 0;
        setTimeout( () => { this.maxSizeOver = false;  this.router.navigate(['./home/content']);}, 5000);
    }
    fileDropPreview(file: File): void {
        if (this.isFileDrop === false) {
            console.log(file);
        } else {
            this.isFileDrop = true;
            file = null;
            console.log('drop file will not work in progress');
        }
    }
    fileDropDisabled() {
        // this.isChecked =true;
        this.isFileDrop = true;
    }
    fileDropEnabled() {
        this.isChecked = false;
        this.isFileDrop = false;
    }
    removefileUploadVideo() {
        this.uploader.queue.length = 0;
        this.defaultSettings();
        this.isChecked = false;
        this.isDisable = false;
    }
    recordVideo() {
        $('#script-text').val('');
        $('#myModal').modal('show');
    }
    recordModalPopupAfterUpload() {
        this.modalPopupClosed();
        this.closeRecordPopup();
        this.cloudStorageDisabled();
        this.processing = true;
    }
    uploadRecordedVideo() {
     if(this.player.record().getDuration() < 10) {
       this.videoRecordTimeLess = true;
       this.recordCustomResponse = new CustomResponse( 'ERROR', 'Record Video length must be greater than 10 seconds', true );
      } else {
       this.videoRecordTimeLess = false;
      try{
        this.RecordSave = true;
        this.saveVideo = false;
        this.discardVideo = false;
        this.testSpeeddisabled = true;
        this.closeModalId = false;
        this.uploadeRecordVideo = true;
        this.textAreaDisable = false; // not using ,need to check
        this.hideSaveDiscard = false; // hide the save and discard buttons when the video processing
        (<HTMLInputElement>document.getElementById('script-text')).disabled = true;
        (<HTMLInputElement>document.getElementById('rangeDisabled')).disabled = true;
        $('.video-js .vjs-control-bar').hide();
        this.recordModalPopupAfterUpload();
        const formData = new FormData();
        const object = this.recordedVideo;
        console.log(this.recordedVideo);
        formData.append('file', object);
        // if (navigator.userAgent.indexOf('Chrome') !== -1) {
        //     formData.append('file', object);
        // } else {
        //     formData.append('file', object);
        // }
        console.log(formData);
        return this.videoFileService.saveRecordedVideo(formData)
            .subscribe((result: any) => {
                if (result.access) {
                    this.processVideo(result.data);
                } else {
                    this.authenticationService.forceToLogout();
            	}
             }, (error: any) => {
                this.errorIsThere = true;
                this.xtremandLogger.errorPage(error);
             } );
       }catch(error) { this.xtremandLogger.error('Error in upload video, uploadRecordedVideo method'+error);}
       }
    }
    removeRecordVideo() {
       try{
        this.player.record().stopDevice();
        this.player.record().getDevice();
        // this.player.record().reset();
        this.saveVideo = false;
        this.discardVideo = false;
        this.hideSaveDiscard = true;
        $('.video-js .vjs-fullscreen-control').hide();
      }catch(error) { this.xtremandLogger.error('Error in upload video, removeRecordVideo method'+error);}
    }
    closeRecordPopup() {
      try{
       $('#myModal').modal('hide');
        this.defaultSettings();
        this.stop();
        this.isFileDrop = false;
        // this.player.record().stopDevice();
        this.player.record().reset();
        this.saveVideo = false;
        this.discardVideo = false;
        this.playerInit = true;
        // this.router.navigate(['./home/videos']);
      }catch(error) { this.xtremandLogger.error('Error in upload video, closeRecordPopup method'+error);}
    }
    trimVideoTitle(title: string) {
      try{
      if (title.length > 30) {
            const fileTitleStart = title.substr(0, 25);
            const fileTitleend = title.slice(-5);
            return fileTitleStart + '...' + fileTitleend;
        } else {
            return title;
        }
      }catch(error) { this.xtremandLogger.error('Error in upload video, trimVideoTitle method'+error);}

    }
    textAreaEmpty() {
        if (this.textAreaValue !== '') { this.testSpeeddisabled = false; }
    }
    stop() {
        this.stopButtonShow = false; // hide the stop button
        this.testSpeedshow = true; // show the test speed button
        this.rageDisabled = false;
        $('#script-text').stop(true);
    }
    testSpeed() {
        const self = this;
        $('#script-text').stop(true);
        $('#script-text').scrollTop(0);
        if ($('#script-text').val() === '') {
            // swal("Please Add your script and Test it back");
        } else {
            this.stopButtonShow = true; // stop button show
            this.stopButtonDisabled = false;
            this.testSpeedshow = false; // hide the test speed button
            this.rageDisabled = true;
            this.checkSpeedValue = true;
            const volume = this.changeVolume * 60000;
            $('#script-text').animate({ scrollTop: $('#script-text').prop('scrollHeight') },
                {
                    duration: volume,
                    complete: function () {
                        self.stop();
                    }
                });
        }
    }
    checkCameraBlock() {
        const recordBlocked = this;
        navigator.getUserMedia(
            {   // we would like to use video but not audio
                video: true,
                audio: true
            },
            function (stream) {
                const localStream = stream;
                const track = stream.getTracks()[0];
                track.stop();
                localStream.getVideoTracks()[0].stop();
                recordBlocked.refService.cameraIsthere = true;
            },
            function () {
                recordBlocked.refService.cameraIsthere = false;
                console.log('user did not give access to the camera');
            }
        );
    }
    cameraChange() {
        // if (!this.refService.cameraIsthere) {
        //     this.deviceNotSupported = true;
        //     swal('Oops...',
        //         'No permission to access the camera, please enable the camera and refresh the page once you enable it!',
        //         'error');
        // }
        if(this.isIE() || this.browserInfo.includes('edge') ){
          swal('Oops...',  'This Cam won\'t work in Internet explorar and edge browser!', 'error');
         }
        else {
        if (this.isChecked !== true && this.cloudDrive === false && this.cloudDropbox === false &&
            this.cloudOneDrive === false && this.cloudBox === false) {
            this.camera = true;
            this.isDisable = true;
            this.isFileDrop = true;
            this.isChecked = true;
            this.fileDropDisabled();
            this.recordVideo();
            this.playerInit = true;
            $('.dropBox').attr('style', 'cursor:not-allowed; opacity:0.5');
            $('.googleDrive').attr('style', 'cursor:not-allowed; opacity:0.5');
            $('.box').attr('style', 'cursor:not-allowed; opacity:0.5');
            $('.oneDrive').attr('style', 'cursor:not-allowed; opacity:0.5');
            $('.vjs-volume-panel .vjs-control .vjs-volume-panel-horizontal').attr('style', 'display:none');
            $('.vjs-volume-panel-horizontal').attr('style', 'display:none');
            $('.vjs-volume-panel .vjs-control .vjs-volume-panel-horizontal').css('cssText', 'display:none !important');

            const self = this;
            self.player = videojs('myVideo',
                {
                    controls: true,
                    loop: false,
                    width: 676,
                    height: 360,
                    plugins: {
                        record: {
                            maxLength: self.maxTimeDuration,
                            debug: true,
                            audio: true,
                            video: {
                                // video constraints: set resolution of camera
                                mandatory: {
                                    minWidth: 640,
                                    minHeight: 360,
                                },
                            },
                            // dimensions of captured video frames
                            frameWidth: 640,
                            frameHeight: 360
                        }
                    },
                    controlBar: {
                        // hide volume and fullscreen controls
                        volumeMenuButton: false
                    }
                });
            self.player.on('deviceError', function () {
                console.log('device error:', this.player.deviceErrorCode);
            });
            self.player.on('deviceReady', function () {
                self.saveVideo = false;
                self.discardVideo = false;
                $('.video-js .vjs-fullscreen-control').hide();
                console.log('device error:', this.player.deviceErrorCode);
            });
            self.player.on('error', function (error: any) {
                console.log('error:', error);
            });
            // user clicked the record button and started recording
            self.player.on('startRecord', function () {
                console.log('started recording!');
                self.closeModalId = false; // close button disabled for modal pop up
                $('#script-text').scrollTop(0);
                self.stopButtonShow = false; // stop button hide in modal pop up
                self.stopButtonDisabled = true; // stop button disabled in modal pop up
                self.testSpeedshow = true; // show the test speed button
                self.testSpeeddisabled = true; // test speed button disabled
                self.testSpeed();
                self.rageDisabled = true;
                console.log('started recording!');
                self.saveVideo = false; // save button disabled
                self.discardVideo = false; // discard button disabled
            });
            // user completed recording and stream is available
            self.player.on('finishRecord', function () {
                self.saveVideo = true; // save button enabled
                self.discardVideo = true; // discard button enabled
                self.testSpeeddisabled = false; // enabled the test speed button
                self.closeModalId = true; // close button enabled
                $('.video-js .vjs-fullscreen-control').show();
                $('.vjs-volume-panel-horizontal').attr('style', 'display:none');
                $('.vjs-volume-panel .vjs-control .vjs-volume-panel-horizontal').css('cssText', 'display:none !important');
                self.stop();
                self.rageDisabled = false;
                console.log('finished recording: ', self.player.recordedData);
                self.recordedVideo = self.player.recordedData;
            });
        }
      }
    }
    dropBoxChange() {
      try{
      if (this.isChecked === true && this.processing !== true && this.sweetAlertDisabled === false &&
            this.sweetAlertMesg === 'DropBox') { swal('Oops...', 'You minimized DropBox window!', 'error'); }
        if (this.isChecked !== true && this.cloudDrive === false && this.camera === false && this.cloudOneDrive === false &&
            this.cloudBox === false) {
            this.cloudDropbox = true;
            this.isDisable = true;
            this.isFileDrop = true;
            this.isChecked = true;
            this.sweetAlertDisabled = false;
            this.sweetAlertMesg = 'DropBox';
            this.fileDropDisabled();
            this.downloadFromDropbox();
            $('.camera').attr('style', 'cursor:not-allowed; opacity:0.5');
            $('.googleDrive').attr('style', 'cursor:not-allowed; opacity:0.5');
            $('.box').attr('style', 'cursor:not-allowed; opacity:0.5');
            $('.oneDrive').attr('style', 'cursor:not-allowed; opacity:0.5');
           // $('.addfiles').attr('style', 'float: left; margin-right: 9px;cursor:not-allowed; opacity:0.6');
          }
        } catch(error){this.xtremandLogger.error('Error in upload video dropBoxChange method'+error);}
    }
    boxChange() {
      try{
        if (this.isChecked === true && this.processing !== true && this.sweetAlertDisabled === false &&
            this.sweetAlertMesg === 'Box') { swal('Oops...', 'You minimized Box window!', 'error'); }
        if (this.isChecked !== true && this.cloudDrive === false && this.camera === false && this.cloudOneDrive === false &&
            this.cloudDropbox === false) {
            this.cloudBox = true;
            this.isDisable = true;
            this.isFileDrop = true;
            this.isChecked = true;
            this.sweetAlertDisabled = false;
            this.sweetAlertMesg = 'Box';
            this.fileDropDisabled();
            this.downloadFrombox();
            this.cloudOneDrive = true;
            this.cloudDrive = true;
            $('.googleDrive').attr('style', 'cursor:not-allowed; opacity:0.5');
            $('.dropBox').attr('style', 'cursor:not-allowed; opacity:0.5');
            $('.camera').attr('style', 'cursor:not-allowed; opacity:0.5');
            $('.oneDrive').attr('style', 'cursor:not-allowed; opacity:0.5');
          //  $('.addfiles').attr('style', 'float: left; margin-right: 9px;cursor:not-allowed; opacity:0.6');
        }
      } catch(error){this.xtremandLogger.error('Error in upload video box method'+error);}
    }
    googleDriveChange() {
      try{
      this.sweetAlertMesg = 'Drive';
        if(this.uploader.queue.length === 0){
        this.onApiLoad();    // google drive code
        }
      } catch(error){this.xtremandLogger.error('Error in upload video googleDriveChange method'+error);}
    }
    defaultDesabled() {
        this.sweetAlertDisabled = true;
        this.isChecked = true;
        this.isSelectedVideo = true;
        $('.googleDrive').attr('style', 'cursor:not-allowed; opacity:0.5');
        $('.box').attr('style', 'cursor:not-allowed; opacity:0.5');
        $('.dropBox').attr('style', 'cursor:not-allowed; opacity:0.5');
        $('.camera').attr('style', 'cursor:not-allowed; opacity:0.5');
        $('.oneDrive').attr('style', 'cursor:not-allowed; opacity:0.5');
    }
    cloudStorageDisabled() {
       // $('.addfiles').attr('style', 'float: left; margin-right: 9px;cursor:not-allowed; opacity:0.6');
        this.defaultDesabled();
    }
    defaultSettings() {
        this.uploader.queue.length = 0;
        this.cloudDropbox = false;
        this.cloudBox = false;
        this.cloudDrive = false;
        this.camera = false;
        this.cloudOneDrive = false;
        this.isChecked = false;
        this.isFileDrop = false;
        this.isDisable = false;
        this.isSelectedVideo = false;
        this.hideSaveDiscard = true;
        this.isFileProgress = false;
        this.sweetAlertDisabled = false;
        $('.dropBox').attr('style', 'cursor:pointer; opacity:0.7');
        $('.googleDrive').attr('style', 'cursor:pointer; opacity:0.7');
        $('.box').attr('style', 'cursor:pointer; opacity:0.7');
        $('.camera').attr('style', 'cursor:pointer; opacity:0.7');
        $('.oneDrive').attr('style', 'cursor:pointer; opacity:0.7');
       // $('.addfiles').attr('style', 'float: left; margin-right: 9px; opacity:1');
    }
    enableDropdown() {
        this.isDisable = false;
        this.isFileProgress = false;
        this.isSelectedVideo = false;
        this.router.navigate(['./home/content']);
    }
    downloadFromDropbox() {
      try{
      if (this.processing !== true) {
            const self = this;
            const options = {
                success: function (files: any) {
                    console.log(files[0].name);
                    self.cloudStorageSelected = true;
                    self.dropbox(files);
                },
                cancel: function () {
                    self.defaultSettings();
                },
                linkType: 'direct',
                multiselect: false,
                extensions: ['.m4v', '.avi', '.mpg', '.mp4', '.flv', '.mov', '.wmv', '.divx', '.f4v', '.mpeg', '.vob', '.xvid', '.mkv'],
            };
            Dropbox.choose(options);
        } // close if condition
      }catch(error) {this.xtremandLogger.error('Error in upload video downloadFromDropbox'+error); }
    }
    dropbox(files: any) {
      try{
      swal({
            text: 'Thanks	for	waiting	while	we retrieve	your video from	Drop box',
            allowOutsideClick: false, showConfirmButton: false, imageUrl: 'assets/images/loader.gif',
        });
        console.log('files ' + files);
        this.cloudUploadService.downloadFromDropbox(files[0].link, files[0].name)
            .subscribe((result: any) => {
            	if(result.access){
                swal.close();
                console.log(result);
                this.processing = true;
                this.processVideo(result.data);
            	}else{
            		this.authenticationService.forceToLogout();
            	}
            },
            (error: any) => {
                this.errorIsThere = true;
                this.xtremandLogger.errorPage(error);
                swal.close();
            });
          }catch(error){ this.xtremandLogger.error('Error in upload vidoe dropbox'+error);swal.close();}
    }
    /* box retreive videos */
    downloadFrombox() {
      try{
        const value = this;
        const options = {
            clientId: 'a8gaa6kwnxe10uruyregh3u6h7qxd24g',
            linkType: 'direct',
            multiselect: false,
        };
        const boxSelect = new BoxSelect(options);
        if (value.processing !== true) {
            boxSelect.launchPopup();
        }
        const self = this;
        boxSelect.success(function (files: any) {
            if (self.isVideo(files[0].name)) {
                self.cloudStorageSelected = true;
                swal({
                    text: 'Thanks	for	waiting	while	we retrieve	your video from	Box',
                    allowOutsideClick: false, showConfirmButton: false, imageUrl: 'assets/images/loader.gif'
                });
                console.log(files);
                self.cloudUploadService.downloadFromBox(files[0].url, files[0].name)
                    .subscribe((result: any) => {
                    	if(result.access){
                        console.log(result);
                        swal.close();
                        self.processing = true;
                        self.processVideo(result.data);
                    }else{
                    	this.authenticationService.forceToLogout();
                    }
                    }, (error: any) => {
                        self.errorIsThere = true;
                        self.xtremandLogger.errorPage(error);
                        swal.close();
                    });
            } else {
                swal('Only video files can be uploaded.');
                self.defaultSettings();
            }
        });
        // Register a cancel callback handler
        boxSelect.cancel(function () {
            console.log('The user clicked cancel or closed the popup');
            self.defaultSettings();
        });
      } catch(error) { this.xtremandLogger.error('upload video downloadFrombox'+error);swal.close();}
    };
    /* google drive retreive videos */
    onApiLoad() {
        if (this.processing !== true) {  // for not clicking again on the google drive
            const self = this;
            gapi.load('auth', { 'callback': self.onAuthApiLoad.bind(this) });
            gapi.load('picker', { 'callback': self.onPickerApiLoad.bind(this) });
        }
    }
    onAuthApiLoad() {
        window['gapi'].auth.authorize(
            {
                'client_id': '982456748855-68ip6tueqej7757qsg1l0dd09jqh0qgs.apps.googleusercontent.com',
                'scope': ['https://www.googleapis.com/auth/drive.readonly'],
                'immediate': false
            },
            this.handleAuthResult.bind(this));
    }
    handleAuthResult(authResult: any) {
        console.log('close window google drive');
        const self = this;
        if (authResult && !authResult.error) {
            this.tempr = authResult.access_token;
            self.createPicker();
        }
    }
    onPickerApiLoad() {
        const self = this;
        this.pickerApiLoaded = true;
        self.createPicker();
    }
    createPicker() {
        const self = this;
        if (this.tempr) {
            const pickerBuilder = new google.picker.PickerBuilder();
            self.picker = pickerBuilder
                .enableFeature(google.picker.Feature.NAV_HIDDEN)
                .setOAuthToken(this.tempr)
                .addView(google.picker.ViewId.DOCS_VIDEOS)
                .setDeveloperKey('AIzaSyAcKKG96_VqvM9n-6qGgAxgsJrRztLSYAI')
                .setCallback(self.pickerCallback.bind(this))
                .build();
            self.picker.setVisible(true);
        }
    }
    pickerCallback(data: any) {
      try{
      const self = this;
        if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
            self.cloudStorageSelected = true;
            const doc = data[google.picker.Response.DOCUMENTS][0];
            if (self.picker) {
                self.picker.setVisible(false);
                self.picker.dispose();
            }
            swal({
                text: 'Thanks	for	waiting	while	we retrieve	your video from	Google Drive',
                allowOutsideClick: false, showConfirmButton: false, imageUrl: 'assets/images/loader.gif'
            });
            self.downloadGDriveFile(doc.id, doc.name);
        } else if (data[google.picker.Response.ACTION] === google.picker.Action.CANCEL) {
            self.picker.setVisible(false);
            self.picker.dispose();
        }
      }catch(error) {this.xtremandLogger.error('Error in upload video pickerCallback'+error);swal.close(); }
    }
    downloadGDriveFile(fileId: any, name: string) {
       try{
        const self = this;
        if (this.isVideo(name)) {
            const downloadLink = 'https://www.googleapis.com/drive/v3/files/' + fileId + '?alt=media';
            self.cloudUploadService.downloadFromGDrive(downloadLink, name, this.tempr)
                .subscribe((result: any) => {
                	if(result.access){
                    console.log(result);
                    swal.close();
                    self.processing = true;
                    if (self.picker) {
                        self.picker.setVisible(false);
                        self.picker.dispose();
                    }
                    if (!self.redirectPge) { self.cloudStorageDisabled(); }
                    self.processVideo(result.data);
                	}else{
                    	this.authenticationService.forceToLogout();
                    	}
                },
                (error: any) => {
                    this.errorIsThere = true;
                    this.xtremandLogger.errorPage(error);
                    swal.close();
                });
        } else {
            swal('Only video files can be uploaded');
        }
       } catch(error){this.xtremandLogger.error('error in upload vidoe downloadGDriveFile'+error); swal.close();}
    }

    isVideo(filename: any) {
        const parts = filename.split('.');
        const ext = parts[parts.length - 1];
        switch (ext.toLowerCase()) {
            case 'm4v':
            case 'mkv':
            case 'avi':
            case 'mpg':
            case 'mp4':
            case 'flv':
            case 'mov':
            case 'wmv':
            case 'divx':
            case 'f4v':
            case 'mpeg':
            case 'vob':
            case 'xvid':
                // etc
                return true;
        }
        return false;
    }

    isContentVideo(files: any) {
      for (let i = 0; i < files.length; i++) {
      const parts = files[i].name.split('.');
      const ext = parts[parts.length - 1];
      switch (ext.toLowerCase()) {
        case 'm4v':return true;
        case 'avi':return true;
        case 'mpg':return true;
        case 'mp4':return true;
        case 'flv':return true;
        case 'mov':return true;
        case 'wmv':return true;
        case 'divx':return true;
        case 'f4v':return true;
        case 'mpeg':return true;
        case 'vob':return true;
        case 'xvid':return true;
        case 'mkv':return true;
       }
      }
      return false;
   }
   isFileContainsExtension(files){
    for (let i = 0; i < files.length; i++) {
      const parts = files[i].name.split('.');
      const ext = parts[parts.length - 1];
      if(ext===files[i].name){ return false } else { return true; };
   }
  }

    dropClick(){
      $('#file-upload').click();
    }
    contentDropClick(){
      $('#content-upload').click();
    }
    contentUpload( event: any ) {
      // this.contentProcessing = true;
      this.customResponse.isVisible = false;
      try {
          let files: Array<File>;
          if ( event.target.files ) { files = event.target.files; }
          else if ( event.dataTransfer.files ) { files = event.dataTransfer.files; }
          console.log(files);
          let size:any = 0;
          if(!this.isContentVideo(files)){
            for (let i = 0; i < files.length; ++i) { size = size + files[i].size;  }
            console.log(size);
             if(size <= 12582912){
               this.contentProcessing = true;
               const formData: FormData = new FormData();
               $.each( files, function( index, file ) { formData.append( 'files', file, file.name ); });
               this.videoFileService.hasVideoAccess(this.loggedInUserId)
               .subscribe(
            		   (result: any) =>  {
            		   if(result.access){
            			   this.uploadToServer( formData ); 
            		   }else{
            			   this.authenticationService.forceToLogout();
            		   }
             }
            		   );
               
               //this.uploadToServer( formData );
            }
            else { this.customResponse = new CustomResponse( 'ERROR', this.properties.CONTENT_UPLOAD_SIZE, true ); }
         } else { this.customResponse = new CustomResponse( 'ERROR', this.properties.CONTENT_UPLOAD_FILETYPE, true );
        }
      } catch ( error ) {  this.customResponse = new CustomResponse( 'ERROR', "Unable to upload file", true );  }
    }
      uploadToServer( formData: FormData ) {
        this.contentProcessing = true;
        this.emailTemplateService.uploadFile( this.loggedInUserId, formData )
            .subscribe( data => {
            	if(data.access){
              if ( data.statusCode === 1020 ) {
                this.refService.contentManagementLoader = true;
                if(!this.redirectContent){
                  this.redirectContent = false;
                  setTimeout(() => { this.contentProcessing = false; this.router.navigate(['/home/content/manage']); }, 1200); }
              } else { this.contentProcessing = false; this.customResponse = new CustomResponse( 'ERROR', data.message, true );  }
            }else{
            	this.authenticationService.forceToLogout();
            }
            },
            ( error: string ) => {
              this.customResponse = new CustomResponse('ERROR', this.properties.SOMTHING_WENT_WRONG, true);
             // this.xtremandLogger.errorPage( error );
              this.contentProcessing = false; });
      }
      dropBoxContentChange() {
          try {
              if (this.isChecked === true && this.processing !== true && this.sweetAlertDisabled === false &&
                  this.sweetAlertMesg === 'DropBox') { swal('Oops...', 'You minimized DropBox window!', 'error'); }
              if (this.isChecked !== true && this.cloudDrive === false && this.camera === false && this.cloudOneDrive === false &&
                  this.cloudBox === false) {
                  this.videoFileService.hasVideoAccess(this.loggedInUserId)
                      .subscribe(
                      (result: any) => {
                          if (result.access) {
                              this.cloudDropbox = true;
                              this.isDisable = true;
                              this.isFileDrop = true;
                              this.isChecked = true;
                              this.sweetAlertDisabled = false;
                              this.sweetAlertMesg = 'DropBox';
                              this.fileDropDisabled();
                              this.downloadFromDropboxContent();
                              $('.camera').attr('style', 'cursor:not-allowed; opacity:0.5');
                              $('.googleDrive').attr('style', 'cursor:not-allowed; opacity:0.5');
                              $('.box').attr('style', 'cursor:not-allowed; opacity:0.5');
                              $('.oneDrive').attr('style', 'cursor:not-allowed; opacity:0.5');
                              // $('.addfiles').attr('style', 'float: left; margin-right: 9px;cursor:not-allowed; opacity:0.6');
                              this.cloudContentArr = new Array<CloudContent>();
                          } else {
                              this.authenticationService.forceToLogout();
                          }
                      }
                      );
                }
                } catch(error){this.xtremandLogger.error('Error in upload content dropB o xChange  method'+error);}
        }
      downloadFromDropboxContent() {
          try{
          if (this.processing !== true) {
                const self = this;
                const options = {
                    success: function (files: any) {
                        self.cloudStorageSelected = true;
                        self.dropboxContent(files);
                    },
                    cancel: function () {
                        self.defaultSettings();
                    },
                    linkType: 'direct',
                    multiselect: true,
                    extensions: ['.csv','.jpg', '.cvs', '.gif','.html','.pdf','.png','.ppt','.pptx' ,'.txt' ,'.xls', '.xlsx', '.zip', '.xml', '.sdf', '.key', '.tar','.sdf', '.key','.xlr', '.pct', '.indd', '.ai', '.eps', '.ps', '.svg', '.app', '.apk', '.b', '.exe', '.bat', '.jar', '.7z','.kmz','.rpm','.zipx', '.hqx','.apk','.dat', '.sitx','.url','.webp', '.gz','.kml','.pps',
                    '.tff', '.deb', '.dxf','.rar','.gpx','.log'],
                };
                Dropbox.choose(options);
            }
          }catch(error) {this.xtremandLogger.error('Error in upload content downloadFromDropbox'+error); }
        }
      dropboxContent(files: any) {
          try{
          swal({
                text: 'Thanks for waiting while we retrieve your files from Drop box',
                allowOutsideClick: false, showConfirmButton: false, imageUrl: 'assets/images/loader.gif',
            });
            for(let i=0;i<files.length;i++){
                const cloudContent = {
                  'downloadLink': files[i].link,
                  'fileName':files[i].name,
                  'oauthToken':null
                }
                this.cloudContentArr.push(cloudContent);
            }
            this.cloudUploadService.downloadFromDropboxContent(this.cloudContentArr)
                .subscribe((result: any) => {
                    swal.close();
                    this.contentProcessing = true; this.processing = false;
                    this.refService.contentManagementLoader=true;
                    if(!this.videoFileService.contentRedirect || this.router.url.includes('home/content/upload') ) {
                      this.videoFileService.contentRedirect = false;this.redirectContent = false;
                      this.router.navigate(['/home/content/manage']);
                     }
                },
                (error: any) => {
                    this.errorIsThere = true;
                //    this.xtremandLogger.errorPage(error);
                    swal.close();
                    this.contentProcessing = false;
                    this.customResponse = new CustomResponse('ERROR', this.properties.SOMTHING_WENT_WRONG, true);
                    this.xtremandLogger.error('Error in upload content from dropbox'+error);
                });
              }catch(error){ this.xtremandLogger.error('Error in upload content from dropbox'+error);}
        }

      boxContentChange() {
          try{
            if (this.isChecked === true && this.processing !== true && this.sweetAlertDisabled === false &&
                this.sweetAlertMesg === 'Box') { swal('Oops...', 'You minimized Box window!', 'error'); }
            if (this.isChecked !== true && this.cloudDrive === false && this.camera === false && this.cloudOneDrive === false &&
                this.cloudDropbox === false) {
                this.cloudBox = true;
                this.isDisable = true;
                this.isFileDrop = true;
                this.isChecked = true;
                this.sweetAlertDisabled = false;
                this.sweetAlertMesg = 'Box';
                this.fileDropDisabled();
                this.downloadContentFrombox();
                this.cloudOneDrive = true;
                this.cloudDrive = true;
                $('.googleDrive').attr('style', 'cursor:not-allowed; opacity:0.5');
                $('.dropBox').attr('style', 'cursor:not-allowed; opacity:0.5');
                $('.camera').attr('style', 'cursor:not-allowed; opacity:0.5');
                $('.oneDrive').attr('style', 'cursor:not-allowed; opacity:0.5');
              //  $('.addfiles').attr('style', 'float: left; margin-right: 9px;cursor:not-allowed; opacity:0.6');
                this.cloudContentArr=new Array<CloudContent>();
            }
          } catch(error){this.xtremandLogger.error('Error in upload video box method'+error);}
        }

      downloadContentFrombox() {
          try{
            const value = this;
            const options = {
                clientId: 'a8gaa6kwnxe10uruyregh3u6h7qxd24g',
                linkType: 'direct',
                multiselect: true,
            };
            const boxSelect = new BoxSelect(options);
            if (value.processing !== true) {
                boxSelect.launchPopup();
            }
            const self = this;
            boxSelect.success(function (files: any) {
                if (!self.isContentVideo(files)) {
                    self.cloudStorageSelected = true;
                    swal({
                        text: 'Thanks for waiting while we retrieve your files from Box',
                        allowOutsideClick: false, showConfirmButton: false, imageUrl: 'assets/images/loader.gif'
                    });
                    for(let i=0;i<files.length;i++){
                        const cloudContent = {
                            'downloadLink': files[i].link? files[i].link : files[i].url,
                            'fileName':files[i].name,
                            'oauthToken':null
                        }
                        self.cloudContentArr.push(cloudContent);
                    }
                    self.cloudUploadService.downloadContentFromBox(self.cloudContentArr)
                        .subscribe((result: any) => {
                            console.log(result);
                            swal.close();
                            self.contentProcessing = true; self.processing = false;
                            self.refService.contentManagementLoader=true;
                            if(!self.videoFileService.contentRedirect || self.router.url.includes('home/content/upload')) {
                               self.videoFileService.contentRedirect = false;
                               self.router.navigate(['/home/content/manage']);
                             }
                         }, (error: any) => {
                            self.errorIsThere = true;
                            self.contentProcessing = false;
                         //   self.xtremandLogger.errorPage(error);
                            self.customResponse = new CustomResponse('ERROR', this.properties.SOMTHING_WENT_WRONG, true);
                            self.xtremandLogger.error(error);
                        });
                } else {
                    swal('Other than video files can be uploaded.');
                    self.defaultSettings();
                }
            });
            // Register a cancel callback handler
            boxSelect.cancel(function () {
                console.log('The user clicked cancel or closed the popup');
                self.defaultSettings();
            });
          } catch(error) { this.xtremandLogger.error('upload video downloadFrombox'+error);swal.close();}
        };

        googleDriveContentChange() {
            try{
            this.sweetAlertMesg = 'Drive';
              if(this.uploader.queue.length === 0){
              this.cloudContentArr = new Array<CloudContent>();
              this.onApiLoadContent();    // google drive code
              }
            } catch(error){this.xtremandLogger.error('Error in upload content googleDriveChange method'+error);}
          }

        onApiLoadContent() {
            if (this.contentProcessing !== true) {  // for not clicking again on the google drive
                const self = this;
                gapi.load('auth', { 'callback': self.onAuthApiLoadContent.bind(this) });
                gapi.load('picker', { 'callback': self.onPickerApiLoadContent.bind(this) });
            }
        }
        onAuthApiLoadContent() {
            window['gapi'].auth.authorize(
                {
                    'client_id': '982456748855-68ip6tueqej7757qsg1l0dd09jqh0qgs.apps.googleusercontent.com',
                    'scope': ['https://www.googleapis.com/auth/drive.readonly'],
                    'immediate': false
                },
                this.handleAuthResultContent.bind(this));
        }
        handleAuthResultContent(authResult: any) {
            console.log('close window google drive');
            const self = this;
            if (authResult && !authResult.error) {
                self.tempr = authResult.access_token;
                self.createPickerContent();
            }

        }
        onPickerApiLoadContent() {
            const self = this;
            this.pickerApiLoaded = true;
            self.createPickerContent();
        }
        createPickerContent() {
            const self = this;
            if (self.tempr) {
                const pickerBuilder = new google.picker.PickerBuilder();
                self.picker = pickerBuilder
                    .enableFeature(google.picker.Feature.NAV_HIDDEN)
                    .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
                    .setOAuthToken(self.tempr)
                    .addView(google.picker.ViewId.DOCS)
                    .setDeveloperKey('AIzaSyAcKKG96_VqvM9n-6qGgAxgsJrRztLSYAI')
                    .setCallback(self.pickerCallbackContent.bind(this))
                    .build();
                self.picker.setVisible(true);
            }
        }
        pickerCallbackContent(data: any) {
            try{
            const self = this;
              if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
                  self.cloudStorageSelected = true;
                  const doc = data[google.picker.Response.DOCUMENTS][0];
                  if (self.picker) {
                      self.picker.setVisible(false);
                      self.picker.dispose();
                  }
                  swal({
                      text: 'Thanks for waiting while we retrieve your content from Google Drive',
                      allowOutsideClick: false, showConfirmButton: false, imageUrl: 'assets/images/loader.gif'
                  });
                  self.downloadGDriveFileContent(data[google.picker.Response.DOCUMENTS]);
              } else if (data[google.picker.Response.ACTION] === google.picker.Action.CANCEL) {
                  self.picker.setVisible(false);
                  self.picker.dispose();
              }
            }catch(error) {this.xtremandLogger.error('Error in upload content pickerCallback'+error); swal.close(); }
          }
          downloadGDriveFileContent(files:any) {
             try{
              const self = this;
              if (!self.isContentVideo(files)) {
                if(self.isFileContainsExtension(files)){
                for(let i=0;i<files.length;i++){
                      const cloudContent = {
                          'downloadLink': 'https://www.googleapis.com/drive/v3/files/' + files[i].id + '?alt=media',
                          'fileName':files[i].name,
                          'oauthToken':self.tempr
                      }
                      self.cloudContentArr.push(cloudContent);
                 }
                  //const downloadLink = 'https://www.googleapis.com/drive/v3/files/' + fileId + '?alt=media';
                  self.cloudUploadService.downloadContentFromGDrive(self.cloudContentArr)
                      .subscribe((result: any) => {
                          console.log(result);
                          swal.close();
                          if (self.picker) {
                              self.picker.setVisible(false);
                              self.picker.dispose();
                          }
                          if (!self.redirectPge) { self.cloudStorageDisabled(); }
                          self.contentProcessing = true; self.processing = false;
                          self.videoFileService.videoFileSweetAlertMessage = false;
                          self.refService.contentManagementLoader=true;
                          if(!self.videoFileService.contentRedirect || self.router.url.includes('home/content/upload')) {
                            self.videoFileService.contentRedirect = false;
                            setTimeout(() => { self.router.navigate(['/home/content/manage']); }, 2000);
                          }
                      }, (error: any) => {
                          this.errorIsThere = true;
                        //  this.xtremandLogger.errorPage(error);
                          if (self.picker) {
                            self.picker.setVisible(false);
                            self.picker.dispose();
                            self.videoFileService.videoFileSweetAlertMessage = false;
                        }
                        swal.close();
                        this.customResponse = new CustomResponse('ERROR', this.properties.SOMTHING_WENT_WRONG, true);
                      });
                  } else {
                    swal.close();
                    this.refService.goToTop();
                    this.customResponse = new CustomResponse('ERROR', 'Your files does not contain proper extentions. Please add extensions to your files add re upload.', true);
                  }
              } else {
                  if (self.picker) {
                  self.picker.setVisible(false);
                  self.picker.dispose();
                  }
                    self.router.navigate(['/home/content']);
                    self.videoFileService.videoFileSweetAlertMessage = true;
                //  google.script.host.close();
                  swal('Other than video files can be uploaded');
              }
             } catch(error){this.xtremandLogger.error('error in upload content downloadGDriveFile'+error);swal.close(); }
          }

    ngOnInit() {
        QuickSidebar.init();
        try {
            if (this.refService.homeMethodsCalled === false) {
                this.homeComponent.getVideoTitles();
                this.homeComponent.getCategorisService();
                this.refService.homeMethodsCalled = true;
            }
            if(!this.refService.defaultPlayerSettings || this.refService.defaultPlayerSettings.playerColor===undefined){
                this.homeComponent.getVideoDefaultSettings();
            }
            this.defaultSettings();
        } catch (err) {
            console.error('ERROR : FileUploadComponent : ngOnInit() ' + err);
        }
    }
    ngOnDestroy() {
        $('.r-video').remove();
        if (this.deviceNotSupported) { swal.close(); }
        console.log('Deinit - Destroyed Component');
        if (this.camera) {
            this.modalPopupClosed();
            this.videoFileService.actionValue = '';
        }
        if (this.playerInit) {
            this.player.record().destroy();
            this.playerInit = false;
        }
        this.isChecked = false;
        if ((this.isProgressBar || this.uploadeRecordVideo  || this.cloudStorageSelected || this.processing )
            && this.errorIsThere === false && (this.router.url !=='/login') && !this.contentProcessing && !this.videoFileService.videoFileSweetAlertMessage) {
            this.redirectPge = true;
            this.videoFileService.isProgressBar = true;
            swal('','We’ll process your video in the background and save it in draft mode for when you return. Just look for it in the “Manage Videos” section.');
        }
        if((this.router.url !=='/login') && this.contentProcessing ){
          this.redirectContent = true;
          this.videoFileService.contentRedirect = true;
       //   swal('','We’ll process your content in the background and save it. Just look for it in the “Manage content" section.');
        }
        if (this.picker) {
            this.picker.setVisible(false);
            this.picker.dispose();
        }
    }
}
