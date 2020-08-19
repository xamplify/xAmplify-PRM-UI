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
	vendorCompanyId = 0;
	collectionId = 0;
	collectionName = "";
	collectionReName = "";
	searchPlaceHolder = "Search Feeds ";
	showCollectionPanel =  false;
	renameCollectionTitleResponse: any;
	canUpdateCollection = false;
	canDeleteCollection = false;
	addNewCollection = false;
	customFeedCollections: Array<any>;
	analyticsPagination: Pagination = new Pagination();
	analyticsPageItems: Array<any>;
	partnerAnalyticsPagination: Pagination = new Pagination();
	partnerAnalyticsPageItems: Array<any>;
	feedId = 0;
	partnerCompanyId = 0;
	addCollectionError = false;
	addCollectionErrorMessage: string;
	constructor(public referenceService: ReferenceService, public pagerService:
		PagerService, public authenticationService: AuthenticationService,
		public router: Router, public logger: XtremandLogger,
		public actionsDescription: ActionsDescription, private route: ActivatedRoute, private socialService: SocialService,public videoUtilService: VideoUtilService) {
		this.loggedInUserId = this.authenticationService.getUserId();
		this.pagination.userId = this.loggedInUserId;
		this.analyticsPagination.userId = this.loggedInUserId;
		this.partnerAnalyticsPagination.userId = this.loggedInUserId;
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
		this.vendorCompanyId = this.route.snapshot.params['vendorCompanyId'];
		this.collectionId = this.route.snapshot.params['collectionId'];
		this.getCollectionById();
		this.listAllFeeds(this.pagination);
		this.listAllCustomFeedCollections();
	}

	listAllCustomFeedCollections(){
    this.loading = true;
    this.socialService.listAllCustomFeedCollections(this.loggedInUserId)
  		.subscribe(
    		data => {
     		 let statusCode = data.statusCode;
      		if(statusCode==200){
        		this.customFeedCollections = data.data;
      		}

    		},
    	error => {
     		 this.loading = false;
    	},
    	() => {
      		this.loading = false;
    	}
  	);
  }

	listAllFeeds(pagination: Pagination) {
		this.loading = true;
		/**********Vanity Url Filter**************** */
		if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
			this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
			this.pagination.vanityUrlFilter = true;
		}
		if(this.vendorCompanyId!=undefined && this.vendorCompanyId>0){
			pagination.vendorCompanyId = this.vendorCompanyId;
		}
		if(this.collectionId!=undefined && this.collectionId>0){
			pagination.collectionId = this.collectionId;
		} 
		this.socialService.listAllFeeds(pagination,this.selectedType).subscribe(
			(response: any) => {
				const data = response.data;
				this.statusCode = response.statusCode;
				pagination.totalRecords = response.totalRecords;
				pagination = this.pagerService.getPagedItems(pagination, data);
				$.each(pagination.pagedItems, function (_index:number, feed) {
                        feed.publishTime = new Date(feed.publishedToPartnersUTC);
                        feed.lastUpdatedDate = new Date(feed.createdTimeUTC);
                    });
				this.loading = false;
			},
			(error: any) => { this.logger.errorPage(error); });
	}

	getCollectionById() {
		if (this.collectionId !== undefined && this.collectionId > 0) {
			this.socialService.getCollectionById(this.collectionId, this.loggedInUserId).subscribe(
			data => {
				if (data.statusCode === 200) {
	         		this.collectionName = data.data.title;
	         		this.searchPlaceHolder = "Search Feeds in " + this.collectionName;
	         		this.showCollectionPanel = true;
	         		this.canUpdateCollection = data.data.canUpdate;
	         		this.canDeleteCollection = data.data.canDelete;
        		}
			},
			(error: any) => { this.logger.errorPage(error); });
		}
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
	
	/************Page************** */
	setAnalyticsPage(event: any) {
		this.analyticsPagination.pageIndex = event.page;
		this.getFeedAnalytics(this.analyticsPagination);
	}
	
	/************Page************** */
	setPartnerAnalyticsPage(event: any) {
		this.partnerAnalyticsPagination.pageIndex = event.page;
		this.getPartnerFeedAnalytics(this.partnerAnalyticsPagination);
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

	renameCollectionDialog(){
    // this.collectionTitle = this.collectionName;
    this.renameCollectionTitleResponse = null;
    $('#renameModal').modal('show');
}
deleteCollectionDialog(){
  const self = this;
  swal( {
      title: 'Delete collection?',
      text: 'Are you sure you want to delete this collection? All the feeds in this collection will be deleted by clicking Yes.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#54a7e9',
      cancelButtonColor: '#999',
      confirmButtonText: 'Yes'

  }).then( function() {
      self.deleteCollection();
  }, function( dismiss: any ) {
      console.log( 'you clicked on option' + dismiss );
  });  
}

renameCollection(){
	if (this.collectionReName !== this.collectionName) {
		let requestBody = {
      		"id": this.collectionId,
      		"userId": this.loggedInUserId,
      		"title": this.collectionReName
    	};
    	this.socialService.renameCustomFeedCollection(requestBody).subscribe(
      		data => {
        		this.renameCollectionTitleResponse = data;
        		if (data.statusCode === 200) {
          			//this.collectionName = this.collectionReName;
          			//this.searchPlaceHolder = "Search Feeds in " + this.collectionName;
          			 $('#renameModal').modal('hide');
          			this.router.navigate(["/home/rss/manage-custom-feed/v/"+this.collectionId]);
          			
        		} else {

        		}
      	},
      	error => console.log(error),
      		() => this.loading = false
    	);
	} else {
		this.renameCollectionTitleResponse = {message:"Please change the title.", statusCode: 400};
	}
    
  }

	deleteCollection(){
    let requestBody = {"userId": this.loggedInUserId, "id": this.collectionId};
    this.socialService.deleteCustomFeedCollection(requestBody).subscribe(
      data => {
        this.router.navigate(["/home/rss/manage-custom-feed"]);
      },
      error => console.log(error),
      () => {}
    );
  }
  
 toggleChangeCollection(divId: any) {
 	this.addCollectionError = false;
    this.addCollectionErrorMessage = '';
    this.addNewCollection = false;
    var x = document.getElementById('toggleChangeCollection' + divId);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }
  
  showFeedAnalyticsPopUp(feedId : number) {
  	//this.analyticsPagination.pageIndex = 1;
  	//this.analyticsPagination.userId = this.loggedInUserId;
  	this.analyticsPagination.feedId = feedId;
  	this.feedId = feedId;
    this.getFeedAnalytics(this.analyticsPagination);
    var x = document.getElementById('feedAnalyticsModal');
  	x.style.display = "block";
  }
  
  getFeedAnalytics(analyticsPagination: Pagination) {
  	this.socialService.getFeedAnalytics(this.analyticsPagination).subscribe(
      		data => {
      			analyticsPagination.totalRecords = data.totalRecords;
				analyticsPagination = this.pagerService.getPagedItems(analyticsPagination, data.data);
      			this.analyticsPageItems = data.data;
      	},
      	error => console.log(error),
      		() => this.loading = false
    	);
  }
  
  feedAnalyticsModalClose(){
  	var x = document.getElementById('feedAnalyticsModal');
  	x.style.display = "none";
  	this.loading = false;
  }
  
 /* getPartnerFeedAnalytics(analyticsPageItem : any){
  	this.partnerAnalyticsPagination.pageIndex = 1;
  	this.partnerAnalyticsPagination.userId = this.loggedInUserId;
  	this.partnerAnalyticsPagination.feedId = analyticsPageItem.socialStatusId;
  	this.partnerAnalyticsPagination.partnerCompanyId = analyticsPageItem.partnerCompanyId;
    this.socialService.getPartnerFeedAnalytics(this.partnerAnalyticsPagination).subscribe(
      		data => {
        		this.partnerAnalyticsPageItems = data.data;
        		$.each(this.partnerAnalyticsPageItems, function (_index:number, partnerAnalyticsPageItem) {
                        partnerAnalyticsPageItem.postedOn = new Date(partnerAnalyticsPageItem.postedOnUTC);
                    });
      	},
      	error => console.log(error),
      		() => this.loading = false
    	);
    	
   var x = document.getElementById('partnerAnalyticsModal');
  	x.style.display = "block";
  }*/
  
  showPartnerFeedAnalyticsPopUp(partnerCompanyId : number) {
  	this.partnerAnalyticsPagination.partnerCompanyId = partnerCompanyId;
  	this.partnerAnalyticsPagination.feedId = this.feedId;
    this.getPartnerFeedAnalytics(this.partnerAnalyticsPagination);
    var x = document.getElementById('partnerAnalyticsModal');
  	x.style.display = "block";
  }
  
  getPartnerFeedAnalytics(partnerAnalyticsPagination : Pagination){
    this.socialService.getPartnerFeedAnalytics(this.partnerAnalyticsPagination).subscribe(
      		data => {
				partnerAnalyticsPagination.totalRecords = data.totalRecords;
				partnerAnalyticsPagination = this.pagerService.getPagedItems(partnerAnalyticsPagination, data.data);      		
        		this.partnerAnalyticsPageItems = data.data;
        		$.each(partnerAnalyticsPagination.pagedItems, function (_index:number, partnerAnalyticsPageItem) {
                        partnerAnalyticsPageItem.postedOn = new Date(partnerAnalyticsPageItem.postedOnUTC);
                    });
      	},
      	error => console.log(error),
      		() => this.loading = false
    	);
  }
  
  
  
  partnerAnalyticsModalClose() {
  	var x = document.getElementById('partnerAnalyticsModal');
  	x.style.display = "none";
  	this.loading = false;
  }
  
  
  moveToCollection(collectionId: number, feed: any, collectionName: string){
   // this.resetCustomResponse();
     this.loading = true;
      if (collectionId > 0) {
      	this.moveCustomFeedToOtherCollection(collectionId, feed);
      } else {
      	let duplicateName = false;		
      	if (this.customFeedCollections.length > 0) {
      		$.each(this.customFeedCollections, function (_index:number, customFeedCollection) {
                 if(customFeedCollection.title === collectionName) {
                 	duplicateName = true;
                 }
            });
      	}
      	if (!duplicateName) {
      		this.createCollection(feed, collectionName);
      	} else {
      		this.loading = false;
      		this.addCollectionError = true;
      		this.addCollectionErrorMessage = "Duplicate Collection Name";
      		//this.customResponse = new CustomResponse('ERROR', "Duplicate Collection Name", true);
      	}
      }
  }
  
  createCollection(feed: any, collectionName: string) {
		this.loading = true;
		let collectionNameTrimmed = $.trim(collectionName);
    	if (collectionNameTrimmed.length==0) {
    		//this.resetCustomResponse();
    		this.showMessageOnTop("Collection Name can not be empty");
      		//this.setCustomResponse(ResponseType.Warning, 'Collection Name can not be empty');
      		this.loading = false;
    	} else {
    		let request = { "userId": this.loggedInUserId, "title": collectionName };
    		this.socialService.saveCustomFeedCollection(request)
        .subscribe(
          data => {
            if (data.statusCode === 200) {
          		this.moveCustomFeedToOtherCollection(data.data.id, feed);
        	}
          },
          error => {	
           	this.loading = false;
            //this.setCustomResponse(ResponseType.Error, 'Error while adding the collection.');
            this.showMessageOnTop("Error while adding the collection.");
          },
          () => {
            this.loading = false;
          }
        );
    	}
	}
	
	  moveCustomFeedToOtherCollection(collectionId: number, feed: any) {
	  	if (feed.collectionId !== collectionId) {
	  		let request = { "userId": this.loggedInUserId, "id": feed.id, "collectionId": collectionId };
	  		this.socialService.moveCustomFeedToOtherCollection(request)
        	.subscribe(
          		data => {
            		this.router.navigate(["/home/rss/manage-custom-feed/v/"+this.collectionId]);
          	},
          	error => {
            	//this.loading = false;
            	//this.setCustomResponse(ResponseType.Error, 'Error while adding the feed.');
            	this.showMessageOnTop("Error while adding the feed.");
          	},
          	() => {
            	this.loading = false;
          	}
        	);
	  	} else {
	  		this.router.navigate(["/home/rss/manage-custom-feed/v/"+this.collectionId]);
	  	}
	  }

}
