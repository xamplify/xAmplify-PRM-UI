import { Component, OnInit, Directive, ViewChild, ChangeDetectorRef, AfterContentInit, ElementRef, OnDestroy } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
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
import { SaveVideoFile } from '../models/save-video-file';
import { HomeComponent } from '../../core/home/home.component';
declare var Dropbox, swal, google, QuickSidebar, gapi, downloadFromDropbox, BoxSelect, downloadFromGDrive: any;
declare var $, videojs: any;

@Component({
    selector: 'app-upload-video',
    templateUrl: './upload-video.component.html',
    styleUrls: ['./upload-video.component.css', '../../../assets/css/video-css/video-js.custom.css'],
    providers: [HomeComponent]
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
    maxSubscription = false;
    redirectPge = false;
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
    codecSupport = false;
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
    noSpaceOnDevice = false;
    constructor(public http: Http, public router: Router, public xtremandLogger: XtremandLogger,
        public authenticationService: AuthenticationService, public changeDetectorRef: ChangeDetectorRef,
        public videoFileService: VideoFileService, public cloudUploadService: UploadCloudvideoService,
        public sanitizer: DomSanitizer, public refService: ReferenceService, public homeComponent: HomeComponent,
        public deviceService: Ng2DeviceService) {
        try {
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
            $('.addfiles').attr('style', 'float: left; margin-right: 9px;cursor:not-allowed; opacity:1');
            this.uploader = new FileUploader({
                allowedMimeType: ['video/m4v', 'video/x-msvideo', 'video/mpg', 'video/mp4', 'video/quicktime',
                    'video/x-ms-wmv', 'video/divx', 'video/x-f4v', 'video/x-flv', 'video/dvd', 'video/mpeg', 'video/xvid'],
                maxFileSize: this.maxVideoSize * 1024 * 1024, // 800 MB
                url: this.URL + this.authenticationService.access_token
            });
            this.uploader.onAfterAddingFile = (fileItem) => {
                fileItem.withCredentials = false;
                $('.addfiles').attr('style', 'float: left; margin-right: 9px;cursor:not-allowed; opacity:0.6');
                console.log(fileItem._file);
                const isSupportfile = fileItem._file.type.toString();
                this.checkMimeTypes(isSupportfile);
                this.videoPreviewPath = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
                this.defaultDesabled();
                console.log(fileItem._file.size);
            };
            this.uploader.onProgressItem = (fileItem: FileItem, progress: any) => {
                this.loading = true;
                this.isFileProgress = true;
                this.isFileDrop = true;
                this.isProgressBar = true;
              //  $('.addfiles').attr('style', 'float: left; margin-right: 9px;cursor:not-allowed; opacity:0.6');
            };
            this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                this.loading = true;
                this.isProgressBar = false;
                if (response.includes('No space left on device')) {
                    this.noSpaceOnDevice = true;
                    this.setTimoutMethod();
                } else {
                     this.processVideo(JSON.parse(response).path); }
            };
            if (this.refService.uploadRetrivejsCalled === false) {
                $('head').append('<link href="assets/js/indexjscss/videojs.record.css" rel="stylesheet"  class="r-video">');
                $('head').append('<script src="https://apis.google.com/js/api.js" type="text/javascript"  class="r-video"/>');
                $('head').append('<script src="assets/js/indexjscss/select.js" type="text/javascript"  class="r-video"/>');
                $('head').append('<script src="assets/js/indexjscss/webcam-capture/video.min.js" type="text/javascript"  class="r-video"/>');
                // $('head').append('<script src="assets/js/indexjscss/videojs.record.js" type="text/javascript"  class="r-video"/>');
                // <link href="assets/js/indexjscss/webcam-capture/video-js.css" rel="stylesheet">
                this.refService.uploadRetrivejsCalled = true;
            }
            $('head').append('<script src="assets/js/indexjscss/videojs.record.js" type="text/javascript"  class="r-video"/>');
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
        if (isSupportfile === 'video/mp4') {
            this.videoDisabled = false;
            this.previewDisabled = true;
        } else if (this.browserInfo.includes('chrome') && (isSupportfile === 'video/mpeg')) {
            this.videoDisabled = false;
            this.previewDisabled = true;
        } else if (this.browserInfo.includes('firefox') && (isSupportfile === 'video/mov')) {
            this.videoDisabled = false;
            this.previewDisabled = true;
        } else { this.videoDisabled = true; this.previewDisabled = false; }
    }
    processVideo(responsePath: any) {
        if (!this.videoFileService.isProgressBar) { this.cloudStorageDisabled(); }
        const val = this;
        if (this.RecordSave !== true) {
            setTimeout(function () {
                val.processing = true;
            }, 100);
        }
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
                    console.log(this.videoFileService.actionValue);
                    if (this.redirectPge === false) {
                        this.router.navigateByUrl('/home/videos/manage_videos');
                    } else if (this.playerInit === false) {
                        this.videoFileService.actionValue = '';
                        this.videoFileService.isProgressBar = false;
                        $('.addfiles').attr('style', 'float: left; margin-right: 9px;cursor:not-allowed; opacity:1');
                    } else {
                        this.videoFileService.actionValue = '';
                        this.videoFileService.isProgressBar = false;
                        $('.addfiles').attr('style', 'float: left; margin-right: 9px;cursor:not-allowed; opacity:1');
                    }
                } else {   // Maximum Disk Space Reached for you subscription
                    if (this.processVideoResp.error.includes('maximum upload')) {
                        this.processing = false;
                        this.defaultSettings();
                        this.maxSubscription = true;
                        this.setTimoutMethod();
                    } else if (this.processVideoResp.error.includes('Codec is not supported')) {
                        this.codecSupport = true;
                        this.setTimoutMethod();
                    } else if (this.processVideoResp.error.includes('No space left on device')){
                        this.noSpaceOnDevice = true;
                        this.setTimoutMethod();
                    } else {
                        console.log('process video data object is null please try again:');
                        if (this.RecordSave === true && this.player) {
                            this.player.recorder.reset();
                            this.modalPopupClosed();
                        }
                        console.log(this.processVideoResp.error);
                    }
                }
            },
            (error: any) => {
                this.modalPopupClosed();
                this.errorIsThere = true;
                this.xtremandLogger.errorPage(error);
            }),
            () => console.log('process video is:' + this.processVideoResp);
    }
    modalPopupClosed() {
        $('#myModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop fade in').remove();
    }
    fileSizeCheck(event: any) {
        const fileList: FileList = event.target.files;
        console.log(fileList[0].type);
        if (fileList.length > 0) {
            const file: File = fileList[0];
            const isSizeExceded: any = fileList[0].size;
            const size = isSizeExceded / (1024 * 1024);
            if (size > this.maxVideoSize) {
                this.maxSizeOver = true;
            } else { this.maxSizeOver = false; }
        }
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
        const val = this;
        setTimeout(function () {
            val.maxSizeOver = false;
            val.maxSubscription = false;
            val.codecSupport = false;
            val.noSpaceOnDevice = false;
            val.router.navigate(['./home/videos']);
        }, 5000);
    }
    fileDropPreview(file: File): void {
        if (this.isFileDrop === false) {
            console.log('file got it');
            console.log(file);
            console.log(file[0].type);
        } else {
            this.isFileDrop = true;
            file = null;
            console.log('drop file will not work in progress');
        }
    }
    closeBannerAlert() {
        this.maxSizeOver = false;
        this.maxSubscription = false;
        this.codecSupport = false;
        this.noSpaceOnDevice = false;
        this.router.navigate(['./home/videos']);
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
        this.codecSupport = false;
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
        if (navigator.userAgent.indexOf('Chrome') !== -1) {
            formData.append('file', object.video);
        } else {
            formData.append('file', object);
        }
        console.log(formData);
        return this.videoFileService.saveRecordedVideo(formData)
            .subscribe(
            (result: any) => {
                this.processVideo(result.path);
            }, (error: any) => {
                this.errorIsThere = true;
                this.xtremandLogger.errorPage(error);
            }
            );
    }
    removeRecordVideo() {
        this.player.recorder.stopDevice();
        this.player.recorder.getDevice();
        // this.player.recorder.reset();
        this.saveVideo = false;
        this.discardVideo = false;
        this.hideSaveDiscard = true;
        $('.video-js .vjs-fullscreen-control').hide();
    }
    closeRecordPopup() {
        $('#myModal').modal('hide');
        this.defaultSettings();
        this.stop();
        this.isFileDrop = false;
        // this.player.recorder.stopDevice();
        this.player.recorder.reset();
        this.saveVideo = false;
        this.discardVideo = false;
        this.playerInit = true;
        // this.router.navigate(['./home/videos']);
    }
    trimVideoTitle(title: string) {
        if (title.length > 40) {
            const fileTitleStart = title.substr(0, 40);
            const fileTitleend = title.slice(-5);
            return fileTitleStart + '...' + fileTitleend;
        } else {
            return title;
        }
    }
    textAreaEmpty() {
        if (this.textAreaValue !== '') {
            this.testSpeeddisabled = false;
        }
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
                localStream.stop();
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
        if (this.isChecked !== true && this.cloudDrive === false && this.cloudDropbox === false &&
            this.cloudOneDrive === false && this.cloudBox === false) {
            this.camera = true;
            this.isDisable = true;
            this.isFileDrop = true;
            this.isChecked = true;
            this.fileDropDisabled();
            this.recordVideo();
            this.playerInit = true;
            $('.dropBox').attr('style', 'cursor:not-allowed; opacity:0.3');
            $('.googleDrive').attr('style', 'cursor:not-allowed; opacity:0.3');
            $('.box').attr('style', 'cursor:not-allowed; opacity:0.3');
            $('.oneDrive').attr('style', 'cursor:not-allowed; opacity:0.3');
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
                // let volume = self.changeVolume*10000;
                self.testSpeed();
                self.rageDisabled = true;
                console.log('started recording!');
                // $('.video-js .vjs-control-bar').attr('style', 'background-color : rgba(43, 51, 63, 0.7)');
                // $("#script-text").animate({ scrollTop: $("#script-text").prop("scrollHeight") }, volume);
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
                self.stop();
                self.rageDisabled = false;
                console.log('finished recording: ', self.player.recordedData);
                self.recordedVideo = self.player.recordedData;
            });
        }
    }
    dropBoxChange() {
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
            $('.camera').attr('style', 'cursor:not-allowed; opacity:0.3');
            $('.googleDrive').attr('style', 'cursor:not-allowed; opacity:0.3');
            $('.box').attr('style', 'cursor:not-allowed; opacity:0.3');
            $('.oneDrive').attr('style', 'cursor:not-allowed; opacity:0.3');
            $('.addfiles').attr('style', 'float: left; margin-right: 9px;cursor:not-allowed; opacity:0.6');
        }
    }
    boxChange() {
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
            $('.googleDrive').attr('style', 'cursor:not-allowed; opacity:0.3');
            $('.dropBox').attr('style', 'cursor:not-allowed; opacity:0.3');
            $('.camera').attr('style', 'cursor:not-allowed; opacity:0.3');
            $('.oneDrive').attr('style', 'cursor:not-allowed; opacity:0.3');
            $('.addfiles').attr('style', 'float: left; margin-right: 9px;cursor:not-allowed; opacity:0.6');
        }
    }
    googleDriveChange() {
        // if (this.isChecked === true && this.processing !== true && this.sweetAlertDisabled === false &&
        //     this.sweetAlertMesg === 'Drive') { swal('Oops...', 'You minimized Google Drive window!', 'error'); }
        // if (this.isChecked !== true && this.cloudBox === false && this.camera === false && this.cloudOneDrive === false &&
        //     this.cloudDropbox === false) {
        //   this.cloudDrive = true;
        //  this.isDisable = true;
        //  this.isFileDrop = true;
        //  this.isChecked = true;
        //  this.sweetAlertDisabled = false;
        this.sweetAlertMesg = 'Drive';
        //  this.fileDropDisabled();
        this.onApiLoad();    // google drive code
        // $('.box').attr('style', 'cursor:not-allowed; opacity:0.3');
        // $('.dropBox').attr('style', 'cursor:not-allowed; opacity:0.3');
        // $('.camera').attr('style', 'cursor:not-allowed; opacity:0.3');
        // $('.oneDrive').attr('style', 'cursor:not-allowed; opacity:0.3');
        // $('.addfiles').attr('style', 'float: left; margin-right: 9px;cursor:not-allowed; opacity:0.3');
        // }
    }
    defaultDesabled() {
        this.sweetAlertDisabled = true;
        this.isChecked = true;
        this.isSelectedVideo = true;
        $('.googleDrive').attr('style', 'cursor:not-allowed; opacity:0.3');
        $('.box').attr('style', 'cursor:not-allowed; opacity:0.3');
        $('.dropBox').attr('style', 'cursor:not-allowed; opacity:0.3');
        $('.camera').attr('style', 'cursor:not-allowed; opacity:0.3');
        $('.oneDrive').attr('style', 'cursor:not-allowed; opacity:0.3');
    }
    cloudStorageDisabled() {
        $('.addfiles').attr('style', 'float: left; margin-right: 9px;cursor:not-allowed; opacity:0.6');
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
        $('.dropBox').attr('style', 'cursor:pointer; opacity:1');
        $('.googleDrive').attr('style', 'cursor:pointer; opacity:1');
        $('.box').attr('style', 'cursor:pointer; opacity:1');
        $('.camera').attr('style', 'cursor:pointer; opacity:1');
        $('.oneDrive').attr('style', 'cursor:pointer; opacity:1');
        $('.addfiles').attr('style', 'float: left; margin-right: 9px; opacity:1');
    }
    enableDropdown() {
        this.isDisable = false;
        this.isFileProgress = false;
        this.isSelectedVideo = false;
        this.router.navigate(['./home/videos']);
    }
    downloadFromDropbox() {
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
                extensions: ['.m4v', '.avi', '.mpg', '.mp4', '.flv', '.mov', '.wmv', '.divx', '.f4v', '.mpeg', '.vob', '.xvid'],
            };
            Dropbox.choose(options);
        } // close if condition
    }
    dropbox(files: any) {
        swal({
            text: 'Retrieving video from dropbox...! Please Wait...It\'s processing',
            allowOutsideClick: false, showConfirmButton: false, imageUrl: 'assets/images/loader.gif'
        });
        console.log('files ' + files);
        this.cloudUploadService.downloadFromDropbox(files[0].link, files[0].name)
            .subscribe((result: any) => {
                swal.close();
                console.log(result);
                this.processing = true;

                this.processVideo(result.path);
            },
            (error: any) => {
                this.errorIsThere = true;
                this.xtremandLogger.errorPage(error);
            });
    }
    /* box retreive videos */
    downloadFrombox() {
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
                    text: 'Retrieving video from box...! Please Wait...It\'s processing',
                    allowOutsideClick: false, showConfirmButton: false, imageUrl: 'assets/images/loader.gif'
                });
                console.log(files);
                self.cloudUploadService.downloadFromBox(files[0].url, files[0].name)
                    .subscribe((result: any) => {
                        console.log(result);
                        swal.close();
                        self.processing = true;
                        self.processVideo(result.path);
                    }, (error: any) => {
                        self.errorIsThere = true;
                        self.xtremandLogger.errorPage(error);
                    });
            } else {
                swal('Only video files can be uploaded.');
            }
        });
        // Register a cancel callback handler
        boxSelect.cancel(function () {
            console.log('The user clicked cancel or closed the popup');
            self.defaultSettings();
        });
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
        const self = this;
        window['gapi'].auth.authorize(
            {
                'client_id': '516784406032-okvpndbvngrrev2vq0gdd3n2tng5joq8.apps.googleusercontent.com',
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
                .setDeveloperKey('AIzaSyA2md7KHqFuUp5U4tRa_MqySNrxzR6mGJQ')
                .setCallback(self.pickerCallback.bind(this))
                .build();
            self.picker.setVisible(true);
        }
    }
    pickerCallback(data: any) {
        const self = this;
        if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
            self.cloudStorageSelected = true;
            const doc = data[google.picker.Response.DOCUMENTS][0];
            if (self.picker) {
                self.picker.setVisible(false);
                self.picker.dispose();
            }
            swal({
                text: 'Retrieving video from Google Drive...! Please Wait...It\'s processing',
                allowOutsideClick: false, showConfirmButton: false, imageUrl: 'assets/images/loader.gif'
            });
            self.downloadGDriveFile(doc.id, doc.name);
        } else if (data[google.picker.Response.ACTION] === google.picker.Action.CANCEL) {
            self.picker.setVisible(false);
            self.picker.dispose();
        }
    }
    downloadGDriveFile(fileId: any, name: string) {
        const self = this;
        if (this.isVideo(name)) {
            const downloadLink = 'https://www.googleapis.com/drive/v3/files/' + fileId + '?alt=media';
            self.cloudUploadService.downloadFromGDrive(downloadLink, name, this.tempr)
                .subscribe((result: any) => {
                    console.log(result);
                    swal.close();
                    self.processing = true;
                    if (self.picker) {
                        self.picker.setVisible(false);
                        self.picker.dispose();
                    }
                    if (!self.redirectPge) { self.cloudStorageDisabled(); }
                    self.processVideo(result.path);
                }, (error: any) => {
                    this.errorIsThere = true;
                    this.xtremandLogger.errorPage(error);
                });
        } else {
            swal('Only video files can be uploaded');
        }
    }

    isVideo(filename: any) {
        const parts = filename.split('.');
        const ext = parts[parts.length - 1];
        switch (ext.toLowerCase()) {
            case 'm4v':
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
    ngOnInit() {
        QuickSidebar.init();
        try {
            if (this.refService.homeMethodsCalled === false) {
                this.homeComponent.getVideoTitles();
                this.homeComponent.getCategorisService();
                this.refService.homeMethodsCalled = true;
            }
            this.defaultSettings();
        } catch (err) {
            console.error('ERROR : FileUploadComponent : ngOnInit() ' + err);
        }
    }
    ngOnDestroy() {
        $('r-video').remove();
        if (this.deviceNotSupported) { swal.close(); }
        console.log('Deinit - Destroyed Component');
        if (this.camera === true) {
            this.modalPopupClosed();
            this.videoFileService.actionValue = '';
        }
        if (this.playerInit === true) {
            this.player.recorder.destroy();
            this.playerInit = false;
        }
        this.isChecked = false;
        this.noSpaceOnDevice = false;
        if ((this.isProgressBar === true || this.uploadeRecordVideo === true || this.cloudStorageSelected === true
            || this.processing === true) && this.errorIsThere === false) {
            this.redirectPge = true;
            this.videoFileService.isProgressBar = true;
            $('.addfiles').attr('style', 'float: left; margin-right: 9px;cursor:not-allowed; opacity:1');
            swal('', 'Video is processing backend! your video will be saved as draft mode in manage videos!!');
        }
        if (this.picker) {
            this.picker.setVisible(false);
            this.picker.dispose();
        }
    }
}
