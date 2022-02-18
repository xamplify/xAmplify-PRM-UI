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

declare var $, swal, CKEDITOR: any, gapi, google;

@Component({
	selector: 'app-upload-asset',
	templateUrl: './upload-asset.component.html',
	styleUrls: ['./upload-asset.component.css'],
	providers: [Properties, Pagination, HttpRequestLoader]
})
export class UploadAssetComponent implements OnInit,OnDestroy {
	
	formLoader = false;
	customResponse: CustomResponse = new CustomResponse();
	damUploadPostDto: DamUploadPostDto = new DamUploadPostDto();
	formData: any = new FormData();
	loading = false;
	dupliateNameErrorMessage: string;
	descriptionErrorMessage: string;
	isValidForm = false;
	submitButtonText = "Submit";
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
	 tempr: any;
	pickerApiLoaded = false;
	picker: any;
	cloudStorageSelected = false;	
	sweetAlertDisabled : boolean;
	uploadedCloudAssetName = "";
	

	constructor(private utilService: UtilService, private route: ActivatedRoute, private damService: DamService, public authenticationService: AuthenticationService,
	public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties, public userService: UserService,
	public videoFileService: VideoFileService){
		
		$('head').append('<script src="https://apis.google.com/js/api.js" type="text/javascript"  class="r-video"/>');
	}
	
	ngOnInit() {
		this.isAdd = this.router.url.indexOf('/upload') > -1;
		this.showDefaultLogo = this.isAdd;
		this.headerText = this.isAdd ? 'Upload Asset' : 'Edit Asset';
		if (!this.isAdd) {
			this.id = this.route.snapshot.params['id'];
			this.getAssetDetailsById(this.id);
			this.submitButtonText = "Update";
		}
		this.loggedInUserId = this.authenticationService.getUserId();
		this.listTags(new Pagination());
	}

	ngOnDestroy(): void {
		$('#thumbnailImageModal').modal('hide');
		this.openAddTagPopup = false;
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

	chooseAsset(event: any) {
		this.invalidAssetName = false;
		let files: Array<File>;
		if ( event.target.files!=undefined ) {
			 files = event.target.files; 
		}else if ( event.dataTransfer.files ) { 
			files = event.dataTransfer.files;
		 }
		if (files.length > 0) {
			this.formData.delete("uploadedFile");
			this.uploadedAssetName  = "";
			
			this.customResponse = new CustomResponse();
			let file = files[0];
			let sizeInKb = file.size / 1024;
			let maxFileSizeInKb = 1024 * 800;
			if(sizeInKb==0){
				this.showAssetErrorMessage('Invalid File');
			}else if(sizeInKb>maxFileSizeInKb){
				this.showAssetErrorMessage('Max file size is 800 MB');
			}else{
				this.formData.append("uploadedFile", file, file['name']);
				this.uploadedAssetName = file['name'];
				this.damUploadPostDto.cloudContent = false;
				this.damUploadPostDto.fileName = this.uploadedAssetName;
				this.uploadedCloudAssetName = "";
	            this.damUploadPostDto.downloadLink = null;
	            this.damUploadPostDto.oauthToken = null;
			}
		}else{
			this.clearPreviousSelectedAsset();
		}
		this.validateAllFields();
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
				this.imageSelected = event;
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
			this.formData.append("thumbnailImage", fileObj, fileObj['name']);
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
			this.damUploadPostDto.validDescription = $.trim(this.damUploadPostDto.description) != undefined && $.trim(this.damUploadPostDto.description).length > 0 && $.trim(this.damUploadPostDto.description).length < 5000;
			this.updateDescriptionErrorMessage();
		}
		this.validateAllFields();
	}

	validateAllFields() {
		if(this.isAdd){
			let uploadedAssetValue = $('#uploadedAsset').val();
			this.isValidForm = this.damUploadPostDto.validName && this.damUploadPostDto.validDescription &&((uploadedAssetValue!=undefined && uploadedAssetValue.length > 0) || $.trim(this.uploadedAssetName).length>0);
		}else{
			this.isValidForm = this.damUploadPostDto.validName && this.damUploadPostDto.validDescription;
		}
	}

	updateDescriptionErrorMessage(){
		if($.trim(this.damUploadPostDto.description).length < 5000){
			this.descriptionErrorMessage = "";
		} else {
			this.descriptionErrorMessage = "Description can't exceed 5000 characters.";
		}
	}

	uploadOrUpdate() {
		this.getCkEditorData();
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
		console.log(this.damUploadPostDto);
		this.damService.uploadOrUpdate(this.formData, this.damUploadPostDto,this.isAdd).subscribe(
			(result: any) => {
				swal.close();
				if (result.statusCode == 200) {
					if(this.isAdd){
						this.referenceService.isUploaded = true;
					}else{
						this.referenceService.isAssetDetailsUpldated = true;
					}
					this.referenceService.goToRouter("home/dam/manage");
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
		this.loading = true;
		this.referenceService.goToRouter("home/dam/manage");
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
		this.loading = true;
		if(this.isAdd){
			this.referenceService.goToRouter("home/dam/select");
		}else{
			this.referenceService.goToRouter("home/dam/manage");
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
    console.log(this.damUploadPostDto.tagIds)
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
  // clound content code changes  
  googleDriveChange() {
      try {
          this.videoFileService.hasVideoAccess(this.loggedInUserId)
              .subscribe(
              (result: any) => {
                  if (result.access) {
                      //this.sweetAlertMesg = 'Drive';
                     // if (this.uploader.queue.length === 0) {
                          this.onApiLoad();
                      //}
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
          /*swal({
              text: 'Thanks   for waiting while   we retrieve your video from Google Drive',
              allowOutsideClick: false, showConfirmButton: false, imageUrl: 'assets/images/loader.gif'
          });*/
          this.uploadedAssetName  = "";
          this.formData.delete("uploadedFile");
          this.uploadedCloudAssetName = "";
          this.customResponse = new CustomResponse();
          //
          this.uploadedCloudAssetName = doc.name;
          this.damUploadPostDto.downloadLink = 'https://www.googleapis.com/drive/v3/files/' + doc.id + '?alt=media';
          this.damUploadPostDto.oauthToken = this.tempr;
          this.damUploadPostDto.cloudContent = true;
          this.damUploadPostDto.fileName = this.uploadedAssetName;
          //self.downloadGDriveFile(doc.id, doc.name);
      } else if (data[google.picker.Response.ACTION] === google.picker.Action.CANCEL) {
          self.picker.setVisible(false);
          self.picker.dispose();
      }
    }catch(error) {this.xtremandLogger.error('Error in upload video pickerCallback'+error);swal.close(); }
  }
  // // clound content code changes - dropBox
  
  
  
  
  
  
  
}
