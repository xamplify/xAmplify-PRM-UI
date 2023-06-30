import { Component, OnInit, OnDestroy, Renderer } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmailTemplateService } from '../services/email-template.service';
import { PagerService } from '../../core/services/pager.service';
import { ReferenceService } from '../../core/services/reference.service';
import { UserService } from '../../core/services/user.service';
import { Pagination } from '../../core/models/pagination';
import { EmailTemplate } from '../models/email-template';
import { EmailTemplateType } from '../../email-template/models/email-template-type';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CustomResponse } from '../../common/models/custom-response';
import { ActionsDescription } from '../../common/models/actions-description';
import { CampaignAccess } from 'app/campaigns/models/campaign-access';
import { SortOption } from '../../core/models/sort-option';
import { ModulesDisplayType } from 'app/util/models/modules-display-type';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { UtilService } from '../../core/services/util.service';

declare var $, swal: any;

@Component({
	selector: 'app-manage-template',
	templateUrl: './manage-template.component.html',
	styleUrls: ['./manage-template.component.css', '../../../assets/css/video-css/ribbons.css'],
	providers: [Pagination, HttpRequestLoader, ActionsDescription, CampaignAccess, SortOption]
})
export class ManageTemplateComponent implements OnInit, OnDestroy {
	isPreview = false;
	emailTemplate: EmailTemplate;
	emailPreview: string;
	hasEmailTemplateRole = false;
	hasAllAccess = false;
	pager: any = {};
	pagedItems: any[];
	searchKey = "";
	isEmailTemplateDeleted = false;
	isCampaignEmailTemplate = false;
	selectedEmailTemplateName = "";
	selectedTemplateTypeIndex = 0;
	isOnlyPartner = false;
	isPartnerToo = false;
	ngxloading: boolean;
	templatesDropDown = [
		{ 'name': 'All Templates', 'value': '' },
		{ 'name': 'Uploaded Regular Templates', 'value': 'regularTemplate' },
		{ 'name': 'Uploaded Video Templates', 'value': 'videoTemplate' },
		{ 'name': 'Regular Templates', 'value': 'beeRegularTemplate' },
		{ 'name': 'Video Templates', 'value': 'beeVideoTemplate' }
	];

	sortByDropDown = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Name (A-Z)', 'value': 'name-ASC' },
		{ 'name': 'Name (Z-A)', 'value': 'name-DESC' },
		// { 'name': 'Company Name (A-Z)', 'value': 'company-ASC' },
		// { 'name': 'Company Name (Z-A)', 'value': 'company-DESC' },
		{ 'name': 'Created On (ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On (DESC)', 'value': 'createdTime-DESC' }
	];

	numberOfItemsPerPage = [
		{ 'name': '12', 'value': '12' },
		{ 'name': '24', 'value': '24' },
		{ 'name': '48', 'value': '48' },
		{ 'name': 'All', 'value': '0' },
	]

	selectedTemplate: any = this.templatesDropDown[0];
	selectedSortedOption: any = this.sortByDropDown[this.sortByDropDown.length - 1];
	itemsSize: any = this.numberOfItemsPerPage[0];
	message: string;
	loggedInUserId: number = 0;
	httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
	customResponse: CustomResponse = new CustomResponse();
	isListView: boolean = false;
	isFolderGridView: boolean = false;
	isGridView: boolean = false;
	categoryId: number = 0;
	exportObject: any = {};
	modulesDisplayType = new ModulesDisplayType();
	vanityLoginDto: VanityLoginDto = new VanityLoginDto();
	loggedInAsSuperAdmin = false;
	saveAsDefaultTemplate = false;
	defaultTemplateInput = {};
	/**XNFR-317*****/
	selectedEmailTemplateId = 0;
	sendTestEmail = false;


	constructor(private emailTemplateService: EmailTemplateService, private router: Router,
		private pagerService: PagerService, public refService: ReferenceService, public actionsDescription: ActionsDescription,
		public pagination: Pagination, public authenticationService: AuthenticationService, private logger: XtremandLogger,
		public campaignAccess: CampaignAccess, public renderer: Renderer, public userService: UserService, private route: ActivatedRoute, public utilService: UtilService) {
		this.refService.renderer = this.renderer;
		this.loggedInUserId = this.authenticationService.getUserId();
		this.loggedInAsSuperAdmin = this.utilService.isLoggedInFromAdminPortal();
		this.isPartnerToo = this.authenticationService.checkIsPartnerToo();
		if (refService.isCreated) {
			this.message = "Template created successfully";
			this.showMessageOnTop(this.message);
		} else if (refService.isUpdated) {
			this.message = "Template updated successfully";
			this.showMessageOnTop(this.message);
		}
		this.hasAllAccess = this.refService.hasAllAccess();
		this.hasEmailTemplateRole = this.refService.hasSelectedRole(this.refService.roles.emailTemplateRole);
		this.isOnlyPartner = this.authenticationService.isOnlyPartner();
		this.modulesDisplayType = this.refService.setDefaultDisplayType(this.modulesDisplayType);
		if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
			this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
			this.vanityLoginDto.userId = this.loggedInUserId;
			this.vanityLoginDto.vanityUrlFilter = true;
		}
	}
	showMessageOnTop(message: string) {
		$(window).scrollTop(0);
		this.customResponse = new CustomResponse('SUCCESS', message, true);
	}


	listEmailTemplates(pagination: Pagination) {
		this.refService.loading(this.httpRequestLoader, true);
		pagination.searchKey = this.searchKey;
		pagination.showDraftContent = true;
		if (this.vanityLoginDto.vanityUrlFilter) {
			this.pagination.vanityUrlFilter = this.vanityLoginDto.vanityUrlFilter;
			this.pagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
		}
		this.emailTemplateService.listTemplates(pagination, this.loggedInUserId)
			.subscribe(
				(data: any) => {
					pagination.totalRecords = data.totalRecords;
					pagination = this.pagerService.getPagedItems(pagination, data.emailTemplates);
					this.refService.loading(this.httpRequestLoader, false);
				},
				(error: string) => {
					this.logger.errorPage(error);
				}
			);
	}

	setPage(event: any) {
		try {
			this.pagination.pageIndex = event.page;
			this.listEmailTemplates(this.pagination);
		} catch (error) {
			this.refService.showError(error, "setPage", "ManageTemplatesComponent")
		}
	}



	searchTemplates() {
		try {
			this.getAllFilteredResults(this.pagination);

		} catch (error) {
			this.refService.showError(error, "searchTemplates", "ManageTemplatesComponent")
		}

	}

	getAllFilteredResults(pagination: Pagination) {
		try {
			this.pagination.pageIndex = 1;
			this.pagination.searchKey = this.searchKey;
			let sortedValue = this.selectedSortedOption.value;
			if (sortedValue != "") {
				let options: string[] = sortedValue.split("-");
				this.pagination.sortcolumn = options[0];
				this.pagination.sortingOrder = options[1];
			}

			if (this.itemsSize.value == 0) {
				this.pagination.maxResults = this.pagination.totalRecords;
			} else {
				this.pagination.maxResults = this.itemsSize.value;
			}
			this.pagination.pagedItems.length = 0;
			this.listEmailTemplates(this.pagination);
		} catch (error) {
			this.logger.error(this.refService.errorPrepender + " getAllFilteredResults():" + error);
			this.refService.showServerError(this.httpRequestLoader);
		}
	}


	getSortedResult(text: any) {
		try {
			this.selectedSortedOption = text;
			this.getAllFilteredResults(this.pagination);
		} catch (error) {
			this.refService.showError(error, "getSortedResult", "ManageTemplatesComponent");
		}

	}

	getNumberOfItemsPerPage(items: any) {
		try {
			this.itemsSize = items;
			this.getAllFilteredResults(this.pagination);
		} catch (error) {
			this.refService.showError(error, "getNumberOfItemsPerPage", "ManageTemplatesComponent");
		}
	}
	edit(id: number) {
		this.emailTemplateService.getById(id)
			.subscribe(
				(data: EmailTemplate) => {
					this.emailTemplateService.emailTemplate = data;
					//this.router.navigate( ["/home/emailtemplates/update"] );
					if (data.source.toString() === "MARKETO" || data.source.toString() === "HUBSPOT") {
						this.navigateToEditPage();
					} else {
						if (data.regularTemplate || data.videoTemplate) {
							this.navigateToEditPage();
						} else {
							this.emailTemplateService.isNewTemplate = false;
							if (this.categoryId > 0) {
								this.router.navigate(["/home/emailtemplates/edit/" + this.categoryId]);
							} else {
								this.router.navigate(["/home/emailtemplates/edit"]);
							}
						}
					}

				},
				(error: string) => {
					this.logger.error(this.refService.errorPrepender + " edit():" + error);
					this.refService.showServerError(this.httpRequestLoader);
				}
			);

	}

	navigateToEditPage() {
		if (this.categoryId > 0) {
			this.router.navigate(["/home/emailtemplates/update/" + this.categoryId]);
		} else {
			this.router.navigate(["/home/emailtemplates/update"]);
		}
	}

	eventHandler(keyCode: any) { if (keyCode === 13) { this.searchTemplates(); } }
	getOrgCampaignTypes() {
		this.refService.getOrgCampaignTypes(this.refService.companyId).subscribe(
			data => {
				this.campaignAccess.videoCampaign = data.video;
				this.campaignAccess.emailCampaign = data.regular;
				this.campaignAccess.socialCampaign = data.social;
				this.campaignAccess.eventCampaign = data.event;
				this.campaignAccess.formBuilder = data.form;
			});
	}
	getCompanyIdByUserId() {
		try {
			this.refService.getCompanyIdByUserId(this.authenticationService.user.id).subscribe(
				(result: any) => {
					if (result !== "") {
						this.refService.companyId = result;
						this.getOrgCampaignTypes();
					}
				}, (error: any) => { console.log(error); }
			);
		} catch (error) { console.log(error); }
	}
	ngOnInit() {
		this.selectedSortedOption = this.sortByDropDown[0];
		try {
			if (!this.refService.companyId) {
				this.getCompanyIdByUserId()
			} else {
				this.getOrgCampaignTypes();
			}
			if (this.router.url.endsWith('manage/')) {
				this.setViewType('Folder-Grid');
			} else {
				this.pagination.maxResults = 12;
				this.categoryId = this.route.snapshot.params['categoryId'];
				if (this.categoryId != undefined) {
					this.pagination.categoryId = this.categoryId;
					this.pagination.categoryType = 'e';
				}
				let showList = this.modulesDisplayType.isListView || this.modulesDisplayType.isGridView || this.categoryId != undefined;
				if (showList) {
					if (!this.modulesDisplayType.isListView && !this.modulesDisplayType.isGridView) {
						this.modulesDisplayType.isListView = true;
						this.modulesDisplayType.isGridView = false;
					}
					this.modulesDisplayType.isFolderListView = false;
					this.modulesDisplayType.isFolderGridView = false;
					this.listEmailTemplates(this.pagination);
				} else if (this.modulesDisplayType.isFolderGridView) {
					this.setViewType('Folder-Grid');
				} else if (this.modulesDisplayType.isFolderListView) {
					this.setViewType('Folder-List');
				}

			}


		} catch (error) {
			this.refService.showError(error, "ngOnInit", "ManageTemplatesComponent");
		}

	}



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
			this.logger.error(this.refService.errorPrepender + " confirmDeleteEmailTemplate():" + error);
			this.refService.showServerError(this.httpRequestLoader);
		}

	}

	deleteEmailTemplate(id: number, name: string) {
		this.refService.loading(this.httpRequestLoader, true);
		this.refService.goToTop();
		this.isEmailTemplateDeleted = false;
		this.isCampaignEmailTemplate = false;
		this.emailTemplateService.delete(id)
			.subscribe(
				(data: any) => {
					if (data.access) {
						let message = data.message;
						if (message == "Success") {
							this.refService.showInfo("Email Template Deleted Successfully", "");
							this.selectedEmailTemplateName = name + ' deleted successfully';
							this.customResponse = new CustomResponse('SUCCESS', this.selectedEmailTemplateName, true);
							this.isEmailTemplateDeleted = true;
							this.isCampaignEmailTemplate = false;
							this.pagination.pageIndex = 1;
							this.listEmailTemplates(this.pagination);
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
							this.refService.loading(this.httpRequestLoader, false);
						}
					} else {
						this.authenticationService.forceToLogout();
					}

				},
				(error: string) => {
					this.logger.errorPage(error);
					this.refService.showServerError(this.httpRequestLoader);
				}
			);
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
		this.listEmailTemplates(this.pagination);
	}


	ngOnDestroy() {
		this.refService.isCreated = false;
		this.refService.isUpdated = false;
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
						body = body.replace(value, self.authenticationService.MEDIA_URL + self.refService.companyProfileImage);
					});
					body = body.replace("https://xamp.io/vod/replace-company-logo.png", this.authenticationService.MEDIA_URL + this.refService.companyProfileImage);
					let emailTemplateName = emailTemplate.name;
					if (emailTemplateName.length > 50) {
						emailTemplateName = emailTemplateName.substring(0, 50) + "...";
					}
					$("#htmlContent").empty();
					$("#email-template-title").empty();
					$("#email-template-title").append(emailTemplateName);
					$('#email-template-title').prop('title', emailTemplate.name);

					if (this.refService.hasMyMergeTagsExits(body)) {
						let data = {};
						data['emailId'] = this.authenticationService.user.emailId;
						this.refService.getMyMergeTagsInfoByEmailId(data).subscribe(
							response => {
								if (response.statusCode == 200) {
									body = this.refService.replaceMyMergeTags(response.data, body);
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
			this.modulesDisplayType.isFolderGridView = true;
			this.modulesDisplayType.isFolderListView = false;
			this.exportObject['type'] = 1;
			this.exportObject['folderType'] = viewType;
			if (this.categoryId > 0) {
				this.router.navigateByUrl('/home/emailtemplates/manage/');
			}

		} else if ("Folder-List" == viewType) {
			this.modulesDisplayType.isListView = false;
			this.modulesDisplayType.isGridView = false;
			this.modulesDisplayType.isFolderGridView = false;
			this.modulesDisplayType.isFolderListView = true;
			this.exportObject['folderType'] = viewType;
			this.exportObject['type'] = 1;

		}
	}



	navigateToManageSection(viewType: string) {
		if ("List" == viewType && (this.categoryId == undefined || this.categoryId == 0)) {
			this.modulesDisplayType.isListView = true;
			this.modulesDisplayType.isGridView = false;
			this.modulesDisplayType.isFolderGridView = false;
			this.modulesDisplayType.isFolderListView = false;
			this.listEmailTemplates(this.pagination);
		} else if ("Grid" == viewType && (this.categoryId == undefined || this.categoryId == 0)) {
			this.modulesDisplayType.isGridView = true;
			this.modulesDisplayType.isFolderGridView = false;
			this.modulesDisplayType.isFolderListView = false;
			this.modulesDisplayType.isListView = false;
			this.listEmailTemplates(this.pagination);
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
			this.listEmailTemplates(this.pagination);
		} else if (this.router.url.endsWith('manage/')) {
			this.router.navigateByUrl('/home/emailtemplates/manage');
		}
	}


	getUpdatedValue(event: any) {
		let viewType = event.viewType;
		if (viewType != undefined) {
			this.setViewType(viewType);
		}

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
		this.sendTestEmail = true;
	}
	


}
