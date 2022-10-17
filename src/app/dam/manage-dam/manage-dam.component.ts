import { Component, OnInit } from '@angular/core';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router,ActivatedRoute} from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
	selector: 'app-manage-dam',
	templateUrl: './manage-dam.component.html',
	styleUrls: ['./manage-dam.component.css']
})
export class ManageDamComponent implements OnInit {
	manageDam : boolean = true;
    editVideo : boolean = false;
    playVideo : boolean = false;
	loading = false;
	uploadAsset = false;
	isPartnerView = false;
	/******XNFR-169********/
	viewType: string;
    categoryId: number;
    folderViewType: string;
	constructor(public authenticationService:AuthenticationService,public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, 
		private router: Router,private route: ActivatedRoute) {
		/****XNFR-169****/
        this.viewType = this.route.snapshot.params['viewType'];
        this.categoryId = this.route.snapshot.params['categoryId'];
        this.folderViewType = this.route.snapshot.params['folderViewType'];
	}

	ngOnInit() {
		this.isPartnerView = this.router.url.indexOf('/shared')>-1;
	}

	

	viewPublishedContent(){
		this.referenceService.showSweetAlertInfoMessage();
	}

	showSuccessMessage(){
	this.referenceService.isUploaded = true;
   	 this.referenceService.goToRouter("/home/dam/manage");
	}

	goToUploadComponent(){
		this.loading = true;
		this.referenceService.goToRouter("/home/dam/select");
	}
	goToDam(){
		this.loading = true;
		if(this.isPartnerView){
			this.referenceService.goToRouter("/home/dam/shared");
		}else{
			if(this.categoryId!=undefined && this.categoryId>0){
				this.referenceService.goToManageAssetsByCategoryId(this.folderViewType,this.viewType,this.categoryId,false);
			  }else{
				this.referenceService.goToManageAssets(this.viewType,false);
			  }
		}
	}
	
    setManageDam(result: any) {
        if (result != null) {
            this.manageDam = result;
            this.editVideo = !result;
        } else {
            this.playVideo = true;
            this.manageDam = false;
            this.editVideo = false;
        }
    }
    
    update(videoFile: any) {
        if (videoFile != null) {
            this.referenceService.isAssetDetailsUpldated = true;
        }
        this.goToDam();
    }
    
    
}
