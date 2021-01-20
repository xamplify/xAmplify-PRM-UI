import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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

declare var $, swal: any;

@Component({
	selector: 'app-upload-asset',
	templateUrl: './upload-asset.component.html',
	styleUrls: ['./upload-asset.component.css'],
	providers: [Properties]
})
export class UploadAssetComponent implements OnInit {
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
	constructor(private utilService: UtilService, private route: ActivatedRoute, private damService: DamService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties) { }
	ngOnInit() {
		this.isAdd = this.router.url.indexOf('/upload') > -1;
		this.showDefaultLogo = this.isAdd;
		this.headerText = this.isAdd ? 'Upload Asset' : 'Edit Asset';
		if (!this.isAdd) {
			this.id = this.route.snapshot.params['id'];
			this.getAssetDetailsById(this.id);
			this.submitButtonText = "Update";
		}
	}

	getAssetDetailsById(selectedAssetId: number) {
		this.formLoader = true;
		this.initLoader = true;
		this.damService.getAssetDetailsById(selectedAssetId).
			subscribe(
				(result: any) => {
					if(result.statusCode==200){
						this.damUploadPostDto = result.data;
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
		if ( event.target.files!=undefined ) { files = event.target.files; }
		else if ( event.dataTransfer.files ) { files = event.dataTransfer.files; }
		if (files.length > 0) {
			this.formData.delete("uploadedFile");
			this.uploadedAssetName  = "";
			this.customResponse = new CustomResponse();
			let file = files[0];
			let sizeInKb = file.size / 1024;
			let maxFileSizeInKb = 1024 * 800;
			if(sizeInKb>maxFileSizeInKb){
				this.showAssetErrorMessage('Max file size is 800 MB');
			}else{
				console.log(file);
				this.formData.append("uploadedFile", file, file['name']);
				this.uploadedAssetName = file['name'];
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
			this.damUploadPostDto.validDescription = $.trim(this.damUploadPostDto.description) != undefined && $.trim(this.damUploadPostDto.description).length > 0;
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


	uploadOrUpdate() {
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



}
