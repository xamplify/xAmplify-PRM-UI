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
  isPartner: boolean = false;


  constructor(private route: ActivatedRoute, public referenceService: ReferenceService, public authenticationService: AuthenticationService,
    public lmsService: LmsService, public pagerService: PagerService, private router: Router, private vanityUrlService: VanityURLService,
    public httpRequestLoader: HttpRequestLoader, public sortOption: SortOption, public logger: XtremandLogger, private utilService: UtilService) {
    this.pagination.vanityUrlFilter = this.vanityUrlService.isVanityURLEnabled();
    if (this.router.url.indexOf('/manage') > -1) {
      this.showFolderView = true;
    } else {
      this.showFolderView = false;
    }
    this.loggedInUserId = this.authenticationService.getUserId();
    this.pagination.userId = this.loggedInUserId;
    if (this.referenceService.isCreated) {
      this.message = "Learning track created successfully";
      this.showMessageOnTop(this.message);
    } else if (this.referenceService.isUpdated) {
      this.message = "Learning track updated successfully";
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
    this.lmsService.list(pagination, this.isPartner).subscribe(
      (response: any) => {
        const data = response.data;
        if (response.statusCode == 200) {
          pagination.totalRecords = data.totalRecords;
          this.sortOption.totalRecords = data.totalRecords;
          $.each(data.data, function (index, learningTrack) {
            learningTrack.createdDateString = new Date(learningTrack.createdDateString);
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
    this.referenceService.startLoader(this.httpRequestLoader);
    this.lmsService.getById(id).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          this.lmsService.learningTrack = response.data;
          this.router.navigate(["/home/lms/edit"]);
        } else {
          swal("Please Contact Admin!", response.message, "error");
        }
        this.referenceService.stopLoader(this.httpRequestLoader);
      },
      (error: string) => {
        this.logger.errorPage(error);
        this.referenceService.showServerError(this.httpRequestLoader);
        this.referenceService.stopLoader(this.httpRequestLoader);

      }
    )

  }

}
