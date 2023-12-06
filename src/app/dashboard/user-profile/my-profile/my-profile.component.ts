import { SweetAlertParameterDto } from './../../../common/models/sweet-alert-parameter-dto';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Renderer } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { matchingPasswords, noWhiteSpaceValidator } from '../../../form-validator';
import { UserService } from '../../../core/services/user.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../../core/services/reference.service';
import { VideoUtilService } from '../../../videos/services/video-util.service';
import { CallActionSwitch } from '../../../videos/models/call-action-switch';
import { CustomResponse } from '../../../common/models/custom-response';
import { Properties } from '../../../common/models/properties';
import { RegularExpressions } from '../../../common/models/regular-expressions';
import { User } from '../../../core/models/user';
import { DefaultVideoPlayer } from '../../../videos/models/default-video-player';
import { CountryNames } from '../../../common/models/country-names';
import { VideoFileService } from '../../../videos/services/video-file.service'
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';
import { UtilService } from 'app/core/services/util.service';

import { DealQuestions } from '../../../deal-registration/models/deal-questions';
import { DealForms } from '../../../deal-registration/models/deal-forms';
import { DealType } from '../../../deal-registration/models/deal-type';
import { DealRegistrationService } from '../../../deal-registration/services/deal-registration.service';
import { DashboardService } from '../../dashboard.service';
import { HubSpotService } from 'app/core/services/hubspot.service';
import { GdprSetting } from '../../models/gdpr-setting';

import { HttpRequestLoader } from '../../../core/models/http-request-loader';
import { IntegrationService } from 'app/core/services/integration.service';
import { Category } from '../../models/category';
import { CategoryPreviewItem } from '../../models/category-preview-item';

import { Pagination } from 'app/core/models/pagination';
import { SortOption } from '../../../core/models/sort-option';
import { PagerService } from '../../../core/services/pager.service';
import { ModulesDispalyType } from "app/dashboard/models/modules-dispaly-type.enum";
import { TranslateService } from '@ngx-translate/core';
import { VanityEmailTempalte } from 'app/email-template/models/vanity-email-template';

import { SocialPagerService } from '../../../contacts/services/social-pager.service';
import { PaginationComponent } from '../../../common/pagination/pagination.component';

import { DragulaService } from 'ng2-dragula';
import { Pipeline } from '../../models/pipeline';
import { PipelineStage } from '../../models/pipeline-stage';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { ExcludeUser } from "../../models/exclude-user";
import { FileUtil } from '../../../core/models//file-util';
import { Dimensions, ImageTransform } from 'app/common/image-cropper-v2/interfaces';
import { base64ToFile } from 'app/common/image-cropper-v2/utils/blob.utils';
import { ImageCroppedEvent } from 'app/common/image-cropper/interfaces/image-cropped-event.interface';
import { CustomSkin } from 'app/dashboard/models/custom-skin';
import { ThemePropertiesListWrapper } from 'app/dashboard/models/theme-properties-list-wrapper';
import { ThemeDto } from 'app/dashboard/models/theme-dto';
import { CompanyThemeActivate } from 'app/dashboard/models/company-theme-activate';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { LeftsidenavbarCustomComponent } from 'app/dashboard/leftsidenavbar-custom/leftsidenavbar-custom.component';
import { CustomLoginTemplate } from 'app/email-template/models/custom-login-template';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { CompanyLoginTemplateActive } from 'app/email-template/models/company-login-template-active';
import { CompanyProfileService } from 'app/dashboard/company-profile/services/company-profile.service';

declare var swal, $, videojs: any, Papa: any;

@Component({
	selector: 'app-my-profile',
	templateUrl: './my-profile.component.html',
	styleUrls: ['./my-profile.component.css', '../../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
		'../../../../assets/admin/pages/css/profile.css', '../../../../assets/css/video-css/video-js.custom.css',
		'../../../../assets/css/phone-number-plugin.css'],
	providers: [FileUtil, User, DefaultVideoPlayer, CallActionSwitch, Properties, RegularExpressions, CountryNames, HttpRequestLoader, SortOption, PaginationComponent],
})
export class MyProfileComponent implements OnInit, AfterViewInit, OnDestroy {

	csvExcludeUsersFilePreview: boolean = false;
	csvExcludeDomainsFilePreview: boolean = false;
	isListLoader = false;
	isPartnerSuperVisor: boolean = false;
	public searchExcludedUserKey: string = null;
	public searchExcludedDomainKey: string = null;
	domain: string;
	validEmailFormat = true;
	validEmailPatternSuccess: boolean = true;
	isEmailExist: boolean = false;
	validEmailPattern: boolean = false;
	isDomainExist: boolean = false;
	validDomainFormat: boolean = true;
	validDomainPattern: boolean = false;
	addContactuser: User = new User();
	defaultVideoPlayer: DefaultVideoPlayer;
	tempDefaultVideoPlayerSettings: any;
	videoJSplayer: any;
	videoUrl: string;
	updatePasswordForm: FormGroup;
	defaultPlayerForm: FormGroup;
	status = true;
	updatePasswordSuccess = false;
	profileUploadSuccess = false;
	userProfileImage = "assets/images/icon-user-default.png";
	userData: User;
	parentModel = { 'displayName': '', 'profilePicutrePath': 'assets/images/icon-user-default.png' };
	className = "form-control ng-touched ng-dirty ng-valid";
	compPlayerColor: string;
	compControllerColor: string;
	valueRange: number;
	profilePictueError = false;
	profilePictureErrorMessage = "";
	active = false;
	isPlayed = false;
	hasVideoRole = false;
	loggedInUserId = 0;
	tempPlayerColor: string;
	tempControllerColor: string;
	isPlayerSettingUpdated = false;
	hasAllAccess = false;
	hasCompany: boolean;
	orgAdminCount = 0;
	infoMessage = "";
	currentUser: any;
	roles: string[] = [];
	isOnlyPartnerRole = false;
	logoImageUrlPath: string;
	fullScreenMode = false;
	logoLink = '';
	ngxloading: boolean;
	roleNames = "";
	customResponse: CustomResponse = new CustomResponse();
	hasClientErrors = false;

	dealForms: DealForms[] = [];
	form = new DealForms();
	questions: DealQuestions[] = [];
	question: DealQuestions;
	dealtype: DealType;
	dealtypes: DealType[] = [];
	formSubmiteState = true;
	dealSubmiteState = true;
	submitButtonText = "Save Form";
	dealButtonText = "Save Deals";
	validateForm: boolean;
	selectedForm: DealForms;
	defaultQuestions: string[] = ["Campaign Name", "Company", "First Name", "Last Name", "Title ", "Email ", "Phone Number", "Deal Type", "Website", "Lead Address",
		"Lead City", "Lead State/Province", "Lead Postal Code", "Lead Country", "Opportunity Amount", "Estimated Close date"];
	isListFormSection: boolean;
	customResponseForm: CustomResponse = new CustomResponse();


	circleCropperSettings: CropperSettings;
	circleData: any;
	cropRounded = false;
	loadingcrop = false;
	errorUploadCropper = false;
	integrationTabIndex = 0;
	@ViewChild(ImageCropperComponent) cropper: ImageCropperComponent;
	integrateRibbonText: string;

	hubSpotRibbonText: string;
	hubSpotRedirectURL: string;
	activeTabName: string = "";
	activeTabHeader: string = "";
	sfRibbonText: string;
	sfRedirectURL: string;
	/*****************GDPR************************** */
	gdprSetting: GdprSetting = new GdprSetting();
	excludeUserCustomResponse: CustomResponse = new CustomResponse();
	filePreviewexcludeUserCustomResponse: CustomResponse = new CustomResponse();
	excludeDomainCustomResponse: CustomResponse = new CustomResponse();
	gdprCustomResponse: CustomResponse = new CustomResponse();
	gdprSettingLoaded = false;
	category: Category = new Category();
	categoryPagination: Pagination = new Pagination();
	categorySortOption: SortOption = new SortOption();
	isAddCategory = false;
	categoryModalTitle = "Enter Folder Details";
	formErrorClass = "form-group form-error";
	defaultFormClass = "form-group";
	categoryNameErrorMessage = "";
	requiredMessage = "Required";
	duplicateLabelMessage = "Already exists";
	addCategoryLoader: HttpRequestLoader = new HttpRequestLoader();
	categoryResponse: CustomResponse = new CustomResponse();
	existingCategoryNames: string[] = [];
	existingCategoryName: any;
	categoyButtonSubmitText = "Save";
	categoryNames: string[] = [];
	isDeleteCategory: any;
	selectedCategoryIdForTransferItems = 0;
	exisitingCategories = new Array<Category>();
	isOnlyPartner = false;
	isPartnerTeamMember = false;
	isFolderPreview = false;
	folderPreviewLoader: HttpRequestLoader = new HttpRequestLoader();
	hasItems = false;
	categoryPreviewItem = new CategoryPreviewItem();
	ModuleDisplayTypeEnum = ModulesDispalyType;
	modulesDisplayTypeString = ModulesDispalyType[ModulesDispalyType.LIST];
	modulesDisplayTypeError = false;
	modulesDisplayTypeList = [];
	modulesDisplayViewcustomResponse: CustomResponse = new CustomResponse();
	updateDisplayViewError = false;

	isUser = false;

	preferredLangFilePath: string;
	languagesList: any = [];
	preferredLanguage: string;
	editXamplifyDefaultTemplate = false;
	xamplifyDefaultTemplate: VanityEmailTempalte;
	customLoginTemplate: CustomLoginTemplate;
	subjectLineTooltipText: string;
	isMarketoProcess: boolean;

	sfCustomFieldsResponse: any;
	selectedCustomFieldIds = [];
	customFieldsResponse: CustomResponse = new CustomResponse();
	sfcfPager: any = {};
	sfcfPagedItems: any[];
	pageSize: number = 12;
	pageNumber: any;
	sfcfMasterCBClicked = false;
	selectedCfIds = [];
	paginatedSelectedIds = [];
	isHeaderCheckBoxChecked: boolean = false;
	requiredCfIds = [];

	pipelineModalTitle = "Add a Pipeline";
	pipelineResponse: CustomResponse = new CustomResponse();
	pipelineModalResponse: CustomResponse = new CustomResponse();
	addPipelineLoader: HttpRequestLoader = new HttpRequestLoader();
	pipeline: Pipeline = new Pipeline();
	defaultStageIndex: number = 0;
	pipelineType: string = 'LEAD';
	//pipelines = [];
	pipelinePagination: Pagination = new Pagination();
	pipelineSortOption: SortOption = new SortOption();
	pipelineNameErrorMessage = "";
	pipelineStageErrorMessage = "";
	requiredStageMessage = "Required atleast one valid stage.";
	pipelinePreview = false;
	excludeUserPagination: Pagination = new Pagination();
	excludeDomainPagination: Pagination = new Pagination();
	csvUserPagination: Pagination = new Pagination();
	csvDomainPagination: Pagination = new Pagination();
	excludeUsersOrDomains = false;
	customSkinSettingOption = false;
	modalpopuploader = false;
	isUpdateUser = false;
	/*******************VANITY******************* */
	loggedInThroughVanityUrl = false;
	public hubSpotCurrentUser: any;

	excludedUsers: User[] = [];
	excludedDomains: string[] = [];
	csvUsersPager: any = {};
	csvDomainsPager: any = {};
	showUnsubscribeReasonsDiv = false;
	showTeamMemberGroups = false;
	showNotifyPartnersOption = false;
	excludeUserLoader: HttpRequestLoader = new HttpRequestLoader();
	excludeDomainLoader: HttpRequestLoader = new HttpRequestLoader();
	microsoftRibbonText: string;
	microsoftRedirectURL: any;
	isUpgrading = false;
	sweetAlertParameterDto: SweetAlertParameterDto = new SweetAlertParameterDto();
	isUpgradedRequestSubmitted = false;
	activeCRMDetails: any;
	integrationType: string = "";
	containWithinAspectRatio = false;
	transform: ImageTransform = {};
	scale = 1;
	canvasRotation = 0;
	rotation = 0;
	imageChangedEvent: any = '';
	croppedImage: any = '';
	showCropper = false;

	// XNFR-215
	pipedriveRibbonText: string;
	/****XNFR-224****/
	loginAsPartnerOptionEnabledForVendor = false;
	supportSettingCustomResponse: CustomResponse = new CustomResponse();
	loginAsPartnerEmailNotification = false;
	showSupportSettingOption = false;
	isLoggedInAsPartner = false;
	/****XNFR-224****/
	/**** XNFR-238*** */
	customSkinDto: CustomSkin = new CustomSkin();
	selectedThemeIndex: number = 0;
	themeResponse: CustomResponse = new CustomResponse();
	themeDto: ThemeDto = new ThemeDto();
	themeData: ThemePropertiesListWrapper = new ThemePropertiesListWrapper();
	themeNames: string = '';
	dummyData = this.properties.serverErrorMessage;
	statusCode: any;
	saveAlert: boolean = false;
	activeThemeDetails: CompanyThemeActivate = new CompanyThemeActivate();
	themeDtoList: ThemeDto[];
	defaultThemes: ThemeDto[];
	isNoThemes: boolean = false;
	vanityLoginDto: VanityLoginDto = new VanityLoginDto();
	/*** XNFR-238******/
	searchWithModuleName: any;
	showTemplates = false;
	/****XNFR-326*****/
	showEmailNotificationSettingsOption = false;
	showSpfConfigurationDiv: boolean;
	/***XNFR-386***/
	isCustomLoginScreenSettingsOptionClicked = false;
	customLoginTemplateResponse: CustomResponse = new CustomResponse();
	// XNFR-403
	connectwiseRibbonText: string;
	isLocalHost = false;


	constructor(public videoFileService: VideoFileService, public socialPagerService: SocialPagerService, public paginationComponent: PaginationComponent, public countryNames: CountryNames, public fb: FormBuilder, public userService: UserService, public authenticationService: AuthenticationService,
		public logger: XtremandLogger, public referenceService: ReferenceService, public videoUtilService: VideoUtilService,
		public router: Router, public callActionSwitch: CallActionSwitch, public properties: Properties,
		public regularExpressions: RegularExpressions, public route: ActivatedRoute, public utilService: UtilService, public dealRegSevice: DealRegistrationService, private dashBoardService: DashboardService,
		private hubSpotService: HubSpotService, private dragulaService: DragulaService, public httpRequestLoader: HttpRequestLoader, private integrationService: IntegrationService, public pagerService:
			PagerService, public refService: ReferenceService, private renderer: Renderer, private translateService: TranslateService, private vanityUrlService: VanityURLService, private fileUtil: FileUtil, private httpClient: Http, private companyProfileService: CompanyProfileService) {
		this.loggedInThroughVanityUrl = this.vanityUrlService.isVanityURLEnabled();
		this.isLocalHost = this.authenticationService.isLocalHost();
		this.isLoggedInAsPartner = this.utilService.isLoggedAsPartner();
		this.referenceService.renderer = this.renderer;
		this.isUser = this.authenticationService.isOnlyUser();
		this.pageNumber = this.paginationComponent.numberPerPage[0];
		dragulaService.setOptions('pipelineStagesDragula', {})
		dragulaService.dropModel.subscribe((value) => {
			this.onDropModel(value);
		});
	}
	private onDropModel(args) {
	}

	toggleContainWithinAspectRatio() {
		if (this.croppedImage != '') {
			this.containWithinAspectRatio = !this.containWithinAspectRatio;
		} else {
			this.showCropper = false;
		}
	}
	zoomOut() {
		if (this.croppedImage != "") {
			this.scale -= .1;
			this.transform = {
				...this.transform,
				scale: this.scale
			};
		} else {
			//this.errorUploadCropper = true;
			this.showCropper = false;
		}
	}

	zoomIn() {
		if (this.croppedImage != '') {
			this.scale += .1;
			this.transform = {
				...this.transform,
				scale: this.scale
			};

		} else {
			this.showCropper = false;
			//  this.errorUploadCropper = true;
		}
	}
	resetImage() {
		if (this.croppedImage != '') {
			this.scale = 1;
			this.rotation = 0;
			this.canvasRotation = 0;
			this.transform = {};
		} else {
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
		console.log('Image loaded')
	}
	cropperReady(sourceImageDimensions: Dimensions) {
		console.log('Cropper ready', sourceImageDimensions);
	}
	loadImageFailed() {
		console.log('Load failed');
	}

	cropperSettings() {
		this.circleCropperSettings = this.utilService.cropSettings(this.circleCropperSettings, 200, 156, 200, true);
		this.circleCropperSettings.noFileInput = true;
		this.circleData = {};
	}
	isEmpty(obj) {
		return Object.keys(obj).length === 0;
	}
	closeModal() {
		this.cropRounded = !this.cropRounded;
		this.circleData = {};
		this.imageChangedEvent = null;
		this.croppedImage = '';
	}
	fileChangeEvent() { this.cropRounded = false; $('#cropProfileImage').modal('show'); }
	uploadProfileImage() {
		if (this.croppedImage != "") {
			this.loadingcrop = true;
			let fileObj: any;
			fileObj = this.utilService.convertBase64ToFileObject(this.croppedImage);
			fileObj = this.utilService.blobToFile(fileObj);
			this.fileUploadCode(fileObj);
		} else {
			this.errorUploadCropper = false;
			this.showCropper = false;
		}

	}
	fileUploadCode(fileObj: File) {
		this.userService.saveUserProfileLogo(fileObj).subscribe(
			(response: any) => {
				const imageFilePath = response;
				this.userProfileImage = this.parentModel.profilePicutrePath = imageFilePath['message'];
				this.profileUploadSuccess = true;
				this.referenceService.topNavBarUserDetails.profilePicutrePath = imageFilePath['message'];
				this.authenticationService.userProfile.profileImagePath = imageFilePath['message'];
				this.loadingcrop = false;
				this.customResponse = new CustomResponse('SUCCESS', this.properties.PROFILE_PIC_UPDATED, true);
				$('#cropProfileImage').modal('hide');
				this.closeModal();
			},
			(error) => { console.log(error); $('#cropProfileImage').modal('hide'); this.customResponse = new CustomResponse('ERROR', this.properties.SOMTHING_WENT_WRONG, true); },
			() => { this.loadingcrop = false; $('#cropProfileImage').modal('hide'); });
	}
	fileChangeListener($event, cropperComp: ImageCropperComponent) {
		this.cropper = cropperComp;
		const image: any = new Image();
		const file: File = $event.target.files[0];
		const isSupportfile: any = file.type;
		if (isSupportfile === 'image/jpg' || isSupportfile === 'image/jpeg' || isSupportfile === 'image/png') {
			this.errorUploadCropper = false;
			this.imageChangedEvent = event;
			const myReader: FileReader = new FileReader();
			const that = this;
			myReader.onloadend = function (loadEvent: any) {
				image.src = loadEvent.target.result;
				that.cropper.setImage(image);
			};
			myReader.readAsDataURL(file);
		} else { this.errorUploadCropper = true; }
	}
	videojsCall() {
		this.customResponse = new CustomResponse();
		if (!this.videoJSplayer && !this.isOnlyPartnerRole) {
			const self = this;
			const overrideNativeValue = this.referenceService.getBrowserInfoForNativeSet();
			this.videoJSplayer = videojs(document.getElementById('profile_video_player'),
				{
					playbackRates: [0.5, 1, 1.5, 2],
					html5: {
						hls: {
							overrideNative: overrideNativeValue
						},
						nativeVideoTracks: !overrideNativeValue,
						nativeAudioTracks: !overrideNativeValue,
						nativeTextTracks: !overrideNativeValue
					}
				},
				{ "controls": true, "autoplay": false, "preload": "auto" },
				function () {
					const document: any = window.document;
					this.ready(function () {
						$('.vjs-big-play-button').css('display', 'block');
						self.isPlayed = false;
					});
					this.on('play', function () {
						self.isPlayed = true;
						$('.vjs-big-play-button').css('display', 'none');
					});
					this.on('pause', function () {
						self.isPlayed = true;
						$('.vjs-big-play-button').css('display', 'none');
					});
					this.on('fullscreenchange', function () {
						const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
						const event = state ? 'FullscreenOn' : 'FullscreenOff';
						if (event === 'FullscreenOn') {
							self.fullScreenMode = true;
							$('#profile_video_player').append($('#overlay-logo').show());
						} else if (event === 'FullscreenOff') {
							self.fullScreenMode = false;
						}
					});
				});
			this.videoUtilService.setDefaultPlayBackRateText();
			this.defaultVideoSettings();
			this.defaulttransperancyControllBar(this.referenceService.defaultPlayerSettings.transparency);
			if (!this.referenceService.defaultPlayerSettings.enableVideoController) { this.defaultVideoControllers(); }
			setTimeout(() => { this.videoJSplayer.play(); this.videoJSplayer.pause(); }, 1);
		} else {
			this.logger.log('you already initialized the videojs');
		}
	}
	imageUpload(event) { $('#' + event).click(); }
	clearCustomResponse() { this.customResponse = new CustomResponse(); }
	errorHandler(event: any) { event.target.src = 'assets/images/icon-user-default.png'; }
	customConstructorCall() {
		if (this.isEmpty(this.authenticationService.userProfile.roles) || !this.authenticationService.userProfile.profileImagePath) {
			this.router.navigateByUrl(this.referenceService.homeRouter);
		}
		try {
			if (this.authenticationService.isSuperAdmin()) {
				this.userData = this.authenticationService.venorMyProfileReport;
			} else {
				this.userData = this.authenticationService.userProfile;
			}
			this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
			this.getUserByUserName(this.currentUser.userName);
			this.cropperSettings();
			this.videoUtilService.videoTempDefaultSettings = this.referenceService.defaultPlayerSettings;
			this.loggedInUserId = this.authenticationService.getUserId();
			/**** show themes to partner ***/
			this.vanityLoginDto.userId = this.loggedInUserId;
			let companyProfileName = this.authenticationService.companyProfileName;
			if (companyProfileName !== undefined && companyProfileName !== "") {
				this.vanityLoginDto.vendorCompanyProfileName = companyProfileName;
				this.vanityLoginDto.vanityUrlFilter = true;
			} else {
				this.vanityLoginDto.vanityUrlFilter = false;
			}
			/**** show themes to partner in vanity***/
			this.hasAllAccess = this.referenceService.hasAllAccess();
			this.hasVideoRole = this.authenticationService.hasVideoRole();
			if (this.authenticationService.isOrgAdminPartner() || this.authenticationService.isVendorPartner() || this.authenticationService.isVendor() || this.authenticationService.isOrgAdmin()) {
				this.hasVideoRole = false;
			}
			this.hasCompany = this.authenticationService.user.hasCompany;
			this.callActionSwitch.size = 'normal';
			this.videoUrl = this.authenticationService.MEDIA_URL + "profile-video/Birds0211512666857407_mobinar.m3u8";
			if (this.isEmpty(this.userData.roles) || !this.userData.profileImagePath) {
				this.router.navigateByUrl(this.referenceService.homeRouter);
			} else {
				this.parentModel.displayName = this.userData.firstName ? this.userData.firstName : this.userData.emailId;
				if (!(this.userData.profileImagePath.indexOf(null) > -1)) {
					this.userProfileImage = this.userData.profileImagePath;
					this.parentModel.profilePicutrePath = this.userData.profileImagePath;
				}
			}
			this.initializeForm();
			this.checkIntegrations();
			this.isPartnerSuperVisor = this.authenticationService.module.isPartnerSuperVisor;
		} catch (error) {
			this.hasClientErrors = true;
			this.logger.showClientErrors("my-profile.component.ts", "constructor()", error);
		}
	}

	ngOnInit() {
		try {
			this.searchWithModuleName = 19;
			this.activeTabName = 'personalInfo';
			this.activeTabHeader = this.properties.personalInfo;
			this.customConstructorCall();

			this.geoLocation();
			this.showThemes();
			this.getDefaultThemes()
			this.getActiveThemeData();
			this.videoUtilService.normalVideoJsFiles();
			if (!this.referenceService.isMobileScreenSize()) {
				this.isGridView(this.authenticationService.getUserId());
			}
			else { this.referenceService.isGridView = true; }
			this.getModulesDisplayDefaultView();
			this.validateUpdatePasswordForm();
			this.validateUpdateUserProfileForm();
			this.isOnlyPartner = this.authenticationService.isOnlyPartner();
			this.isPartnerTeamMember = this.authenticationService.isPartnerTeamMember;
			if ((this.currentUser.roles.length > 1 && this.hasCompany) || (this.authenticationService.user.roles.length > 1 && this.hasCompany)) {
				if (!this.authenticationService.isOnlyPartner()) {
					this.getOrgAdminsCount(this.loggedInUserId);
					this.getVideoDefaultSettings();
					this.defaultVideoSettings();
				}
				this.referenceService.isDisabling = false;
				this.status = true;
			} else {
				this.referenceService.isDisabling = true;
				if (this.authenticationService.isCompanyAdded) {
					this.status = true;
				} else {
					this.status = false;
				}
			}
			if (this.authenticationService.vanityURLEnabled) {
				this.setSubjectLineTooltipText();
			}
			this.getRoles();
			this.addDefaultPipelineStages();
			window.addEventListener('message', function (e) {
				window.removeEventListener('message', function (e) { }, true);
				if (e.data == 'isHubSpotAuth') {
					localStorage.setItem('isHubSpotAuth', 'yes');
				}
				else if (e.data == 'isSalesForceAuth') {
					localStorage.setItem('isSalesForceAuth', 'yes');
				}
				else if (e.data == 'isMicrosoftAuth') {
					localStorage.setItem('isMicrosoftAuth', 'yes');
				}
			}, false);
			this.getModuleAccessByUser();
			this.findUpgradeRequest();
			if (this.authenticationService.module.navigateToSPFConfigurationSection) {
				this.activateTab('spf');
			}
		} catch (error) {
			this.hasClientErrors = true;
			this.logger.showClientErrors("my-profile.component.ts", "ngOninit()", error);
			this.authenticationService.logout();
		}
	}

	getModuleAccessByUser() {
		this.ngxloading = true;
		this.dashBoardService.getModulesAccessByUserId().subscribe(result => {
			this.excludeUsersOrDomains = result.excludeUsersOrDomains;
			this.customSkinSettingOption = result.customSkinSettings;
			this.ngxloading = false;
		}, _error => {
			this.ngxloading = false;
		});
	}

	getRoles() {
		this.ngxloading = true;
		this.userService.getRoles(this.authenticationService.getUserId())
			.subscribe(
				response => {
					if (response.statusCode == 200) {
						this.authenticationService.loggedInUserRole = response.data.role;
						this.roleNames = this.authenticationService.loggedInUserRole;
						if (this.authenticationService.vanityURLEnabled && this.authenticationService.vanityURLUserRoles && this.roleNames !== "Team Member") {
							if (this.authenticationService.vanityURLUserRoles.filter(rn => rn.roleId === 13).length !== 0) {
								this.roleNames = "Vendor";
							} else if (this.authenticationService.vanityURLUserRoles.filter(rn => rn.roleId === 2).length !== 0) {
								this.roleNames = "OrgAdmin";
							} else if (this.authenticationService.vanityURLUserRoles.filter(rn => rn.roleId === 18).length !== 0) {
								this.roleNames = "Marketing";
							} else if (this.authenticationService.vanityURLUserRoles.filter(rn => rn.roleId === 20).length !== 0) {
								this.roleNames = "PRM";
							} else if (this.authenticationService.vanityURLUserRoles.filter(rn => rn.roleId === 12).length !== 0) {
								this.roleNames = "Partner";
							}
							/****XBI-1723*****/
							let isLoggedAsPartner = this.utilService.isLoggedAsPartner();
							if (isLoggedAsPartner) {
								let loggedInUserRole = this.authenticationService.loggedInUserRole;
								let isPrm = loggedInUserRole.indexOf("Prm") > -1;
								let isVendor = loggedInUserRole.indexOf("Vendor") > -1;
								let isMarketing = loggedInUserRole.indexOf("Marketing") > -1;
								let isOrgAdmin = loggedInUserRole.indexOf("OrgAdmin") > -1;
								let isAnyAdmin = isPrm || isVendor || isMarketing || isOrgAdmin;
								if (isAnyAdmin) {
									this.roleNames = "Partner";
								}
								/****XBI-1723*****/
							}


						}


					} else {
						this.authenticationService.loggedInUserRole = 'User';
					}
					this.ngxloading = false;
				},
				error => { this.logger.errorPage(error) },
				() => this.logger.log('Finished')
			);

	}

	ngAfterViewInit() {
		try {
			if (this.currentUser.roles.length > 1 && this.authenticationService.hasCompany() && !this.authenticationService.isOnlyPartner()) {
				this.defaultVideoSettings();
				if (this.referenceService.defaultPlayerSettings !== undefined) {
					if (this.referenceService.defaultPlayerSettings.transparency === null) {
						this.referenceService.defaultPlayerSettings.transparency = 100;
						this.referenceService.defaultPlayerSettings.controllerColor = '#456';
						this.referenceService.defaultPlayerSettings.playerColor = '#879';
					}
					this.defaulttransperancyControllBar(this.referenceService.defaultPlayerSettings.transparency);
					if (!this.referenceService.defaultPlayerSettings.enableVideoController) { this.defaultVideoControllers(); }
				}
			}
		} catch (error) {
			this.hasClientErrors = true;
			this.logger.showClientErrors("my-profile.component.ts", "ngAfterViewInit()", error);
		}
	}

	ngAfterViewChecked() {
		let tempCheckHubSpotAuth = localStorage.getItem('isHubSpotAuth');
		let tempCheckSalesForceAuth = localStorage.getItem('isSalesForceAuth');
		let tempCheckMicrosoftAuth = localStorage.getItem('isMicrosoftAuth');
		localStorage.removeItem('isHubSpotAuth');
		localStorage.removeItem('isSalesForceAuth');
		localStorage.removeItem('isMicrosoftAuth');

		if (tempCheckHubSpotAuth == 'yes') {
			this.referenceService.integrationCallBackStatus = true;
			localStorage.removeItem("userAlias");
			localStorage.removeItem("currentModule");
			this.router.navigate(['/home/dashboard/myprofile']);
		}
		else if (tempCheckSalesForceAuth == 'yes') {
			this.referenceService.integrationCallBackStatus = true;
			localStorage.removeItem("userAlias");
			localStorage.removeItem("currentModule");
			this.router.navigate(['/home/dashboard/myprofile']);
		}
		else if (tempCheckMicrosoftAuth == 'yes') {
			this.referenceService.integrationCallBackStatus = true;
			localStorage.removeItem("userAlias");
			localStorage.removeItem("currentModule");
			this.router.navigate(['/home/dashboard/myprofile']);
		}

	}
	getUserByUserName(userName: string) {
		try {
			this.authenticationService.getUserByUserName(userName)
				.subscribe(
					data => {
						this.userData = data;
						/***XBI-1673****/
						this.userData.displayName = this.userData.firstName ? this.userData.firstName : this.userData.emailId;
						/***XBI-1673****/
						this.authenticationService.userProfile = data;
					},
					error => { console.log(error); this.router.navigate(['/su']) },
					() => { }
				);
		} catch (error) { console.log('error' + error); }
	}
	updatePassword() {
		this.ngxloading = true;
		var userPassword = {
			'oldPassword': this.updatePasswordForm.value.oldPassword,
			'newPassword': this.updatePasswordForm.value.newPassword,
			'userId': this.loggedInUserId
		}
		if (this.updatePasswordForm.value.oldPassword === this.updatePasswordForm.value.newPassword) {
			this.customResponse = new CustomResponse('ERROR', 'Your new password cannot be the same as your current password', true);
			this.ngxloading = false;
		} else {
			this.userService.updatePassword(userPassword)
				.subscribe(
					data => {
						const body = data;
						if (body !== "") {
							this.ngxloading = false;
							var response = body;
							var message = response.message;
							if (message == "Wrong Password") {
								this.formErrors['oldPassword'] = message;
								if (this.className == "form-control ng-touched ng-dirty ng-invalid") {
									this.className = "form-control ng-dirty ng-invalid ng-touched";
								} else if (this.className = "form-control ng-dirty ng-invalid ng-touched") {
									this.className = "form-control ng-touched ng-dirty ng-invalid";
								} else {
									this.className = "form-control ng-touched ng-dirty ng-valid";
								}
							} else if (response.message == "Password Updated Successfully") {
								this.ngxloading = false;
								this.customResponse = new CustomResponse('SUCCESS', this.properties.PASSWORD_UPDATED, true);
								this.userData.hasPassword = true;
								this.updatePasswordForm.reset();
							} else {
								this.ngxloading = false;
								this.logger.error(this.referenceService.errorPrepender + " updatePassword():" + data);
							}

						} else {
							this.ngxloading = false;
							this.logger.error(this.referenceService.errorPrepender + " updatePassword():" + data);
						}
					},
					error => {
						this.ngxloading = false;
						this.logger.error(this.referenceService.errorPrepender + " updatePassword():" + error);
					},
					() => console.log("Done")
				);
		}
		return false;
	}

	checkPassword(event: any) {
		var password = event.target.value;
		if (password != "") {
			var user = { 'oldPassword': password, 'userId': this.loggedInUserId };
			this.userService.comparePassword(user)
				.subscribe(
					data => {
						if (data != "") {
							const response = data;
							const message = response.message;
							this.formErrors['oldPassword'] = message;
						} else {
							this.logger.error(this.referenceService.errorPrepender + " checkPassword():" + data);
						}
					},
					error => {
						this.logger.error(this.referenceService.errorPrepender + " checkPassword():" + error);
					},
					() => console.log("Done")
				);
		}
		return false;
	}

	validateUpdatePasswordForm() {
		var passwordRegex = this.regularExpressions.PASSWORD_PATTERN;
		this.updatePasswordForm = this.fb.group({
			'oldPassword': [null],
			'newPassword': [null, [Validators.required, Validators.minLength(6), Validators.pattern(passwordRegex)]],
			'confirmNewPassword': [null, [Validators.required]],
		}, {
			validator: matchingPasswords('newPassword', 'confirmNewPassword')
		}

		);

		this.updatePasswordForm.valueChanges
			.subscribe(data => this.onUpdatePasswordFormValueChanged(data));

		this.onUpdatePasswordFormValueChanged(); // (re)set validation messages now
	}


	onUpdatePasswordFormValueChanged(data?: any) {
		if (!this.updatePasswordForm) { return; }
		const form = this.updatePasswordForm;

		for (const field in this.formErrors) {
			// clear previous error message (if any)
			this.formErrors[field] = '';
			const control = form.get(field);

			if (control && control.dirty && !control.valid) {
				const messages = this.validationMessages[field];
				for (const key in control.errors) {
					this.formErrors[field] += messages[key] + ' ';
				}
			}
		}
	}


	formErrors = {
		'oldPassword': '',
		'newPassword': '',
		'confirmNewPassword': '',
		'firstName': '',
		'lastName': '',
		'mobileNumber': '',
		'interests': '',
		'occupation': '',
		'description': '',
		'websiteUrl': '',
		'companyName': '',
		'preferredLanguage': ''
	};

	validationMessages = {
		'oldPassword': {
			'required': 'Old Password is required.'
		},
		'newPassword': {
			'required': 'New Password is required.',
			'minlength': 'Minimum 6 Characters',
			'pattern': 'Use 6 or more characters with a mix of letters, numbers & symbols'
		},
		'confirmNewPassword': {
			'required': 'Confirm Password is required.'
		},
		'firstName': {
			'required': 'First Name required.',
			'whitespace': 'Invalid Data',
			'minlength': 'First Name must be at least 3 characters long.',
			'maxlength': 'First Name cannot be more than 50 characters long.',
			'pattern': 'Invalid Name'
		},
		'lastName': {
			'required': 'Last Name required.',
			'whitespace': 'Invalid Data',
			'minlength': 'Last Name must be at least 3 characters long.',
			'maxlength': 'Last Name cannot be more than 50 characters long.',
			'pattern': 'Invalid Name'
		},
		'mobileNumber': {
			'required': 'Mobile Number required.',
			'minlength': '',
			/* 'maxlength': 'Mobile should be 10 digit.',*/
			'pattern': 'Mobile Numbe should be 10 digits and only contain numbers.'

		},
		'interests': {
			'required': 'Interests required.',
			'whitespace': 'Invalid Data',
			'minlength': 'interest be at least 3 characters long.',
			'maxlength': 'interest cannot be more than 50 characters long.',
			'pattern': 'Only Characters Allowed'
		},
		'occupation': {
			'required': 'Title required.',
			'whitespace': 'Invalid Data',
			'minlength': 'Title be at least 3 characters long.',
			'maxlength': 'Title cannot be more than 50 characters long.',
			'pattern': 'Only Characters Allowed'
		},
		'description': {
			'required': 'About required.',
			'whitespace': 'Invalid Data',
			'minlength': 'description be at least 3 characters long.',
			'maxlength': 'description cannot be more than 250 characters long.'
		},
		'websiteUrl': {
			'required': 'WebsiteUrl required.',
			'pattern': 'Invalid Url Pattern'
		}
	};

	/*******************Update User Profile*************************************/
	geoLocation() {
		try {
			this.videoFileService.getJSONLocation()
				.subscribe(
					(data: any) => {
						if (this.userData.mobileNumber == "" || this.userData.mobileNumber == undefined) {
							for (let i = 0; i < this.countryNames.countriesMobileCodes.length; i++) {
								if (data.countryCode == this.countryNames.countriesMobileCodes[i].code) {
									this.userData.mobileNumber = this.countryNames.countriesMobileCodes[i].dial_code;
									break;
								}
							}
						}
					})
		} catch (error) {
			console.error(error, "addcontactOneAttimeModalComponent()", "gettingGeoLocation");
		}
	}

	updateUserProfileForm: FormGroup;
	validateUpdateUserProfileForm() {
		var urlPatternRegEx = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/;
		var mobileNumberPatternRegEx = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
		// var nameRegEx = /[a-zA-Z0-9]+[a-zA-Z0-9 ]+/;
		var charWithCommaRegEx = /^(?!.*?([A-D]).*?\1)[A-D](?:,[A-D])*$/;
		this.updateUserProfileForm = this.fb.group({
			'firstName': [this.userData.firstName, Validators.compose([Validators.required, noWhiteSpaceValidator, Validators.maxLength(50)])],//Validators.pattern(nameRegEx)
			'lastName': [this.userData.lastName],
			'middleName': [this.userData.middleName],
			'mobileNumber': [this.userData.mobileNumber],
			'interests': [this.userData.interests, Validators.compose([noWhiteSpaceValidator, Validators.maxLength(50)])],
			'occupation': [this.userData.occupation, Validators.compose([noWhiteSpaceValidator, Validators.maxLength(50)])],
			'description': [this.userData.description, Validators.compose([noWhiteSpaceValidator, Validators.maxLength(250)])],
			'websiteUrl': [this.userData.websiteUrl, [Validators.pattern(urlPatternRegEx)]],
			'preferredLanguage': [this.userData.preferredLanguage],
		});

		this.updateUserProfileForm.valueChanges
			.subscribe(data => this.onUpdateUserProfileFormValueChanged(data));

		this.onUpdateUserProfileFormValueChanged(); // (re)set validation messages now
	}

	onUpdateUserProfileFormValueChanged(data?: any) {
		if (!this.updateUserProfileForm) { return; }
		const form = this.updateUserProfileForm;

		for (const field in this.formErrors) {
			// clear previous error message (if any)
			this.formErrors[field] = '';
			const control = form.get(field);

			if (control && control.dirty && !control.valid) {
				const messages = this.validationMessages[field];
				for (const key in control.errors) {
					this.formErrors[field] += messages[key] + ' ';
				}
			}
		}
	}

	firstNameValue(name: string) {
		this.userData.displayName = name;
	}
	occupationValue(occupation: string) {
		this.userData.occupation = occupation;
	}

	updateUserProfile() {
		this.referenceService.goToTop();
		this.ngxloading = true;
		if (this.userData.mobileNumber) {
			if (this.userData.mobileNumber.length > 6) {
				this.updateUserProfileForm.value.mobileNumber = this.userData.mobileNumber;
			} else {
				this.updateUserProfileForm.value.mobileNumber = ""
			}
		}
		this.userService.updateUserProfile(this.updateUserProfileForm.value, this.authenticationService.getUserId())
			.subscribe(
				data => {
					if (data !== "") {
						const response = data;
						const message = response.message;
						if (message === "User Updated") {
							this.customResponse = new CustomResponse('SUCCESS', this.properties.PROFILE_UPDATED, true);
							this.userData = this.updateUserProfileForm.value;
							this.userData.displayName = this.updateUserProfileForm.value.firstName;
							this.userData.emailId = this.authenticationService.user.emailId;
							this.parentModel.displayName = this.updateUserProfileForm.value.firstName;
							this.referenceService.topNavBarUserDetails.displayName = this.parentModel.displayName;
							this.userService.getUserByUserName(this.authenticationService.user.emailId).
								subscribe(
									res => {
										this.ngxloading = false;
										this.authenticationService.userProfile = res;
										this.userData.hasPassword = this.authenticationService.userProfile.hasPassword;
										this.translateService.use(res.preferredLanguage);
										this.authenticationService.userPreferredLanguage = this.authenticationService.allLanguagesList.find(item => item.id === res.preferredLanguage).id;
										this.authenticationService.beeLanguageCode = this.authenticationService.allLanguagesList.find(item => item.id === res.preferredLanguage).beeId;
									},
									error => { this.logger.error(this.referenceService.errorPrepender + " updateUserProfile():" + error) },
									() => console.log("Finished")
								);
						} else {
							this.ngxloading = false;
							this.logger.error(this.referenceService.errorPrepender + " updateUserProfile():" + data);
						}
					} else {
						this.logger.error(this.referenceService.errorPrepender + " updateUserProfile():" + data);
					}
				},
				error => {
					this.ngxloading = false;
					this.logger.error(this.referenceService.errorPrepender + " updateUserProfile():" + error);
				},
				() => console.log("Done")
			);
		return false;
	}

	readURL(input: any) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e: any) {
				$('#blah')
					.attr('src', e.target.result)
					.width(150)
					.height(200);
			};
			reader.readAsDataURL(input.files[0]);
		}
	}
	hideDiv(divId: string) {
		$('#' + divId).hide(600);
	}
	getVideoDefaultSettings() {
		this.userService.getVideoDefaultSettings().subscribe(
			(result: any) => {
				this.active = true;
				const response = result;
				this.referenceService.defaultPlayerSettings = response;
				this.tempDefaultVideoPlayerSettings = response;
				this.defaultVideoPlayer = response;
				this.compControllerColor = response.controllerColor;
				this.compPlayerColor = response.playerColor;
				this.valueRange = response.transparency;
				this.tempControllerColor = response.controllerColor;
				this.tempPlayerColor = response.playerColor;
				if (!response.controllerColor && !response.playerColor && !response.transparency) {
					this.compControllerColor = '#cccccc'; this.valueRange = 100; this.tempControllerColor = '#cccccc'; this.tempPlayerColor = '#ffffff';
				}
				this.logoImageUrlPath = response.brandingLogoUri = response.companyProfile.companyLogoPath;
				this.logoLink = response.brandingLogoDescUri = response.companyProfile.website;
				this.defaultPlayerbuildForm();
				if (this.isPlayerSettingUpdated === true) {
					this.videoUtilService.videoTempDefaultSettings = response;
				}
			},
			(error: any) => { console.log('error' + error); }
		);
	}
	enableVideoController(event: any) {
		if (this.isPlayed === false) {
			this.videoJSplayer.play();
			this.videoJSplayer.pause();
		}
		this.defaultVideoPlayer.enableVideoController = event;
		if (event === true) {
			$('.video-js .vjs-control-bar').show();
		} else { $('.video-js .vjs-control-bar').hide(); }
	}
	defaultVideoControllers() {
		if (this.referenceService.defaultPlayerSettings.enableVideoController === false) {
			$('.video-js .vjs-control-bar').hide();
		} else { $('.video-js .vjs-control-bar').show(); }
	}
	changeControllerColor(event: any, enableVideoController: boolean) {
		try {
			this.defaultVideoPlayer.controllerColor = event;
			this.compControllerColor = event;
			if (enableVideoController) {
				const rgba = this.videoUtilService.transparancyControllBarColor(event, this.valueRange);
				$('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
			}
		} catch (error) { console.log(error); }
	}
	changePlayerColor(event: any) {
		this.defaultVideoPlayer.playerColor = event;
		this.compPlayerColor = event;
		$('.video-js .vjs-play-progress').css('background-color', this.defaultVideoPlayer.playerColor);
		$('.video-js .vjs-big-play-button').css('cssText', 'color:' + this.defaultVideoPlayer.playerColor + '!important');
		$('.video-js .vjs-play-control').css('cssText', 'color:' + this.defaultVideoPlayer.playerColor + '!important');
		$('.video-js .vjs-volume-menu-button').css('cssText', 'color:' + this.defaultVideoPlayer.playerColor + '!important');
		$('.video-js .vjs-volume-level').css('cssText', 'background-color:' + this.defaultVideoPlayer.playerColor + '!important');
		$('.video-js .vjs-remaining-time-display').css('cssText', 'color:' + this.defaultVideoPlayer.playerColor + '!important');
		$('.video-js .vjs-fullscreen-control').css('cssText', 'color:' + this.defaultVideoPlayer.playerColor + '!important');
		$('.video-js .vjs-volume-panel').css('cssText', 'color:' + this.defaultVideoPlayer.playerColor + '!important');
		$('.video-js .vjs-playback-rate').css('cssText', 'color:' + this.defaultVideoPlayer.playerColor + '!important');


	}
	transperancyControllBar(value: any) {
		this.valueRange = value;
		const color: any = this.defaultVideoPlayer.controllerColor;
		const rgba = this.videoUtilService.transparancyControllBarColor(color, value);
		$('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
	}
	defaulttransperancyControllBar(value: any) {
		const color: any = this.referenceService.defaultPlayerSettings.controllerColor;
		const rgba = this.videoUtilService.transparancyControllBarColor(color, value);
		$('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
	}
	allowLikes(event: any) {
		this.defaultVideoPlayer.allowLikes = event;
	}
	allowComments(event: any) {
		this.defaultVideoPlayer.allowComments = event;
	}
	enableSettings(event: any) {
		this.defaultVideoPlayer.enableSettings = event;
	}
	enableCasting(event: any) {
		this.defaultVideoPlayer.enableCasting = event;
	}
	allowSharing(event: any) {
		this.defaultVideoPlayer.allowSharing = event;
	}
	enableEmbed(event: any) {
		this.defaultVideoPlayer.allowEmbed = event;
	}
	enable360Video(event: any) {
		this.defaultVideoPlayer.is360video = event;
	}
	changeFullscreen(event: any) {
		this.defaultVideoPlayer.allowFullscreen = event;
		if (this.defaultVideoPlayer.allowFullscreen === false) {
			$('.video-js .vjs-fullscreen-control').hide();
		} else { $('.video-js .vjs-fullscreen-control').show(); }
	}
	defaultVideoSettings() {
		if (this.referenceService.defaultPlayerSettings !== null && this.referenceService.defaultPlayerSettings !== undefined) {
			if (this.referenceService.defaultPlayerSettings.playerColor === undefined || this.referenceService.defaultPlayerSettings.playerColor === null) {
				this.referenceService.defaultPlayerSettings.playerColor = '#454';
				this.referenceService.defaultPlayerSettings.controllerColor = '#234';
				this.referenceService.defaultPlayerSettings.transparency = 100;
			}
			$('.video-js').css('color', this.referenceService.defaultPlayerSettings.playerColor);
			$('.video-js .vjs-play-progress').css('background-color', this.referenceService.defaultPlayerSettings.playerColor);
			$('.video-js .vjs-volume-level').css('background-color', this.referenceService.defaultPlayerSettings.playerColor);
			if (this.referenceService.defaultPlayerSettings.controllerColor === '#fff') {
				const event = '#fbfbfb';
				$('.video-js .vjs-control-bar').css('cssText', 'background-color:' + event + '!important');
			} else { $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + this.referenceService.defaultPlayerSettings.controllerColor + '!important'); }
			if (this.referenceService.defaultPlayerSettings.allowFullscreen === false) {
				$('.video-js .vjs-fullscreen-control').hide();
			} else { $('.video-js .vjs-fullscreen-control').show(); }

		}
	}
	UpdatePlayerSettingsValues() {
		this.ngxloading = true;
		this.isPlayerSettingUpdated = true;
		this.defaultVideoPlayer.playerColor = this.compPlayerColor;
		this.defaultVideoPlayer.controllerColor = this.compControllerColor;
		this.defaultVideoPlayer.transparency = this.valueRange;
		this.userService.updatePlayerSettings(this.defaultVideoPlayer)
			.subscribe((result: any) => {
				this.ngxloading = false;
				this.customResponse = new CustomResponse('SUCCESS', this.properties.DEFAULT_PLAYER_SETTINGS, true);
				if (!this.authenticationService.isOnlyPartner()) { this.getVideoDefaultSettings(); }
			},
				(error: any) => { console.error('error in update player setting api'); }
			);
	}
	resetForm() {
		this.compControllerColor = this.videoUtilService.videoTempDefaultSettings.controllerColor;
		this.compPlayerColor = this.videoUtilService.videoTempDefaultSettings.playerColor;
		this.valueRange = this.videoUtilService.videoTempDefaultSettings.transparency;
		this.defaultVideoPlayer.allowFullscreen = this.videoUtilService.videoTempDefaultSettings.allowFullscreen;
		this.defaultVideoPlayer.allowComments = this.videoUtilService.videoTempDefaultSettings.allowComments;
		this.defaultVideoPlayer.allowEmbed = this.videoUtilService.videoTempDefaultSettings.allowEmbed;
		this.defaultVideoPlayer.is360video = this.videoUtilService.videoTempDefaultSettings.is360video;
		this.defaultVideoPlayer.allowLikes = this.videoUtilService.videoTempDefaultSettings.allowLikes;
		this.defaultVideoPlayer.allowSharing = this.videoUtilService.videoTempDefaultSettings.allowSharing;
		this.defaultVideoPlayer.enableCasting = this.videoUtilService.videoTempDefaultSettings.enableCasting;
		this.defaultVideoPlayer.enableSettings = this.videoUtilService.videoTempDefaultSettings.enableSettings;
		this.defaultVideoPlayer.enableVideoController = this.videoUtilService.videoTempDefaultSettings.enableVideoController;
		this.changeControllerColor(this.compControllerColor, this.defaultVideoPlayer.enableVideoController);
		this.changePlayerColor(this.compPlayerColor);
		this.transperancyControllBar(this.valueRange);
		if (this.defaultVideoPlayer.enableVideoController === false) {
			$('.video-js .vjs-control-bar').hide();
		} else { $('.video-js .vjs-control-bar').show(); }
	}
	defaultPlayerbuildForm() {
		this.defaultPlayerForm = this.fb.group({
			'enableVideoController': [this.defaultVideoPlayer.enableVideoController],
			'playerColor': [this.defaultVideoPlayer.playerColor],
			'controllerColor': [this.defaultVideoPlayer.controllerColor],
			'transparency': [this.defaultVideoPlayer.transparency],
			'allowSharing': [this.defaultVideoPlayer.allowSharing],
			'enableSettings': [this.defaultVideoPlayer.enableSettings],
			'allowFullscreen': [this.defaultVideoPlayer.allowFullscreen],
			'allowComments': [this.defaultVideoPlayer.allowComments],
			'allowLikes': [this.defaultVideoPlayer.allowLikes],
			'enableCasting': [this.defaultVideoPlayer.enableCasting],
			'allowEmbed': [this.defaultVideoPlayer.allowEmbed],
			'is360video': [this.defaultVideoPlayer.is360video],
			'brandingLogoUri': [this.defaultVideoPlayer.brandingLogoUri]
		});
		this.defaultPlayerForm.valueChanges.subscribe((data: any) => this.onDefaultPlayerValueChanged(data));
		this.onDefaultPlayerValueChanged();
	}

	onDefaultPlayerValueChanged(data?: any) {
		if (!this.defaultPlayerForm) { return; }
		const form = this.defaultPlayerForm;
		for (const field in this.formErrors) {
			this.formErrors[field] = '';
			const control = form.get(field);
			if (control && control.dirty && !control.valid) {
				const messages = this.validationMessages[field];
				for (const key in control.errors) {
					this.formErrors[field] += messages[key] + ' ';
				}
			}
		}
	}

	isGridView(userId: number) {
		this.userService.isGridView(userId)
			.subscribe(
				data => {
					this.callActionSwitch.isGridView = data;
				},
				error => console.log(error),
				() => { }
			);
	}

	setGridView(isGridView: boolean) {
		this.ngxloading = true;
		this.userService.setGridView(this.authenticationService.getUserId(), isGridView)
			.subscribe(
				data => {
					this.ngxloading = false;
					this.referenceService.isGridView = isGridView;
					this.customResponse = new CustomResponse('SUCCESS', this.properties.PROCESS_REQUEST_SUCCESS, true);
				},
				error => {
					this.ngxloading = false;
					this.customResponse = new CustomResponse('ERROR', this.properties.PROCESS_REQUEST_ERROR, true);
				},
				() => { }
			);
	}

	changeStatus() {
		$('#org-admin-info').hide();
		if (!($('#status').is(":checked"))) {
			if (this.currentUser.roles.length > 1) {
				this.status = true;
				$('#status').prop("checked", true);
				let self = this;
				swal({
					title: 'Are you sure?',
					text: 'Once you change status,it cannot be undone.',
					showCancelButton: true,
					confirmButtonColor: '#54a7e9',
					cancelButtonColor: '#999',
					confirmButtonText: 'Yes',
					showLoaderOnConfirm: true,
					allowOutsideClick: false,
					cancelButtonText: 'No'
					/*     preConfirm: () => {
							 if(self.orgAdminCount>1){
								 $('a').addClass('disabled');
								 self.refService.isDisabling = true;
								 self.disableOrgAdmin();
							 }else{
								 self.infoMessage = "Please Assign An OrgAdmin Before You Disable Yourself.";
								 $('#org-admin-info').show(600);
								 swal.close();

							 }
						 }*/
				}).then(function () {
					if (self.orgAdminCount > 1) {
						$('a').addClass('disabled');
						self.referenceService.isDisabling = true;
						self.disableOrgAdmin();
					} else {
						self.infoMessage = "Please Assign An OrgAdmin Before You Disable Yourself.";
						$('#org-admin-info').show(600);
						swal.close();

					}
				}, function (dismiss: any) {
					console.log('you clicked on option' + dismiss);
				});

			}
		} else {
			this.router.navigate(["/home/dashboard/edit-company-profile"]);
		}
	}

	getOrgAdminsCount(userId: number) {
		this.userService.getOrgAdminsCount(userId)
			.subscribe(
				data => {
					this.orgAdminCount = data;
				},
				error => {
					this.logger.errorPage(error);
				},
				() => this.logger.info("Finished getOrgAdminsCount()")
			);

	}

	disableOrgAdmin() {
		this.userService.disableOrgAdmin(this.loggedInUserId)
			.subscribe(
				data => {
					const response = data;
					if (response.statusCode == 1048) {
						$('a').removeClass('disabled');
						this.referenceService.isDisabling = false;
						$('#status').prop("checked", true);
						this.status = false;
						this.referenceService.userProviderMessage = this.properties.ACCOUNT_DEACTIVATE_SUCCESS;
						this.authenticationService.logout();
						this.router.navigate(["/login"]);
					}
				},
				error => {
					this.logger.errorPage(error);
					$('a').removeClass('disabled');
				},
				() => this.logger.info("Finished enableOrDisableOrgAdmin()")
			);
	}


	//Forms section

	initializeForm() {
		this.userService.listForm(this.loggedInUserId).subscribe(result => {
			if (result.length > 0) {
				this.form = result[0];
				this.questions = result;
				let index = 1;
				this.questions = this.questions.map(q => {
					q.divId = 'question-' + index++;
					return q;
				});
				this.submitButtonText = "Update Questions";

			} else {
				this.questions = [];
				this.submitButtonText = "Save Questions";
			}

			this.submitBUttonStateChange();
		})
		this.dealRegSevice.listDealTypes(this.loggedInUserId).subscribe(dealTypes => {

			this.dealtypes = dealTypes.data;

		});
	}

	addQuestion() {
		this.question = new DealQuestions();
		var length;
		if (this.questions != null && this.questions != undefined)
			length = this.questions.length;
		else
			length = 0;
		length = length + 1;
		var id = 'question-' + length;
		this.question.divId = id;
		this.question.error = true;


		this.questions.push(this.question);
		this.submitBUttonStateChange();


	}
	remove(i, id) {
		if (id)
			var index = 1;
		this.questions = this.questions.filter(question => question.divId !== 'question-' + i)
			.map(question => {
				question.divId = 'question-' + index++;
				return question;
			});
		this.submitBUttonStateChange();

	}
	showAlert(i, question) {
		if (question.id) {
			this.deleteQuestion(i, question);

		} else {
			this.remove(i, question.id);
		}
	}
	deleteQuestion(i, question) {
		try {
			this.logger.info("Question in sweetAlert() " + question.id);
			let self = this;
			swal({
				title: 'Are you sure?',
				text: "You won't be able to undo this action!",
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#54a7e9',
				cancelButtonColor: '#999',
				confirmButtonText: 'Yes, delete it!'

			}).then(function (myData: any) {
				self.userService.deleteQuestion(question).subscribe(result => {
					self.remove(i, question.id);
					self.customResponseForm = new CustomResponse('SUCCESS', result.data, true);
				}, error => console.log(error))
			}, function (dismiss: any) {

			});
		} catch (error) {
			console.log(error);
		}

	}
	validateQuestion(question: DealQuestions) {
		var errorClass = "form-group has-error has-feedback";
		var successClass = "form-group has-success has-feedback";
		if (question.question.length > 0) {
			question.class = successClass;
			question.error = false;
		} else {
			question.class = errorClass;
			question.error = true;
		}
		this.submitBUttonStateChange();
	}
	validateDealForm(form: DealForms) {
		if (form.name.length > 0) {
			this.validateForm = true;
		} else {
			this.validateForm = false;
		}
		this.submitBUttonStateChange();
	}
	submitBUttonStateChange() {
		let countForm = 0;
		this.questions.forEach(question => {

			if (question.error)
				countForm++;
		})
		if (countForm > 0 || this.questions.length == 0)
			this.formSubmiteState = false;
		else
			this.formSubmiteState = true;

	}
	saveForm() {
		this.ngxloading = true;
		let self = this;
		let data = []
		this.questions.forEach(question => {
			const q = new DealQuestions();
			q.question = question.question;
			if (question.id) {
				let obj = {
					id: question.id,
					question: question.question,
					updatedBy: self.authenticationService.getUserId()
				}
				data.push(obj);

			} else {
				let obj = {
					question: question.question,
					createdBy: self.authenticationService.getUserId()
				}
				data.push(obj);
			}

		})

		this.userService.saveForm(this.authenticationService.getUserId(), data).subscribe(result => {

			this.customResponseForm = new CustomResponse('SUCCESS', result.data, true);
			this.initializeForm();
			// this.userService.listForm(this.loggedInUserId).subscribe(form => {
			//     this.dealForms = form;
			//     this.initializeForm();

			//     this.ngxloading = false;
			// })
		}, (error: any) => {
			console.log(error);
			this.ngxloading = false;
		}, () => { this.ngxloading = false; });

	}

	//Deal types
	addDealtype() {
		this.dealtype = new DealType();
		var length;
		if (this.dealtypes != null && this.dealtypes != undefined)
			length = this.dealtypes.length;
		else
			length = 0;
		length = length + 1;
		var id = 'dealType-' + length;
		this.dealtype.divId = id;
		this.dealtype.error = true;


		this.dealtypes.push(this.dealtype);
		this.dealTypeButtonStateChange();
	}

	deleteDealType(i, dealType) {
		try {
			this.logger.info("Deal Type in sweetAlert() " + dealType.id);
			let self = this;
			swal({
				title: 'Are you sure?',
				text: "You won't be able to undo this action!",
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#54a7e9',
				cancelButtonColor: '#999',
				confirmButtonText: 'Yes, delete it!'

			}).then(function (myData: any) {
				self.dealRegSevice.deleteDealType(dealType).subscribe(result => {
					if (result.statusCode == 200) {
						self.removeDealType(i, dealType.id);
						self.customResponseForm = new CustomResponse('SUCCESS', result.data, true);
					} else if (result.statusCode == 403) {
						self.customResponseForm = new CustomResponse('ERROR', result.message, true);
					} else {
						self.customResponseForm = new CustomResponse('ERROR', self.properties.serverErrorMessage, true);
					}
					self.ngxloading = false;

				}, (error) => {
					self.ngxloading = false;

				}, () => {
					self.dealRegSevice.listDealTypes(self.loggedInUserId).subscribe(dealTypes => {

						self.dealtypes = dealTypes.data;

					});
				})
			}, function (dismiss: any) {
				console.log('you clicked on option');
			});
		} catch (error) {
			console.log(error);
		}
	}
	removeDealType(i, id) {

		if (id)
			console.log(id)
		console.log(i)
		var index = 1;

		this.dealtypes = this.dealtypes.filter(dealtype => dealtype.divId !== 'dealtype-' + i)
			.map(dealtype => {
				dealtype.divId = 'dealtype-' + index++;
				return dealtype;
			});
		this.dealTypeButtonStateChange();

	}
	validateDealType(dealType: DealType) {
		var errorClass = "form-group has-error has-feedback";
		var successClass = "form-group has-success has-feedback";
		if (dealType.dealType.length > 0) {
			dealType.class = successClass;
			dealType.error = false;
		} else {
			dealType.class = errorClass;
			dealType.error = true;
		}
		this.dealTypeButtonStateChange();
	}

	dealTypeButtonStateChange() {
		let countForm = 0;
		this.dealtypes.forEach(dealType => {

			if (dealType.error)
				countForm++;
		})
		if (countForm > 0 || this.dealtypes.length == 0)
			this.dealSubmiteState = false;
		else
			this.dealSubmiteState = true;

	}
	saveDealTypes() {
		if (this.dealtypes.length > 0) {
			this.ngxloading = true;
			let dtArr = []
			this.dealtypes.forEach(dealtype => {
				if (dealtype.id) {
					let obj = {
						"id": dealtype.id,
						"dealType": dealtype.dealType,
						"updatedBy": this.authenticationService.getUserId()
					}
					dtArr.push(obj);
				} else {
					let obj = {
						"id": dealtype.id,
						"dealType": dealtype.dealType,
						"createdBy": this.authenticationService.getUserId()
					}
					dtArr.push(obj);
				}
			})
			this.dealRegSevice.saveDealTypes(dtArr, this.authenticationService.getUserId()).subscribe(result => {
				this.ngxloading = false;
				this.customResponseForm = new CustomResponse('SUCCESS', result.data, true);

			}, (error) => {
				this.ngxloading = false;
				this.customResponseForm = new CustomResponse('ERROR', "The dealtypes are already associate with deals", true);

			}, () => {
				this.dealRegSevice.listDealTypes(this.loggedInUserId).subscribe(dealTypes => {

					this.dealtypes = dealTypes.data;

				});
			})
		}

	}


	checkIntegrations(): any {

		this.checkMarketoIntegration();
		this.checkHubspotIntegration();
		this.checkSalesforceIntegration();
		this.checkMicrosoftIntegration();
		this.checkPipedriveIntegration();
		this.checkConnectWiseIntegration();
		this.getActiveCRMDetails();
	}
	checkMicrosoftIntegration() {
		this.referenceService.loading(this.httpRequestLoader, true);
		this.integrationService.checkConfigurationByType("microsoft").subscribe(data => {
			this.referenceService.loading(this.httpRequestLoader, false);
			let response = data;
			if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
				this.microsoftRibbonText = "configured";
			}
			else {
				this.microsoftRibbonText = "configure";
			}
			if (response.data.redirectUrl !== undefined && response.data.redirectUrl !== '') {
				this.microsoftRedirectURL = response.data.redirectUrl;
			}
		}, error => {
			this.referenceService.loading(this.httpRequestLoader, false);
			this.sfRibbonText = "configure";
			this.logger.error(error, "Error in checkIntegrations() for microsoft");
		}, () => this.logger.log("Microsoft Integration Configuration Checking done"));

	}
	checkSalesforceIntegration() {
		this.referenceService.loading(this.httpRequestLoader, true);
		this.integrationService.checkConfigurationByType("isalesforce").subscribe(data => {
			this.referenceService.loading(this.httpRequestLoader, false);
			let response = data;
			if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
				this.sfRibbonText = "configured";
			}
			else {
				this.sfRibbonText = "configure";
			}
			if (response.data.redirectUrl !== undefined && response.data.redirectUrl !== '') {
				this.sfRedirectURL = response.data.redirectUrl;
			}
		}, error => {
			this.referenceService.loading(this.httpRequestLoader, false);
			this.sfRibbonText = "configure";
			this.logger.error(error, "Error in checkIntegrations()");
		}, () => this.logger.log("Integration Configuration Checking done"));

	}
	checkHubspotIntegration() {
		this.referenceService.loading(this.httpRequestLoader, true);
		this.hubSpotService.configHubSpot().subscribe(data => {
			this.referenceService.loading(this.httpRequestLoader, false);
			let response = data;
			if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
				this.hubSpotRibbonText = "configured";
			}
			else {
				this.hubSpotRibbonText = "configure";
			}
			if (response.data.redirectUrl !== undefined && response.data.redirectUrl !== '') {
				this.hubSpotRedirectURL = response.data.redirectUrl;
			}
		}, (error: any) => {
			this.referenceService.loading(this.httpRequestLoader, false);
			this.hubSpotRibbonText = "configure";
			this.logger.error(error, "Error in HubSpot checkIntegrations()");
		}, () => this.logger.log("HubSpot Configuration Checking done"));

	}
	checkMarketoIntegration() {
		this.referenceService.loading(this.httpRequestLoader, true);
		this.dashBoardService.checkMarketoCredentials(this.authenticationService.getUserId()).subscribe(response => {
			this.referenceService.loading(this.httpRequestLoader, false);
			if (response.statusCode == 8000) {
				this.integrateRibbonText = "configured";
				this.isMarketoProcess = response.data.isProcessing;
			}
			else {
				this.integrateRibbonText = "configure";

			}
		}, error => {
			this.referenceService.loading(this.httpRequestLoader, false);
			this.integrateRibbonText = "configure";
		})
	}

	// XNFR-215
	checkPipedriveIntegration() {
		this.referenceService.loading(this.httpRequestLoader, true);
		this.integrationService.checkConfigurationByType("pipedrive").subscribe(data => {
			this.referenceService.loading(this.httpRequestLoader, false);
			let response = data;
			if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
				this.pipedriveRibbonText = "configured";
			}
			else {
				this.pipedriveRibbonText = "configure";
			}
		}, error => {
			this.referenceService.loading(this.httpRequestLoader, false);
			this.sfRibbonText = "configure";
			this.logger.error(error, "Error in checkPipedriveIntegration() for pipedrive");
		}, () => this.logger.log("Pipedrive Integration Configuration Checking done"));
	}
	// XNFR-215

	configmarketo() {
		this.integrationTabIndex = 1;
	}
	closeMarketoForm(event: any) {
		if (event === "0") {
			this.checkIntegrations();
			this.integrationTabIndex = 0;
		}
	}
	themeName = "Light Theme";
	showSeletThemeSettings = false;
	activateTab(activeTabName: any) {
		this.activeTabName = activeTabName;
		if (this.activeTabName == "personalInfo") {
			this.activeTabHeader = this.properties.personalInfo;
		} else if (this.activeTabName == "customTheme") {
			this.activeTabHeader = "Custom Skin Settings";
			this.themeResponse.isVisible = false;
			//this.themeName = "Custom Theme";
		} else if (this.activeTabName == "lightTheme") {
			this.activeTabHeader = "Custom Skin Settings";
			this.themeResponse.isVisible = false;
			// this.themeName = "Light Theme";
		} else if (this.activeTabName == "password") {
			this.activeTabHeader = this.properties.changePassword;
		} else if (this.activeTabName == "settings") {
			this.activeTabHeader = this.properties.viewType;
		} else if (this.activeTabName == "playerSettings") {
			this.activeTabHeader = this.properties.defaultPlayerSettings;
		} else if (this.activeTabName == "dealTypes") {
			this.activeTabHeader = this.properties.dealRegistration;
		} else if (this.activeTabName == "integrations") {
			this.activeTabHeader = this.properties.integrations;
		} else if (this.activeTabName == "samlSettings") {
			this.activeTabHeader = this.properties.samlSettings;
		} else if (this.activeTabName == "gdpr") {
			this.activeTabHeader = this.properties.gdprSettings;
			this.getGdprSettings();
		} else if (this.activeTabName == "categories") {
			this.activeTabHeader = this.properties.folders;
			this.categoryPagination = new Pagination();
			this.listCategories(this.categoryPagination);
		} else if (this.activeTabName == "dbButtonSettings") {
			this.activeTabHeader = 'Dashboard Buttons';
		} else if (this.activeTabName == "customizeleftmenu") {
			this.activeTabHeader = this.properties.customizeleftmenu;
		} else if (this.activeTabName == "templates") {
			this.ngxloading = true;
			this.showTemplates = false;
			this.activeTabHeader = 'Your Templates';
			let self = this;
			setTimeout(() => {
				self.showTemplates = true;
				self.ngxloading = false;
			}, 500);
		} else if (this.activeTabName == "leadPipelines") {
			this.activeTabHeader = this.properties.leadPipelines;
			this.pipelinePagination = new Pagination();
			this.pipelineResponse = new CustomResponse();
			this.listAllPipelines(this.pipelinePagination);
		} else if (this.activeTabName == "dealPipelines") {
			this.activeTabHeader = this.properties.dealPipelines;
			this.pipelinePagination = new Pagination();
			this.pipelineResponse = new CustomResponse();
			this.listAllPipelines(this.pipelinePagination);
		} else if (this.activeTabName == "tags") {
			this.activeTabHeader = this.properties.tags;
		} else if (this.activeTabName == "customskin") {
			this.activeTabHeader = this.properties.customskin;
			this.themeName = "";
		} else if (this.activeTabName == "exclude") {
			this.activeTabHeader = this.properties.exclude;
			this.excludeUserPagination = new Pagination();
			this.excludeUserPagination.pageIndex = 1;
			this.excludeUserPagination.maxResults = 12;
			this.listExcludedUsers(this.excludeUserPagination);
			this.excludeDomainPagination = new Pagination();
			this.excludeDomainPagination.pageIndex = 1;
			this.excludeDomainPagination.maxResults = 12;
			this.listExcludedDomains(this.excludeDomainPagination);
		} else if (this.activeTabName == "spf") {
			this.ngxloading = true;
			this.activeTabHeader = this.properties.spfHeaderText;
			this.showSpfConfigurationDiv = false;
			let self = this;
			setTimeout(() => {
				self.showSpfConfigurationDiv = true;
				self.ngxloading = false;
			}, 500);

		} else if (this.activeTabName == "unsubscribeReasons") {
			this.ngxloading = true;
			this.showUnsubscribeReasonsDiv = false;
			this.activeTabHeader = this.properties.unsubscribeReasonsHeaderText;
			let self = this;
			setTimeout(() => {
				self.showUnsubscribeReasonsDiv = true;
				self.ngxloading = false;
			}, 500);
		} else if (this.activeTabName == "team-group") {
			this.ngxloading = true;
			this.showTeamMemberGroups = false;
			this.activeTabHeader = this.properties.teamMemberGroups;
			let self = this;
			setTimeout(() => {
				self.showTeamMemberGroups = true;
				self.ngxloading = false;
			}, 500);
		} else if (this.activeTabName == "notifyPartners") {
			this.ngxloading = true;
			this.showNotifyPartnersOption = false;
			let self = this;
			setTimeout(() => {
				self.showNotifyPartnersOption = true;
				self.ngxloading = false;
			}, 500);
		} else if (this.activeTabName == "support") {
			this.ngxloading = true;
			this.showSupportSettingOption = false;
			let self = this;
			setTimeout(() => {
				self.showSupportSettingOption = true;
				self.ngxloading = false;
			}, 500);
			this.activeTabHeader = this.properties.supportText;
		}
		/****XNFR-326*****/
		else if (this.activeTabName == this.properties.emailNotificationSettings) {
			this.ngxloading = true;
			this.showEmailNotificationSettingsOption = false;
			let self = this;
			setTimeout(() => {
				self.showEmailNotificationSettingsOption = true;
				self.ngxloading = false;
			}, 500);
			this.activeTabHeader = this.properties.emailNotificationSettings;
		}
		/*****XNFR-386******/
		else if (this.activeTabName == this.properties.customLoginScreen) {
			this.ngxloading = true;
			this.isCustomLoginScreenSettingsOptionClicked = false;
			let self = this;
			setTimeout(() => {
				self.isCustomLoginScreenSettingsOptionClicked = true;
				self.ngxloading = false;
			}, 500);
			this.activeTabHeader = this.properties.customLoginScreen;
		}
		this.referenceService.goToTop();
		this.showThemes();
		this.themeResponse = new CustomResponse();
	}



	ngOnDestroy() {
		if (this.isPlayed === true) { this.videoJSplayer.dispose(); }
		$('.profile-video').remove();
		$('.h-video').remove();
		this.referenceService.defaulgVideoMethodCalled = false;
		this.dragulaService.destroy('pipelineStagesDragula');
		$('#cropProfileImage').modal('hide');
		$('#addCategoryModalPopup').modal('hide');
		$('#deleteCategoryModalPopup').modal('hide');
		$('#addPipelineModalPopup').modal('hide');
		$('#addExcludeUserPopupModal').modal('hide');
		//swal.close();
	}

	configHubSpot() {
		if (this.loggedInThroughVanityUrl) {
			let providerName = 'hubspot';
			this.hubSpotCurrentUser = localStorage.getItem('currentUser');
			const encodedData = window.btoa(this.hubSpotCurrentUser);
			const encodedUrl = window.btoa(this.hubSpotRedirectURL);
			let vanityUserId = JSON.parse(this.hubSpotCurrentUser)['userId'];
			let url = null;
			if (this.hubSpotRedirectURL) {
				url = this.authenticationService.APP_URL + "v/" + providerName + "/" + vanityUserId + "/" + null + "/" + null + "/" + null;

			} else {
				url = this.authenticationService.APP_URL + "v/" + providerName + "/" + encodedData;
			}

			var x = screen.width / 2 - 700 / 2;
			var y = screen.height / 2 - 450 / 2;
			window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,resizable=yes, addressbar=no,top=" + y + ",left=" + x + ",width=700,height=485");
		}
		else if (this.hubSpotRedirectURL !== undefined && this.hubSpotRedirectURL !== '') {
			window.location.href = this.hubSpotRedirectURL;
		}
	}

	configureMicrosoft() {
		this.integrationTabIndex = 3;
		//let providerName = 'microsoft';
		//this.configureCRM(providerName, this.microsoftRedirectURL);		
	}

	// XNFR-215
	configurePipedrive() {
		this.integrationTabIndex = 6;
	}

	closeMicrosoftForm(event: any) {
		if (event === "0")
			this.integrationTabIndex = 0;
	}

	configureCRM(providerName: string, crmRedirectURL: any) {
		if (this.loggedInThroughVanityUrl) {
			let currentUser = localStorage.getItem('currentUser');
			const encodedData = window.btoa(currentUser);
			const encodedUrl = window.btoa(crmRedirectURL);
			let vanityUserId = JSON.parse(currentUser)['userId'];
			let url = null;
			if (crmRedirectURL) {
				url = this.authenticationService.APP_URL + "v/" + providerName + "/" + vanityUserId + "/" + null + "/" + null + "/" + null;
			} else {
				url = this.authenticationService.APP_URL + "v/" + providerName + "/" + encodedData;
			}

			var x = screen.width / 2 - 700 / 2;
			var y = screen.height / 2 - 450 / 2;
			window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,resizable=yes, addressbar=no,top=" + y + ",left=" + x + ",width=700,height=485");
		}
		else if (crmRedirectURL !== undefined && crmRedirectURL !== '') {
			window.location.href = crmRedirectURL;
		}
	}

	configSalesforce() {
		if (this.loggedInThroughVanityUrl) {
			/*	let providerName = 'salesforce';
				let salesforceCurrentUser = localStorage.getItem('currentUser');
				let vanityUserId = JSON.parse(salesforceCurrentUser)['userId'];
				let redirectURL = window.btoa(this.sfRedirectURL);
				let url = this.authenticationService.APP_URL + "v/" + providerName + "/" + vanityUserId + "/" + null + "/" + null + "/" + redirectURL;
				var x = screen.width / 2 - 700 / 2;
				var y = screen.height / 2 - 450 / 2;
				window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,resizable=yes, addressbar=no,top=" + y + ",left=" + x + ",width=700,height=485");*/

			let providerName = 'isalesforce';
			let salesforceCurrentUser = localStorage.getItem('currentUser');
			const encodedData = window.btoa(salesforceCurrentUser);
			const encodedUrl = window.btoa(this.sfRedirectURL);
			let vanityUserId = JSON.parse(salesforceCurrentUser)['userId'];
			let url = null;
			if (this.sfRedirectURL) {
				url = this.authenticationService.APP_URL + "v/" + providerName + "/" + vanityUserId + "/" + null + "/" + null + "/" + null;
			} else {
				url = this.authenticationService.APP_URL + "v/" + providerName + "/" + encodedData;
			}

			var x = screen.width / 2 - 700 / 2;
			var y = screen.height / 2 - 450 / 2;
			window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,resizable=yes, addressbar=no,top=" + y + ",left=" + x + ",width=700,height=485");
			//this.referenceService.showSweetAlertInfoMessage();
		}
		else if (this.sfRedirectURL !== undefined && this.sfRedirectURL !== '') {
			window.location.href = this.sfRedirectURL;
		}
	}

	/*********************GDPR Setting********************** */
	setGdpr(event: any) {
		this.gdprSetting.gdprStatus = event;
		this.gdprSetting.unsubscribeStatus = event;
		this.gdprSetting.formStatus = event;
		this.gdprSetting.termsAndConditionStatus = event;
		this.gdprSetting.deleteContactStatus = event;
		this.gdprSetting.eventStatus = event;
		if (!event) {
			this.gdprSetting.allowMarketingEmails = event;
		}
	}

	setAllGdprStatus() {
		if (!this.gdprSetting.unsubscribeStatus && !this.gdprSetting.formStatus && !this.gdprSetting.termsAndConditionStatus
			&& !this.gdprSetting.deleteContactStatus && !this.gdprSetting.eventStatus) {
			this.gdprSetting.gdprStatus = false;
			this.gdprSetting.allowMarketingEmails = false;
		} else {
			this.gdprSetting.gdprStatus = true;
		}
	}



	getGdprSettings() {
		this.gdprSetting = new GdprSetting();
		if (this.referenceService.companyId > 0) {
			this.referenceService.startLoader(this.httpRequestLoader);
			this.userService.getGdprSettingByCompanyId(this.referenceService.companyId)
				.subscribe(
					response => {
						if (response.statusCode == 200) {
							this.gdprSetting = response.data;
							this.gdprSetting.isExists = true;
						} else {
							this.gdprSetting.isExists = false;
						}
						this.referenceService.stopLoader(this.httpRequestLoader);
					},
					(error: any) => {
						this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
					},
					() => this.logger.info('Finished getGdprSettings()')
				);
		} else {
			this.customResponse = new CustomResponse('ERROR', 'Unable to get GDPR Settings.', true);
			this.referenceService.stopLoader(this.httpRequestLoader);
		}

	}

	saveGdprSetting() {
		this.gdprCustomResponse = new CustomResponse();
		this.referenceService.startLoader(this.httpRequestLoader);
		this.gdprSetting.companyId = this.referenceService.companyId;
		this.gdprSetting.createdUserId = this.loggedInUserId;
		this.userService.saveGdprSetting(this.gdprSetting)
			.subscribe(
				data => {
					this.gdprSetting.isExists = true;
					this.gdprCustomResponse = new CustomResponse('SUCCESS', 'Your settings have been saved.', true);
					this.referenceService.stopLoader(this.httpRequestLoader);
				},
				(error: any) => {
					let status = error.status;
					if (status == 409) {
						const body = error['_body'];
						const response = JSON.parse(body);
						this.gdprCustomResponse = new CustomResponse('ERROR', response.message, true);
						this.referenceService.stopLoader(this.httpRequestLoader);
					} else {
						this.gdprCustomResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
					}
				},
				() => this.logger.info('Finished saveGdprSetting()')
			);
		this.referenceService.goToTop();
	}


	updateGdprSetting() {
		this.gdprCustomResponse = new CustomResponse();
		this.referenceService.startLoader(this.httpRequestLoader);
		this.gdprSetting.updatedUserId = this.loggedInUserId;
		this.userService.updateGdprSetting(this.gdprSetting)
			.subscribe(
				data => {
					this.gdprSetting.isExists = true;
					this.gdprCustomResponse = new CustomResponse('SUCCESS', data.message, true);
					this.referenceService.stopLoader(this.httpRequestLoader);
				},
				(error: any) => {
					this.gdprCustomResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
				},
				() => this.logger.info('Finished updateGdprSetting()')
			);
		this.referenceService.goToTop();


	}
	/***************Categories*************** */
	listCategories(pagination: Pagination) {
		this.category = new Category();
		if (this.referenceService.companyId > 0) {
			pagination.companyId = this.referenceService.companyId;
			pagination.userId = this.loggedInUserId;
			if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
				pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
				pagination.vanityUrlFilter = true;
			}
			this.referenceService.startLoader(this.httpRequestLoader);
			this.userService.getCategories(pagination)
				.subscribe(
					response => {
						const data = response.data;
						pagination.totalRecords = data.totalRecords;
						pagination.previewAccess = data.previewAccess;
						this.categorySortOption.totalRecords = data.totalRecords;
						$.each(data.categories, function (_index: number, category: any) {
							category.displayTime = new Date(category.createdTimeInString);
						});
						pagination = this.pagerService.getPagedItems(pagination, data.categories);
						this.referenceService.stopLoader(this.httpRequestLoader);
					},
					(error: any) => {
						this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
					},
					() => this.logger.info('Finished listCategories()')
				);
		} else {
			this.customResponse = new CustomResponse('ERROR', 'Unable to get Categories.', true);
			this.referenceService.stopLoader(this.httpRequestLoader);
		}
	}

	/********************Pagaination&Search Code*****************/

	/*************************Sort********************** */
	sortBy(text: any) {
		this.categorySortOption.formsSortOption = text;
		this.getAllFilteredResults(this.categoryPagination);
	}


	/*************************Search********************** */
	searchCategories() {
		this.getAllFilteredResults(this.categoryPagination);
	}

	paginationDropdown(items: any) {
		this.categorySortOption.itemsSize = items;
		this.getAllFilteredResults(this.categoryPagination);
	}

	/************Page***************/
	setPage(event: any) {
		this.categoryResponse = new CustomResponse();
		this.customResponse = new CustomResponse();
		this.categoryPagination.pageIndex = event.page;
		this.listCategories(this.categoryPagination);
		if (event.type === 'excludeUsers') {
			this.excludeUserPagination.pageIndex = event.page;
			this.excludeUserPagination.maxResults = 12;
			this.listExcludedUsers(this.excludeUserPagination);
		} else if (event.type === 'excludedDomains') {
			this.excludeDomainPagination.pageIndex = event.page;
			this.excludeDomainPagination.maxResults = 12;
			this.listExcludedDomains(this.excludeDomainPagination);
		} else if (event.type === 'csvUsers') {
			this.csvUserPagination.pageIndex = event.page;
			if (event.maxResults === undefined) {
				this.csvUserPagination.maxResults = 12;
			} else {
				this.csvUserPagination.maxResults = event.maxResults;
			}
			this.csvUserPagination.totalRecords = this.excludedUsers.length;
			this.csvUsersPager = this.socialPagerService.getPager(this.excludedUsers.length, event.page, this.csvUserPagination.maxResults);
			this.csvUserPagination.pagedItems = this.excludedUsers.slice(this.csvUsersPager.startIndex, this.csvUsersPager.endIndex + 1);
			this.csvUserPagination = this.pagerService.getPagedItems(this.csvUserPagination, this.csvUserPagination.pagedItems);

		} else if (event.type === 'csvDomains') {
			this.csvDomainPagination.pageIndex = event.page;
			if (event.maxResults === undefined) {
				this.csvDomainPagination.maxResults = 12;
			} else {
				this.csvDomainPagination.maxResults = event.maxResults;
			}
			this.csvDomainPagination.totalRecords = this.excludedDomains.length;
			this.csvDomainsPager = this.socialPagerService.getPager(this.excludedDomains.length, event.page, this.csvDomainPagination.maxResults);
			this.csvDomainPagination.pagedItems = this.excludedDomains.slice(this.csvDomainsPager.startIndex, this.csvDomainsPager.endIndex + 1);
			this.csvDomainPagination = this.pagerService.getPagedItems(this.csvDomainPagination, this.csvDomainPagination.pagedItems);

		}

	}

	getAllFilteredResults(pagination: Pagination) {
		this.categoryResponse = new CustomResponse();
		this.customResponse = new CustomResponse();
		this.categoryPagination.pageIndex = 1;
		this.categoryPagination.searchKey = this.categorySortOption.searchKey;
		this.categoryPagination = this.utilService.sortOptionValues(this.categorySortOption.selectedCategoryDropDownOption, this.categoryPagination);
		this.listCategories(this.categoryPagination);
	}
	eventHandler(keyCode: any) { if (keyCode === 13) { this.searchCategories(); } }
	/********************Add*****************/

	addCategory() {
		this.isAddCategory = true;
		this.category = new Category();
		this.categoryModalTitle = 'Enter Folder Details';
		this.categoyButtonSubmitText = "Save";
		this.listExistingCategoryNames();
	}
	closeCategoryModal() {
		$('#addCategoryModalPopup').modal('hide');
		this.referenceService.stopLoader(this.addCategoryLoader);
		this.category = new Category();
		this.removeCategoryNameErrorClass();
		this.categoryResponse = new CustomResponse();
		this.isAddCategory = false;
	}

	validateCategoryNames(name: string) {
		if ($.trim(name).length > 0) {
			if (this.existingCategoryNames.indexOf($.trim(name).toLowerCase()) > -1 && $.trim(name).toLowerCase() != this.existingCategoryName) {
				this.addCategoryNameErrorMessage(this.duplicateLabelMessage);
			} else {
				this.removeCategoryNameErrorClass();
			}
		} else {
			this.addCategoryNameErrorMessage(this.requiredMessage);
		}
	}

	addCategoryNameErrorMessage(errorMessage: string) {
		this.category.isValid = false;
		$('#categoryNameDiv').addClass(this.formErrorClass);
		this.categoryNameErrorMessage = errorMessage;
	}

	removeCategoryNameErrorClass() {
		$('#categoryNameDiv').removeClass(this.formErrorClass);
		$('#categoryNameDiv').addClass(this.defaultFormClass);
		this.category.isValid = true;
		this.categoryResponse = new CustomResponse();
		this.categoryNameErrorMessage = "";

	}

	sumbitOnEnter(event: any) {
		if (event.keyCode == 13 && this.category.isValid) {
			this.saveOrUpdateCategory();
		}
	}

	listExistingCategoryNames() {
		this.userService.listExistingCategoryNames(this.referenceService.companyId)
			.subscribe(
				data => {
					this.existingCategoryNames = data.data.map((a: { name: any; }) => a.name);
					if (this.isAddCategory) {
						$('#addCategoryModalPopup').modal('show');
						this.category.isValid = false;
					} else if (this.isDeleteCategory) {
						this.exisitingCategories = data.data.filter((item: { id: number; }) => item.id !== this.category.id);;
						$('#deleteCategoryModalPopup').modal('show');
					}
				},
				error => {
					this.referenceService.showSweetAlertErrorMessage(this.referenceService.serverErrorMessage);
				},
				() => {
					this.logger.info("Finished listExistingCategoryNames()");
				}
			);
	}


	saveOrUpdateCategory() {
		this.referenceService.startLoader(this.addCategoryLoader);
		this.category.createdUserId = this.loggedInUserId;
		this.userService.saveOrUpdateCategory(this.category)
			.subscribe(
				(result: any) => {
					this.closeCategoryModal();
					if (result.access) {
						this.referenceService.stopLoader(this.addCategoryLoader);
						this.categoryResponse = new CustomResponse('SUCCESS', result.message, true);
						this.categoryPagination = new Pagination();
						this.listCategories(this.categoryPagination);
					} else {
						this.authenticationService.forceToLogout();
					}

				},
				(error: string) => {
					this.referenceService.stopLoader(this.addCategoryLoader);
					let statusCode = JSON.parse(error['status']);
					if (statusCode == 409) {
						this.addCategoryNameErrorMessage(this.duplicateLabelMessage);
					} else {
						this.referenceService.showSweetAlertErrorMessage(this.referenceService.serverErrorMessage);
					}
				});

	}


	getCategoryById(category: Category) {
		if (!category.defaultCategory) {
			let id = category.id;
			this.isAddCategory = false;
			this.categoyButtonSubmitText = "Update";
			$('#addCategoryModalPopup').modal('show');
			this.referenceService.startLoader(this.addCategoryLoader);
			this.categoryModalTitle = 'Edit Folder Details';
			this.listExistingCategoryNames();
			this.userService.getCategoryById(id)
				.subscribe(
					(result: any) => {
						if (result.statusCode == 200) {
							this.category = result.data;
							this.existingCategoryName = $.trim(this.category.name.toLowerCase());
							this.category.isValid = true;
						} else {
							$('#addCategoryModalPopup').modal('hide');
							this.referenceService.showSweetAlertErrorMessage(result.message);
						}
						this.referenceService.stopLoader(this.addCategoryLoader);
					},
					(error: string) => {
						$('#addCategoryModalPopup').modal('hide');
						this.referenceService.showSweetAlertErrorMessage(this.referenceService.serverErrorMessage);
					});
		}

	}


	/***********Delete**************/
	confirmDeleteCategory(category: Category) {
		if (category.count > 0) {
			this.isDeleteCategory = true;
			this.category = category;
			this.listExistingCategoryNames();
		} else {
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
					self.deleteById(category);
				}, function (dismiss: any) {
					console.log('you clicked on option' + dismiss);
				});
			} catch (error) {
				this.logger.error(this.referenceService.errorPrepender + " confirmDelete():" + error);
				this.referenceService.showServerError(this.httpRequestLoader);
			}
		}

	}

	closeDeleteCategoryModal() {
		$('#deleteCategoryModalPopup').modal('hide');
		this.isDeleteCategory = false;
		this.category = new Category();
		this.selectedCategoryIdForTransferItems = 0;
	}
	deleteCategoryWithoutTransferring() {
		this.deleteById(this.category);
	}

	moveAndDeleteCategory() {
		$('#deleteCategoryModalPopup').modal('hide');
		this.category.isMoveAndDelete = true;
		this.category.idToMoveItems = this.selectedCategoryIdForTransferItems;
		this.deleteById(this.category);
	}
	deleteById(category: Category) {
		this.categoryResponse = new CustomResponse();
		this.referenceService.loading(this.httpRequestLoader, true);
		this.referenceService.goToTop();
		this.userService.deleteCategory(category)
			.subscribe(
				(response: any) => {
					this.closeDeleteCategoryModal();
					if (response.access) {
						if (response.statusCode == 200) {
							let message = category.name + " Deleted Successfully";
							this.categoryResponse = new CustomResponse('SUCCESS', message, true);
							this.categoryPagination.pageIndex = 1;
							this.listCategories(this.categoryPagination);
						}
					} else {
						this.authenticationService.forceToLogout();
					}

				},
				(error: string) => {
					this.referenceService.showServerErrorMessage(this.httpRequestLoader);
					this.categoryResponse = new CustomResponse('ERROR', this.httpRequestLoader.message, true);
				}
			);
	}

	previewItems(category: Category) {
		this.hasItems = false;
		this.categoryPreviewItem = new CategoryPreviewItem();
		this.isFolderPreview = true;
		this.referenceService.startLoader(this.folderPreviewLoader);
		this.userService.getItemsCount(category.id, this.loggedInUserId)
			.subscribe(
				(response: any) => {
					this.categoryPreviewItem.items = response.data;
					this.categoryPreviewItem.categoryId = category.id;
					this.categoryPreviewItem.categoryName = category.name;
					this.referenceService.stopLoader(this.folderPreviewLoader);
				},
				(error: string) => {
					this.referenceService.stopLoader(this.folderPreviewLoader);
					this.referenceService.showSweetAlertErrorMessage(this.referenceService.serverErrorMessage);
				}
			);
	}

	goToFolder(categoryId: number, item: any) {
		let count = item.moduleItemsCount;
		let type = item.moduleName;
		if (count > 0 && item.previewAccess) {
			this.ngxloading = true;
			if ("Templates" == type) {
				this.router.navigate(['/home/emailtemplates/manage/' + categoryId]);
			} else if ("Forms" == type) {
				this.router.navigate(['/home/forms/manage/' + categoryId]);
			} else if ("Pages" == type) {
				this.router.navigate(['/home/pages/manage/' + categoryId]);
			} else if ("Campaigns" == type) {
				this.router.navigate(['/home/campaigns/manage/' + categoryId]);
			} else if ("Asset Library" == type) {
				this.router.navigate(['/home/dam/manage/l/' + categoryId + '/fg']);
			} else if ("Track Builder" == type) {
				this.router.navigate(['/home/tracks/manage/l/' + categoryId + '/fg']);
			} else if ("Play Book" == type) {
				this.router.navigate(['/home/playbook/manage/l/' + categoryId + '/fg']);
			}
		}

	}

	/*************Default Display View */

	getModulesDisplayDefaultView() {
		this.modulesDisplayTypeError = false;
		this.modulesDisplayViewcustomResponse = new CustomResponse();
		this.userService.getModulesDisplayDefaultView(this.authenticationService.getUserId())
			.subscribe(
				data => {
					if (data.statusCode == 200) {
						this.modulesDisplayTypeString = data.data;
					} else {
						this.modulesDisplayTypeError = true;
						this.modulesDisplayViewcustomResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
					}
				},
				error => {
					this.modulesDisplayTypeError = true;
					this.modulesDisplayViewcustomResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
				},
				() => { }
			);
	}

	setDefaultView() {
		this.ngxloading = true;
		this.modulesDisplayViewcustomResponse = new CustomResponse();
		this.updateDisplayViewError = false;
		let selectedValue = $("input[name=moduleDisplayType]:checked").val();
		this.userService.updateDefaultDisplayView(this.authenticationService.getUserId(), selectedValue)
			.subscribe(
				data => {
					this.ngxloading = false;
					if (data.statusCode == 200) {
						this.referenceService.showSweetAlertSuccessMessage(data.message);
						localStorage.setItem('defaultDisplayType', selectedValue);
					} else {
						this.updateDisplayViewError = true;
						this.referenceService.showSweetAlertFailureMessage(this.properties.serverErrorMessage);
					}
				},
				error => {
					this.updateDisplayViewError = true;
					this.ngxloading = false;
					this.referenceService.showSweetAlertFailureMessage(this.properties.serverErrorMessage);
				},
				() => { }
			);
	}

	selectedLanguage(event: any) {
		//this.translateService.use(this.selectedLanguageCode);        
	}
	/*********** XNFR-233 */
	openBeeEditor(event: any) {
		this.xamplifyDefaultTemplate = event;
		this.editXamplifyDefaultTemplate = true;
		this.editCustomLoginTemplate = false;
	}
	jsonBody: any;
	beeContainerInput = {};
	editCustomLoginTemplate: boolean = false;
	cutomLoginTemplate: CustomLoginTemplate;
	openBeeEditorForLoginTemplate(event: any) {
		this.cutomLoginTemplate = event;
		this.editCustomLoginTemplate = true;
		this.jsonBody = this.cutomLoginTemplate.jsonBody;
		this.beeContainerInput["module"] = "configuration";
		this.beeContainerInput["jsonBody"] = this.jsonBody;
		this.beeContainerInput["customLognTemplate"] = this.cutomLoginTemplate;
		this.editXamplifyDefaultTemplate = false;
	}

	changeLoginTemplateNameEvent(event:any) {
		this.cutomLoginTemplate.name = event.replace(/\s/g, '')
	}
	saveOrUpdateCustomLogInTempalte(cutomLoginTemplate:CustomLoginTemplate){
		this.vanityUrlService.saveCustomLoginTemplate(cutomLoginTemplate).subscribe(result => {
			if (result.statusCode === 200) {
				// this.goBackToMyprofileForCustomLogin();
				this.customLoginTemplateResponse = new CustomResponse('SUCCESS', result.message, true);
			} else {
				this.customLoginTemplateResponse = new CustomResponse('ERROR', result.data.errorMessages[0].message, true);
			}
		}, error => {
			this.customLoginTemplateResponse = new CustomResponse('ERROR', this.properties.VANITY_URL_EMAIL_TEMPLATE_ERROR_TEXT, true)
		});

	}

	readBeeTemplateData(event: any) {
		this.ngxloading = true;
		this.cutomLoginTemplate.jsonBody = event.jsonContent;
		this.cutomLoginTemplate.htmlBody = event.htmlContent;
		this.cutomLoginTemplate.loggedInUserId = this.authenticationService.getUserId();
		this.getBeeTemplateImagePath(event.htmlContent);
		this.saveOrUpdateCustomLogInTempalte(this.cutomLoginTemplate);
		this.ngxloading = false;
	}
	getBeeTemplateImagePath(htmlContent: any): string {
		const imageUrls: string[] = [];
		let imagePath: any;
		const imgTagRegex = /<img [^>]*src="([^"]*)"[^>]*>/g;
		let match;
		while ((match = imgTagRegex.exec(htmlContent))) {
			const imageUrl = match[1];
			imagePath = imageUrl;
			imageUrls.push(imageUrl);
		}
		return imagePath;
	}
	isTemplatesListDiv = false;
	goBackToMyprofileForCustomLogin() {
		this.editCustomLoginTemplate = false;
		this.editXamplifyDefaultTemplate = false;
		this.isTemplatesListDiv = true;
		this.cutomLoginTemplate = new CustomLoginTemplate();
		this.referenceService.goToTop();
	}
	/*** XNFR-233 ******/
	goBackToMyProfile() {
		this.editXamplifyDefaultTemplate = false;
		this.editCustomLoginTemplate = false;
		this.xamplifyDefaultTemplate = new VanityEmailTempalte();
		this.referenceService.goToTop();
	}

	setSubjectLineTooltipText() {
		this.subjectLineTooltipText = "Set your own subject line"
	}

	salesforceSettings() {
		this.sfcfPagedItems = [];
		this.sfcfMasterCBClicked = false;
		this.customFieldsResponse.isVisible = false;
		//this.integrationTabIndex = 2;
		this.integrationType = 'SALESFORCE';
		this.integrationTabIndex = 5;
		//this.listSalesforceCustomFields();
	}

	hubspotSettings() {
		this.sfcfPagedItems = [];
		this.sfcfMasterCBClicked = false;
		this.customFieldsResponse.isVisible = false;
		this.integrationType = 'HUBSPOT';
		this.integrationTabIndex = 5;

		//this.listExternalCustomFields('hubspot');
	}

	microsoftSettings() {
		this.sfcfPagedItems = [];
		this.sfcfMasterCBClicked = false;
		this.customFieldsResponse.isVisible = false;
		this.integrationType = 'MICROSOFT';
		this.integrationTabIndex = 5;
	}

	// xnfr-215
	pipedriveSettings() {
		this.sfcfPagedItems = [];
		this.sfcfMasterCBClicked = false;
		this.customFieldsResponse.isVisible = false;
		this.integrationType = 'PIPEDRIVE';
		this.integrationTabIndex = 5;
	}

	// xnfr-215
	connectwiseSettings() {
		this.sfcfPagedItems = [];
		this.sfcfMasterCBClicked = false;
		this.customFieldsResponse.isVisible = false;
		this.integrationType = 'CONNECTWISE';
		this.integrationTabIndex = 5;
	}

	marketoSettings() {
		this.sfcfPagedItems = [];
		this.sfcfMasterCBClicked = false;
		this.customFieldsResponse.isVisible = false;
		this.integrationType = 'MARKETO';
		this.integrationTabIndex = 5;
	}

	listExternalCustomFields(type: string) {
		let self = this;
		self.selectedCfIds = [];
		self.integrationService.listExternalCustomFields(type, this.loggedInUserId)
			.subscribe(
				data => {
					this.ngxloading = false;
					if (data.statusCode == 200) {
						this.sfCustomFieldsResponse = data.data;
						this.sfcfMasterCBClicked = false;
						$.each(this.sfCustomFieldsResponse, function (_index: number, customField) {
							if (customField.selected) {
								self.selectedCfIds.push(customField.name);
							}

							if (customField.required) {
								self.requiredCfIds.push(customField.name);
								if (!customField.selected) {
									self.selectedCfIds.push(customField.name);
								}
							}
						});
						this.setSfCfPage(1);
					}
				},
				error => {
					this.ngxloading = false;
				},
				() => { }
			);

	}
	listSalesforceCustomFields() {
		let self = this;
		self.selectedCfIds = [];
		self.integrationService.listSalesforceCustomFields(this.loggedInUserId)
			.subscribe(
				data => {
					this.ngxloading = false;
					if (data.statusCode == 200) {
						this.sfCustomFieldsResponse = data.data;
						this.sfcfMasterCBClicked = false;
						$.each(this.sfCustomFieldsResponse, function (_index: number, customField) {
							if (customField.selected) {
								self.selectedCfIds.push(customField.name);
							}

							if (customField.required) {
								self.requiredCfIds.push(customField.name);
								if (!customField.selected) {
									self.selectedCfIds.push(customField.name);
								}
							}
						});
						this.setSfCfPage(1);
					}
				},
				error => {
					this.ngxloading = false;
				},
				() => { }
			);
	}

	closeSfSettings() {
		this.integrationTabIndex = 0;
	}

	saveCustomFieldsSelection(type: string) {
		this.ngxloading = true;
		let self = this;
		this.selectedCustomFieldIds = [];
		$('[name="sfcf[]"]:checked').each(function () {
			var id = $(this).val();
			self.selectedCustomFieldIds.push(id);
		});

		this.integrationService.syncCustomForm(this.loggedInUserId, this.selectedCfIds, type)
			.subscribe(
				data => {
					this.ngxloading = false;
					if (data.statusCode == 200) {
						this.customFieldsResponse = new CustomResponse('SUCCESS', "Submitted Successfully", true);
						this.listExternalCustomFields(type);
					}
				},
				error => {
					this.ngxloading = false;
				},
				() => { }
			);
	}

	submitSfSettings() {
		this.ngxloading = true;
		let self = this;
		this.selectedCustomFieldIds = [];
		$('[name="sfcf[]"]:checked').each(function () {
			var id = $(this).val();
			self.selectedCustomFieldIds.push(id);
		});

		this.integrationService.syncSalesforceCustomForm(this.loggedInUserId, this.selectedCfIds)
			.subscribe(
				data => {
					this.ngxloading = false;
					if (data.statusCode == 200) {
						this.customFieldsResponse = new CustomResponse('SUCCESS', "Submitted Successfully", true);
						this.listSalesforceCustomFields();
					}
				},
				error => {
					this.ngxloading = false;
				},
				() => { }
			);
	}

	setSfCfPage(page: number) {
		this.paginatedSelectedIds = [];
		try {
			if (page < 1 || (this.sfcfPager.totalPages > 0 && page > this.sfcfPager.totalPages)) {
				return;
			}
			this.sfcfPager = this.socialPagerService.getPager(this.sfCustomFieldsResponse.length, page, this.pageSize);
			this.sfcfPagedItems = this.sfCustomFieldsResponse.slice(this.sfcfPager.startIndex, this.sfcfPager.endIndex + 1);
			var cfIds = this.sfcfPagedItems.map(function (a) { return a.name; });
			var items = $.grep(this.selectedCfIds, function (element) {
				return $.inArray(element, cfIds) !== -1;
			});
			if (items.length == this.sfcfPager.pageSize || items.length == this.sfCustomFieldsResponse.length || items.length == this.sfcfPagedItems.length) {
				this.isHeaderCheckBoxChecked = true;
			} else {
				this.isHeaderCheckBoxChecked = false;
			}

			if (items) {
				for (let i = 0; i < items.length; i++) {
					this.paginatedSelectedIds.push(items[i]);
				}
			}
		} catch (error) {
			// this.xtremandLogger.error( error, "setSfCfPage()." )
		}

	}

	selectedPageNumber(event) {
		this.pageNumber.value = event;
		if (event === 0) { event = this.sfCustomFieldsResponse.length; }
		this.pageSize = event;
		this.setSfCfPage(1);
	}

	/***********Re configure**************/
	reConfigSalesforce() {
		try {
			const self = this;
			swal({
				title: 'Salesforce Re-configuration?',
				text: 'Are you sure? All data related to existing Salesforce account will be deleted by clicking Yes.',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#54a7e9',
				cancelButtonColor: '#999',
				confirmButtonText: 'Yes'

			}).then(function () {
				self.configSalesforce();
			}, function (dismiss: any) {
				console.log('you clicked on option' + dismiss);
			});
		} catch (error) {
			this.logger.error(this.referenceService.errorPrepender + " confirmDelete():" + error);
			this.ngxloading = false;
		}
	}

	sfcfMasterCB() {
		//let checked = e.target.checked;
		this.sfcfMasterCBClicked = true;
	}

	checkAll(ev: any) {
		if (ev.target.checked) {
			$('[name="sfcf[]"]').prop('checked', true);
			let self = this;
			$('[name="sfcf[]"]:checked').each(function () {
				var id = $(this).val();
				self.selectedCfIds.push(id);
				self.paginatedSelectedIds.push(id);
			});
			this.selectedCfIds = this.referenceService.removeDuplicates(this.selectedCfIds);
			this.paginatedSelectedIds = this.referenceService.removeDuplicates(this.paginatedSelectedIds);
		} else {
			let self = this;
			//$( '[name="sfcf[]"]' ).prop( 'checked', false );

			$('[name="sfcf[]"]').each(function () {
				var id = $(this).val();
				if (self.requiredCfIds.indexOf(id) == -1) {
					$(this).prop('checked', false);
					self.paginatedSelectedIds.splice($.inArray(id, self.paginatedSelectedIds), 1);
				}

			});

			if (this.sfcfPager.maxResults == this.sfcfPager.totalItems) {
				this.selectedCfIds = [];
				this.paginatedSelectedIds = [];
				//this.allselectedUsers.length = 0;
			} else {
				//this.paginatedSelectedIds = [];
				let currentPageCfIds = this.sfcfPagedItems.map(function (a) { return a.name; });
				this.paginatedSelectedIds = this.referenceService.removeDuplicates(this.paginatedSelectedIds);
				this.selectedCfIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedCfIds, currentPageCfIds);
			}
		}
		ev.stopPropagation();
	}

	selectCf(cfName: string) {
		let isChecked = $('#' + cfName).is(':checked');
		if (isChecked) {
			if (this.selectedCfIds.indexOf(cfName) == -1) {
				this.selectedCfIds.push(cfName);
			}
			if (this.paginatedSelectedIds.indexOf(cfName) == -1) {
				this.paginatedSelectedIds.push(cfName);
			}
		} else {
			this.selectedCfIds.splice($.inArray(cfName, this.selectedCfIds), 1);
			this.paginatedSelectedIds.splice($.inArray(cfName, this.paginatedSelectedIds), 1);

		}
		if (this.paginatedSelectedIds.length == this.sfcfPagedItems.length) {
			this.isHeaderCheckBoxChecked = true;
		} else {
			this.isHeaderCheckBoxChecked = false;
		}
		event.stopPropagation();
	}

	addPipeline() {
		this.pipelineModalTitle = "Add a Pipeline";
		$('#addPipelineModalPopup').modal('show');
	}

	viewPipeline(pipelineToView: Pipeline) {
		let self = this;
		this.pipelineModalTitle = "View Pipeline";
		$('#addPipelineModalPopup').modal('show');
		this.referenceService.startLoader(this.addPipelineLoader);
		this.pipelinePreview = true;
		this.getPipeline(pipelineToView);
	}

	editPipeline(pipeline: Pipeline) {
		this.pipelineModalTitle = "Edit Pipeline";
		$('#addPipelineModalPopup').modal('show');
		this.referenceService.startLoader(this.addPipelineLoader);
		this.getPipeline(pipeline);
	}

	getPipeline(pipeline: Pipeline) {
		let self = this;
		this.dashBoardService.getPipeline(pipeline.id, this.loggedInUserId)
			.subscribe(
				data => {
					this.ngxloading = false;
					if (data.statusCode == 200) {
						self.pipeline = data.data;
						let orderedStages = new Array<PipelineStage>();
						self.pipeline.stages.forEach(function (stage, index) {
							if (stage.won === true) {
								stage.markAs = "won";
							} else if (stage.lost === true) {
								stage.markAs = "lost";
							} else {
								stage.markAs = "markAs"
							}
							orderedStages[stage.displayIndex - 1] = stage;
							if (stage.defaultStage === true) {
								self.defaultStageIndex = stage.displayIndex - 1;
							}
						});
						self.pipeline.stages = orderedStages;
						self.pipeline.isValidStage = true;
						self.pipeline.isValidName = true;
						self.pipeline.isValid = true;
					} else {
						this.closePipelineModal();
						this.pipelineResponse = new CustomResponse('ERROR', data.message, true);
					}
					this.referenceService.stopLoader(this.addPipelineLoader);
				},
				error => {
					this.ngxloading = false;
				},
				() => { }
			);
	}

	closePipelineModal() {
		$('#addPipelineModalPopup').modal('hide');
		this.referenceService.stopLoader(this.addPipelineLoader);
		this.pipelineModalResponse = new CustomResponse();
		this.pipeline = new Pipeline();
		this.addDefaultPipelineStages();
		this.removePipelineNameErrorClass();
		this.removePipelineStageErrorClass();
		this.defaultStageIndex = 0;
		this.pipelineType = 'LEAD';
		this.pipeline.isValid = false;
		this.pipeline.isValidStage = false;
		this.pipeline.isValidName = false;
		this.pipelinePreview = false;
	}

	validatePipelineName(name: string) {
		if ($.trim(name).length > 0) {
			this.removePipelineNameErrorClass();
			this.pipeline.isValid = this.pipeline.isValidName && this.pipeline.isValidStage;
		} else {
			this.addPipelineNameErrorMessage(this.requiredMessage);
		}
	}

	validateStage(stageName: string) {
		if ($.trim(stageName).length > 0) {
			this.removePipelineStageErrorClass();
			this.pipeline.isValid = this.pipeline.isValidName && this.pipeline.isValidStage;
		} else {
			let validStages = false;
			this.pipeline.stages.forEach(function (stage, index) {
				if (($.trim(stage.stageName).length > 0)) {
					validStages = true;
				}
			});
			if (!validStages) {
				this.addPipelineStageErrorMessage(this.requiredStageMessage);
			}
		}
	}

	addPipelineNameErrorMessage(errorMessage: string) {
		this.pipeline.isValidName = false;
		this.pipeline.isValid = false;
		$('#pipelineNameDiv').addClass(this.formErrorClass);
		this.pipelineNameErrorMessage = errorMessage;
	}

	addPipelineStageErrorMessage(errorMessage: string) {
		this.pipeline.isValidStage = false;
		this.pipeline.isValid = false;
		$('#pipelineStageDiv').addClass(this.formErrorClass);
		this.pipelineStageErrorMessage = errorMessage;
	}

	removePipelineNameErrorClass() {
		$('#pipelineNameDiv').removeClass(this.formErrorClass);
		$('#pipelineNameDiv').addClass(this.defaultFormClass);
		this.pipeline.isValidName = true;
		this.pipelineResponse = new CustomResponse();
		this.pipelineNameErrorMessage = "";
	}

	removePipelineStageErrorClass() {
		$('#pipelineStageDiv').removeClass(this.formErrorClass);
		$('#pipelineStageDiv').addClass(this.defaultFormClass);
		this.pipeline.isValidStage = true;
		this.pipelineResponse = new CustomResponse();
		this.pipelineStageErrorMessage = "";

	}

	pipelineSumbitOnEnter(event: any) {
		if (event.keyCode == 13 && this.pipeline.isValid) {
			this.saveOrUpdatePipeline();
		}
	}

	saveOrUpdatePipeline() {
		//this.referenceService.startLoader(this.addPipelineLoader);  
		let self = this;
		this.pipeline.userId = this.loggedInUserId;
		if (this.activeTabName == "leadPipelines") {
			this.pipeline.type = "LEAD";
		} else if (this.activeTabName == "dealPipelines") {
			this.pipeline.type = "DEAL";
		}
		let removeIndices = new Array();
		this.pipeline.stages.forEach(function (stage, index) {
			if (stage.stageName !== undefined && $.trim(stage.stageName).length > 0) {
				if (stage.markAs === "won") {
					stage.won = true;
					stage.lost = false;
				} else if (stage.markAs === "lost") {
					stage.lost = true;
					stage.won = false;
				} else {
					stage.won = false;
					stage.lost = false;
				}
				stage.defaultStage = false;
			} else {
				removeIndices.push(index);
			}
		});

		for (let i = removeIndices.length - 1; i >= 0; i--) {
			self.pipeline.stages.splice(removeIndices[i], 1);
		}
		//    removeIndices.forEach(function(removeIndex, index) {
		//     self.pipeline.stages.splice(removeIndex, 1);
		//    });
		this.pipeline.stages[this.defaultStageIndex].defaultStage = true;
		this.dashBoardService.saveOrUpdatePipeline(this.pipeline)
			.subscribe(
				data => {
					this.ngxloading = false;
					if (data.statusCode == 200) {
						this.closePipelineModal();
						this.pipelineResponse = new CustomResponse('SUCCESS', "Pipeline Submitted Successfully", true);
						this.listAllPipelines(this.pipelinePagination);
					} else if (data.statusCode == 500) {
						this.pipelineModalResponse = new CustomResponse('ERROR', data.message, true);
					}
				},
				error => {
					this.ngxloading = false;
				},
				() => { }
			);
	}

	addDefaultPipelineStages() {
		for (var i = 0; i < 4; i++) {
			this.addStage();
		}
		this.pipeline.stages[0].defaultStage = true;
	}

	deleteStage(divIndex: number) {
		const deletedStage = this.pipeline.stages.splice(divIndex, 1)[0];
		if (this.defaultStageIndex > divIndex) {
			this.defaultStageIndex = this.defaultStageIndex - 1;
		}
		if (this.pipeline.stages.length === 1) {
			this.pipeline.stages[0].private = false;
		}
		if (deletedStage.private) {
			const selectedStages = this.pipeline.stages.filter(item => item.private);
			if (selectedStages.length === 0) {
				this.pipeline.stages[this.pipeline.stages.length - 1].canDelete = false;
			}
		}
	}

	addStage() {
		let pipelineStage = new PipelineStage();
		pipelineStage.markAs = "markAs";
		pipelineStage.canDelete = true;
		this.pipeline.stages.push(pipelineStage);
	}

	listAllPipelines(pagination: Pagination) {
		this.ngxloading = true;
		let type: string;
		if (this.activeTabName == "leadPipelines") {
			type = "LEAD";
		} else if (this.activeTabName == "dealPipelines") {
			type = "DEAL";
		}
		pagination.userId = this.loggedInUserId;
		pagination.pipelineType = type;
		this.dashBoardService.listAllPipelines(pagination)
			.subscribe(
				response => {
					this.ngxloading = false;
					// this.pipelines = response.data; 
					pagination.totalRecords = response.totalRecords;
					this.pipelineSortOption.totalRecords = response.totalRecords;
					pagination = this.pagerService.getPagedItems(pagination, response.data);
				},
				error => {
					this.ngxloading = false;
				},
				() => { }
			);
	}

	confirmDeletePipeline(pipeline: Pipeline) {
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
				self.deletePipeline(pipeline);
			}, function (dismiss: any) {
				console.log('you clicked on option' + dismiss);
			});
		} catch (error) {
			this.logger.error(this.referenceService.errorPrepender + " confirmDelete():" + error);
			this.referenceService.showServerError(this.httpRequestLoader);
		}

	}

	deletePipeline(pipeline: Pipeline) {
		pipeline.userId = this.loggedInUserId;
		this.pipelineResponse = new CustomResponse();
		this.referenceService.goToTop();
		this.dashBoardService.deletePipeline(pipeline)
			.subscribe(
				(response: any) => {
					// this.closeDeleteCategoryModal();
					if (response.statusCode == 200) {
						let message = pipeline.name + " Deleted Successfully";
						this.pipelineResponse = new CustomResponse('SUCCESS', message, true);
						this.pipelinePagination.pageIndex = 1;
						this.listAllPipelines(this.pipelinePagination);
					} else if (response.statusCode == 400) {
						this.pipelineResponse = new CustomResponse('ERROR', response.message, true);
					}
				},
				(error: string) => {
					this.referenceService.showServerErrorMessage(this.httpRequestLoader);
					this.pipelineResponse = new CustomResponse('ERROR', this.httpRequestLoader.message, true);
				}
			);
	}

	syncPipeline(pipeline: Pipeline) {
		let self = this;
		this.ngxloading = true;
		if (pipeline.integrationType === "SALESFORCE") {
			this.dashBoardService.syncPipeline(pipeline.id, this.loggedInUserId)
				.subscribe(
					data => {
						this.ngxloading = false;
						if (data.statusCode == 200) {
							let message = pipeline.name + " Synchronized Successfully";
							this.pipelineResponse = new CustomResponse('SUCCESS', message, true);
							this.pipelinePagination.pageIndex = 1;
							this.listAllPipelines(this.pipelinePagination);
						} else if (data.statusCode === 401 && data.message === "Expired Refresh Token") {
							this.referenceService.loading(this.httpRequestLoader, false);
							this.pipelineResponse = new CustomResponse('ERROR', "Your Salesforce Integration was expired. Please re-configure.", true);
						} else {
							this.closePipelineModal();
							this.pipelineResponse = new CustomResponse('ERROR', data.message, true);
						}
					},
					error => {
						this.ngxloading = false;
						this.referenceService.showServerErrorMessage(this.httpRequestLoader);
						this.pipelineResponse = new CustomResponse('ERROR', this.httpRequestLoader.message, true);
					},
					() => { }
				);
		} else {
			this.integrationService.syncPipeline(pipeline.id, this.loggedInUserId)
				.subscribe(
					data => {
						this.ngxloading = false;
						if (data.statusCode == 200) {
							let message = pipeline.name + " Synchronized Successfully";
							this.pipelineResponse = new CustomResponse('SUCCESS', message, true);
							this.pipelinePagination.pageIndex = 1;
							this.listAllPipelines(this.pipelinePagination);
						} else {
							this.closePipelineModal();
							this.pipelineResponse = new CustomResponse('ERROR', data.message, true);
						}
					},
					error => {
						this.ngxloading = false;
						this.referenceService.loading(this.httpRequestLoader, false);
						let errorMessage = this.referenceService.getApiErrorMessage(error);
						this.pipelineResponse = new CustomResponse('ERROR', errorMessage, true);
					},
					() => { }
				);

		}

	}


	/*************************Search********************** */
	searchPipelines() {
		this.getAllFilteredResultsPipeline(this.pipelinePagination);
	}

	pipelinePaginationDropdown(items: any) {
		this.pipelineSortOption.itemsSize = items;
		this.getAllFilteredResults(this.pipelinePagination);
	}

	/************Page************** */
	setPipelinePage(event: any) {
		this.pipelineResponse = new CustomResponse();
		this.customResponse = new CustomResponse();
		this.pipelinePagination.pageIndex = event.page;
		this.listAllPipelines(this.pipelinePagination);
	}

	getAllFilteredResultsPipeline(pagination: Pagination) {
		this.pipelineResponse = new CustomResponse();
		this.customResponse = new CustomResponse();
		this.pipelinePagination.pageIndex = 1;
		this.pipelinePagination.searchKey = this.pipelineSortOption.searchKey;
		//this.pipelinePagination = this.utilService.sortOptionValues(this.pipelineSortOption.selectedCategoryDropDownOption, this.pipelinePagination);
		this.listAllPipelines(this.pipelinePagination);
	}
	pipelineEventHandler(keyCode: any) { if (keyCode === 13) { this.searchPipelines(); } }

	addContactModalOpen() {
		this.addContactuser = new User();
		$('#addExcludeUserPopupModal').modal('show');
	}

	validateEmail(emailId: string) {
		const lowerCaseEmail = emailId.toLowerCase();
		if (this.validateEmailAddress(lowerCaseEmail)) {
			this.validEmailPattern = true;
		}
	}

	validateEmailAddress(emailId: string) {
		var EMAIL_ID_PATTERN = this.regularExpressions.EMAIL_ID_PATTERN;
		return EMAIL_ID_PATTERN.test(emailId);
	}

	addContactModalClose() {
		$('#addExcludeUserPopupModal').modal('hide');
		$('.modal').removeClass('show');
		this.validEmailPatternSuccess = true;
		this.validEmailFormat = true;
		this.isEmailExist = false;
		this.validEmailPattern = false;
	}

	checkingEmailPattern(emailId: string) {
		this.validEmailFormat = true;
		this.isEmailExist = false;
		this.validEmailPatternSuccess = false;
		if (this.validateEmailAddress(emailId)) {
			this.validEmailPatternSuccess = true;
		} else {
			this.validEmailPatternSuccess = false;
		}
	}

	getCompanyName() {
		let companyName = " your company";
		if (this.currentUser != undefined) {
			if (this.currentUser['logedInCustomerCompanyNeme'] != undefined) {
				companyName = this.currentUser['logedInCustomerCompanyNeme'];
			}
		}
		return companyName;
	}

	confirmAndsaveExcludedUser(excludedUser: User) {
		let emailId = '<strong>' + excludedUser.emailId + '</strong>';
		let companyName = '<strong>' + this.getCompanyName() + "</strong>.";
		let text = "Adding this email to your exclusion list ensures that " + emailId + " no longer receives any campaigns from " + companyName;
		let self = this;
		swal({
			title: 'Are you sure want to continue?',
			text: text,
			type: 'warning',
			showCancelButton: true,
			swalConfirmButtonColor: '#54a7e9',
			swalCancelButtonColor: '#999',
			allowOutsideClick: false,
			confirmButtonText: 'Yes'
		}).then(function () {
			self.saveExcludedUser(excludedUser);
		}, function (dismiss: any) {
			console.log('you clicked on option' + dismiss);
		});
	}

	saveExcludedUser(excludedUser: User) {
		this.referenceService.startLoader(this.excludeUserLoader);
		this.validEmailFormat = true;
		this.isEmailExist = false;
		this.excludedUsers = [];
		this.excludedUsers.push(excludedUser);
		this.userService.saveExcludedUsers(this.excludedUsers, this.loggedInUserId)
			.subscribe(
				data => {
					if (data.statusCode == 200) {
						this.addContactModalClose();
						this.excludeUserCustomResponse = new CustomResponse('SUCCESS', this.properties.exclude_add, true);
						this.listExcludedUsers(this.excludeUserPagination);
						this.referenceService.stopLoader(this.excludeUserLoader);
					} else if (data.statusCode == 401) {
						this.referenceService.stopLoader(this.excludeUserLoader);
						this.validEmailFormat = false;
					} else if (data.statusCode == 402) {
						this.referenceService.stopLoader(this.excludeUserLoader);
						this.isEmailExist = true;
					}
				},
				error => {
					this.referenceService.stopLoader(this.excludeUserLoader);
				},
				() => { }
			);
	}

	listExcludedUsers(excludeUserPagination: Pagination) {
		this.referenceService.startLoader(this.excludeUserLoader);
		if (this.searchExcludedUserKey != null) {
			excludeUserPagination.searchKey = this.searchExcludedUserKey;
		}
		this.userService.listExcludedUsers(this.loggedInUserId, excludeUserPagination)
			.subscribe(
				response => {
					response.data.data.forEach((element, index) => { element.time = new Date(element.utcTimeString); });
					excludeUserPagination.totalRecords = response.data.totalRecords;
					excludeUserPagination = this.pagerService.getPagedItems(excludeUserPagination, response.data.data);
					this.referenceService.stopLoader(this.excludeUserLoader);
				},
				error => {
					this.referenceService.stopLoader(this.excludeUserLoader);
				},
				() => { }
			);
	}

	showDeleteExcludedUserAlert(userId: number) {
		let self = this;
		swal({
			title: 'Are you sure?',
			text: "You won't be able to undo this action!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#54a7e9',
			cancelButtonColor: '#999',
			allowOutsideClick: false,
			confirmButtonText: 'Yes, delete it!'

		}).then(function () {
			self.deleteExcludedUser(userId);
		}, function (dismiss: any) {
			console.log('you clicked on option' + dismiss);
		});
	}



	deleteExcludedUser(userId: number) {
		this.ngxloading = true;
		this.userService.deleteExcludedUser(this.loggedInUserId, userId)
			.subscribe(
				response => {
					if (response.statusCode == 200) {
						this.excludeUserCustomResponse = new CustomResponse('SUCCESS', this.properties.exclude_delete, true);
						this.listExcludedUsers(this.excludeUserPagination);
					}
					this.ngxloading = false;
				},
				error => {
					this.ngxloading = false;
				},
				() => { }
			);
	}

	addDomainModalOpen() {
		this.domain = null;
		$('#addDomainModal').modal('show');
	}


	addDomainModalClose() {
		$('#addDomainModal').modal('toggle');
		$("#addDomainModal .close").click();
		$('#addDomainModal').modal('hide');
		$('.modal').removeClass('show');
		this.domain = null;
		this.isDomainExist = false;
		this.validDomainFormat = true;
		this.validDomainPattern = false;
	}

	validateDomain(domain: string) {
		const lowerCaseDomain = domain.toLowerCase();
		if (this.validateDomainName(lowerCaseDomain)) {
			this.validDomainFormat = true;
			this.validDomainPattern = true;
		} else {
			this.validDomainPattern = false;
		}
	}

	validateDomainName(domain: string) {
		var DOMAIN_NAME_PATTERN = this.regularExpressions.DOMAIN_PATTERN;
		return DOMAIN_NAME_PATTERN.test(domain);
	}

	confirmAndsaveExcludedDomain(domain: string) {
		let updatedDomain = '<strong>' + domain + '</strong>';
		let companyName = '<strong>' + this.getCompanyName() + "</strong>.";
		let text = "Adding this domain to your exclusion list ensures that " + updatedDomain + " users no longer receive any campaigns from " + companyName;
		let self = this;
		swal({
			title: 'Are you sure want to continue?',
			text: text,
			type: 'warning',
			showCancelButton: true,
			swalConfirmButtonColor: '#54a7e9',
			swalCancelButtonColor: '#999',
			allowOutsideClick: false,
			confirmButtonText: 'Yes'
		}).then(function () {
			self.saveExcludedDomain(domain);
		}, function (dismiss: any) {
			console.log('you clicked on option' + dismiss);
		});
	}

	saveExcludedDomain(domain: string) {
		this.referenceService.startLoader(this.excludeDomainLoader);
		this.isDomainExist = false;
		this.validDomainFormat = true;
		this.excludedDomains = [];
		this.excludedDomains.push(domain);
		this.userService.saveExcludedDomains(this.excludedDomains, this.loggedInUserId)
			.subscribe(
				data => {
					if (data.statusCode == 200) {
						this.addDomainModalClose();
						this.excludeDomainCustomResponse = new CustomResponse('SUCCESS', data.message, true);
						this.listExcludedDomains(this.excludeDomainPagination);
						this.referenceService.stopLoader(this.excludeDomainLoader);
					} else if (data.statusCode == 401) {
						this.referenceService.stopLoader(this.excludeDomainLoader);
						this.isDomainExist = true;
					} else if (data.statusCode == 402) {
						this.validDomainFormat = false;
						this.referenceService.stopLoader(this.excludeDomainLoader);
					}
				},
				error => {
					this.referenceService.stopLoader(this.excludeDomainLoader);
				},
				() => { }
			);
	}

	listExcludedDomains(excludeDomainPagination: Pagination) {
		this.referenceService.startLoader(this.excludeDomainLoader);
		if (this.searchExcludedDomainKey != null) {
			excludeDomainPagination.searchKey = this.searchExcludedDomainKey;
		}
		this.userService.listExcludedDomains(this.loggedInUserId, excludeDomainPagination)
			.subscribe(
				response => {
					response.data.data.forEach((element, index) => { element.time = new Date(element.utcTimeString); });
					excludeDomainPagination.totalRecords = response.data.totalRecords;
					excludeDomainPagination = this.pagerService.getPagedItems(excludeDomainPagination, response.data.data);
					this.referenceService.stopLoader(this.excludeDomainLoader);
				},
				error => {
					this.referenceService.stopLoader(this.excludeDomainLoader);
				},
				() => { }
			);
	}

	showDeleteExcludedDomainAlert(domain: string) {
		let self = this;
		swal({
			title: 'Are you sure?',
			text: "You won't be able to undo this action!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#54a7e9',
			cancelButtonColor: '#999',
			confirmButtonText: 'Yes, delete it!'

		}).then(function () {
			self.deleteExcludedDomain(domain);
		}, function (dismiss: any) {
			console.log('you clicked on option' + dismiss);
		});
	}

	deleteExcludedDomain(domain: string) {
		this.ngxloading = true;
		this.userService.deleteExcludedDomain(this.loggedInUserId, domain)
			.subscribe(
				response => {
					if (response.statusCode == 200) {
						this.excludeDomainCustomResponse = new CustomResponse('SUCCESS', response.message, true);
						this.listExcludedDomains(this.excludeDomainPagination);
					}
					this.ngxloading = false;
				},
				error => {
					this.ngxloading = false;
				},
				() => { }
			);
	}

	search(type: string) {
		try {
			if (type === 'excludeUsers') {
				this.excludeUserPagination.pageIndex = 1;
				this.listExcludedUsers(this.excludeUserPagination);
			} else if (type === 'excludedDomains') {
				this.excludeDomainPagination.pageIndex = 1;
				this.listExcludedDomains(this.excludeDomainPagination);
			}
		} catch (error) {
			// this.xtremandLogger.error(error, "ManageContactsComponent", "sorting()");
		}
	}

	searchExcludeUsersDataEventHandler(keyCode: any) {
		if (keyCode === 13) {
			this.excludeUserPagination.pageIndex = 1;
			this.listExcludedUsers(this.excludeUserPagination);
		}
	}
	searchExcludeDomainsDataEventHandler(keyCode: any) {
		if (keyCode === 13) {
			this.excludeDomainPagination.pageIndex = 1;
			this.listExcludedDomains(this.excludeDomainPagination);
		}
	}

	downloadEmptyCSV(excludetype: string) {
		if (excludetype === 'exclude-users') {
			window.location.href = this.authenticationService.MEDIA_URL + "UPLOAD_EXCLUDE_USER_LIST_EMPTY.csv";
		} else if (excludetype === 'exclude-domains') {
			window.location.href = this.authenticationService.MEDIA_URL + "UPLOAD_EXCLUDE_DOMAIN_EMPTY.csv";
		}
	}

	fileChange(input: any, excludetype: string) {
		this.readFiles(input.files, excludetype);
	}

	isCSVFile(file) {
		return file.name.endsWith(".csv");
	}

	validateHeaders(headers, excludetype: string) {
		if (excludetype === 'exclude-users') {
			return (this.removeDoubleQuotes(headers[0]) == "EMAILID" || headers[0] == "EMAIL ID");
		} else if (excludetype === 'exclude-domains') {
			return (this.removeDoubleQuotes(headers[0]) == "DOMAIN NAME" || headers[0] == "DOMAINNAME" || headers[0] == "DOMAIN");
		}
	}

	removeDoubleQuotes(input: string) {
		if (input != undefined) {
			return input.trim().replace('"', '').replace('"', '');
		} else {
			return "";
		}
	}

	readFiles(files: any, excludetype: string) {
		if (this.fileUtil.isCSVFile(files[0])) {
			this.isListLoader = true;
			let reader = new FileReader();
			reader.readAsText(files[0]);
			var lines = new Array();
			var self = this;
			reader.onload = function (e: any) {
				var contents = e.target.result;
				let csvData = reader.result;
				let csvRecordsArray = csvData.split(/\r|\n/);
				let headersRow = self.fileUtil.getHeaderArray(csvRecordsArray);
				let headers = headersRow[0].split(',');
				if ((headers.length == 1)) {
					if (self.validateHeaders(headers, excludetype)) {
						var csvResult = Papa.parse(contents);
						var allTextLines = csvResult.data;
						if (excludetype === 'exclude-users') {
							self.csvUserPagination = new Pagination();
							self.excludedUsers = [];
							self.readExcludedUsersCSVFileContent(allTextLines, self.csvUserPagination);
						} else {
							self.csvDomainPagination = new Pagination();
							self.excludedDomains = [];
							self.readExcludedDomainsCSVFileContent(allTextLines, self.csvDomainPagination);
						}

					} else {
						self.showErrorMessage(excludetype);
						self.isListLoader = false;
					}
				} else {
					self.showErrorMessage(excludetype);
					self.isListLoader = false;
				}
			}
		} else {
			self.customResponse = new CustomResponse('ERROR', self.properties.FILE_TYPE_ERROR, true);

		}
	}

	showErrorMessage(excludetype: string) {
		if (excludetype === 'exclude-users') {
			this.customResponse = new CustomResponse('ERROR', "Invalid Csv", true);
		} else if (excludetype === 'exclude-domains') {
			this.excludeDomainCustomResponse = new CustomResponse('ERROR', "Invalid Csv", true);
		}
	}

	readExcludedUsersCSVFileContent(allTextLines: any, csvUserPagination: Pagination) {
		this.csvExcludeUsersFilePreview = true;
		for (var i = 1; i < allTextLines.length; i++) {
			if (allTextLines[i][0] && allTextLines[i][0].trim().length > 0) {
				let user = new User();
				user.emailId = allTextLines[i][0].trim();
				this.excludedUsers.push(user);
			}
		}
		this.csvUserPagination.page = 1;
		this.csvUserPagination.maxResults = 12;
		this.csvUserPagination.type = "csvUsers";
		this.setPage(this.csvUserPagination);

		this.isListLoader = false;
		if (this.excludedUsers.length === 0) {
			this.customResponse = new CustomResponse('ERROR', "No users found.", true);
		}

	}

	readExcludedDomainsCSVFileContent(allTextLines: any, csvDomainPagination: Pagination) {
		this.csvExcludeDomainsFilePreview = true;
		for (var i = 1; i < allTextLines.length; i++) {
			if (allTextLines[i][0] && allTextLines[i][0].trim().length > 0) {
				let domain = allTextLines[i][0].trim();
				this.excludedDomains.push(domain);
			}
		}
		this.csvDomainPagination.page = 1;
		this.csvDomainPagination.maxResults = 12;
		this.csvDomainPagination.type = "csvDomains";
		this.setPage(this.csvDomainPagination);

		this.isListLoader = false;
		if (this.excludedDomains.length === 0) {
			this.excludeDomainCustomResponse = new CustomResponse('ERROR', "No domains found.", true);
		}

	}

	confirmAndsaveExcludedUsers(excludedUsers: User[]) {
		let companyName = '<strong>' + this.getCompanyName() + "</strong>.";
		let text = "Adding emails to your exclusion list ensures that these emails are no longer receives any campaigns from " + companyName;
		let self = this;
		swal({
			title: 'Are you sure want to continue?',
			text: text,
			type: 'warning',
			showCancelButton: true,
			swalConfirmButtonColor: '#54a7e9',
			swalCancelButtonColor: '#999',
			allowOutsideClick: false,
			confirmButtonText: 'Yes'
		}).then(function () {
			self.saveExcludedUsers(excludedUsers);
		}, function (dismiss: any) {
			console.log('you clicked on option' + dismiss);
		});
	}

	saveExcludedUsers(excludedUsers: User[]) {
		this.referenceService.startLoader(this.excludeUserLoader);
		this.validEmailFormat = true;
		this.isEmailExist = false;
		this.userService.saveExcludedUsers(excludedUsers, this.loggedInUserId)
			.subscribe(
				data => {
					if (data.statusCode == 200) {
						this.csvExcludeUsersFilePreview = false;
						this.excludeUserCustomResponse = new CustomResponse('SUCCESS', this.properties.exclude_add, true);
						this.listExcludedUsers(this.excludeUserPagination);
						this.referenceService.stopLoader(this.excludeUserLoader);
					} else if (data.statusCode == 401) {
						this.referenceService.stopLoader(this.excludeUserLoader);
						this.excludeUserCustomResponse = new CustomResponse('ERROR', data.message, true);
					} else if (data.statusCode == 402) {
						this.referenceService.stopLoader(this.excludeUserLoader);
						this.excludeUserCustomResponse = new CustomResponse('ERROR', data.message, true);
					} else if (data.statusCode == 403) {
						this.referenceService.stopLoader(this.excludeUserLoader);
						this.excludeUserCustomResponse = new CustomResponse('ERROR', data.message, true);
					}
				},
				error => {
					this.referenceService.stopLoader(this.excludeUserLoader);
				},
				() => { }
			);
	}

	cancelCSVFilePreview(excludetype: string) {
		if (excludetype === 'exclude-users') {
			this.csvExcludeUsersFilePreview = false;
			this.listExcludedUsers(this.excludeUserPagination);
		} else if (excludetype === 'exclude-domains') {
			this.csvExcludeDomainsFilePreview = false;
			this.listExcludedDomains(this.excludeDomainPagination);
		}
	}

	confirmAndsaveExcludedDomains(excludedDomains: string[]) {
		let companyName = '<strong>' + this.getCompanyName() + "</strong>.";
		let text = "Adding domains to your exclusion list ensures that these domains related users are no longer receives any campaigns from " + companyName;
		let self = this;
		swal({
			title: 'Are you sure want to continue?',
			text: text,
			type: 'warning',
			showCancelButton: true,
			swalConfirmButtonColor: '#54a7e9',
			swalCancelButtonColor: '#999',
			allowOutsideClick: false,
			confirmButtonText: 'Yes'
		}).then(function () {
			self.saveExcludedDomains(excludedDomains);
		}, function (dismiss: any) {
			console.log('you clicked on option' + dismiss);
		});
	}

	saveExcludedDomains(excludedDomains: string[]) {
		this.referenceService.startLoader(this.excludeDomainLoader);
		this.isDomainExist = false;
		this.validDomainFormat = true;
		this.userService.saveExcludedDomains(excludedDomains, this.loggedInUserId)
			.subscribe(
				data => {
					if (data.statusCode == 200) {
						this.referenceService.stopLoader(this.excludeDomainLoader);
						this.csvExcludeDomainsFilePreview = false;
						this.excludeDomainCustomResponse = new CustomResponse('SUCCESS', data.message, true);
						this.listExcludedDomains(this.excludeDomainPagination);
					} else if (data.statusCode == 401) {
						this.referenceService.stopLoader(this.excludeDomainLoader);
						this.excludeDomainCustomResponse = new CustomResponse('ERROR', data.message, true);
					} else if (data.statusCode == 402) {
						this.referenceService.stopLoader(this.excludeDomainLoader);
						this.excludeDomainCustomResponse = new CustomResponse('ERROR', data.message, true);
					} else if (data.statusCode == 403) {
						this.referenceService.stopLoader(this.excludeDomainLoader);
						this.excludeDomainCustomResponse = new CustomResponse('ERROR', data.message, true);
					}
				},
				error => {
					this.referenceService.stopLoader(this.excludeDomainLoader);
				},
				() => { }
			);
	}

	upgrade() {
		this.isUpgrading = true;
		this.sweetAlertParameterDto.text = "You will be upgraded to Marketing";
		this.sweetAlertParameterDto.confirmButtonText = "Yes";

	}

	receiveEvent(event: any) {
		if (event) {
			this.ngxloading = true;
			this.dashBoardService.saveUpgradeRequest().
				subscribe(
					response => {
						this.ngxloading = false;
						this.referenceService.showSweetAlertSuccessMessage("Your Request Submitted Successfully");
						this.isUpgradedRequestSubmitted = true;
					}, error => {
						this.ngxloading = false;
						this.isUpgrading = false;
						let statusCode = JSON.parse(error['status']);
						if (statusCode == 409 || statusCode == 400) {
							let errorResponse = JSON.parse(error['_body']);
							let message = errorResponse['message'];
							this.isUpgradedRequestSubmitted = true;
							this.referenceService.showSweetAlertFailureMessage(message);
						} else {
							this.referenceService.showSweetAlertFailureMessage(this.properties.serverErrorMessage);
						}
					}
				);
		} else {
			this.isUpgrading = false;
		}
	}

	findUpgradeRequest() {
		this.ngxloading = true;
		this.dashBoardService.isRequestExists().
			subscribe(
				response => {
					this.isUpgradedRequestSubmitted = response.data;
				}, error => {
					this.ngxloading = false;
					this.isUpgradedRequestSubmitted = false;
				}
			);
	}

	closeIntegrationSettings(event: any) {
		this.integrationTabIndex = 0;
	}

	refreshIntegrationSettings(event: any) {
		this.checkIntegrations();
		this.integrationTabIndex = 0;
	}

	activateCRM(type: String) {
		try {
			let self = this;
			swal({
				title: 'Are you sure?',
				text: "Click Yes to mark this as your active CRM",
				type: 'warning',
				showCancelButton: true,
				swalConfirmButtonColor: '#54a7e9',
				swalCancelButtonColor: '#999',
				confirmButtonText: 'Yes, activate!'

			}).then(function () {
				let request: any = {};
				request.userId = self.loggedInUserId;
				request.type = type;
				self.ngxloading = true;
				self.integrationService.setActiveCRM(request)
					.subscribe(
						data => {
							if (data.statusCode == 200) {
								self.getActiveCRMDetails();
							}
						});
			}, function (dismiss: any) {
				console.log('you clicked on option' + dismiss);
			});
		} catch (error) {
			this.referenceService.showServerError(this.httpRequestLoader);
		}
	}

	getActiveCRMDetails() {
		this.referenceService.loading(this.httpRequestLoader, true);
		this.integrationService.getActiveCRMDetailsByUserId(this.loggedInUserId)
			.subscribe(
				data => {
					this.ngxloading = false;
					this.referenceService.loading(this.httpRequestLoader, false);
					this.activeCRMDetails = data.data;

				});
	}

	syncPipelines() {
		this.ngxloading = true;
		this.integrationService.syncActiveCRMPipelines(this.loggedInUserId, this.activeCRMDetails.type.toLowerCase())
			.subscribe(
				data => {
					this.ngxloading = false;
					this.pipelineResponse = new CustomResponse('SUCCESS', "Synchronized Successfully", true);
					this.listAllPipelines(this.pipelinePagination);
				}, error => {
					this.ngxloading = false;
					let errorMessage = this.referenceService.getApiErrorMessage(error);
					this.pipelineResponse = new CustomResponse('ERROR', errorMessage, true);
				}
			);

	}

	defaultStageChange(pipelineStage: PipelineStage) {
		this.pipeline.stages.forEach(stage => { stage.defaultStage = false });
		pipelineStage.defaultStage = true;
	}
	/************* XNFR-238 *********************/
	customAppShow = false;

	tabNames = ""
	customskinSettingsEnable(tabNames: string) {
		this.ngxloading = true;
		this.customSkinDto.createdBy = this.loggedInUserId;
		if (tabNames == "lightTheme") {
			this.ngxloading = false;
			this.selectedThemeIndex = 1;
			this.customAppShow = false;
			this.customSkinDto.darkTheme = false;
			this.customSkinDto.defaultSkin = true;
			this.authenticationService.isDarkForCharts = true;
			//this.saveDarkTheme(this.customSkinDto,this.selectedThemeIndex)

		} else if (tabNames == "customTheme") {
			this.ngxloading = false;
			this.customAppShow = true;
			this.selectedThemeIndex = 0;
			this.customSkinDto.darkTheme = false;
			this.changeCustomSettings(this.customSkinDto, this.selectedThemeIndex);

		} else if (tabNames == "DarkTheme") {
			this.customAppShow = false;
			this.selectedThemeIndex = 2;
			this.ngxloading = false;
			this.customSkinDto.darkTheme = true;
			this.customSkinDto.defaultSkin = true;
			//this.saveDarkTheme(this.customSkinDto,this.selectedThemeIndex);

		}
	}
	changeCustomSettings(form: CustomSkin, selectedThemeIndex: number) {
		this.ngxloading = true;
		form.defaultSkin = this.customSkinDto.defaultSkin;
		this.dashBoardService.changeCustomSettingTheme(form).subscribe(
			(data: any) => {
				this.ngxloading = false;
				if (form.darkTheme && selectedThemeIndex == 1) {
					window.location.reload();
				} else {
					this.customAppShow = true;
				}
			}, error => {
				this.ngxloading = false;
			}
		)
	}

	message: string = "";

	goBack() {
		this.router.navigate(['/home/dashboard/myprofile']);
	}

	showRefreshSweetAlertSuccessMessage(message: string) {
		swal({
			title: message,
			type: "success",
			allowOutsideClick: false,
		}).then(
			function (allowOutsideClick) {
				if (allowOutsideClick) {
					window.location.reload();
				}
			});
	}
	showThemes() {
		this.ngxloading = true;
		this.dashBoardService.multipleThemesShow().subscribe(
			(response) => {
				this.ngxloading = false
				this.themeDtoList = response.data;
				if (this.themeDtoList.length === 0 || this.themeDtoList.length < 1) {
					this.isNoThemes = true;
				}
			},
			error => {
				this.ngxloading = false;
			}
		);
	}
	lightdark: ThemeDto[] = [];
	getDefaultThemes() {
		this.ngxloading = true;
		this.dashBoardService.getDefaultThemes().subscribe(
			(response) => {
				this.ngxloading = false
				this.defaultThemes = response.data;
			},
			error => {
				this.ngxloading = false;
			}
		);
	}
	showActivateButton: boolean;
	showDto(dto: ThemeDto) {
		this.themeDto = dto;
		this.themeName = dto.name;
		for (var char of this.themeDtoList) {
			if (char.name === this.themeDto.name) {
				this.showActivateButton = true;
			}
		}
	}
	activateTheme: CompanyThemeActivate = new CompanyThemeActivate();
	activateThemeForCompany(companyThemeId: number) {
		this.activateTheme.createdBy = this.authenticationService.getUserId();
		this.activateTheme.themeId = companyThemeId;
		this.activateThemeApi(this.activateTheme);
	}
	activateThemeApi(theme: CompanyThemeActivate) {
		this.ngxloading = true;
		this.dashBoardService.activateThemeForCompany(theme).subscribe(
			(data: any) => {
				this.ngxloading = false;
				location.reload();
				this.router.navigateByUrl(this.referenceService.homeRouter);
				//this.router.navigate(['/home/dashboard/myprofile']);
			},
			error => {
				this.referenceService.scrollSmoothToTop();
				this.ngxloading = false;
			});
	}
	activateThemeForCompanyWithAlert(companyThemeId: number) {
		let self = this;
		swal({
			title: 'Are you sure?',
			text: 'Clicking "Activate" will change the theme and reload the entire application.',
			type: 'success',
			icon: "success",
			showCancelButton: true,
			swalConfirmButtonColor: '#54a7e9',
			swalCancelButtonColor: '#999',
			confirmButtonText: 'Activate'

		}).then(function () {
			self.activateThemeForCompany(companyThemeId);
		}, function (dismiss: any) {
			console.log("you clicked showAlert cancel" + dismiss);
		});
	}
	deleteByThemeId(id: number) {
		this.refService.goToTop();
		this.ngxloading = true;
		this.dashBoardService.deleteThemeProperties(id).subscribe(
			(response: any) => {
				this.ngxloading = false;
				this.statusCode = 200;
				$('#themeListDiv_' + id).remove();
				// this.referenceService.showSweetAlertSuccessMessage("Deleted Sucessfully");
				//this.router.navigate(['/home/dashboard/myprofile']);
				this.themeResponse.isVisible = false;
				let message = "Theme Deleted Sucessfully"
				this.themeResponse = new CustomResponse('SUCCESS', message, true);
			},
			error => {
				this.ngxloading = false;
				this.statusCode = 500;
				this.message = "Oops!Something went wrong";
			}
		)
	}
	deleteByThemeIdWithAlert(id: number) {
		let self = this;
		swal({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			type: 'warning',
			showCancelButton: true,
			swalConfirmButtonColor: '#54a7e9',
			swalCancelButtonColor: '#999',
			confirmButtonText: 'Yes, delete it!'

		}).then(function () {
			self.deleteByThemeId(id);
		}, function (dismiss: any) {
			console.log("you clicked showAlert cancel" + dismiss);
		});
	}
	// closeTheme(){
	// 	this.router.navigate(['/home/dashboard/myprofile']);
	// }

	getActiveThemeData() {
		this.ngxloading = true;
		this.dashBoardService.getActiveTheme(this.vanityLoginDto).subscribe(
			(data: any) => {
				this.ngxloading = false;
				this.activeThemeDetails = data.data;
			},
			(error: any) => {
				this.ngxloading = false;
				this.statusCode = 500;
			}
		)
	}
	isSaveTheme: boolean = false;
	saveTheme() {
		this.isSaveTheme = true;
	}
	updateTheme() {
		this.isSaveTheme = false;
	}
	showThemeAlert(event: any) {
		this.activeTabName = 'customskin';
		this.activeTabHeader = this.properties.customskin;
		this.showThemes();
		this.themeResponse.isVisible = false;
		this.themeResponse = new CustomResponse('SUCCESS', event, true);
	}
	//activateTab('customskin');
	closeTheme() {
		this.activeTabName = 'customskin';
		this.activeTabHeader = this.properties.customskin;
		this.themeResponse.isVisible = false;
		this.isSaveTheme = false;
		this.showThemes();
	}
	goToCustomThemes() {
		this.activeTabName = 'customTheme';
		this.activeTabHeader = "Custom Theme Settings";
		//this.themeResponse.isVisible = false;
	}
	viewTheme() {
		this.activeTabName = 'lightTheme';
		this.activeTabHeader = "Theme View";
		this.themeResponse.isVisible = false;
		this.referenceService.goToTop();
	}

	/************* XNFR-238 *********************/

	/************* XNFR-338 *********************/

	shouldDisableCheckbox(index: number): boolean {
		const selectedCount = this.pipeline.stages.filter(item => item.private).length;
		const remainingUnselectedCount = this.pipeline.stages.length - selectedCount - 1;

		if (remainingUnselectedCount === 0 && !this.pipeline.stages[index].private) {
			this.pipeline.stages[index].canDelete = false;
		} else {
			this.pipeline.stages[index].canDelete = true;
		}

		return remainingUnselectedCount === 0 && !this.pipeline.stages[index].private;
	}
	handleMarkAsChange(changedIndex: number): void {
		const changedStage = this.pipeline.stages[changedIndex];

		if (changedStage.markAs === 'won' || changedStage.markAs === 'lost') {
			this.resetOtherMarkedStages(changedIndex, changedStage.markAs);
		}
	}

	resetOtherMarkedStages(changedIndex: number, newMarking: string): void {
		for (let i = 0; i < this.pipeline.stages.length; i++) {
			if (i !== changedIndex && this.pipeline.stages[i].markAs === newMarking) {
				this.pipeline.stages[i].markAs = 'markAs';
			}
		}
	}
	/************* XNFR-338 *********************/

	// XNFR-403
	checkConnectWiseIntegration() {
		this.referenceService.loading(this.httpRequestLoader, true);
		this.integrationService.checkConfigurationByType("connectwise").subscribe(data => {
			this.referenceService.loading(this.httpRequestLoader, false);
			let response = data;
			if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
				this.connectwiseRibbonText = "configured";
			}
			else {
				this.connectwiseRibbonText = "configure";
			}
		}, error => {
			this.referenceService.loading(this.httpRequestLoader, false);
			this.sfRibbonText = "configure";
			this.logger.error(error, "Error in checkConnectWiseIntegration() for ConnectWise");
		}, () => this.logger.log("ConnectWise Integration Configuration Checking done"));
	}

	configureConnectWise() {
		this.integrationTabIndex = 7;
	}
	// XNFR-403


}
