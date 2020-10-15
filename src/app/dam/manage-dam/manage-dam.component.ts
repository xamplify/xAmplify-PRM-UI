import { Component, OnInit } from '@angular/core';
import { DamService } from '../services/dam.service';

/*****Common Imports**********************/
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
import { SortOption } from '../../core/models/sort-option';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { Properties } from '../../common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';

@Component({
	selector: 'app-manage-dam',
	templateUrl: './manage-dam.component.html',
	styleUrls: ['./manage-dam.component.css'],
	providers: [HttpRequestLoader, SortOption, Properties]
})
export class ManageDamComponent implements OnInit {
	loading = false;
	loggedInUserId: number = 0;
	pagination:Pagination = new Pagination();
	uploadAsset = false;
	constructor(public sortOption: SortOption, public listLoader: HttpRequestLoader, private damService: DamService, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties) {
		this.loggedInUserId = this.authenticationService.getUserId();
	}

	ngOnInit() {
	}

	addAsset() {
		this.loading = true;
		this.referenceService.goToRouter("/home/dam/add");
	}

	viewPublishedContent(){
		this.referenceService.showSweetAlertInfoMessage();
	}

	goToUploadComponent(){
		this.uploadAsset = true;
	}

	clearValues(){
		this.uploadAsset = false;
	}
}
