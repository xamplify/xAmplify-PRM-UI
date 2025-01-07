import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { UtilService } from 'app/core/services/util.service';
import { ImageCropperComponent } from 'app/common/image-cropper/component/image-cropper.component';
import { ImageCroppedEvent } from 'app/common/image-cropper-v2/interfaces/image-cropped-event.interface';
import { base64ToFile } from 'app/common/image-cropper-v2/utils/blob.utils';
import { Dimensions, ImageTransform } from 'app/common/image-cropper-v2/interfaces';
import { ReferenceService } from 'app/core/services/reference.service';
import { MY_PROFILE_MENU_CONSTANTS } from 'app/constants/my-profile-menu-constants';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit {

  @Input() moduleName: string;
  @Output() uploadImageCloseModalPopUpEventEmitter = new EventEmitter();
  squareCropperSettings: any;
  squareData: any;
  cropRounded = false;
  loadingcrop = false;
  errorUploadCropper = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  isCropperVisible = false;
  headerText = "";
  imageUrl = "";
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  scale = 1;
  minScale: number = 0.1;
  canvasRotation = 0;
  rotation = 0;
  signatureMenuHeader = MY_PROFILE_MENU_CONSTANTS.SIGNATURE_MENU_HEADER;
  constructor(private authenticationService: AuthenticationService, private utilService: UtilService,private referenceService:ReferenceService) { }

  ngOnInit() {
    this.referenceService.openModalPopup("uploadImage-modal");
    if(this.signatureMenuHeader==this.moduleName){
      this.headerText = "Upload Your Signature";
    }
  }

  closeModalAndResetValues() {
    this.cropRounded = !this.cropRounded;
    this.squareData = {};
    this.imageChangedEvent = null;
    this.croppedImage = '';
    this.showCropper = false;
    this.isCropperVisible = false;
    this.uploadImageCloseModalPopUpEventEmitter.emit();
  }

  reCropImage() {
    const savedImageUrl = this.authenticationService.MEDIA_URL + this.imageUrl;
    const dynamicFilename = this.imageUrl.split('/').pop() || 'default-image.png';
    this.isCropperVisible = true;
    this.utilService.fetchImageAsBlob(savedImageUrl).then(blob => {
      const file = new File([blob], dynamicFilename, { type: blob.type });
      this.imageChangedEvent = {
        target: {
          files: [file]
        }
      };
      this.showCropper = true;
      this.isCropperVisible = true;
    }).catch(err => console.error('Failed to fetch the saved image:', err));
    this.isCropperVisible = false;
  }

  uploadImage(event: any) {
    this.loadingcrop = true;
    const image: any = new Image();
    const file: File = event.target.files[0];
    const isSupportfile = file.type;
    if (isSupportfile === 'image/jpg' || isSupportfile === 'image/jpeg' || isSupportfile === 'image/webp' || isSupportfile === 'image/png') {
      this.errorUploadCropper = false;
      this.imageChangedEvent = event;
      this.isCropperVisible = true;
    } else {
      this.errorUploadCropper = true;
      this.showCropper = false;
      this.isCropperVisible = false;
      this.loadingcrop = false;
    }
  }

  cropImage(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log(event, base64ToFile(event.base64));
  }
  loadImage() {
    this.loadingcrop = false;
    this.showCropper = true;
    console.log('Image loaded')
  }
  loadCropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }
  loadImageFailed() {
    console.log('Load failed');
  }

  toggleContainWithinAspectRatio() {
    if (this.croppedImage != '') {
      this.containWithinAspectRatio = !this.containWithinAspectRatio;
    } else {
      this.showCropper = false;
    }
  }

  zoomOut() {
    if (this.croppedImage != "") {
      this.scale = Math.max(this.scale - 0.1, this.minScale);
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


  saveCroppedImage(){
    if(this.croppedImage!=""){
      this.loadingcrop = true;
      let fileObj:any;
      fileObj = this.utilService.convertBase64ToFileObject(this.croppedImage);
      fileObj = this.utilService.blobToFile(fileObj);
      console.log(fileObj);
    }else{
      this.errorUploadCropper = false;
      this.showCropper = false;
    }
  }

}
