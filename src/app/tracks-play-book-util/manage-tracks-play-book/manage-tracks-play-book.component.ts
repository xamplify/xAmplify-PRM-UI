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
import { LearningTrack } from 'app/lms/models/learningTrack';

declare var swal, $: any;

@Component({
  selector: 'app-manage-tracks-play-book',
  templateUrl: './manage-tracks-play-book.component.html',
  styleUrls: ['./manage-tracks-play-book.component.css'],
  providers: [Pagination, HttpRequestLoader, SortOption],
})
export class ManageTracksPlayBookComponent implements OnInit, OnDestroy {

  pagination: Pagination = new Pagination();
  loggedInUserId = 0;
  showFolderView = true;
  message = "";
  customResponse: CustomResponse = new CustomResponse();
  modulesDisplayType = new ModulesDisplayType();
  exportObject: any = {};
  categoryId: number = 0;
  ngxloading = false;
  isPartnerView: boolean = false;
  @Input() type: string;

  constructor(private route: ActivatedRoute, public referenceService: ReferenceService, public authenticationService: AuthenticationService,
    public tracksPlayBookUtilService: TracksPlayBookUtilService, public pagerService: PagerService, private router: Router, private vanityUrlService: VanityURLService,
    public httpRequestLoader: HttpRequestLoader, public sortOption: SortOption, public logger: XtremandLogger, private utilService: UtilService, public renderer: Renderer,) {
    this.referenceService.renderer = this.renderer;
    this.pagination.vanityUrlFilter = this.vanityUrlService.isVanityURLEnabled();
  }

  ngOnInit() {
    this.modulesDisplayType = this.referenceService.setDefaultDisplayType(this.modulesDisplayType);
    if (!this.modulesDisplayType.isListView && !this.modulesDisplayType.isGridView) {
      this.setViewType("List");
    }
    if (this.router.url.indexOf('/manage') > -1) {
      this.showFolderView = true;
      this.isPartnerView = false;
    } else {
      this.showFolderView = false;
      this.isPartnerView = true;
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
      if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
        this.message = "Track updated successfully";
      } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
        this.message = "Play Book updated successfully";
      }
      this.showMessageOnTop(this.message);
    }
    this.listLearningTracks(this.pagination);
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

  getUpdatedValue(event: any) {
    let viewType = event.viewType;
    if (viewType != undefined) {
      this.setViewType(viewType);
    }
  }

  setViewType(viewType: string) {
    if ("List" == viewType) {
      this.modulesDisplayType.isListView = true;
      this.modulesDisplayType.isGridView = false;
      this.modulesDisplayType.isFolderGridView = false;
      this.modulesDisplayType.isFolderListView = false;
      this.navigateToManageSection(viewType);
    } else if ("Grid" == viewType) {
      this.modulesDisplayType.isListView = false;
      this.modulesDisplayType.isGridView = true;
      this.modulesDisplayType.isFolderGridView = false;
      this.modulesDisplayType.isFolderListView = false;
      this.navigateToManageSection(viewType);
    } else if ("Folder-Grid" == viewType) {
      this.modulesDisplayType.isListView = false;
      this.modulesDisplayType.isGridView = false;
      this.modulesDisplayType.isFolderListView = false;
      this.modulesDisplayType.isFolderGridView = true;
      this.exportObject['type'] = 2;
      this.exportObject['folderType'] = viewType;
      if (this.categoryId > 0) {
        if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
          this.router.navigateByUrl('/home/tracks/manage/');
        } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
          this.router.navigateByUrl('/home/playbook/manage/');
        }
      }
    } else if ("Folder-List" == viewType) {
      this.modulesDisplayType.isListView = false;
      this.modulesDisplayType.isGridView = false;
      this.modulesDisplayType.isFolderGridView = false;
      this.modulesDisplayType.isFolderListView = true;
      this.exportObject['folderType'] = viewType;
      this.exportObject['type'] = 2;
    }
  }

  navigateToManageSection(viewType: string) {
    if ("List" == viewType && (this.categoryId == undefined || this.categoryId == 0)) {
      this.modulesDisplayType.isListView = true;
      this.modulesDisplayType.isGridView = false;
      this.modulesDisplayType.isFolderGridView = false;
      this.modulesDisplayType.isFolderListView = false;
      this.listLearningTracks(this.pagination);
    } else if ("Grid" == viewType && (this.categoryId == undefined || this.categoryId == 0)) {
      this.modulesDisplayType.isGridView = true;
      this.modulesDisplayType.isFolderGridView = false;
      this.modulesDisplayType.isFolderListView = false;
      this.modulesDisplayType.isListView = false;
      this.listLearningTracks(this.pagination);
    } else if (this.modulesDisplayType.defaultDisplayType == "FOLDER_GRID" || this.modulesDisplayType.defaultDisplayType == "FOLDER_LIST"
      && (this.categoryId == undefined || this.categoryId == 0)) {
      this.modulesDisplayType.isFolderGridView = false;
      this.modulesDisplayType.isFolderListView = false;
      if ("List" == viewType) {
        this.modulesDisplayType.isGridView = false;
        this.modulesDisplayType.isListView = true;
      } else {
        this.modulesDisplayType.isGridView = true;
        this.modulesDisplayType.isListView = false;
      }
      this.listLearningTracks(this.pagination);
    }
    else if (this.router.url.endsWith('manage/')) {
      if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
        this.router.navigateByUrl('/home/tracks/manage/');
      } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
        this.router.navigateByUrl('/home/playbook/manage/');
      }
    }
  }

  listLearningTracks(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    pagination.lmsType = this.type;
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
          $.each(data.data, function (index, learningTrack) {
            learningTrack.createdDateString = new Date(learningTrack.createdTime);
            learningTrack.featuredImage = learningTrack.featuredImage + "?" + Date.now();
            let toolTipTagNames: string = "";
            learningTrack.tagNames.sort();
            $.each(learningTrack.tagNames, function (index, tagName) {
              if (index > 1) {
                if(toolTipTagNames.length > 0){
                  toolTipTagNames = toolTipTagNames + ", " + tagName ;
                } else {
                  toolTipTagNames = tagName;
                }
              }
            });
            learningTrack.toolTipTagNames = toolTipTagNames;
          });
          pagination = this.pagerService.getPagedItems(pagination, data.data);
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      },
      (error: any) => {
        this.logger.errorPage(error);
      });
  }
  /********************Pagaination&Search Code*****************/

  /*************************Sort********************** */
  sortBy(text: any) {
    //this.sortOption.formsSortOption = text;
    this.getAllFilteredResults(this.pagination);
  }


  /*************************Search********************** */
  searchLearningTracks() {
    this.getAllFilteredResults(this.pagination);
  }

  paginationDropdown(items: any) {
    this.sortOption.itemsSize = items;
    this.getAllFilteredResults(this.pagination);
  }

  /************Page************** */
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.listLearningTracks(this.pagination);
  }

  getAllFilteredResults(pagination: Pagination) {
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = this.sortOption.searchKey;
    //this.pagination = this.utilService.sortOptionValues(this.sortOption.formsSortOption, this.pagination);
    this.listLearningTracks(this.pagination);
  }
  eventHandler(keyCode: any) { if (keyCode === 13) { this.searchLearningTracks(); } }

  edit(id: number) {
    if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
      this.referenceService.goToRouter("/home/tracks/edit/" + id);
    } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
      this.referenceService.goToRouter("/home/playbook/edit/" + id);
    }
  }

  confirmDelete(id: number) {
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
        self.delete(id);
      }, function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
    } catch (error) {
      this.logger.error(this.referenceService.errorPrepender + " confirmDelete():" + error);
      this.referenceService.showServerError(this.httpRequestLoader);
    }
  }

  delete(id: number) {
    let tracksPlayBook: TracksPlayBook = new TracksPlayBook();
    tracksPlayBook.id = id;
    tracksPlayBook.userId = this.loggedInUserId;
    tracksPlayBook.type = this.type;
    this.customResponse = new CustomResponse();
    this.referenceService.loading(this.httpRequestLoader, true);
    this.referenceService.goToTop();
    this.tracksPlayBookUtilService.deleteById(tracksPlayBook).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
            this.referenceService.showInfo("Track Deleted Successfully", "");
          } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
            this.referenceService.showInfo("Play Book Deleted Successfully", "");
          }
          const message = response.message;
          if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
            this.customResponse = new CustomResponse('SUCCESS', "Track Deleted Successfully", true);
          } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
            this.customResponse = new CustomResponse('SUCCESS', "Play Book Deleted Successfully", true);
          }
          this.pagination.pageIndex = 1;
          this.listLearningTracks(this.pagination);
        } else {
          swal("Please Contact Admin!", response.message, "error");
        }
        this.referenceService.stopLoader(this.httpRequestLoader);
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

  confirmChangePublish(id: number, isPublish: boolean) {
    let text = "";
    if (isPublish) {
      text = "You want to publish.";
    } else {
      text = "You want to unpublish.";
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

  ChangePublish(learningTrackId: number, isPublish: boolean) {
    this.referenceService.startLoader(this.httpRequestLoader);
    this.tracksPlayBookUtilService.changePublish(learningTrackId, isPublish).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          this.listLearningTracks(this.pagination);
        } else if(response.statusCode == 401) {
          this.referenceService.showSweetAlertErrorMessage(response.message);
        }
        this.referenceService.stopLoader(this.httpRequestLoader);
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
    this.referenceService.goToRouter(route);
  }

  viewAnalytics(tracksPlayBook: TracksPlayBook) {
    let route = "/home/tracks/analytics/" + tracksPlayBook.id;
    if (this.type == undefined || this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
      route = "/home/tracks/analytics/" + tracksPlayBook.id;
    } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
      route = "/home/playbook/analytics/" + tracksPlayBook.id;
    }
    this.referenceService.goToRouter(route);
  }

  refreshPage() {
    this.listLearningTracks(this.pagination);
  }

}
