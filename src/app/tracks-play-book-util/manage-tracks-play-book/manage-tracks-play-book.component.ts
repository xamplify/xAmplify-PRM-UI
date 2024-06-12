import { Component, OnInit, Input, Output, OnDestroy, EventEmitter, Renderer } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { TracksPlayBookUtilService } from '../services/tracks-play-book-util.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { Pagination } from '../../core/models/pagination';
import { CustomResponse } from '../../common/models/custom-response';
import { ModulesDisplayType } from 'app/util/models/modules-display-type';
import { SortOption } from '../../core/models/sort-option';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { PagerService } from '../../core/services/pager.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UtilService } from '../../core/services/util.service';
import { TracksPlayBook } from '../models/tracks-play-book'
import { TracksPlayBookType } from '../models/tracks-play-book-type.enum'
import { Roles } from 'app/core/models/roles';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';


declare var swal:any, $: any;

@Component({
  selector: 'app-manage-tracks-play-book',
  templateUrl: './manage-tracks-play-book.component.html',
  styleUrls: ['./manage-tracks-play-book.component.css'],
  providers: [Pagination, HttpRequestLoader, SortOption],
})
export class ManageTracksPlayBookComponent implements OnInit, OnDestroy {
  readonly XAMPLIFY_CONSTANTS = XAMPLIFY_CONSTANTS;
  pagination: Pagination = new Pagination();
  loggedInUserId = 0;
  UnPublishedId =0 ;
  showFolderView = true;
  selectedOption : boolean ;
  message = "";
  customResponse: CustomResponse = new CustomResponse();
  modulesDisplayType = new ModulesDisplayType();
  exportObject: any = {};
  categoryId: number = 0;
  ngxloading = false;
  isPartnerView: boolean = false;
  @Input() type: string;
  /********XNFR-169******/
  roles:Roles = new Roles();
  showUpArrowButton = false;
  folderViewType = "";
  @Input() folderListViewCategoryId:any;
  folderListView = false;
  viewType: string;
  tracksModule:boolean = false;
  moduleId:number = 0;
	@Output() updatedItemsCountEmitter = new EventEmitter();
  @Output() notifyParentComponent = new EventEmitter();
	@Input() folderListViewExpanded = false;
  titleHeader:string = "";
  suffixHeader:string = "";
  trackOrPlayBookText = "";
  /****XNFR-327****/
  showRefreshNotification = false;
  constructor(private route: ActivatedRoute, public referenceService: ReferenceService, public authenticationService: AuthenticationService,
    public tracksPlayBookUtilService: TracksPlayBookUtilService, public pagerService: PagerService, private router: Router, private vanityUrlService: VanityURLService,
    public httpRequestLoader: HttpRequestLoader, public sortOption: SortOption, public logger: XtremandLogger, private utilService: UtilService, public renderer: Renderer,) {
    this.referenceService.renderer = this.renderer;
    this.pagination.vanityUrlFilter = this.vanityUrlService.isVanityURLEnabled();
  }

  ngOnInit() {
    this.tracksModule = this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK];
    this.moduleId = this.tracksModule ? this.roles.learningTrackId :this.roles.playbookId;
    this.isPartnerView = this.router.url.indexOf('/shared') > -1;
    this.titleHeader = this.tracksModule ? "Tracks" : "Play Books";
    this.trackOrPlayBookText = this.tracksModule ? "track" : "play book";
    this.suffixHeader = this.isPartnerView ? 'Shared ':'Manage ';
    if(this.folderListViewCategoryId!=undefined){
			this.categoryId = this.folderListViewCategoryId;
			this.folderListView = true;
		}else{
			this.viewType = this.route.snapshot.params['viewType'];
			this.categoryId = this.route.snapshot.params['categoryId'];
			this.folderViewType = this.route.snapshot.params['folderViewType'];
			this.showUpArrowButton = this.categoryId!=undefined && this.categoryId!=0;
		}
		if (this.viewType != undefined) {
			this.modulesDisplayType = this.referenceService.setDisplayType(this.modulesDisplayType, this.viewType);
		} else {
			if(this.categoryId==undefined || this.categoryId==0){
				this.modulesDisplayType = this.referenceService.setDefaultDisplayType(this.modulesDisplayType);
				if(this.modulesDisplayType.isFolderListView){
					this.referenceService.goToManageTracksOrPlayBooks("fl",this.isPartnerView,this.tracksModule);
				}else if(this.modulesDisplayType.isFolderGridView){
					this.referenceService.goToManageTracksOrPlayBooks("fg",this.isPartnerView,this.tracksModule);
				}
			}
		}
    this.loggedInUserId = this.authenticationService.getUserId();
    this.pagination.userId = this.loggedInUserId;
    if (this.referenceService.isCreated) {
      if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
        this.message = "Track created successfully";
      } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
        this.message = "Play Book created successfully";
      }
      this.showMessageOnTop(this.message);
    } else if (this.referenceService.isUpdated) {
      if ((this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) && !this.folderListViewExpanded) {
        this.message = "Track updated successfully";
        this.showMessageOnTop(this.message);
      } else if ((this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) && !this.folderListViewExpanded) {
        this.message = "Play Book updated successfully";
        this.showMessageOnTop(this.message);
      }
    }
    if(this.viewType!="fl" && this.viewType!="fg"){
      this.listLearningTracks(this.pagination);
    }
  }
/********XNFR-170******/
setViewType(viewType: string) {
  if(this.viewType!=viewType){
    if (this.folderListView) {
      let gridView = "g" == viewType;
      this.modulesDisplayType.isGridView = gridView;
      this.modulesDisplayType.isListView = !gridView;
    } else {
      if (this.folderViewType != undefined && viewType != "fg") {
        this.referenceService.goToManageTracksOrPlayBooksByCategoryId("fg", viewType, this.categoryId,this.isPartnerView,this.tracksModule);
      } else {
        this.referenceService.goToManageTracksOrPlayBooks(viewType,this.isPartnerView,this.tracksModule);
      }
    }
  }
}
  ngOnDestroy() {
    this.referenceService.isCreated = false;
    this.referenceService.isUpdated = false;
    swal.close();
  }

  showMessageOnTop(message: string) {
    $(window).scrollTop(0);
    this.customResponse = new CustomResponse('SUCCESS', message, true);
  }

 
  listLearningTracks(pagination: Pagination) {
    if(!this.folderListView){
			this.referenceService.goToTop();
		}
    this.referenceService.loading(this.httpRequestLoader, true);
    pagination.categoryId = this.categoryId;
    pagination.lmsType = this.type;
    this.setDefaultSortParameter();
    /**********Vanity Url Filter**************** */
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.pagination.vanityUrlFilter = true;
    }
    this.tracksPlayBookUtilService.list(pagination, this.isPartnerView).subscribe(
      (response: any) => {
        const data = response.data;
        if (response.statusCode == 200) {
          pagination.totalRecords = data.totalRecords;
          this.sortOption.totalRecords = data.totalRecords;
          let publishingTracks = [];
          $.each(data.data, function (_index:number, learningTrack:any) {
            learningTrack.createdDateString = new Date(learningTrack.createdTime);
            learningTrack.featuredImage = learningTrack.featuredImage + "?" + Date.now();
            let toolTipTagNames: string = "";
            learningTrack.tagNames.sort();
            $.each(learningTrack.tagNames, function (index:any, tagName:string) {
              if (index > 1) {
                if(toolTipTagNames.length > 0){
                  toolTipTagNames = toolTipTagNames + ", " + tagName ;
                } else {
                  toolTipTagNames = tagName;
                }
              }
            });
            learningTrack.toolTipTagNames = toolTipTagNames;
            if(learningTrack.publishingOrWhiteLabelingInProgress){
              publishingTracks.push(learningTrack);
            }
          });
          this.showRefreshNotification = publishingTracks.length>0;
          pagination = this.pagerService.getPagedItems(pagination, data.data);
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      },
      (error: any) => {
        this.logger.errorPage(error);
      },()=>{
        this.callFolderListViewEmitter();
      });
  }
  /******XBI-2598****/
  private setDefaultSortParameter() {
    if (this.isPartnerView && this.pagination.sortcolumn == null) {
      const sortedValue = this.sortOption.damSortOption.value;
      if (sortedValue !== '') {
        const options: string[] = sortedValue.split('-');
        this.pagination.sortcolumn = options[0];
        this.pagination.sortingOrder = options[1];
      }
    }
  }

  /********************Pagaination&Search Code*****************/

  /*************************Sort********************** */
  sortTracks(text: any) {
    this.sortOption.damSortOption = text;
    this.getAllFilteredResults();
  }


  /*************************Search********************** */
  searchLearningTracks() {
    this.getAllFilteredResults();
  }

  paginationDropdown(items: any) {
    this.sortOption.itemsSize = items;
    this.getAllFilteredResults();
  }

  /************Page************** */
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.listLearningTracks(this.pagination);
  }

  getAllFilteredResults() {
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = this.sortOption.searchKey;
    this.pagination = this.utilService.sortOptionValues(this.sortOption.damSortOption, this.pagination);
		this.listLearningTracks(this.pagination);
  }
  eventHandler(keyCode: any) { if (keyCode === 13) { this.searchLearningTracks(); } }

  edit(id: number) {
    if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
      let url = "/home/tracks/edit/" + id;
		  this.referenceService.navigateToRouterByViewTypes(url,this.categoryId,this.viewType,this.folderViewType,this.folderListView);
    } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
      let url = "/home/playbook/edit/" + id;
      this.referenceService.navigateToRouterByViewTypes(url,this.categoryId,this.viewType,this.folderViewType,this.folderListView);
    }
  }

  confirmDelete(track: any) {
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

      }).then(function () {
        self.delete(track);
      }, function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
    } catch (error) {
      this.logger.error(this.referenceService.errorPrepender + " confirmDelete():" + error);
      this.referenceService.showServerError(this.httpRequestLoader);
    }
  }

  delete(track: any) {
    let tracksPlayBook: TracksPlayBook = new TracksPlayBook();
    tracksPlayBook.id = track.id;
    tracksPlayBook.userId = this.loggedInUserId;
    tracksPlayBook.type = this.type;
    this.customResponse = new CustomResponse();
    this.referenceService.loading(this.httpRequestLoader, true);
    this.referenceService.goToTop();
    this.tracksPlayBookUtilService.deleteById(tracksPlayBook).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          this.customResponse = new CustomResponse('SUCCESS', track.title+" Deleted Successfully", true);
          this.pagination.pageIndex = 1;
          this.listLearningTracks(this.pagination);
        } else {
          swal("Please Contact Admin!", response.message, "error");
          this.referenceService.stopLoader(this.httpRequestLoader);
        }
      },
      (error: string) => {
        this.logger.errorPage(error);
        this.referenceService.showServerError(this.httpRequestLoader);
        this.referenceService.stopLoader(this.httpRequestLoader);
      });
  }

  previewLms() {
    this.referenceService.showSweetAlertInfoMessage();
  }

  confirmChangePublish(id: number, isPublish: boolean, learningTrack: any) {
    if (isPublish && this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK] && !learningTrack.hasDamContent) {
      swal({
        title: 'Add assets to publish.',
        type: 'warning',
        swalConfirmButtonColor: '#54a7e9',
        confirmButtonText: 'Ok'

      }).then(function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
    } else {
      let text = "";
      if (isPublish) {
        text = "You want to publish.";
      } 
      try {
        let self = this;
        swal({
          title: 'Are you sure?',
          text: text,
          type: 'warning',
          showCancelButton: true,
          swalConfirmButtonColor: '#54a7e9',
          swalCancelButtonColor: '#999',
          confirmButtonText: 'Yes'

        }).then(function () {
          self.ChangePublish(id, isPublish);
        }, function (dismiss: any) {
          console.log('you clicked on option' + dismiss);
        });
      } catch (error) {
        this.logger.error(this.referenceService.errorPrepender + " ChangePublish():" + error);
        this.referenceService.showServerError(this.httpRequestLoader);
      }
    }
  }

  UnpublishedModalPopUp(id: number){
    this.UnPublishedId =id ;
    $('#unpublished-modal').modal('show');
  }

  unPublishAction(id: number, isPublish: boolean,){
    if(this.UnPublishedId != 0){
      this.ChangePublish(this.UnPublishedId, isPublish);
      this.selectedOption = false ;
    }
    this.closePopUp()
  }

  closePopUp(){
    $('#unpublished-modal').modal('hide');
    $('input[name="rdaction"]').prop('checked', false);
    this.selectedOption = false;
    this.notifyParentComponent.emit();
  }

  ChangePublish(learningTrackId: number, isPublish: boolean) {
    this.customResponse = new CustomResponse();
    this.referenceService.startLoader(this.httpRequestLoader);
    this.tracksPlayBookUtilService.changePublish(learningTrackId, isPublish).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          /****XBI-2589***/
          let trackOrPlayBook =  this.tracksModule ? "Track":"Play Book";
          let message = isPublish ? trackOrPlayBook+" Published Successsfully":trackOrPlayBook+" Unpublished Successfully";
          this.customResponse = new CustomResponse('SUCCESS',message,true);
          this.listLearningTracks(this.pagination);
        } else if(response.statusCode == 401) {
          this.referenceService.showSweetAlertErrorMessage(response.message);
          this.referenceService.stopLoader(this.httpRequestLoader);
        }
      },
      (error: string) => {
        this.logger.errorPage(error);
        this.referenceService.showServerError(this.httpRequestLoader);
        this.referenceService.stopLoader(this.httpRequestLoader);
      })
  }

  view(tracksPlayBook: TracksPlayBook) {
    let route = "";
    if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
      route = "/home/tracks/tb/" + tracksPlayBook.createdByCompanyId + "/" + tracksPlayBook.slug;
    } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
      route = "/home/playbook/pb/" + tracksPlayBook.createdByCompanyId + "/" + tracksPlayBook.slug;
    }
    this.referenceService.navigateToRouterByViewTypes(route,this.categoryId,this.viewType,this.folderViewType,this.folderListView);

  }

  viewAnalytics(tracksPlayBook: TracksPlayBook) {
    let route = "";
    if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
      route = "/home/tracks/analytics/" + tracksPlayBook.id;
    } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
      route = "/home/playbook/analytics/" + tracksPlayBook.id;
    }
    this.referenceService.navigateToRouterByViewTypes(route,this.categoryId,this.viewType,this.folderViewType,this.folderListView);
  }

  refreshPage() {
    this.listLearningTracks(this.pagination);
  }

  callFolderListViewEmitter(){
		if(this.folderListView){
			this.exportObject['categoryId'] = this.categoryId;
      this.exportObject['itemsCount'] = this.pagination.totalRecords;	
      this.updatedItemsCountEmitter.emit(this.exportObject);
		}
	 }

}
