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
import { BrowseContentComponent } from 'app/util/browse-content/browse-content.component';



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
    @ViewChild('browseContentComponent') browseContentComponent: BrowseContentComponent;

	constructor(private utilService: UtilService, private route: ActivatedRoute, private damService: DamService, public authenticationService: AuthenticationService,
	public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties, public userService: UserService,
	public videoFileService: VideoFileService,  public deviceService: Ng2DeviceService, public sanitizer: DomSanitizer,public callActionSwitch:CallActionSwitch){
        
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
        this.browseContentComponent.clearUploadedFile();

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

/***XNFR-434***/
browseContentEventReceiver(event:any){
    this.formData = event['formData'];
    this.damUploadPostDto = event['damUploadPostDto'];
    this.customResponse = event['customResponse'];
    this.isVideoAsset = event['isVideoAsset'];
    this.uploadedCloudAssetName = event['uploadedCloudAssetName'];
    this.camera = event['camera'];
    this.playerInit = event['playerInit'];
    this.picker = event['picker'];
    this.player = event['player'];
    this.videoPreviewPath = event['videoPreviewPath'];
    this.showVideoPreview = event['showVideoPreview'];
    this.fileSize = event['fileSize'];
    this.isDisable = event['isDisable'];
    this.uploadedAssetName = event['uploadedAssetName'];
    this.validateAllFields();
}


}