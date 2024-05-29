import { Component, OnInit,Input,Output,EventEmitter, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { DamService } from 'app/dam/services/dam.service';
declare var $,swal;

@Component({
  selector: 'app-preview-asset-popup',
  templateUrl: './preview-asset-popup.component.html',
  styleUrls: ['./preview-asset-popup.component.css']
})
export class PreviewAssetPopupComponent implements OnInit,OnDestroy {
  imageLoading: boolean;
  assetPath: string;
  modalPopupLoader: boolean;
  beeTemplatePreview: any;
  @Input() asset:any;
  @Output() previewAssetPopupEmitter = new EventEmitter();
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,
    public xtremandLogger:XtremandLogger,public damService:DamService) { }

  ngOnInit() {
	if(this.asset.beeTemplate){
        this.referenceService.previewAssetPdfInNewTab(this.asset.id);
      }else{
        this.preview(this.asset);
      }
  }
  ngOnDestroy(): void {
	$("#asset-preview-modal").modal('hide');
	this.hidePopup();
}

  preview(asset:any){
		this.imageLoading = false;
		let htmlContent = "#asset-preview-content";
		$(htmlContent).empty();
		this.assetPath = "";
		$('#assetTitle').val('');
		this.referenceService.setModalPopupProperties();
		$("#asset-preview-modal").modal('show');
		this.modalPopupLoader = true;
		this.damService.previewAssetById(asset.id).subscribe(
			(response:any) =>{
				this.imageLoading = true;
				let assetDetails = response.data;
				this.beeTemplatePreview = assetDetails.beeTemplate;
				if(assetDetails.beeTemplate){
					$(htmlContent).append(assetDetails.htmlBody);
				}else{
					this.assetPath = assetDetails.assetPath;
				}
				$('#assetTitle').text(assetDetails.name);
				this.modalPopupLoader = false;
			},(error:any) =>{
				swal("Please Contact Admin!", "Unable to show  preview", "error"); 
				this.modalPopupLoader = false;
				this.xtremandLogger.log(error);
				$("#asset-preview-modal").modal('hide');
			}
		);
	}
	
	
	hidePopup(){
		this.previewAssetPopupEmitter.emit();
	 }

}
