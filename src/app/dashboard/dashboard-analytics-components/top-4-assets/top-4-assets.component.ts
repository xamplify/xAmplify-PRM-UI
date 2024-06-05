import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Properties } from 'app/common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { DamService } from 'app/dam/services/dam.service';
import { DamUploadPostDto } from 'app/dam/models/dam-upload-post-dto';
import { CustomResponse } from 'app/common/models/custom-response';
import { VideoFileService } from 'app/videos/services/video-file.service';
import { SaveVideoFile } from 'app/videos/models/save-video-file';
import { UserService } from 'app/core/services/user.service';
import { Router } from '@angular/router';


declare var $:any,swal: any;
@Component({
  selector: 'app-top-4-assets',
  templateUrl: './top-4-assets.component.html',
  styleUrls: ['./top-4-assets.component.css'],
  providers: [Properties, DamService, VideoFileService, UserService]
})
export class Top4AssetsComponent implements OnInit {
  loggedInUserId: number = 0;
  assetsLoader = false;
  pagination: Pagination = new Pagination();
  assets: Array<any> = new Array<any>();
  loggedInUserCompanyId: any;
  @Input() isPartnerView = false;
  @Input() hideRowClass = false;
  @Output() newItemEvent  = new EventEmitter<any>();
  title = "Assets";
  manageAssetsText = "Click here to manage assets";
  vanityLoginDto : VanityLoginDto = new VanityLoginDto();
  loading = false;
  customResponse:CustomResponse = new CustomResponse();
  isPreview = false;
  asset:any;
  showPublishPopup = false; 
  selectedAssetId: number;
  showPdfModalPopup: boolean;
  deleteAsset = false;
  constructor(public properties: Properties, public damService: DamService, public authenticationService: AuthenticationService, public referenceService: ReferenceService, public xtremandLogger: XtremandLogger,private pagerService: PagerService,
  			  public videoFileService: VideoFileService, public userService:UserService, private router: Router) {
    this.loggedInUserId = this.authenticationService.getUserId();
    if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
			this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
			this.vanityLoginDto.userId = this.loggedInUserId; 
			this.vanityLoginDto.vanityUrlFilter = true;
		 }
    
  }

  ngOnInit() {
    this.assetsLoader = true;
    this.title = this.isPartnerView ? 'Shared Assets' : 'Assets';
    this.manageAssetsText =  this.isPartnerView ? 'Click here to access shared assets' : 'Click here to manage assets';
    this.getCompanyId();
  }

  getCompanyId() {
    this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
      (result: any) => {
        this.loggedInUserCompanyId = result;
      }, (error: any) => {
        this.loggedInUserCompanyId = 0;
        this.assetsLoader = false;
      },
      () => {
        if (this.loggedInUserCompanyId != undefined && this.loggedInUserCompanyId > 0) {
          this.pagination.companyId = this.loggedInUserCompanyId;
          if (this.isPartnerView) {
            if(this.vanityLoginDto.vanityUrlFilter){
              this.pagination.vanityUrlFilter  = this.vanityLoginDto.vanityUrlFilter;
              this.pagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
            }
            this.pagination.userId = this.loggedInUserId;
            this.listPublishedAssets(this.pagination);
          } else {
            this.pagination.userId = this.loggedInUserId;
            this.listAssets(this.pagination);
          }
        }
      }
    );

  }

  listAssets(pagination: Pagination) {
    this.assetsLoader = true;
    pagination.maxResults =4;
		this.damService.list(pagination).subscribe((result: any) => {
			if (result.statusCode === 200) {
				let data = result.data;
				pagination.totalRecords = data.totalRecords;
				this.assets = data.assets;
				$.each(data.assets, function (_index: number, asset: any) {
					asset.displayTime = new Date(asset.createdDateInUTCString);
				});
				pagination = this.pagerService.getPagedItems(pagination, data.assets);
			}
			this.assetsLoader = false;
		}, error => {
			this.assetsLoader = false;
		});
  }

  listPublishedAssets(pagination: Pagination) {
		this.assetsLoader = true;
    pagination.maxResults =4;
		this.damService.listPublishedAssets(pagination).subscribe((result: any) => {
			if (result.statusCode === 200) {
				let data = result.data;
        pagination.totalRecords = data.totalRecords;
        this.assets = data.list;
				$.each(data.list, function (_index: number, asset: any) {
					asset.displayTime = new Date(asset.publishedTimeInUTCString);
				});
				pagination = this.pagerService.getPagedItems(pagination, data.list);
			}
			this.assetsLoader = false;
		}, error => {
			this.assetsLoader = false;
		});
	}
  
  goToAnalytics(asset:any){
    this.assetsLoader = true;
    if(this.isPartnerView){
      this.navigateToAnalytics(asset);
    }else{
      this.navigateToPartnerCompaniesAnalytics(asset);
    }
  }

  navigateToPartnerCompaniesAnalytics(asset){
    this.referenceService.navigateToDamPartnerCompaniesAnalytics(asset.id,0,undefined,false,false);
  }

  openSettingsPopup(){
    this.referenceService.showSweetAlertInfoMessage();
  }

  refresh(){
    if(this.isPartnerView){
      this.listPublishedAssets(this.pagination);
    }else{
      this.listAssets(this.pagination);
    }
  }

  goToManage(){
    this.loading = true;
    if(this.isPartnerView){
      this.referenceService.goToRouter('/home/dam/shared');
    }else{
      this.referenceService.goToRouter('/home/dam/manage');
    }
  }

  goToAddDam(){
    this.loading = true;
    this.referenceService.goToRouter('/home/dam/select');
  }

  addOrEdit(id:number){
    this.loading = true;
    if (this.isPartnerView) {
			this.referenceService.goToRouter("/home/dam/editp/" + id);
		} else {
			this.referenceService.goToRouter("/home/dam/edit/" + id);
		}
  }

editDetails(id: number, assetType: string, alias:string, beeTemplate : boolean, videoId:number) {
      if (!beeTemplate && this.isVideo(assetType)) {
      this.router.navigate(["/home/dam/editVideo/"+videoId+"/"+id]);      
      } else {
          this.loading = true;
          this.referenceService.goToRouter("/home/dam/editDetails/" + id);
      }
  }
assetGridViewActionsEmitter(event: any) {
      let input = event;
      let preview = input['preview'];
      let showPublishPopup = input['publishPopup'];
      let campaign = input['campaign'];
      let edit = input['edit'];
      let analytics = input['analytics'];
      this.asset = input['asset'];
      if (preview) {
          this.preview(this.asset);
      } else if (showPublishPopup) {
          this.selectedAssetId = this.asset.id;
          this.showPublishPopup = true;
      }else if(campaign){
          this.campaignRouter(this.asset.alias, this.asset.viewBy);
      }else if(edit){
          this.editDetails(this.asset.id, this.asset.assetType, this.asset.alias, this.asset.beeTemplate, this.asset.videoId);
      }else if(analytics){
          this.viewAnalytics(this.asset);
      }
  }
  
  preview(asset: any) {
      if (this.isVideo(asset.assetType)) {
         this.router.navigate(["/home/dam/previewVideo/"+asset.videoId+"/"+asset.id]);
      } else {
          this.isPreview = true;
          this.asset = asset;
      }
  }

previewAssetPopupEmitter(){
  this.isPreview = false;
  this.asset = {};
}
/*********Publish Popup **********/
notificationFromPublishToPartnersComponent() {
  this.showPublishPopup = false;
  this.selectedAssetId = 0;
  this.getCompanyId();
}


/*************Download PDF***********/
assetGridViewActionsPdfEmitter(event:any){
  this.asset = event;
  this.showPdfModalPopup = true;
}

downloadAssetPopupEventEmitter(){
  this.asset = {};
  this.showPdfModalPopup = false;
}

/**********Delete***********/
assetGridViewActionsDeleteActionEmitter(event:any){
  this.deleteAsset = true;
  this.asset = event;
}

deleteAssetSuccessEmitter(){
  this.customResponse = new CustomResponse('SUCCESS',this.asset.assetName+" Deleted Successfully",true);
  this.deleteAsset = false;
  this.assetsLoader = false;
  this.asset = {};
  this.pagination.pageIndex = 1;
  this.listAssets(this.pagination);
}

/*****XBI-1661****/
deleteAssetFailEmitter(message: any) {
  this.customResponse = new CustomResponse('ERROR', message, true);
  this.deleteAsset = false;
  this.assetsLoader = false;
  this.asset = {};		
}


deleteAssetLoaderEmitter(){
  this.assetsLoader = true;
}

deleteAssetCancelEmitter(){
  this.deleteAsset = false;
  this.asset = {};
}  

viewAnalytics(asset: any) {
    this.loading = true;
    let isVideo = this.isVideo(asset.assetType);
    if (isVideo) {
           if (this.isPartnerView) {
            this.navigateToAnalytics(asset);
        } else {
            try {
                this.videoFileService.getVideo(asset.alias, 'DRAFT')
                    .subscribe((editVideoFile: SaveVideoFile) => {
                        if (editVideoFile.access) {
                            if (editVideoFile.imageFiles == null || editVideoFile.gifFiles == null) {
                                editVideoFile.gifFiles = []; editVideoFile.imageFiles = [];
                            }
                            editVideoFile.damId = asset.id;
                            this.videoFileService.saveVideoFile = editVideoFile;
                            this.referenceService.selectedVideoLogo = editVideoFile.brandingLogoUri;
                            this.referenceService.selectedVideoLogodesc = editVideoFile.brandingLogoDescUri;
                            this.videoFileService.campaignReport = true;
                            localStorage.setItem('campaignReport', 'true');
                            localStorage.setItem('saveVideoFile', JSON.stringify(editVideoFile));
                            this.navigateToPartnerCompaniesAnalytics(asset);
                        } else {
                            this.authenticationService.forceToLogout();
                        }
                    },
                    (error: any) => {
                        this.xtremandLogger.error('Error In: show edit videos ():' + error);
                        this.xtremandLogger.errorPage(error);
                    }
                    );
            } catch (error) {
                this.xtremandLogger.error('error' + error);
            }
        }
    } else {
        if (this.isPartnerView) {
           this.navigateToAnalytics(asset);
        } else {
          this.navigateToPartnerCompaniesAnalytics(asset);
        }
    }
}

navigateToAnalytics(asset:any){
  let url = "/home/dam/pda/" + this.referenceService.encodePathVariable(asset.id);
  this.referenceService.goToRouter(url);
}

campaignRouter(alias:string, viewBy:string) {
    try{
     this.xtremandLogger.log('ManageVideoComponent campaign router:');
     this.videoFileService.getVideo(alias, viewBy)
         .subscribe((videoFile: SaveVideoFile) => {
             if(videoFile.access){
             console.log(videoFile);
             this.referenceService.campaignVideoFile = videoFile;
             this.referenceService.selectedCampaignType = 'video';
             this.referenceService.isCampaignFromVideoRouter = true;
            // this.router.navigateByUrl('/home/campaigns/create');
             this.referenceService.goToRouter('/home/campaigns/create');
             }else{
                 this.authenticationService.forceToLogout();
             }
         },
         (error: string) => {
             this.xtremandLogger.error('Error In: show campaign videos ():' + error);
             this.xtremandLogger.errorPage(error);
         });
       }catch(error){ this.xtremandLogger.error('error'+error);}
 }

isVideo(filename: any) {
    const parts = filename.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
        case 'm4v':
        case 'mkv':
        case 'avi':
        case 'mpg':
        case 'mp4':
        case 'flv':
        case 'mov':
        case 'wmv':
        case 'divx':
        case 'f4v':
        case 'mpeg':
        case 'vob':
        case 'xvid':
            // etc
            return true;
    }
    return false;
}

}
