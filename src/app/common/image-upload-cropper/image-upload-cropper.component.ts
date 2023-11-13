import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Dimensions, ImageCroppedEvent } from '../image-cropper/interfaces';
import { ImageTransform } from '../image-cropper-v2/interfaces';
import { UtilService } from 'app/core/services/util.service';

declare var $:any;
@Component({
  selector: 'app-image-upload-cropper',
  templateUrl: './image-upload-cropper.component.html',
  styleUrls: ['./image-upload-cropper.component.css']
})
export class ImageUploadCropperComponent implements OnInit {
  @Input() aspectRatio:any;
  @Output() bgImage = new EventEmitter<any>();
  loading:boolean = false;
  cropRounded = false;
  squareData:any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  squareDataForBgImage: any;
  croppedImageForBgImage: any = '';
  bgImageChangedEvent: any = '';
  companyBgImagePath = "";
  cropLogoImageText:string;

  errorUploadCropper = false;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  scale = 1;
  canvasRotation = 0;
  rotation = 0;

  loadingcrop = false;
  constructor(public utilService:UtilService) { }
 
  ngOnInit() {

  }
  closeModal() {
    this.cropRounded = !this.cropRounded;
    this.squareData = {};
    this.imageChangedEvent = null;
    this.croppedImage = '';
    this.croppedImageForBgImage = '';
    this.squareDataForBgImage = {};
    this.bgImageChangedEvent = null;
  }
  imageClick() {
    this.cropLogoImageText = "Choose the image to be used as your company logo";
    this.fileChangeEvent();
  }
  fileChangeEvent() { this.cropRounded = false; $('#cropLogoImage').modal('show'); }
  uploadfileBgImageChangeEvent(event){
    const image:any = new Image();
    const file:File = event.target.files[0];
    const isSupportfile = file.type;
    if (isSupportfile === 'image/jpg' || isSupportfile === 'image/jpeg' || isSupportfile === 'image/webp' || isSupportfile === 'image/png') {
        this.errorUploadCropper = false;
        this.bgImageChangedEvent = event;
        this.showCropper = false
    } else {
      this.errorUploadCropper = true;
      this.showCropper = false;
    }
  }

  toggleContainWithinAspectRatio() {
    if(this.croppedImage!=''){
        this.containWithinAspectRatio = !this.containWithinAspectRatio;
}else{
    this.showCropper = false;
    }
}
toggleContainWithinAspectRatioBgImage() {
    if(this.croppedImageForBgImage!=''){
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
  this.showCropper = false; 
}
}
zoomOutBgImage() {
    if(this.croppedImageForBgImage!=""){
  this.scale -= .1;
  this.transform = {
    ...this.transform,
    scale: this.scale       
  };
}else{
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
    }
}
zoomInBgImage() {
    if(this.croppedImageForBgImage!=''){
        this.scale += .1;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
  
}else{
    this.showCropper = false;
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
}
}
resetImageBgImage() {
    if(this.croppedImageForBgImage!=''){
        this.scale = 1;
        this.rotation = 0;
        this.canvasRotation = 0;
        this.transform = {};
}else{
    this.showCropper = false;
}
}
bgImageCroppedMethod(event: ImageCroppedEvent) {
  this.croppedImageForBgImage = event.base64;
  this.squareDataForBgImage=event.base64;
  console.log(event);
}
uploadBgImage(){
  this.bgImage.emit(this.croppedImageForBgImage);
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
}
