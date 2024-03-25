import { Injectable, Renderer } from "@angular/core";
import { Http, Response } from "@angular/http";
import { SaveVideoFile } from "../../videos/models/save-video-file";
import { AuthenticationService } from "./authentication.service";
import { Observable } from "rxjs/Observable";
import { Router,ActivatedRoute } from "@angular/router";
import { Category } from "../../videos/models/category";
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { DefaultVideoPlayer } from "../../videos/models/default-video-player";
import { HttpRequestLoader } from "../../core/models/http-request-loader";
import { Roles } from "../../core/models/roles";
import { Country } from "../../core/models/country";
import { SenderMergeTag } from "../../core/models/sender-merge-tag";
import { Timezone } from "../../core/models/timezone";
import { Ng2DeviceService } from "ng2-device-detector";
import { EmailTemplate } from "../../email-template/models/email-template";
import { Campaign } from "../../campaigns/models/campaign";
import { CampaignAccess } from "app/campaigns/models/campaign-access";
import { Properties } from "../../common/models/properties";
import { CustomResponse } from "../../common/models/custom-response";
import { User } from "../../core/models/user";
import { ModulesDisplayType } from "app/util/models/modules-display-type";
import { RegularExpressions } from "app/common/models/regular-expressions";
import { Pagination } from "app/core/models/pagination";
import { EnvService } from "app/env.service";


declare var $:any, swal:any, require:any;
var moment = require('moment-timezone');
@Injectable()
export class ReferenceService {
    
  renderer: Renderer;
  swalConfirmButtonColor: "#54a7e9";
  swalCancelButtonColor: "#999";
  refcategories: Category[];
  userName: any;
  selectedCampaignType = "";
  isCampaignFromVideoRouter = false;
  campaignSuccessMessage = "";
  isCreated = false;
  isUpdated = false;
  isUploaded = false;
  isAssetDetailsUpldated = false;
  isLandingPageCreated = false;
  isLandingPageUpdated = false;
  errorPrepender = "Error In";
  campaignVideoFile: SaveVideoFile;
  videoTitles: string[];
  defaultPlayerSettings: DefaultVideoPlayer;
  homeMethodsCalled = false;
  defaulgVideoMethodCalled = false;
  uploadRetrivejsCalled = false;
  topNavbarUserService = false;
  isFromTopNavBar = false;
  isEnabledCamera = false;
  cameraIsthere: boolean;
  topNavBarNotificationDetails: any = new Object();
  roles: Roles = new Roles();
  topNavBarUserDetails = {
    displayName: "....",
    profilePicutrePath: "assets/images/icon-user-default.png",
  };
  companyProfileImage: string;
  userDefaultPage = "";
  hasCompany = false;
  formGroupClass = "form-group";
  errorClass = "form-group has-error has-feedback";
  successClass = "form-group has-success has-feedback";
  deviceInfo: any;
  isGridView: boolean;
  callBackURLCondition = "";
  viewsSparklineValues: any;
  viewsDate: string;
  clickedValue: number;
  daySortValue = 7;
  reportName: string;
  partnerCount: number;
  userProviderMessage = "";
  companyId = 0;
  isDisabling = false;
  videoBrandLogo: string;
  videoType = "";
  isEditNurtureCampaign = false;
  nurtureCampaignId = 0;
  homeRouter = "/home/dashboard/default";
  selectModuleRouter = "/home/select-modules";
  sharedDamRouter = "/home/dam/shared";
  manageCampaignsRouter = "/home/campaigns/manage";
  loginUrl = "/login";
  pageContnetBgColor = "#F1F3FA";
  isPlayVideo = false;
  isDownloadCsvFile: boolean;
  vendorDetails: any;
  isRedistributionCampaignPage = false;
  campaignType = "REGULAR";
  videoTag = "";
  videoSrcTag = "";
  emailMergeTags =
    "  For First Name : {{firstName}} \n  For Last Name : {{lastName}} \n  For Full Name : {{fullName}} \n  For Email Id : {{emailId}}";
  coBrandingTag = "";
  coBrandingImageTag;
  URL: string = this.authenticationService.REST_URL + "admin/";
  hasClientError = false;
  isSidebarClosed = false;
  showInputConfirmPassword = false;
  showInputPassword = false;
  showInputOldPassword = false;
  launchedCampaignType = "";
  selectedVideoLogo: string;
  selectedVideoLogodesc: string;
  contentManagementLoader: boolean;
  namesArray: any;
  campaignAccess: CampaignAccess;
  manageRouter = false;
  detailViewIsLoading: boolean;
  videoCampaign = false;
  emailCampaign = false;
  socialCampaign = false;
  eventCampaign = false;
  loadingPreview = false;
  eventCampaignId: number;
  integrationCallBackStatus = false;
  dealId = 0;
  smsCampaign = false;
  serverErrorMessage =
    "Oops!There is some technical error,Please try after sometime";
  myMergeTagsInfo: any;
  eventCampaignTabAccess: boolean = false;
  socialCampaignTabAccess = false;
  senderMergeTag: SenderMergeTag = new SenderMergeTag();
  superiorId: number = 0;
  selectedFeed: any;
  customResponse = new CustomResponse();
  properties = new Properties();

  start: any;
  pressed: boolean;
  startX: any;
  startWidth: any;
  regularExpressions = new RegularExpressions();
  loaderFromAdmin = false;
  newVersionDeployed = false;
  /*** XNFR-user-guides */
  mergeTagName:any;
  hideLeftMenu : boolean = false;

  loginStyleType:any;
  loginTemplateId = 53;
  assetResponseMessage = "";
  createdOrUpdatedSuccessMessage = "";
  teamMemberSignedUpSuccessfullyMessage = "";

  /*** XNFR-433 ***/
  isCopyForm: boolean = false;
  constructor(
    private http: Http,
    private authenticationService: AuthenticationService,
    private logger: XtremandLogger,
    private router: Router,
    public deviceService: Ng2DeviceService,
    private envService:EnvService,
    private route:ActivatedRoute
  ) {
    this.videoTag =
      '<img src="' + authenticationService.imagesHost + 'xtremand-video.gif">';
    this.coBrandingTag =
      '<img src="' + authenticationService.imagesHost + 'co-branding.png">';
    this.coBrandingImageTag =
      'img src="' + authenticationService.imagesHost + 'co-branding.png"';
    this.videoSrcTag =
      'img src="' + authenticationService.imagesHost + 'xtremand-video.gif"';
  }
  getBrowserInfoForNativeSet() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    if (
      this.deviceInfo.device === "iphone" ||
      this.deviceInfo.os === "mac" ||
      this.deviceInfo.browser === "safari"
    ) {
      return false;
    } else {
      return true;
    }
  }
  isMobileScreenSize() {
    if (window.innerWidth < 768) {
      return true;
    }
    return false;
  }
  isSafariBrowser() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    if (
      this.deviceInfo.browser === "safari" ||
      this.deviceInfo.browser === "ie"
    ) {
      return true;
    } else {
      return false;
    }
  }
  isXamplify() {
    if (window.location.hostname.includes("xamplify")) {
      return true;
    }
    return false;
  }
  getCategories(): Observable<Category[]> {
    const url =
      this.URL +
      "categories?access_token=" +
      this.authenticationService.access_token;
    return this.http.get(url, "").map(this.extractData).catch(this.handleError);
  }
  getVideoTitles(): Observable<String[]> {
    const constUrl = this.authenticationService.REST_URL + "videos/";

    let userId = this.authenticationService.user.id;

    userId = this.authenticationService.checkLoggedInUserId(userId);

    const url =
      constUrl +
      "video-titles?access_token=" +
      this.authenticationService.access_token +
      "&userId=" +
      userId;
    return this.http.get(url, "").map(this.extractData).catch(this.handleError);
  }
  listCampaignEmailNotifications(userId: number) {
    return this.http
      .get(
        this.URL +
          "get-campaign-email-notifications/" +
          userId +
          "?access_token=" +
          this.authenticationService.access_token,
        ""
      )
      .map(this.extractData)
      .catch(this.handleError);
  }
  listCampaignVideoNotifications(userId: number) {
    return this.http
      .get(
        this.URL +
          "get-campaign-video-notifications/" +
          userId +
          "?access_token=" +
          this.authenticationService.access_token,
        ""
      )
      .map(this.extractData)
      .catch(this.handleError);
  }
  markNotificationsAsRead(id: number, type: string) {
    let url = "update-campaign-email-notification/";
    if (type == "video") {
      url = "update-campaign-video-notification/";
    }
    return this.http
      .get(
        this.URL +
          url +
          id +
          "?access_token=" +
          this.authenticationService.access_token,
        ""
      )
      .map(this.extractData)
      .catch(this.handleError);
  }
  showErrorPage(error: any) {
    this.router.navigate(["/home/error/", error.status]);
  }
  showError(cause: string, methodName: string, componentName: string) {
    let message = "Error In " + methodName + "() " + componentName;
    this.logger.error(message + ":", cause);
  }
  showServerError(httpRequestLoader: HttpRequestLoader) {
    httpRequestLoader.isLoading = false;
    httpRequestLoader.isServerError = true;
    // httpRequestLoader.statusCode = 500;
    return httpRequestLoader;
  }
  loading(httpRequestLoader: HttpRequestLoader, isLoading: boolean) {
    httpRequestLoader.isLoading = isLoading;
    httpRequestLoader.isServerError = false;
    httpRequestLoader.message = "";
  }
  showServerErrorMessage(httpRequestLoader: HttpRequestLoader) {
    httpRequestLoader.isLoading = false;
    httpRequestLoader.isServerError = true;
    httpRequestLoader.message = this.serverErrorMessage;
  }
  isPlayVideoLoading(loading: boolean) {
    return (this.isPlayVideo = loading);
  }
  showInfo(info: string, data: any) {
    this.logger.debug(info, data);
  }
  extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  handleError(error: any) {
    let errMsg = error.message
      ? error.message
      : error.status
      ? `${error.status} - ${error.statusText}`
      : "Server   error";
    return Observable.throw(errMsg);
  }
  goToTop() {
    if (!this.isMobile()) {
      $("html,body").animate({ scrollTop: 0 }, "slow");
    }
  }
  goToTopImmediately() {
    if (!this.isMobile()) {
      $("html,body").animate({ scrollTop: 0 }, "fast");
    }
  }

  removeDuplicates(list: any) {
    let result = [];
    $.each(list, function (i, e) {
      if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
  }

  removeDuplicatesFromTwoArrays(array1: any, array2: any) {
    for (var i = 0; i < array2.length; i++) {
      if (array2[i] !== undefined) {
        var arrlen = array1.length;
        for (var j = 0; j < arrlen; j++) {
          if (array2[i] == array1[j]) {
            array1 = array1.slice(0, j).concat(array1.slice(j + 1, arrlen));
          } //if close
        } //for close
      }
    } //for close
    return array1;
  }
  replaceMultipleSpacesWithSingleSpace(text: string) {
    if (text != undefined) {
      return text.replace(/ +(?= )/g, "").trim();
    } else {
      return "";
    }
  }
  validateEmailId(emailId: string) {
    return this.regularExpressions.EMAIL_ID_PATTERN.test(emailId);
  }


    validateFirstName(firstName:string){
    return this.regularExpressions.FIRSTNAME_PATTERN.test(firstName);

  }

  validateEmail(text: string) {
    var EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
    return (text && EMAIL_REGEXP.test(text));
  }

  validateWebsiteURL(url: string) {
    return this.regularExpressions.URL_PATTERN.test(url);
  }

  validatePhoneNumber(phoneNumber: string) {
    return this.regularExpressions.PHONE_NUMBER_PATTERN.test(phoneNumber);
  }

  hideDiv(divId: string) {
    $("#" + divId).hide(600);
  }
  hasRole(roleName: string) {
    try {
      const roles = this.authenticationService.getRoles();
      if (
        roles.indexOf(roleName) > -1 ||
        roles.indexOf(this.roles.orgAdminRole) > -1 ||
        roles.indexOf(this.roles.allRole) > -1
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("error" + error);
    }
  }

  hasSelectedRole(roleName: string) {
    try {
      const roles = this.authenticationService.getRoles();
      if (roles.indexOf(roleName) > -1) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("error" + error);
    }
  }

  hasAllAccess() {
    try {
      const roles = this.authenticationService.getRoles();
      if (roles) {
        if (
          (roles && roles.indexOf(this.roles.allRole) > -1) ||
          roles.indexOf(this.roles.orgAdminRole) > -1 ||
          roles.indexOf(this.roles.marketingRole) > -1
        ) {
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.log("error" + error);
    }
  }
  removeDuplicatesObjects(originalArray, prop) {
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
  returnDuplicates(names: string[]) {
    const uniq = names
      .map((name) => {
        return { count: 1, name: name };
      })
      .reduce((a, b) => {
        a[b.name] = (a[b.name] || 0) + b.count;
        return a;
      }, {});

    return Object.keys(uniq).filter((a) => uniq[a] > 1);
  }
  goToDiv(divId: string) {
    if (!this.isMobile()) {
      var div = $("#" + divId);
      if (div.length) {
        var contentNav = div.offset().top;
        $("html,body").animate(
          {
            scrollTop: contentNav,
          },
          "slow"
        );
      }
    }
  }

  scrollToModalBodyTop(divId: string) {
    if (!this.isMobile()) {
      $("#" + divId).animate({ scrollTop: 0 }, "slow");
    }
  }

  scrollToModalBodyTopByClass() {
    if (!this.isMobile()) {
      $(".modal-body").animate({ scrollTop: 0 }, "slow");
    }
  }

  removeSelectedObjectFromList(arrayList: any, id: any) {
    for (let i = 0; i < arrayList.length; i++) {
      if (arrayList[i].id === id) {
        arrayList.splice(i, 1);
        break;
      }
    }
    return arrayList;
  }

  removeRowsFromPartnerOrContactListByEmailId(arrayList: any, emailId: any) {
    for (let i = 0; i < arrayList.length; i++) {
      if (arrayList[i].emailId === emailId) {
        arrayList.splice(i, 1);
        break;
      }
    }
    return arrayList;
  }

  getAllTimeZones() {
    return [
      "(GMT -12:00) Etc/GMT+12",
      "(GMT -11:00) Pacific/Niue",
      "(GMT -11:00) Pacific/Midway",
      "(GMT -11:00) Pacific/Samoa",
      "(GMT -11:00) Etc/GMT+11",
      "(GMT -11:00) US/Samoa",
      "(GMT -11:00) Pacific/Pago_Pago",
      "(GMT -10:00) Pacific/Rarotonga",
      "(GMT -10:00) Pacific/Tahiti",
      "(GMT -10:00) Pacific/Johnston",
      "(GMT -10:00) Pacific/Honolulu",
      "(GMT -10:00) US/Hawaii",
      "(GMT -10:00) Etc/GMT+10",
      "(GMT -09:30) Pacific/Marquesas",
      "(GMT -09:00) US/Aleutian",
      "(GMT -09:00) Etc/GMT+9",
      "(GMT -09:00) America/Atka",
      "(GMT -09:00) Pacific/Gambier",
      "(GMT -09:00) America/Adak",
      "(GMT -08:00) America/Juneau",
      "(GMT -08:00) America/Metlakatla",
      "(GMT -08:00) America/Nome",
      "(GMT -08:00) America/Sitka",
      "(GMT -08:00) America/Yakutat",
      "(GMT -08:00) America/Anchorage",
      "(GMT -08:00) Etc/GMT+8",
      "(GMT -08:00) Pacific/Pitcairn",
      "(GMT -08:00) US/Alaska",
      "(GMT -07:00) America/Dawson",
      "(GMT -07:00) US/Arizona",
      "(GMT -07:00) Canada/Pacific",
      "(GMT -07:00) America/Los_Angeles",
      "(GMT -07:00) PST8PDT",
      "(GMT -07:00) Mexico/BajaNorte",
      "(GMT -07:00) America/Phoenix",
      "(GMT -07:00) America/Santa_Isabel",
      "(GMT -07:00) America/Creston",
      "(GMT -07:00) America/Tijuana",
      "(GMT -07:00) America/Vancouver",
      "(GMT -07:00) America/Whitehorse",
      "(GMT -07:00) MST",
      "(GMT -07:00) America/Dawson_Creek",
      "(GMT -07:00) America/Ensenada",
      "(GMT -07:00) Etc/GMT+7",
      "(GMT -07:00) America/Hermosillo",
      "(GMT -07:00) US/Pacific",
      "(GMT -07:00) US/Pacific-New",
      "(GMT -07:00) Canada/Yukon",
      "(GMT -06:00) America/Managua",
      "(GMT -06:00) America/Mazatlan",
      "(GMT -06:00) America/Costa_Rica",
      "(GMT -06:00) Canada/Mountain",
      "(GMT -06:00) America/Ojinaga",
      "(GMT -06:00) Navajo",
      "(GMT -06:00) America/Regina",
      "(GMT -06:00) Mexico/BajaSur",
      "(GMT -06:00) America/Shiprock",
      "(GMT -06:00) America/Denver",
      "(GMT -06:00) America/Swift_Current",
      "(GMT -06:00) America/Tegucigalpa",
      "(GMT -06:00) US/Mountain",
      "(GMT -06:00) America/El_Salvador",
      "(GMT -06:00) Pacific/Galapagos",
      "(GMT -06:00) America/Guatemala",
      "(GMT -06:00) America/Yellowknife",
      "(GMT -06:00) MST7MDT",
      "(GMT -06:00) America/Belize",
      "(GMT -06:00) America/Inuvik",
      "(GMT -06:00) Etc/GMT+6",
      "(GMT -06:00) America/Boise",
      "(GMT -06:00) America/Cambridge_Bay",
      "(GMT -06:00) Canada/East-Saskatchewan",
      "(GMT -06:00) America/Chihuahua",
      "(GMT -06:00) Canada/Saskatchewan",
      "(GMT -06:00) America/Edmonton",
      "(GMT -05:00) America/Eirunepe",
      "(GMT -05:00) America/North_Dakota/Beulah",
      "(GMT -05:00) America/North_Dakota/Center",
      "(GMT -05:00) America/North_Dakota/New_Salem",
      "(GMT -05:00) Mexico/General",
      "(GMT -05:00) America/Panama",
      "(GMT -05:00) America/Cancun",
      "(GMT -05:00) America/Porto_Acre",
      "(GMT -05:00) America/Rainy_River",
      "(GMT -05:00) America/Rankin_Inlet",
      "(GMT -05:00) US/Central",
      "(GMT -05:00) America/Resolute",
      "(GMT -05:00) America/Rio_Branco",
      "(GMT -05:00) America/Guayaquil",
      "(GMT -05:00) America/Cayman",
      "(GMT -05:00) America/Chicago",
      "(GMT -05:00) CST6CDT",
      "(GMT -05:00) America/Indiana/Tell_City",
      "(GMT -05:00) Pacific/Easter",
      "(GMT -05:00) America/Coral_Harbour",
      "(GMT -05:00) America/Atikokan",
      "(GMT -05:00) US/Indiana-Starke",
      "(GMT -05:00) America/Winnipeg",
      "(GMT -05:00) America/Knox_IN",
      "(GMT -05:00) America/Lima",
      "(GMT -05:00) America/Bahia_Banderas",
      "(GMT -05:00) America/Jamaica",
      "(GMT -05:00) America/Matamoros",
      "(GMT -05:00) America/Bogota",
      "(GMT -05:00) Etc/GMT+5",
      "(GMT -05:00) America/Menominee",
      "(GMT -05:00) America/Merida",
      "(GMT -05:00) Jamaica",
      "(GMT -05:00) Canada/Central",
      "(GMT -05:00) EST",
      "(GMT -05:00) Chile/EasterIsland",
      "(GMT -05:00) America/Mexico_City",
      "(GMT -05:00) Brazil/Acre",
      "(GMT -05:00) America/Monterrey",
      "(GMT -05:00) America/Indiana/Knox",
      "(GMT -04:30) America/Caracas",
      "(GMT -04:00) America/Nipigon",
      "(GMT -04:00) America/Guyana",
      "(GMT -04:00) Brazil/West",
      "(GMT -04:00) America/Havana",
      "(GMT -04:00) America/Boa_Vista",
      "(GMT -04:00) America/Indiana/Indianapolis",
      "(GMT -04:00) America/Anguilla",
      "(GMT -04:00) America/Indiana/Marengo",
      "(GMT -04:00) America/Pangnirtung",
      "(GMT -04:00) America/Indiana/Petersburg",
      "(GMT -04:00) America/Port-au-Prince",
      "(GMT -04:00) America/Port_of_Spain",
      "(GMT -04:00) America/Cuiaba",
      "(GMT -04:00) America/Porto_Velho",
      "(GMT -04:00) America/Puerto_Rico",
      "(GMT -04:00) America/Indiana/Vevay",
      "(GMT -04:00) America/Indiana/Vincennes",
      "(GMT -04:00) America/Indiana/Winamac",
      "(GMT -04:00) America/Indianapolis",
      "(GMT -04:00) America/Curacao",
      "(GMT -04:00) America/Antigua",
      "(GMT -04:00) America/Santo_Domingo",
      "(GMT -04:00) America/Aruba",
      "(GMT -04:00) America/Campo_Grande",
      "(GMT -04:00) America/St_Barthelemy",
      "(GMT -04:00) America/Kentucky/Louisville",
      "(GMT -04:00) America/St_Kitts",
      "(GMT -04:00) America/St_Lucia",
      "(GMT -04:00) America/St_Thomas",
      "(GMT -04:00) America/St_Vincent",
      "(GMT -04:00) America/Kentucky/Monticello",
      "(GMT -04:00) America/Detroit",
      "(GMT -04:00) America/Thunder_Bay",
      "(GMT -04:00) America/Kralendijk",
      "(GMT -04:00) America/Toronto",
      "(GMT -04:00) America/Tortola",
      "(GMT -04:00) America/La_Paz",
      "(GMT -04:00) America/Virgin",
      "(GMT -04:00) America/Dominica",
      "(GMT -04:00) Canada/Eastern",
      "(GMT -04:00) America/Louisville",
      "(GMT -04:00) America/Lower_Princes",
      "(GMT -04:00) US/Michigan",
      "(GMT -04:00) America/Manaus",
      "(GMT -04:00) America/Marigot",
      "(GMT -04:00) America/Martinique",
      "(GMT -04:00) US/Eastern",
      "(GMT -04:00) Etc/GMT+4",
      "(GMT -04:00) America/Barbados",
      "(GMT -04:00) America/Fort_Wayne",
      "(GMT -04:00) America/Grand_Turk",
      "(GMT -04:00) America/Grenada",
      "(GMT -04:00) EST5EDT",
      "(GMT -04:00) America/Guadeloupe",
      "(GMT -04:00) Cuba",
      "(GMT -04:00) US/East-Indiana",
      "(GMT -04:00) America/Blanc-Sablon",
      "(GMT -04:00) America/Montreal",
      "(GMT -04:00) America/Montserrat",
      "(GMT -04:00) America/Nassau",
      "(GMT -04:00) America/New_York",
      "(GMT -04:00) America/Iqaluit",
      "(GMT -03:00) America/Argentina/Cordoba",
      "(GMT -03:00) America/Moncton",
      "(GMT -03:00) America/Argentina/Jujuy",
      "(GMT -03:00) Brazil/East",
      "(GMT -03:00) America/Argentina/La_Rioja",
      "(GMT -03:00) America/Argentina/Mendoza",
      "(GMT -03:00) America/Argentina/Rio_Gallegos",
      "(GMT -03:00) America/Buenos_Aires",
      "(GMT -03:00) America/Thule",
      "(GMT -03:00) America/Argentina/Salta",
      "(GMT -03:00) America/Jujuy",
      "(GMT -03:00) America/Argentina/San_Juan",
      "(GMT -03:00) America/Argentina/San_Luis",
      "(GMT -03:00) America/Fortaleza",
      "(GMT -03:00) America/Glace_Bay",
      "(GMT -03:00) Atlantic/Stanley",
      "(GMT -03:00) America/Goose_Bay",
      "(GMT -03:00) America/Argentina/Tucuman",
      "(GMT -03:00) America/Paramaribo",
      "(GMT -03:00) Antarctica/Palmer",
      "(GMT -03:00) Antarctica/Rothera",
      "(GMT -03:00) America/Catamarca",
      "(GMT -03:00) America/Cayenne",
      "(GMT -03:00) America/Argentina/Ushuaia",
      "(GMT -03:00) America/Maceio",
      "(GMT -03:00) Atlantic/Bermuda",
      "(GMT -03:00) America/Asuncion",
      "(GMT -03:00) Etc/GMT+3",
      "(GMT -03:00) Canada/Atlantic",
      "(GMT -03:00) America/Halifax",
      "(GMT -03:00) America/Araguaina",
      "(GMT -03:00) America/Recife",
      "(GMT -03:00) America/Cordoba",
      "(GMT -03:00) America/Argentina/Buenos_Aires",
      "(GMT -03:00) America/Mendoza",
      "(GMT -03:00) America/Rosario",
      "(GMT -03:00) America/Bahia",
      "(GMT -03:00) Chile/Continental",
      "(GMT -03:00) America/Santarem",
      "(GMT -03:00) America/Santiago",
      "(GMT -03:00) America/Argentina/Catamarca",
      "(GMT -03:00) America/Sao_Paulo",
      "(GMT -03:00) America/Argentina/ComodRivadavia",
      "(GMT -03:00) America/Belem",
      "(GMT -02:30) Canada/Newfoundland",
      "(GMT -02:30) America/St_Johns",
      "(GMT -02:00) Etc/GMT+2",
      "(GMT -02:00) Brazil/DeNoronha",
      "(GMT -02:00) America/Noronha",
      "(GMT -02:00) America/Montevideo",
      "(GMT -02:00) Atlantic/South_Georgia",
      "(GMT -02:00) America/Miquelon",
      "(GMT -02:00) America/Godthab",
      "(GMT -01:00) Etc/GMT+1",
      "(GMT -01:00) Atlantic/Cape_Verde",
      "(GMT +00:00) Africa/Abidjan",
      "(GMT +00:00) Greenwich",
      "(GMT +00:00) Africa/Bissau",
      "(GMT +00:00) Africa/Conakry",
      "(GMT +00:00) Africa/Dakar",
      "(GMT +00:00) Zulu",
      "(GMT +00:00) Universal",
      "(GMT +00:00) Africa/Bamako",
      "(GMT +00:00) Africa/Monrovia",
      "(GMT +00:00) Etc/GMT+0",
      "(GMT +00:00) Etc/GMT",
      "(GMT +00:00) UTC",
      "(GMT +00:00) Africa/Freetown",
      "(GMT +00:00) Africa/Lome",
      "(GMT +00:00) Africa/Nouakchott",
      "(GMT +00:00) America/Scoresbysund",
      "(GMT +00:00) America/Danmarkshavn",
      "(GMT +00:00) GMT0",
      "(GMT +00:00) GMT-0",
      "(GMT +00:00) GMT+0",
      "(GMT +00:00) GMT",
      "(GMT +00:00) Etc/Zulu",
      "(GMT +00:00) Etc/Universal",
      "(GMT +00:00) Africa/Ouagadougou",
      "(GMT +00:00) UCT",
      "(GMT +00:00) Etc/UTC",
      "(GMT +00:00) Etc/UCT",
      "(GMT +00:00) Etc/Greenwich",
      "(GMT +00:00) Etc/GMT0",
      "(GMT +00:00) Etc/GMT-0",
      "(GMT +00:00) Africa/Sao_Tome",
      "(GMT +00:00) Atlantic/St_Helena",
      "(GMT +00:00) Africa/Timbuktu",
      "(GMT +00:00) Atlantic/Reykjavik",
      "(GMT +00:00) Iceland",
      "(GMT +00:00) Africa/Banjul",
      "(GMT +00:00) Atlantic/Azores",
      "(GMT +00:00) Africa/Accra",
      "(GMT +01:00) Africa/Libreville",
      "(GMT +01:00) Europe/Lisbon",
      "(GMT +01:00) Africa/Algiers",
      "(GMT +01:00) Europe/Isle_of_Man",
      "(GMT +01:00) Europe/Guernsey",
      "(GMT +01:00) Africa/Bangui",
      "(GMT +01:00) Africa/Brazzaville",
      "(GMT +01:00) Europe/Dublin",
      "(GMT +01:00) Africa/Casablanca",
      "(GMT +01:00) Africa/Douala",
      "(GMT +01:00) Africa/El_Aaiun",
      "(GMT +01:00) Portugal",
      "(GMT +01:00) Europe/Belfast",
      "(GMT +01:00) Europe/London",
      "(GMT +01:00) Africa/Kinshasa",
      "(GMT +01:00) Africa/Lagos",
      "(GMT +01:00) Europe/Jersey",
      "(GMT +01:00) Africa/Luanda",
      "(GMT +01:00) Africa/Malabo",
      "(GMT +01:00) Atlantic/Canary",
      "(GMT +01:00) Atlantic/Faeroe",
      "(GMT +01:00) Atlantic/Faroe",
      "(GMT +01:00) Atlantic/Madeira",
      "(GMT +01:00) Africa/Ndjamena",
      "(GMT +01:00) Africa/Niamey",
      "(GMT +01:00) Africa/Porto-Novo",
      "(GMT +01:00) Etc/GMT-1",
      "(GMT +01:00) Eire",
      "(GMT +01:00) Africa/Tunis",
      "(GMT +01:00) GB-Eire",
      "(GMT +01:00) GB",
      "(GMT +01:00) WET",
      "(GMT +02:00) Europe/Amsterdam",
      "(GMT +02:00) Europe/Gibraltar",
      "(GMT +02:00) Europe/Luxembourg",
      "(GMT +02:00) Africa/Kigali",
      "(GMT +02:00) Europe/Copenhagen",
      "(GMT +02:00) Europe/Busingen",
      "(GMT +02:00) Africa/Ceuta",
      "(GMT +02:00) Europe/Ljubljana",
      "(GMT +02:00) Africa/Lubumbashi",
      "(GMT +02:00) Africa/Lusaka",
      "(GMT +02:00) Europe/Budapest",
      "(GMT +02:00) Africa/Maputo",
      "(GMT +02:00) Africa/Maseru",
      "(GMT +02:00) Africa/Mbabane",
      "(GMT +02:00) Antarctica/Troll",
      "(GMT +02:00) Europe/Madrid",
      "(GMT +02:00) Europe/Malta",
      "(GMT +02:00) Africa/Blantyre",
      "(GMT +02:00) Europe/Monaco",
      "(GMT +02:00) Europe/Kaliningrad",
      "(GMT +02:00) Europe/Brussels",
      "(GMT +02:00) Atlantic/Jan_Mayen",
      "(GMT +02:00) Africa/Gaborone",
      "(GMT +02:00) Etc/GMT-2",
      "(GMT +02:00) Europe/Bratislava",
      "(GMT +02:00) Europe/Oslo",
      "(GMT +02:00) Europe/Berlin",
      "(GMT +02:00) MET",
      "(GMT +02:00) Libya",
      "(GMT +02:00) Africa/Bujumbura",
      "(GMT +02:00) Europe/Paris",
      "(GMT +02:00) Europe/Podgorica",
      "(GMT +02:00) Poland",
      "(GMT +02:00) Arctic/Longyearbyen",
      "(GMT +02:00) Europe/Prague",
      "(GMT +02:00) Europe/Rome",
      "(GMT +02:00) Africa/Harare",
      "(GMT +02:00) Egypt",
      "(GMT +02:00) Africa/Tripoli",
      "(GMT +02:00) Africa/Johannesburg",
      "(GMT +02:00) Africa/Windhoek",
      "(GMT +02:00) Europe/Belgrade",
      "(GMT +02:00) Africa/Cairo",
      "(GMT +02:00) Europe/Zurich",
      "(GMT +02:00) Europe/Andorra",
      "(GMT +02:00) Europe/Zagreb",
      "(GMT +02:00) Europe/Warsaw",
      "(GMT +02:00) Europe/San_Marino",
      "(GMT +02:00) Europe/Sarajevo",
      "(GMT +02:00) Europe/Vienna",
      "(GMT +02:00) Europe/Vatican",
      "(GMT +02:00) Asia/Hebron",
      "(GMT +02:00) CET",
      "(GMT +02:00) Europe/Vaduz",
      "(GMT +02:00) Asia/Gaza",
      "(GMT +02:00) Europe/Skopje",
      "(GMT +02:00) Europe/Stockholm",
      "(GMT +02:00) Europe/Tirane",
      "(GMT +03:00) Asia/Jerusalem",
      "(GMT +03:00) Asia/Damascus",
      "(GMT +03:00) Europe/Tallinn",
      "(GMT +03:00) Europe/Uzhgorod",
      "(GMT +03:00) Europe/Sofia",
      "(GMT +03:00) Europe/Kiev",
      "(GMT +03:00) Europe/Simferopol",
      "(GMT +03:00) EET",
      "(GMT +03:00) Europe/Vilnius",
      "(GMT +03:00) Europe/Volgograd",
      "(GMT +03:00) Indian/Antananarivo",
      "(GMT +03:00) Indian/Comoro",
      "(GMT +03:00) W-SU",
      "(GMT +03:00) Asia/Beirut",
      "(GMT +03:00) Africa/Addis_Ababa",
      "(GMT +03:00) Asia/Bahrain",
      "(GMT +03:00) Asia/Baghdad",
      "(GMT +03:00) Europe/Riga",
      "(GMT +03:00) Asia/Amman",
      "(GMT +03:00) Europe/Istanbul",
      "(GMT +03:00) Asia/Aden",
      "(GMT +03:00) Indian/Mayotte",
      "(GMT +03:00) Africa/Asmara",
      "(GMT +03:00) Europe/Helsinki",
      "(GMT +03:00) Israel",
      "(GMT +03:00) Asia/Istanbul",
      "(GMT +03:00) Europe/Nicosia",
      "(GMT +03:00) Europe/Moscow",
      "(GMT +03:00) Africa/Nairobi",
      "(GMT +03:00) Etc/GMT-3",
      "(GMT +03:00) Africa/Asmera",
      "(GMT +03:00) Europe/Tiraspol",
      "(GMT +03:00) Europe/Minsk",
      "(GMT +03:00) Europe/Mariehamn",
      "(GMT +03:00) Asia/Kuwait",
      "(GMT +03:00) Africa/Mogadishu",
      "(GMT +03:00) Asia/Nicosia",
      "(GMT +03:00) Antarctica/Syowa",
      "(GMT +03:00) Asia/Tel_Aviv",
      "(GMT +03:00) Europe/Chisinau",
      "(GMT +03:00) Africa/Dar_es_Salaam",
      "(GMT +03:00) Africa/Khartoum",
      "(GMT +03:00) Europe/Athens",
      "(GMT +03:00) Africa/Kampala",
      "(GMT +03:00) Africa/Juba",
      "(GMT +03:00) Asia/Riyadh",
      "(GMT +03:00) Turkey",
      "(GMT +03:00) Asia/Qatar",
      "(GMT +03:00) Europe/Bucharest",
      "(GMT +03:00) Africa/Djibouti",
      "(GMT +03:00) Europe/Zaporozhye",
      "(GMT +03:30) Iran",
      "(GMT +03:30) Asia/Tehran",
      "(GMT +04:00) Asia/Muscat",
      "(GMT +04:00) Etc/GMT-4",
      "(GMT +04:00) Asia/Yerevan",
      "(GMT +04:00) Indian/Reunion",
      "(GMT +04:00) Indian/Mauritius",
      "(GMT +04:00) Indian/Mahe",
      "(GMT +04:00) Europe/Samara",
      "(GMT +04:00) Asia/Dubai",
      "(GMT +04:00) Asia/Tbilisi",
      "(GMT +04:30) Asia/Kabul",
      "(GMT +05:00) Asia/Tashkent",
      "(GMT +05:00) Indian/Kerguelen",
      "(GMT +05:00) Asia/Baku",
      "(GMT +05:00) Asia/Samarkand",
      "(GMT +05:00) Asia/Karachi",
      "(GMT +05:00) Asia/Ashkhabad",
      "(GMT +05:00) Antarctica/Mawson",
      "(GMT +05:00) Asia/Ashgabat",
      "(GMT +05:00) Asia/Aqtobe",
      "(GMT +05:00) Asia/Aqtau",
      "(GMT +05:00) Asia/Yekaterinburg",
      "(GMT +05:00) Etc/GMT-5",
      "(GMT +05:00) Asia/Oral",
      "(GMT +05:00) Indian/Maldives",
      "(GMT +05:00) Asia/Dushanbe",
      "(GMT +05:30) Asia/Kolkata",
      "(GMT +05:30) Asia/Colombo",
      "(GMT +05:30) Asia/Calcutta",
      "(GMT +05:45) Asia/Kathmandu",
      "(GMT +05:45) Asia/Katmandu",
      "(GMT +06:00) Asia/Novosibirsk",
      "(GMT +06:00) Asia/Omsk",
      "(GMT +06:00) Etc/GMT-6",
      "(GMT +06:00) Asia/Qyzylorda",
      "(GMT +06:00) Asia/Thimbu",
      "(GMT +06:00) Asia/Thimphu",
      "(GMT +06:00) Asia/Urumqi",
      "(GMT +06:00) Indian/Chagos",
      "(GMT +06:00) Asia/Almaty",
      "(GMT +06:00) Asia/Dhaka",
      "(GMT +06:00) Asia/Dacca",
      "(GMT +06:00) Asia/Bishkek",
      "(GMT +06:00) Antarctica/Vostok",
      "(GMT +06:00) Asia/Kashgar",
      "(GMT +06:30) Indian/Cocos",
      "(GMT +06:30) Asia/Rangoon",
      "(GMT +07:00) Asia/Novokuznetsk",
      "(GMT +07:00) Asia/Hovd",
      "(GMT +07:00) Asia/Krasnoyarsk",
      "(GMT +07:00) Antarctica/Davis",
      "(GMT +07:00) Indian/Christmas",
      "(GMT +07:00) Asia/Saigon",
      "(GMT +07:00) Asia/Bangkok",
      "(GMT +07:00) Etc/GMT-7",
      "(GMT +07:00) Asia/Phnom_Penh",
      "(GMT +07:00) Asia/Pontianak",
      "(GMT +07:00) Asia/Vientiane",
      "(GMT +07:00) Asia/Ho_Chi_Minh",
      "(GMT +07:00) Asia/Jakarta",
      "(GMT +08:00) Etc/GMT-8",
      "(GMT +08:00) Asia/Macao",
      "(GMT +08:00) Asia/Macau",
      "(GMT +08:00) Asia/Ulaanbaatar",
      "(GMT +08:00) Antarctica/Casey",
      "(GMT +08:00) Australia/Perth",
      "(GMT +08:00) Asia/Singapore",
      "(GMT +08:00) Hongkong",
      "(GMT +08:00) Asia/Makassar",
      "(GMT +08:00) Asia/Ulan_Bator",
      "(GMT +08:00) Asia/Harbin",
      "(GMT +08:00) Asia/Manila",
      "(GMT +08:00) Asia/Chungking",
      "(GMT +08:00) Asia/Chongqing",
      "(GMT +08:00) Asia/Choibalsan",
      "(GMT +08:00) Asia/Shanghai",
      "(GMT +08:00) Asia/Hong_Kong",
      "(GMT +08:00) Asia/Brunei",
      "(GMT +08:00) Asia/Taipei",
      "(GMT +08:00) Australia/West",
      "(GMT +08:00) PRC",
      "(GMT +08:00) Asia/Chita",
      "(GMT +08:00) Singapore",
      "(GMT +08:00) Asia/Irkutsk",
      "(GMT +08:00) Asia/Kuala_Lumpur",
      "(GMT +08:00) Asia/Kuching",
      "(GMT +08:00) ROC",
      "(GMT +08:00) Asia/Ujung_Pandang",
      "(GMT +08:45) Australia/Eucla",
      "(GMT +09:00) Asia/Jayapura",
      "(GMT +09:00) Asia/Yakutsk",
      "(GMT +09:00) Japan",
      "(GMT +09:00) Asia/Seoul",
      "(GMT +09:00) Asia/Khandyga",
      "(GMT +09:00) ROK",
      "(GMT +09:00) Asia/Pyongyang",
      "(GMT +09:00) Pacific/Palau",
      "(GMT +09:00) Etc/GMT-9",
      "(GMT +09:00) Asia/Dili",
      "(GMT +09:00) Asia/Tokyo",
      "(GMT +09:30) Australia/Darwin",
      "(GMT +10:00) Australia/Brisbane",
      "(GMT +10:00) Etc/GMT-10",
      "(GMT +10:00) Pacific/Chuuk",
      "(GMT +10:00) Asia/Ust-Nera",
      "(GMT +10:00) Australia/Queensland",
      "(GMT +10:00) Pacific/Saipan",
      "(GMT +10:00) Asia/Vladivostok",
      "(GMT +10:00) Pacific/Port_Moresby",
      "(GMT +10:00) Asia/Magadan",
      "(GMT +10:00) Asia/Sakhalin",
      "(GMT +10:00) Australia/Lindeman",
      "(GMT +10:00) Antarctica/DumontDUrville",
      "(GMT +10:00) Pacific/Guam",
      "(GMT +10:00) Pacific/Yap",
      "(GMT +10:00) Pacific/Truk",
      "(GMT +10:30) Australia/Yancowinna",
      "(GMT +10:30) Australia/South",
      "(GMT +10:30) Australia/Broken_Hill",
      "(GMT +10:30) Australia/Adelaide",
      "(GMT +11:00) Pacific/Kosrae",
      "(GMT +11:00) Australia/Tasmania",
      "(GMT +11:00) Australia/Sydney",
      "(GMT +11:00) Pacific/Efate",
      "(GMT +11:00) Pacific/Noumea",
      "(GMT +11:00) Etc/GMT-11",
      "(GMT +11:00) Antarctica/Macquarie",
      "(GMT +11:00) Asia/Srednekolymsk",
      "(GMT +11:00) Pacific/Pohnpei",
      "(GMT +11:00) Pacific/Ponape",
      "(GMT +11:00) Australia/NSW",
      "(GMT +11:00) Australia/Melbourne",
      "(GMT +11:00) Australia/Lord_Howe",
      "(GMT +11:00) Australia/LHI",
      "(GMT +11:00) Pacific/Bougainville",
      "(GMT +11:00) Australia/Hobart",
      "(GMT +11:00) Australia/Currie",
      "(GMT +11:00) Australia/Canberra",
      "(GMT +11:00) Pacific/Guadalcanal",
      "(GMT +11:00) Australia/Victoria",
      "(GMT +11:00) Australia/ACT",
      "(GMT +11:30) Pacific/Norfolk",
      "(GMT +12:00) Asia/Anadyr",
      "(GMT +12:00) Pacific/Kwajalein",
      "(GMT +12:00) Pacific/Wallis",
      "(GMT +12:00) Kwajalein",
      "(GMT +12:00) Pacific/Wake",
      "(GMT +12:00) Pacific/Tarawa",
      "(GMT +12:00) Asia/Kamchatka",
      "(GMT +12:00) Pacific/Fiji",
      "(GMT +12:00) Pacific/Funafuti",
      "(GMT +12:00) Pacific/Majuro",
      "(GMT +12:00) Pacific/Nauru",
      "(GMT +12:00) Etc/GMT-12",
      "(GMT +13:00) Antarctica/McMurdo",
      "(GMT +13:00) Pacific/Auckland",
      "(GMT +13:00) Pacific/Tongatapu",
      "(GMT +13:00) NZ",
      "(GMT +13:00) Etc/GMT-13",
      "(GMT +13:00) Antarctica/South_Pole",
      "(GMT +13:00) Pacific/Enderbury",
      "(GMT +13:00) Pacific/Fakaofo",
      "(GMT +13:45) NZ-CHAT",
      "(GMT +13:45) Pacific/Chatham",
      "(GMT +14:00) Pacific/Kiritimati",
      "(GMT +14:00) Etc/GMT-14",
      "(GMT +14:00) Pacific/Apia",
    ];
  }

  hideVerticalScrollBar() {
    $("body").css("overflow", "hidden");
  }

  getDivHeightByClassName(className: string) {
    return $(className).height() + "px";
  }
  getCountries() {
    return [
      new Country(0, "", "Select Country"),
      new Country(238, "US", "United States"),
      new Country(237, "GB", "United Kingdom"),
      new Country(103, "IN", "India"),
      new Country(1, "AF", "Afghanistan"),
      new Country(2, "AX", "Aland Islands"),
      new Country(3, "AL", "Albania"),
      new Country(4, "DZ", "Algeria"),
      new Country(5, "AS", "American Samoa"),
      new Country(6, "AD", "Andorra"),
      new Country(7, "AO", "Angola"),
      new Country(8, "AI", "Anguilla"),
      new Country(9, "AQ", "Antarctica"),
      new Country(10, "AG", "Antigua & Barbuda"),
      new Country(11, "AR", "Argentina"),
      new Country(12, "AM", "Armenia"),
      new Country(13, "AW", "Aruba"),
      new Country(14, "AU", "Australia"),
      new Country(15, "AT", "Austria"),
      new Country(16, "AZ", "Azerbaijan"),
      new Country(17, "BS", "Bahamas"),
      new Country(18, "BH", "Bahrain"),
      new Country(19, "BD", "Bangladesh"),
      new Country(20, "BB", "Barbados"),
      new Country(21, "BY", "Barbados"),
      new Country(22, "BE", "Belgium"),
      new Country(23, "BZ", "Belize"),
      new Country(24, "BJ", "Benin"),
      new Country(25, "BM", "Bermuda"),
      new Country(26, "BT", "Bhutan"),
      new Country(27, "BO", "Bolivia"),
      new Country(28, "BA", "Bosnia & Herzegovina (Bosna i Hercegovina)"),
      new Country(29, "BW", "Botswana"),
      new Country(30, "BV", "Bouvet Island"),
      new Country(31, "BR", "Brazil (Brasil)"),
      new Country(32, "IO", "British Indian Ocean Territory"),
      new Country(33, "VG", "British Virgin Islands"),
      new Country(34, "BN", "Brunei"),
      new Country(35, "BG", "Bulgaria"),
      new Country(36, "BF", "Burkina Faso"),
      new Country(37, "BI", "Burundi (Uburundi) "),
      new Country(38, "KH", "Cambodia"),
      new Country(39, "CM", "Cameroon (Cameroun)"),
      new Country(40, "CA", "Canada"),
      new Country(41, "CV", "Cape Verde (Kabu Verdi)"),
      new Country(42, "BQ", "Caribbean Netherlands"),
      new Country(43, "KY", "Cayman Islands"),
      new Country(
        44,
        "CF",
        "Central African Republic (Republique centrafricaine)"
      ),
      new Country(45, "TD", "Chad (Tchad)"),
      new Country(46, "CL", "Chile"),
      new Country(47, "CN", "China"),
      new Country(48, "CX", "Christmas Island"),
      new Country(
        49,
        "CC",
        "Cocos (Keeling) Islands (Kepulauan Cocos (Keeling))"
      ),
      new Country(50, "CO", "Colombia"),
      new Country(51, "KM", "Comoros"),
      new Country(52, "CG", "Congo - Brazzaville (Congo-Brazzaville)"),
      new Country(
        53,
        "CD",
        "Congo - Kinshasa (Jamhuri ya Kidemokrasia ya Kongo)"
      ),
      new Country(54, "CK", "Cook Islands"),
      new Country(55, "CR", "Costa Rica"),
      new Country(56, "CI", "Cote d Ivoire"),
      new Country(57, "HR", "Croatia (Hrvatska)"),
      new Country(58, "CU", "Cuba"),
      new Country(59, "CW", "Curacao"),
      new Country(60, "CY", "Cyprus"),
      new Country(61, "CZ", "Czechia (Cesko)"),
      new Country(62, "DK", "Denmark (Danmark)"),
      new Country(63, "DJ", "Djibouti"),
      new Country(64, "DM", "Dominica"),
      new Country(65, "DO", "Dominican Republic (Republica Dominicana)"),
      new Country(66, "EC", "Ecuador"),
      new Country(67, "EG", "Egypt"),
      new Country(68, "SV", "El Salvador"),
      new Country(69, "GQ", "Equatorial Guinea (Guinea Ecuatorial)"),
      new Country(70, "ER", "Eritrea"),
      new Country(71, "EE", "Estonia (Eesti)"),
      new Country(72, "ET", "Ethiopia"),
      new Country(73, "FK", "Falkland Islands (Islas Malvinas)"),
      new Country(74, "FO", "Faroe Islands"),
      new Country(75, "FJ", "Fiji"),
      new Country(76, "FI", "Finland (Suomi)"),
      new Country(77, "FR", "France"),
      new Country(78, "GF", "French Guiana (Guyane francaise)"),
      new Country(79, "PF", "French Polynesia"),
      new Country(
        80,
        "TF",
        "French Southern Territories (Terres australes francaises)"
      ),
      new Country(81, "GA", "Gabon"),
      new Country(81, "GM", "Gambia"),
      new Country(83, "GE", "Georgia"),
      new Country(84, "DE", "Germany (Deutschland)"),
      new Country(85, "GH", "Ghana (Gaana)"),
      new Country(86, "GI", "Gibraltar"),
      new Country(87, "GR", "Greece"),
      new Country(88, "GL", "Greenland (Kalaallit Nunaat)"),
      new Country(89, "GD", "Grenada"),
      new Country(90, "GP", "Guadeloupe"),
      new Country(91, "GU", "Guam"),
      new Country(92, "GT", "Guatemala"),
      new Country(93, "GG", "Guernsey"),
      new Country(94, "GN", "Guinea (Guinee)"),
      new Country(95, "GW", "Guinea-Bissau"),
      new Country(96, "GY", "Guyana"),
      new Country(97, "HT", "Haiti"),
      new Country(98, "HM", "Heard & McDonald Islands"),
      new Country(99, "HN", "Honduras"),
      new Country(100, "HK", "Hong Kong"),
      new Country(101, "HU", "Hungary (Magyarorszag)"),
      new Country(102, "IS", "Iceland (Island)"),
      new Country(104, "ID", "Indonesia"),
      new Country(105, "IR", "Iran"),
      new Country(106, "IQ", "Iraq"),
      new Country(107, "IE", "Ireland"),
      new Country(108, "IM", "Isle of Man"),
      new Country(109, "IL", "Israel"),
      new Country(110, "IT", "Italy (Italia)"),
      new Country(111, "JM", "Jamaica"),
      new Country(112, "JP", "Japan"),
      new Country(113, "JE", "Jersey"),
      new Country(114, "JO", "Jordan"),
      new Country(115, "KZ", "Kazakhstan"),
      new Country(116, "KE", "Kenya"),
      new Country(117, "KI", "Kiribati"),
      new Country(118, "KW", "Kuwait"),
      new Country(119, "KG", "Kyrgyzstan"),
      new Country(120, "LA", "Laos"),
      new Country(121, "LV", "Latvia (Latvija)"),
      new Country(122, "LB", "Lebanon "),
      new Country(123, "LS", "Lesotho"),
      new Country(124, "LR", "Liberia"),
      new Country(125, "LY", "Libya"),
      new Country(126, "LI", "Liechtenstein"),
      new Country(127, "LT", "Lithuania (Lietuva)"),
      new Country(128, "LU", "Luxembourg"),
      new Country(129, "MO", "Macau"),
      new Country(130, "MK", "Macedonia"),
      new Country(131, "MG", "Madagascar (Madagasikara)"),
      new Country(132, "MW", "Malawi"),
      new Country(133, "MY", "Malaysia"),
      new Country(134, "MV", "Maldives"),
      new Country(135, "ML", "Mali"),
      new Country(136, "MT", "Malta"),
      new Country(137, "MH", "Marshall Islands"),
      new Country(138, "MQ", "Martinique"),
      new Country(139, "MR", "Mauritania"),
      new Country(140, "MU", "Mauritius (Moris)"),
      new Country(141, "YT", "Mayotte"),
      new Country(142, "MX", "Mexico"),
      new Country(143, "FM", "Micronesia"),
      new Country(144, "MD", "Moldova (Republica Moldova)"),
      new Country(145, "MC", "Monaco"),
      new Country(146, "MN", "Mongolia"),
      new Country(147, "ME", "Montenegro (Crna Gora)"),
      new Country(148, "MS", "Montserrat"),
      new Country(149, "MA", "Morocco"),
      new Country(150, "MZ", "Mozambique"),
      new Country(151, "MM", "Myanmar (Burma)"),
      new Country(152, "NA", "Namibia"),
      new Country(153, "NR", "Nauru"),
      new Country(154, "NP", "Nepal"),
      new Country(155, "NL", "Netherlands (Nederland)"),
      new Country(156, "NC", "New Caledonia (Nouvelle-Caledonie)"),
      new Country(157, "NZ", "New Zealand"),
      new Country(158, "NI", "Nicaragua"),
      new Country(159, "NE", "Niger (Nijar)"),
      new Country(160, "NG", "Nigeria"),
      new Country(161, "NU", "Niue"),
      new Country(162, "NF", "Norfolk Island"),
      new Country(163, "NP", "Northern Mariana Islands"),
      new Country(164, "KP", "North Korea"),
      new Country(165, "NO", "Norway (Norge)"),
      new Country(166, "OM", "Oman"),
      new Country(167, "PK", "Pakistan"),
      new Country(168, "PW", "Palau"),
      new Country(169, "PS", "Palestine"),
      new Country(170, "PA", "Panama"),
      new Country(171, "PG", "Papua New Guinea"),
      new Country(172, "PY", "Paraguay"),
      new Country(173, "PE", "Peru"),
      new Country(174, "PH", "Philippines"),
      new Country(175, "PN", "Pitcairn Islands"),
      new Country(176, "PL", "Poland (Polska)"),
      new Country(178, "PT", "Portugal"),
      new Country(179, "PR", "Puerto Rico"),
      new Country(180, "QA", "Qatar"),
      new Country(181, "RE", "Reunion"),
      new Country(182, "RO", "Romania"),
      new Country(183, "RU", "Russia "),
      new Country(184, "RW", "Rwanda (U Rwanda)"),
      new Country(185, "WS", "Samoa"),
      new Country(186, "SM", "San Marino"),
      new Country(187, "ST", "Sao Tome & Principe (Sao Tome e Principe)"),
      new Country(188, "SA", "Saudi Arabia"),
      new Country(189, "SN", "Senegal (Senegaal)"),
      new Country(190, "RS", "Serbia"),
      new Country(191, "SC", "Seychelles"),
      new Country(192, "SL", "Sierra Leone"),
      new Country(193, "SG", "Singapore"),
      new Country(194, "SX", "Sint Maarten"),
      new Country(195, "SK", "Slovakia (Slovensko)"),
      new Country(196, "SI", "Slovenia (Slovenija)"),
      new Country(197, "SB", "Solomon Islands"),
      new Country(198, "SO", "Somalia (Soomaaliya)"),
      new Country(199, "ZA", "South Africa"),
      new Country(200, "GA", "South Georgia & South Sandwich Islands"),
      new Country(201, "KR", "South Korea"),
      new Country(202, "SS", "South Sudan"),
      new Country(203, "ES", "Spain"),
      new Country(204, "LK", "Sri Lanka"),
      new Country(205, "SH", "St. Helena"),
      new Country(206, "KN", "St. Kitts & Nevis"),
      new Country(207, "LC", "St. Lucia"),
      new Country(208, "MF", "St. Martin (Saint-Martin)"),
      new Country(
        209,
        "PM",
        "St. Pierre & Miquelon (Saint-Pierre-et-Miquelon)"
      ),
      new Country(210, "VC", "St. Vincent & Grenadines"),
      new Country(211, "SD", "Sudan"),
      new Country(212, "SR", "Suriname"),
      new Country(213, "SJ", "Svalbard & Jan Mayen (Svalbard og Jan Mayen)"),
      new Country(214, "SZ", "Swaziland"),
      new Country(215, "SE", "Sweden (Sverige)"),
      new Country(216, "CH", "Switzerland (Schweiz)"),
      new Country(217, "SY", "Syria"),
      new Country(218, "TW", "Taiwan"),
      new Country(219, "TJ", "Tajikistan"),
      new Country(220, "TZ", "Tanzania"),
      new Country(221, "TH", "Thailand"),
      new Country(222, "TL", "Timor-Leste"),
      new Country(223, "TG", "Togo"),
      new Country(224, "TK", "Tokelau"),
      new Country(225, "TO", "Tonga"),
      new Country(226, "TT", "Trinidad & Tobago"),
      new Country(227, "TN", "Tunisia"),
      new Country(228, "TR", "Turkey"),
      new Country(229, "TM", "Turkmenistan"),
      new Country(230, "TC", "Turks & Caicos Islands"),
      new Country(231, "TV", "Tuvalu"),
      new Country(232, "UM", "U.S. Outlying Islands"),
      new Country(233, "VI", "U.S. Virgin Islands"),
      new Country(234, "UG", "Uganda"),
      new Country(235, "UA", "Ukraine"),
      new Country(236, "AE", "United Arab Emirates"),
      new Country(239, "UY", "Uruguay"),
      new Country(240, "UZ", "Uzbekistan"),
      new Country(241, "VU", "Vanuatu"),
      new Country(242, "VA", "Vatican City"),
      new Country(243, "VE", "Venezuela"),
      new Country(244, "VN", "Vietnam"),
      new Country(245, "WF", "Wallis & Futuna"),
      new Country(246, "EH", "Western Sahara"),
      new Country(247, "YE", "Yemen"),
      new Country(248, "ZM", "Zambia"),
      new Country(249, "ZW", "Zimbabwe"),
    ];
  }

  getTimeZones() {
    return [
      new Timezone(0, "", "---Please Select Timezone---"),
      new Timezone(1, "Asia/Kabul", "(GMT+04:30) Kabul"),
      new Timezone(2, "Europe/Helsinki", "(GMT+02:00) Helsinki"),
      new Timezone(3, "Europe/Tirane", "(GMT+01:00) Tirane"),
      new Timezone(4, "Africa/Algiers", "(GMT+01:00) Algiers"),
      new Timezone(5, "Pacific/Pago_Pago", "(GMT-11:00) Pago Pago"),
      new Timezone(6, "Europe/Andorra", "(GMT+01:00) Andorra"),
      new Timezone(7, "Africa/Lagos", "(GMT+01:00) Lagos"),
      new Timezone(8, "America/Port_of_Spain", "(GMT-04:00) Port of Spain"),
      new Timezone(9, "Antarctica/Palmer", "(GMT-03:00) Palmer"),
      new Timezone(9, "Antarctica/Rothera", "(GMT-03:00) Rothera"),
      new Timezone(9, "Antarctica/Syowa", "(GMT+03:00) Syowa"),
      new Timezone(9, "Antarctica/Mawson", "(GMT+05:00) Mawson"),
      new Timezone(9, "Antarctica/Vostok", "(GMT+06:00) Vostok"),
      new Timezone(9, "Antarctica/Davis", "(GMT+07:00) Davis"),
      new Timezone(
        9,
        "Antarctica/DumontDUrville",
        "(GMT+10:00) Dumont D Urville"
      ),
      new Timezone(9, "Antarctica/Casey", "(GMT+11:00) Casey"),
      new Timezone(9, "Pacific/Auckland", "(GMT+13:00) Auckland"),
      new Timezone(10, "America/Port_of_Spain", "(GMT-04:00) Port of Spain"),
      new Timezone(
        11,
        "America/Argentina/Buenos_Aires",
        "(GMT-03:00) Buenos Aires"
      ),
      new Timezone(12, "Asia/Yerevan", "(GMT+04:00) Yerevan"),
      new Timezone(13, "America/Curacao", "(GMT-04:00) Curacao"),
      new Timezone(14, "Australia/Perth", "(GMT+08:00) Western Time - Perth"),
      new Timezone(
        14,
        "Australia/Adelaide",
        "(GMT+10:30) Central Time - Adelaide"
      ),
      new Timezone(14, "Australia/Darwin", "(GMT+09:30) Central Time - Darwin"),
      new Timezone(
        14,
        "Australia/Brisbane",
        "(GMT+10:00) Eastern Time - Brisbane"
      ),
      new Timezone(14, "Australia/Hobart", "(GMT+11:00) Eastern Time - Hobart"),
      new Timezone(
        14,
        "Australia/Sydney",
        "(GMT+11:00) Eastern Time - Melbourne, Sydney"
      ),
      new Timezone(15, "Europe/Vienna", "(GMT+01:00) Vienna"),
      new Timezone(16, "Asia/Baku", "(GMT+04:00) Baku"),
      new Timezone(17, "America/Nassau", "(GMT-05:00) Nassau"),
      new Timezone(18, "Asia/Qatar", "(GMT+03:00) Qatar"),
      new Timezone(19, "Asia/Dhaka", "(GMT+06:00) Dhaka"),
      new Timezone(20, "America/Barbados", "(GMT-04:00) Barbados"),
      new Timezone(21, "Europe/Minsk", "(GMT+03:00) Minsk"),
      new Timezone(22, "Europe/Brussels", "(GMT+01:00) Brussels"),
      new Timezone(23, "America/Belize", "(GMT-06:00) Belize"),
      new Timezone(24, "Africa/Lagos", "(GMT+01:00) Lagos"),
      new Timezone(25, "Atlantic/Bermuda", "(GMT-04:00) Bermuda"),
      new Timezone(26, "Asia/Thimphu", "(GMT+06:00) Thimphu"),
      new Timezone(27, "America/La_Paz", "(GMT-04:00) La Paz"),
      new Timezone(
        28,
        "Europe/Belgrade",
        "(GMT+01:00) Central European Time - Belgrade"
      ),
      new Timezone(29, "Africa/Maputo", "(GMT+02:00) Maputo"),
      new Timezone(30, "Africa/Abidjan", "(GMT+00:00) Abidjan"),
      new Timezone(31, "America/Rio_Branco", "(GMT-05:00) Rio Branco"),
      new Timezone(31, "America/Boa_Vista", "(GMT-04:00) Boa Vista"),
      new Timezone(31, "America/Campo_Grande", "(GMT-03:00) Campo Grande"),
      new Timezone(31, "America/Cuiaba", "(GMT-03:00) Cuiaba"),
      new Timezone(31, "America/Manaus", "(GMT-04:00) Manaus"),
      new Timezone(31, "America/Porto_Velho", "(GMT-04:00) Porto Velho"),
      new Timezone(31, "America/Araguaina", "(GMT-03:00) Araguaina"),
      new Timezone(31, "America/Bahia", "(GMT-03:00) Salvador"),
      new Timezone(31, "America/Belem", "(GMT-03:00) Belem"),
      new Timezone(31, "America/Fortaleza", "(GMT-03:00) Fortaleza"),
      new Timezone(31, "America/Maceio", "(GMT-03:00) Maceio"),
      new Timezone(31, "America/Recife", "(GMT-03:00) Recife"),
      new Timezone(31, "America/Sao_Paulo", "(GMT-02:00) Sao Paulo"),
      new Timezone(31, "America/Noronha", "(GMT-02:00) Noronha"),
      new Timezone(32, "Indian/Chagos", "(GMT+06:00) Chagos"),
      new Timezone(33, "America/Port_of_Spain", "(GMT-04:00) Port of Spain"),
      new Timezone(34, "Asia/Brunei", "(GMT+08:00) Brunei"),
      new Timezone(35, "Europe/Sofia", "(GMT+02:00) Sofia"),
      new Timezone(36, "Africa/Abidjan", "(GMT+00:00) Abidjan"),
      new Timezone(37, "Africa/Maputo", "(GMT+02:00) Maputo"),
      new Timezone(38, "Asia/Bangkok", "(GMT+07:00) Bangkok"),
      new Timezone(39, "Africa/Lagos", "(GMT+01:00) Lagos"),
      new Timezone(
        40,
        "America/Vancouver",
        "(GMT-08:00) Pacific Time - Vancouver"
      ),
      new Timezone(
        40,
        "America/Whitehorse",
        "(GMT-08:00) Pacific Time - Whitehorse"
      ),
      new Timezone(
        40,
        "America/Dawson_Creek",
        "(GMT-07:00) Mountain Time - Dawson Creek"
      ),
      new Timezone(
        40,
        "America/Edmonton",
        "(GMT-07:00) Mountain Time - Edmonton"
      ),
      new Timezone(
        40,
        "America/Yellowknife",
        "(GMT-07:00) Mountain Time - Yellowknife"
      ),
      new Timezone(40, "America/Regina", "(GMT-06:00) Central Time - Regina"),
      new Timezone(
        40,
        "America/Winnipeg",
        "(GMT-06:00) Central Time - Winnipeg"
      ),
      new Timezone(40, "America/Iqaluit", "(GMT-05:00) Eastern Time - Iqaluit"),
      new Timezone(40, "America/Toronto", "(GMT-05:00) Eastern Time - Toronto"),
      new Timezone(
        40,
        "America/Halifax",
        "(GMT-04:00) Atlantic Time - Halifax"
      ),
      new Timezone(
        40,
        "America/St_Johns",
        "(GMT-03:30) Newfoundland Time - St. Johns"
      ),
      new Timezone(41, "Atlantic/Cape_Verde", "(GMT-01:00) Cape Verde"),
      new Timezone(42, "America/Curacao", "(GMT-04:00) Curacao"),
      new Timezone(43, "America/Panama", "(GMT-05:00) Panama"),
      new Timezone(44, "Africa/Lagos", "(GMT+01:00) Lagos"),
      new Timezone(45, "Africa/Ndjamena", "(GMT+01:00) Ndjamena"),
      new Timezone(46, "Pacific/Easter", "(GMT-05:00) Easter Island"),
      new Timezone(46, "America/Punta_Arenas", "(GMT-03:00) Punta Arenas"),
      new Timezone(46, "America/Santiago", "(GMT-03:00) Santiago"),
      new Timezone(47, "Asia/Shanghai", "(GMT+08:00) China Time - Beijing"),
      new Timezone(48, "Indian/Christmas", "(GMT+07:00) Christmas"),
      new Timezone(49, "Indian/Cocos", "(GMT+06:30) Cocos"),
      new Timezone(50, "America/Bogota", "(GMT-05:00) Bogota"),
      new Timezone(51, "Africa/Nairobi", "(GMT+03:00) Nairobi"),
      new Timezone(52, "Africa/Lagos", "(GMT+01:00) Lagos"),
      new Timezone(53, "Africa/Lagos", "(GMT+01:00) Lagos"),
      new Timezone(53, "Africa/Maputo", "(GMT+02:00) Maputo"),
      new Timezone(54, "Pacific/Rarotonga", "(GMT-10:00) Rarotonga"),
      new Timezone(55, "America/Costa_Rica", "(GMT-06:00) Costa Rica"),
      new Timezone(56, "Africa/Abidjan", "(GMT+00:00) Abidjan"),
      new Timezone(
        57,
        "Europe/Belgrade",
        "(GMT+01:00) Central European Time - Belgrade"
      ),
      new Timezone(58, "America/Havana", "(GMT-05:00) Havana"),
      new Timezone(59, "America/Curacao", "(GMT-04:00) Curacao"),
      new Timezone(60, "Asia/Nicosia", "(GMT+02:00) Nicosia"),
      new Timezone(
        61,
        "Europe/Prague",
        "(GMT+01:00) Central European Time - Prague"
      ),
      new Timezone(62, "Europe/Copenhagen", "(GMT+01:00) Copenhagen"),
      new Timezone(63, "Africa/Nairobi", "(GMT+03:00) Nairobi"),
      new Timezone(64, "America/Port_of_Spain", "(GMT-04:00) Port of Spain"),
      new Timezone(65, "America/Santo_Domingo", "(GMT-04:00) Santo Domingo"),
      new Timezone(66, "Pacific/Galapagos", "(GMT-06:00) Galapagos"),
      new Timezone(66, "America/Guayaquil", "(GMT-05:00) Guayaquil"),
      new Timezone(67, "Africa/Cairo", "(GMT+02:00) Cairo"),
      new Timezone(68, "America/El_Salvador", "(GMT-06:00) El Salvador"),
      new Timezone(69, "Africa/Lagos", "(GMT+01:00) Lagos"),
      new Timezone(70, "Africa/Nairobi", "(GMT+03:00) Nairobi"),
      new Timezone(71, "Europe/Tallinn", "(GMT+02:00) Tallinn"),
      new Timezone(72, "Africa/Nairobi", "(GMT+03:00) Nairobi"),
      new Timezone(73, "Atlantic/Stanley", "(GMT-03:00) Stanley"),
      new Timezone(74, "Atlantic/Faroe", "(GMT+00:00) Faeroe"),
      new Timezone(75, "Pacific/Fiji", "(GMT+13:00) Fiji"),
      new Timezone(76, "Europe/Helsinki", "(GMT+02:00) Helsinki"),
      new Timezone(77, "Europe/Paris", "(GMT+01:00) Paris"),
      new Timezone(78, "America/Cayenne", "(GMT-03:00) Cayenne"),
      new Timezone(79, "Pacific/Tahiti", "(GMT-10:00) Tahiti"),
      new Timezone(79, "Pacific/Marquesas", "(GMT-09:30) Marquesas"),
      new Timezone(79, "Pacific/Gambier", "(GMT-09:00) Gambier"),
      new Timezone(80, "Indian/Kerguelen", "(GMT+05:00) Kerguelen"),
      new Timezone(81, "Africa/Lagos", "(GMT+01:00) Lagos"),
      new Timezone(82, "Africa/Abidjan", "(GMT+00:00) Abidjan"),
      new Timezone(83, "Asia/Tbilisi", "(GMT+04:00) Tbilisi"),
      new Timezone(84, "Europe/Berlin", "(GMT+01:00) Berlin"),
      new Timezone(85, "Africa/Accra", "(GMT+00:00) Accra"),
      new Timezone(86, "Europe/Gibraltar", "(GMT+01:00) Gibraltar"),
      new Timezone(87, "Europe/Athens", "(GMT+02:00) Athens"),
      new Timezone(88, "America/Thule", "(GMT-04:00) Thule"),
      new Timezone(88, "America/Godthab", "(GMT-03:00) Godthab"),
      new Timezone(88, "America/Scoresbysund", "(GMT-01:00) Scoresbysund"),
      new Timezone(88, "America/Danmarkshavn", "(GMT+00:00) Danmarkshavn"),
      new Timezone(89, "America/Port_of_Spain", "(GMT-04:00) Port of Spain"),
      new Timezone(90, "America/Port_of_Spain", "(GMT-04:00) Port of Spain"),
      new Timezone(91, "Pacific/Guam", "(GMT+10:00) Guam"),
      new Timezone(92, "America/Guatemala", "(GMT-06:00) Guatemala"),
      new Timezone(93, "Europe/London", "(GMT+00:00) London"),
      new Timezone(94, "Africa/Abidjan", "(GMT+00:00) Abidjan"),
      new Timezone(95, "Africa/Bissau", "(GMT+00:00) Bissau"),
      new Timezone(96, "America/Guyana", "(GMT-04:00) Guyana"),
      new Timezone(97, "America/Port-au-Prince", "(GMT-05:00) Port-au-Prince"),
      new Timezone(98, "Indian/Kerguelen", "(GMT+05:00) Kerguelen"),
      new Timezone(
        99,
        "America/Tegucigalpa",
        "(GMT-06:00) Central Time - Tegucigalpa"
      ),
      new Timezone(100, "Asia/Hong_Kong", "(GMT+08:00) Hong Kong"),
      new Timezone(101, "Europe/Budapest", "(GMT+01:00) Budapest"),
      new Timezone(102, "Atlantic/Reykjavik", "(GMT+00:00) Reykjavik"),
      new Timezone(103, "Asia/Calcutta", "(GMT+05:30) India Standard Time"),
      new Timezone(104, "Asia/Jakarta", "(GMT+07:00) Jakarta"),
      new Timezone(104, "Asia/Makassar", "(GMT+08:00) Makassar"),
      new Timezone(104, "Asia/Jayapura", "(GMT+09:00) Jayapura"),
      new Timezone(105, "Asia/Tehran", "(GMT+03:30) Tehran"),
      new Timezone(106, "Asia/Baghdad", "(GMT+03:00) Baghdad"),
      new Timezone(107, "Europe/Dublin", "(GMT+00:00) Dublin"),
      new Timezone(108, "Europe/London", "(GMT+00:00) London"),
      new Timezone(109, "Asia/Jerusalem", "(GMT+02:00) Jerusalem"),
      new Timezone(110, "Europe/Rome", "(GMT+01:00) Rome"),
      new Timezone(111, "America/Jamaica", "(GMT-05:00) Jamaica"),
      new Timezone(112, "Asia/Tokyo", "(GMT+09:00) Tokyo"),
      new Timezone(113, "Europe/London", "(GMT+00:00) London"),
      new Timezone(114, "Asia/Amman", "(GMT+02:00) Amman"),
      new Timezone(115, "Asia/Aqtau", "(GMT+05:00) Aqtau"),
      new Timezone(115, "Asia/Aqtobe", "(GMT+05:00) Aqtobe"),
      new Timezone(115, "Asia/Almaty", "(GMT+06:00) Almaty"),
      new Timezone(116, "Africa/Nairobi", "(GMT+03:00) Nairobi"),
      new Timezone(117, "Pacific/Tarawa", "(GMT+12:00) Tarawa"),
      new Timezone(117, "Pacific/Kiritimati", "(GMT+14:00) Kiritimati"),
      new Timezone(118, "Asia/Riyadh", "(GMT+03:00) Riyadh"),
      new Timezone(119, "Asia/Bishkek", "(GMT+06:00) Bishkek"),
      new Timezone(120, "Asia/Bangkok", "(GMT+07:00) Bangkok"),
      new Timezone(121, "Europe/Riga", "(GMT+02:00) Riga"),
      new Timezone(122, "Asia/Beirut", "(GMT+02:00) Beirut"),
      new Timezone(123, "Africa/Johannesburg", "(GMT+02:00) Johannesburg"),
      new Timezone(124, "Africa/Monrovia", "(GMT+00:00) Monrovia"),
      new Timezone(125, "Africa/Tripoli", "(GMT+02:00) Tripoli"),
      new Timezone(126, "Europe/Zurich", "(GMT+01:00) Zurich"),
      new Timezone(127, "Europe/Vilnius", "(GMT+02:00) Vilnius"),
      new Timezone(128, "Europe/Luxembourg", "(GMT+01:00) Luxembourg"),
      new Timezone(129, "Asia/Macau", "(GMT+08:00) Macau"),
      new Timezone(
        130,
        "Europe/Belgrade",
        "(GMT+01:00) Central European Time - Belgrade"
      ),
      new Timezone(131, "Africa/Nairobi", "(GMT+03:00) Nairobi"),
      new Timezone(132, "Africa/Maputo", "(GMT+02:00) Maputo"),
      new Timezone(133, "Asia/Kuala_Lumpur", "(GMT+08:00) Kuala Lumpur"),
      new Timezone(134, "Indian/Maldives", "(GMT+05:00) Maldives"),
      new Timezone(135, "Africa/Abidjan", "(GMT+00:00) Abidjan"),
      new Timezone(136, "Europe/Malta", "(GMT+01:00) Malta"),
      new Timezone(137, "Pacific/Kwajalein", "(GMT+12:00) Kwajalein"),
      new Timezone(137, "Pacific/Majuro", "(GMT+12:00) Majuro"),
      new Timezone(138, "America/Martinique", "(GMT-04:00) Martinique"),
      new Timezone(139, "Africa/Abidjan", "(GMT+00:00) Abidjan"),
      new Timezone(140, "Indian/Mauritius", "(GMT+04:00) Mauritius"),
      new Timezone(141, "IAfrica/Nairobi", "(GMT+03:00) Nairobi"),
      new Timezone(
        142,
        "America/Tijuana",
        "(GMT-08:00) Pacific Time - Tijuana"
      ),
      new Timezone(
        142,
        "America/Hermosillo",
        "(GMT-07:00) Mountain Time - Hermosillo"
      ),
      new Timezone(
        142,
        "America/Mazatlan",
        "(GMT-07:00) Mountain Time - Chihuahua, Mazatlan"
      ),
      new Timezone(
        142,
        "America/Mexico_City",
        "(GMT-06:00) Central Time - Mexico City"
      ),
      new Timezone(142, "America/Cancun", "(GMT-05:00) America Cancun"),
      new Timezone(143, "Pacific/Chuuk", "(GMT+10:00) Truk"),
      new Timezone(143, "Pacific/Kosrae", "(GMT+11:00) Kosrae"),
      new Timezone(143, "Pacific/Pohnpei", "(GMT+11:00) Ponape"),
      new Timezone(144, "Europe/Chisinau", "(GMT+02:00) Chisinau"),
      new Timezone(145, "Europe/Monaco", "(GMT+01:00) Monaco"),
      new Timezone(146, "Asia/Hovd", "(GMT+07:00) Hovd"),
      new Timezone(146, "Asia/Choibalsan", "Asia/Choibalsan"),
      new Timezone(146, "Asia/Ulaanbaatar", "(GMT+08:00) Ulaanbaatar"),
      new Timezone(
        147,
        "Europe/Belgrade",
        "(GMT+01:00) Central European Time - Belgrade"
      ),
      new Timezone(148, "America/Port_of_Spain", "(GMT-04:00) Port of Spain"),
      new Timezone(149, "Africa/Casablanca", "(GMT+00:00) Casablanca"),
      new Timezone(150, "Africa/Maputo", "(GMT+02:00) Maputo"),
      new Timezone(151, "Asia/Yangon", "(GMT+06:30) Rangoon"),
      new Timezone(152, "Africa/Windhoek", "(GMT+02:00) Windhoek"),
      new Timezone(153, "Pacific/Nauru", "(GMT+12:00) Nauru"),
      new Timezone(154, "Asia/Katmandu", "(GMT+05:45) Katmandu"),
      new Timezone(155, "Europe/Amsterdam", "(GMT+01:00) Amsterdam"),
      new Timezone(156, "Pacific/Noumea", "(GMT+11:00) Noumea"),
      new Timezone(157, "Pacific/Auckland", "(GMT+13:00) Auckland"),
      new Timezone(158, "America/Managua", "(GMT-06:00) Managua"),
      new Timezone(159, "Africa/Lagos", "(GMT+01:00) Lagos"),
      new Timezone(160, "Africa/Lagos", "(GMT+01:00) Lagos"),
      new Timezone(161, "Pacific/Niue", "(GMT-11:00) Niue"),
      new Timezone(162, "Pacific/Norfolk", "(GMT+11:00) Norfolk"),
      new Timezone(163, "Pacific/Guam", "(GMT+10:00) Guam"),
      new Timezone(164, "Asia/Pyongyang", "(GMT+08:30) Pyongyang"),
      new Timezone(165, "Europe/Oslo", "(GMT+01:00) Oslo"),
      new Timezone(166, "Asia/Dubai", "(GMT+04:00) Dubai"),
      new Timezone(167, "Asia/Karachi", "(GMT+05:00) Karachi"),
      new Timezone(168, "Pacific/Palau", "(GMT+09:00) Palau"),
      new Timezone(169, "Asia/Gaza", "(GMT+02:00) Gaza"),
      new Timezone(170, "America/Panama", "(GMT-05:00) Panama"),
      new Timezone(171, "Pacific/Port_Moresby", "(GMT+10:00) Port Moresby"),
      new Timezone(172, "America/Asuncion", "(GMT-03:00) Asuncion"),
      new Timezone(173, "America/Lima", "(GMT-05:00) Lima"),
      new Timezone(174, "Asia/Manila", "(GMT+08:00) Manila"),
      new Timezone(175, "Pacific/Pitcairn", "(GMT-08:00) Pitcairn"),
      new Timezone(176, "Europe/Warsaw", "(GMT+01:00) Warsaw"),
      new Timezone(177, "Atlantic/Azores", "(GMT-01:00) Azores"),
      new Timezone(177, "Europe/Lisbon", "(GMT+00:00) Lisbon"),
      new Timezone(178, "America/Puerto_Rico", "(GMT-04:00) Puerto Rico"),
      new Timezone(179, "America/Puerto_Rico", "(GMT-04:00) Puerto Rico"),
      new Timezone(180, "Asia/Qatar", "(GMT+03:00) Qatar"),
      new Timezone(181, "Indian/Reunion", "(GMT+04:00) Reunion"),
      new Timezone(182, "Europe/Bucharest", "(GMT+02:00) Bucharest"),
      new Timezone(
        183,
        "Europe/Kaliningrad",
        "(GMT+02:00) Moscow-01 - Kaliningrad"
      ),
      new Timezone(183, "Europe/Moscow", "(GMT+03:00) Moscow+00 - Moscow"),
      new Timezone(183, "Europe/Samara", "(GMT+04:00) Moscow+01 - Samara"),
      new Timezone(
        183,
        "Asia/Yekaterinburg",
        "(GMT+05:00) Moscow+02 - Yekaterinburg"
      ),
      new Timezone(183, "Asia/Omsk", "(GMT+06:00) Moscow+03 - Omsk"),
      new Timezone(
        183,
        "Asia/Krasnoyarsk",
        "(GMT+07:00) Moscow+04 - Krasnoyarsk"
      ),
      new Timezone(183, "Asia/Irkutsk", "(GMT+08:00) Moscow+05 - Irkutsk"),
      new Timezone(183, "Asia/Yakutsk", "(GMT+09:00) Moscow+06 - Yakutsk"),
      new Timezone(
        183,
        "Asia/Vladivostok",
        "(GMT+10:00) Moscow+07 - Vladivostok"
      ),
      new Timezone(183, "Asia/Magadan", "(GMT+11:00) Moscow+08 - Magadan"),
      new Timezone(
        183,
        "Asia/Kamchatka",
        "(GMT+12:00) Moscow+09 - Petropavlovsk-Kamchatskiy"
      ),
      new Timezone(184, "Africa/Maputo", "(GMT+02:00) Maputo"),
      new Timezone(185, "Pacific/Apia", "(GMT+14:00) Apia"),
      new Timezone(186, "Europe/Rome", "(GMT+01:00) Rome"),
      new Timezone(187, "Africa/Abidjan", "(GMT+00:00) Abidjan"),
      new Timezone(188, "Asia/Riyadh", "(GMT+03:00) Riyadh"),
      new Timezone(189, "Africa/Abidjan", "(GMT+00:00) Abidjan"),
      new Timezone(
        190,
        "Europe/Belgrade",
        "(GMT+01:00) Central European Time - Belgrade"
      ),
      new Timezone(191, "Indian/Mahe", "(GMT+04:00) Mahe"),
      new Timezone(192, "Africa/Abidjan", "(GMT+00:00) Abidjan"),
      new Timezone(193, "Asia/Singapore", "(GMT+08:00) Singapore"),
      new Timezone(194, "America/Curacao", "(GMT-04:00) Curacao"),
      new Timezone(
        195,
        "Europe/Prague",
        "(GMT+01:00) Central European Time - Prague"
      ),
      new Timezone(
        196,
        "Europe/Belgrade",
        "(GMT+01:00) Central European Time - Belgrade"
      ),
      new Timezone(197, "Pacific/Guadalcanal", "(GMT+11:00) Guadalcanal"),
      new Timezone(198, "Africa/Nairobi", "(GMT+03:00) Nairobi"),
      new Timezone(199, "Africa/Johannesburg", "(GMT+02:00) Johannesburg"),
      new Timezone(200, "Atlantic/South_Georgia", "(GMT-02:00) South Georgia"),
      new Timezone(201, "Asia/Seoul", "(GMT+09:00) Seoul"),
      new Timezone(202, "Africa/Khartoum", "(GMT+02:00) Khartoum"),
      new Timezone(203, "Atlantic/Canary", "(GMT+00:00) Canary Islands"),
      new Timezone(203, "Africa/Ceuta", "(GMT+01:00) Ceuta"),
      new Timezone(203, "Europe/Madrid", "(GMT+01:00) Madrid"),
      new Timezone(204, "Asia/Colombo", "(GMT+05:30) Colombo"),
      new Timezone(205, "Africa/Abidjan", "(GMT+00:00) Abidjan"),
      new Timezone(206, "America/Port_of_Spain", "(GMT-04:00) Port of Spain"),
      new Timezone(207, "America/Port_of_Spain", "(GMT-04:00) Port of Spain"),
      new Timezone(208, "America/Port_of_Spain", "(GMT-04:00) Port of Spain"),
      new Timezone(209, "America/Miquelon", "(GMT-03:00) Miquelon"),
      new Timezone(210, "America/Port_of_Spain", "(GMT-04:00) Port of Spain"),
      new Timezone(211, "Africa/Khartoum", "(GMT+02:00) Khartoum"),
      new Timezone(212, "America/Paramaribo", "(GMT-03:00) Paramaribo"),
      new Timezone(213, "Europe/Oslo", "(GMT+01:00) Oslo"),
      new Timezone(214, "Africa/Johannesburg", "(GMT+02:00) Johannesburg"),
      new Timezone(215, "Europe/Stockholm", "(GMT+01:00) Stockholm"),
      new Timezone(216, "Europe/Zurich", "(GMT+01:00) Zurich"),
      new Timezone(217, "Asia/Damascus", "(GMT+02:00) Damascus"),
      new Timezone(218, "Asia/Taipei", "(GMT+08:00) Taipei"),
      new Timezone(219, "Asia/Dushanbe", "(GMT+05:00) Dushanbe"),
      new Timezone(220, "Africa/Nairobi", "(GMT+03:00) Nairobi"),
      new Timezone(221, "Asia/Bangkok", "(GMT+07:00) Bangkok"),
      new Timezone(222, "Asia/Dili", "(GMT+09:00) Dili"),
      new Timezone(223, "Africa/Abidjan", "(GMT+00:00) Abidjan"),
      new Timezone(224, "Pacific/Fakaofo", "(GMT+13:00) Fakaofo"),
      new Timezone(225, "Pacific/Tongatapu", "(GMT+13:00) Tongatapu"),
      new Timezone(226, "America/Port_of_Spain", "(GMT-04:00) Port of Spain"),
      new Timezone(227, "Africa/Tunis", "(GMT+01:00) Tunis"),
      new Timezone(228, "Europe/Istanbul", "(GMT+03:00) Istanbul"),
      new Timezone(229, "Asia/Ashgabat", "(GMT+05:00) Ashgabat"),
      new Timezone(230, "America/Grand_Turk", "(GMT-04:00) Grand Turk"),
      new Timezone(231, "Pacific/Funafuti", "(GMT+12:00) Funafuti"),
      new Timezone(232, "Pacific/Pago_Pago", "(GMT-11:00) Pago Pago"),
      new Timezone(232, "Pacific/Honolulu", "(GMT-10:00) Hawaii Time"),
      new Timezone(232, "Pacific/Wake", "(GMT+12:00) Wake"),
      new Timezone(232, "Pacific/Enderbury", "(GMT+13:00) Enderbury"),
      new Timezone(233, "America/Port_of_Spain", "(GMT-04:00) Port of Spain"),
      new Timezone(234, "Africa/Nairobi", "(GMT+03:00) Nairobi"),
      new Timezone(235, "Europe/Kiev", "(GMT+02:00) Kiev"),
      new Timezone(236, "Asia/Dubai", "(GMT+04:00) Dubai"),
      new Timezone(237, "Europe/London", "(GMT+00:00) London"),
      new Timezone(238, "Pacific/Honolulu", "(GMT-10:00) Hawaii Time"),
      new Timezone(238, "America/Anchorage", "(GMT-09:00) Alaska Time"),
      new Timezone(238, "America/Los_Angeles", "(GMT-08:00) Pacific Time"),
      new Timezone(238, "America/Denver", "(GMT-07:00) Mountain Time"),
      new Timezone(
        238,
        "America/Phoenix",
        "(GMT-07:00) Mountain Time - Arizona"
      ),
      new Timezone(238, "America/Chicago", "(GMT-06:00) Central Time"),
      new Timezone(238, "America/New_York", "(GMT-05:00) Eastern Time"),
      new Timezone(239, "America/Montevideo", "(GMT-03:00) Montevideo"),
      new Timezone(240, "Asia/Tashkent", "(GMT+05:00) Tashkent"),
      new Timezone(241, "Pacific/Efate", "(GMT+11:00) Efate"),
      new Timezone(242, "Europe/Rome", "(GMT+01:00) Rome"),
      new Timezone(243, "America/Caracas", "(GMT-04:00) Caracas"),
      new Timezone(244, "Asia/Saigon", "(GMT+07:00) Hanoi"),
      new Timezone(245, "Pacific/Wallis", "(GMT+12:00) Wallis"),
      new Timezone(246, "Africa/El_Aaiun", "(GMT+00:00) El Aaiun"),
      new Timezone(247, "Asia/Riyadh", "(GMT+03:00) Riyadh"),
      new Timezone(248, "Africa/Maputo", "(GMT+02:00) Maputo"),
      new Timezone(249, "Africa/Maputo", "(GMT+02:00) Maputo"),
    ];
  }

  convertToCSV(objArray) {
    var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    var str = "";
    var row = "";
    for (var index in objArray[0]) {
      row += index + ",";
    }
    row = row.slice(0, -1);
    str += row + "\r\n";
    for (var i = 0; i < array.length; i++) {
      var line = "";
      for (var index in array[i]) {
        if (line != "") line += ",";
        line += array[i][index];
      }
      str += line + "\r\n";
    }
    return str;
  }

  convertStringToBoolean(string) {
    switch (string.toLowerCase().trim()) {
      case "true":
      case "yes":
      case "1":
        return true;
      case "false":
      case "no":
      case "0":
      case null:
        return false;
      default:
        return Boolean(string);
    }
  }

  getTimeZonesByCountryId(countryId: number) {
    let convertedCountryId = +countryId;
    var filteredTimeZones = this.getTimeZones().filter(function (timezone) {
      return timezone.countryId === convertedCountryId;
    });
    return filteredTimeZones;
  }

  getTimeZoneByTimeZonId(timeZoneId: string) {
    var filteredTimeZones = this.getTimeZones().filter(function (timezone) {
      return timezone.timezoneId === timeZoneId;
    });
    return filteredTimeZones;
  }

  startLoader(httpRequestLoader: HttpRequestLoader) {
    this.pageContnetBgColor = "#fff";
    httpRequestLoader.isHorizontalCss = true;
    httpRequestLoader.isLoading = true;
    httpRequestLoader.isServerError = false;
    httpRequestLoader.message = "";
  }

  stopLoader(httpRequestLoader: HttpRequestLoader) {
    this.pageContnetBgColor = "#F1F3FA";
    httpRequestLoader.isHorizontalCss = false;
    httpRequestLoader.isLoading = false;
  }

  replacePartnerLogo(
    updatedBody: string,
    partnerLogo: string,
    partnerCompanyUrl: string,
    campaign: Campaign
  ) {
    if (campaign.partnerCompanyLogo != undefined) {
      partnerLogo = campaign.partnerCompanyLogo;
    } else {
      partnerLogo = partnerLogo.replace(
        "http://localhost:8080",
        "https://xamp.io"
      );
    }
    updatedBody = updatedBody.replace(
      "https://xamp.io/vod/images/co-branding.png",
      partnerLogo
    );
    return (updatedBody = this.replaceCoBrandingDummyUrl(
      updatedBody,
      partnerCompanyUrl
    ));
  }

  replaceCoBrandingDummyUrl(updatedBody: string, partnerCompanyUrl: string) {
    return (updatedBody = updatedBody.replace(
      "https://dummycobrandingurl.com",
      partnerCompanyUrl
    ));
  }

  replaceCoBrandingDummyUrlByUserProfile(updatedBody: string) {
    return (updatedBody = updatedBody.replace(
      "https://dummycobrandingurl.com",
      this.authenticationService.userProfile.websiteUrl
    ));
  }

  getAnchorTagsFromEmailTemplate(body: string, emailTemplateHrefLinks: any) {
    let self = this;
    $(body)
      .find("a")
      .each(function (e) {
        let href = $(this).attr("href");
        if (href != undefined && $.trim(href).length > 0) {
          if (
            href != "<SocialUbuntuURL>" &&
            href != "https://dummyurl.com" &&
            href != "https://dummycobrandingurl.com" &&
            href != "<unsubscribeURL>"
          ) {
            if (self.regularExpressions.URL_PATTERN.test(href)) {
              emailTemplateHrefLinks.push(href);
            }
          }
        }
      });
    return (emailTemplateHrefLinks = this.removeDuplicates(
      emailTemplateHrefLinks
    ));
  }

  showPassword(text: any) {
    let inputPassword = <HTMLInputElement>document.getElementById(text);
    if (inputPassword.type === "password") {
      inputPassword.type = "text";
      if (text === "oldPassword") {
        this.showInputOldPassword = true;
      } else if (text === "password") {
        this.showInputPassword = true;
      } else {
        this.showInputConfirmPassword = true;
      }
    } else {
      inputPassword.type = "password";
      if (text === "oldPassword") {
        this.showInputOldPassword = false;
      } else if (text === "password") {
        this.showInputPassword = false;
      } else {
        this.showInputConfirmPassword = false;
      }
    }
  }

  goToCampaignAnalytics(campaign) {
    this.campaignType = this.campaignType ? this.campaignType : "VIDEO";
    this.router.navigate([
      "/home/campaigns/" + campaign.campaignId + "/details",
    ]);
  }

  previewEmailTemplate(emailTemplate: EmailTemplate, campaign: any) {
    const body = emailTemplate.body;
    let userProfile = this.authenticationService.userProfile;
    let partnerLogo = userProfile.companyLogo;
    let partnerCompanyUrl = userProfile.websiteUrl;
    let emailTemplateName = emailTemplate.name;
    if (emailTemplateName.length > 25) {
      emailTemplateName = emailTemplateName.substring(0, 25) + "...";
    }
    $("#email-template-content").empty();
    $("#email-template-title").empty();
    $("#email-template-title").append(emailTemplateName);
    $("#email-template-title").prop("title", emailTemplate.name);
    let updatedBody = "";
    if (campaign.campaignType.toLocaleString().includes("VIDEO")) {
      let selectedVideoGifPath = campaign.campaignVideoFile.gifImagePath;
      updatedBody = emailTemplate.body.replace(
        "<SocialUbuntuImgURL>",
        selectedVideoGifPath
      );
      updatedBody = updatedBody.replace(
        "&lt;SocialUbuntuURL&gt;",
        "javascript:void(0)"
      );
      updatedBody = updatedBody.replace(
        "<SocialUbuntuURL>",
        "javascript:void(0)"
      );
      updatedBody = updatedBody.replace(
        "https://dummyurl.com",
        "javascript:void(0)"
      );
      updatedBody = updatedBody.replace(
        "https://xamp.io/vod/images/xtremand-video.gif",
        selectedVideoGifPath
      );
      updatedBody = updatedBody.replace(
        "&lt;SocialUbuntuImgURL&gt;",
        selectedVideoGifPath
      );
    } else {
      updatedBody = body.replace(
        '<div id="video-tag">',
        '<div id="video-tag" style="display:none">'
      );
    }
    if (!campaign.enableCoBrandingLogo) {
      updatedBody = updatedBody.replace(
        '<a href="https://dummycobrandingurl.com"',
        '<a href="https://dummycobrandingurl.com" style="display:none"'
      );
      updatedBody = updatedBody.replace(
        "https://xamp.io/vod/images/co-branding.png",
        ""
      );
    }
    let isRedistributeSection = this.router.url.indexOf("/re-distribute") > -1;
    if (campaign.nurtureCampaign || isRedistributeSection) {
      updatedBody = this.replacePartnerLogo(
        updatedBody,
        partnerLogo,
        partnerCompanyUrl,
        campaign
      );
    }
    updatedBody = this.replaceMyMergeTags(
      campaign.myMergeTagsInfo,
      updatedBody
    );
    $("#email-template-content").append(updatedBody);
    $(".modal .modal-body").css("overflow-y", "auto");
    $("#email_template_preivew").modal("show");
    $(".modal .modal-body").css("max-height", $(window).height() * 0.75);
  }

  showPreviewAfterMergeTags(updatedBody: string) {
    $("#email-template-content").append(updatedBody);
    $(".modal .modal-body").css("overflow-y", "auto");
    $("#email_template_preivew").modal("show");
    $(".modal .modal-body").css("max-height", $(window).height() * 0.75);
  }

  showEmailTemplatePreview(
    campaign: Campaign,
    campaignType: string,
    selectedVideoGifPath: string,
    emailTemplateBody: string
  ) {
    let updatedBody = "";
    let userProfile = this.authenticationService.userProfile;
    let partnerLogo = userProfile.companyLogo;
    let partnerCompanyUrl = userProfile.websiteUrl;
    if (this.campaignType == "video") {
      updatedBody = emailTemplateBody.replace(
        "<SocialUbuntuImgURL>",
        selectedVideoGifPath
      );
      updatedBody = updatedBody.replace(
        "&lt;SocialUbuntuURL&gt;",
        "javascript:void(0)"
      );
      updatedBody = updatedBody.replace(
        "<SocialUbuntuURL>",
        "javascript:void(0)"
      );
      updatedBody = updatedBody.replace(
        "https://dummyurl.com",
        "javascript:void(0)"
      );
      updatedBody = updatedBody.replace(
        "https://xamp.io/vod/images/xtremand-video.gif",
        selectedVideoGifPath
      );
      updatedBody = updatedBody.replace(
        "&lt;SocialUbuntuImgURL&gt;",
        selectedVideoGifPath
      );
    } else {
      updatedBody = emailTemplateBody.replace(
        '<div id="video-tag">',
        '<div id="video-tag" style="display:none">'
      );
    }
    if (!campaign.enableCoBrandingLogo) {
      updatedBody = updatedBody.replace(
        '<a href="https://dummycobrandingurl.com"',
        '<a href="https://dummycobrandingurl.com" style="display:none"'
      );
      updatedBody = updatedBody.replace(
        "https://xamp.io/vod/images/co-branding.png",
        ""
      );
    }
    let isRedistributeSection = this.router.url.indexOf("/re-distribute") > -1;
    if (campaign.nurtureCampaign || isRedistributeSection) {
      updatedBody = this.replacePartnerLogo(
        updatedBody,
        partnerLogo,
        partnerCompanyUrl,
        campaign
      );
    }
    /************My Merge Tags Info**********/
    updatedBody = this.replaceMyMergeTags(
      campaign.myMergeTagsInfo,
      updatedBody
    );
    return updatedBody;
  }

  replaceMyMergeTags(myMergeTags: any, updatedBody: string) {
    if (myMergeTags != undefined && this.hasMyMergeTagsExits(updatedBody)) {
      updatedBody = updatedBody.replace(
        this.senderMergeTag.senderFirstNameGlobal,
        myMergeTags.myFirstName
      );
      updatedBody = updatedBody.replace(
        this.senderMergeTag.senderMiddleNameGlobal,
        myMergeTags.myMiddleName
      );
      updatedBody = updatedBody.replace(
        this.senderMergeTag.senderLastNameGlobal,
        myMergeTags.myLastName
      );
      updatedBody = updatedBody.replace(
        this.senderMergeTag.senderFullNameGlobal,
        myMergeTags.myFullName
      );
      updatedBody = updatedBody.replace(
        this.senderMergeTag.senderJobTitleGlobal,
        myMergeTags.senderJobTitle
      );
      updatedBody = updatedBody.replace(
        this.senderMergeTag.senderEmailIdGlobal,
        myMergeTags.myEmailId
      );
      updatedBody = updatedBody.replace(
        this.senderMergeTag.senderContactNumberGlobal,
        myMergeTags.myContactNumber
      );
      updatedBody = updatedBody.replace(
        this.senderMergeTag.senderCompanyGlobal,
        myMergeTags.senderCompany
      );
      updatedBody = updatedBody.replace(
        this.senderMergeTag.senderCompanyUrlGlobal,
        myMergeTags.myCompanyUrl
      );
      updatedBody = updatedBody.replace(
        this.senderMergeTag.senderCompanyAddressGlobal,
        myMergeTags.myCompanyAddress
      );
      updatedBody = updatedBody.replace(
        this.senderMergeTag.senderCompanyContactNumberGlobal,
        myMergeTags.myCompanyContactNumber
      );
      updatedBody = updatedBody.replace(
        this.senderMergeTag.privacyPolicyGlobal,
        myMergeTags.privacyPolicy
      );
      updatedBody = updatedBody.replace(
        this.senderMergeTag.senderAboutUsGlobal,
        myMergeTags.aboutUs
      );
      updatedBody = updatedBody.replace(
        this.senderMergeTag.senderEventUrlGlobal,
        myMergeTags.eventUrl
      );
      
      /*****XNFR-281*******/  
      /*******Instagram****/
      updatedBody = updatedBody.replace(
        this.senderMergeTag.senderCompanyInstagramUrlGlobal,
        myMergeTags.companyInstagramUrl
      );
      /*******Twitter****/
      updatedBody = updatedBody.replace(
        this.senderMergeTag.senderCompanyTwitterUrlGlobal,
        myMergeTags.companyTwitterUrl
      );
      /*******Facebook****/
      updatedBody = updatedBody.replace(
        this.senderMergeTag.senderCompanyFacebookUrlGlobal,
        myMergeTags.companyFacebookUrl
      );
      /*******Google****/
      updatedBody = updatedBody.replace(
        this.senderMergeTag.senderCompanyGoogleUrlGlobal,
        myMergeTags.companyGoogleUrl
      );
      /*******Linkedin****/
      updatedBody = updatedBody.replace(
        this.senderMergeTag.senderCompanyLinkedinUrlGlobal,
        myMergeTags.companyLinkedinUrl
      );

       /*****XNFR-281*******/  
    }
    return updatedBody;
  }

  changeSideBar() {
    this.isSidebarClosed = !this.isSidebarClosed;
    if (!this.isSidebarClosed) {
      document.body.className =
        "login page-header-fixed page-sidebar-closed-hide-logo page-container-bg-solid page-sidebar-closed-hide-logo";
    } else {
      document.body.className =
        "login page-header-fixed page-sidebar-closed-hide-logo page-container-bg-solid page-sidebar-closed-hide-logo page-sidebar-closed";
    }
  }

  hasMyMergeTagsExits(body: string) {
    return (
      body.indexOf(this.senderMergeTag.senderFirstName) > -1 ||
      body.indexOf(this.senderMergeTag.senderLastName) > -1 ||
      body.indexOf(this.senderMergeTag.senderMiddleName) > -1 ||
      body.indexOf(this.senderMergeTag.senderFullName) > -1 ||
      body.indexOf(this.senderMergeTag.senderJobTitle) > -1 ||
      body.indexOf(this.senderMergeTag.senderEmailId) > -1 ||
      body.indexOf(this.senderMergeTag.senderContactNumber) > -1 ||
      body.indexOf(this.senderMergeTag.senderCompany) > -1 ||
      body.indexOf(this.senderMergeTag.senderCompanyUrl) > -1 ||
      body.indexOf(this.senderMergeTag.senderCompanyContactNumber) > -1 ||
      body.indexOf(this.senderMergeTag.aboutUs) > -1 ||
      body.indexOf(this.senderMergeTag.privacyPolicy) > -1 ||
      body.indexOf(this.senderMergeTag.senderAboutUs) > -1 ||
      body.indexOf(this.senderMergeTag.senderEventUrl) > -1 ||
      body.indexOf(this.senderMergeTag.senderCompanyAddress) > -1 ||
      body.indexOf(this.senderMergeTag.senderCompanyGoogleUrl)>-1 ||
      body.indexOf(this.senderMergeTag.senderCompanyFacebookUrl)>-1 ||
      body.indexOf(this.senderMergeTag.senderCompanyLinkedinUrl)>-1 ||
      body.indexOf(this.senderMergeTag.senderCompanyTwitterUrl)>-1 ||
      body.indexOf(this.senderMergeTag.senderCompanyInstagramUrl)>-1
    );
  }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  scrollSmoothToBottom() {
    if (!this.isMobile()) {
      const scrollingElement = document.scrollingElement || document.body;
      $(scrollingElement).animate(
        { scrollTop: document.body.scrollHeight },
        500
      );
    }
  }
  //Require jQuery
  scrollSmoothToTop() {
    if (!this.isMobile()) {
      const scrollingElement = document.scrollingElement || document.body;
      $(scrollingElement).animate({ scrollTop: 0 }, 500);
    }
  }

  scrollSmoothToDiv(elementId: string) {
    if (!this.isMobile()) {
      $("#" + elementId).animate(
        { scrollTop: document.body.scrollHeight },
        500
      );
    }
  }
  getOrgCampaignTypes(companyId: any) {
    return this.http
      .get(
        this.authenticationService.REST_URL +
          `campaign/access/${companyId}?access_token=${this.authenticationService.access_token}`
      )
      .map(this.extractData)
      .catch(this.handleError);
  }

  getHomeOrgCampaignTypes(uRl) {
    const url = this.authenticationService.REST_URL + uRl;
    return this.http.get(url, "").map(this.extractData).catch(this.handleError);
  }

  getCompanyIdByUserId(userId: any) {
    return this.http
      .get(
        this.authenticationService.REST_URL +
          `admin/get-company-id/${userId}?access_token=${this.authenticationService.access_token}`
      )
      .map(this.extractData)
      .catch(this.handleError);
  }

  replaceAllSpacesWithUnderScore(text: string) {
    return (text = text.replace(/ /g, "_").toLocaleLowerCase());
  }
  replaceAllSpacesWithEmpty(text: string) {
    return (text = text.replace(/ /g, "").toLocaleLowerCase());
  }

  scrollToBottomByDivId(divId: string) {
    if (!this.isMobile()) {
      $("#" + divId).animate(
        {
          scrollTop: $("#" + divId)[0].scrollHeight,
        },
        500
      );
    }
  }

  removeObjectFromArrayList(arr: any, id: string, key: string) {
    arr = $.grep(arr, function (data, index) {
      return data[key] !== id;
    });
    return arr;
  }

  spliceArray(arr: any, id: string) {
    arr = $.grep(arr, function (data: any, index: number) {
      return data.divId !== id;
    });
    return arr;
  }

  getHomeCompanyIdByUserId(uRl) {
    const url = this.authenticationService.REST_URL + uRl;
    return this.http.get(url, "").map(this.extractData).catch(this.handleError);
  }

  getMyMergeTagsInfoByEmailId(data: any) {
    return this.http
      .post(
        this.authenticationService.REST_URL +
          "campaign/getMyMergeTagsInfo?access_token=" +
          this.authenticationService.access_token,
        data
      )
      .map(this.extractData)
      .catch(this.handleError);
  }

  downloadTemplate(campaignId: number, type: string) {
    //window.location.href = this.authenticationService.REST_URL+"campaign/download/"+campaignId+"/"+this.authenticationService.getUserId()+"/"+type+"?access_token="+this.authenticationService.access_token;
    //let url = this.authenticationService.REST_URL + "campaign/download/" + campaignId + "/" + this.authenticationService.getUserId() + "/" + type + "?access_token=" + this.authenticationService.access_token;
    //let opner = window.open(url, '_blank');
    let url = this.authenticationService.APP_URL + "/download/" + type;
    window.open(url, "_blank");
  }

  showServerErrorResponse(httpRequestLoader: HttpRequestLoader) {
    httpRequestLoader.isLoading = false;
    httpRequestLoader.isServerError = true;
    return new CustomResponse(
      "ERROR",
      this.properties.serverErrorMessage,
      true
    );
  }

  getLegalBasisOptions(companyId: number) {
    return this.http
      .get(
        this.authenticationService.REST_URL +
          "gdpr/setting/legal_basis/" +
          companyId +
          "?access_token=" +
          this.authenticationService.access_token,
        ""
      )
      .map(this.extractData)
      .catch(this.handleError);
  }

  setLegalBasisOptions(
    input: any,
    gdprStatus: boolean,
    selectedLegalBasisOptions: any
  ) {
    if (gdprStatus) {
      let self = this;
      $.each(input, function (index: number, contact: User) {
        contact.legalBasis = selectedLegalBasisOptions;
      });
    }
  }

  onAddingEmailIds(emailIds: any) {
    let newEmailIds = [];
    for (let i = 0; i < emailIds.length; i++) {
      const tag = emailIds[i];
      if (tag["value"] !== undefined) {
        newEmailIds[i] = tag["value"];
      }
      // else {
      //     newEmailIds[i] = tag;
      // }
    }
    const otherEmailIds = newEmailIds.map((v) => v.toLowerCase());
    var uniqueEmailids = [];
    $.each(otherEmailIds, function (i, el) {
      if ($.inArray(el, uniqueEmailids) === -1) uniqueEmailids.push(el);
    });
    if (uniqueEmailids.length < emailIds.length) {
      emailIds.pop();
    }
  }

  copyInputMessage(
    inputElement,
    index: number,
    successMessageClass: string,
    id: string
  ) {
    let messageId = id + index;
    $("." + successMessageClass).hide();
    $("#" + messageId).hide();
    inputElement.select();
    document.execCommand("copy");
    inputElement.setSelectionRange(0, 0);
    $("#" + messageId).show(500);
  }

  getCurrentRouteUrl() {
    return this.router.url;
  }
  showSweetAlert(message1: string, message2: string, type: string) {
    swal(message1, message2, type);
  }

  showReAuthenticateMessage() {
    swal(this.properties.reAuthenticateMessage, "", "info");
  }

  showSweetAlertSuccessMessage(message: string) {
    swal({
      title: message,
      type: "success",
      allowOutsideClick: false,
    });
  }
  showSweetAlertFailureMessage(message: string) {
    swal({
      title: message,
      type: "error",
      allowOutsideClick: false,
    });
  }

  showSweetAlertErrorMessage(errorMessage: string) {
    swal(errorMessage, "", "error");
  }

  showSweetAlertInfoMessage() {
    swal("Work In Progress", "", "info");
  }

  showSweetAlertServerErrorMessage() {
    swal(this.properties.serverErrorMessage, "", "error");
  }

  showModalPopup(modalId:string) {
    $(".modal .modal-body").css("overflow-y", "auto");
    $("#" + modalId).modal("show");
    $(".modal .modal-body").css("max-height", $(window).height() * 0.75);
  }

  closeModalPopup(modalId:string) {
    $("#" + modalId).modal("hide");
  }

  openModalPopup(modalId:string) {
    $("#" + modalId).modal("show");
  }

  deleteAndEditAccess() {
    return (
      this.hasAllAccess() ||
      this.authenticationService.isVendor() ||
      this.authenticationService.isVendorPartner()
    );
  }

  public onMouseDown(event: any, tableId: string, columnPosition: number) {
    this.start = event.target;
    this.pressed = true;
    this.startX = event.x;
    this.startWidth = $(this.start).parent().width();
    this.initResizableColumns(tableId, columnPosition);
  }

  public initResizableColumns(tableId: string, columnPosition: number) {
    this.renderer.listenGlobal("body", "mousemove", (event: any) => {
      if (this.pressed) {
        let width = this.startWidth + (event.x - this.startX);
        $(this.start)
          .parent()
          .css({ "min-width": width, "max-   width": width });
        let index = $(this.start).parent().index() + columnPosition;
        $("#" + tableId + " tr td:nth-child(" + index + ")").css({
          "min-width": width,
          "max-width": width,
        });
      }
    });
    this.renderer.listenGlobal("body", "mouseup", (event: any) => {
      if (this.pressed) {
        this.pressed = false;
      }
    });
  }

  setDefaultDisplayType(modulesDisplayType: ModulesDisplayType) {
    let defaultDisplayType = localStorage.getItem("defaultDisplayType");
    if ("LIST" == defaultDisplayType) {
      modulesDisplayType.isListView = true;
      modulesDisplayType.isGridView = false;
      modulesDisplayType.isFolderGridView = false;
      modulesDisplayType.isFolderListView = false;
      modulesDisplayType.defaultDisplayType = defaultDisplayType;
    } else if ("GRID" == defaultDisplayType) {
      modulesDisplayType.isListView = false;
      modulesDisplayType.isGridView = true;
      modulesDisplayType.isFolderGridView = false;
      modulesDisplayType.isFolderListView = false;
      modulesDisplayType.defaultDisplayType = defaultDisplayType;
    } else if ("FOLDER_LIST" == defaultDisplayType) {
      modulesDisplayType.isListView = false;
      modulesDisplayType.isGridView = false;
      modulesDisplayType.isFolderGridView = false;
      modulesDisplayType.isFolderListView = true;
      modulesDisplayType.defaultDisplayType = defaultDisplayType;
    } else if ("FOLDER_GRID" == defaultDisplayType) {
      modulesDisplayType.isListView = false;
      modulesDisplayType.isGridView = false;
      modulesDisplayType.isFolderGridView = true;
      modulesDisplayType.isFolderListView = false;
      modulesDisplayType.defaultDisplayType = defaultDisplayType;
    } else {
      modulesDisplayType.isListView = true;
      modulesDisplayType.isGridView = false;
      modulesDisplayType.isFolderGridView = false;
      modulesDisplayType.isFolderListView = false;
    }
    return modulesDisplayType;
  }

  setDisplayType(modulesDisplayType: ModulesDisplayType, viewType: string) {
    if ("l" == viewType) {
      modulesDisplayType.isListView = true;
      modulesDisplayType.isGridView = false;
      modulesDisplayType.isFolderGridView = false;
      modulesDisplayType.isFolderListView = false;
    } else if ("g" == viewType) {
      modulesDisplayType.isListView = false;
      modulesDisplayType.isGridView = true;
      modulesDisplayType.isFolderGridView = false;
      modulesDisplayType.isFolderListView = false;
    }else if("fg"==viewType){
      modulesDisplayType.isListView = false;
      modulesDisplayType.isGridView = false;
      modulesDisplayType.isFolderGridView = true;
      modulesDisplayType.isFolderListView = false;
    }
    else if("fl"==viewType){
      modulesDisplayType.isListView = false;
      modulesDisplayType.isGridView = false;
      modulesDisplayType.isFolderGridView = false;
      modulesDisplayType.isFolderListView = true;
    }
    return modulesDisplayType;
  }

  getSenderMergeTagsData() {
    return this.http
      .get(
        this.authenticationService.REST_URL +
          "admin/getSenderMergeTagsData/" +
          this.authenticationService.getUserId() +
          "?access_token=" +
          this.authenticationService.access_token,
        ""
      )
      .map(this.extractData)
      .catch(this.handleError);
  }

  openChildWindow(url: string) {
    var x = screen.width / 2 - 700 / 2;
    var y = screen.height / 2 - 450 / 2;
    window.open(
      url,
      "Social Login",
      "toolbar=yes,scrollbars=yes,resizable=yes,top=" +
        y +
        ",left=" +
        x +
        ",width=700,height=485"
    );
  }

  closeChildWindowAndRefreshParentWindow(url: string) {
    window.opener.location.href = url;
    self.close();
  }

  closeChildWindowOnError() {
    window.opener.postMessage("Something went wrong", "*");
    self.close();
  }

  goToRouter(url: string) {
    this.router.navigate([url]);
  }
  goToPageNotFound() {
    this.router.navigate(["/404"]);
  }

  goToAccessDeniedPage() {
    this.router.navigate(["/access-denied"]);
  }

  goToDashboard() {
    this.router.navigate(["/home/dashboard"]);
  }

  filterSelectedColumnsFromArrayList(list: any, columnName: string) {
    return list.map(function (e: any) {
      return e[columnName];
    });
  }

  getFileExtension(filename: string) {
    var ext = filename.split(".").pop();
    if (ext == filename) return "";
    return ext;
  }

  showSweetAlertProcessingLoader(title: string) {
    swal({
      title: title,
      text: "Please Wait...",
      showConfirmButton: false,
      imageUrl: "assets/images/loader.gif",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  }
  showSweetAlertProceesor(title: string) {
    this.showSweetAlertProcessingLoader(title);
  }

  post(obj: any, url: string) {
    var mapForm = document.createElement("form");
    mapForm.target = "_blank";
    mapForm.method = "POST"; // or "post" if appropriate
    mapForm.action = url;
    Object.keys(obj).forEach(function (param) {
      var mapInput = document.createElement("input");
      mapInput.type = "hidden";
      mapInput.name = param;
      mapInput.setAttribute("value", obj[param]);
      mapForm.appendChild(mapInput);
    });
    document.body.appendChild(mapForm);
    mapForm.submit();
  }

  setModalPopupProperties() {
    $(".modal .modal-body").css("overflow-y", "auto");
    $(".modal .modal-body").css("max-height", $(window).height() * 0.75);
  }

  filterArrayList(array: Array<any>, itemToRemove: any) {
    return array.filter((item) => item!=undefined &&  item !== itemToRemove);
  }

  


  /*******CheckBox Code**********/
  highlightRowOnRowCick(trId: string,tableId: string,checkBoxName: string,selectedCheckBoxIds: any,parnterGroupsHeaderCheckBox: string,
    selectedCheckBoxValue: any,event: any) {
    trId = trId + "-" + selectedCheckBoxValue;
    let isChecked = $("#" + selectedCheckBoxValue).is(":checked");
    if (isChecked) {
      $("#" + selectedCheckBoxValue).prop("checked", false);
      $(trId).removeClass("row-selected");
      selectedCheckBoxIds.splice($.inArray(selectedCheckBoxValue, selectedCheckBoxIds),1);
    } else {
      $("#" + selectedCheckBoxValue).prop("checked", true);
      $(trId).addClass("row-selected");
      selectedCheckBoxIds.push(selectedCheckBoxValue);
    }
    this.checkOrUnCheckHeaderCheckBox(tableId,checkBoxName,parnterGroupsHeaderCheckBox);
    event.stopPropagation();
  }

  checkOrUnCheckHeaderCheckBox(tableId: string,checkBoxName: string,parnterGroupsHeaderCheckBox: string) {
    var trLength = $("#" + tableId + " tbody tr").length;
    var selectedRowsLength = $('[name="' + checkBoxName + '[]"]:checked').length;
    $("#" + parnterGroupsHeaderCheckBox).prop("checked",trLength == selectedRowsLength);
  }

  highlightRowByCheckBox(trId: string,tableId: string,checkBoxName: string,selectedCheckBoxIds: any,parnterGroupsHeaderCheckBox: string,
    checkBoxValue: any,event: any) {
      let isChecked = $("#" + checkBoxValue).is(":checked");
      if (isChecked) {
        $(trId).addClass("row-selected");
        selectedCheckBoxIds.push(checkBoxValue);
      } else {
        $(trId).removeClass("row-selected");
        selectedCheckBoxIds.splice($.inArray(checkBoxValue, selectedCheckBoxIds),1);
      }
    this.checkOrUnCheckHeaderCheckBox(tableId,checkBoxName,parnterGroupsHeaderCheckBox);
  }

  selectOrUnselectAllOfTheCurrentPage(
    trId: string,
    tableId: string,
    checkBoxName: string,
    selectedCheckBoxIds: any,
    pagination: Pagination,
    event: any
  ) {
    if (event.target.checked) {
      $('[name="' + checkBoxName + '[]"]').prop("checked", true);
      $('[name="' + checkBoxName + '[]"]:checked').each(function (
        _index: number
      ) {
        var id = $(this).val();
        selectedCheckBoxIds.push(parseInt(id));
        $(trId).addClass("row-selected");
      });
      selectedCheckBoxIds = this.removeDuplicates(selectedCheckBoxIds);
    } else {
      $('[name="' + checkBoxName + '[]"]').prop("checked", false);
      $("#" + tableId + " tr").removeClass("row-selected");
      if (
        pagination.maxResults > 30 ||
        pagination.maxResults == pagination.totalRecords
      ) {
        selectedCheckBoxIds = [];
      } else {
        selectedCheckBoxIds = this.removeDuplicates(selectedCheckBoxIds);
        let currentPageSelectedIds = pagination.pagedItems.map(function (a) {
          return a.id;
        });
        selectedCheckBoxIds = this.removeDuplicatesFromTwoArrays(
          selectedCheckBoxIds,
          currentPageSelectedIds
        );
      }
    }
    event.stopPropagation();
    return selectedCheckBoxIds;
  }
  /*******CheckBox Code**********/

  addMergeTags(mergeTags: any, isCampaign: boolean, isEvent: boolean) {
    mergeTags.push({ name: "First Name", value: "{{firstName}}" });
    mergeTags.push({ name: "Last Name", value: "{{lastName}}" });
    mergeTags.push({ name: "Full Name", value: "{{fullName}}" });
    mergeTags.push({ name: "Email Id", value: "{{emailId}}" });
    mergeTags.push({ name: "Company Name", value: "{{companyName}}" });
    mergeTags.push({ name: "Mobile Number", value: "{{mobileNumber}}" });
    mergeTags.push({ name: "Address", value: "{{address}}" });
    mergeTags.push({ name: "Zip Code", value: "{{zipcode}}" });
    mergeTags.push({ name: "City", value: "{{city}}" });
    mergeTags.push({ name: "State", value: "{{state}}" });
    mergeTags.push({ name: "Country", value: "{{country}}" });
    mergeTags.push({
      name: "Sender First Name",
      value: this.senderMergeTag.senderFirstName,
    });
    mergeTags.push({
      name: "Sender Middle Name",
      value: this.senderMergeTag.senderMiddleName,
    });
    mergeTags.push({
      name: "Sender Last Name",
      value: this.senderMergeTag.senderLastName,
    });
    mergeTags.push({
      name: "Sender Full Name",
      value: this.senderMergeTag.senderFullName,
    });
    mergeTags.push({
      name: this.senderMergeTag.senderJobTitleKey,
      value: this.senderMergeTag.senderJobTitle,
    });
    mergeTags.push({
      name: "Sender Email Id",
      value: this.senderMergeTag.senderEmailId,
    });
    mergeTags.push({
      name: "Sender Contact Number",
      value: this.senderMergeTag.senderContactNumber,
    });
    mergeTags = this.addSenderCompanyAndSenderCompanyUrlMergeTags(mergeTags);
    if (isCampaign == undefined || !isCampaign) {
      mergeTags =
        this.addSenderAboutUsAndCompanyContactAndPrivacyPolicyMergeTags(
          mergeTags
        );
      if (!this.authenticationService.module.isMarketingCompany) {
        mergeTags.push({
          name: "Partner About Us",
          value: this.senderMergeTag.aboutUs,
        });
      }
      mergeTags.push({
        name: "Unsubscribe Link",
        value: this.senderMergeTag.unsubscribeLink,
      });
    }
    if (isEvent) {
      mergeTags.push({ name: "Event Title", value: "{{event_title}}" });
      mergeTags.push({
        name: "Event Start Time",
        value: "{{event_start_time}}",
      });
      mergeTags.push({ name: "Event End Time", value: "{{event_end_time}}" });
      mergeTags.push({ name: "Event Address", value: "{{event_address}}" });
      mergeTags.push({ name: "Event From Name", value: "{{event_fromName}}" });
      mergeTags.push({ name: "Event EmailId", value: "{{event_emailId}}" });
      mergeTags.push({ name: "Vendor Name", value: "{{vendor_name}}" });
      mergeTags.push({ name: "Vendor Email Id", value: "{{vendor_emailId}}" });
    }
   
    return mergeTags;
  }

  addSenderCompanyAndSenderCompanyUrlMergeTags(mergeTags: any) {
    mergeTags.push({
      name: "Sender Company",
      value: this.senderMergeTag.senderCompany,
    });
    mergeTags.push({
      name: "Sender Company Url",
      value: this.senderMergeTag.senderCompanyUrl,
    });

      /*******XNFR-281******/
      /****Instagram******/
      mergeTags.push({
        name: this.senderMergeTag.senderCompanyInstragramUrlKey,
        value: this.senderMergeTag.senderCompanyInstagramUrl,
      });
  
      /****Twitter******/
      mergeTags.push({
        name: this.senderMergeTag.senderCompanyTwitterUrlKey,
        value: this.senderMergeTag.senderCompanyTwitterUrl,
      });

      /****Google******/
      mergeTags.push({
        name: this.senderMergeTag.senderCompanyGoogleUrlKey,
        value: this.senderMergeTag.senderCompanyGoogleUrl,
      });

      /****Facebook******/
      mergeTags.push({
        name: this.senderMergeTag.senderCompanyFacebookUrlKey,
        value: this.senderMergeTag.senderCompanyFacebookUrl,
      });

      /****Linkedin******/
      mergeTags.push({
        name: this.senderMergeTag.senderCompanyLinkedinUrlKey,
        value: this.senderMergeTag.senderCompanyLinkedinUrl,
      });

  
      /*******XNFR-281******/

    mergeTags.push({
      name: "Sender Company Address",
      value: this.senderMergeTag.senderCompanyAddress,
    });

    mergeTags.push({
      name: "Sender Event Url",
      value: this.senderMergeTag.senderEventUrl,
    });
    return mergeTags;
  }

  addSenderAboutUsAndCompanyContactAndPrivacyPolicyMergeTags(mergeTags: any) {
    mergeTags.push({
      name: "Sender About Us",
      value: this.senderMergeTag.senderAboutUs,
    });
    mergeTags.push({
      name: "Sender Company Contact Number",
      value: this.senderMergeTag.senderCompanyContactNumber,
    });
    mergeTags.push({
      name: "Sender Privacy Policy",
      value: this.senderMergeTag.privacyPolicy,
    });
    return mergeTags;
  }

  addPageMergeTags() {
    let mergeTags = [];
    mergeTags = this.addSenderCompanyAndSenderCompanyUrlMergeTags(mergeTags);
    mergeTags =
      this.addSenderAboutUsAndCompanyContactAndPrivacyPolicyMergeTags(
        mergeTags
      );
    return mergeTags;
  }

  disableDropDownById(dropDownId: string, color: boolean) {
    $("#" + dropDownId).prop("disabled", true);
    $("#" + dropDownId).css("color", "darkgray");
  }

  setTeamMemberFilterForPagination(pagination: Pagination, index: number) {
    pagination.partnerTeamMemberGroupFilter = index == 1;
    pagination.pageIndex = 1;
    pagination.maxResults = 12;
    return pagination;
  }

  isMobile() {
    let mobileView = window.matchMedia("(max-width: 767px)").matches;
    return mobileView;
  }

  getApiErrorMessage(error: any) {
    let statusCode = JSON.parse(error["status"]);
    let message = "";
    if (statusCode == 409 || statusCode == 400 || statusCode == 500 || statusCode==403) {
      let errorResponse = JSON.parse(error["_body"]);
      message = errorResponse["message"];
    } else {
      message = this.properties.serverErrorMessage;
    }
    return message;
  }

  /*****XNFR-125******/
  getBrowserTimeZone() {
    let timeZoneId = "";
    let intlTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (intlTimeZone != undefined) {
      timeZoneId = intlTimeZone;
    } else if (moment.tz.guess() != undefined) {
      timeZoneId = moment.tz.guess();
    }
    return timeZoneId;
  }
  /*****XNFR-125******/
  closeSweetAlert() {
    swal.close();
  }

  
  /****XNFR-83***/
  getSuccessOrErrorClassName(condition:boolean){
    return condition ? this.properties.successClass : this.properties.errorClass;
  } 

  getPagebleUrl(pagination:Pagination){
    let page = pagination.pageIndex;
    let size = pagination.maxResults;
    let searchKey = $.trim(pagination.searchKey)!=null ? $.trim(pagination.searchKey) :"";
    let sortColumn = $.trim(pagination.sortcolumn)!=null ? $.trim(pagination.sortcolumn):"";
    let sortOrder = $.trim(pagination.sortingOrder)!=null ? $.trim(pagination.sortingOrder):"";
    let sort = sortColumn.length>0 && sortOrder.length>0 ? sortColumn+","+sortOrder:"";
    let sortParam = sort.length>0 ? "&sort="+sort:"";
    let searchParam = searchKey.length>0 ? "&search="+searchKey:"";
    return $.trim("&page="+page+"&size="+size+sortParam+searchParam);
  }
  
  downloadCsvTemplate(url:string){
    window.location.href = this.authenticationService.REST_URL +url+"?access_token=" + this.authenticationService.access_token;
  }

  showHttpErrorMessage(error: any){
    this.scrollSmoothToTop();
    let statusCode = JSON.parse(error['status']);
    let message = this.properties.serverErrorMessage;
    if (statusCode == 409 || statusCode == 400) {
      let errorResponse = JSON.parse(error['_body']);
      message = errorResponse['message'];
    }
    return message;
  }

  addLoader(divId:string){
    this.scrollSmoothToTop();
    $('#'+divId).addClass('download-loader');
    
  }
  removeLoader(divId:string){
    this.scrollSmoothToTop();
    setTimeout(() => {
      $('#'+divId).removeClass('download-loader');
    }, 500);
  }
  /*********XNFR-83****/
  disableButton(event:any){
    event['target']['disabled'] = true;
    if(event['currentTarget']!=null){
      event['currentTarget']['disabled'] = true;
    }  
  }

  enableButton(event:any){
    setTimeout(() => {
      event['target']['disabled'] = false;
      if(event['currentTarget']!=null){
        event['currentTarget']['disabled'] = false;
      }      
     }, 500);
  }


  showServerErrorCustomResponse(){
    return new CustomResponse("ERROR",this.properties.serverErrorMessage,true);
  }

  scrollToModalPopUpBottomByDivId(divId:string){
    setTimeout(function(){
      $("#"+divId).animate({ scrollTop: $('#'+divId).prop("scrollHeight")}, 1000);
  },250); 
  }

  /*******XNFR-169*******/
  getCategoryType(moduleId:number){
    let categoryType = "";
    if(this.roles.damId==moduleId){
      categoryType = "DAM";
    }else if(this.roles.learningTrackId==moduleId){
      categoryType="LEARNING_TRACK";
    }else if(this.roles.playbookId==moduleId){
      categoryType = "PLAY_BOOK";
    }else if(this.roles.campaignId==moduleId){
      categoryType = "CAMPAIGN";
    }else if(this.roles.emailTemplateId==moduleId){
      categoryType="EMAIL_TEMPLATE";
    }else if(this.roles.landingPageId==moduleId){
      categoryType="LANDING_PAGE";
    }else if(this.roles.formId==moduleId){
      categoryType="FORM";
    }
    return categoryType;
  }
  
  getLearningTrackOrPlayBookType(moduleId:number){
    let categoryType = "";
    if(this.roles.learningTrackId==moduleId){
      categoryType="TRACK";
    }else if(this.roles.playbookId==moduleId){
      categoryType = "PLAYBOOK";
    }
    return categoryType;
  }

  getListViewAsDefault(viewType:string){
    if(viewType==undefined){
      let defaultDisplayType = localStorage.getItem("defaultDisplayType");
      if(defaultDisplayType!=undefined){
        if("LIST"==defaultDisplayType){
          viewType = "l";
        }else if("GRID"==defaultDisplayType){
          viewType='g';
        }else if("FOLDER_LIST"==defaultDisplayType){
          viewType='fl';
        }else if("FOLDER_GRID"==defaultDisplayType){
          viewType='fg';
        }
      }else{
        viewType = 'l';
      }
    }
    return viewType;
  }

  goToManageAssets(viewType:string,isPartnerView:boolean) {
    let urlSuffix = isPartnerView ? 'shared':'manage';
    this.router.navigate(["/home/dam/"+urlSuffix+"/"+this.getListViewAsDefault(viewType)]);
  }

  goToManageAssetsByCategoryId(folderViewType:string,listViewType:string,categoryId:number,isPartnerView:boolean) {
    let urlSuffix = isPartnerView ? 'shared':'manage';
    this.router.navigate(["/home/dam/"+urlSuffix+"/"+this.getListViewAsDefault(listViewType)+"/"+categoryId+"/"+folderViewType]);

  }

  goToManageTracksOrPlayBooks(viewType:string,isPartnerView:boolean,tracks:boolean) {
    let moduleUrl = tracks ? "tracks":"playbook";
    let urlSuffix = isPartnerView ? 'shared':'manage';
    this.router.navigate(["/home/"+moduleUrl+"/"+urlSuffix+"/"+this.getListViewAsDefault(viewType)]);
  }

  goToManageTracksOrPlayBooksByCategoryId(folderViewType:string,listViewType:string,categoryId:number,isPartnerView:boolean,tracks:boolean) {
    let moduleUrl = tracks ? "tracks":"playbook";
    let urlSuffix = isPartnerView ? 'shared':'manage';
    this.router.navigate(["/home/"+moduleUrl+"/"+urlSuffix+"/"+this.getListViewAsDefault(listViewType)+"/"+categoryId+"/"+folderViewType]);
  }

  navigateToRouterByViewTypes(url:string,categoryId:number,viewType:string,folderViewType:string,folderListView:boolean){
    if (categoryId > 0) {
			if (folderListView) {
				this.goToRouter(url+ "/fl");
			} else {
        this.goToRouter(url+ "/" + this.getListViewAsDefault(viewType) + "/" + categoryId + "/" + folderViewType);
			}
		} else {
			this.goToRouter(url+ "/" + this.getListViewAsDefault(viewType));
		}
  }

  /*******XNFR-169**********/
  navigateToManageAssetsByViewType(folderViewType:string,viewType:string,categoryId:number,isPartnerView:boolean){
    if (categoryId != undefined && categoryId > 0) {
      this.goToManageAssetsByCategoryId(folderViewType,viewType,categoryId,isPartnerView);
    } else {
      this.goToManageAssets(viewType, isPartnerView);
    }
  }

  /*******XNFR-170**********/
  navigateToManageTracksByViewType(folderViewType:string,viewType:string,categoryId:number,isPartnerView:boolean){
    if (categoryId != undefined && categoryId > 0) {
      this.goToManageTracksOrPlayBooksByCategoryId(folderViewType,viewType,categoryId,isPartnerView,true);
    } else {
      this.goToManageTracksOrPlayBooks(viewType, isPartnerView,true);
    }
  }

  navigateToPlayBooksByViewType(folderViewType:string,viewType:string,categoryId:number,isPartnerView:boolean){
    if (categoryId != undefined && categoryId > 0) {
      this.goToManageTracksOrPlayBooksByCategoryId(folderViewType,viewType,categoryId,isPartnerView,false);
    } else {
      this.goToManageTracksOrPlayBooks(viewType, isPartnerView,false);
    }
  }

  validateCkEditorDescription(description:string){
    let trimmedDescription = this.getTrimmedCkEditorDescription(description);
		let validDescription = $.trim(trimmedDescription) != undefined && trimmedDescription.length>0 && $.trim(trimmedDescription).length > 0 && $.trim(trimmedDescription).length < 5000;
    return validDescription;
  }

  getTrimmedCkEditorDescription(description:string){
   description = $.trim(description).split("&nbsp;").join("");
   return description;
  }

  getCkEditorPlainDescription(description:string){
    description = $(description).text(); // html to text
    description = description.replace(/\r?\n|\r/gm," "); // remove line breaks   
    description = description.replace(/\s\s+/g, " ").trim(); // remove double spaces
    return description;
  }


  /**** user guide *****/
  hideLeftSideMenu(){
    if(this.router.url.includes('/help/')){
      return  false;
    } else {
      return true;
    }
  }
  getUserMergeTag(){
    return this.mergeTagName;
  }

  closeSweetAlertWithDelay() {
    setTimeout(() => {
      swal.close();
    }, 1000);
  }

  /********Campaigns****/
  goToManageCampaigns(viewType: string) {
    this.router.navigate(["/home/campaigns/manage/"+this.getListViewAsDefault(viewType)]);
  }

  navigateToManageCampaignsByViewType(folderViewType: string, viewType: string, categoryId: number) {
    if (categoryId != undefined && categoryId > 0) {
      this.goToManageCampaignsByCategoryId(folderViewType,viewType,categoryId);
    } else {
      this.goToManageCampaigns(viewType);
    }
  }
  goToManageCampaignsByCategoryId(folderViewType: string, viewType: string, categoryId: number) {
    this.router.navigate(["/home/campaigns/manage/"+this.getListViewAsDefault(viewType)+"/"+categoryId+"/"+folderViewType]);
  }
   /********Campaigns****/

  public isProduction(){
    return this.envService.SERVER_URL=="https://xamp.io/" && this.envService.CLIENT_URL=="https://xamplify.io/";
  }

  public isQA(){
    return this.envService.SERVER_URL=="https://aravindu.com/" && this.envService.CLIENT_URL=="https://xamplify.co/";
  }


  addBlur(divId:string){
    $('#'+divId).addClass('xamplify-blur');
  }

  removeBlur(divId:string){
    $('#'+divId).removeClass('xamplify-blur');
  }

  updateBeeIframeContainerHeight(){
    document.getElementById('bee-plugin-container__bee-plugin-frame').style.height='935px';
  }

   /********Email Templates****/
   goToManageEmailTemplates(viewType: string) {
    this.router.navigate(["/home/emailtemplates/manage/"+this.getListViewAsDefault(viewType)]);
   }

  navigateToManageEmailTemplatesByViewType(folderViewType: string, viewType: string, categoryId: number) {
    if (categoryId != undefined && categoryId > 0) {
      this.goToManageEmailTemplatesByCategoryId(folderViewType,viewType,categoryId);
    } else {
      this.goToManageEmailTemplates(viewType);
    }
  }
  goToManageEmailTemplatesByCategoryId(folderViewType: string, viewType: string, categoryId: number) {
    this.router.navigate(["/home/emailtemplates/manage/"+this.getListViewAsDefault(viewType)+"/"+categoryId+"/"+folderViewType]);
  }
   
  goToEditEmailTemplate(viewType: string) {
    this.router.navigate(["/home/emailtemplates/edit/"+this.getListViewAsDefault(viewType)]);
  }

  navigateToEditEmailTemplateByViewType(folderViewType: string, viewType: string, categoryId: number) {
    if (categoryId != undefined && categoryId > 0) {
      this.goToEditEmailTemplateByCategoryId(folderViewType,viewType,categoryId);
    } else {
      this.goToEditEmailTemplate(viewType);
    }
  }
  goToEditEmailTemplateByCategoryId(folderViewType: string, viewType: string, categoryId: number) {
    this.router.navigate(["/home/emailtemplates/edit/"+this.getListViewAsDefault(viewType)+"/"+categoryId+"/"+folderViewType]);
  }

  goToUpdateEmailTemplate(viewType: string) {
    this.router.navigate(["/home/emailtemplates/update/"+this.getListViewAsDefault(viewType)]);
  }

  navigateToUpdateEmailTemplateByViewType(folderViewType: string, viewType: string, categoryId: number) {
    if (categoryId != undefined && categoryId > 0) {
      this.goToUpdateEmailTemplateByCategoryId(folderViewType,viewType,categoryId);
    } else {
      this.goToUpdateEmailTemplate(viewType);
    }
  }
  goToUpdateEmailTemplateByCategoryId(folderViewType: string, viewType: string, categoryId: number) {
    this.router.navigate(["/home/emailtemplates/update/"+this.getListViewAsDefault(viewType)+"/"+categoryId+"/"+folderViewType]);
  }

  getBadRequestErrorMessage(error: any){
    this.scrollSmoothToTop();
    let jsonError = error['error'];
    let statusCode = jsonError['statusCode'];
    let message = this.properties.serverErrorMessage;
    if (statusCode == 409 || statusCode == 400) {
      message = jsonError['message'];
    }
    return message;
  }

  /***XNFR-403***/
  removeRowWithAnimation(id:any){
    $('#' + id).hide(1000, function () {
      $('#' + id).remove();
    });
  }

  isJsonString(str:string) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  convertJsonStringToJsonObject(jsonString:string){
    var jsonObject : any;
    if(this.isJsonString(jsonString)){
      return jsonObject = JSON.parse(jsonString);
    }
  }

  removeArrayItemByIndex(items:any,index:number){
    var updatedItems = [];
    for(var i=0;i<items.length;i++){
        let item = items[i];
        if(i!=index){
          updatedItems.push(item);
        }
    }
    return updatedItems;
  }

  spliceArrayByIndex(arr: any, indexToRemove: number) {
    arr = $.grep(arr, function (data: any, index: number) {
      return index !== indexToRemove;
    });
    return arr;
  }
  
  iterateNamesAndGetErrorMessage(response:any){
    let names = "";
    $.each(response.data, function (index:number, value:any) {
      names += (index + 1) + ". " + value + "\n\n";
    });
    return response.message + "\n\n" + names;
  }

  getTrimmedData(input:any){
    return $.trim(input);
  }


  getRouterParameter(parameter:string){
    return this.route.snapshot.params[parameter];
  }

  convertToLowerCaseAndGetTrimmedData(input:any){
    return $.trim(input.toLowerCase());
  }

  removeAllSpacesAndGetData(text:string){
    return text.replace(/ /g,'');
  }

  /********Landing Pages****/
  goToManageLandingPages(viewType: string) {
    let urlSuffix = this.getLandingPagesSuffixUrl();
    this.router.navigate(["/home/pages/"+urlSuffix+"/"+this.getListViewAsDefault(viewType)]);
   }

  private getLandingPagesSuffixUrl() {
    let isPartnerLandingPage = this.router.url.includes('home/pages/partner');
    let urlSuffix = isPartnerLandingPage ? 'partner' : 'manage';
    return urlSuffix;
  }

   navigateToManageLandingPagesByViewType(folderViewType: string, viewType: string, categoryId: number) {
    if (categoryId != undefined && categoryId > 0) {
      this.goToManageLandingPagesByCategoryId(folderViewType,viewType,categoryId);
    } else {
      this.goToManageLandingPages(viewType);
    }
  }
  goToManageLandingPagesByCategoryId(folderViewType: string, viewType: string, categoryId: number) {
    let urlSuffix = this.getLandingPagesSuffixUrl();
    this.router.navigate(["/home/pages/"+urlSuffix+"/"+this.getListViewAsDefault(viewType)+"/"+categoryId+"/"+folderViewType]);
  }

  goToEditLandingPage(viewType: string) {
    this.router.navigate(["/home/pages/edit/"+this.getListViewAsDefault(viewType)]);
  }

  navigateToEditLandingPageByViewType(folderViewType: string, viewType: string, categoryId: number) {
    if (categoryId != undefined && categoryId > 0) {
      this.goToEditLandingPageByCategoryId(folderViewType,viewType,categoryId);
    } else {
      this.goToEditLandingPage(viewType);
    }
  }
  goToEditLandingPageByCategoryId(folderViewType: string, viewType: string, categoryId: number) {
    this.router.navigate(["/home/pages/edit/"+this.getListViewAsDefault(viewType)+"/"+categoryId+"/"+folderViewType]);
  }

  goToManageFormsByCategoryId(folderViewType: string, viewType: string, categoryId: number) {
    this.router.navigate(["/home/forms/manage/"+this.getListViewAsDefault(viewType)+"/"+categoryId+"/"+folderViewType]);
  }

  addCreateOrUpdateSuccessMessage(message:string){
    this.createdOrUpdatedSuccessMessage = message;
  }

  isVideo(filename: any) {
    const parts = filename.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
        case 'm4v':
        case 'mkv':
        case 'avi':
        case 'mpg':
        case 'mp4':
        case 'flv':
        case 'mov':
        case 'wmv':
        case 'divx':
        case 'f4v':
        case 'mpeg':
        case 'vob':
        case 'xvid':
            // etc
            return true;
    }
    return false;
}

isIE() {
  const isInternetExplorar = navigator.userAgent;
  /* MSIE used to detect old browsers and Trident used to newer ones*/
  const is_ie = isInternetExplorar.indexOf("MSIE ") > -1 || isInternetExplorar.indexOf("Trident/") > -1;
  return is_ie;
}

closeDamModalPopup(){
  $('#myModal').modal('hide');
  $('body').removeClass('modal-open');
  $('.modal-backdrop fade in').remove();
}

getEncodedUri(input:string){
  if(input!=undefined && $.trim(input).length>0){
    return encodeURIComponent(input);
  }else{
    return input;
  }
}

removeCssStyles(){
  var hs = document.getElementsByTagName('style');
    for (var i=0, max = hs.length; i < max; i++) {
      if(hs[i]!=undefined && hs[i]['parentNode']!=undefined){
        hs[i].parentNode.removeChild(hs[i]);
      }
    } 
}

removeElementById(){
  $('link[id="head-link-rel"]').remove();
}

removeCssStylesAndCssFiles(){
  this.removeCssStyles();
  this.removeElementById();
}

clearHeadScriptFiles(){
  $('.loader-container').hide();
  $("#xamplify-index-head").html("");
  $('#page-loader-index-html').css({'display':'block'});
}

previewEmailTemplateInNewTab(id:number){
  this.openWindowInNewTab("/pv/t/"+id);
}

previewEventCampaignEmailTemplateInNewTab(id:number){
  this.openWindowInNewTab("/pv/evt/"+id);
}
previewEditRedistributedEventCampaignTemplatePreview(campaignId: any) {
  this.openWindowInNewTab("/pv/edevt/"+campaignId);
}

previewWorkflowEmailTemplateInNewTab(id:number){
  this.openWindowInNewTab("/pv/wt/"+id);
}

previewCampaignEmailTemplateInNewTab(campaignId:number){
  this.openWindowInNewTab("/pv/ct/"+campaignId);
}

previewSharedVendorCampaignEmailTemplateInNewTab(campaignId:number){
  this.openWindowInNewTab("/pv/sct/"+campaignId);
}

previewSharedVendorEventCampaignEmailTemplateInNewTab(campaignId:number){
  this.openWindowInNewTab("/pv/sect/"+campaignId);
}

previewSharedCampaignAutoReplyEmailTemplateInNewTab(replyId:number){
  this.openWindowInNewTab("/pv/cwaret/"+replyId);
}

previewVendorCampaignAutoReplyWebsiteLinkTemplateInNewTab(urlId:number){
  this.openWindowInNewTab("/pv/cwarwlt/"+urlId);
}

previewSharedVendorCampaignAutoReplyEmailTemplateInNewTab(vendorCampaignWorkflowId:number){
  this.openWindowInNewTab("/pv/scwaret/"+vendorCampaignWorkflowId);
}

previewSharedVendorCampaignAutoReplyWebsiteLinkTemplateInNewTab(vendorCampaignWorkflowId:number){
  this.openWindowInNewTab("/pv/scwarwlt/"+vendorCampaignWorkflowId);
}

previewPageInNewTab(id:number){
  this.openWindowInNewTab("/pv/lp/"+id);
}

openWindowInNewTab(url:string){
  window.open(url,"_blank");
}



}
