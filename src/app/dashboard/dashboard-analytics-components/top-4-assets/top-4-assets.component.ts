import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Properties } from 'app/common/models/properties';
import { DamService } from 'app/dam/services/dam.service';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';

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
  constructor(public properties: Properties, public damService: DamService, public authenticationService: AuthenticationService, public referenceService: ReferenceService, public xtremandLogger: XtremandLogger,private pagerService: PagerService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    
  }

  ngOnInit() {
    this.assetsLoader = true;
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
        this.listAssets(this.pagination);
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


}
