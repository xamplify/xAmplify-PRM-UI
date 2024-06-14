import { Component, Input, OnInit } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { UtilService } from 'app/core/services/util.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { ThemeDto } from 'app/dashboard/models/theme-dto';
declare var $: any;
@Component({
  selector: 'app-background-image-upload',
  templateUrl: './background-image-upload.component.html',
  styleUrls: ['./background-image-upload.component.css']
})
export class BackgroundImageUploadComponent implements OnInit {
  @Input() type: any;
  isShowUploadScreenForLight: boolean;
  isShowUploadScreenForDark: boolean;
  cropRounded: boolean;
  aspectRatio: any;
  resizeToWidth: any;
  croppedImageForBgImage: any;
  loadingcrop = false;
  logoErrorMessage = "";
  logoError = false;
  errorUploadCropper = false;
  showCropper = false;
  customResponse: CustomResponse = new CustomResponse();
  circleData: any;
  imageChangedEvent: any;
  croppedImage = '';
  uploadLightImagePath: any;
  uploadDarkImagePath: any;
  bgImagePathForLight: any;
  bgImagePathForDark: any;
  themeDto: ThemeDto = new ThemeDto();
  constructor(public utilService: UtilService, public properties: Properties, private dashboardService: DashboardService, public authenticationService: AuthenticationService) { }

  ngOnInit() {
  }
  uploadImage(type: any) {
    this.isShowUploadScreenForLight = false;
    this.isShowUploadScreenForDark = false;
    this.cropRounded = false;
    if (type == 'LIGHT') {
      this.isShowUploadScreenForLight = true;
    } else {
      this.isShowUploadScreenForDark = true;
    }
    this.aspectRatio = (16 / 9);
    this.resizeToWidth = 1280;
    $('#cropBgImage').modal('show');
  }
  backgroundImage(event: any) {
    this.croppedImageForBgImage = event;
    if (this.croppedImageForBgImage != "") {
      this.loadingcrop = true;
      let fileObj: any;
      fileObj = this.utilService.convertBase64ToFileObject(this.croppedImageForBgImage);
      fileObj = this.utilService.blobToFile(fileObj);
      this.processBgImageFile(fileObj);
    } else {
      this.errorUploadCropper = false;
      this.showCropper = false;
    }
  }
  processBgImageFile(fileObj: File) {
    this.dashboardService.uploadBgImageFile(fileObj).subscribe(result => {
      if (result.statusCode === 200) {
        if (this.isShowUploadScreenForLight) {
          this.bgImagePathForLight = result.data;
          this.uploadLightImagePath = this.authenticationService.MEDIA_URL + result.data;
          this.isShowUploadScreenForLight = false;
        } else {
          this.bgImagePathForDark = result.data;
          this.uploadDarkImagePath = this.authenticationService.MEDIA_URL + result.data;
          this.isShowUploadScreenForDark = false;
        }
        this.logoError = false;
        this.logoErrorMessage = "";
        $('#cropBgImage').modal('hide');
      }
    }, error => {
      console.log(error);
      $('#cropBgImage').modal('hide');
      this.customResponse = new CustomResponse('ERROR', this.properties.SOMTHING_WENT_WRONG, true)
    },
      () => {
        this.loadingcrop = false;
        $('#cropBgImage').modal('hide');
        this.closeModal();
      });
  }
  closeModal() {
    this.cropRounded = !this.cropRounded;
    this.circleData = {};
    this.imageChangedEvent = null;
    this.croppedImage = '';
  }

  updateImage(type: any) {
    if (type == 'LIGHT') {
      this.themeDto.parentThemeName = 'GLASSMORPHISMLIGHT';
      this.themeDto.backgroundImagePath = this.bgImagePathForLight;
    } else {
      this.themeDto.parentThemeName = 'GLASSMORPHISMDARK';
      this.themeDto.backgroundImagePath = this.bgImagePathForDark;
    }
    this.dashboardService.saveOrUpdateDefaultImages(this.themeDto).subscribe(
      result => {
        if (result.statusCode == 200) {
          this.customResponse = new CustomResponse('SUCESS', result.message, true)
        }
      }, error => {
        this.customResponse = new CustomResponse('ERROR', this.properties.SOMTHING_WENT_WRONG, true)
      }, () => {
      });
  }

}
