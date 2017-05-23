import { Component, OnInit, Directive,ViewChild, ChangeDetectorRef, AfterContentInit, ElementRef  } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileDropDirective,FileItem } from 'ng2-file-upload';
import { AuthenticationService} from '../../core/services/authentication.service';
import { UploadCloudvideoService} from '../services/upload-cloudvideo.service';
import { Router} from '@angular/router';
import { VideoFileService} from '../services/video-file.service';
import { SaveVideoFile} from '../models/save-video-file';
declare var Dropbox, swal, google, gapi, downloadFromDropbox, BoxSelect, downloadFromGDrive, $, videojs: any;

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls :['./upload-video.component.css']

//   '../../../assets/global/plugins/jquery-file-upload/blueimp-gallery/blueimp-gallery.min.css',
})
export class UploadVideoComponent implements OnInit {

    public processVideoResp: SaveVideoFile;
    public URL = this.authenticationService.REST_URL+'admin/uploadVideo?access_token=';
    public uploader: FileUploader;
    public file_srcs: string[] = [];
    public hasBaseDropZoneOver  = false;
    public hasAnotherDropZoneOver = false;
    public videoPreviewPath: SafeUrl;
    loading: boolean ;
    processing = false;
    isChecked :boolean ;
    isFileDrop :boolean;
    isFileProgress:boolean;
    public videopath :string;
    public tempr:any;
    public pickerApiLoaded = false;
    public cloudDropbox :boolean;
    public cloudBox :boolean;
    public cloudDrive:boolean;
    public camera:boolean;
    public cloudOneDrive:boolean;
    public isDisable :boolean;
    public isOndrive  = true;
    public checkSpeedValue = false;
    public maxSubscription = false;
    public redirectPge = false;
    public player:any;
    public playerInit  = false;
    public recordedVideo :any;
    public responsePath :string;
    public RecordSave = false;
    public rageDisabled = false;
    public saveVideo :boolean;
    public discardVideo :boolean;
    public closeModalId :boolean;
    public testSpeeddisabled :boolean;
    public testSpeedshow :boolean;
    public stopButtonDisabled :boolean;
    public stopButtonShow :boolean;
    public textAreaValue  = '';
    public changeVolume = 1;
    public target:any;
    public textAreaDisable:boolean;
    public hideSaveDiscard:boolean;
    public maxTimeDuration :number;
    public source: string;
    public sweetAlertDisabled :boolean;
    public sweetAlertMesg:string;
    
    constructor(private http: Http, private router: Router,
        private authenticationService: AuthenticationService, private changeDetectorRef: ChangeDetectorRef,
        private videoFileService: VideoFileService,private cloudUploadService:UploadCloudvideoService,private sanitizer: DomSanitizer) {
        try {
            this.isChecked = false;
            this.isDisable = false;
            this.isFileDrop = false;
            this.loading = false;
            this.saveVideo = false;
            this.discardVideo = false;
            this.closeModalId = true;
            this.testSpeedshow = true;
            this.testSpeeddisabled= true;
            this.hideSaveDiscard = true;
            this.isFileProgress = false;
            // this.stopButtonShow = false;
            this.textAreaDisable = true;
            this.maxTimeDuration = 3600;

            this.uploader = new FileUploader({
                allowedMimeType: ['video/m4v', 'video/x-msvideo', 'video/mpg', 'video/mp4', 'video/quicktime', 'video/3gpp',
                    'video/x-ms-wmv', 'video/divx', 'video/x-f4v', 'video/x-flv', 'video/dvd', 'video/mpeg', 'video/xvid'],
                maxFileSize: 800 * 1024 * 1024,// 800 MB
                url: this.URL + this.authenticationService.access_token
            });
            this.uploader.onAfterAddingFile = (fileItem) => {
                fileItem.withCredentials = false;
                this.videoPreviewPath  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
                this.defaultDesabled();
            };
            this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                this.loading = true;
              //  this.processing = true;
              //  this.isFileDrop = true;
                this.processVideo(JSON.parse(response).path);
            };
            this.uploader.onProgressItem = (fileItem: FileItem, progress: any) => {
                this.changeDetectorRef.detectChanges();
                this.loading = true;
                this.isFileProgress = true;
               // this.processing = true;
                // this.isDisable =true;
                this.isFileDrop = true;
              // document.getElementById('openf').onclick = function (e) { e.preventDefault(); };
               $(".addfiles").attr("style", "float: left; margin-right: 9px;cursor:not-allowed; opacity:0.3");
            }
        } catch (err) {
            console.error('ERROR : FileUploadComponent constructor ' + err)
        }
    }

    processVideo(responsePath: any) {
      const val = this;
      if(this.RecordSave != true){
      setTimeout(function() {
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
                if (this.processVideoResp != null && this.processVideoResp.error==null) {
                    console.log('process video data :' + this.processVideoResp);
                    this.videoFileService.saveVideoFile = this.processVideoResp;
                    if (this.videoFileService.saveVideoFile.imageFiles == null){
                        this.videoFileService.saveVideoFile.imageFiles = [];}
                    if (this.videoFileService.saveVideoFile.gifFiles == null){
                        this.videoFileService.saveVideoFile.gifFiles = []; }
                    this.videoFileService.actionValue = "Save";
                    console.log(this.videoFileService.actionValue);
                    if(this.playerInit ==true){
                        this.closeRecordPopup();}
                    if(this.redirectPge  == false){
                        this.router.navigateByUrl('/home/videos/manage_videos');}
                     else {
                         this.videoFileService.actionValue = '';
                     }
                }
                else {
                    if(this.processVideoResp.error === 'Maximum Disk Space Reached for you subscription')
                     {   this.processing =  false;
                         this.defaultSettings();
                         this.maxSubscription = true;
                      }
                    else {
                          console.log('process video data object is null please try again:');
                          swal("Contact Admin" ,this.processVideoResp.error,'error')
                         if(this.RecordSave === true){
                          // this.player.recorder.reset();
                           this.player.recorder.stopDevice();
                           $("#myModal").modal("hide"); }
                         console.log(this.processVideoResp.error);
                      }
                   }
            }),
            () => console.log('process video is:'+ this.processVideoResp);
    }

    public fileOverBase(e: any): void {
        if(this.isFileDrop == false && this.isFileProgress==false){
            this.hasBaseDropZoneOver= e;}
        else {
            this.hasBaseDropZoneOver = false;
         }
    }

    public fileOverAnother(e: any): void {
        this.hasAnotherDropZoneOver = e;
    }
    fileDropPreview(file:File):void{
        if(this.isFileDrop == false){ 
         console.log("file got it" +file);
       //  this.readFiles(file);
         this.defaultDesabled();
         }
        else{
            // this.isDisable = true;
            this.isFileDrop = true;
            file = null;
            console.log('drop file will not work in progress');
        }
    }

    fileDropDisabled(){
        // this.isChecked =true;
        this.isFileDrop = true;
        this.file_srcs.length = 0;
    }
    fileDropEnabled(){
        this.isChecked = false;
        this.isFileDrop =false;
    }


    fileChange(inputFile:any,event:any) {
        this.readFiles(inputFile.files);
    }
    readFile(file:any, reader:any, callback:any) {
        reader.onload = () => {
            callback(reader.result);
        }
        reader.readAsDataURL(file);
    }
    readFiles(files:any, index = 0) {
        let reader = new FileReader();
        if (index in files) {
            this.readFile(files[index], reader, (result:any) => {
                this.file_srcs.push(result);
                this.readFiles(files, index + 1);// Read the next file;
            });
        } else {
            this.changeDetectorRef.detectChanges();
        }
    }

    removefileUploadVideo() {
        this.file_srcs.length = 0;
        console.log('length is zero' + this.file_srcs);
        this.defaultSettings();
        this.isChecked = false;
        this.isDisable = false;
    }
   
  recordVideo(){
         $('#script-text').val('');
         $("#myModal").modal("show");
    } 
  
  uploadRecordedVideo(){
      this.RecordSave = true;
      this.saveVideo= false;
      this.discardVideo = false;
      this.testSpeeddisabled = true;
      this.closeModalId = false;
      this.textAreaDisable =false; // not using ,need to check
      this.hideSaveDiscard = false; // hide the save and discard buttons when the video processing
      (<HTMLInputElement>document.getElementById("script-text")).disabled = true;
      (<HTMLInputElement>document.getElementById("rangeDisabled")).disabled = true;
      $(".video-js .vjs-control-bar").hide();

      const formData = new FormData();
      const object = this.recordedVideo;
      console.log(this.recordedVideo);
      if(navigator.userAgent.indexOf("Chrome") != -1){
          formData.append('file', object.video);
          }else{
              formData.append('file', object);
          }
      console.log(formData);
      return this.videoFileService.saveRecordedVideo(formData)
       .subscribe(
               (result: any) => {
                   this.responsePath = result;
                   this.processVideo(result.path);
                   }
       );
  }
  removeRecordVideo(){
       this.player.recorder.stopDevice();
       this.player.recorder.getDevice();
       this.saveVideo = false;
       this.discardVideo = false;
       this.hideSaveDiscard = true;
    }
 closeRecordPopup(){
        $("#myModal").modal("hide");
        this.defaultSettings();
        this.stop();
        this.isFileDrop =false;
        this.player.recorder.stopDevice();
        this.saveVideo = false;
        this.discardVideo = false;
        this.playerInit = true;
    }
 textAreaEmpty(){
     if(this.textAreaValue != "") {
        this.testSpeeddisabled = false;
      }
  }
  stop(){
        this.stopButtonShow  = false; // hide the stop button
        this.testSpeedshow = true; // show the test speed button
        this.rageDisabled = false;
        $("#script-text").stop(true);
    }
  testSpeed(){
      const self = this; 
      $("#script-text").stop(true);
         $( "#script-text" ).scrollTop( 0 );
        if($("#script-text").val()==""){
            // swal("Please Add your script and Test it back");
        }else{
          this.stopButtonShow  = true; // stop button show 
          this.stopButtonDisabled = false;
          this.testSpeedshow = false; // hide the test speed button
          this.rageDisabled = true;
          this.checkSpeedValue = true;
          let volume = this.changeVolume*60000;
             $( "#script-text" ).animate({scrollTop: $("#script-text").prop("scrollHeight")},
                        {
                        duration: volume,
                        complete: function() {
                            self.stop();
                        }
                  });
        }
    }

     cameraChange(){
        if(this.isChecked != true&&this.cloudDrive== false&&this.cloudDropbox==false &&this.cloudOneDrive==false&&this.cloudBox==false){
        this.camera = true;
        this.isDisable = true;
        this.isFileDrop = true;
        this.isChecked = true;
        this.fileDropDisabled();
        this.recordVideo();
        this.playerInit = true;
         $(".dropBox").attr("style", "cursor:not-allowed; opacity:0.3");
         $(".googleDrive").attr("style", "cursor:not-allowed; opacity:0.3");
         $(".box").attr("style", "cursor:not-allowed; opacity:0.3");
         $(".oneDrive").attr("style", "cursor:not-allowed; opacity:0.3");
             $(".video-js .vjs-current-time").css("display","none");
             $(".vjs-time-divider").css("display","none !important");
             $(".vjs-time-control .vjs-time-divider").css("display","none !important");
             $(".video-js .vjs-duration").css("display","none");
             $(".video-js .vjs-fullscreen-control").hide();
          //   $(".video-js .vjs-fullscreen-control").css("display","none !important");
          //  $(".vjs-fullscreen-control .vjs-control vjs-button").css("display","none !important");

         const self = this;
         self.player = videojs("myVideo",
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
         self.player.on('deviceError', function()
                 {
                     console.log('device error:', this.player.deviceErrorCode);
                 });
         self.player.on('deviceReady', function()
                 {
                 self.saveVideo = false;
                 self.discardVideo = false;
                 $(".video-js .vjs-fullscreen-control").hide();
              //  $(".vjs-fullscreen-control .vjs-control vjs-button").css("display","none !important");
                 console.log('device error:', this.player.deviceErrorCode);
                 });
         self.player.on('error', function(error:any)
                 {
                     console.log('error:', error);
                 });
                 // user clicked the record button and started recording
         self.player.on('startRecord', function()
                 {
                     console.log('started recording!');
                     self.closeModalId = false; // close button disabled for modal pop up
                     $( "#script-text" ).scrollTop( 0 );
                     self.stopButtonShow  = false; // stop button hide in modal pop up
                     self.stopButtonDisabled = true; // stop button disabled in modal pop up
                     self.testSpeedshow  = true; // show the test speed button
                     self.testSpeeddisabled = true; // test speed button disabled
                    // let volume = self.changeVolume*10000;
                     self.testSpeed();
                     self.rageDisabled = true;
                     console.log('started recording!');
                    // $("#script-text").animate({ scrollTop: $("#script-text").prop("scrollHeight") }, volume);
                     self.saveVideo = false; // save button disabled
                     self.discardVideo = false; // discard button disabled
                 });
                 // user completed recording and stream is available
         self.player.on('finishRecord', function()
                 {
                     self.saveVideo = true; // save button enabled
                     self.discardVideo = true; // discard button enabled
                     self.testSpeeddisabled = false; // enabled the test speed button
                     self.closeModalId = true; // close button enabled
                     $(".video-js .vjs-fullscreen-control").show();
                     self.stop();
                     self.rageDisabled = false;
                     console.log('finished recording: ', self.player.recordedData);
                     self.recordedVideo = self.player.recordedData;
                 });
       }
    }
    dropBoxChange(){
        if(this.isChecked==true &&  this.processing!=true && this.sweetAlertDisabled == false && this.sweetAlertMesg=='DropBox') swal("Oops...", "You minimized DropBox window!", "error");
        if(this.isChecked != true&&this.cloudDrive == false &&this.camera==false &&this.cloudOneDrive==false&&this.cloudBox==false){
        this.cloudDropbox = true;
        this.isDisable = true;
        this.isFileDrop = true;
        this.isChecked = true;
        this.sweetAlertDisabled = false;
        this.sweetAlertMesg = 'DropBox';
        this.fileDropDisabled();
        this.downloadFromDropbox();
           $(".googleDrive").attr("style", "cursor:not-allowed; opacity:0.3");
           $(".box").attr("style", "cursor:not-allowed; opacity:0.3");
           $(".camera").attr("style", "cursor:not-allowed; opacity:0.3");
           $(".oneDrive").attr("style", "cursor:not-allowed; opacity:0.3");
           $(".addfiles").attr("style", "float: left; margin-right: 9px;cursor:not-allowed; opacity:0.3");
        }
    }
    boxChange(){
        if(this.isChecked==true &&  this.processing!=true && this.sweetAlertDisabled == false && this.sweetAlertMesg=='Box') swal("Oops...", "You minimized Box window!", "error");
        if(this.isChecked != true &&this.cloudDrive==false&&this.camera==false &&this.cloudOneDrive==false&&this.cloudDropbox==false){
        this.cloudBox = true;
        this.isDisable = true;
        this.isFileDrop = true;
        this.isChecked = true;
        this.sweetAlertDisabled = false;
        this.sweetAlertMesg = 'Box';
        this.fileDropDisabled();
        this.downloadFrombox();
        this.cloudOneDrive= true;
        this.cloudDrive = true;
        $(".googleDrive").attr("style", "cursor:not-allowed; opacity:0.3");
        $(".dropBox").attr("style", "cursor:not-allowed; opacity:0.3");
        $(".camera").attr("style", "cursor:not-allowed; opacity:0.3");
        $(".oneDrive").attr("style", "cursor:not-allowed; opacity:0.3");
        $(".addfiles").attr("style", "float: left; margin-right: 9px;cursor:not-allowed; opacity:0.3");
        }
    }
    googleDriveChange(){
        if(this.isChecked==true &&  this.processing!=true && this.sweetAlertDisabled ==false && this.sweetAlertMesg=='Drive') swal("Oops...", "You minimized Google Drive window!", "error");
        if(this.isChecked != true &&this.cloudBox==false&&this.camera==false &&this.cloudOneDrive == false&&this.cloudDropbox==false){  
        this.cloudDrive = true;
        this.isDisable = true;
        this.isFileDrop = true;
        this.isChecked = true;
        this.sweetAlertDisabled = false;
        this.sweetAlertMesg = 'Drive';
        this.fileDropDisabled();
        this.onApiLoad();    // google drive code 
           $(".box").attr("style", "cursor:not-allowed; opacity:0.3");
           $(".dropBox").attr("style", "cursor:not-allowed; opacity:0.3");
           $(".camera").attr("style", "cursor:not-allowed; opacity:0.3");
           $(".oneDrive").attr("style", "cursor:not-allowed; opacity:0.3");
           $(".addfiles").attr("style", "float: left; margin-right: 9px;cursor:not-allowed; opacity:0.3");
     }
    }
    defaultDesabled(){
        this.sweetAlertDisabled = true;
        this.isChecked = true;
        $(".dropBox").attr("style", "cursor:not-allowed; opacity:0.3");
        $(".googleDrive").attr("style", "cursor:not-allowed; opacity:0.3");
        $(".box").attr("style", "cursor:not-allowed; opacity:0.3");
        $(".camera").attr("style", "cursor:not-allowed; opacity:0.3");
        $(".oneDrive").attr("style", "cursor:not-allowed; opacity:0.3");
    }
    defaultSettings(){
       this.cloudDropbox =false;
       this.cloudBox  = false;
       this.cloudDrive= false;
       this.camera =false;
       this.cloudOneDrive = false;
       this.isChecked = false;
       this.isFileDrop = false;
       this.isDisable = false;
       this.hideSaveDiscard = true;
       this.isFileProgress = false;
       this.sweetAlertDisabled = false;
        $(".dropBox").attr("style", "cursor:pointer; opacity:1");
        $(".googleDrive").attr("style", "cursor:pointer; opacity:1");
        $(".box").attr("style", "cursor:pointer; opacity:1");
        $(".camera").attr("style", "cursor:pointer; opacity:1");
         $(".oneDrive").attr("style", "cursor:pointer; opacity:1");
        $(".addfiles").attr("style", "float: left; margin-right: 9px; opacity:1");
    }
    downloadFromDropbox() {
        if(this.processing != true){
        let self = this;
           var options = {
               success: function(files: any) {
                   console.log(files[0].name);
                   self.dropbox(files);
                   },
               cancel: function() {
                  self.defaultSettings();
               },
               linkType: "direct",
               multiselect: false,
               extensions: ['.m4v', '.avi', '.mpg', '.mp4', '.flv', '.mov', '.wmv', '.divx', '.f4v', '.mpeg', '.vob', '.xvid'],
           };
           Dropbox.choose(options);
       } // close if condition
    }
        dropbox(files:any){
          swal({ title: 'Retriving video from dropbox...!', text: "Please Wait...It's processing", showConfirmButton: false, imageUrl: "assets/images/loader.gif" });
          console.log("files "+files);
           this.cloudUploadService.downloadFromDropbox(files[0].link, files[0].name)
           .subscribe((result: any) => {
               swal.close();
               console.log(result);
               this.processing  = true;
               this.processVideo(result.path);
           });
        }
        /* box retreive videos */
        downloadFrombox() {
           let value = this;
            var options = {
                clientId: 'a8gaa6kwnxe10uruyregh3u6h7qxd24g',
                linkType: 'direct',
                multiselect: false,
            };
            var boxSelect = new BoxSelect(options);
            if(value.processing != true){ 
               boxSelect.launchPopup();
            }
            let self = this;
            boxSelect.success(function(files:any) {
             if (self.isVideo(files[0].name)) {
                 swal({ title: 'Retriving video from box...!', text: "Please Wait...It's processing", showConfirmButton: false, imageUrl: "assets/images/loader.gif" });
                 console.log(files);
                    self.cloudUploadService.downloadFromBox(files[0].url, files[0].name)
                    .subscribe((result: any) => {
                        console.log(result);
                        swal.close();
                        self.processing  = true;
                        self.processVideo(result.path);
                    });
              } else {
                 swal("Only video files can be uploaded.");
                } 
            });
            // Register a cancel callback handler
            boxSelect.cancel(function() {
                console.log("The user clicked cancel or closed the popup");
                self.defaultSettings();
            });
        };
     /* google drive retreive videos */   
      onApiLoad() {
         if(this.processing != true){  // for not clicking again on the google drive
         let self = this;
            //gapi.load('auth', {'callback': self.onAuthApiLoad});
            gapi.load('auth', {'callback': self.onAuthApiLoad.bind(this)});
            gapi.load('picker', {'callback': self.onPickerApiLoad.bind(this)});
        }
     }
        onAuthApiLoad() {
           let self = this;
           window['gapi'].auth.authorize(
                    {
                        'client_id': "516784406032-okvpndbvngrrev2vq0gdd3n2tng5joq8.apps.googleusercontent.com",
                        'scope': ['https://www.googleapis.com/auth/drive.readonly'],
                        'immediate': false
                    },
                    this.handleAuthResult.bind(this));
        }
        handleAuthResult(authResult:any) {
          console.log("close window google drive");
           let self = this;
            if (authResult && !authResult.error) {
                this.tempr = authResult.access_token;
                self.createPicker();
            }

        }
        onPickerApiLoad() {
           let self = this;
            this.pickerApiLoaded = true;
            self.createPicker();
          }
        createPicker() {
           let self = this;
            if ( this.tempr) {
                var pickerBuilder = new google.picker.PickerBuilder();
                var picker = pickerBuilder
                .enableFeature(google.picker.Feature.NAV_HIDDEN)
                .setOAuthToken(this.tempr)
                .addView(google.picker.ViewId.DOCS_VIDEOS)
                .setDeveloperKey('AIzaSyA2md7KHqFuUp5U4tRa_MqySNrxzR6mGJQ')
                .setCallback(self.pickerCallback.bind(this))
                .build();
                picker.setVisible(true);
            }
          
        }
        pickerCallback(data:any) {
           let self = this;
            if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
                var doc = data[google.picker.Response.DOCUMENTS][0];
                swal({ title: 'Retriving video from Google Drive...!', text: "Please Wait...It's processing", showConfirmButton: false, imageUrl: "assets/images/loader.gif" });
                self.downloadGDriveFile(doc.id , doc.name);
            }
            else if (data[google.picker.Response.ACTION] == google.picker.Action.CANCEL) {
                self.defaultSettings();
            }
        }

        downloadGDriveFile(fileId:any, name:string){
            let self = this;
            if(this.isVideo(name)){
                var downloadLink = "https://www.googleapis.com/drive/v3/files/"+fileId+"?alt=media";
                self.cloudUploadService.downloadFromGDrive(downloadLink, name,  this.tempr)
                .subscribe((result: any) => {
                    console.log(result);
                    swal.close();
                    this.processing  = true;
                    this.processVideo(result.path);
                });
            }
            else{
                swal('Only video files can be uploaded');
            }
        }

        isVideo(filename:any) {
             var parts = filename.split('.');
             var ext  = parts[parts.length - 1];
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
           try {
               this.defaultSettings();
               }
        catch (err) {
                console.error('ERROR : FileUploadComponent : ngOnInit() ' + err);
            }
          }
       ngOnDestroy() {
           console.log('Deinit - Destroyed Component')
           if(this.playerInit==true){
          // this.player.recorder.destroy();
           this.player.recorder.stopDevice();}
           console.log('Destroyed Component completed');
           this.isChecked= false;
           if(this.processing ==  true) {
                this.redirectPge = true;
                swal('Video is processing backend!', 'your video will be saved as draft mode in manage videos!!'); 
           }
       }
}
