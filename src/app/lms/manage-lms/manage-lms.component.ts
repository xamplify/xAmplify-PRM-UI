import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { LmsService } from '../services/lms.service';
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
import { LearningTrack } from '../models/learningTrack';


declare var swal, $: any;

@Component({
  selector: 'app-manage-lms',
  templateUrl: './manage-lms.component.html',
  styleUrls: ['./manage-lms.component.css'],
  providers: [Pagination, HttpRequestLoader, SortOption],
})
export class ManageLmsComponent implements OnInit {

  pagination: Pagination = new Pagination();
  loggedInUserId = 0;
  showFolderView = true;
  message = "";
  customResponse: CustomResponse = new CustomResponse();
  modulesDisplayType = new ModulesDisplayType();
  exportObject: any = {};
  categoryId: number = 0;
  isPartnerView: boolean = false;
  ngxloading = false;
  constructor(private route: ActivatedRoute, public referenceService: ReferenceService, public authenticationService: AuthenticationService,
    public lmsService: LmsService, public pagerService: PagerService, private router: Router, private vanityUrlService: VanityURLService,
    public httpRequestLoader: HttpRequestLoader, public sortOption: SortOption, public logger: XtremandLogger, private utilService: UtilService) {
    this.pagination.vanityUrlFilter = this.vanityUrlService.isVanityURLEnabled();
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
      this.message = "Track Builder created successfully";
      this.showMessageOnTop(this.message);
    } else if (this.referenceService.isUpdated) {
      this.message = "Track Builder updated successfully";
      this.showMessageOnTop(this.message);
    }
    this.listLearningTracks(this.pagination);
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.referenceService.isCreated = false;
    this.referenceService.isUpdated = false;
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
        this.router.navigateByUrl('/home/lms/manage/');
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
      this.router.navigateByUrl('/home/lms/manage');
    }
  }

  listLearningTracks(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    /**********Vanity Url Filter**************** */
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.pagination.vanityUrlFilter = true;
    }
    this.lmsService.list(pagination, this.isPartnerView).subscribe(
      (response: any) => {
        const data = response.data;
        if (response.statusCode == 200) {
          pagination.totalRecords = data.totalRecords;
          this.sortOption.totalRecords = data.totalRecords;
          $.each(data.data, function (index, learningTrack) {
            learningTrack.createdDateString = new Date(learningTrack.createdTime);
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
    this.referenceService.goToRouter("/home/lms/edit/" + id);
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
    let learningTrack: LearningTrack = new LearningTrack();
    learningTrack.id = id;
    learningTrack.userId = this.loggedInUserId;
    this.customResponse = new CustomResponse();
    this.referenceService.loading(this.httpRequestLoader, true);
    this.referenceService.goToTop();
    this.lmsService.deleteById(learningTrack).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          this.referenceService.showInfo("Track Builder Deleted Successfully", "");
          const message = response.message;
          this.customResponse = new CustomResponse('SUCCESS', "Track Builder Deleted Successfully", true);
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

  previewLms(){
    this.referenceService.showSweetAlertInfoMessage();
  }

  confirmChangePublish(id: number, isPublish: boolean) {
    let text = "";
    if(isPublish){
      text = "You want to publish.";
    }else {
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

  ChangePublish(learningTrackId: number, isPublish: boolean){
    this.referenceService.startLoader(this.httpRequestLoader);
    this.lmsService.changePublish(learningTrackId, isPublish).subscribe(
      (respone:any) => {
        if(respone.statusCode == 200){
          this.listLearningTracks(this.pagination);
        }
        this.referenceService.stopLoader(this.httpRequestLoader);
      },
      (error: string) => {
        this.logger.errorPage(error);
        this.referenceService.showServerError(this.httpRequestLoader);
        this.referenceService.stopLoader(this.httpRequestLoader);
      })
    }

    view(learningTrack:LearningTrack){
      let route = "/home/lms/lt/"  +  learningTrack.createdByCompanyId + "/" + learningTrack.slug;
      this.referenceService.goToRouter(route);
    }

    viewAnalytics(learningTrack:LearningTrack){
      let route = "/home/lms/analytics/"  +  learningTrack.id;
      this.referenceService.goToRouter(route);
    }
}
