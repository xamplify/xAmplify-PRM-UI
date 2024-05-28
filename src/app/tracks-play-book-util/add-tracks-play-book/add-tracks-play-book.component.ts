import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { TracksPlayBookUtilService } from '../services/tracks-play-book-util.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Form } from '../../forms/models/form';
import { FormService } from '../../forms/services/form.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { SortOption } from '../../core/models/sort-option';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { EnvService } from 'app/env.service'
import { UtilService } from '../../core/services/util.service';
import { Tag } from 'app/dashboard/models/tag'
import { UserService } from '../../core/services/user.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { TracksPlayBook } from '../models/tracks-play-book'
import { DragulaService } from 'ng2-dragula';
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { TracksPlayBookDto } from '../models/tracks-play-book-dto'
import { DamService } from '../../dam/services/dam.service'
import { VanityLoginDto } from '../../util/models/vanity-login-dto';
import { ContactService } from '../../contacts/services/contact.service'
import { ImageCropperComponent } from 'ng2-img-cropper';
import { ImageCroppedEvent } from '../../common/image-cropper/interfaces/image-cropped-event.interface';
import { AddFolderModalPopupComponent } from 'app/util/add-folder-modal-popup/add-folder-modal-popup.component';
import { TracksPlayBookType } from '../models/tracks-play-book-type.enum';
import { Dimensions, ImageTransform } from 'app/common/image-cropper-v2/interfaces';
import { base64ToFile } from 'app/common/image-cropper-v2/utils/blob.utils';
import { Properties } from 'app/common/models/properties';
Properties
declare var $, swal, CKEDITOR: any;
@Component({
  selector: 'app-add-tracks-play-book',
  templateUrl: './add-tracks-play-book.component.html',
  styleUrls: ['./add-tracks-play-book.component.css'],
  providers: [HttpRequestLoader, Pagination, SortOption, FormService, RegularExpressions, DamService, 
    ContactService,Properties]
})
export class AddTracksPlayBookComponent implements OnInit, OnDestroy {

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
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  isPartnerView = false;
  SubmitButtonValue = "Save"
  SubmitAndPublishButtonValue = "Save & Publish"
  formsError: boolean = false;
  formPagination: Pagination = new Pagination();
  formSortOption: SortOption = new SortOption();
  formsLoader: HttpRequestLoader = new HttpRequestLoader();
  name = 'ng2-ckeditor';
  ckeConfig: any;
  @ViewChild("ckeditor") ckeditor: any;
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
  tracksPlayBook: TracksPlayBook = new TracksPlayBook();
  learningTrackId: number = 0;
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
  selectedAssets: Array<TracksPlayBookDto> = new Array<TracksPlayBookDto>();

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
  existingTitle = "";
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
  fileTypes: Array<string> = ['doc', 'docx', 'xlsx', 'xls', 'ppt', 'pptx'];
  url: SafeResourceUrl;
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

  ckeditorEvent: any;
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  isAdd: boolean = true;
  @Input() type: string;

  selectedGroupIds: any[] = [];
  selectedPartnershipIds: any[] = [];
  selectedUserIds: any[] = [];

  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  scale = 1;
  canvasRotation = 0;
  rotation = 0;
  circleData: any;

  isAssestPopUpOpen : boolean = false;
  isPreviewFromAssetPopup: boolean = false;
  viewType: string;
  categoryId: number;
  folderViewType: string;
  selectedFileType = "";
  fileTypesForFilter:Array<any> = new Array<any>();
  uploadButton = false;
  /****XNFR-326*****/
  isTrackOrPlaybookPublishedEmailNotification = false;
  trackOrPlaybookPublishEmailNotificationLoader = true;
 /****XNFR-326*****/
  /*****XNFR-423****/
  countryNames = [];
  /**XNFR-523***/
  isSendEmailNotificationOptionDisplayed = false;
  sendEmailNotificationOptionToolTipMessage = "";
  isSwitchOptionDisabled = false;
  customSwitchToolTipMessage = "";
  constructor(public userService: UserService, public regularExpressions: RegularExpressions, private dragulaService: DragulaService, public logger: XtremandLogger, private formService: FormService, private route: ActivatedRoute, public referenceService: ReferenceService, public authenticationService: AuthenticationService, public tracksPlayBookUtilService: TracksPlayBookUtilService, private router: Router, public pagerService: PagerService,
    public sanitizer: DomSanitizer, public envService: EnvService, public utilService: UtilService, public damService: DamService,
    public xtremandLogger: XtremandLogger, public contactService: ContactService,public properties:Properties) {
    this.siteKey = this.envService.captchaSiteKey;
    this.loggedInUserId = this.authenticationService.getUserId();
    /****XNFR-170****/
    this.viewType = this.route.snapshot.params["viewType"];
    this.categoryId = this.route.snapshot.params["categoryId"];
    this.folderViewType = this.route.snapshot.params["folderViewType"];
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
        this.getById(this.learningTrackId);
        this.SubmitButtonValue = "Update";
        this.SubmitAndPublishButtonValue = "Update & Publish";
      } else {
        this.goToManageSectionWithError();
      }
    } else {
      this.isAdd = true;
      this.stepOneTabClass = this.activeTabClass;
      this.stepTwoTabClass = this.disableTabClass;
      this.stepThreeTabClass = this.disableTabClass;
      this.stepFourTabClass = this.disableTabClass;
       /****XNFR-326******/
      this.findTrackOrPlaybookPublishEmailNotificationOption();
    }
   
  }
   /****XNFR-326******/
  findTrackOrPlaybookPublishEmailNotificationOption() {
    this.trackOrPlaybookPublishEmailNotificationLoader = true;
    this.authenticationService.findTrackOrPlaybookPublishEmailNotificationOption(this.type)
    .subscribe(
        response=>{
            this.isTrackOrPlaybookPublishedEmailNotification = response.data;
            this.isSwitchOptionDisabled = !this.isTrackOrPlaybookPublishedEmailNotification;
            if(this.isSwitchOptionDisabled){
              this.tracksPlayBook.trackUpdatedEmailNotification = false;
              this.customSwitchToolTipMessage = this.properties.TRACK_OR_PLAY_BOOK_EMAIL_NOTIFICATION_OPTION_DISABLED;
            }else{
              this.customSwitchToolTipMessage = "";
            }
            this.trackOrPlaybookPublishEmailNotificationLoader = false;
            this.ngxloading = false;
        },error=>{
            this.trackOrPlaybookPublishEmailNotificationLoader = false;
            this.ngxloading = false;
        });
  }

  onReady(event: any) {
    this.isCkeditorLoaded = true;
  }

  ngOnDestroy() {
    this.dragulaService.destroy('assetsDragula');
    $('#cropImage').modal('hide');
    $('#media-asset-list').modal('hide');
    $('#formsList').modal('hide');
    $('#order-assets').modal('hide');
    $('#quiz-list').modal('hide');
    $('#form-preview-modal').modal('hide');
    $('#asset-preview-modal').modal('hide');
    $('#media-link-title').modal('hide');
  }

  goToManageSectionWithError() {
    this.referenceService.showSweetAlertErrorMessage("Invalid Id");
    if (this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
      this.referenceService.goToRouter("/home/tracks");
    } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
      this.referenceService.goToRouter("/home/playbook");
    }
  }

  private onDropModel(args) {
  }

  changeActiveTab(activeTab: string) {
    this.activeTabName = activeTab;
    if (activeTab == "step-1") {
      this.stepOneTabClass = this.activeTabClass;
    } else if (activeTab == "step-2") {
      this.stepTwoTabClass = this.activeTabClass;
    } else if (activeTab == "step-3") {
      this.stepThreeTabClass = this.activeTabClass;
      this.assetPagination = new Pagination();
      this.assetSortOption = new SortOption();
      this.findFileTypes();
      this.listAssets(this.assetPagination);
    } else if (activeTab == "step-4") {
      this.stepFourTabClass = this.activeTabClass;
    }
    this.clearTagsResponse();
    this.validateAllSteps();
  }

  getById(id: number) {
    this.ngxloading = true;
    let self = this;
    this.tracksPlayBookUtilService.getById(id).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          let tracksPlayBook: TracksPlayBook = response.data;
          if (tracksPlayBook != undefined) {
            this.tracksPlayBook = tracksPlayBook;
            this.featuredImagePath = this.tracksPlayBook.featuredImage + "?" + Date.now();
            this.existingSlug = this.tracksPlayBook.slug;
            this.existingTitle = this.tracksPlayBook.title;
            this.completeLink = this.linkPrefix + this.tracksPlayBook.slug;
            if (this.tracksPlayBook.quiz !== undefined) {
              this.tracksPlayBook.quizId = this.tracksPlayBook.quiz.id;
            }
            if (this.tracksPlayBook.contents !== undefined && this.tracksPlayBook.contents.length > 0) {
              this.selectedAssets = this.tracksPlayBook.contents;
            }
            if (this.tracksPlayBook.userIds !== undefined && this.tracksPlayBook.userIds.length > 0) {
              $.each(this.tracksPlayBook.userIds, function (index, userId) {
                self.selectedUserIds.push(userId);
              });
            }
            if (this.tracksPlayBook.groupIds !== undefined && this.tracksPlayBook.groupIds.length > 0) {
              $.each(this.tracksPlayBook.groupIds, function (index, groupId) {
                self.selectedGroupIds.push(groupId);
              });
            }
            if (this.tracksPlayBook.partnershipIds !== undefined && this.tracksPlayBook.partnershipIds.length > 0) {
              $.each(this.tracksPlayBook.partnershipIds, function (index, partnershipId) {
                self.selectedPartnershipIds.push(partnershipId);
              });
            }
            if (this.tracksPlayBook.tags !== undefined && this.tracksPlayBook.tags.length > 0) {
              this.selectedTags = this.tracksPlayBook.tags;
              let tagIds: Array<number> = new Array<number>();
              $.each(this.selectedTags, function (index, tag) {
                tagIds.push(tag.id);
              });
              this.tracksPlayBook.tagIds = tagIds;
            } else {
              this.tracksPlayBook.tagIds = new Array<number>();
            }
            if (this.tracksPlayBook.category !== undefined) {
              this.tracksPlayBook.categoryId = this.tracksPlayBook.category.id;
              this.folderName = this.tracksPlayBook.category.name;
            }
            this.validateLearningTrack();
            /**XNFR-523***/
            this.isSendEmailNotificationOptionDisplayed = this.tracksPlayBook.published && !this.isAdd;
            this.sendEmailNotificationOptionToolTipMessage = this.properties.SEND_UPDATED_TRACK_EMAIL_NOTIFICATION_MESSAGE.replace("{{partnersMergeTag}}",this.authenticationService.getPartnerModuleCustomName());
            /**XNFR-523***/
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
      },()=>{
        /***XNFR-523***/
        this.findTrackOrPlaybookPublishEmailNotificationOption();
      });
  }


  /************List Available Forms******************/
  getFormsList() {
    this.formsError = false;
    this.customResponse = new CustomResponse();
    this.formPagination = new Pagination();
    this.formSortOption = new SortOption();
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
        let self = this;
        const data = response.data;
        pagination.totalRecords = data.totalRecords;
        this.quizFormSortOption.totalRecords = data.totalRecords;
        $.each(data.forms, function (index, form) {
          form.createdDateString = new Date(form.createdDateString);
          form.selected = self.isQuizSelected(form);
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
    pagination.excludeBeePdf = this.isAssestPopUpOpen;
    this.referenceService.goToTop();
    this.startLoaders();
    this.referenceService.loading(this.assetLoader, true);
    this.damService.list(pagination).subscribe((result: any) => {
      if (result.statusCode === 200) {
        let data = result.data;
        pagination.totalRecords = data.totalRecords;
        this.assetSortOption.totalRecords = data.totalRecords;
        $.each(data.assets, function (_index: number, asset: any) {
          asset.displayTime = new Date(asset.createdDateInUTCString);
          let toolTipTagNames: string = "";
          asset.tagNames.sort();
          $.each(asset.tagNames, function (index, tagName) {
            if (index > 0) {
              if (toolTipTagNames.length > 0) {
                toolTipTagNames = toolTipTagNames + ", " + tagName;
              } else {
                toolTipTagNames = tagName;
              }
            }
          });
          asset.toolTipTagNames = toolTipTagNames;
        });
        pagination = this.pagerService.getPagedItems(pagination, data.assets);
      }
      this.stopLoaders();
      this.referenceService.loading(this.assetLoader, false);
    }, error => {
      this.referenceService.loading(this.assetLoader, false);
      this.stopLoadersAndShowError(error);
    });
  }

  listPublishedAssets(pagination: Pagination) {
    this.referenceService.goToTop();
    this.startLoaders();
    this.referenceService.loading(this.assetLoader, true);
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
      this.referenceService.loading(this.assetLoader, false);
    }, error => {
      this.referenceService.loading(this.assetLoader, false);
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

  /*****************List Tags*******************/
  listTags(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
    pagination.maxResults = 0;
    let self = this;
    this.referenceService.startLoader(this.httpRequestLoader);
    this.userService.getTagsSearchTagName(pagination)
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
        if(this.isAdd){
          this.folderName = this.filteredCategoryNames[0]['name'];
          this.tracksPlayBook.categoryId = this.filteredCategoryNames[0]['id'];
        }
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
    let formInput:Form = new Form();
    formInput.id = id;
    formInput.userId = this.authenticationService.getUserId();
    let companyProfileName = this.authenticationService.companyProfileName;
    if (companyProfileName !== undefined && companyProfileName !== "") {
      formInput.vendorCompanyProfileName = companyProfileName;
      formInput.vanityUrlFilter = true;
    }
    this.formService.getById(formInput)
      .subscribe(
        (data: any) => {
          if (data.statusCode === 200) {
            this.form = data.data;
            /*****XBI-2067****/
            this.countryNames = this.authenticationService.addCountryNamesToList(this.form.countryNames,this.countryNames);
            /*****XBI-2067****/
            if (this.form.showBackgroundImage) {
              this.formBackgroundImage = this.form.backgroundImage;
              this.pageBackgroundColor = "";
            } else {
              this.pageBackgroundColor = this.form.pageBackgroundColor;
              this.formBackgroundImage = "";
            }
            $.each(this.form.formLabelDTORows, function (index: number, formLabelDTORow: any) {
              $.each(formLabelDTORow.formLabelDTOs, function (columnIndex: number, value: any) {
                if (value.labelType == 'quiz_radio') {
                  value.choices = value.radioButtonChoices;
                } else if (value.labelType == 'quiz_checkbox') {
                  value.choices = value.checkBoxChoices;
                }
              });
            });
            this.setCustomCssValues();
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
            if (this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
              this.linkPrefix = this.authenticationService.APP_URL + "home/tracks/tb/" + this.loggedInUserCompanyId + "/";
            } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
              this.linkPrefix = this.authenticationService.APP_URL + "home/playbook/pb/" + this.loggedInUserCompanyId + "/";
            }
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
    let index = -1;
    if (this.selectedAssets !== undefined && this.selectedAssets.length > 0) {
      $.each(this.selectedAssets, function (i: number, selectedAsset: any) {
        if (!selectedAsset.typeQuizId && selectedAsset.id == asset.id) {
          index = i;
          return false;
        }
      });
    }
    if (index < 0) {
      let tracksPlayBookDto =  new TracksPlayBookDto();
      tracksPlayBookDto.typeQuizId = false;
      tracksPlayBookDto.dam = asset;
      tracksPlayBookDto.id = asset.id;
      this.selectedAssets.push(tracksPlayBookDto);
    } else if (index > -1) {
      this.selectedAssets.splice(index, 1);
    }
  }

  isAssetSelected(asset: any) {
    return (this.selectedAssets != undefined && this.selectedAssets.filter(x => !x.typeQuizId).findIndex(x => x.id == asset.id) > -1)
  }

  isQuizSelected(form: any) {
    return (this.selectedAssets != undefined && this.selectedAssets.filter(x => x.typeQuizId).findIndex(x => x.id == form.id) > -1)
  }

  openOrderAssetsPopup() {
    $('#order-assets').modal('show');
  }

  openQuizPopup() {
    this.quizFormPagination = new Pagination();
    this.quizFormSortOption = new SortOption();
    this.listQuizForms(this.quizFormPagination);
    $('#quiz-list').modal('show');
  }

  selectedQuiz(form: any) {
    form.selected = !form.selected;
    let index = -1;
    if(this.selectedAssets !== undefined && this.selectedAssets.length > 0){
      $.each(this.selectedAssets, function (i: number, selectedAsset: any) {
        if(selectedAsset.typeQuizId && selectedAsset.id == form.id){
          index = i;
          return false;
        }
      });
    }
    if (index < 0 && form.selected) {
      let tracksPlayBookDto =  new TracksPlayBookDto();
      tracksPlayBookDto.typeQuizId = true;
      tracksPlayBookDto.quiz = form;
      tracksPlayBookDto.id = form.id;
      this.selectedAssets.push(tracksPlayBookDto);
    } else if (index > -1 && !form.selected) {
      this.selectedAssets.splice(index, 1);
    }
    
  }

  updateDescription(form: Form) {
    if (form != null && form != undefined) {
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
      this.tracksPlayBook.removeFeaturedImage = true;
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

  // imageCroppedMethod(event: ImageCroppedEvent) {
  //   this.croppedImage = event.base64;
  // }

  // imageLoaded() {
  //   this.showCropper = true;
  // }

  // cropperReady() {
  // }

  // loadImageFailed() {
  //   this.errorUploadCropper = true;
  //   this.showCropper = false;
  // }

  fileChangeEvent() {
    this.cropRounded = false;
    this.fileSizeError = false;
    this.imageChangedEvent = null;
    $('#cropImage').modal('show');
  }

  cropperSettings() {
    this.squareCropperSettings = this.utilService.cropSettings(this.squareCropperSettings, 130, 196, 130, false);
    this.squareCropperSettings.noFileInput = true;
  }

  uploadImage() {
    if(this.croppedImage!=""){
    this.loadingcrop = true;
    this.fileObj = this.utilService.convertBase64ToFileObject(this.croppedImage);
    this.fileObj = this.utilService.blobToFile(this.fileObj);
    this.loadingcrop = false;
    }
    if (!this.isAdd) {
      this.tracksPlayBook.removeFeaturedImage = true;
    }
    this.showCropper = false;
    this.featuredImagePath = "";
    $('#cropImage').modal('hide');
  }
  /************************************/

  omitSpecialCharacters(event: any) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || k == 45 || k == 95 || (k >= 48 && k <= 57));
  }

  updateSlug(type: string) {
    if (type == "title") {
      if (this.tracksPlayBook.id == undefined || this.tracksPlayBook.id < 1) {
        this.tracksPlayBook.slug = $.trim(this.tracksPlayBook.title).toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_');
      }
    } else if (type == "slug") {
      this.tracksPlayBook.slug = $.trim(this.tracksPlayBook.slug).toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_');
    }
    this.validateSlug();
    if ((this.isAdd || (!this.isAdd && this.existingSlug !== this.tracksPlayBook.slug)) && this.isSlugValid) {
      this.validateSlugForCompany();
    }
    this.completeLink = this.linkPrefix + this.tracksPlayBook.slug;
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
  }

  removeTags(type) {
  }

  updateSelectedTags(tag: Tag, checked: boolean) {
    let index = this.tracksPlayBook.tagIds.indexOf(tag.id);
    if (checked == undefined) {
      if (index > -1) {
        this.tracksPlayBook.tagIds.splice(index, 1);
      } else {
        this.tracksPlayBook.tagIds.push(tag.id);
      }
    } else if (checked) {
      this.tracksPlayBook.tagIds.push(tag.id);
    } else {
      this.tracksPlayBook.tagIds.splice(index, 1);
    }
  }

  addFolder(type) {
    this.selectedFolder = new Array<any>();
    this.selectedFolder.push(type);
    this.tracksPlayBook.categoryId = type.id;
  }

  removeFolder(type) {
    this.selectedFolder = new Array<any>();
    this.tracksPlayBook.categoryId = 0;
  }

  validateSlugForCompany() {
    let slugObject: TracksPlayBook = new TracksPlayBook();
    slugObject.userId = this.loggedInUserId;
    slugObject.slug = this.tracksPlayBook.slug;
    slugObject.type = this.type;
    this.tracksPlayBookUtilService.validateSlug(slugObject).subscribe(
      (response: any) => {
        slugObject.isSlugValid = response.data;
        if (!slugObject.isSlugValid) {
          this.addErrorMessage("slug", "Alias already exists");
        } else {
          this.removeErrorMessage("slug");
        }
        this.validateAllSteps();
      },
      (error: string) => {
        this.referenceService.showSweetAlertErrorMessage(this.referenceService.serverErrorMessage);
      }
    );
  }

  validateTitleForCompany() {
    this.referenceService.startLoader(this.httpRequestLoader);
    let titleObject: TracksPlayBook = new TracksPlayBook();
    let self = this;
    titleObject.userId = this.loggedInUserId;
    titleObject.title = $.trim(this.tracksPlayBook.title);
    titleObject.type = this.type;
    this.tracksPlayBookUtilService.validateTitle(titleObject).subscribe(
      (response: any) => {
        let isTitleValid = response.data;
        if (!isTitleValid) {
          this.addErrorMessage("title", "Title already exists");
        } else {
          this.removeErrorMessage("title");
        }
        this.validateAllSteps();
        this.referenceService.stopLoader(this.httpRequestLoader);
      },
      (error: string) => {
        this.referenceService.showSweetAlertErrorMessage(this.referenceService.serverErrorMessage);
      }
    );
  }

  validateTitle() {
    let title = $.trim(this.tracksPlayBook.title);
    if (title == undefined || title.length == 0) {
      this.addErrorMessage("title", "Title can not be empty");
    } else if (title != undefined && title.length < 3) {
      this.addErrorMessage("title", "Title should have atleast 3 characters");
    } else if ((this.isAdd || (!this.isAdd && this.existingTitle !== title)) &&title != undefined && title.length >=3 ) {
      this.validateTitleForCompany();
    } else {
      this.removeErrorMessage("title");
    }
  }

  validateSlug() {
    let slug = $.trim(this.tracksPlayBook.slug);
    if (slug == undefined || slug.length < 1) {
      this.addErrorMessage("slug", "Alias can not be empty");
    } else if (slug != undefined && slug.length < 3) {
      this.addErrorMessage("slug", "Slug should have atleast 3 characters");
    } else {
      this.removeErrorMessage("slug");
    }
  }

  validateDescription() {
     let description = this.referenceService.getTrimmedCkEditorDescription(this.tracksPlayBook.description);
    description = description.substring(3,description.length-4).trim();
    if (description.length < 1) {
      this.addErrorMessage("description", "description can not be empty");
    } 
    
    // else if (description.length > 5000) {
    //   this.addErrorMessage("description", "description can not be more than 5000 characters");
    // } 
    
    else {
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
    if (this.tracksPlayBook.groupIds.length < 1 && this.tracksPlayBook.userIds.length < 1) {
      let name = this.authenticationService.partnerModule.customName;
      this.addErrorMessage("groupOrCompany", "Select either a "+name+" or a "+name+" list");
    } else {
      this.removeErrorMessage("groupOrCompany");
    }
  }

  addErrorMessage(type: string, message: string) {
    if (type == "title") {
      this.isTitleValid = false;
      this.tracksPlayBook.isValid = false;
      this.titleErrorMessage = message;
    } else if (type == "slug") {
      this.isSlugValid = false;
      this.tracksPlayBook.isValid = false;
      this.slugErrorMessage = message;
    } else if (type == "asset") {
      this.isAssetValid = false;
      this.tracksPlayBook.isValid = false;
      this.assetErrorMessage = message;
    } else if (type == "groupOrCompany") {
      this.isGroupOrCompanyValid = false;
      this.tracksPlayBook.isValid = false;
      this.groupOrCompanyErrorMessage = message;
    } else if (type == "description") {
      this.isDescriptionValid = false;
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
    if (this.isTitleValid && this.isSlugValid && this.tracksPlayBook.categoryId != undefined && this.tracksPlayBook.categoryId > 0) {
      this.isStepOneValid = true;
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
    let contentAndQuizData = {};
    $.each(this.selectedAssets, function (index: number, lmsDto: any) {
      contentAndQuizData[index] = lmsDto;
    });
    this.tracksPlayBook.contentAndQuizData = contentAndQuizData;
    this.tracksPlayBook.type = this.type;
  }

  saveAndPublish() {
    this.tracksPlayBook.published = true;
    if (this.checkForChanges()) {
      this.showSweetAlertAndProceed();
    } else {
      this.addOrUpdate();
    }
  }

  save() {
    if (this.checkForChanges()) {
      this.showSweetAlertAndProceed();
    } else {
      this.addOrUpdate();
    }
  }

  checkForChanges(){
    let removedUserIds = [];
    let removedGroupIds = [];
    removedUserIds = this.selectedUserIds.filter( ( el ) => !this.tracksPlayBook.userIds.includes( el ) );
    removedGroupIds = this.selectedGroupIds.filter( ( el ) => !this.tracksPlayBook.groupIds.includes( el ) );
    if(removedUserIds.length > 0 || removedGroupIds.length > 0){
      return true;
    } else {
      return false;
    }
  }

  showSweetAlertAndProceed(){
		let self = this;
				swal({
					title: 'Are you sure?',
					text: "Existing data will be deleted",
					type: 'warning',
					showCancelButton: true,
					swalConfirmButtonColor: '#54a7e9',
					swalCancelButtonColor: '#999',
					confirmButtonText: 'Yes, delete it!'
				}).then(function () {
					self.addOrUpdate();
				}, function (dismiss: any) {
				});
	}

  addOrUpdate() {
    this.tracksPlayBook.userId = this.loggedInUserId;
    let formData: FormData = new FormData();
    if (this.tracksPlayBook.isValid) {
      this.constructLearningTrack();
      if (this.fileObj == null) {
        formData.append("featuredImage", null);
      } else {
        formData.append("featuredImage", this.fileObj, this.fileObj['name']);
      }
      this.referenceService.startLoader(this.httpRequestLoader);
      this.tracksPlayBookUtilService.saveOrUpdate(formData, this.tracksPlayBook).subscribe(
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
            if (this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
              this.referenceService.navigateToManageTracksByViewType(this.folderViewType,this.viewType,this.categoryId,false);
            } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
              this.referenceService.navigateToPlayBooksByViewType(this.folderViewType,this.viewType,this.categoryId,false);

            }
          } else {
            this.referenceService.showSweetAlertErrorMessage(data.message);
            this.referenceService.stopLoader(this.httpRequestLoader);
          }
        },
        (error: string) => {
          this.referenceService.stopLoader(this.httpRequestLoader);
          if (this.isAdd || !this.tracksPlayBook.published) {
            this.tracksPlayBook.published = false;
          }
          this.referenceService.showSweetAlertErrorMessage(this.referenceService.serverErrorMessage);
        }
      )
    } else {
      if (this.type == TracksPlayBookType[TracksPlayBookType.TRACK]) {
        this.lmsResponse = new CustomResponse('ERROR', "Invalid Track Builder", true);
      } else if (this.type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]) {
        this.lmsResponse = new CustomResponse('ERROR', "Invalid Play Book", true);
      }
      this.referenceService.goToTop();
    }
  }

  validateLearningTrack() {
    this.validateTitle();
    this.validateSlug();
    if (this.isAdd || (!this.isAdd && this.existingSlug !== this.tracksPlayBook.slug)) {
      this.validateSlugForCompany();
    }
    this.validateDescription();
    this.validateAssets();
    this.validateGroupOrCompany();
    this.validateAllSteps();
  }

  checkAllRequiredFields() {
    if (this.isStepOneValid && this.isStepTwoValid && this.isStepThreeValid && this.isStepFourValid) {
      this.tracksPlayBook.isValid = true;
    } else {
      this.tracksPlayBook.isValid = false;
    }
  }


  assetPreview(assetDetails: any, isFromPopup: boolean) {
    this.isPreviewFromAssetPopup = isFromPopup;
    let isBeeTemplate = assetDetails.beeTemplate;
    if(isBeeTemplate){
      this.referenceService.previewAssetPdfInNewTab(assetDetails.id);
    }else{
      this.referenceService.preivewAssetOnNewHost(assetDetails.id);
    }
  }


  handleMediaAndOrdersPopup() {
    if (this.activeTabName == "step-2") {
      if (this.showFilePreview) {
        $('#media-asset-list').modal('hide')
      } else {
        $('#media-asset-list').modal('show');
      }
    }
    if (this.activeTabName == "step-3") {
      if(this.isPreviewFromAssetPopup !== undefined && this.isPreviewFromAssetPopup){
        if (this.showFilePreview) {
          $('#order-assets').modal('hide');
        } else {
          $('#order-assets').modal('show');
        }
      }
    }
  }

  transformUrl() {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.filePath);
  }

  closeAssetPreview() {
    this.showFilePreview = false;
    this.isImage = false;
    this.isAudio = false;
    this.isVideo = false;
    this.isFile = false;
    this.filePath = "";
    this.viewer = "google";
    this.handleMediaAndOrdersPopup();
  }

  previewBeeTemplate(asset: any) {
    let htmlContent = "#asset-preview-content";
    $(htmlContent).empty();
    $('#assetTitle').val('');
    this.setModalPopupProperties();
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

  setModalPopupProperties(){
		$('#preview-bee-template').css('overflow-y', 'auto');
		$('#preview-bee-template').css('max-height', $(window).height() * 0.75);
	}

  getAssetsList() {
    this.assetError = false;
    this.customResponse = new CustomResponse();
    this.assetPagination = new Pagination();
    this.assetSortOption = new SortOption();
    this.isAssestPopUpOpen = true;
    this.findFileTypes();
    this.listAssets(this.assetPagination);
    $('#media-asset-list').modal('show');
  }

 

  closeAssetModal(){
    this.isAssestPopUpOpen = false;
    $('#media-asset-list').modal('hide');
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
    this.isAssestPopUpOpen = false;
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
    this.tracksPlayBook.categoryId = folder.id
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

  changePartnerCompanyAndList(tracksPlayBook: TracksPlayBook) {
    this.tracksPlayBook.userIds = tracksPlayBook.userIds;
    this.tracksPlayBook.partnershipIds = tracksPlayBook.partnershipIds;
    this.tracksPlayBook.groupIds = tracksPlayBook.groupIds;
    this.validateGroupOrCompany();
    this.validateAllSteps();
    this.checkAllRequiredFields()
  }

  setDescription(){
    if(CKEDITOR!=undefined){
      for (var instanceName in CKEDITOR.instances) {
          CKEDITOR.instances[instanceName].updateElement();
          this.tracksPlayBook.description = CKEDITOR.instances[instanceName].getData();
      }
    }
  }

  findFileTypes(){
    this.selectedFileType = "";
		this.loading = true;
		 this.damService.findFileTypes(this.loggedInUserCompanyId,this.categoryId).subscribe(
			 response=>{
				this.fileTypesForFilter = response.data;
				this.loading = false;
			 },error=>{
				this.fileTypesForFilter = [];
				this.loading = false;
			 }
		 );
	 }

  filterAssetsByFileType(event:any){
    this.assetPagination.pageIndex = 1;
		this.assetPagination.filterBy = event;
    this.assetPagination.searchKey = this.assetSortOption.searchKey;
    this.listAssets(this.assetPagination);
  }

  toggleContainWithinAspectRatio() {
		if(this.croppedImage!=''){
            this.containWithinAspectRatio = !this.containWithinAspectRatio;
		}else{
        this.showCropper = false;
        }
    }

    zoomOut() {
      if(this.croppedImage!=""){
        this.scale -= .1;
        this.transform = {
          ...this.transform,
          scale: this.scale       
        };
      }else{
        //this.errorUploadCropper = true;
        this.showCropper = false; 
      }
      }

      zoomIn() {
        if(this.croppedImage!=''){
                this.scale += .1;
                this.transform = {
                    ...this.transform,
                    scale: this.scale
                };
          
        }else{
            this.showCropper = false;
          //  this.errorUploadCropper = true;
            }
        }
        resetImage() {
          if(this.croppedImage!=''){
                  this.scale = 1;
                  this.rotation = 0;
                  this.canvasRotation = 0;
                  this.transform = {};
          }else{
              this.showCropper = false;
             // this.errorUploadCropper = true;
          }
          }
          imageCroppedMethod(event: ImageCroppedEvent) {
            this.croppedImage = event.base64;
            console.log(event, base64ToFile(event.base64));
            }
            imageLoaded() {
              this.showCropper = true;
              }
              cropperReady(sourceImageDimensions: Dimensions) {
                  console.log('Cropper ready', sourceImageDimensions);
              }
            loadImageFailed () {
              console.log('Load failed');
              }
              closeModal() {
                this.cropRounded = !this.cropRounded;
                this.circleData = {};
                this.imageChangedEvent = null;
                 this.croppedImage = '';
              }  
              fileBgImageChangeEvent(event){
                const image:any = new Image();
                const file:File = event.target.files[0];
                const isSupportfile = file.type;
                if (isSupportfile === 'image/jpg' || isSupportfile === 'image/jpeg' || isSupportfile === 'image/webp' || isSupportfile === 'image/png') {
                    this.errorUploadCropper = false;
                    this.imageChangedEvent = event;
                } else {
                  this.errorUploadCropper = true;
                  this.showCropper = false;
                }
              }       
              
  setCustomCssValues() {
    document.documentElement.style.setProperty('--form-page-bg-color', this.pageBackgroundColor);
    document.documentElement.style.setProperty('--form-border-color', this.form.borderColor);
    document.documentElement.style.setProperty('--form-label-color', this.form.labelColor);
    document.documentElement.style.setProperty('--form-description-color', this.form.descriptionColor);
    document.documentElement.style.setProperty('--form-title-color', this.form.titleColor);
    document.documentElement.style.setProperty('--form-bg-color', this.form.backgroundColor);
    require("style-loader!../../../assets/admin/layout2/css/themes/form-custom-skin.css");
  } 

  clearTagsResponse() {
    if (this.folderOrTagsCustomResponse.isVisible) {
      this.folderOrTagsCustomResponse = new CustomResponse();
    }
  }

  /*****XNFR-523****/
  setTrackUpdatedEmailNotification(event:any){
    this.tracksPlayBook.trackUpdatedEmailNotification = event;
  }

}
