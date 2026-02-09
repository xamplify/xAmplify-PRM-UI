import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { ReferenceService } from 'app/core/services/reference.service';
import { DamService } from 'app/dam/services/dam.service';

@Component({
  selector: 'app-preview-content-modal-popup',
  templateUrl: './preview-content-modal-popup.component.html',
  styleUrls: ['./preview-content-modal-popup.component.css'],
  providers: [DamService]
})
export class PreviewContentModalPopupComponent implements OnInit {

  @Input() assetId:any;
  @Output() notifyClose = new EventEmitter();
  ngxLoading: boolean;
  proxyAssetPath: any;
  fileType: any;
  isTextFormat: any;
  isImageFormat: any;
  customResponse: CustomResponse = new CustomResponse();

  constructor(public referenceService: ReferenceService, public damService: DamService) { }

  ngOnInit() {
    this.referenceService.openModalPopup('addPreviewContentModalPopup');
    this.fetchAssetDetails();
  }

  private fetchAssetDetails() {
    this.ngxLoading = true;
    this.damService.getAssetById(this.assetId).subscribe(
      response => {
        if (response.statusCode == 200) {
          let data = response.data;
          if (data.contentPreviewType || data.imageFileType) {
            if (data.assetProxyPath) {
              this.proxyAssetPath = data.assetProxyPath + data.assetPath;
            } else {
              this.proxyAssetPath = data.assetPath;
            }
            this.isImageFormat = data.imageFileType;
            this.isTextFormat = data.textFileType;
            this.fileType = data.assetType;
          } else {
            this.ngxLoading = false;
            this.customResponse = new CustomResponse('INFO', "Preview unavailable...", true);
          }
          this.ngxLoading = false;
        } else {
          this.customResponse = new CustomResponse('ERROR', "Failed to preview the asset", true);
          this.ngxLoading = false;
        }
      }, error => {
        this, this.ngxLoading = false;
        this.customResponse = new CustomResponse('ERROR', "Oops! Something went wrong.Please try after sometime", true);
      }
    );
  }

  closeModal() {
    this.referenceService.closeModalPopup('addPreviewContentModalPopup');
    this.notifyClose.emit();
  }

}
