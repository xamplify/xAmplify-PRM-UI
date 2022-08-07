import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { ActionsDescription } from '../../../common/models/actions-description';

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
  hasCampaignRole = false;
  hasAllAccess = false;
  loggedInUserId: number = 0;
  
  
  
  
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,
    public xtremandLogger:XtremandLogger, public actionsDescription:ActionsDescription) {
	  this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
	  this.hasCampaignRole = this.referenceService.hasRole(this.referenceService.roles.campaignRole);
      this.hasAllAccess = this.referenceService.hasAllAccess();
  }

  viewGirdHistory(asset:any){
    this.referenceService.goToRouter("/home/dam/history/"+asset.id);
  }

  addOrEdit(id:number){
    if (this.isPartnerView) {
			this.referenceService.goToRouter("/home/dam/editp/" + id);
		} else {
			this.referenceService.goToRouter("/home/dam/edit/" + id);
		}
  }

  editDetails(id:number){
    this.referenceService.goToRouter("/home/dam/editDetails/"+id);
  }

  preview(asset:any){
   this.setEventEmittersByType(asset,"preview");
  }

  openPublishPopup(asset:any){
    this.setEventEmittersByType(asset,"publishPopup");
  }
  
  campaignRouter(asset){
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
    }
    input['asset'] = asset;
    this.assetGridViewActionsEmitter.emit(input);
  }

  openDownloadPopup(asset:any){
    this.assetGridViewActionsPdfEmitter.emit(asset);
  }

  /*********Analytics*************/
  viewAnalytics(asset:any){
    if (this.isPartnerView) {
			this.referenceService.goToRouter("/home/dam/pda/" + asset.id);
		} else {
			this.referenceService.goToRouter("/home/dam/partnerAnalytics/" + asset.id);
		}
  }

  /*******View Details (Partner) ********/
  viewDetails(asset:any){
    this.referenceService.goToRouter('/home/dam/shared/view/'+asset.id);
  }

  /*******Delete Asset ********/
  confirmDelete(asset:any){
    this.assetGridViewActionsDeleteActionEmitter.emit(asset);
  }


 

  

  
}
