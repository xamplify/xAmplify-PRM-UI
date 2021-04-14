import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { LmsService } from '../services/lms.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Form } from '../../forms/models/form';
import { FormService } from '../../forms/services/form.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { SortOption } from '../../core/models/sort-option';
import { ColumnInfo } from '../../forms/models/column-info';
import { DomSanitizer } from "@angular/platform-browser";
import { EnvService } from 'app/env.service'
import { UtilService } from '../../core/services/util.service';
import { Tag } from 'app/dashboard/models/tag'
import { UserService } from '../../core/services/user.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { LearningTrack } from '../models/learningTrack'
import { DragulaService } from 'ng2-dragula';
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { LmsDto } from '../models/lms-dto'
import { DamService } from '../../dam/services/dam.service'
import { VanityLoginDto } from '../../util/models/vanity-login-dto';
import { ContactService } from '../../contacts/services/contact.service'
import { ImageCropperComponent } from 'ng2-img-cropper';
import { ImageCroppedEvent } from '../../common/image-cropper/interfaces/image-cropped-event.interface';
import { AddFolderModalPopupComponent } from 'app/util/add-folder-modal-popup/add-folder-modal-popup.component';

declare var $, swal, CKEDITOR: any;

@Component({
  selector: 'app-add-lms-new',
  templateUrl: './add-lms-new.component.html',
  styleUrls: ['./add-lms-new.component.css'],
  providers: [HttpRequestLoader, Pagination, SortOption, FormService, RegularExpressions, DamService, ContactService]
})
export class AddLmsNewComponent implements OnInit {

  activeTabName: string = "";
  defaultTabClass = "col-block width";
  activeTabClass = "col-block width col-block-active";
  completedTabClass = "col-block width col-block-complete";
  disableTabClass = "col-block width col-block-disable";
  stepOneTabClass = this.defaultTabClass;
  stepTwoTabClass = this.defaultTabClass;
  stepThreeTabClass = this.defaultTabClass;
  stepFourTabClass = this.defaultTabClass;

  form: Form = new Form();
  ngxloading = false;
  loading = false;
  formError = false;
  customResponse: CustomResponse = new CustomResponse();
  folderOrTagsCustomResponse: CustomResponse = new CustomResponse();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  isPartnerView = false;
  SubmitButtonValue = "Save"
  SubmitAndPublishButtonValue = "Save & Publish"
  //heading = "Add New Learning Track"
  formsError: boolean = false;
  formPagination: Pagination = new Pagination();
  formSortOption: SortOption = new SortOption();
  formsLoader: HttpRequestLoader = new HttpRequestLoader();
  name = 'ng2-ckeditor';
  ckeConfig: any;
  @ViewChild("myckeditor") ckeditor: any;
  formBackgroundImage = "";
  pageBackgroundColor = "";
  siteKey = "";
  selectedFormData: Array<Form> = [];
  selectedFormId: number;
  loggedInUserId = 0;
  loggedInUserCompanyId = 0;
  tags: Array<Tag> = new Array<Tag>();
  selectedTags: Array<Tag> = new Array<Tag>();
  categoryNames: any;
  selectedFolder: Array<any> = new Array<any>();
  learningTrack: LearningTrack = new LearningTrack();
  learningTrackId: number = 0;
  isAdd: boolean = true;
  lmsResponse: CustomResponse = new CustomResponse();
  slug = "";
  quizFormPagination: Pagination = new Pagination();
  quizFormSortOption: SortOption = new SortOption();
  quizFormsError: boolean = false;
  quizFormsLoader: HttpRequestLoader = new HttpRequestLoader();

  assetPagination: Pagination = new Pagination();
  assetSortOption: SortOption = new SortOption();
  assetError: boolean = false;
  assetLoader: HttpRequestLoader = new HttpRequestLoader();
  selectedAssets: Array<LmsDto> = new Array<LmsDto>();

  PartnerCompaniesPagination: Pagination = new Pagination();
  PartnerCompaniesSortOption: SortOption = new SortOption();
  PartnerCompaniesLoader: HttpRequestLoader = new HttpRequestLoader();
  partnerCompanyList: Array<LmsDto> = new Array<LmsDto>();
  selectedPartnerCompanies: Array<LmsDto> = new Array<LmsDto>();

  groupList: Array<LmsDto> = new Array<LmsDto>();
  groupsPagination: Pagination = new Pagination();
  groupsSortOption: SortOption = new SortOption();
  groupsLoader: HttpRequestLoader = new HttpRequestLoader();
  selectedGroups: Array<LmsDto> = new Array<LmsDto>();
  groupName: string = "";
  groupId: number = 0;
  isLoading = false;
  groupInfoPagination: Pagination = new Pagination();

  isTitleValid: boolean = false;
  isSlugValid: boolean = false;
  isAssetValid: boolean = false;
  isGroupOrCompanyValid: boolean = false;
  isDescriptionValid: boolean = false;
  titleErrorMessage: string;
  slugErrorMessage: string;
  assetErrorMessage: string;
  groupOrCompanyErrorMessage: string;
  descriptionErrorMessage: string;
  linkPrefix: string = "";
  editRouterLink: string = "";

  isStepOneValid: boolean = false;
  isStepTwoValid: boolean = false;
  isStepThreeValid: boolean = false;
  isStepFourValid: boolean = false;

  @ViewChild(ImageCropperComponent) cropper: ImageCropperComponent;
  fileObj: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  squareCropperSettings: any;
  imagePath: string;
  cropRounded = false;
  showCropper = false;
  errorUploadCropper = false;
  fileSizeError = false;
  loadingcrop = false;
  featuredImagePath = "";
  existingSlug = "";
  openAddTagPopup: boolean = false;
  pagination: Pagination = new Pagination();
  @ViewChild('addFolderModalPopupComponent') addFolderModalPopupComponent: AddFolderModalPopupComponent;

  showFilePreview: boolean = false;
  isImage: boolean = false;
  isAudio: boolean = false;
  isVideo: boolean = false;
  isFile: boolean = false;
  filePath: string = "";
  viewer: string = "google";
  fileType: string = "";
  modalPopupLoader = false;
  imageTypes: Array<string> = ['jpg', 'jpeg', 'png'];
  fileTypes: Array<string> = ['txt', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'ppt', 'pptx'];
  isEditSlug: boolean = false;
  completeLink: string = "";
  private dom: Document;

  tagFirstColumnEndIndex: number = 0;
  tagsListFirstColumn: Array<Tag> = new Array<Tag>();
  tagsListSecondColumn: Array<Tag> = new Array<Tag>();
  tagSearchKey: string = "";

  isCkeditorLoaded: boolean = false;
  mediaLinkDisplayText: string = "";
  selectedAssetForMedia: any;
  folderName: string = "";
  showFolderDropDown: boolean = false;
  filteredCategoryNames: any;

  isGroupHeaderCheckBoxChecked: boolean = false;
  paginatedSelectedGroupIds = [];
  isCompanyHeaderCheckBoxChecked: boolean = false;
  paginatedSelectedCompanyIds = [];

  ckeditorEvent: any;

  constructor(public userService: UserService, public regularExpressions: RegularExpressions, private dragulaService: DragulaService, public logger: XtremandLogger, private formService: FormService, private route: ActivatedRoute, public referenceService: ReferenceService, public authenticationService: AuthenticationService, public lmsService: LmsService, private router: Router, public pagerService: PagerService,
    public sanitizer: DomSanitizer, public envService: EnvService, public utilService: UtilService, public damService: DamService,
    public xtremandLogger: XtremandLogger, public contactService: ContactService) {
    this.siteKey = this.envService.captchaSiteKey;
    this.loggedInUserId = this.authenticationService.getUserId();
    this.listTags(new Pagination());
    this.listCategories();
    this.getCompanyId();
    dragulaService.setOptions('assetsDragula', {})
    dragulaService.dropModel.subscribe((value) => {
      this.onDropModel(value);
    });
  }

  ngOnInit() {
    this.activeTabName = "step-1";
    if (this.router.url.indexOf('/edit') > -1) {
      this.learningTrackId = parseInt(this.route.snapshot.params['id']);
      if (this.learningTrackId > 0) {
        this.isAdd = false;
        this.stepOneTabClass = this.activeTabClass;
        this.stepTwoTabClass = this.completedTabClass;
        this.stepThreeTabClass = this.completedTabClass;
        this.stepFourTabClass = this.completedTabClass;
        this.editRouterLink = "/home/tracks/edit/" + this.learningTrackId;
        this.getById(this.learningTrackId);
        this.SubmitButtonValue = "Update"
        this.SubmitAndPublishButtonValue = "Update & Publish"
        //this.heading = "Edit Learning Track"
      } else {
        this.goToManageSectionWithError();
      }
    } else {
      this.isAdd = true;
      this.stepOneTabClass = this.activeTabClass;
      this.stepTwoTabClass = this.disableTabClass;
      this.stepThreeTabClass = this.disableTabClass;
      this.stepFourTabClass = this.disableTabClass;
    }
  }

  onReady(event: any) {
    this.isCkeditorLoaded = true;
  }

  ngOnDestroy() {
    this.dragulaService.destroy('assetsDragula');
  }

  goToManageSectionWithError() {
    this.referenceService.showSweetAlertErrorMessage("Invalid Id");
    this.referenceService.goToRouter("/home/tracks");
  }

  private onDropModel(args) {
  }

  changeActiveTab(activeTab: string) {
    this.activeTabName = activeTab;
    if (activeTab == "step-1") {
      this.stepOneTabClass = this.activeTabClass;
    } else if (activeTab == "step-2") {
      this.stepTwoTabClass = this.activeTabClass;
      //this.stepOneTabClass = this.completedTabClass;
    } else if (activeTab == "step-3") {
      this.stepThreeTabClass = this.activeTabClass;
      //this.stepTwoTabClass = this.completedTabClass;
      this.assetPagination = new Pagination();
      this.listAssets(this.assetPagination);
    } else if (activeTab == "step-4") {
      this.stepFourTabClass = this.activeTabClass;
      //this.stepThreeTabClass = this.completedTabClass;
      this.listGroups(this.groupsPagination);
      this.listPartnerCompanies(this.PartnerCompaniesPagination);
    }
    this.validateAllSteps();
  }

  getById(id: number) {
    this.ngxloading = true;
    let self = this;
    this.lmsService.getById(id).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          let learningTrack: LearningTrack = response.data;
          if (learningTrack != undefined) {
            this.learningTrack = learningTrack;
            this.featuredImagePath = this.learningTrack.featuredImage;
            this.existingSlug = this.learningTrack.slug;
            this.completeLink = this.linkPrefix + this.learningTrack.slug;
            if (this.learningTrack.quiz !== undefined) {
              this.learningTrack.quizId = this.learningTrack.quiz.id;
            }
            if (this.learningTrack.contents !== undefined && this.learningTrack.contents.length > 0) {
              this.selectedAssets = this.learningTrack.contents;
            }
            if (this.learningTrack.companies !== undefined && this.learningTrack.companies.length > 0) {
              this.selectedPartnerCompanies = this.learningTrack.companies;
              this.isCheckAllCompanies();
            }
            if (this.learningTrack.groups !== undefined && this.learningTrack.groups.length > 0) {
              this.selectedGroups = this.learningTrack.groups;
              this.isCheckAllGroups();
            }
            if (this.learningTrack.tags !== undefined && this.learningTrack.tags.length > 0) {
              this.selectedTags = this.learningTrack.tags;
              let tagIds: Array<number> = new Array<number>();
              $.each(this.selectedTags, function (index, tag) {
                tagIds.push(tag.id);
              });
              this.learningTrack.tagIds = tagIds;
            }
            if (this.learningTrack.category !== undefined) {
              this.learningTrack.categoryId = this.learningTrack.category.id;
              this.folderName = this.learningTrack.category.name;
            }
            this.validateLearningTrack();
            this.ngxloading = false;
          } else {
            this.goToManageSectionWithError();
            this.ngxloading = false;
          }
        } else {
          swal("Please Contact Admin!", response.message, "error");
          this.ngxloading = false;
        }
      },
      (error: string) => {
        this.logger.errorPage(error);
        this.referenceService.showServerError(this.httpRequestLoader);
        this.ngxloading = false;
      });
  }


  /************List Available Forms******************/
  getFormsList() {
    this.formsError = false;
    this.customResponse = new CustomResponse();
    this.formPagination.userId = this.loggedInUserId;
    this.listForms(this.formPagination);
    $('#formsList').modal('show');
  }

  listForms(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
    this.referenceService.loading(this.formsLoader, true);
    this.formService.list(pagination).subscribe(
      (response: any) => {
        const data = response.data;
        pagination.totalRecords = data.totalRecords;
        this.formSortOption.totalRecords = data.totalRecords;
        $.each(data.forms, function (index, form) {
          form.createdDateString = new Date(form.createdDateString);
        });
        pagination = this.pagerService.getPagedItems(pagination, data.forms);
        this.referenceService.loading(this.formsLoader, false);
      },
      (error: any) => {
        this.formsError = true;
        this.customResponse = new CustomResponse('ERROR', 'Unable to get forms.Please Contact Admin.', true);
      });
  }

  formsSortBy(text: any) {
    this.formSortOption.formsSortOption = text;
    this.getAllFormsFilteredResults(this.formPagination);
  }

  searchForms() {
    this.getAllFormsFilteredResults(this.formPagination);
  }

  formsPaginationDropdown(items: any) {
    this.formSortOption.itemsSize = items;
    this.getAllFormsFilteredResults(this.formPagination);
  }

  setFormsPage(event: any) {
    this.formPagination.pageIndex = event.page;
    this.listForms(this.formPagination);
  }

  getAllFormsFilteredResults(pagination: Pagination) {
    this.formPagination.pageIndex = 1;
    this.formPagination.searchKey = this.formSortOption.searchKey;
    this.formPagination = this.utilService.sortOptionValues(this.formSortOption.formsSortOption, this.formPagination);
    this.listForms(this.formPagination);
  }

  formsEventHandler(keyCode: any) { if (keyCode === 13) { this.searchForms(); } }


  /*************************Quiz Forms********************** */
  listQuizForms(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
    this.referenceService.loading(this.quizFormsLoader, true);
    this.referenceService.startLoader(this.httpRequestLoader);
    this.formService.quizList(pagination).subscribe(
      (response: any) => {
        const data = response.data;
        pagination.totalRecords = data.totalRecords;
        this.quizFormSortOption.totalRecords = data.totalRecords;
        $.each(data.forms, function (index, form) {
          form.createdDateString = new Date(form.createdDateString);
        });
        pagination = this.pagerService.getPagedItems(pagination, data.forms);
        this.referenceService.loading(this.quizFormsLoader, false);
        this.referenceService.stopLoader(this.httpRequestLoader);
      },
      (error: any) => {
        this.customResponse = new CustomResponse('ERROR', 'Unable to get forms.Please Contact Admin.', true);
        this.referenceService.stopLoader(this.httpRequestLoader);
      });
  }

  quizSortBy(text: any) {
    this.quizFormSortOption.formsSortOption = text;
    this.getAllQuizFilteredResults(this.quizFormPagination);
  }

  searchQuizForms() {
    this.getAllQuizFilteredResults(this.quizFormPagination);
  }

  quizPaginationDropdown(items: any) {
    this.quizFormSortOption.itemsSize = items;
    this.getAllQuizFilteredResults(this.quizFormPagination);
  }

  setQuizPage(event: any) {
    this.quizFormPagination.pageIndex = event.page;
    this.listQuizForms(this.quizFormPagination);
  }

  getAllQuizFilteredResults(pagination: Pagination) {
    this.quizFormPagination.pageIndex = 1;
    this.quizFormPagination.searchKey = this.quizFormSortOption.searchKey;
    this.quizFormPagination = this.utilService.sortOptionValues(this.quizFormSortOption.formsSortOption, this.quizFormPagination);
    this.listQuizForms(this.quizFormPagination);
  }

  quizEventHandler(keyCode: any) { if (keyCode === 13) { this.searchQuizForms(); } }


  /*************************List Assets********************** */
  listAssets(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
    pagination.companyId = this.loggedInUserCompanyId;
    this.referenceService.goToTop();
    this.startLoaders();
    this.damService.list(pagination).subscribe((result: any) => {
      if (result.statusCode === 200) {
        let data = result.data;
        pagination.totalRecords = data.totalRecords;
        this.assetSortOption.totalRecords = data.totalRecords;
        $.each(data.assets, function (_index: number, asset: any) {
          asset.displayTime = new Date(asset.createdDateInUTCString);
        });
        pagination = this.pagerService.getPagedItems(pagination, data.assets);
      }
      this.stopLoaders();
    }, error => {
      this.stopLoadersAndShowError(error);
    });
  }

  listPublishedAssets(pagination: Pagination) {
    this.referenceService.goToTop();
    this.startLoaders();
    this.damService.listPublishedAssets(pagination).subscribe((result: any) => {
      if (result.statusCode === 200) {
        let data = result.data;
        pagination.totalRecords = data.totalRecords;
        $.each(data.assets, function (_index: number, asset: any) {
          asset.displayTime = new Date(asset.publishedTimeInUTCString);
        });
        pagination = this.pagerService.getPagedItems(pagination, data.assets);
      }
      this.stopLoaders();
    }, error => {
      this.stopLoadersAndShowError(error);
    });
  }

  assetSortBy(text: any) {
    if (this.isPartnerView) {
      this.assetSortOption.publishedDamSortOption = text;
    } else {
      this.assetSortOption.damSortOption = text;
    }
    this.getAllAssetFilteredResults(this.assetPagination);
  }

  searchAssets() {
    this.getAllAssetFilteredResults(this.assetPagination);
  }

  assetPaginationDropdown(items: any) {
    this.assetSortOption.itemsSize = items;
    this.getAllAssetFilteredResults(this.assetPagination);
  }

  setAssetPage(event: any) {
    this.assetPagination.pageIndex = event.page;
    if (this.isPartnerView) {
      this.listPublishedAssets(this.assetPagination);
    } else {
      this.listAssets(this.assetPagination);
    }
  }

  getAllAssetFilteredResults(pagination: Pagination) {
    this.assetPagination.pageIndex = 1;
    this.assetPagination.searchKey = this.assetSortOption.searchKey;
    if (this.isPartnerView) {
      this.assetPagination = this.utilService.sortOptionValues(this.assetSortOption.publishedDamSortOption, this.assetPagination);
      this.listPublishedAssets(this.assetPagination);
    } else {
      this.assetPagination = this.utilService.sortOptionValues(this.assetSortOption.damSortOption, this.assetPagination);
      this.listAssets(this.assetPagination);
    }
  }

  assetEventHandler(keyCode: any) { if (keyCode === 13) { this.searchAssets(); } }

  /************************* LIst Groups ********************** */
  listGroups(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
    this.referenceService.loading(this.groupsLoader, true);
    let self = this;
    this.contactService.loadContactLists(pagination).subscribe(
      (response: any) => {
        pagination.totalRecords = response.totalRecords;
        this.groupsSortOption.totalRecords = response.totalRecords;
        $.each(response.listOfUserLists, function (index, group) {
          group.createdDate = new Date(group.createdDate);
        });
        pagination = this.pagerService.getPagedItems(pagination, response.listOfUserLists);
        this.isCheckAllGroups();
        this.referenceService.stopLoader(this.groupsLoader);
      },
      (error: any) => {
        this.customResponse = new CustomResponse('ERROR', 'Unable to get groups.Please Contact Admin.', true);
        this.referenceService.stopLoader(this.groupsLoader);
      });
  }

  groupsSortBy(text: any) {
    this.groupsSortOption.selectedGroupsDropDownOption = text;
    this.getAllGroupsFilteredResults(this.groupsPagination);
  }

  searchGroups() {
    this.getAllGroupsFilteredResults(this.groupsPagination);
  }

  groupsPaginationDropdown(items: any) {
    this.groupsSortOption.itemsSize = items;
    this.getAllGroupsFilteredResults(this.groupsPagination);
  }

  setGroupsPage(event: any) {
    this.groupsPagination.pageIndex = event.page;
    this.listGroups(this.groupsPagination);
  }

  getAllGroupsFilteredResults(pagination: Pagination) {
    this.groupsPagination.pageIndex = 1;
    this.groupsPagination.searchKey = this.groupsSortOption.searchKey;
    this.groupsPagination = this.utilService.sortOptionValues(this.groupsSortOption.selectedGroupsDropDownOption, this.groupsPagination);
    this.listGroups(this.groupsPagination);
  }

  groupsEventHandler(keyCode: any) { if (keyCode === 13) { this.searchGroups(); } }

  /************************* LIst Partner Companies ********************** */
  listPartnerCompanies(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
    this.referenceService.loading(this.PartnerCompaniesLoader, true);
    let self = this;
    this.lmsService.getPartnerCompanies(pagination).subscribe(
      (data: any) => {
        let response = data.data;
        pagination.totalRecords = response.totalRecords;
        this.PartnerCompaniesSortOption.totalRecords = response.totalRecords;
        pagination = this.pagerService.getPagedItems(pagination, response.data);
        this.isCheckAllCompanies();
        this.referenceService.stopLoader(this.PartnerCompaniesLoader);
      },
      (error: any) => {
        this.customResponse = new CustomResponse('ERROR', 'Unable to get companies.Please Contact Admin.', true);
        this.referenceService.stopLoader(this.PartnerCompaniesLoader);
      });
  }

  partnerCompaniesSortBy(text: any) {
    this.PartnerCompaniesSortOption.selectedPartnerCompanyDropDownOption = text;
    this.getAllPartnerCompaniesFilteredResults(this.PartnerCompaniesPagination);
  }

  searchPartnerCompaniess() {
    this.getAllPartnerCompaniesFilteredResults(this.PartnerCompaniesPagination);
  }

  partnerCompaniesPaginationDropdown(items: any) {
    this.PartnerCompaniesSortOption.itemsSize = items;
    this.getAllPartnerCompaniesFilteredResults(this.PartnerCompaniesPagination);
  }

  setPartnerCompaniesPage(event: any) {
    this.PartnerCompaniesPagination.pageIndex = event.page;
    this.listPartnerCompanies(this.PartnerCompaniesPagination);
  }

  getAllPartnerCompaniesFilteredResults(pagination: Pagination) {
    this.PartnerCompaniesPagination.pageIndex = 1;
    this.PartnerCompaniesPagination.searchKey = this.PartnerCompaniesSortOption.searchKey;
    this.PartnerCompaniesPagination = this.utilService.sortOptionValues(this.PartnerCompaniesSortOption.selectedPartnerCompanyDropDownOption, this.PartnerCompaniesPagination);
    this.listPartnerCompanies(this.PartnerCompaniesPagination);
  }

  partnerCompaniesEventHandler(keyCode: any) { if (keyCode === 13) { this.searchPartnerCompaniess(); } }

  /*****************List Tags*******************/
  listTags(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
    pagination.maxResults = 0;
    let self = this;
    this.referenceService.startLoader(this.httpRequestLoader);
    this.userService.getTags(pagination)
      .subscribe(
        response => {
          const data = response.data;
          this.tags = data.tags;
          let length = this.tags.length;
          if ((length % 2) == 0) {
            this.tagFirstColumnEndIndex = length / 2;
            this.tagsListFirstColumn = this.tags.slice(0, this.tagFirstColumnEndIndex);
            this.tagsListSecondColumn = this.tags.slice(this.tagFirstColumnEndIndex);
          } else {
            this.tagFirstColumnEndIndex = (length - (length % 2)) / 2;
            this.tagsListFirstColumn = this.tags.slice(0, this.tagFirstColumnEndIndex + 1);
            this.tagsListSecondColumn = this.tags.slice(this.tagFirstColumnEndIndex + 1);
          }
          this.referenceService.stopLoader(this.httpRequestLoader);
        },
        (error: any) => {
          this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
          this.referenceService.stopLoader(this.httpRequestLoader);
        },
        () => this.logger.info('Finished listTags()')
      );
  }

  searchTags() {
    let pagination: Pagination = new Pagination();
    pagination.searchKey = this.tagSearchKey;
    this.listTags(pagination);
  }

  tagEventHandler(keyCode: any) { if (keyCode === 13) { this.searchTags(); } }

  /*****************List Categories*******************/
  listCategories() {
    this.referenceService.startLoader(this.httpRequestLoader);
    this.authenticationService.getCategoryNamesByUserId(this.loggedInUserId).subscribe(
      (data: any) => {
        this.categoryNames = data.data;
        this.filteredCategoryNames = this.categoryNames;
        this.referenceService.stopLoader(this.httpRequestLoader);
      },
      error => {
        this.logger.error("error in getCategoryNamesByUserId(" + this.loggedInUserId + ")", error);
        this.referenceService.stopLoader(this.httpRequestLoader);
      },
      () => this.logger.info("Finished listCategories()"));
  }

  /*****************Preview Form*******************/
  previewForm(id: number) {
    this.customResponse = new CustomResponse();
    this.ngxloading = true;
    this.formService.getById(id)
      .subscribe(
        (data: any) => {
          if (data.statusCode === 200) {
            this.form = data.data;
            if (this.form.showBackgroundImage) {
              this.formBackgroundImage = this.form.backgroundImage;
              this.pageBackgroundColor = "";
            } else {
              this.pageBackgroundColor = this.form.pageBackgroundColor;
              this.formBackgroundImage = "";
            }
            $.each(this.form.formLabelDTOs, function (index: number, value: ColumnInfo) {
              if (value.labelType == 'quiz_radio') {
                //value.labelType = 'quiz'
                value.choices = value.radioButtonChoices;
                //value.choiceType = "radio";

              } else if (value.labelType == 'quiz_checkbox') {
                //value.labelType = 'quiz'
                value.choices = value.checkBoxChoices;
                //value.choiceType = "checkbox";
              }
            });
            console.log(data.data);
            this.formError = false;
          } else {
            this.formError = true;
            this.customResponse = new CustomResponse('ERROR', 'Unable to load the form.Please Contact Admin', true);
          }
          this.ngxloading = false;
        },
        (error: string) => {
          this.ngxloading = false;
          this.customResponse = new CustomResponse('ERROR', 'Unable to load the form.Please Contact Admin', true);
        }
      );
    $('#form-preview-modal').modal('show');
  }

  getCompanyId() {
    if (this.loggedInUserId != undefined && this.loggedInUserId > 0) {
      this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
        (result: any) => {
          if (result !== "") {
            this.loggedInUserCompanyId = result;
            this.linkPrefix = this.authenticationService.APP_URL + "home/tracks/tb/" + this.loggedInUserCompanyId + "/";
            this.completeLink = this.linkPrefix;
          } else {
            this.stopLoaders();
            this.referenceService.showSweetAlertErrorMessage('Company Id Not Found.Please try aftersometime');
            this.router.navigate(["/home/dashboard"]);
          }
        }, (error: any) => {
          this.stopLoadersAndShowError(error);
        },
        () => {
          if (this.loggedInUserCompanyId != undefined && this.loggedInUserCompanyId > 0) {
            this.assetPagination.companyId = this.loggedInUserCompanyId;
            if (this.isPartnerView) {
              if (this.vanityLoginDto.vanityUrlFilter) {
                this.assetPagination.vanityUrlFilter = this.vanityLoginDto.vanityUrlFilter;
                this.assetPagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
              }
              this.listPublishedAssets(this.assetPagination);
            } else {
              this.listAssets(this.assetPagination);
            }

          }
        }
      );
    } else {
      this.stopLoaders();
      this.referenceService.showSweetAlertErrorMessage('UserId Not Found.Please try aftersometime');
      this.router.navigate(["/home/dashboard"]);
    }
  }

  startLoaders() {
    this.loading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
  }

  stopLoadersAndShowError(error: any) {
    this.stopLoaders();
    this.xtremandLogger.log(error);
    this.xtremandLogger.errorPage(error);
  }

  stopLoaders() {
    this.loading = false;
    this.referenceService.loading(this.httpRequestLoader, false);
  }


  setSelectedAsset(asset: any) {
    let index = this.selectedAssets.findIndex(x => x.id == asset.id);
    console.log(index)
    if (index < 0) {
      this.selectedAssets.push(asset);
    } else if (index > -1) {
      this.selectedAssets.splice(index, 1);
    }
    console.log(this.selectedAssets)
  }

  isAssetSelected(asset: any) {
    return (this.selectedAssets != undefined && this.selectedAssets.findIndex(x => x.id == asset.id) > -1)
  }

  isGroupSelected(group: any) {
    return (this.selectedGroups != undefined && this.selectedGroups.findIndex(x => x.id == group.id) > -1)
  }

  isPartnerCompanySelected(partnerCompany: any) {
    return (this.selectedPartnerCompanies != undefined && this.selectedPartnerCompanies.findIndex(x => x.id == partnerCompany.id) > -1)
  }

  openOrderAssetsPopup() {
    $('#order-assets').modal('show');
  }

  openQuizPopup() {
    this.listQuizForms(this.quizFormPagination);
    $('#quiz-list').modal('show');
  }

  selectedQuiz(form: Form) {
    if (this.learningTrack.quizId == undefined || this.learningTrack.quizId < 1 || this.learningTrack.quizId != form.id) {
      this.learningTrack.quizId = form.id;
    } else if (this.learningTrack.quizId == form.id) {
      this.learningTrack.quizId = 0;
    }
  }
  
  updateDescription(form: Form) {
    if(form != null && form != undefined){
      this.ckeditor.instance.insertHtml("<b><a href = \"" + form.ailasUrl + "\" target=\"_blank\">" + form.name + "</a></b>");
    }
    $('#formsList').modal('hide');
  }

  /*****************Featured Image*******************/
  imageClick() {
    this.fileChangeEvent();
  }

  closeImageUploadModal() {
    this.cropRounded = !this.cropRounded;
    this.imageChangedEvent = null;
    this.croppedImage = '';
    this.fileObj = null;
    $('#cropImage').modal('hide');
  }

  clearImage() {
    this.cropRounded = !this.cropRounded;
    this.imageChangedEvent = null;
    this.croppedImage = '';
    this.fileObj = null;
    if (!this.isAdd) {
      this.learningTrack.removeFeaturedImage = true;
    }
    this.featuredImagePath = "";
  }

  filenewChangeEvent(event) {
    const image: any = new Image();
    const file: File = event.target.files[0];
    const isSupportfile = file.type;
    const fileSize = file.size;
    if (isSupportfile === 'image/jpg' || isSupportfile === 'image/jpeg' || isSupportfile === 'image/png') {
      if (fileSize < 12582912) {
        this.errorUploadCropper = false;
        this.fileSizeError = false;
        this.imageChangedEvent = event;
      } else {
        this.fileSizeError = true;
      }
    } else {
      this.errorUploadCropper = true;
      this.showCropper = false;
    }
  }

  imageCroppedMethod(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log(event);
  }

  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded')
  }

  cropperReady() {
    console.log('Cropper ready')
  }

  loadImageFailed() {
    console.log('Load failed');
    this.errorUploadCropper = true;
    this.showCropper = false;
  }

  fileChangeEvent() {
    this.cropRounded = false;
    this.fileSizeError = false;
    $('#cropImage').modal('show');
  }

  cropperSettings() {
    this.squareCropperSettings = this.utilService.cropSettings(this.squareCropperSettings, 130, 196, 130, false);
    this.squareCropperSettings.noFileInput = true;
    console.log(this.authenticationService.SERVER_URL + this.form.companyLogo)
  }

  uploadImage() {
    this.loadingcrop = true;
    this.fileObj = this.utilService.convertBase64ToFileObject(this.croppedImage);
    this.fileObj = this.utilService.blobToFile(this.fileObj);
    //this.featuredImagePath = null;
    this.loadingcrop = false;
    if (!this.isAdd) {
      this.learningTrack.removeFeaturedImage = true;
    }
    this.featuredImagePath = "";
    $('#cropImage').modal('hide');
  }
  /************************************/

  changeSelectedGroups(group: any, event: any) {
    if (event.target.checked) {
      this.selectedGroups.push(group);
      this.paginatedSelectedGroupIds.push(group.id);
    } else {
      let index = this.selectedGroups.findIndex(x => x.id == group.id);
      this.selectedGroups.splice(index, 1);
      this.paginatedSelectedGroupIds.splice($.inArray(group.id, this.paginatedSelectedGroupIds), 1);
    }
    if (this.paginatedSelectedGroupIds.length == this.groupsPagination.pagedItems.length) {
      this.isGroupHeaderCheckBoxChecked = true;
    } else {
      this.isGroupHeaderCheckBoxChecked = false;
    }
  }

  isCheckAllGroups() {
    let self = this;
    this.paginatedSelectedGroupIds = [];
    $.each(this.groupsPagination.pagedItems, function (index, group) {
      if (self.isGroupSelected(group)) {
        self.paginatedSelectedGroupIds.push(group.id)
      }
    });
    if (this.paginatedSelectedGroupIds.length == this.groupsPagination.pagedItems.length) {
      this.isGroupHeaderCheckBoxChecked = true;
    } else {
      this.isGroupHeaderCheckBoxChecked = false;
    }
  }

  changeSelectedpartnerCompanies(company: any, event: any) {
    if (event.target.checked) {
      this.selectedPartnerCompanies.push(company);
      this.paginatedSelectedCompanyIds.push(company.id);
    } else {
      let index = this.selectedPartnerCompanies.findIndex(x => x.id == company.id);
      this.selectedPartnerCompanies.splice(index, 1);
      this.paginatedSelectedCompanyIds.splice($.inArray(company.id, this.paginatedSelectedCompanyIds), 1);
    }
    if (this.paginatedSelectedCompanyIds.length == this.PartnerCompaniesPagination.pagedItems.length) {
      this.isCompanyHeaderCheckBoxChecked = true;
    } else {
      this.isCompanyHeaderCheckBoxChecked = false;
    }
  }

  isCheckAllCompanies() {
    let self = this;
    this.paginatedSelectedCompanyIds = [];
    $.each(this.PartnerCompaniesPagination.pagedItems, function (index, partnerCompany) {
      if (self.isPartnerCompanySelected(partnerCompany)) {
        self.paginatedSelectedCompanyIds.push(partnerCompany.id)
      }
    });
    if (this.paginatedSelectedCompanyIds.length == this.PartnerCompaniesPagination.pagedItems.length) {
      this.isCompanyHeaderCheckBoxChecked = true;
    } else {
      this.isCompanyHeaderCheckBoxChecked = false;
    }
  }

  /************************* LIst Groups ********************** */
  listGroupInfo(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
    this.isLoading = true;
    this.contactService.loadUsersOfContactList(this.groupId, pagination).subscribe(
      (response: any) => {
        pagination.totalRecords = response.totalRecords;
        pagination = this.pagerService.getPagedItems(pagination, response.listOfUsers);
        this.isLoading = false;
      },
      (error: any) => {
        this.customResponse = new CustomResponse('ERROR', 'Unable to get groups.Please Contact Admin.', true);
        this.isLoading = false;
      });
  }

  setGroupInfoPage(event: any) {
    this.groupInfoPagination.pageIndex = event.page;
    this.listGroupInfo(this.groupInfoPagination);
  }

  getGroupList(group: any) {
    this.groupName = group.name;
    this.groupId = group.id;
    this.listGroupInfo(this.groupInfoPagination);
    $('#group-info-list').modal('show');
  }

  omitSpecialCharacters(event: any) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || k == 45 || k == 95 || (k >= 48 && k <= 57));
  }

  updateSlug(type: string) {
    if (type == "title") {
      if (this.learningTrack.id == undefined || this.learningTrack.id < 1) {
        this.learningTrack.slug = this.learningTrack.title.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_');
      }
    } else if (type == "slug") {
      this.learningTrack.slug = this.learningTrack.slug.replace(/[^a-zA-Z0-9_-]/g, '_');
    }
    this.validateSlug();
    if ((this.isAdd || (!this.isAdd && this.existingSlug !== this.learningTrack.slug)) && this.isSlugValid) {
      this.validateSlugForCompany();
    }
    this.completeLink = this.linkPrefix + this.learningTrack.slug;
  }

  editSlug() {
    this.isEditSlug = true;
  }

  editedSlug() {
    this.isEditSlug = false;
  }

  copyInputMessage(inputElement: any) {
    this.referenceService.goToTop();
    this.lmsResponse = new CustomResponse();
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    let message = 'Link copied to clipboard successfully.';
    $("#copy-link").select();
    this.lmsResponse = new CustomResponse('SUCCESS', message, true);
  }

  addTag() {
    this.openAddTagPopup = true;
  }

  openCreateFolderPopup() {
    this.addFolderModalPopupComponent.openPopup();
  }

  showSuccessMessage(message: any) {
    if (message != undefined) {
      this.folderOrTagsCustomResponse = new CustomResponse('SUCCESS', message, true);
    }
  }

  resetFolderValues(message: any) {
    this.showSuccessMessage(message);
    this.listCategories();
  }

  resetTagValues(message: any) {
    this.openAddTagPopup = false;
    this.showSuccessMessage(message);
    this.listTags(new Pagination());
  }

  addTags(type) {
    console.log(this.selectedTags);
  }

  removeTags(type) {
    console.log(this.selectedTags);
  }

  updateSelectedTags(tag: Tag, checked: boolean) {
    let index = this.learningTrack.tagIds.indexOf(tag.id);
    if (checked == undefined) {
      if (index > -1) {
        this.learningTrack.tagIds.splice(index, 1);
      } else {
        this.learningTrack.tagIds.push(tag.id);
      }
    } else if (checked) {
      this.learningTrack.tagIds.push(tag.id);
    } else {
      this.learningTrack.tagIds.splice(index, 1);
    }
    console.log(this.learningTrack.tagIds)
  }

  addFolder(type) {
    this.selectedFolder = new Array<any>();
    this.selectedFolder.push(type);
    this.learningTrack.categoryId = type.id;
    console.log(this.learningTrack.categoryId)
    console.log(this.selectedFolder)
  }

  removeFolder(type) {
    this.selectedFolder = new Array<any>();
    this.learningTrack.categoryId = 0;
    console.log(this.learningTrack.categoryId)
    console.log(this.selectedFolder)
  }

  validateSlugForCompany() {
    let slugObject: LearningTrack = new LearningTrack();
    slugObject.userId = this.loggedInUserId;
    slugObject.slug = this.learningTrack.slug;
    this.lmsService.validateSlug(slugObject).subscribe(
      (response: any) => {
        slugObject.isSlugValid = response.data;
        if (!slugObject.isSlugValid) {
          this.addErrorMessage("slug", "Alias already exists");
        } else {
          this.removeErrorMessage("slug");
        }
      },
      (error: string) => {
        this.referenceService.showSweetAlertErrorMessage(this.referenceService.serverErrorMessage);
      }
    );
  }

  validateTitle() {
    if (this.learningTrack.title == undefined || this.learningTrack.title.length == 0) {
      this.addErrorMessage("title", "Title can not be empty");
    } else if (this.learningTrack.title != undefined && this.learningTrack.title.length < 3) {
      this.addErrorMessage("title", "Title should have atleast 3 characters");
    } else {
      this.removeErrorMessage("title");
    }
  }

  validateSlug() {
    if (this.learningTrack.slug == undefined || this.learningTrack.slug.length < 1) {
      this.addErrorMessage("slug", "Alias can not be empty");
    } else if (this.learningTrack.slug != undefined && this.learningTrack.slug.length < 3) {
      this.addErrorMessage("slug", "Slug should have atleast 3 characters");
    } else {
      this.removeErrorMessage("slug");
    }
  }

  validateDescription() {
    let description = this.learningTrack.description;
    if (description.length < 1) {
      this.addErrorMessage("description", "description can not be empty");
    } else if (description.length > 5000) {
      this.addErrorMessage("description", "description can not be more than 5000 characters");
    } else {
      this.removeErrorMessage("description")
    }
  }

  validateAssets() {
    if (this.selectedAssets.length < 1 || this.selectedAssets[0].id < 1) {
      this.addErrorMessage("asset", "Select atleast one asset");
    } else {
      this.removeErrorMessage("asset");
    }
  }

  validateGroupOrCompany() {
    if ((this.selectedGroups.length < 1 || this.selectedGroups[0].id < 1) && (this.selectedPartnerCompanies.length < 1 || this.selectedPartnerCompanies[0].id < 1)) {
      this.addErrorMessage("groupOrCompany", "Select either a company or a group");
    } else {
      this.removeErrorMessage("groupOrCompany");
    }
  }

  addErrorMessage(type: string, message: string) {
    if (type == "title") {
      this.isTitleValid = false;
      this.learningTrack.isValid = false;
      this.titleErrorMessage = message;
    } else if (type == "slug") {
      this.isSlugValid = false;
      this.learningTrack.isValid = false;
      this.slugErrorMessage = message;
    } else if (type == "asset") {
      this.isAssetValid = false;
      this.learningTrack.isValid = false;
      this.assetErrorMessage = message;
    } else if (type == "groupOrCompany") {
      this.isGroupOrCompanyValid = false;
      this.learningTrack.isValid = false;
      this.groupOrCompanyErrorMessage = message;
    } else if (type == "description") {
      this.isDescriptionValid = false;
      //this.learningTrack.isValid = false;
      this.descriptionErrorMessage = message;
    }
  }

  removeErrorMessage(type: string) {
    if (type == "title") {
      this.isTitleValid = true;
      this.titleErrorMessage = ""
    } else if (type == "slug") {
      this.isSlugValid = true;
      this.slugErrorMessage = ""
    } else if (type == "asset") {
      this.isAssetValid = true;
      this.assetErrorMessage = ""
    } else if (type == "groupOrCompany") {
      this.isGroupOrCompanyValid = true;
      this.groupOrCompanyErrorMessage = ""
    } else if (type == "description") {
      this.isDescriptionValid = true;
      this.descriptionErrorMessage = ""
    }
  }


  validateStepOne() {
    if (this.isTitleValid && this.isSlugValid && this.learningTrack.categoryId != undefined && this.learningTrack.categoryId > 0) {
      this.isStepOneValid = true;
      // if (this.isStepTwoValid) {
      //   this.stepTwoTabClass = this.completedTabClass;
      // } else if (this.activeTabName != "step-2") {
      //   this.stepTwoTabClass = this.defaultTabClass;
      // }
      this.stepOneTabClass = this.completedTabClass;
      if (this.activeTabName != "step-2") {
        this.stepTwoTabClass = this.defaultTabClass;
      }
      if (this.activeTabName == "step-1") {
        this.stepOneTabClass = this.activeTabClass;
      }
    } else {
      this.isStepOneValid = false;
      this.stepTwoTabClass = this.disableTabClass;
      this.stepThreeTabClass = this.disableTabClass;
      this.stepFourTabClass = this.disableTabClass;
    }
    this.checkAllRequiredFields();
  }

  validateStepTwo() {
    if (this.isDescriptionValid && this.isStepOneValid) {
      this.isStepTwoValid = true;
      // if (this.isStepThreeValid) {
      //   this.stepThreeTabClass = this.completedTabClass;
      // } else if (this.activeTabName != "step-3") {
      //   this.stepThreeTabClass = this.defaultTabClass;
      // }
      this.stepTwoTabClass = this.completedTabClass;
      if (this.activeTabName != "step-3") {
        this.stepThreeTabClass = this.defaultTabClass;
      }
      if (this.activeTabName == "step-2") {
        this.stepTwoTabClass = this.activeTabClass;
      }
    } else {
      this.isStepTwoValid = false;
      this.stepThreeTabClass = this.disableTabClass;
      this.stepFourTabClass = this.disableTabClass;
    }
    this.checkAllRequiredFields();
  }

  validateStepThree() {
    if (this.isAssetValid && this.isStepTwoValid) {
      this.isStepThreeValid = true;
      // if (this.isStepFourValid) {
      //   this.stepFourTabClass = this.completedTabClass;
      // } else if (this.activeTabName != "step-4") {
      //   this.stepFourTabClass = this.defaultTabClass;
      // }
      this.stepThreeTabClass = this.completedTabClass;
      if (this.activeTabName != "step-4") {
        this.stepFourTabClass = this.defaultTabClass;
      }
      if (this.activeTabName == "step-3") {
        this.stepThreeTabClass = this.activeTabClass;
      }
    } else {
      this.isStepThreeValid = false;
      this.stepFourTabClass = this.disableTabClass;
    }
    this.checkAllRequiredFields();
  }

  validateStepFour() {
    if (this.isGroupOrCompanyValid && this.isStepThreeValid) {
      this.isStepFourValid = true;
      // if (this.activeTabName != "step-4") {
      //   this.stepFourTabClass = this.completedTabClass;
      // }
      this.stepFourTabClass = this.completedTabClass;
      if (this.activeTabName == "step-4") {
        this.stepFourTabClass = this.activeTabClass;
      }
    } else {
      this.isStepFourValid = false;
    }
    this.checkAllRequiredFields();
  }

  validateAllSteps() {
    this.validateStepOne();
    this.validateStepTwo();
    this.validateStepThree();
    this.validateStepFour();
  }

  constructLearningTrack() {
    let partnershipIds: Array<number> = new Array<number>();
    let groupIds: Array<number> = new Array<number>();
    let contentIds: Array<number> = new Array<number>();
    $.each(this.selectedPartnerCompanies, function (index: number, lmsDto: any) {
      partnershipIds.push(lmsDto.id);
    });
    $.each(this.selectedGroups, function (index: number, lmsDto: any) {
      groupIds.push(lmsDto.id);
    });
    $.each(this.selectedAssets, function (index: number, lmsDto: any) {
      contentIds.push(lmsDto.id);
    });
    this.learningTrack.partnershipIds = partnershipIds;
    this.learningTrack.groupIds = groupIds;
    this.learningTrack.contentIds = contentIds;
  }

  saveAndPublish() {
    this.learningTrack.published = true;
    this.addOrUpdateLearningTrack();
  }

  addOrUpdateLearningTrack() {
    this.learningTrack.userId = this.loggedInUserId;
    let formData: FormData = new FormData();
    if (this.learningTrack.isValid) {
      this.constructLearningTrack();
      if (this.fileObj == null) {
        formData.append("featuredImage", null);
      } else {
        formData.append("featuredImage", this.fileObj, this.fileObj['name']);
      }
      console.log(this.learningTrack)
      this.referenceService.startLoader(this.httpRequestLoader);
      this.lmsService.saveOrUpdate(formData, this.learningTrack).subscribe(
        (data: any) => {
          if (data.statusCode === 200) {
            this.lmsResponse = new CustomResponse('SUCCESS', data.message, true);
            this.referenceService.stopLoader(this.httpRequestLoader);
            if (this.isAdd) {
              this.referenceService.isCreated = true;
              this.referenceService.isUpdated = false;
            } else {
              this.referenceService.isUpdated = true;
              this.referenceService.isCreated = false;
            }
            this.router.navigate(["/home/tracks/manage"]);
          }
        },
        (error: string) => {
          this.referenceService.stopLoader(this.httpRequestLoader);
          if (this.isAdd || !this.learningTrack.published) {
            this.learningTrack.published = false;
          }
          this.referenceService.showSweetAlertErrorMessage(this.referenceService.serverErrorMessage);
        }
      )
    } else {
      this.lmsResponse = new CustomResponse('ERROR', "Invalid Track Builder", true);
      this.referenceService.goToTop();
    }
  }

  validateLearningTrack() {
    this.validateTitle();
    this.validateSlug();
    if (this.isAdd || (!this.isAdd && this.existingSlug !== this.learningTrack.slug)) {
      this.validateSlugForCompany();
    }
    this.validateDescription();
    this.validateAssets();
    this.validateGroupOrCompany();
    this.validateAllSteps();
  }

  checkAllRequiredFields() {
    if (this.isStepOneValid && this.isStepTwoValid && this.isStepThreeValid && this.isStepFourValid) {
      this.learningTrack.isValid = true;
    } else {
      this.learningTrack.isValid = false;
    }
  }


  assetPreview(assetDetails: any) {
    if (assetDetails.beeTemplate) {
      this.previewBeeTemplate(assetDetails);
    } else {
      let assetType = assetDetails.assetType;
      this.filePath = assetDetails.assetPath;
      if (assetType == 'mp3') {
        this.showFilePreview = true;
        this.fileType = "audio/mpeg";
        this.isAudio = true;
      } else if (assetType == 'mp4') {
        this.showFilePreview = true;
        this.fileType = "video/mp4";
        this.isVideo = true;
      } else if (this.imageTypes.includes(assetType)) {
        this.showFilePreview = true;
        this.isImage = true;
      } else if (this.fileTypes.includes(assetType)) {
        // this.showFilePreview = true;
        // this.isFile = true;
        // if (assetType == 'xlsx' || assetType == 'xls') {
        //   this.viewer = "office";
        // }
        this.referenceService.showSweetAlertInfoMessage();
      } else {
        this.referenceService.showSweetAlertErrorMessage('Unsupported file type, Please download the file to view.');
      }
    }
  }

  closeAssetPreview() {
    this.showFilePreview = false;
    this.isImage = false;
    this.isAudio = false;
    this.isVideo = false;
    this.isFile = false;
    this.filePath = "";
    this.viewer = "google";
  }

  previewBeeTemplate(asset: any) {
    let htmlContent = "#asset-preview-content";
    $(htmlContent).empty();
    $('#assetTitle').val('');
    this.referenceService.setModalPopupProperties();
    $("#asset-preview-modal").modal('show');
    this.modalPopupLoader = true;
    this.damService.previewAssetById(asset.id).subscribe(
      (response: any) => {
        let assetDetails = response.data;
        $(htmlContent).append(assetDetails.htmlBody);
        $('#assetTitle').text(assetDetails.name);
        this.modalPopupLoader = false;
      }, (error: any) => {
        swal("Please Contact Admin!", "Unable to show  preview", "error");
        this.modalPopupLoader = false;
        $("#asset-preview-modal").modal('hide');
      }
    );
  }

  getAssetsList() {
    this.assetError = false;
    this.customResponse = new CustomResponse();
    this.assetPagination = new Pagination();
    this.listAssets(this.assetPagination);
    $('#media-asset-list').modal('show');
  }

  addMediaToDescription(asset: any) {
    this.selectedAssetForMedia = asset;
    $('#media-asset-list').addClass('blur-modal');
    $('#media-link-title').modal('show');
  }

  updateDescriptionWithAssetUrl() {
    if (this.selectedAssetForMedia != undefined && this.selectedAssetForMedia != null) {
      let assetPath = this.selectedAssetForMedia.assetPath;
      if (assetPath != undefined) {
        if (this.mediaLinkDisplayText.length > 0) {
          this.ckeditor.instance.insertHtml("<b><a href = \"" + assetPath + "\" target=\"_blank\">" + this.mediaLinkDisplayText + "</a></b>");
        } else {
          this.ckeditor.instance.insertHtml("<b><a href = \"" + assetPath + "\" target=\"_blank\">" + assetPath + "</a></b>");
        }
      }
    }
    this.closeLinkTitlePopup();
    $('#media-asset-list').modal('hide');
  }

  closeLinkTitlePopup() {
    this.selectedAssetForMedia = null;
    this.mediaLinkDisplayText = "";
    $('#media-link-title').modal('hide');
    $('#media-asset-list').removeClass('blur-modal');

  }

  mediaDisplayTextEventHandler(keyCode: any) { if (keyCode === 13) { this.updateDescriptionWithAssetUrl(); } }

  showDropDown() {
    this.showFolderDropDown = !this.showFolderDropDown;
  }

  updateFolderValue(folder: any) {
    this.folderName = folder.name;
    this.learningTrack.categoryId = folder.id
    this.filteredCategoryNames = this.categoryNames;
    this.showFolderDropDown = false;
  }

  filterFolders(inputElement: any) {
    if (inputElement == null || inputElement == undefined) {
      this.filteredCategoryNames = this.categoryNames;
    } else {
      let value = inputElement.value;
      if (value != undefined && value != null && value != "") {
        this.filteredCategoryNames = this.categoryNames.filter(
          item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
      } else {
        this.filteredCategoryNames = this.categoryNames;
      }
    }
  }

  checkAllGroups(ev: any) {
    if (ev.target.checked) {
      let self = this;
      for (var i = 0; i < self.groupsPagination.pagedItems.length; i++) {
        self.selectedGroups.push(self.groupsPagination.pagedItems[i]);
        self.paginatedSelectedGroupIds.push(parseInt(self.groupsPagination.pagedItems[i].id));
      }
      this.selectedGroups = this.removeDuplicates(this.selectedGroups, 'id');
      this.paginatedSelectedGroupIds = this.referenceService.removeDuplicates(this.paginatedSelectedGroupIds);
      console.log(self.selectedGroups);
    } else {
      this.paginatedSelectedGroupIds = [];
      for (let j = 0; j < this.groupsPagination.pagedItems.length; j++) {
        var paginationId = this.groupsPagination.pagedItems[j].id;
        this.selectedGroups = this.removeRowsFromGroupsOrComapniesListById(this.selectedGroups, paginationId);
      }
      console.log(this.selectedGroups);
    }
    ev.stopPropagation();
  }

  removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};
    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  removeRowsFromGroupsOrComapniesListById(arrayList: any, id: any) {
    for (let i = 0; i < arrayList.length; i++) {
      if (arrayList[i].id === id) { arrayList.splice(i, 1); break; }
    }
    return arrayList;
  }

  checkAllCompanies(ev: any) {
    if (ev.target.checked) {
      let self = this;
      for (var i = 0; i < self.PartnerCompaniesPagination.pagedItems.length; i++) {
        self.selectedPartnerCompanies.push(self.PartnerCompaniesPagination.pagedItems[i]);
        self.paginatedSelectedCompanyIds.push(parseInt(self.PartnerCompaniesPagination.pagedItems[i].id));
      }
      this.selectedPartnerCompanies = this.removeDuplicates(this.selectedPartnerCompanies, 'id');
      this.paginatedSelectedCompanyIds = this.referenceService.removeDuplicates(this.paginatedSelectedCompanyIds);
      console.log(self.selectedPartnerCompanies);
    } else {
      this.paginatedSelectedCompanyIds = [];
      for (let j = 0; j < this.PartnerCompaniesPagination.pagedItems.length; j++) {
        var paginationId = this.PartnerCompaniesPagination.pagedItems[j].id;
        this.selectedPartnerCompanies = this.removeRowsFromGroupsOrComapniesListById(this.selectedPartnerCompanies, paginationId);
      }
      console.log(this.selectedPartnerCompanies);
    }
    ev.stopPropagation();
  }

}
