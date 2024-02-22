import { Component, OnInit, EventEmitter, ViewChild, Output } from '@angular/core';
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
  loadingcrop = false;
  @Output() croppedImageEventEmitter = new EventEmitter<any>();
  aspectRatio = "16/9";
  constructor(public utilService: UtilService,public properties:Properties) { }

  ngOnInit() {
  }
  ngOnDestroy() {
    $('#cropImage').modal('hide');
  }
  /*****************Featured Image*******************/
  
  openModalPopup(moduleName:string) {
    this.cropRounded = false;
    this.fileSizeError = false;
    this.imageChangedEvent = null;
    if(this.properties.dashboardBanners==moduleName){
      this.aspectRatio = "6/1";
    }
    $('#cropImage').modal('show');
  }
  closeImageUploadModal() {
    this.cropRounded = !this.cropRounded;
    this.imageChangedEvent = null;
    this.croppedImage = '';
    this.fileObj = null;
    $('#cropImage').modal('hide');
  }
  filenewChangeEvent(event) {
    const image: any = new Image();
    const file: File = event.target.files[0];
    const isSupportfile = file.type;
    if (isSupportfile === 'image/jpg' || isSupportfile === 'image/jpeg' || isSupportfile === 'image/webp' || isSupportfile === 'image/png') {
      this.errorUploadCropper = false;
      this.imageChangedEvent = event;
    } else {
      this.errorUploadCropper = true;
      this.showCropper = false;
    }
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
  uploadImage() {
    this.croppedImageEventEmitter.emit(this.croppedImage);
    this.closeImageUploadModal();
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
  loadImageFailed() {
    console.log('Load failed');
  }
}
