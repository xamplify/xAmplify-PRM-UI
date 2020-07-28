import { Component, OnInit,OnDestroy } from '@angular/core';
import { CustomResponse } from '../../../common/models/custom-response';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { PagerService } from '../../../core/services/pager.service';
import { Pagination } from '../../../core/models/pagination';
import { ReferenceService } from '../../../core/services/reference.service';
import { Router, ActivatedRoute } from '@angular/router';
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';
import { ActionsDescription } from '../../../common/models/actions-description';
import { SocialService } from '../../services/social.service';
import { SocialStatus } from 'app/social/models/social-status';
import { VideoUtilService } from '../../../videos/services/video-util.service';

declare var swal: any, $: any;

@Component({
	selector: 'app-manage-custom-feeds',
	templateUrl: './manage-custom-feeds.component.html',
	styleUrls: ['../rss/rss.component.css', './manage-custom-feeds.component.css'],
	providers: [Pagination, ActionsDescription],
})
export class ManageCustomFeedsComponent implements OnInit {
	loading = false;
	customResponse: CustomResponse = new CustomResponse();
	hasError = false;
	loggedInUserId = 0;
	pagination: Pagination = new Pagination();
	message = "";
	statusCode: any;
	selectedType: any;

	constructor(public referenceService: ReferenceService, public pagerService:
		PagerService, public authenticationService: AuthenticationService,
		public router: Router, public logger: XtremandLogger,
		public actionsDescription: ActionsDescription, private route: ActivatedRoute, private socialService: SocialService,public videoUtilService: VideoUtilService) {
		this.loggedInUserId = this.authenticationService.getUserId();
		this.pagination.userId = this.loggedInUserId;
		if (this.referenceService.isCreated) {
			this.message = "Feed created successfully";
			this.showMessageOnTop(this.message);
			this.referenceService.isCreated = false;
		} else if (this.referenceService.isUpdated) {
			this.message = "Feed updated successfully";
			this.showMessageOnTop(this.message);
			this.referenceService.isUpdated = false;
		}
		
	}

	showMessageOnTop(message) {
		$(window).scrollTop(0);
		this.customResponse = new CustomResponse('SUCCESS', message, true);
	}


	ngOnInit() {
		this.selectedType = this.route.snapshot.params['type'];
		this.listAllFeeds(this.pagination);
	}

	listAllFeeds(pagination: Pagination) {
		this.loading = true;
		/**********Vanity Url Filter**************** */
		if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
			this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
			this.pagination.vanityUrlFilter = true;
		}
		this.socialService.listAllFeeds(pagination,this.selectedType).subscribe(
			(response: any) => {
				const data = response.data;
				this.statusCode = response.statusCode;
				pagination.totalRecords = response.totalRecords;
				pagination = this.pagerService.getPagedItems(pagination, data);
				this.loading = false;
			},
			(error: any) => { this.logger.errorPage(error); });
	}

	

	searchFeeds() {
		this.getAllFilteredResults();
	}

	paginationDropdown(items: any) {
		this.getAllFilteredResults();
	}

	/************Page************** */
	setPage(event: any) {
		this.pagination.pageIndex = event.page;
		this.listAllFeeds(this.pagination);
	}

	getAllFilteredResults() {
		this.pagination.pageIndex = 1;
		this.listAllFeeds(this.pagination);
	}

	/************************Edit Feed**************** */
	editFeed(feed: any) {
		this.customResponse = new CustomResponse();
		this.loading = true;
		this.router.navigate(['/home/rss/edit-custom-feed/'+ feed.id]);
	}
	/**********Publish Feed****************/
	publishFeed(feed: any) {
		this.customResponse = new CustomResponse();
		let isPublished = feed.publishToPartners;
		let message = "";
		let confirmButtonText = "";
		let successMessage = "";
		if (isPublished) {
			message = "This feed will be UnPublished";
			confirmButtonText = "Yes, UnPublish it!";
			successMessage = "Feed UNPUBLISHED successfully";
		} else {
			message = "This feed will be Published";
			confirmButtonText = "Yes, Publish it!";
			successMessage = "Feed PUBLISHED successfully";
		}
		let self = this;
		swal({
			title: 'Are you sure?',
			text: message,
			type: 'warning',
			showCancelButton: true,
			swalConfirmButtonColor: '#54a7e9',
			swalCancelButtonColor: '#999',
			confirmButtonText: confirmButtonText
		}).then(function() {
			self.changeStatus(feed, successMessage);
		}, function(dismiss: any) {
			console.log('you clicked on option' + dismiss);
		});

	}

	changeStatus(feed: any, successMessage: string) {
		this.loading = true;
		feed.publishToPartners = !feed.publishToPartners;
		feed.userId = this.loggedInUserId;
		this.socialService.publishFeed(feed).subscribe(
			(response: any) => {
				this.loading = false;
				if (response.statusCode == 200) {
					this.customResponse = new CustomResponse('SUCCESS', successMessage, true);
				} else {
					this.customResponse = new CustomResponse('ERROR', response.message, true);
				}

			},
			(error: any) => {
				this.loading = false;
				this.referenceService.showSweetAlertServerErrorMessage();
			});
	}


	/***********Delete**************/
	confirmDeleteFeed(feed: any) {
		try {
			let self = this;
			swal({
				title: 'Are you sure?',
				text: "You won't be able to undo this action!",
				type: 'warning',
				showCancelButton: true,
				swalConfirmButtonColor: '#54a7e9',
				swalCancelButtonColor: '#999',
				confirmButtonText: 'Yes, delete it!'

			}).then(function() {
				self.deleteFeedById(feed);
			}, function(dismiss: any) {
				console.log('you clicked on option' + dismiss);
			});
		} catch (error) {
			this.logger.error(this.referenceService.errorPrepender + " confirmDelete():" + error);
			this.loading = false;
		}
	}

	deleteFeedById(feed: any) {
		this.loading = true;
		feed.userId = this.loggedInUserId;
		this.socialService.deleteFeed(feed).subscribe(
			(response: any) => {
				this.loading = false;
				if (response.statusCode == 200) {
					this.customResponse = new CustomResponse('SUCCESS', 'Feed deleted successfully.', true);
					this.pagination.pageIndex = 1;
					this.listAllFeeds(this.pagination);
				} else {
					this.customResponse = new CustomResponse('ERROR', response.message, true);
				}

			},
			(error: any) => {
				this.loading = false;
				this.referenceService.showSweetAlertServerErrorMessage();
			});

	}

	shareFeed(feed: any) {
		if(this.selectedType=='v'){
			this.socialService.selectedCustomFeed = feed;
		}else{
			this.socialService.partnerFeed = feed;
		}
		this.loading = true;
		this.router.navigate(["/home/social/update-status"]);
	}

	



}
