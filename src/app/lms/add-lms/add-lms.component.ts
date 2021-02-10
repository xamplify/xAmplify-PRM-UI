import { Component, OnInit, OnDestroy, ViewChild, } from '@angular/core';
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
import {  ImageCropperComponent } from 'ng2-img-cropper';
import { ImageCroppedEvent } from '../../common/image-cropper/interfaces/image-cropped-event.interface';
import {AddFolderModalPopupComponent} from 'app/util/add-folder-modal-popup/add-folder-modal-popup.component';

declare var $, swal, CKEDITOR: any;
@Component({
  selector: 'app-add-lms',
  templateUrl: './add-lms.component.html',
  styleUrls: ['./add-lms.component.css'],
  providers: [HttpRequestLoader, Pagination, SortOption, FormService, RegularExpressions, DamService, ContactService]
})
export class AddLmsComponent implements OnInit {

  form: Form = new Form();
  ngxloading = false;
  loading = false;
  formError = false;
  customResponse: CustomResponse = new CustomResponse();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  vanityLoginDto : VanityLoginDto = new VanityLoginDto();
  isPartnerView = false;
  SubmitButtonValue = "Save"
  SubmitAndPublishButtonValue = "Save & Publish"
  heading = "Add New Learning Track"
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
  categoryNames: any;
  activeTabName: string = "";
  learningTrack: LearningTrack = new LearningTrack();
  learningTrackId:number = 0;
  isAdd:boolean = true;
  lmsResponse: CustomResponse = new CustomResponse();
  slug = "";
  quizFormPagination: Pagination = new Pagination();
  quizFormSortOption: SortOption = new SortOption();
  quizFormsError: boolean = false;
  quizFormsLoader: HttpRequestLoader = new HttpRequestLoader();
  selectedQuizName = "";
  assetPagination: Pagination = new Pagination();
  assetSortOption: SortOption = new SortOption();
  assetError: boolean = false;
  assetLoader: HttpRequestLoader = new HttpRequestLoader();
  selectedAssets: Array<LmsDto> = new Array<LmsDto>();
  assetIndex = 0;
  partnerCompanyList: Array<LmsDto> = new Array<LmsDto>();
  selectedPartnerCompanies: Array<LmsDto> = new Array<LmsDto>();
  groupList: Array<LmsDto> = new Array<LmsDto>();
  selectedGroups: Array<LmsDto> = new Array<LmsDto>();

  isTitleValid:boolean = false;
  isSlugValid:boolean = false;
  isAssetValid:boolean = false;
  isGroupOrCompanyValid:boolean = false;
  isDescriptionValid:boolean = false;
  titleErrorMessage:string;
  slugErrorMessage:string;
  assetErrorMessage:string;
  groupOrCompanyErrorMessage:string;
  descriptionErrorMessage:string;
  linkPrefix:string = "";
  editRouterLink:string = "";

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

  constructor(public userService: UserService, public regularExpressions: RegularExpressions, private dragulaService: DragulaService, public logger: XtremandLogger, private formService: FormService, private route: ActivatedRoute, public referenceService: ReferenceService, public authenticationService: AuthenticationService, public lmsService: LmsService, private router: Router, public pagerService: PagerService,
    public sanitizer: DomSanitizer, public envService: EnvService, public utilService: UtilService, public damService: DamService, 
    public xtremandLogger: XtremandLogger, public contactService: ContactService) {
    this.siteKey = this.envService.captchaSiteKey;
    this.loggedInUserId = this.authenticationService.getUserId();
    this.listTags(new Pagination());
    this.listCategories();
    this.listPartnerCompanies();
    this.listForms(this.formPagination);
    this.listQuizForms(this.quizFormPagination);
    this.getCompanyId();
    this.listGroups(new Pagination());
    dragulaService.setOptions('form-options', {})
      dragulaService.dropModel.subscribe((value) => {
          this.onDropModel(value);
      });
  }

  ngOnInit() {
    this.activeTabName = 'content';
    if (this.router.url.indexOf('/edit') > -1) {
      this.learningTrackId = parseInt(this.route.snapshot.params['id']);
      if (this.learningTrackId > 0) {
        this.isAdd = false;
        this.editRouterLink = "/home/lms/edit/" + this.learningTrackId;
        this.getById(this.learningTrackId);
        this.SubmitButtonValue = "Update"
        this.SubmitAndPublishButtonValue = "Update & Publish"
        this.heading = "Edit Learning Track"
      } else {
        this.goToManageSectionWithError();
      }
    } else {
      this.isAdd = true;
      this.selectedPartnerCompanies.push(new LmsDto());
      this.selectedAssets.push(new LmsDto());
      this.selectedGroups.push(new LmsDto());
    }
  }

  ngOnDestroy() {
    this.dragulaService.destroy('form-options');
  }

  goToManageSectionWithError() {
    this.referenceService.showSweetAlertErrorMessage("Invalid Id");
    this.referenceService.goToRouter("/home/lms");
  }

  private onDropModel(args) {
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
        pagination = this.pagerService.getPagedItems(pagination, data.forms);
        this.referenceService.loading(this.formsLoader, false);
      },
      (error: any) => {
        this.formsError = true;
        this.customResponse = new CustomResponse('ERROR', 'Unable to get forms.Please Contact Admin.', true);
      });
  }

  /********************Pagaination&Search Code*****************/

  /*************************Sort********************** */
  formsSortBy(text: any) {
    this.formSortOption.formsSortOption = text;
    this.getAllFormsFilteredResults(this.formPagination);
  }


  /*************************Search********************** */
  searchForms() {
    this.getAllFormsFilteredResults(this.formPagination);
  }

  formsPaginationDropdown(items: any) {
    this.formSortOption.itemsSize = items;
    this.getAllFormsFilteredResults(this.formPagination);
  }

  /************Page************** */
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
        pagination = this.pagerService.getPagedItems(pagination, data.forms);
        this.referenceService.loading(this.quizFormsLoader, false);
        this.referenceService.stopLoader(this.httpRequestLoader);
      },
      (error: any) => {
        this.customResponse = new CustomResponse('ERROR', 'Unable to get forms.Please Contact Admin.', true);
        this.referenceService.stopLoader(this.httpRequestLoader);
      });
  }

  /********************Pagaination&Search Code*****************/
  /*************************Sort********************** */
  quizSortBy(text: any) {
    this.quizFormSortOption.formsSortOption = text;
    this.getAllQuizFilteredResults(this.quizFormPagination);
  }


  /*************************Search********************** */
  searchQuizForms() {
    this.getAllQuizFilteredResults(this.quizFormPagination);
  }

  quizPaginationDropdown(items: any) {
    this.quizFormSortOption.itemsSize = items;
    this.getAllQuizFilteredResults(this.quizFormPagination);
  }

  /************Page************** */
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

  /*************************Assets********************** */
  listAssets(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
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
  /********************Pagaination&Search Code*****************/
  /*************************Sort********************** */
  assetSortBy(text: any) {
    if (this.isPartnerView) {
			this.assetSortOption.publishedDamSortOption = text;
		} else {
      this.assetSortOption.damSortOption = text;
		}
    this.getAllAssetFilteredResults(this.assetPagination);
  }


  /*************************Search********************** */
  searchAssets() {
    this.getAllAssetFilteredResults(this.assetPagination);
  }

  assetPaginationDropdown(items: any) {
    this.assetSortOption.itemsSize = items;
    this.getAllAssetFilteredResults(this.assetPagination);
  }

  /************Page************** */
  setAssetPage(event: any) {
    this.assetPagination.pageIndex = event.page;
    if (this.isPartnerView) {
			this.listPublishedAssets(this.assetPagination);
		} else {
			this.listAssets(this.assetPagination);
		}  }

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
            this.linkPrefix = this.authenticationService.APP_URL + "lms/" + this.loggedInUserCompanyId + "/";
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
							if(this.vanityLoginDto.vanityUrlFilter){
								this.assetPagination.vanityUrlFilter  = this.vanityLoginDto.vanityUrlFilter;
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

  listGroups(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
    pagination.maxResults = 0;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.contactService.loadContactLists(pagination).subscribe(
      (response: any) => {
        this.groupList = response.listOfUserLists;
        this.referenceService.loading(this.httpRequestLoader, false);
      },
      (error: any) => {
        this.customResponse = new CustomResponse('ERROR', 'Unable to get forms.Please Contact Admin.', true);
      });
  }

  updateDescription(form: Form, event) {
    if (CKEDITOR != undefined) {
      for (var instanceName in CKEDITOR.instances) {
        CKEDITOR.instances[instanceName].updateElement();
        this.learningTrack.description = CKEDITOR.instances[instanceName].getData();
      }
    }
    this.learningTrack.description = this.learningTrack.description + "<b><a href = " + form.ailasUrl + "target='_blank'>" + form.name + "</a>";
    $('#formsList').modal('hide');
  }

  updateSelectedTags(tag: Tag, event: any) {
    if (event.target.checked) {
      this.learningTrack.tagIds.push(tag.id);
    } else {
      this.learningTrack.tagIds.splice($.inArray(tag.id), 1);
    }
    console.log(this.learningTrack.tagIds)
  }

  listTags(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
    pagination.maxResults = 0;
    this.referenceService.startLoader(this.httpRequestLoader);
    this.userService.getTags(pagination)
      .subscribe(
        response => {
          const data = response.data;
          this.tags = data.tags;
          this.referenceService.stopLoader(this.httpRequestLoader);
        },
        (error: any) => {
          this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
          this.referenceService.stopLoader(this.httpRequestLoader);
        },
        () => this.logger.info('Finished listTags()')
      );
  }

  listCategories() {
    this.referenceService.startLoader(this.httpRequestLoader);
    this.authenticationService.getCategoryNamesByUserId(this.loggedInUserId).subscribe(
      (data: any) => {
        this.categoryNames = data.data;
        this.referenceService.stopLoader(this.httpRequestLoader);
      },
      error => { 
        this.logger.error("error in getCategoryNamesByUserId(" + this.loggedInUserId + ")", error); 
        this.referenceService.stopLoader(this.httpRequestLoader);
      },
      () => this.logger.info("Finished listCategories()"));
  }

  listPartnerCompanies() {
    this.referenceService.startLoader(this.httpRequestLoader);
    this.lmsService.getPartnerCompaniesByUserId(this.loggedInUserId).subscribe(
      (data: any) => {
        this.partnerCompanyList = data.data;
        this.referenceService.stopLoader(this.httpRequestLoader);
      },
      error => { 
        this.logger.error("error in getPartnerCompaniesByUserId(" + this.loggedInUserId + ")", error);
        this.referenceService.stopLoader(this.httpRequestLoader);
      },
      () => this.logger.info("Finished listPartnerCompanies()"));
  }

  saveAndPublish() {
    this.learningTrack.published = true;
    this.addOrUpdateLearningTrack();
  }

  addOrUpdateLearningTrack() {
    this.learningTrack.userId = this.loggedInUserId;
    let formData: FormData = new FormData();
    this.validateLearningTrack();
    if (this.learningTrack.isValid && this.isDescriptionValid) {
      this.constructLearningTrack();
      if (this.fileObj == null) {
        formData.append("featuredImage", null);
      } else {
        formData.append("featuredImage", this.fileObj, this.fileObj['name']);
      }
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
            this.router.navigate(["/home/lms/manage"]);
          }
        },
        (error: string) => {
          this.referenceService.stopLoader(this.httpRequestLoader);
          this.referenceService.showSweetAlertErrorMessage(this.referenceService.serverErrorMessage);
        }
      )
    } else {
      this.lmsResponse =  new CustomResponse('ERROR', this.descriptionErrorMessage, true);
      this.referenceService.goToTop();
    }
  }

  validateLearningTrack(){
    this.validateTitle();
    this.validateSlug();
    if(this.isAdd || (!this.isAdd && this.existingSlug !== this.learningTrack.slug)){
      this.validateSlugForCompany();
    }
    this.validateAssets();
    this.validateGroupOrCompany();
    this.validateDescription();
    this.checkAllRequiredFields();
  }

  checkAllRequiredFields(){
    if(this.isTitleValid && this.isSlugValid && this.learningTrack.categoryId != undefined && this.learningTrack.categoryId > 0 
      && this.isAssetValid && this.isGroupOrCompanyValid){
      this.learningTrack.isValid = true;
    }
  }

  constructLearningTrack(){
    let partnershipIds: Array<number> = new Array<number>();
    let groupIds: Array<number> = new Array<number>();
    let contentIds: Array<number> = new Array<number>();
    if (CKEDITOR != undefined) {
      for (var instanceName in CKEDITOR.instances) {
        CKEDITOR.instances[instanceName].updateElement();
        this.learningTrack.description = CKEDITOR.instances[instanceName].getData();
      }
    }
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
    } else if(this.learningTrack.title != undefined && this.learningTrack.title.length < 3) {
      this.addErrorMessage("title", "Title should have atleast 3 characters");
    } else {
      this.removeErrorMessage("title");
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

  validateSlug() {
    if (this.learningTrack.slug == undefined || this.learningTrack.slug.length < 1) {
      this.addErrorMessage("slug", "Alias can not be empty");
    } else if(this.learningTrack.slug != undefined && this.learningTrack.slug.length < 3) {
      this.addErrorMessage("slug", "Slug should have atleast 3 characters");
    } else {
        this.removeErrorMessage("slug");
    }
  }

  validateDescription(){
    let description:string = "";
    if (CKEDITOR != undefined) {
      for (var instanceName in CKEDITOR.instances) {
        CKEDITOR.instances[instanceName].updateElement();
        description = CKEDITOR.instances[instanceName].getData();
      }
    }
    // && this.learningTrack.description != undefined && this.learningTrack.description.length < 1
    if(description.length < 1){
      this.addErrorMessage("description","description can not be empty");
    } else{
      this.removeErrorMessage("description")
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
    this.checkAllRequiredFields();
  }


  activateTab(activeTabName: any) {
    this.activeTabName = activeTabName;
  }

  clearCustomResponse() { this.customResponse = new CustomResponse(); }

  omitSpecialCharacters(event: any) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || k == 45 || k == 95 || (k >= 48 && k <= 57));
  }

  updateSlug(type: string) {
    if(type == "title"){
      this.learningTrack.slug = this.learningTrack.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    } else if(type == "slug"){
      this.learningTrack.slug = this.learningTrack.slug.replace(/[^a-zA-Z0-9_-]/g, '_');
    }
    // if (this.slug == undefined || this.slug.length == 0) {
    //   this.learningTrack.slug = this.learningTrack.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    // } else {
    //   this.learningTrack.slug = this.learningTrack.slug.replace(/[^a-zA-Z0-9_-]/g, '_');
    // }
    this.validateSlug();
    if((this.isAdd || (!this.isAdd && this.existingSlug !== this.learningTrack.slug)) && this.isSlugValid){
      this.validateSlugForCompany();
    }
  }

  selectedQuiz(form: Form) {
    this.learningTrack.quizId = form.id;
    this.selectedQuizName = form.name;
    $('#quiz-list').modal('hide');
  }

  openQuizPopup() {
    $('#quiz-list').modal('show');
  }

  clearQuiz() {
    this.learningTrack.quizId = 0;
    this.selectedQuizName = '';
  }

  addAsset() {
    this.selectedAssets.push(new LmsDto());
  }

  removeAsset(index: number) {
    if (this.selectedAssets.length > 1) {
      this.selectedAssets.splice(index, 1);
    }
  }
  clearAsset(index: number){
    this.selectedAssets[index] = new LmsDto();
  }

  addPartnerCompany() {
    this.selectedPartnerCompanies.push(new LmsDto());
  }

  removePartnerCompany(index: number) {
    if (this.selectedPartnerCompanies.length > 1 || this.selectedGroups.length > 0) {
      this.selectedPartnerCompanies.splice(index, 1);
    }
  }

  openAssetPopup(index: number){
    console.log(index)
    this.assetIndex = index;
    $('#yourAssets').modal('show');
  }

  setSelectedAsset(asset: any){
    this.selectedAssets[this.assetIndex] = asset;
    $('#yourAssets').modal('hide');
    console.log(this.selectedAssets)
  }
  
  addGroup() {
    this.selectedGroups.push(new LmsDto());
  }

  removeGroup(index: number) {
    if (this.selectedGroups.length > 1 || this.selectedPartnerCompanies.length > 0) {
      this.selectedGroups.splice(index, 1);
    }
  }

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
    this.learningTrack.removeFeaturedImage = true;
    this.featuredImagePath = "";
  }

filenewChangeEvent(event) {
    const image: any = new Image();
    const file: File = event.target.files[0];
    const isSupportfile = file.type;
    const fileSize = file.size;
    if (isSupportfile === 'image/jpg' || isSupportfile === 'image/jpeg' || isSupportfile === 'image/png') {
        if (fileSize < 12582912){
            this.errorUploadCropper = false;
            this.fileSizeError = false;
            this.imageChangedEvent = event;
        }else{
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
    this.learningTrack.removeFeaturedImage = true;
    this.featuredImagePath = "";
    $('#cropImage').modal('hide');
}

  getById(id: number) {
    this.ngxloading = true;
    this.lmsService.getById(id).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          let learningTrack:LearningTrack = response.data;
          if (learningTrack != undefined) {
            this.learningTrack = learningTrack;
            this.featuredImagePath = this.learningTrack.featuredImage;
            this.existingSlug = this.learningTrack.slug;
            if (this.learningTrack.quiz !== undefined) {
              this.learningTrack.quizId = this.learningTrack.quiz.id;
              this.selectedQuizName = this.learningTrack.quiz.name;
            }
            if (this.learningTrack.contents !== undefined && this.learningTrack.contents.length > 0) {
              this.selectedAssets = this.learningTrack.contents;
            } else {
              this.selectedAssets.push(new LmsDto());
            }
            if (this.learningTrack.companies !== undefined && this.learningTrack.companies.length > 0) {
              this.selectedPartnerCompanies = this.learningTrack.companies;
            } else {
              this.selectedPartnerCompanies.push(new LmsDto());
            }
            if (this.learningTrack.groups !== undefined && this.learningTrack.groups.length > 0) {
              this.selectedGroups = this.learningTrack.groups;
            } else {
              this.selectedGroups.push(new LmsDto());
            }
            if (this.learningTrack.tags !== undefined && this.learningTrack.tags.length > 0) {
              let tagIds: Array<number> = new Array<number>();
              $.each(this.learningTrack.tags, function (index: number, tag: Tag) {
                tagIds.push(tag.id);
              });
              this.learningTrack.tagIds = tagIds;
            }
            if (this.learningTrack.category !== undefined) {
              this.learningTrack.categoryId = this.learningTrack.category.id;
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

  addTag(){
    this.openAddTagPopup = true;
  }

  openCreateFolderPopup() {
    this.addFolderModalPopupComponent.openPopup();
  }

}
