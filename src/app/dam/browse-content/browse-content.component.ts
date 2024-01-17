import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { ReferenceService } from 'app/core/services/reference.service';
import { DamUploadPostDto } from '../models/dam-upload-post-dto';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Properties } from '../../common/models/properties';

declare var $:any;
@Component({
  selector: 'app-browse-content',
  templateUrl: './browse-content.component.html',
  styleUrls: ['./browse-content.component.css','../upload-asset/upload-asset.component.css'],
  providers:[Properties]
})
export class BrowseContentComponent implements OnInit {

  isAdd:boolean;
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
  constructor(public referenceService:ReferenceService,public sanitizer: DomSanitizer,private router: Router,public properties:Properties) { }

  ngOnInit() {
    this.isAdd = this.router.url.indexOf('/upload') > -1;
		this.headerText = this.isAdd ? 'Upload Asset' : 'Edit Asset';
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
        }else if(sizeInKb>maxFileSizeInKb){
          this.showAssetErrorMessage('Max file size is 800 MB');
        }else if(file['name'].lastIndexOf(".")==-1) {
                  this.showValidExtensionErrorMessage();
              }else if(!this.isAdd){
                  this.validateExtensionType(file);
              }else{
                  this.setUploadedFileProperties(file);
        }
      }else{
        this.clearPreviousSelectedAsset();
      }
    /***XNFR-434****/ 
      this.callEmitter();
    /***XNFR-434****/ 
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
    if (extension == this.damUploadPostDto.assetType) {
        this.setUploadedFileProperties(file);
    } else {
        this.showAssetErrorMessage('Invalid file type. Only ' + extension + " file is allowed.");
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

callEmitter(){
  let emitter = {};
  emitter['damUploadPostDto'] = this.damUploadPostDto;
  emitter['formData'] = this.formData;
  emitter['customResponse'] = this.customResponse;
  this.browseContentEventEmitter.emit(emitter);
}



}
