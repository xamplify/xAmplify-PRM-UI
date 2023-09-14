import { Component, OnInit, OnDestroy, Renderer,Input,Output,EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmailTemplateService } from 'app/email-template/services/email-template.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { UserService } from 'app/core/services/user.service';
import { UtilService } from 'app/core/services/util.service';
import { Pagination } from 'app/core/models/pagination';
import { EmailTemplate } from 'app/email-template/models/email-template';
import { EmailTemplateType } from 'app/email-template/models/email-template-type';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { CampaignAccess } from 'app/campaigns/models/campaign-access';
import { SortOption } from 'app/core/models/sort-option';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { ModulesDisplayType } from 'app/util/models/modules-display-type';
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { ActionsDescription } from 'app/common/models/actions-description';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { Roles } from 'app/core/models/roles';
declare var $:any, swal: any;

@Component({
  selector: "app-email-templates-list-and-grid-view",
  templateUrl: "./email-templates-list-and-grid-view.component.html",
  styleUrls: ["./email-templates-list-and-grid-view.component.css"],
  providers: [
    Pagination,
    HttpRequestLoader,
    ActionsDescription,
    CampaignAccess,
    SortOption,
    Properties,
  ],
})
export class EmailTemplatesListAndGridViewComponent implements OnInit,OnDestroy {
  loading = false;
  loggedInUserId: number = 0;
  customResponse: CustomResponse = new CustomResponse();
  loggedInUserCompanyId: any;
  viewType: string;
  modulesDisplayType = new ModulesDisplayType();
  loggedInAsSuperAdmin: boolean;
  isPartnerToo: boolean;
  message: string;
  hasAllAccess: boolean;
  hasEmailTemplateRole: boolean;
  isOnlyPartner: boolean;
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  folderListView = false;
  selectedTemplateTypeIndex = 0;
  showUpArrowButton = false;
  folderViewType = "";
	@Input() folderListViewCategoryId:any;
	exportObject = {};
	@Output() updatedItemsCountEmitter = new EventEmitter();
	@Input() folderListViewExpanded = false;
  categoryId=0;
  emailTemplate: EmailTemplate;
	emailPreview: string;
  isEmailTemplateDeleted = false;
	isCampaignEmailTemplate = false;
	selectedEmailTemplateName = "";
  saveAsDefaultTemplate =false;
  defaultTemplateInput = {};
  /**XNFR-317*****/
	selectedEmailTemplateId = 0;
	sendTestEmailIconClicked = false;
	whiteLabeledBanner = "";
  ngxloading: boolean;
  roles:Roles = new Roles();

  constructor(
    private emailTemplateService: EmailTemplateService,
    private router: Router,
    private pagerService: PagerService,
    public referenceService: ReferenceService,
    public actionsDescription: ActionsDescription,
    public pagination: Pagination,
    public authenticationService: AuthenticationService,
    private logger: XtremandLogger,
    public campaignAccess: CampaignAccess,
    public renderer: Renderer,
    public userService: UserService,
    private route: ActivatedRoute,
    public utilService: UtilService,
    public properties: Properties,
    private dashboardService: DashboardService,
    public sortOption: SortOption
  ) {}

  initializeVariables() {
    this.referenceService.renderer = this.renderer;
    this.loggedInUserId = this.authenticationService.getUserId();
    this.loggedInAsSuperAdmin = this.utilService.isLoggedInFromAdminPortal();
    this.isPartnerToo = this.authenticationService.checkIsPartnerToo();
    this.whiteLabeledBanner = this.properties.whiteLabeledBanner;
    this.emailTemplateService.isTemplateSaved = false;
    if (this.referenceService.isCreated) {
      this.message = "Template created successfully";
      this.showMessageOnTop(this.message);
    } else if (this.referenceService.isUpdated) {
      this.message = "Template updated successfully";
      this.showMessageOnTop(this.message);
    }
    this.hasAllAccess = this.referenceService.hasAllAccess();
    this.hasEmailTemplateRole = this.referenceService.hasSelectedRole(
      this.referenceService.roles.emailTemplateRole
    );
    this.isOnlyPartner = this.authenticationService.isOnlyPartner();
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== "") {
        this.vanityLoginDto.vendorCompanyProfileName =
        this.authenticationService.companyProfileName;
        this.vanityLoginDto.userId = this.loggedInUserId;
        this.vanityLoginDto.vanityUrlFilter = true;
    }
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
				this.viewType = this.modulesDisplayType.isListView ? 'l' : this.modulesDisplayType.isGridView ?'g':'';
				if(this.modulesDisplayType.isFolderListView){
					this.viewType = "fl";
					this.referenceService.goToManageEmailTemplates(this.viewType);
				}else if(this.modulesDisplayType.isFolderGridView){
					this.viewType = "fg";
					this.referenceService.goToManageEmailTemplates(this.viewType);
				}
			}
		}
  }

  showMessageOnTop(message: string) {
    $(window).scrollTop(0);
    this.customResponse = new CustomResponse("SUCCESS", message, true);
  }

  ngOnInit() {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.initializeVariables();
    this.findAccessAndLoadEmailTemplates();
  }

  findAccessAndLoadEmailTemplates() {
    this.dashboardService.getModulesAccessByUserId().subscribe(
      (response) => {
        this.campaignAccess = response;
      },
      (error) => {
        this.logger.errorPage(error);
      },
      () => {
        this.findEmailTemplates(this.pagination);
      }
    );
  }

  findEmailTemplates(pagination: Pagination) {
    if(!this.folderListView){
			this.referenceService.goToTop();
		}
    this.referenceService.loading(this.httpRequestLoader, true);
    pagination.showDraftContent = true;
    if(this.categoryId!=undefined && this.categoryId>0){
      pagination.categoryId = this.categoryId;
      this.pagination.categoryType = 'e';
    }
    if (this.vanityLoginDto.vanityUrlFilter) {
      this.pagination.vanityUrlFilter = this.vanityLoginDto.vanityUrlFilter;
      this.pagination.vendorCompanyProfileName =
        this.vanityLoginDto.vendorCompanyProfileName;
    }
    this.emailTemplateService
      .listTemplates(pagination, this.loggedInUserId)
      .subscribe(
        (data: any) => {
          pagination.totalRecords = data.totalRecords;
          this.sortOption.totalRecords = data.totalRecords;
          pagination = this.pagerService.getPagedItems(
            pagination,
            data.emailTemplates
          );
          this.referenceService.loading(this.httpRequestLoader, false);
        },
        (error: string) => {
          this.logger.errorPage(error);
        }
      );
  }
/*************************Sort********************** */
  sortEmailTemplates(text: any) {
	this.sortOption.formsSortOption = text;
    this.getAllFilteredResults(this.pagination);
  }
  getAllFilteredResults(pagination: Pagination) {
	this.pagination.pageIndex = 1;
	this.pagination.searchKey = this.sortOption.searchKey;
	this.pagination = this.utilService.sortOptionValues(this.sortOption.formsSortOption, this.pagination);
	this.findEmailTemplates(this.pagination);
}
eventHandler(keyCode: any) { if (keyCode === 13) { this.searchEmailTemplates(); } }

 /*************************Search********************** */
searchEmailTemplates() {
	this.getAllFilteredResults(this.pagination);
}

/************Page************** */
setPage(event: any) {
	this.pagination.pageIndex = event.page;
	this.findEmailTemplates(this.pagination);
}

setViewType(viewType: string) {
    if(this.viewType!=viewType){
        if (this.folderListView) {
            let gridView = "g" == viewType;
            this.modulesDisplayType.isGridView = gridView;
            this.modulesDisplayType.isListView = !gridView;
        } else {
            if (this.folderViewType != undefined && viewType != "fg") {
                this.referenceService.goToManageEmailTemplatesByCategoryId("fg", viewType, this.categoryId);
            } else {
                this.referenceService.goToManageEmailTemplates(viewType);
            }
        }
    }
}

refreshList(){
	this.findEmailTemplates(this.pagination);
}

filterTemplates(type: string, isVideoTemplate: boolean, index: number) {
	if (type == "EMAIL") {
		this.pagination.emailTemplateType = EmailTemplateType.EMAIL;
	} else if (type == "NONE") {
		this.pagination.emailTemplateType = EmailTemplateType.NONE;
	} else if (type == "VIDEO") {
		this.pagination.emailTemplateType = EmailTemplateType.VIDEO;
	} else if (type == "UPLOADED") {
		this.pagination.emailTemplateType = EmailTemplateType.UPLOADED;
	} else if (type == "PARTNER") {
		this.pagination.emailTemplateType = EmailTemplateType.PARTNER;
	} else if (type == "REGULAR_CO_BRANDING") {
		this.pagination.emailTemplateType = EmailTemplateType.REGULAR_CO_BRANDING;
	} else if (type == "VIDEO_CO_BRANDING") {
		this.pagination.emailTemplateType = EmailTemplateType.VIDEO_CO_BRANDING;
	} else if (type == "EVENT_CO_BRANDING") {
		this.pagination.emailTemplateType = EmailTemplateType.EVENT_CO_BRANDING;
	} else if (type == "EVENT") {
		this.pagination.emailTemplateType = EmailTemplateType.EVENT;
	} else if (type == "MARKETO") {
		this.pagination.emailTemplateType = EmailTemplateType.MARKETO;
	} else if (type == "HUBSPOT") {
		this.pagination.emailTemplateType = EmailTemplateType.HUBSPOT;
	} else if (type == "SURVEY") {
		this.pagination.emailTemplateType = EmailTemplateType.SURVEY;
	} else if (type == "SURVEY_CO_BRANDING") {
		this.pagination.emailTemplateType = EmailTemplateType.SURVEY_CO_BRANDING;
	}
	this.selectedTemplateTypeIndex = index;//This is to highlight the tab
	this.pagination.pageIndex = 1;
	if (isVideoTemplate) {
		this.pagination.filterBy = "VideoEmail";
	} else if (!isVideoTemplate && this.selectedTemplateTypeIndex == 9) {
		this.pagination.filterBy = 'EventEmail';
	} else if (type == "SURVEY") {
		this.pagination.filterBy = 'Survey';
	} else if (!isVideoTemplate) {
		this.pagination.filterBy = "RegularEmail";
	}
	this.findEmailTemplates(this.pagination);
}

edit(id: number) {
  this.referenceService.loading(this.httpRequestLoader, true);
  this.emailTemplateService.getById(id)
    .subscribe(
      (data: EmailTemplate) => {
        this.emailTemplateService.emailTemplate = data;
        let viewType = this.route.snapshot.params['viewType'];
        let categoryId = this.route.snapshot.params['categoryId'];
        let folderViewType = this.route.snapshot.params['folderViewType'];
        if (data.source.toString() === "MARKETO" || data.source.toString() === "HUBSPOT") {
          this.navigateToEditPage(folderViewType,viewType,categoryId);
        } else {
          if (data.regularTemplate || data.videoTemplate) {
            this.navigateToEditPage(folderViewType,viewType,categoryId);
          } else {
            this.emailTemplateService.isNewTemplate = false;
            this.referenceService.navigateToEditEmailTemplateByViewType(folderViewType,viewType,categoryId);
          }
        }
      },
      (error: string) => {
        this.referenceService.loading(this.httpRequestLoader, false);
        this.referenceService.showServerError(this.httpRequestLoader);
      }
    );

}

navigateToEditPage(folderViewType:string,viewType:string,categoryId:number) {
  this.referenceService.navigateToUpdateEmailTemplateByViewType(folderViewType,viewType,categoryId);
}
/******Delete*********/
confirmDeleteEmailTemplate(id: number, name: string) {
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
      self.deleteEmailTemplate(id, name);
    }, function(dismiss: any) {
      console.log('you clicked on option' + dismiss);
    });
  } catch (error) {
    this.logger.error(this.referenceService.errorPrepender + " confirmDeleteEmailTemplate():" + error);
    this.referenceService.showServerError(this.httpRequestLoader);
  }

}

deleteEmailTemplate(id: number, name: string) {
  this.referenceService.loading(this.httpRequestLoader, true);
  this.referenceService.goToTop();
  this.isEmailTemplateDeleted = false;
  this.isCampaignEmailTemplate = false;
  this.emailTemplateService.delete(id)
    .subscribe(
      (data: any) => {
        if (data.access) {
          let message = data.message;
          if (message == "Success") {
            this.referenceService.showInfo("Email Template Deleted Successfully", "");
            this.selectedEmailTemplateName = name + ' deleted successfully';
            this.customResponse = new CustomResponse('SUCCESS', this.selectedEmailTemplateName, true);
            this.isEmailTemplateDeleted = true;
            this.isCampaignEmailTemplate = false;
            this.pagination.pageIndex = 1;
            this.findEmailTemplates(this.pagination);
            this.callFolderListViewEmitter();
          } else {
            this.isEmailTemplateDeleted = false;
            this.isCampaignEmailTemplate = true;
            let result = message.split(",");
            let campaignNames = "";
            $.each(result, function(index, value) {
              campaignNames += (index + 1) + "." + value + "<br><br>";
            });
            let updatedMessage = "This template is being used in Campaign(s) / Auto Response(s) / Redistributed Campaign(s)<br><br>" + campaignNames;
            this.customResponse = new CustomResponse('ERROR', updatedMessage, true);
            this.referenceService.loading(this.httpRequestLoader, false);
          }
        } else {
          this.authenticationService.forceToLogout();
        }

      },
      (error: string) => {
        this.logger.errorPage(error);
        this.referenceService.showServerError(this.httpRequestLoader);
      }
    );
}

ngOnDestroy() {
  this.referenceService.isCreated = false;
  this.referenceService.isUpdated = false;
  this.message = "";
  $('#show_email_template_preivew').modal('hide');
  $('#email_spam_check').modal('hide');
  swal.close();
}

getTemplateById(emailTemplate: EmailTemplate) {
  this.ngxloading = true;
  this.emailTemplateService.getById(emailTemplate.id)
    .subscribe(
      (data: any) => {
        emailTemplate.body = data.body;
        this.showPreview(emailTemplate);
      },
      error => {
        this.logger.errorPage(error);
      });
}

showPreview(emailTemplate: EmailTemplate) {
  this.ngxloading = true;
  this.emailTemplateService.getAllCompanyProfileImages(this.loggedInUserId)
    .subscribe(
      (data: any) => {
        let body = emailTemplate.body;
        let self = this;
        $.each(data, function(index, value) {
          body = body.replace(value, self.authenticationService.MEDIA_URL + self.referenceService.companyProfileImage);
        });
        body = body.replace("https://xamp.io/vod/replace-company-logo.png", this.authenticationService.MEDIA_URL + this.referenceService.companyProfileImage);
        let emailTemplateName = emailTemplate.name;
        if (emailTemplateName.length > 50) {
          emailTemplateName = emailTemplateName.substring(0, 50) + "...";
        }
        $("#htmlContent").empty();
        $("#email-template-title").empty();
        $("#email-template-title").append(emailTemplateName);
        $('#email-template-title').prop('title', emailTemplate.name);

        if (this.referenceService.hasMyMergeTagsExits(body)) {
          let data = {};
          data['emailId'] = this.authenticationService.user.emailId;
          this.referenceService.getMyMergeTagsInfoByEmailId(data).subscribe(
            response => {
              if (response.statusCode == 200) {
                body = this.referenceService.replaceMyMergeTags(response.data, body);
                this.showModal(body);
              }
            },
            error => {
              this.logger.error(error);
              this.showModal(body);
            }
          );

        } else {
          this.showModal(body);
        }

      },
      error => { this.ngxloading = false; this.logger.error("error in getAllCompanyProfileImages(" + this.loggedInUserId + ")", error); },
      () => this.logger.info("Finished getAllCompanyProfileImages()"));

}

showModal(body: string) {
  $("#htmlContent").append(body);
  $('.modal .modal-body').css('overflow-y', 'auto');
  $("#show_email_template_preivew").modal('show');
  this.ngxloading = false;
}

spamCheck(emailTemplate: any) {
  this.emailTemplate = null;
  this.emailTemplate = emailTemplate;
  $("#email_spam_check").modal('show');
}

openDefaultTemplatePopup(emailTemplate: any) {
  this.saveAsDefaultTemplate = true;
  this.defaultTemplateInput['id'] = emailTemplate.id;
  this.defaultTemplateInput['name'] = emailTemplate.name;
}

showSuccessMessage() {
  this.saveAsDefaultTemplate = false;
  this.defaultTemplateInput = {};
}

/****XNFR-317****/
openSendTestEmailModalPopup(emailTemplate:any){
  this.selectedEmailTemplateId = emailTemplate.id;
  this.sendTestEmailIconClicked = true;
}

sendTestEmailModalPopupEventReceiver(){
  this.selectedEmailTemplateId = 0;
  this.sendTestEmailIconClicked = false;
}


callFolderListViewEmitter(){
  if(this.folderListView){
      this.exportObject['categoryId'] = this.categoryId;
      this.exportObject['itemsCount'] = this.pagination.totalRecords;	
      this.updatedItemsCountEmitter.emit(this.exportObject);
  }
}


}


