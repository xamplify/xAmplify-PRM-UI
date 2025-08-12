import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { ActionsDescription } from '../../../common/models/actions-description';
import { ActivatedRoute } from '@angular/router';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { FontAwesomeClassName } from 'app/common/models/font-awesome-class-name';
import { Properties } from 'app/common/models/properties';

declare var $:any,swal:any;
@Component({
  selector: 'app-asset-grid-view-actions',
  templateUrl: './asset-grid-view-actions.component.html',
  styleUrls: ['./asset-grid-view-actions.component.css'],
  providers: [ActionsDescription,Properties]
})
export class AssetGridViewActionsComponent implements OnInit {
  readonly XAMPLIFY_CONSTANTS = XAMPLIFY_CONSTANTS;
  @Input() isPartnerView:boolean = false;
  @Input() asset: any;
  @Input() isFromTop4Assets: boolean = false;
  @Output() assetGridViewActionsEmitter = new EventEmitter();
  @Output() assetGridViewActionsPdfEmitter = new EventEmitter();
  @Output() assetGridViewActionsDeleteActionEmitter = new EventEmitter();
  @Output() assetGridViewRefreshListEmitter = new EventEmitter();
  @Output() assetGridViewCommentStatusHistoryEmitter = new EventEmitter();
  @Output() assetGridViewAssetPreviewEmitter = new EventEmitter();
  @Input() FromOliverPopUp: boolean = false;

  hasCampaignRole = false;
  hasAllAccess = false;
  loggedInUserId: number = 0;
  /****XNFR-169****/
  viewType: string;
  categoryId: number;
  folderViewType: string;
  @Input() folderListView = false;
  /***XNFR-381***/
  isChildTemplatesRouter = false;

  fontAwesomeClassName:FontAwesomeClassName = new FontAwesomeClassName();
  SendAssetToOliver: any;
  isOliverCalled: boolean;
  
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,
    public xtremandLogger:XtremandLogger, public actionsDescription:ActionsDescription,private route: ActivatedRoute,public properties: Properties) {
	  this.loggedInUserId = this.authenticationService.getUserId();
    /****XNFR-169****/
    this.viewType = this.route.snapshot.params['viewType'];
		this.categoryId = this.route.snapshot.params['categoryId'];
		this.folderViewType = this.route.snapshot.params['folderViewType'];
    this.isChildTemplatesRouter = this.referenceService.getCurrentRouteUrl().indexOf("/history")>-1;
  }

  ngOnInit() {
	  this.hasCampaignRole = this.referenceService.hasRole(this.referenceService.roles.campaignRole);
    this.hasAllAccess = this.referenceService.hasAllAccess();
  }

  viewGirdHistory(asset:any){
    this.referenceService.navigateToRouterByViewTypes("/home/dam/history/"+asset.id,this.categoryId,this.viewType,this.folderViewType,this.folderListView);
  }

  addOrEdit(id: number) {
		if (this.isPartnerView) {
			this.referenceService.navigateToRouterByViewTypes("/home/dam/editp/" + id,this.categoryId,this.viewType,this.folderViewType,this.folderListView);
		} else {
			this.referenceService.navigateToRouterByViewTypes("/home/dam/edit/" + id,this.categoryId,this.viewType,this.folderViewType,this.folderListView);
		}
	}

  editDetails(asset:any){
	  this.setEventEmittersByType(asset,"edit");
  }

  preview(asset:any){
   if (this.referenceService.isVideo(asset.assetType)) {
    let url = "/home/dam/previewVideo/" + asset.videoId + "/" + asset.id;
    this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.viewType, this.folderViewType, this.folderListView);
  } else if(asset.beeTemplate) {
    this.referenceService.previewAssetPdfInNewTab(asset.id);
  }else{
     const nonImageFormats = ['pdf', 'pptx', 'doc', 'docx', 'ppt', 'xlsx'];
     let isNonImageFormat = nonImageFormats.includes(asset.assetType);
     if (asset.contentPreviewType || asset.imageFileType) {
       if(this.isFromTop4Assets){
        this.referenceService.preivewAssetOnNewHost(asset.id);
       } else {
        this.assetGridViewAssetPreviewEmitter.emit(asset);
       }
     } else {
       this.referenceService.preivewAssetOnNewHost(asset.id);
     }
  }
  }

  openPublishPopup(asset:any){
    this.setEventEmittersByType(asset,"publishPopup");
  }
  
  campaignRouter(asset:any){
	  this.setEventEmittersByType(asset,"campaign");
  }

  setEventEmittersByType(asset: any, type: string) {
    let input = {};
    if ("preview" == type) {
      input['preview'] = true;
    } else if ("publishPopup" == type) {
      input['publishPopup'] = true;
    } else if ("campaign" == type) {
      input['campaign'] = true;
    } else if ("edit" == type) {
      input['edit'] = true;
    } else if ("analytics" == type) {
      input['analytics'] = true;
    } else if ("shareAsWhiteLabeledContent" == type) {
      input['shareAsWhiteLabeledContent'] = true;
    } else if ("changeAsParentPdf" == type) {
      input['changeAsParentPdf'] = true;
    } else if ("askOliver" == type) {
      input['askOliver'] = true;
    } else if ("askAi" == type) {
      input['askAi'] = true;
    }
    input['asset'] = asset;
    this.assetGridViewActionsEmitter.emit(input);
  }

  openDownloadPopup(asset:any){
    this.assetGridViewActionsPdfEmitter.emit(asset);
  }

  /*********Analytics*************/
  viewAnalytics(asset: any) {
      this.setEventEmittersByType(asset, "analytics");
  }

  /*******View Details (Partner) ********/
  viewDetails(asset:any){
	/*****XNFR-169***/
	let url = "/home/dam/sharedp/view/"+asset.id;
	this.referenceService.navigateToRouterByViewTypes(url,this.categoryId,this.viewType,this.folderViewType,this.folderListView);
	}

  showCommentsAndHistoryModalPopup(asset :any) {
    this.assetGridViewCommentStatusHistoryEmitter.emit(asset);
  }

  /*******Delete Asset ********/
  confirmDelete(asset:any){
    this.assetGridViewActionsDeleteActionEmitter.emit(asset);
  }

  /***XNFR-255****/
  openWhiteLabeledPopup(asset:any){
    this.setEventEmittersByType(asset,"shareAsWhiteLabeledContent");
  }

  refreshListEmitter(){
    this.assetGridViewRefreshListEmitter.emit();
  }

  /***XNFR-381****/
  changeAsParentPdf(asset:any){
    this.setEventEmittersByType(asset,'changeAsParentPdf');
  }

  AskOliver(asset: any){
		this.setEventEmittersByType(asset,'askOliver');
	}
  AskAi(asset: any){
    this.setEventEmittersByType(asset,'askAi');
  }

  

  
}
