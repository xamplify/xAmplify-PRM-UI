import { Component, OnInit,Input } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Properties } from 'app/common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { DamService } from 'app/dam/services/dam.service';


declare var $: any;
@Component({
  selector: 'app-top-4-assets',
  templateUrl: './top-4-assets.component.html',
  styleUrls: ['./top-4-assets.component.css'],
  providers: [Properties, DamService]
})
export class Top4AssetsComponent implements OnInit {
  loggedInUserId: number = 0;
  assetsLoader = false;
  pagination: Pagination = new Pagination();
  assets: Array<any> = new Array<any>();
  loggedInUserCompanyId: any;
  @Input() isPartnerView = false;
  @Input() hideRowClass = false;
  title = "Assets";
  vanityLoginDto : VanityLoginDto = new VanityLoginDto();

  constructor(public properties: Properties, public damService: DamService, public authenticationService: AuthenticationService, public referenceService: ReferenceService, public xtremandLogger: XtremandLogger,private pagerService: PagerService) {
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
            this.listAssets(this.pagination);
          }
        }
      }
    );

  }

  listAssets(pagination: Pagination) {
    this.assetsLoader = true;
    this.pagination.maxResults =4;
    this.pagination.companyId= this.loggedInUserCompanyId;
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
    this.pagination.maxResults =4;
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
      this.referenceService.goToRouter("/home/dam/pda/"+asset.id);
    }else{
      this.referenceService.goToRouter("/home/dam/partnerAnalytics/"+asset.id);

    }
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


}
