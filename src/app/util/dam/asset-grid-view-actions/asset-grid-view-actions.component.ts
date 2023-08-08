import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { ActionsDescription } from '../../../common/models/actions-description';
import { ActivatedRoute } from '@angular/router';

declare var $,swal;
@Component({
  selector: 'app-asset-grid-view-actions',
  templateUrl: './asset-grid-view-actions.component.html',
  styleUrls: ['./asset-grid-view-actions.component.css'],
  providers: [ActionsDescription]
})
export class AssetGridViewActionsComponent implements OnInit {

  @Input() isPartnerView:boolean = false;
  @Input() asset:any;
  @Output() assetGridViewActionsEmitter = new EventEmitter();
  @Output()assetGridViewActionsPdfEmitter = new EventEmitter();
  @Output() assetGridViewActionsDeleteActionEmitter = new EventEmitter();
  @Output() assetGridViewRefreshListEmitter = new EventEmitter();
  hasCampaignRole = false;
  hasAllAccess = false;
  loggedInUserId: number = 0;
  /****XNFR-169****/
  viewType: string;
  categoryId: number;
  folderViewType: string;
  @Input() folderListView = false;
  
  
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,
    public xtremandLogger:XtremandLogger, public actionsDescription:ActionsDescription,private route: ActivatedRoute) {
	  this.loggedInUserId = this.authenticationService.getUserId();
    /****XNFR-169****/
    this.viewType = this.route.snapshot.params['viewType'];
		this.categoryId = this.route.snapshot.params['categoryId'];
		this.folderViewType = this.route.snapshot.params['folderViewType'];
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
   this.setEventEmittersByType(asset,"preview");
  }

  openPublishPopup(asset:any){
    this.setEventEmittersByType(asset,"publishPopup");
  }
  
  campaignRouter(asset:any){
	  this.setEventEmittersByType(asset,"campaign");
  }

  setEventEmittersByType(asset:any,type:string){
    let input = {};
    if("preview"==type){
      input['preview'] = true;
    }else if("publishPopup"==type){
      input['publishPopup'] = true;
    }else if("campaign"==type){
    	input['campaign'] = true;
    }else if("edit"==type){
        input['edit'] = true;
    }else if("analytics"==type){
        input['analytics'] = true;
    }else if("shareAsWhiteLabeledContent"==type){
      input['shareAsWhiteLabeledContent'] = true;
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

 

  

  
}
