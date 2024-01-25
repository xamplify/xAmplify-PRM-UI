import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { DamUploadPostDto } from '../models/dam-upload-post-dto';
import { CustomResponse } from 'app/common/models/custom-response';
import { DamService } from '../services/dam.service';
import { Properties } from '../../common/models/properties';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router, ActivatedRoute } from '@angular/router';
import { ImageCroppedEvent } from 'app/common/image-cropper/interfaces/image-cropped-event.interface';
import { UtilService } from 'app/core/services/util.service';
import { Pagination } from '../../core/models/pagination';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { Tag } from 'app/dashboard/models/tag'
import { UserService } from '../../core/services/user.service';
import { VideoFileService } from '../../videos/services/video-file.service';
import { Ng2DeviceService } from 'ng2-device-detector';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpEventType,HttpResponse} from "@angular/common/http";
import {AddFolderModalPopupComponent} from 'app/util/add-folder-modal-popup/add-folder-modal-popup.component';
import { CallActionSwitch } from 'app/videos/models/call-action-switch';
/****XNFR-255****/
import { Dimensions, ImageTransform } from 'app/common/image-cropper-v2/interfaces';
import { base64ToFile } from 'app/common/image-cropper-v2/utils/blob.utils';
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';



declare var $:any, swal:any, CKEDITOR: any, gapi:any, google:any, Dropbox:any, BoxSelect:any, videojs: any;

@Component({
	selector: 'app-upload-asset',
	templateUrl: './upload-asset.component.html',
	styleUrls: ['./upload-asset.component.css'],
	providers: [Properties, Pagination, HttpRequestLoader,CallActionSwitch]
})
export class UploadAssetComponent implements OnInit,OnDestroy {
	
	formLoader = false;
	customResponse: CustomResponse = new CustomResponse();
	damUploadPostDto: DamUploadPostDto = new DamUploadPostDto();
    pagination: Pagination = new Pagination();
	formData: any = new FormData();
	loading = false;
	dupliateNameErrorMessage: string;
	descriptionErrorMessage: string;
	isValidForm = false;
	submitButtonText = "Save";
	isAdd = true;
	headerText = "Upload Asset";
	previewItems = false;
	previewPath = "";
	uploadedAssetName = "";
	invalidAssetName = false;
	id:number;
	/****Upload Thumbnail Variables */
	invalidThumbnail: boolean;
	thumbnailErrorMessage: string;
	croppedImage: any = '';
	squareData: any;
	thumbnailImageText: string = "";
	imageSelected: any = '';
	errorUploadCropper = false;
	showCropper: boolean;
	showDefaultLogo = false;
	uploadedThumbnailName = "";
	initLoader = false;
	loggedInUserId = 0;
	tags: Array<Tag> = new Array<Tag>();
	tagFirstColumnEndIndex: number = 0;
	tagsListFirstColumn: Array<Tag> = new Array<Tag>();
	tagsListSecondColumn: Array<Tag> = new Array<Tag>();
	tagSearchKey: string = "";
	tagsLoader: HttpRequestLoader = new HttpRequestLoader();
	openAddTagPopup: boolean = false;
	name = 'ng2-ckeditor';
	ckeConfig: any;
	@ViewChild("ckeditor") ckeditor: any;
	isCkeditorLoaded = false;
	tempr: any = null;
	pickerApiLoaded = false;
	picker: any;
	uploadedCloudAssetName = "";
	browserInfo: string;
	deviceInfo = null;
	closeModalId: boolean;
	stopButtonShow = false; 
    testSpeedshow = false; 
    rageDisabled = false;
    player: any;
    playerInit = false;
    recordedVideo: any;
    RecordSave = false;
    textAreaValue = '';
    changeVolume = 1;
    textAreaDisable: boolean;
    hideSaveDiscard: boolean;
    maxTimeDuration: number;
    testSpeeddisabled: boolean;
    stopButtonDisabled: boolean;
    camera: boolean;
    saveVideo: boolean;
    discardVideo: boolean;
    checkSpeedValue = false;
    isFileDrop = false;
    recordCustomResponse: CustomResponse = new CustomResponse();
    processing : boolean = false;
    videoPreviewPath: SafeUrl;
    showVideoPreview : boolean = false;
    fileSize : number = 0;
    progress: number = 0;
    isDisable: boolean = false;
    isDisableForm: boolean = false;
    isVideoAsset : boolean = false;
    /***XNFR-169*****/
    categoryNames: any;
    showFolderDropDown = false;
    viewType: string;
    categoryId: number;
    folderViewType: string;
    imagepath:string;

    containWithinAspectRatio = false;
    transform: ImageTransform = {};
    scale = 1;
    canvasRotation = 0;
    rotation = 0;
    circleData: any;
    cropRounded = false;
    imageChangedEvent: any = '';
    fileObj: any;
    @ViewChild(ImageCropperComponent) cropper: ImageCropperComponent;

    @ViewChild('addFolderModalPopupComponent') addFolderModalPopupComponent: AddFolderModalPopupComponent;
    /****XNFR-255*****/
    hasShareWhiteLabeledContentAccess = false;
    /****XNFR-326***/
    isAssetPublishedEmailNotification = false;
    assetPublishEmailNotificationLoader = true;
    isAssetPublished = false;
    uploadOrReplaceAssetText = "Upload Asset";
	constructor(private utilService: UtilService, private route: ActivatedRoute, private damService: DamService, public authenticationService: AuthenticationService,
	public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties, public userService: UserService,
	public videoFileService: VideoFileService,  public deviceService: Ng2DeviceService, public sanitizer: DomSanitizer,public callActionSwitch:CallActionSwitch){
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
        
        if (this.referenceService.isEnabledCamera === false && !this.isIE() && !this.browserInfo.includes('safari') &&
            !this.browserInfo.includes('edge')) {
            this.referenceService.isEnabledCamera = true;
        } else if (this.isIE() || this.browserInfo.includes('safari') || this.browserInfo.includes('edge')) {
            this.referenceService.cameraIsthere = true;
        }
        /****XNFR-169****/
        this.viewType = this.route.snapshot.params['viewType'];
        this.categoryId = this.route.snapshot.params['categoryId'];
        this.folderViewType = this.route.snapshot.params['folderViewType'];
    
	}
	
    
	ngOnInit() {
		this.isAdd = this.router.url.indexOf('/upload') > -1;
		this.showDefaultLogo = this.isAdd;
		this.headerText = this.isAdd ? 'Upload Asset' : 'Edit Asset';
        this.referenceService.assetResponseMessage = "";
		if (!this.isAdd) {
			this.id = this.route.snapshot.params['id'];
			this.getAssetDetailsById(this.id);
			this.submitButtonText = "Update";
            this.uploadOrReplaceAssetText = "Replace Asset";
		}
		this.loggedInUserId = this.authenticationService.getUserId();
		this.listTags(new Pagination());
        /****XNFR-169*****/
        this.listCategories();
        /*******XNFR-255***/
        this.findShareWhiteLabelContentAccess();
        /****XNFR-326*****/
        this.findAssetPublishEmailNotificationOption();
	}

     /****XNFR-326*****/
    findAssetPublishEmailNotificationOption() {
        this.assetPublishEmailNotificationLoader = true;
        this.authenticationService.findAssetPublishEmailNotificationOption()
        .subscribe(
            response=>{
                this.isAssetPublishedEmailNotification = response.data;
                this.assetPublishEmailNotificationLoader = false;
            },error=>{
                this.assetPublishEmailNotificationLoader = false;
            });
    }

    /*******XNFR-255***/
    findShareWhiteLabelContentAccess() {
        this.loading = true;
        this.authenticationService.findShareWhiteLabelContentAccess()
        .subscribe(
            response=>{
                this.hasShareWhiteLabeledContentAccess = response.data;
                this.loading = false;
            },error=>{
                this.loading = false;
            });
    }

	ngOnDestroy(): void {
		$('#thumbnailImageModal').modal('hide');
		this.openAddTagPopup = false;
        $('.r-video').remove();
        if (this.camera) {
            this.modalPopupClosed();
            this.videoFileService.actionValue = '';
        }
        if (this.playerInit) {
            this.player.record().destroy();
            this.playerInit = false;
        }
        //this.isChecked = false;
        if (this.picker) {
            this.picker.setVisible(false);
            this.picker.dispose();
        }
        
        if(this.processing){
           this.damService.ispreviousAssetIsProcessing = true;
        }
        this.damService.uploadAssetInProgress = false;
		
	}

	getAssetDetailsById(selectedAssetId: number) {
		this.formLoader = true;
		this.initLoader = true;
		this.damService.getAssetDetailsById(selectedAssetId).
			subscribe(
				(result: any) => {
					if(result.statusCode==200){
						this.damUploadPostDto = result.data;
						if(this.damUploadPostDto.tagIds == undefined){
							this.damUploadPostDto.tagIds = new Array<number>();
						}
                        this.isAssetPublished = result.data.published;
						this.validateForm('assetName');
						this.validateForm('description');
						this.formLoader = false;
						this.initLoader = false;
					}else{
						this.referenceService.goToPageNotFound();
					}
					
				}, (error: any) => {
					this.xtremandLogger.errorPage(error);
				}
			);

	}
    uploadedImage:any;
	chooseAsset(event: any) {
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
			}else if(sizeInKb>maxFileSizeInKb){
				this.showAssetErrorMessage('Max file size is 800 MB');
			}else if(file['name'].lastIndexOf(".")==-1) {
                this.showValidExtensionErrorMessage();
            }else if(!this.isAdd){
                let fileName = file['name'];
                let extension = this.referenceService.getFileExtension(fileName);
                if (extension == this.damUploadPostDto.assetType) {
                    this.setUploadedFileProperties(file);
                } else {
                    this.showAssetErrorMessage('Invalid file type. Only ' + this.damUploadPostDto.assetType + " file is allowed.");
                }
            }	
			else{
                this.setUploadedFileProperties(file);
			}
		}else{
			this.clearPreviousSelectedAsset();
		}
		this.validateAllFields();
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
        this.isVideoAsset = this.isVideo(this.uploadedAssetName);
        if (this.isVideoAsset) {
            this.videoPreviewPath = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file)));
            this.showVideoPreview = true;
            this.fileSize = file.size;
            this.isDisable = true;
        }
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

	browseThumbnail() {
		$('#thumbnailFile').click();
	}

	

	showThumbnailErrorMessage(errorMessage: string) {
		this.referenceService.goToTop();
		this.invalidThumbnail = true;
		$('#thumbnailFile').val('');
		this.customResponse = new CustomResponse('ERROR', errorMessage, true);
	}
	errorHandler(event: any) { event.target.src = 'assets/images/company-profile-logo.png'; }

	chooseThumbnail(event: any) {
		this.invalidThumbnail = false;
		this.thumbnailErrorMessage = '';
		if (event.target.files.length > 0) {
			this.customResponse = new CustomResponse();
			let file = event.target.files[0];
			let sizeInKb = file.size / 1024;
			let maxFileSizeInKb = 1024 * 10;
			let extension = this.referenceService.getFileExtension(file['name']);
			if (sizeInKb >= maxFileSizeInKb) {
				this.showThumbnailErrorMessage('Max file size is 10 MB');
			} else if ("jpg" == extension || "JPG" == extension || "PNG" == extension || "png" == extension || "JPEG" == extension || "jpeg" == extension) {
				this.imageChangedEvent = event;
				this.uploadedThumbnailName = file['name'];
				this.showDefaultLogo = false;
				this.openThumbnailPopup();
			} else {
				this.showThumbnailErrorMessage('Please Upload .jpg, .jpeg, .png files only');
			}
		} else {
			this.clearThumbnailImage();
		}
	}

	openThumbnailPopup() {
		this.thumbnailImageText = "Upload Thumbnail Image";
		$('#thumbnailImageModal').modal('show');
	}

	closeThumbnailPopup() {
		this.imageSelected = null;
		this.croppedImage = "";
		this.showDefaultLogo = true;
		$('#thumbnailImageModal').modal('hide');
	}

	loadThumbnailImage() {
		this.showCropper = true;
	}

	cropThumbnailImage(event: ImageCroppedEvent) {
		this.croppedImage = event.base64;
	}

	saveThumbnail() {
		if (this.croppedImage != "") {
			this.formData.delete("thumbnailImage");
			let fileObj: any;
			fileObj = this.utilService.convertBase64ToFileObject(this.croppedImage);
			fileObj = this.utilService.blobToFile(fileObj);
			this.showDefaultLogo = false;
			this.formData.append("thumbnailImage", fileObj, this.uploadedThumbnailName );
			$('#thumbnailImageModal').modal('hide');
		} else {
			this.clearThumbnailImage();
		}
	}

	clearThumbnailImage() {
		this.formData.delete("thumbnailImage");
		$('#thumbnailFile').val('');
		if(this.isAdd){
			this.showDefaultLogo = true;
		}
		this.croppedImage = '';
		this.uploadedThumbnailName = "";
	}

	validateForm(columnName: string) {
		if (columnName == "assetName") {
			this.damUploadPostDto.validName = $.trim(this.damUploadPostDto.assetName) != undefined && $.trim(this.damUploadPostDto.assetName).length > 0;
		} else if (columnName == "description") {
            this.damUploadPostDto.validDescription = this.referenceService.validateCkEditorDescription(this.damUploadPostDto.description);
			this.updateDescriptionErrorMessage();
		}
		this.validateAllFields();
	}

	validateAllFields() {
		if(this.isAdd){
			let uploadedAssetValue = $('#uploadedAsset').val();
			this.isValidForm = this.damUploadPostDto.validName && this.damUploadPostDto.validDescription &&((uploadedAssetValue!=undefined && uploadedAssetValue.length > 0) || $.trim(this.uploadedAssetName).length>0 || $.trim(this.uploadedCloudAssetName).length>0 );
		}else{
			this.isValidForm = this.damUploadPostDto.validName && this.damUploadPostDto.validDescription;
		}
	}

	updateDescriptionErrorMessage(){
        let trimmedDescription = this.referenceService.getTrimmedCkEditorDescription(this.damUploadPostDto.description);
		if(trimmedDescription.length < 5000){
			this.descriptionErrorMessage = "";
		} else {
			this.descriptionErrorMessage = "Description can't exceed 5000 characters.";
		}
	}

	uploadOrUpdate() {
        this.damService.uploadAssetInProgress = true;
		this.getCkEditorData();
        this.customResponse = new CustomResponse();
		this.referenceService.goToTop();
		if(this.isAdd){
			this.referenceService.showSweetAlertProcessingLoader('Upload is in progress...');
		}else{
			this.referenceService.showSweetAlertProcessingLoader('We are updating details...');
			this.damUploadPostDto.id = this.id;
		}
		this.clearErrors();
		this.formLoader = true;
		this.damUploadPostDto.loggedInUserId = this.authenticationService.getUserId();
		this.damService.uploadOrUpdate(this.formData, this.damUploadPostDto,this.isAdd).subscribe(
			(result: any) => {
				swal.close();
                this.referenceService.assetResponseMessage = result.message;
				if (result.statusCode == 200) {
					if(this.isAdd){
						this.referenceService.isUploaded = true;
					}else{
						this.referenceService.isAssetDetailsUpldated = true;
					} 
                    if(this.damService.uploadAssetInProgress){
                        this.damService.uploadAssetInProgress = false;
                        this.goToManageDam();
                    }                   
				} else if (result.statusCode == 400) {
					this.customResponse = new CustomResponse('ERROR', result.message, true);
				} else if (result.statusCode == 404) {
					this.referenceService.showSweetAlertErrorMessage("Invalid Request");
				}else if (result.statusCode == 401) {
					this.dupliateNameErrorMessage = "Already exists";
                    this.formData.delete("damUploadPostDTO");
				}
				this.formLoader = false;
			}, error => {
				swal.close();
				this.formLoader = false;
				let statusCode = JSON.parse(error['status']);
				if (statusCode == 409) {
					this.dupliateNameErrorMessage = "Already exists";
				}else if(statusCode == 400){
                    let message = error['error']['message'];
                    this.customResponse = new CustomResponse('ERROR', message, true);
                }else {
					this.xtremandLogger.log(error);
					this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
				}
                this.formData.delete("damUploadPostDTO");
			});
	}
	
	uploadVideo() {
        this.damService.uploadAssetInProgress = true;
        this.getCkEditorData();
        this.referenceService.goToTop();
        this.clearErrors();
        this.damUploadPostDto.loggedInUserId = this.authenticationService.getUserId();
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
                          } else if (event.statusCode == 401) {
                        	  swal.close();
                              this.progress = 0;
                              this.processing = false;
                              this.dupliateNameErrorMessage = "Already exists";
                              this.formData.delete("damUploadPostDTO");
                              this.isDisableForm = false;
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
                              } else if (result.statusCode == 401) {
                                  this.progress = 0;
                                  this.dupliateNameErrorMessage = "Already exists";
                                  this.formData.delete("damUploadPostDTO");
                                  this.isDisableForm = false;
                              }
                          }
                	  }
                  }, error => {
                      swal.close();
                      this.formLoader = false;
                      let statusCode = JSON.parse(error['status']);
                      if (statusCode == 409) {
                          this.dupliateNameErrorMessage = "Already exists";
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
                            this.goToManageDam();
                        }
	                    }
	                } else if (result.statusCode == 400) {
	                    this.customResponse = new CustomResponse('ERROR', result.message, true);
	                } else if (result.statusCode == 404) {
	                    this.referenceService.showSweetAlertErrorMessage("Invalid Request");
	                }else if (result.statusCode == 401) {
	                    this.dupliateNameErrorMessage = "Already exists";
	                    this.formData.delete("damUploadPostDTO");
	                }
	                this.formLoader = false;
	            }, error => {
	                swal.close();
	                this.formLoader = false;
	                let statusCode = JSON.parse(error['status']);
	                if (statusCode == 409) {
	                    this.dupliateNameErrorMessage = "Already exists";
	                    this.formData.delete("damUploadPostDTO");
	                } else {
	                    this.xtremandLogger.log(error);
	                    this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
	                }
	            });
	}
	
	goToManageDam() {
        /********XNFR-169*********/
		this.loading = true;
        this.referenceService.navigateToManageAssetsByViewType(this.folderViewType,this.viewType,this.categoryId,false);
    }

	clearErrors() {
		this.dupliateNameErrorMessage = "";
		this.descriptionErrorMessage = "";
		this.customResponse = new CustomResponse();
	}

	showPreview(columnName: string) {
		this.previewItems = true;
		this.previewPath = columnName == "asset" ? this.damUploadPostDto.assetPath : this.damUploadPostDto.thumbnailPath;
	}

	closePreview() {
		this.previewItems = false;
		this.previewPath = "";
	}

	goToSelect(){
		this.loading = true;
		this.referenceService.goToRouter("home/dam/select");
	}

	closeCircle(){
		if(this.isAdd){
            this.loading = true;
			this.referenceService.goToRouter("home/dam/select");
		}else{
			this.goToManageDam();
		}
	}

 /*****************List Tags*******************/
 listTags(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
    pagination.maxResults = 0;
    let self = this;
    this.referenceService.startLoader(this.tagsLoader);
    this.userService.getTagsSearchTagName(pagination)
      .subscribe(
        response => {
          const data = response.data;
          this.tags = data.tags;
          let length = this.tags.length;
          if ((length % 2) == 0) {
            this.tagFirstColumnEndIndex = length / 2;
            this.tagsListFirstColumn = this.tags.slice(0, this.tagFirstColumnEndIndex);
            this.tagsListSecondColumn = this.tags.slice(this.tagFirstColumnEndIndex);
          } else {
            this.tagFirstColumnEndIndex = (length - (length % 2)) / 2;
            this.tagsListFirstColumn = this.tags.slice(0, this.tagFirstColumnEndIndex + 1);
            this.tagsListSecondColumn = this.tags.slice(this.tagFirstColumnEndIndex + 1);
          }
          this.referenceService.stopLoader(this.tagsLoader);
        },
        (error: any) => {
          this.customResponse = this.referenceService.showServerErrorResponse(this.tagsLoader);
          this.referenceService.stopLoader(this.tagsLoader);
        },
        () => this.xtremandLogger.info('Finished listTags()')
      );
  }

  searchTags() {
    let pagination: Pagination = new Pagination();
    pagination.searchKey = this.tagSearchKey;
    this.listTags(pagination);
  }

  tagEventHandler(keyCode: any) { if (keyCode === 13) { this.searchTags(); } }

  updateSelectedTags(tag: Tag, checked: boolean) {
    let index = this.damUploadPostDto.tagIds.indexOf(tag.id);
    if (checked == undefined) {
      if (index > -1) {
        this.damUploadPostDto.tagIds.splice(index, 1);
      } else {
        this.damUploadPostDto.tagIds.push(tag.id);
      }
    } else if (checked) {
      this.damUploadPostDto.tagIds.push(tag.id);
    } else {
      this.damUploadPostDto.tagIds.splice(index, 1);
    }
  }

  addTag() {
    this.openAddTagPopup = true;
  }

  resetTagValues(message: any) {
    this.openAddTagPopup = false;
    this.showSuccessMessage(message);
    this.listTags(new Pagination());
  }

  showSuccessMessage(message: any) {
    if (message != undefined) {
      this.customResponse = new CustomResponse('SUCCESS', message, true);
    }
  }

  onReady(event: any) {
    this.isCkeditorLoaded = true;
  }

  getCkEditorData() {
    if(CKEDITOR!=undefined){
		for (var instanceName in CKEDITOR.instances) {
			CKEDITOR.instances[instanceName].updateElement();
			this.damUploadPostDto.description = CKEDITOR.instances[instanceName].getData();
		}
	  }
  }
  // cloud content -- Google Drive code changes  
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
    
    setCloudContentValues(uploadedCloudAssetName:string, downloadLink:string) {
      if(uploadedCloudAssetName.lastIndexOf(".")==-1) {
        this.showValidExtensionErrorMessage();
      }else{
        if(!this.isAdd){
            let extension = this.referenceService.getFileExtension(uploadedCloudAssetName);
            if (extension == this.damUploadPostDto.assetType) {
                this.setFormDataAndCloudContentFileProperties(uploadedCloudAssetName, downloadLink);
            } else {
                this.uploadedCloudAssetName = "";
                this.tempr = null;
                this.clearPreviousSelectedAsset();
                this.showAssetErrorMessage('Invalid file type. Only ' + this.damUploadPostDto.assetType + " file is allowed.");
            }
        }else{
            this.setFormDataAndCloudContentFileProperties(uploadedCloudAssetName, downloadLink);
        }
        
        }
      }
    
    
    private setFormDataAndCloudContentFileProperties(uploadedCloudAssetName: string, downloadLink: string) {
        this.uploadedAssetName = "";
        this.uploadedCloudAssetName = "";
        this.formData.delete("uploadedFile");
        this.customResponse = new CustomResponse();
        this.uploadedCloudAssetName = uploadedCloudAssetName;
        this.damUploadPostDto.downloadLink = downloadLink;
        this.damUploadPostDto.oauthToken = this.tempr;
        this.damUploadPostDto.cloudContent = true;
        this.damUploadPostDto.fileName = this.uploadedCloudAssetName;
        if (!this.isAdd) {
            this.damUploadPostDto.id = this.id;
        }
        this.isVideoAsset = this.isVideo(this.uploadedCloudAssetName);
        this.validateAllFields();
    }

    // upload content from Webcam
    isIE() {
        const isInternetExplorar = navigator.userAgent;
        /* MSIE used to detect old browsers and Trident used to newer ones*/
        const is_ie = isInternetExplorar.indexOf("MSIE ") > -1 || isInternetExplorar.indexOf("Trident/") > -1;
        return is_ie;
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
    stop() {
        this.stopButtonShow = false; // hide the stop button
        this.testSpeedshow = true; // show the test speed button
        this.rageDisabled = false;
        $('#script-text').stop(true);
    }
    textAreaEmpty() {
        if (this.textAreaValue !== '') { this.testSpeeddisabled = false; }
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
    cameraChange() {
        if(this.isIE() || this.browserInfo.includes('edge') ){
          swal('Oops...',  'This Cam won\'t work in Internet explorar and edge browser!', 'error');
         }
        else {
        if (true) {
            this.camera = true;
            this.isFileDrop = true;
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
    
    fileDropDisabled() {
        this.isFileDrop = true;
    }
    fileDropEnabled() {
        this.isFileDrop = false;
    }
    
    uploadRecordedVideo() {
        if(this.player.record().getDuration() < 10) {
          this.recordCustomResponse = new CustomResponse( 'ERROR', 'Record Video length must be greater than 10 seconds', true );
         } else {
            if(!this.isAdd){
                if(this.damUploadPostDto.assetType=="mp4"){
                    this.setRecordedVideoFileProperties();
                }else{
                    this.removeRecordVideo();
                    this.recordModalPopupAfterUpload();
                    this.showAssetErrorMessage('Invalid file type. Only ' + this.damUploadPostDto.assetType + " file is allowed.");
                }
            }else{
                this.setRecordedVideoFileProperties();
            }
            
          }
       }

    private setRecordedVideoFileProperties() {
        try{
            this.RecordSave = true;
            this.saveVideo = false;
            this.discardVideo = false;
            this.testSpeeddisabled = true;
            this.closeModalId = false;
            this.textAreaDisable = false; // not using ,need to check
            this.hideSaveDiscard = false; // hide the save and discard buttons when the video processing
            this.formData.delete("uploadedFile");
            this.uploadedAssetName = "";
            this.uploadedCloudAssetName = "";
            this.customResponse = new CustomResponse();
            this.uploadedCloudAssetName = 'recorded_video.mp4';
            this.formData.append("uploadedFile", this.recordedVideo, this.recordedVideo.name);
            this.damUploadPostDto.cloudContent = false;
            this.damUploadPostDto.fileName = this.recordedVideo.name;
            this.damUploadPostDto.downloadLink = null;
            this.damUploadPostDto.oauthToken = null;
            this.damUploadPostDto.source = 'webcam';
            this.isVideoAsset = true;
            this.validateAllFields();
            (<HTMLInputElement>document.getElementById('script-text')).disabled = true;
            (<HTMLInputElement>document.getElementById('rangeDisabled')).disabled = true;
            $('.video-js .vjs-control-bar').hide();
            this.recordModalPopupAfterUpload();
        }catch(error){
            this.xtremandLogger.error('Error in upload video, uploadRecordedVideo method'+error);
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
           $('#myModal').modal('hide');
           $('body').removeClass('modal-open');
           $('.modal-backdrop fade in').remove();
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
           this.validateAllFields();
       }

/*****************List Categories*******************/
  listCategories() {
    this.loading = true;
    this.authenticationService.getCategoryNamesByUserId(this.loggedInUserId).subscribe(
      (data: any) => {
        this.categoryNames = data.data;
        if(this.isAdd){
            let category = this.categoryNames[0];
            this.damUploadPostDto.categoryId = category['id'];
        }
        this.loading = false;
        this.showFolderDropDown = true;
      },
      error => {
        this.loading = false;
        this.showFolderDropDown = true;
      });
  }
  getSelectedCategoryId(categoryId:number){
      this.damUploadPostDto.categoryId = categoryId;
  }

  openCreateFolderPopup(){
    this.addFolderModalPopupComponent.openPopup();
}

showFolderCreatedSuccessMessage(message:any){
   this.showFolderDropDown = false; 
   this.customResponse = new CustomResponse('SUCCESS',message, true);
   this.listCategories();
}

showValidExtensionErrorMessage(){
  this.uploadedCloudAssetName = "";
  this.tempr = null;
  this.clearPreviousSelectedAsset();
  this.customResponse = new CustomResponse('ERROR',"Selected asset does not have the proper extension. Please upload a valid asset.",true);
}

/****XNFR-255****/
setWhiteLabeled(event:any){
    this.damUploadPostDto.shareAsWhiteLabeledAsset = event;
}

/****XNFR-255***/
receivePartnerCompanyAndGroupsEventEmitterData(event:any){
    this.damUploadPostDto.partnerGroupIds = event['partnerGroupIds'];
    this.damUploadPostDto.partnerIds = event['partnerIds'];
    this.damUploadPostDto.partnerGroupSelected = event['partnerGroupSelected'];
    /****XNFR-342****/
    let isPartnerCompanyOrGroupSelected = this.damUploadPostDto.partnerGroupIds.length>0 || this.damUploadPostDto.partnerIds.length>0;
    if(this.isAdd){
        if(isPartnerCompanyOrGroupSelected){
            this.submitButtonText = "Save & Publish";
        }else{
            this.submitButtonText = "Save";
        }
    }else{
        if(isPartnerCompanyOrGroupSelected && !this.isAssetPublished){
            this.submitButtonText = "Update & Publish";
        }else{
            this.submitButtonText = "Update";
        }
    }
    /****XNFR-342****/
   
}

toggleContainWithinAspectRatio() {
    if(this.croppedImage!=''){
        this.containWithinAspectRatio = !this.containWithinAspectRatio;
    }else{
    this.showCropper = false;
    }
}
zoomOut() {
    if(this.croppedImage!=""){
      this.scale -= .1;
      this.transform = {
        ...this.transform,
        scale: this.scale       
      };
    }else{
      //this.errorUploadCropper = true;
      this.showCropper = false; 
    }
    }
    zoomIn() {
        if(this.croppedImage!=''){
                this.scale += .1;
                this.transform = {
                    ...this.transform,
                    scale: this.scale
                };
          
        }else{
            this.showCropper = false;
          //  this.errorUploadCropper = true;
            }
        }
        resetImage() {
            if(this.croppedImage!=''){
                    this.scale = 1;
                    this.rotation = 0;
                    this.canvasRotation = 0;
                    this.transform = {};
            }else{
                this.showCropper = false;
               // this.errorUploadCropper = true;
            }
            }
            imageCroppedMethod(event: ImageCroppedEvent) {
                this.croppedImage = event.base64;
                console.log(event, base64ToFile(event.base64));
                }
                imageLoaded() {
                    this.showCropper = true;
                    console.log('Image loaded')
                    }
                    cropperReady(sourceImageDimensions: Dimensions) {
                        console.log('Cropper ready', sourceImageDimensions);
                    }
                    loadImageFailed () {
                        console.log('Load failed');
                        }
                        closeModal() {
                            this.cropRounded = !this.cropRounded;
                            this.circleData = {};
                            this.imageChangedEvent = null;
                             this.croppedImage = '';
                          } 
                          closeImageUploadModal() {
                            this.cropRounded = !this.cropRounded;
                            this.imageChangedEvent = null;
                            this.croppedImage = '';
                            this.fileObj = null;
                            this.clearThumbnailImage();
                            $('#cropImage').modal('hide');
                          } 
                          fileBgImageChangeEvent(event){
                            const image:any = new Image();
                            const file:File = event.target.files[0];
                            const isSupportfile = file.type;
                            if (isSupportfile === 'image/jpg' || isSupportfile === 'image/jpeg' || isSupportfile === 'image/webp' || isSupportfile === 'image/png') {
                                this.errorUploadCropper = false;
                                this.imageChangedEvent = event;
                            } else {
                              this.errorUploadCropper = true;
                              this.showCropper = false;
                            }
                          }                    
}