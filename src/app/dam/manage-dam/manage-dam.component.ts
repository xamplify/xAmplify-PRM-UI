import { Component, OnInit } from '@angular/core';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router,ActivatedRoute} from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ModulesDisplayType } from 'app/util/models/modules-display-type';
import { UserService } from 'app/core/services/user.service';
import { VideoFileService } from 'app/videos/services/video-file.service';
import { SaveVideoFile } from 'app/videos/models/save-video-file';
import { VideoFileEventEmitter } from '../models/video-file-event-emitter';

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
	modulesDisplayType = new ModulesDisplayType();
	videoId: number;
	damId: number;
    /*** user guides **** */
    mergeTagForGuide:any;

	constructor(public authenticationService:AuthenticationService,public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, 
		private router: Router,private route: ActivatedRoute, public videoFileService: VideoFileService, public userService: UserService) {
		/****XNFR-169****/
        this.viewType = this.route.snapshot.params['viewType'];
        this.categoryId = this.route.snapshot.params['categoryId'];
        this.folderViewType = this.route.snapshot.params['folderViewType'];
		this.modulesDisplayType = this.referenceService.setDefaultDisplayType(this.modulesDisplayType);
        if(this.viewType==undefined){
            this.viewType = this.modulesDisplayType.isListView ? 'l' : this.modulesDisplayType.isGridView ?'g':'';
        }
		this.videoId = this.route.snapshot.params['videoId'];
		this.damId = this.route.snapshot.params['damId'];
	}

	ngOnInit() { 
		this.isPartnerView = this.router.url.indexOf('/shared')>-1;
		if(this.router.url.indexOf('/editVideo')>-1){		
		 this.getVideo(this.videoId, this.damId, 'editVideo');		
		} else if(this.router.url.indexOf('/previewVideo')>-1){
		 this.getVideo(this.videoId, this.damId, 'playVideo');
		}
        this.mergeTagForGuide = this.isPartnerView ? 'accessing_shared_assets': 'manage_assets';
	}
	
	  getDefaultVideoSettings() {
        this.userService.getVideoDefaultSettings().subscribe((data) => { this.referenceService.defaultPlayerSettings = data; });
      }
    

    getVideo(videoId:number, damId: number, actionType : string) {
        if(this.referenceService.defaultPlayerSettings!=undefined && this.referenceService.defaultPlayerSettings.playerColor===undefined){ 
            this.getDefaultVideoSettings(); 
        }
        try{
        this.videoFileService.getVideoById(videoId, 'DRAFT')
            .subscribe((editVideoFile: SaveVideoFile) => {
                if(editVideoFile.access){
                if (editVideoFile.imageFiles == null || editVideoFile.gifFiles == null) {
                    editVideoFile.gifFiles = []; editVideoFile.imageFiles = [];
                }
                editVideoFile.damId = damId;
                this.videoFileService.saveVideoFile = editVideoFile;
                this.referenceService.selectedVideoLogo = editVideoFile.brandingLogoUri;
                this.referenceService.selectedVideoLogodesc = editVideoFile.brandingLogoDescUri;
                this.videoFileService.actionValue = 'Update';
                this.manageDam = false;
                if(actionType === 'editVideo'){
                 this.editVideo = true;
                 this.playVideo = false;
                 }else if(actionType === 'playVideo'){
                 this.playVideo = true;
                 this.editVideo = false;
                 }
                }else{
                    this.authenticationService.forceToLogout();
                }
            },
            (error: any) => {
                this.xtremandLogger.error('Error In: show edit videos ():' + error);
                this.xtremandLogger.errorPage(error);
            }
            );
          }catch(error){
            this.xtremandLogger.error('error'+error);
          }
    }
	

	viewPublishedContent(){
		this.referenceService.showSweetAlertInfoMessage();
	}

	showSuccessMessage(){
	 this.referenceService.isUploaded = true;
	 this.referenceService.navigateToManageAssetsByViewType(this.folderViewType,this.viewType,this.categoryId,this.isPartnerView);
	}

	goToUploadComponent(){
		this.loading = true;
		this.referenceService.goToRouter("/home/dam/select");
	}
	goToDam(){
		this.loading = true;
		this.referenceService.navigateToManageAssetsByViewType(this.folderViewType,this.viewType,this.categoryId,this.isPartnerView);
	}
    
    update(videoFileEventEmitter: VideoFileEventEmitter) {
        let videoFile = videoFileEventEmitter.videoFile;
        if (videoFile != null) {
            this.referenceService.isAssetDetailsUpldated = true;
        }
        let folderViewType = videoFileEventEmitter.folderViewType;
        let viewType = videoFileEventEmitter.viewType;
        let categoryId = videoFileEventEmitter.categoryId;
        this.referenceService.navigateToManageAssetsByViewType(folderViewType,viewType,categoryId,this.isPartnerView);
    }
    
    
}
