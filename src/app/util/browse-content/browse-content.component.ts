import { Component, OnInit,Input,Output,EventEmitter, OnDestroy } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { ReferenceService } from 'app/core/services/reference.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router,ActivatedRoute } from '@angular/router';
import { Properties } from '../../common/models/properties';
import { Ng2DeviceService } from 'ng2-device-detector';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { VideoFileService } from 'app/videos/services/video-file.service';
import { DamUploadPostDto } from 'app/dam/models/dam-upload-post-dto';
import { DamService } from 'app/dam/services/dam.service';
import { HttpEventType,HttpResponse} from "@angular/common/http";
declare var $:any, swal:any, gapi:any, google:any, Dropbox:any, BoxSelect:any, videojs: any;

@Component({
  selector: 'app-browse-content',
  templateUrl: './browse-content.component.html',
  styleUrls: ['./browse-content.component.css','../../dam/upload-asset/upload-asset.component.css'],
  providers:[Properties]
})
export class BrowseContentComponent implements OnInit,OnDestroy {
  loading = false;
  isAdd:boolean;
  isEdit:boolean;
  isDisable:boolean;
  uploadedAssetName = "";
  invalidAssetName: boolean;
  headerText = "";
  customResponse: CustomResponse = new CustomResponse();
  uploadedImage:any;
	uploadedCloudAssetName = "";
  tempr: any = null;
  damUploadPostDto: DamUploadPostDto = new DamUploadPostDto();
	formData: any = new FormData();
  isVideoAsset : boolean = false;
  videoPreviewPath: SafeUrl;
  showVideoPreview : boolean = false;
  fileSize: number;
  @Output() browseContentEventEmitter = new EventEmitter();
  loggedInUserId = 0;
  /***Webcam related properties**/
  browserInfo: string;
  camera: boolean;
  isFileDrop = false;
  recordCustomResponse: CustomResponse = new CustomResponse();
  playerInit = false;
  player: any;
  maxTimeDuration: number;
  testSpeeddisabled: boolean;
  stopButtonDisabled: boolean;
  saveVideo: boolean;
  discardVideo: boolean;
  checkSpeedValue = false;
  deviceInfo = null;
	closeModalId: boolean;
	stopButtonShow = false; 
  testSpeedshow = false; 
  rageDisabled = false;
  changeVolume = 1;
  recordedVideo: any;
  hideSaveDiscard: boolean;
  textAreaDisable: boolean;
  RecordSave = false;
  textAreaValue = '';
  /***Webcam related properties**/
  pickerApiLoaded = false;
	picker: any;
  isReplaceVideo = false;
  processing = false;
  progress: number = 0;
  isDisableForm: boolean = false;
  viewType: string;
  categoryId: number;
  folderViewType: string;
  @Input() assetType:string;
  @Input()assetDetailsDto:DamUploadPostDto;
  constructor(public referenceService:ReferenceService,public sanitizer: DomSanitizer,private router: Router,public properties:Properties,
    public deviceService: Ng2DeviceService,private xtremandLogger:XtremandLogger,private authenticationService:AuthenticationService,
    private videoFileService:VideoFileService,private damService:DamService,private route:ActivatedRoute) {
        this.isFileDrop = false;
        this.loading = false;
        this.saveVideo = false;
        this.discardVideo = false;
        this.closeModalId = true;
        this.testSpeedshow = true;
        this.testSpeeddisabled = true;
        this.hideSaveDiscard = true;
        this.textAreaDisable = true;
        this.maxTimeDuration = 3400; // record video time
		$('head').append('<script src="https://apis.google.com/js/api.js" type="text/javascript"  class="r-video"/>');
		$('head').append('<script src="assets/js/indexjscss/select.js" type="text/javascript"  class="r-video"/>');
		$('head').append('<link href="assets/js/indexjscss/webcam-capture/nvideojs.record.css" rel="stylesheet"  class="r-video">');
		$('head').append('<script src="assets/js/indexjscss/video-hls-player/video6.4.0.js" type="text/javascript"  class="r-video"/>');
    $('head').append('<link href="assets/js/indexjscss/webcam-capture/video-js.css" rel="stylesheet">');
     $('head').append('<script src="assets/js/indexjscss/webcam-capture/nvideojs.record.js" type="text/javascript"  class="r-video"/>');
		
		    this.deviceInfo = this.deviceService.getDeviceInfo();
        this.browserInfo = this.deviceInfo.browser;
        
        if (this.referenceService.isEnabledCamera === false && !this.referenceService.isIE() && !this.browserInfo.includes('safari') &&
            !this.browserInfo.includes('edge')) {
            this.referenceService.isEnabledCamera = true;
        } else if (this.referenceService.isIE() || this.browserInfo.includes('safari') || this.browserInfo.includes('edge')) {
            this.referenceService.cameraIsthere = true;
        }
        /****XNFR-169****/
        this.viewType = this.route.snapshot.params['viewType'];
        this.categoryId = this.route.snapshot.params['categoryId'];
        this.folderViewType = this.route.snapshot.params['folderViewType'];
   }

  ngOnInit() {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.isAdd = this.router.url.indexOf('/upload') > -1;
    this.isEdit = this.router.url.indexOf('/editDetails') > -1;
    this.isReplaceVideo = this.router.url.indexOf('/editVideo')>-1;
    if(this.isReplaceVideo){
      this.clearUploadedFile();
    }
		this.headerText = this.isAdd ? 'Upload Asset' : this.isEdit ? 'Replace Asset':'Replace Video Asset';
    if(this.isEdit){
      this.damUploadPostDto = this.assetDetailsDto;
    }
  }

  ngOnDestroy(): void {
		$('#thumbnailImageModal').modal('hide');
        $('.r-video').remove();
        if (this.camera) {
            this.referenceService.closeDamModalPopup();
            this.videoFileService.actionValue = '';
        }
        if (this.playerInit) {
            this.player.record().destroy();
            this.playerInit = false;
        }
        if (this.picker) {
            this.picker.setVisible(false);
            this.picker.dispose();
        }
        
        if(this.processing){
           this.damService.ispreviousAssetIsProcessing = true;
        }
        this.damService.uploadAssetInProgress = false;
		
	}

    chooseAsset(event: any) {
      this.customResponse = new CustomResponse();
      this.invalidAssetName = false;
      let files: Array<File>;
      if ( event.target.files!=undefined ) {
        files = event.target.files; 
      }else if ( event.dataTransfer.files ) { 
        files = event.dataTransfer.files;
      }
      if (files.length > 0) {
        let file = files[0];
        let sizeInKb = file.size / 1024;
        let maxFileSizeInKb = 1024 * 800;
        if(sizeInKb==0){
          this.showAssetErrorMessage('Invalid File');
          this.callEmitter();
        }else if(sizeInKb>maxFileSizeInKb){
          this.showAssetErrorMessage('Max file size is 800 MB');
          this.callEmitter();
        }else if(file['name'].lastIndexOf(".")==-1) {
                  this.showValidExtensionErrorMessage();
                  this.callEmitter();
              }else if(!this.isAdd){
                if(this.isReplaceVideo){
                  let fileName = file['name'];
                  let isVideoFile = this.referenceService.isVideo(fileName);
                  if(isVideoFile){
                    this.setUploadedFileProperties(file);
                  }else{
                    this.showAssetErrorMessage('Please upload only video file.');
                    this.callEmitter();
                  }
                }else{
                  this.validateExtensionType(file);
                  this.callEmitter();
                }
              }else{
                  this.setUploadedFileProperties(file);
                }
      }else{
        this.clearPreviousSelectedAsset();
        this.callEmitter();
      }
    }

    showValidExtensionErrorMessage(){
      this.uploadedCloudAssetName = "";
      this.tempr = null;
      this.clearPreviousSelectedAsset();
      this.customResponse = new CustomResponse('ERROR',"Selected asset does not have the proper extension. Please upload a valid asset.",true);
    }

  /***XNFR-342****/
  private validateExtensionType(file: File) {
    let extension = this.referenceService.getFileExtension(file['name']);
    if (extension == this.assetType) {
        this.setUploadedFileProperties(file);
    } else {
        this.showAssetErrorMessage('Invalid file type. Only ' + this.assetType + " file is allowed.");
    }
}

private setUploadedFileProperties(file: File) {
    this.uploadedImage = file;
    this.formData.delete("uploadedFile");
    this.uploadedAssetName = "";
    this.uploadedCloudAssetName = "";
    this.damUploadPostDto.source = "";
    this.customResponse = new CustomResponse();
    this.formData.append("uploadedFile", file, file['name']);
    this.uploadedAssetName = file['name'];
    this.damUploadPostDto.cloudContent = false;
    this.damUploadPostDto.fileName = this.uploadedAssetName;
    this.damUploadPostDto.downloadLink = null;
    this.damUploadPostDto.oauthToken = null;
    this.isVideoAsset = this.referenceService.isVideo(this.uploadedAssetName);
    if (this.isVideoAsset) {
        this.videoPreviewPath = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file)));
        this.showVideoPreview = true;
        this.fileSize = file.size;
        this.isDisable = true;
    }
    /**XNFR-434***/
    this.callEmitter();
     /**XNFR-434***/
}

clearPreviousSelectedAsset(){
  this.formData.delete("uploadedFile");
  $('#uploadedAsset').val('');
  this.uploadedAssetName  = "";
}



showAssetErrorMessage(message:string){
  this.referenceService.goToTop();
  $('#uploadedAsset').val('');
  this.formData.delete("uploadedFile");
  this.invalidAssetName = true;
  this.uploadedAssetName  = "";
  this.customResponse = new CustomResponse('ERROR',message,true);
}


browse() {
  $('#uploadedAsset').click();
}




/***WebCam Related Code****/
cameraChange() {
  if(this.referenceService.isIE() || this.browserInfo.includes('edge') ){
    this.referenceService.showSweetAlertErrorMessage('This Cam won\'t work in Internet explorar and edge browser!');
   }
  else {
  if (true) {
      this.camera = true;
      //this.isDisable = true;
      this.isFileDrop = true;
      //this.isChecked = true;
      this.fileDropDisabled();
      this.recordVideo();
      this.playerInit = true;
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
          self.recordedVideo = self.player.recordedData;
      });
  }
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
          recordBlocked.referenceService.cameraIsthere = true;
      },
      function () {
          recordBlocked.referenceService.cameraIsthere = false;
          console.log('user did not give access to the camera');
      }
  );
}
recordVideo() {
  $('#script-text').val('');
  $('#myModal').modal('show');
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



fileDropDisabled() {
  this.isFileDrop = true;
}
fileDropEnabled() {
  this.isFileDrop = false;
}

textAreaEmpty() {
  if (this.textAreaValue !== '') { this.testSpeeddisabled = false; }
}

uploadRecordedVideo() {
  if(this.player.record().getDuration() < 10) {
    this.recordCustomResponse = new CustomResponse( 'ERROR', 'Record Video length must be greater than 10 seconds', true );
   } else {
   try{
     this.RecordSave = true;
     this.saveVideo = false;
     this.discardVideo = false;
     this.testSpeeddisabled = true;
     this.closeModalId = false;
     this.textAreaDisable = false; // not using ,need to check
     this.hideSaveDiscard = false; // hide the save and discard buttons when the video processing
     this.formData.delete("uploadedFile");
     this.uploadedAssetName  = "";
     this.uploadedCloudAssetName = "";
     this.customResponse = new CustomResponse();
     
     this.uploadedCloudAssetName = 'recorded_video.mp4';
     this.formData.append("uploadedFile", this.recordedVideo, this.recordedVideo.name);
     this.damUploadPostDto.cloudContent = false;
     this.damUploadPostDto.fileName = this.recordedVideo.name;
     this.damUploadPostDto.downloadLink = null;
     this.damUploadPostDto.oauthToken = null;
     this.damUploadPostDto.source= 'webcam';
     this.isVideoAsset = true;
     
    this.callEmitter();
     
     (<HTMLInputElement>document.getElementById('script-text')).disabled = true;
     (<HTMLInputElement>document.getElementById('rangeDisabled')).disabled = true;
     $('.video-js .vjs-control-bar').hide();
     
     this.recordModalPopupAfterUpload();
     
     
    }catch(error) { this.xtremandLogger.error('Error in upload video, uploadRecordedVideo method'+error);}
    }
}
 removeRecordVideo() {
    try{
     this.player.record().stopDevice();
     this.player.record().getDevice();
     this.saveVideo = false;
     this.discardVideo = false;
     this.hideSaveDiscard = true;
     $('.video-js .vjs-fullscreen-control').hide();
   }catch(error) { this.xtremandLogger.error('Error in upload video, removeRecordVideo method'+error);}
 }

 modalPopupClosed() {
  this.referenceService.closeDamModalPopup();
 }

recordModalPopupAfterUpload() {
  this.modalPopupClosed();
  this.closeRecordPopup();
}

defaultSettings() {
  this.camera = false;
  this.isFileDrop = false;
  this.hideSaveDiscard = true;
  $('.camera').attr('style', 'cursor:pointer; opacity:0.7');
}



trimVideoTitle(title: string) {
   try {
      if (title.length > 30) {
          const fileTitleStart = title.substr(0, 25);
          const fileTitleend = title.slice(-5);
          return fileTitleStart + '...' + fileTitleend;
      } else {
          return title;
      }
   } catch (error) { this.xtremandLogger.error('Error in upload video, trimVideoTitle method' + error); }

 }

removefileUploadVideo() {
  this.formData.delete("uploadedFile");
  this.uploadedAssetName = "";
  this.showVideoPreview = false;
  this.fileSize = 0;
  this.isDisable = false;
  $('#uploadedAsset').val("");
  this.callEmitter();
}

closeRecordPopup() {
  try{
   $('#myModal').modal('hide');
    this.defaultSettings();
    this.stop();
   this.isFileDrop = false;
    this.player.record().reset();
    //this.saveVideo = false;
    this.discardVideo = false;
    this.playerInit = true;
    // this.router.navigate(['./home/videos']);
  }catch(error) { this.xtremandLogger.error('Error in upload video, closeRecordPopup method'+error);}
}


/*******Drop Box Code**********/
 // cloud content -- DropBox code changes  
 dropBoxChange() {
  try {
    this.damUploadPostDto.source= 'Dropbox';
      const self = this;
      const options = {
          success: function(files: any) {
              self.setCloudContentValues(files[0].name, files[0].link);
          },
          cancel: function() {
          },
          linkType: 'direct',
          multiselect: false,
          // extensions: ['.m4v', '.avi', '.mpg', '.mp4', '.flv', '.mov', '.wmv', '.divx', '.f4v', '.mpeg', '.vob', '.xvid', '.mkv'],
      };
      Dropbox.choose(options);
  } catch (error) { this.xtremandLogger.error('Error in upload video downloadFromDropbox' + error); }
}

setCloudContentValues(uploadedCloudAssetName:string, downloadLink:string) {
  if(uploadedCloudAssetName.lastIndexOf(".")==-1) {
    this.showValidExtensionErrorMessage();
  }else{
    this.uploadedAssetName = "";
    this.uploadedCloudAssetName = "";
    this.formData.delete("uploadedFile");
    this.customResponse = new CustomResponse();
    this.uploadedCloudAssetName = uploadedCloudAssetName;
    this.damUploadPostDto.downloadLink = downloadLink;
    this.damUploadPostDto.oauthToken = this.tempr;
    this.damUploadPostDto.cloudContent = true;
    this.damUploadPostDto.fileName = this.uploadedCloudAssetName;
    this.damUploadPostDto.replaceVideoAsset = this.isReplaceVideo;
    this.isVideoAsset = this.referenceService.isVideo(this.uploadedCloudAssetName);
    if(this.isReplaceVideo && !this.isVideoAsset){
      this.uploadedCloudAssetName = "";
      this.tempr = null;
      this.showAssetErrorMessage("Please upload only video file.")
    }
    }

    this.callEmitter();
  }


  //cloud content -- Box code changes 
  downloadFrombox() {
    try{
      this.damUploadPostDto.source= 'Box';
      const value = this;
      const options = {
          clientId: 'a8gaa6kwnxe10uruyregh3u6h7qxd24g',
          linkType: 'direct',
          multiselect: false,
      };
      const boxSelect = new BoxSelect(options);
      boxSelect.launchPopup();
      const self = this;
      boxSelect.success(function (files: any) {
          if (files[0].name) {
              self.setCloudContentValues(files[0].name, files[0].url);
          } 
      });
      // Register a cancel callback handler
      boxSelect.cancel(function () {
          console.log('The user clicked cancel or closed the popup');
          //self.defaultSettings();
      });
    } catch(error) { this.xtremandLogger.error('upload video downloadFrombox'+error);swal.close();}
  };

  /***********Google Drive******/
  googleDriveChange() {
    try {
      this.damUploadPostDto.source = 'Google Drive';
        this.videoFileService.hasVideoAccess(this.loggedInUserId)
            .subscribe(
            (result: any) => {
                if (result.access) {
                    this.onApiLoad();
                } else {
                    this.authenticationService.forceToLogout();
                }
            }
            );
    } catch (error) { this.xtremandLogger.error('Error in upload video googleDriveChange method' + error); }
  }

onApiLoad() {
        const self = this;
        gapi.load('auth', { 'callback': self.onAuthApiLoad.bind(this) });
        gapi.load('picker', { 'callback': self.onPickerApiLoad.bind(this) });
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
            .addView(google.picker.ViewId.DOCS)
            .setDeveloperKey('AIzaSyAcKKG96_VqvM9n-6qGgAxgsJrRztLSYAI')
            .setCallback(self.pickerCallback.bind(this))
            .build();
        self.picker.setVisible(true);
    }
}
pickerCallback(data: any) {
    try {
        const self = this;
        if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
            const doc = data[google.picker.Response.DOCUMENTS][0];
            if (self.picker) {
                self.picker.setVisible(false);
                self.picker.dispose();
            }
            let downloadLink = 'https://www.googleapis.com/drive/v3/files/' + doc.id + '?alt=media';
            this.setCloudContentValues(doc.name, downloadLink);
        } else if (data[google.picker.Response.ACTION] === google.picker.Action.CANCEL) {
            self.picker.setVisible(false);
            self.picker.dispose();
        }
    } catch (error) { this.xtremandLogger.error('Error in upload video pickerCallback' + error); swal.close(); }
}

/********Replace Video*****/
uploadVideo(){
  this.damService.uploadAssetInProgress = true;
  this.referenceService.goToTop();
  this.customResponse = new CustomResponse();
  this.damUploadPostDto.loggedInUserId = this.authenticationService.getUserId();
  this.damUploadPostDto.videoId = this.route.snapshot.params['videoId'];
  this.damUploadPostDto.replaceVideoAsset = this.isReplaceVideo;
  alert("is Replace"+this.damUploadPostDto.replaceVideoAsset);
  this.isDisableForm = true;
  if (this.damUploadPostDto.cloudContent || this.damUploadPostDto.source=== 'webcam') {
      swal({
          text: 'Thanks for waiting while we retrieve your video from '+this.damUploadPostDto.source,
          allowOutsideClick: false, showConfirmButton: false, imageUrl: 'assets/images/loader.gif',
      });
  }
  
   this.damService.uploadVideo(this.formData, this.damUploadPostDto).subscribe(
            (event: any) => {
                if (this.damUploadPostDto.cloudContent || this.damUploadPostDto.source === 'webcam') {
                    if (event.statusCode == 200) {
                        this.isDisable = true;
                        swal.close();
                        this.processVideo(event);
                    } 
                } else {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.progress = Math.round(100 * event.loaded / event.total);
                        console.log("File is" + this.progress + "% uploaded.");
                    } else if (event instanceof HttpResponse) {
                        console.log('File is completely uploaded!');
                        let result = event.body;
                        if (result.statusCode == 200) {
                            this.processVideo(result);
                        } else if (result.statusCode == 400) {
                            this.customResponse = new CustomResponse('ERROR', result.message, true);
                        } else if (result.statusCode == 404) {
                            this.referenceService.showSweetAlertErrorMessage("Invalid Request");
                        } 
                    }
              }
            }, error => {
                swal.close();
                let statusCode = JSON.parse(error['status']);
                if (statusCode == 409) {
                    this.formData.delete("damUploadPostDTO");
                } else {
                    this.xtremandLogger.log(error);
                    this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
                }
            });
}
  
processVideo(result: any){
  let path : string = result.map.assetPath;
   this.processing = true;
  if (this.RecordSave !== true) {  setTimeout(function () {  this.processing = true; }, 100); }
  if(this.damService.ispreviousAssetIsProcessing){
    this.damService.ispreviousAssetIsProcessing = false;
  }		
  this.damService.processVideo(this.formData, this.damUploadPostDto, path).subscribe(
            (result: any) => {
                if (result.statusCode == 200) {
                 this.processing = false;
                  this.referenceService.assetResponseMessage = result.message;
                if(!this.damService.ispreviousAssetIsProcessing){
                    if(this.isAdd){
                        this.referenceService.isUploaded = true;
                    }else{
                        this.referenceService.isAssetDetailsUpldated = true;
                    }
                      if(this.damService.uploadAssetInProgress){
                          this.damService.uploadAssetInProgress = false;
                          this.loading = true;
                          this.referenceService.navigateToManageAssetsByViewType(this.folderViewType,this.viewType,this.categoryId,false);
                      }
                    }
                } else if (result.statusCode == 400) {
                    this.customResponse = new CustomResponse('ERROR', result.message, true);
                } else if (result.statusCode == 404) {
                    this.referenceService.showSweetAlertErrorMessage("Invalid Request");
                }else if (result.statusCode == 401) {
                    this.formData.delete("damUploadPostDTO");
                }
            }, error => {
                swal.close();
                let statusCode = JSON.parse(error['status']);
                if (statusCode == 409) {
                    this.formData.delete("damUploadPostDTO");
                } else {
                    this.xtremandLogger.log(error);
                    this.xtremandLogger.errorPage(error);
                    this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
                }
            });
}

goToEditVideoDetailsPage(){
  this.browseContentEventEmitter.emit();
}
/********End Of Replace Video*****/
 

callEmitter(){
  if(!this.isReplaceVideo){
      let emitter = {};
      emitter['damUploadPostDto'] = this.damUploadPostDto;
      emitter['formData'] = this.formData;
      emitter['customResponse'] = this.customResponse;
      emitter['isVideoAsset'] = this.isVideoAsset;
      emitter['uploadedCloudAssetName'] = this.uploadedCloudAssetName;
      emitter['camera'] = this.camera;
      emitter['playerInit'] = this.playerInit;
      emitter['player'] = this.player;
      emitter['picker'] = this.picker;
      emitter['videoPreviewPath'] = this.videoPreviewPath;
      emitter['showVideoPreview'] = this.showVideoPreview;
      emitter['fileSize'] = this.fileSize;
      emitter['isDisable'] = this.isDisable;
      emitter['uploadedAssetName'] = this.uploadedAssetName;
      this.browseContentEventEmitter.emit(emitter);
  }
  
}

clearUploadedFile(){
  this.formData.delete("uploadedFile");
  this.uploadedAssetName = "";
  this.showVideoPreview = false;
  this.fileSize = 0;
  this.isDisable = false;
  $('#uploadedAsset').val("");
  
}

}