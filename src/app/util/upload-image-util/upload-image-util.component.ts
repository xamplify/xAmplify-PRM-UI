import { Component, OnInit, EventEmitter, ViewChild, Output, Input } from '@angular/core';
import { Dimensions, ImageTransform } from 'app/common/image-cropper-v2/interfaces';
import { ImageCropperComponent } from 'ng2-img-cropper';
import { UtilService } from '../../core/services/util.service';
import { ImageCroppedEvent } from 'app/common/image-cropper/interfaces/image-cropped-event.interface';
import { base64ToFile } from 'app/common/image-cropper-v2/utils/blob.utils';
import { Properties } from 'app/common/models/properties';

declare var $:any;
@Component({
  selector: 'app-upload-image-util',
  templateUrl: './upload-image-util.component.html',
  styleUrls: ['./upload-image-util.component.css'],
  providers:[Properties]
})
export class UploadImageUtilComponent implements OnInit {

  loading = false;
  cropRounded = false;
  fileSizeError = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileObj: any;
  errorUploadCropper = false;
  showCropper = false;
  scale = 1;
  transform: ImageTransform = {};
  rotation = 0;
  canvasRotation = 0;
  containWithinAspectRatio = false;
  @ViewChild(ImageCropperComponent) cropper: ImageCropperComponent;
  isImageUploadIsInProgress = false;
  @Output() croppedImageEventEmitter = new EventEmitter<any>();
  aspectRatio = "16/9";
  @Input() moduleName:string="";
  errorMessage = "";
  constructor(public utilService: UtilService,public properties:Properties) { }

  ngOnInit() {
    this.openModalPopup()
  }
  ngOnDestroy() {
    $('#cropImageModal').modal('hide');
  }
  /*****************Featured Image*******************/
  
  openModalPopup() {
    this.cropRounded = false;
    this.fileSizeError = false;
    this.imageChangedEvent = null;
    if(this.properties.dashboardBanners==this.moduleName){
      this.aspectRatio = "6/1";
    }
    $('#cropImageModal').modal('show');
  }
  closeImageUploadModal() {
    this.cropRounded = !this.cropRounded;
    this.imageChangedEvent = null;
    this.croppedImage = '';
    this.fileObj = null;
    $('#cropImageModal').modal('hide');
  }

  uploadImage(event:any) {
    const file: File = event.target.files[0];
    const isSupportfile = file.type;
    this.errorMessage = "";
    if (isSupportfile === 'image/jpg' || isSupportfile === 'image/jpeg' || isSupportfile === 'image/webp' || isSupportfile === 'image/png') {
      this.errorUploadCropper = false;
      this.imageChangedEvent = event;
      this.isImageUploadIsInProgress = true;
    } else {
      this.showErrorMessage("Please upload only image");
    }

    if(!this.errorUploadCropper){
      let sizeInKb = file.size / 1024;
			let maxFileSizeInKb = 1024 * 10;
      if (sizeInKb >= maxFileSizeInKb) {
        this.showErrorMessage("Max file size 10 MB");
      }else{
        this.errorUploadCropper = false;
        this.imageChangedEvent = event;
        this.isImageUploadIsInProgress = true;
      }
    }

  }
  private showErrorMessage(message: string) {
    this.errorUploadCropper = true;
    this.showCropper = false;
    this.imageChangedEvent = null;
    this.isImageUploadIsInProgress = false;
    this.errorMessage = message;
  }

  zoomOut() {
    if (this.croppedImage != "") {
      this.scale -= .1;
      this.transform = {
        ...this.transform,
        scale: this.scale
      };
    } else {
      this.showCropper = false;
    }
  }
  zoomIn() {
    if (this.croppedImage != '') {
      this.scale += .1;
      this.transform = {
        ...this.transform,
        scale: this.scale
      };

    } else {
      this.showCropper = false;
    }
  }
  resetImage() {
    if (this.croppedImage != '') {
      this.scale = 1;
      this.rotation = 0;
      this.canvasRotation = 0;
      this.transform = {};
    } else {
      this.showCropper = false;
    }
  }
  toggleContainWithinAspectRatio() {
    if (this.croppedImage != '') {
      this.containWithinAspectRatio = !this.containWithinAspectRatio;
    } else {
      this.showCropper = false;
    }
  }
  saveImage() {
    this.croppedImageEventEmitter.emit(this.croppedImage);
    this.closeImageUploadModal();
  }

  imageCroppedMethod(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    this.showCropper = true;
    setTimeout(() => {
      this.isImageUploadIsInProgress= false;
    }, 500);
    
  }
  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }
  loadImageFailed() {
  }
}
