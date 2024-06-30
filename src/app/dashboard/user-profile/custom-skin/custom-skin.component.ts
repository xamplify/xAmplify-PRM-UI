import { Component, OnInit, ViewChild, Input, Output, EventEmitter, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { CustomResponse } from 'app/common/models/custom-response';
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { UtilService } from 'app/core/services/util.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { EmailTemplate } from 'app/email-template/models/email-template';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { VideoUtilService } from 'app/videos/services/video-util.service';
import { Properties } from 'app/common/models/properties';
import { ThemePropertiesListWrapper } from 'app/dashboard/models/theme-properties-list-wrapper';
import { ThemeDto } from 'app/dashboard/models/theme-dto';
import { ThemePropertiesDto } from 'app/dashboard/models/theme-properties-dto';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { ImageCroppedEvent } from 'app/common/image-cropper/interfaces';

declare var $: any, CKEDITOR: any, swal: any;
@Component({
  selector: 'app-custom-skin',
  templateUrl: './custom-skin.component.html',
  styleUrls: ['./custom-skin.component.css'],
  providers: [EmailTemplate, Properties]
})
export class CustomSkinComponent implements OnInit {
  form: ThemePropertiesDto = new ThemePropertiesDto();
  @ViewChild("myckeditor") ckeditor: any;
  @Input() themeDTO: ThemeDto;
  @Input() themeId: number;
  @Input() isSaveTheme: boolean;
  @Input() activeThemeId: number;
  @Output() closeEvent = new EventEmitter<any>();
  @Output() updateEvent = new EventEmitter<any>();
  isValidDivBgColor = true;
  isValidHeaderTextColor = true;
  isValidBackgroundColor = true;
  isValidButtonValueColor = true;
  isValidTextColor = true;
  isValidButtonBorderColor = true;
  isValidIconColor = true;
  isValidButtonColor = true;
  divLoader = false;
  saveBoolean = false;
  updateBoolean = false;

  valueRange: number;
  backgroundColor: string;
  divBgColor: string;
  iconColor: string;
  textColor: string;
  buttonBorderColor: string;
  buttonValueColor: string;
  /******* Header Colors***********/
  headerBgColor: string;
  headerBBorderColor: string;
  headerBVColor: string;
  headerBColor: string;
  headerBIconColor: string;
  /*******Header Color*************/
  /*******Main_Content******** */
  mainBgColor: string;
  mainDivColor: string;
  mainBorderColor: string;
  mainTextColor: string;
  mainButtonBgColor: string;
  mainButtonBorderColor: string;
  mainButtonValueColor: string;
  mainButtonIconColor: string;
  secondaryButtonBgColor: string;
  secondaryButtonBorderColor: string;
  secondaryButtonTextColor: string;
  iconBorderColor: string;
  iconHoverColor: string;
  /*******Main_Content******** */
  /*******Left Menu***** */
  leftBgColor: string;
  leftIconColor: string;
  leftTextColor: string;
  leftBorderColor: string;
  /*******Left Menu***** */
  /******Footer*** */
  footerBgColor: string;
  footerTextColor: string;
  footerTextContent: string;
  /******Footer**** */
  /** Button customization */
  customButtonBgColor: string;
  customButtonBorderColor: string;
  customButtonValueColor: string;
  customGradientColorOne: string;
  customGradientColorTwo: string;
  customIconColor: string;
  customIconBorderColor: string;
  customIconHoverColor: string;
  /** Button customization  */
  buttonColor: string;
  textContent: string;
  loggedInUserId: any;
  fontFamily: string;
  isValidColorCode = true;
  sucess: boolean = false;
  name = 'ng2-ckeditor';
  ckeConfig: any;
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  moduleStatusList: string[] = ["--Select Type--", "LEFT_SIDE_MENU", "TOP_NAVIGATION_BAR", "FOOTER", "MAIN_CONTENT", "BUTTON_CUSTOMIZE"];
  isLoggedInFromAdminSection = false;
  loading = false;
  vanityLogin = false;
  activeTabName: string = "header";
  showFooter: boolean;
  footerContent: any;
  charactersLeft = 250;
  minLength: number;
  statusCode: any;
  isValid = false;
  headerBg = false;
  btnBorderColor = false;
  customResponse: CustomResponse = new CustomResponse();
  ngxloading = false;
  saveAlert: boolean = false;
  defaultAlert: boolean = false;
  themeName = "";
  themePropertiesListWrapper: ThemePropertiesListWrapper = new ThemePropertiesListWrapper();
  themeDtoObj: ThemeDto;
  headerBackgroundColor = "";

  themeDtoList: ThemePropertiesDto[];
  themeDto: ThemeDto = new ThemeDto();
  colorProperties: ThemePropertiesDto[] = [];
  themeWrapper: ThemePropertiesListWrapper = new ThemePropertiesListWrapper();
  footerForm: ThemePropertiesDto = new ThemePropertiesDto();
  mainContentForm: ThemePropertiesDto = new ThemePropertiesDto();
  headerForm: ThemePropertiesDto = new ThemePropertiesDto();
  leftSideForm: ThemePropertiesDto = new ThemePropertiesDto();
  buttonCustomizationForm: ThemePropertiesDto = new ThemePropertiesDto();
  isValidContactName: boolean = false;
  noOptionsClickError: boolean = false;
  invalidContactNameError = "";
  checkingContactTypeName: string;
  isValidLegalOptions = true;
  nameAlreadyExist = "";
  tnames: string[] = [];
  sudha: string[] = [];
  public themeNameDto: Array<ThemeDto>;
  squareDataForBgImage = {};
  colorsdto: ThemePropertiesDto;
  headerModuleName = "TOP_NAVIGATION_BAR";
  leftMenuModuleName = "LEFT_SIDE_MENU";
  footerModuleName = "FOOTER";
  mainModuleName = "MAIN_CONTENT";
  //  Newly Changes
  names: string[] = [];
  //  saves name
  saveThemeDto: ThemeDto = new ThemeDto()
  message: string = "";
  nameValid: boolean = false;
  validMessage: string;
  constructor(public regularExpressions: RegularExpressions, public videoUtilService: VideoUtilService,
    public dashboardService: DashboardService, public authenticationService: AuthenticationService,
    public referenceService: ReferenceService,
    public xtremandLogger: XtremandLogger, private formBuilder: FormBuilder,
    public ustilService: UtilService, public router: Router, public properties: Properties, private renderer: Renderer) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.isLoggedInFromAdminSection = this.ustilService.isLoggedInFromAdminPortal();
    this.vanityLoginDto.userId = this.loggedInUserId;
    let companyProfileName = this.authenticationService.companyProfileName;
    if (companyProfileName !== undefined && companyProfileName !== "") {
      this.vanityLoginDto.vendorCompanyProfileName = companyProfileName;
      this.vanityLoginDto.vanityUrlFilter = true;
      this.vanityLogin = true;
    } else {
      this.vanityLoginDto.vanityUrlFilter = false;
    }

  }

  ngOnInit() {
    this.squareDataForBgImage = {};
    this.activeTabNav(this.activeTabName);
    this.loadNames();
    this.showWithCopy(this.themeId);
    this.getDefaultImagePath();
    this.getDefaultSkin(this.themeId);
    try {
      this.ckeConfig = {
        allowedContent: true,
      };
    } catch (errr) { }
  }
  save(form: ThemePropertiesDto) {
    if (CKEDITOR != undefined) {
      for (var instanceName in CKEDITOR.instances) {
        CKEDITOR.instances[instanceName].updateElement();
        form.textContent = CKEDITOR.instances[instanceName].getData();
      }
    }
    this.saveThemePropertiesToList(form);
  }
  clearCustomResponse() { this.customResponse = new CustomResponse(); }
  activeTabNav(activateTab: any) {
    this.saveAlert = false;
    this.defaultAlert = false;
    this.isValid = false;
    if (this.themeDTO.parentThemeName == 'LIGHT' || this.themeDTO.parentThemeName == 'DARK') {
      this.activeTabName = activateTab;
    } else {
      this.activeTabName = "buttonCustomization";
    }
    if (this.activeTabName == "header") {
      this.form.moduleTypeString = this.moduleStatusList[2];
      this.headerForm.moduleTypeString = "TOP_NAVIGATION_BAR";
    } else if (this.activeTabName == "leftmenu") {
      this.form.moduleTypeString = this.moduleStatusList[1];
      this.leftSideForm.moduleTypeString = "LEFT_SIDE_MENU";
    } else if (this.activeTabName == "pagecontent") {
      this.form.moduleTypeString = this.moduleStatusList[4];
      this.mainContentForm.moduleTypeString = "MAIN_CONTENT";
    } else if (this.activeTabName == "footer") {
      this.form.moduleTypeString = this.moduleStatusList[3];
      this.footerForm.moduleTypeString = "FOOTER";
    } else if (this.activeTabName == "buttonCustomization") {
      this.form.moduleTypeString = this.moduleStatusList[5];
      this.buttonCustomizationForm.moduleTypeString = "FOOTER";
    }
  }
  showFooterChange() {
    this.footerForm.showFooter = !this.footerForm.showFooter;
    this.showFooter = !this.footerForm.showFooter;
  }


  changEvent(ev: any) {
    this.sname = ev.replace(/\s/g, '');
    this.getAllThemeNames(this.sname);
  }

  checkValidColorCode(colorCode: string, type: string) {
    if ($.trim(colorCode).length > 0) {
      if (!this.regularExpressions.COLOR_CODE_PATTERN.test(colorCode)) {
        this.addColorCodeErrorMessage(type);
      } else {
        this.removeColorCodeErrorMessage(colorCode, type);
      }
    } else {
      this.removeColorCodeErrorMessage(colorCode, type);
    }

  }
  removeColorCodeErrorMessage(colorCode: string, type: string) {

    /********Top_Navigation_Bar***************/
    if (type === "headerBgColor") {
      this.headerForm.backgroundColor = colorCode;
      this.isValidBackgroundColor = true;
    } else if (type === "headerBBorderColor") {
      this.headerForm.buttonBorderColor = colorCode; this.isValidButtonBorderColor = true;
    } else if (type === "headerBVColor") {
      this.headerForm.buttonValueColor = colorCode; this.isValidButtonValueColor = true;
    } else if (type === "headerBColor") {
      this.headerForm.buttonColor = colorCode; this.isValidButtonColor = true;
    } else if (type === "headerBIconColor") {
      this.headerForm.iconColor = colorCode; this.isValidIconColor = true;
    }
    /******Top_Naviagtion_Bar****************/
    /*********Main_Content*************/
    else if (type === "mainBgColor") {
      this.mainContentForm.backgroundColor = colorCode; this.isValidBackgroundColor = true;
    } else if (type === "mainDivColor") {
      this.mainContentForm.divBgColor = colorCode; this.isValidDivBgColor = true;
    } else if (type === "mainBorderColor") {
      this.mainContentForm.buttonBorderColor = colorCode; this.isValidButtonBorderColor = true;
    } else if (type === "mainTextColor") {
      this.mainContentForm.textColor = colorCode; this.isValidTextColor = true;
    }
    else if (type === "iconBorderColor") {
      this.mainContentForm.iconBorderColor = colorCode; this.isValidTextColor = true;
    }
    else if (type === "iconColor") {
      this.mainContentForm.iconColor = colorCode; this.isValidTextColor = true;
    }
    else if (type === "iconHoverColor") {
      this.mainContentForm.iconHoverColor = colorCode; this.isValidTextColor = true;
    }
    // for btn customization
    else if (type === "mainButtonBgColor") {
      this.mainContentForm.buttonColor = colorCode; this.isValidTextColor = true;
    } else if (type === "mainButtonBorderColor") {
      this.mainContentForm.buttonPrimaryBorderColor = colorCode; this.isValidTextColor = true;
    } else if (type === "mainButtonValueColor") {
      this.mainContentForm.buttonValueColor = colorCode; this.isValidTextColor = true;
    } else if (type === "mainButtonIconColor") {
      this.mainContentForm.iconColor = colorCode; this.isValidTextColor = true;
    } else if (type === "secondaryButtonBgColor") {
      this.mainContentForm.buttonSecondaryColor = colorCode; this.isValidTextColor = true;
    } else if (type === "secondaryButtonBorderColor") {
      this.mainContentForm.buttonSecondaryBorderColor = colorCode; this.isValidTextColor = true;
    } else if (type === "secondaryButtonTextColor") {
      this.mainContentForm.buttonSecondaryTextColor = colorCode; this.isValidTextColor = true;
    }
    /*********Main_content********************/
    /*******Left Menu************ */
    else if (type === "leftBgColor") {
      this.leftSideForm.backgroundColor = colorCode; this.isValidBackgroundColor = true;
    } else if (type === "leftIconColor") {
      this.leftSideForm.iconColor = colorCode; this.isValidIconColor = true;
    } else if (type === "leftBorderColor") {
      this.leftSideForm.buttonBorderColor = colorCode; this.isValidButtonBorderColor = true;
    } else if (type === "leftTextColor") {
      this.leftSideForm.textColor = colorCode; this.isValidTextColor = true;
    }
    /*******Left Menu************ */
    /*********Foter********* */
    else if (type === "footerBgColor") {
      this.footerForm.backgroundColor = colorCode; this.isValidBackgroundColor = true;
    } else if (type === "footerTextColor") {
      this.footerForm.textColor = colorCode; this.isValidTextColor = true;
    }
    /** Button customization */
    else if (type == 'customButtonBgColor') {
      this.buttonCustomizationForm.buttonColor = colorCode; this.isValidTextColor = true;
    } else if (type == 'customButtonBorderColor') {
      this.buttonCustomizationForm.buttonBorderColor = colorCode; this.isValidTextColor = true;
    } else if (type == 'customButtonValueColor') {
      this.buttonCustomizationForm.buttonValueColor = colorCode; this.isValidTextColor = true;
    } else if (type == 'customGradientColorOne') {
      this.buttonCustomizationForm.gradiantColorOne = colorCode; this.isValidTextColor = true;
    } else if (type == 'customGradientColorTwo') {
      this.buttonCustomizationForm.gradiantColorTwo = colorCode; this.isValidTextColor = true;
    } else if (type === 'customIconColor') {
      this.buttonCustomizationForm.iconColor = colorCode; this.isValidIconColor = true;
    } else if (type === 'customIconBorderColor') {
      this.buttonCustomizationForm.iconBorderColor = colorCode; this.isValidTextColor = true;
    } else if (type === 'customIconHoverColor') {
      this.buttonCustomizationForm.iconHoverColor = colorCode; this.isValidTextColor = true;
    }
    /*** Button customization */

    this.checkValideColorCodes();
    //this.disabledSaveButton();
  }
  checkValideColorCodes() {
    // this.validMessage = "";
    // this.isValid = false;
    if (this.themeDTO.parentThemeName == 'LIGHT' || this.themeDTO.parentThemeName == 'DARK') {
      if (this.leftBgColor === this.leftTextColor) {
        this.isValid = true;
        //this.validMessage = "The User Interface Is Going to Be Affected if the Reliant Objects Have the Same Color."
      }
      else if (this.leftBgColor == this.leftIconColor) {
        this.isValid = true;
        //this.validMessage = "The User Interface Is Going to Be Affected if the Reliant Objects Have the Same Color."
      }
      else if (this.headerBgColor === this.headerBColor) {
        this.isValid = true;
        //this.validMessage = "Please Change the color ,it was already exsits"
      }
      else if (this.headerBColor === this.headerBIconColor) {
        this.isValid = true;
        //this.validMessage = "Please Change the color ,it was already exsits"
      }
      else if (this.headerBColor === this.headerBVColor) {
        this.isValid = true;
        //this.validMessage = "Please Change the color ,it was already exsits"
      }
      else if (this.footerBgColor === this.footerTextColor) {
        this.isValid = true;
        //this.validMessage = "Please Change the color ,it was already exsits"
      }
      else if (this.mainDivColor === this.mainBgColor) {
        this.isValid = true;
        //this.validMessage = "Please Change the color ,it was already exsits"
      }
      else if (this.mainDivColor === this.mainTextColor) {
        this.isValid = true;
        // this.validMessage = "Please Change the color ,it was already exsits"
      } else if (this.mainDivColor === this.iconHoverColor) {
        this.isValid = true;
      }
      else {
        this.isValid = false;
        this.validMessage = "";
      }
    } else {
      if (this.customButtonBgColor === this.customButtonValueColor) {
        this.isValid = true;
      } else if (this.customIconColor === this.customIconHoverColor) {
        this.isValid = true;
      } else {
        this.isValid = false;
        this.validMessage = "";
      }
    }
    if (this.isValid) {
      this.validMessage = "The user interface is going to be affected if the reliant objects have the same color.";
    }
    if (this.isValidBackgroundColor && this.isValidButtonColor && this.isValidButtonValueColor && this.isValidTextColor && this.isValidButtonBorderColor) {
      this.isValidColorCode = true;
    }
  }
  private addColorCodeErrorMessage(type: string) {
    this.isValidColorCode = false;

    /*****Top_Navigation_bar**********/
    if (type === "headerBgColor") { this.headerForm.backgroundColor = ""; this.isValidBackgroundColor = true; }
    else if (type === "headerBBorderColor") {
      this.headerForm.buttonBorderColor = ""; this.isValidButtonBorderColor = true;
    } else if (type === "headerBVColor") {
      this.headerForm.buttonValueColor = ""; this.isValidButtonValueColor = true;
    } else if (type === "headerBColor") {
      this.headerForm.buttonColor = ""; this.isValidButtonColor = true;
    } else if (type === "headerBIconColor") {
      this.headerForm.iconColor = ""; this.isValidIconColor = true;
    }
    /*********Main_Content*************/
    else if (type === "mainBgColor") {
      this.mainContentForm.backgroundColor = ""; this.isValidBackgroundColor = true;
    } else if (type === "mainDivColor") {
      this.mainContentForm.divBgColor = ""; this.isValidDivBgColor = true;
    } else if (type === "mainBorderColor") {
      this.mainContentForm.buttonBorderColor = ""; this.isValidButtonBorderColor = true;
    } else if (type === "mainTextColor") {
      this.mainContentForm.textColor = ""; this.isValidTextColor = true;
    }
    else if (type === "iconBorderColor") {
      this.mainContentForm.iconBorderColor = ""; this.isValidTextColor = true;
    }
    else if (type === "iconColor") {
      this.mainContentForm.iconColor = ""; this.isValidTextColor = true;
    }
    else if (type === "iconHoverColor") {
      this.mainContentForm.iconHoverColor = ""; this.isValidTextColor = true;
    }
    // for btn customization
    else if (type === "mainButtonBgColor") {
      this.mainContentForm.buttonColor = ""; this.isValidTextColor = true;
    } else if (type === "mainButtonBorderColor") {
      this.mainContentForm.buttonPrimaryBorderColor = ""; this.isValidTextColor = true;
    } else if (type === "mainButtonValueColor") {
      this.mainContentForm.buttonValueColor = ""; this.isValidTextColor = true;
    } else if (type === "mainButtonIconColor") {
      this.mainContentForm.iconColor = ""; this.isValidTextColor = true;
    } else if (type === "secondaryButtonBgColor") {
      this.mainContentForm.buttonSecondaryColor = ""; this.isValidTextColor = true;
    } else if (type === "secondaryButtonBorderColor") {
      this.mainContentForm.buttonSecondaryBorderColor = ""; this.isValidTextColor = true;
    } else if (type === "secondaryButtonTextColor") {
      this.mainContentForm.buttonSecondaryTextColor = ""; this.isValidTextColor = true;
    }
    /*********Main_content********************/
    /*******Left Menu************ */
    else if (type === "leftBgColor") {
      this.leftSideForm.backgroundColor = ""; this.isValidBackgroundColor = true;
    } else if (type === "leftIconColor") {
      this.leftSideForm.iconColor = ""; this.isValidIconColor = true;
    } else if (type === "leftBorderColor") {
      this.mainContentForm.buttonBorderColor = ""; this.isValidButtonBorderColor = true;
    } else if (type === "leftTextColor") {
      this.leftSideForm.textColor = ""; this.isValidTextColor = true;
    }
    /*******Left Menu************ */
    /*********Foter********* */
    else if (type === "footerBgColor") {
      this.footerForm.backgroundColor = ""; this.isValidBackgroundColor = true;
    } else if (type === "footerTextColor") {
      this.footerForm.textColor = ""; this.isValidTextColor = true;
    }
    /** Button customization */
    else if (type === 'customButtonBgColor') {
      this.buttonCustomizationForm.buttonColor = ""; this.isValidButtonColor = true;
    } else if (type === 'customButtonBorderColor') {
      this.buttonCustomizationForm.buttonBorderColor = ""; this.isValidButtonBorderColor = true;
    } else if (type === 'customButtonValueColor') {
      this.buttonCustomizationForm.buttonValueColor = ""; this.isValidButtonValueColor = true;
    } else if (type === 'customGradientColorOne') {
      this.buttonCustomizationForm.gradiantColorOne = ""; this.isValidTextColor = true;
    } else if (type === 'customGradientColorTwo') {
      this.buttonCustomizationForm.gradiantColorTwo = ""; this.isValidTextColor = true;
    } else if (type === 'customIconColor') {
      this.buttonCustomizationForm.iconColor = ""; this.isValidIconColor = true;
    } else if (type === 'customIconBorderColor') {
      this.buttonCustomizationForm.iconBorderColor = ""; this.isValidTextColor = true;
    } else if (type === 'customIconHoverColor') {
      this.buttonCustomizationForm.iconHoverColor = ""; this.isValidTextColor = true;
    }
    /*** Button customization */
  }
  changeControllerColor(event: any, form: ThemePropertiesDto, type: string) {
    try {
      const rgba = this.videoUtilService.transparancyControllBarColor(event, this.valueRange);
      $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
      /*******Header Form*********8 */
      if (type === "headerBgColor") {
        this.headerBgColor = event;
        this.headerForm.backgroundColor = event; this.isValidBackgroundColor = true;
      } else if (type === "headerBBorderColor") {
        this.headerBBorderColor = event; this.headerForm.buttonBorderColor = event;
        this.isValidButtonBorderColor = true;
      } else if (type === "headerBVColor") {
        this.headerBVColor = event; this.headerForm.buttonValueColor = event;
        this.isValidButtonValueColor = true;
      } else if (type === "headerBColor") {
        this.headerBColor = event; this.headerForm.buttonColor = event; this.isValidButtonColor = true;
      } else if (type === "headerBIconColor") {
        this.headerBIconColor = event; this.headerForm.iconColor = event; this.isValidIconColor = true;
      }
      /************Header Form ************** */
      /*********Main_Content*************/
      else if (type === "mainBgColor") {
        this.mainBgColor = event;
        this.mainContentForm.backgroundColor = event; this.isValidBackgroundColor = true;
      } else if (type === "mainDivColor") {
        this.mainDivColor = event
        this.mainContentForm.divBgColor = event; this.isValidDivBgColor = true;
      } else if (type === "mainBorderColor") {
        this.mainBorderColor = event;
        this.mainContentForm.buttonBorderColor = event; this.isValidButtonBorderColor = true;
      } else if (type === "mainTextColor") {
        this.mainTextColor = event;
        this.mainContentForm.textColor = event; this.isValidTextColor = true;
      }
      else if (type === "iconBorderColor") {
        this.iconBorderColor = event;
        this.mainContentForm.iconBorderColor = event; this.isValidTextColor = true;
      }
      else if (type === "iconColor") {
        this.iconColor = event;
        this.mainContentForm.iconColor = event; this.isValidTextColor = true;
      }
      else if (type === "iconHoverColor") {
        this.iconHoverColor = event;
        this.mainContentForm.iconHoverColor = event; this.isValidTextColor = true;
      }
      // for btn customization
      else if (type === "mainButtonBgColor") {
        this.mainButtonBgColor = event;
        document.documentElement.style.setProperty('--button-primary-bg-color', this.mainContentForm.buttonColor);
        this.mainContentForm.buttonColor = event; this.isValidTextColor = true;
      } else if (type === "mainButtonBorderColor") {
        this.mainButtonBorderColor = event;
        document.documentElement.style.setProperty('--button-primary-border-color', this.mainContentForm.buttonPrimaryBorderColor);
        this.mainContentForm.buttonPrimaryBorderColor = event; this.isValidTextColor = true;
      } else if (type === "mainButtonValueColor") {
        this.mainButtonValueColor = event;
        document.documentElement.style.setProperty('--button-primary-text-color', this.mainContentForm.buttonValueColor);
        this.mainContentForm.buttonValueColor = event; this.isValidTextColor = true;
      } else if (type === "mainButtonIconColor") {
        this.mainButtonIconColor = event;
        this.mainContentForm.iconColor = event; this.isValidTextColor = true;
      } else if (type === "secondaryButtonBgColor") {
        this.secondaryButtonBgColor = event;
        document.documentElement.style.setProperty('--button-secondary-bg-color', this.mainContentForm.buttonSecondaryColor);
        this.mainContentForm.buttonSecondaryColor = event; this.isValidTextColor = true;
      } else if (type === "secondaryButtonBorderColor") {
        this.secondaryButtonBorderColor = event;
        document.documentElement.style.setProperty('--button-secondary-border-color', this.mainContentForm.buttonSecondaryBorderColor);
        this.mainContentForm.buttonSecondaryBorderColor = event; this.isValidTextColor = true;
      } else if (type === "secondaryButtonTextColor") {
        this.secondaryButtonTextColor = event;
        document.documentElement.style.setProperty('--button-secondary-text-color', this.mainContentForm.buttonSecondaryTextColor);
        this.mainContentForm.buttonSecondaryTextColor = event; this.isValidTextColor = true;
      }
      /*********Main_content********************/
      /*******Left Menu************ */
      else if (type === "leftBgColor") {
        this.leftBgColor = event;
        this.leftSideForm.backgroundColor = event; this.isValidBackgroundColor = true;
      } else if (type === "leftIconColor") {
        this.leftIconColor = event;
        this.leftSideForm.iconColor = event; this.isValidIconColor = true;
      } else if (type === "leftBorderColor") {
        this.leftBorderColor = event;
        this.leftSideForm.buttonBorderColor = event; this.isValidButtonBorderColor = true;
      } else if (type === "leftTextColor") {
        this.leftTextColor = event;
        this.leftSideForm.textColor = event; this.isValidTextColor = true;
      }
      /*******Left Menu************ */
      /*********Foter********* */
      else if (type === "footerBgColor") {
        this.footerBgColor = event;
        this.footerForm.backgroundColor = event; this.isValidBackgroundColor = true;
      } else if (type === "footerTextColor") {
        this.footerTextColor = event;
        this.footerForm.textColor = event; this.isValidTextColor = true;
      }
      /** Button customization */
      else if (type === 'customButtonBgColor') {
        this.customButtonBgColor = event;
        this.buttonCustomizationForm.buttonColor = event; this.isValidButtonColor = true;
        document.documentElement.style.setProperty('--change-button-color', this.buttonCustomizationForm.buttonColor);
      } else if (type === 'customButtonBorderColor') {
        this.customButtonBorderColor = event;
        this.buttonCustomizationForm.buttonBorderColor = event; this.isValidButtonBorderColor = true;
        document.documentElement.style.setProperty('--change-button-border-color', this.buttonCustomizationForm.buttonBorderColor);
      } else if (type === 'customButtonValueColor') {
        this.customButtonValueColor = event;
        this.buttonCustomizationForm.buttonValueColor = event; this.isValidButtonValueColor = true;
        document.documentElement.style.setProperty('--change-button-value-color', this.buttonCustomizationForm.buttonValueColor);
      } else if (type === 'customGradientColorOne') {
        this.customGradientColorOne = event;
        this.buttonCustomizationForm.gradiantColorOne = event; this.isValidTextColor = true;
        document.documentElement.style.setProperty('--change-button-gradient-one-color', this.buttonCustomizationForm.gradiantColorOne);
      } else if (type === 'customGradientColorTwo') {
        this.customGradientColorTwo = event;
        this.buttonCustomizationForm.gradiantColorTwo = event; this.isValidTextColor = true;
        document.documentElement.style.setProperty('--change-button-gradient-two-color', this.buttonCustomizationForm.gradiantColorTwo);
      } else if (type === 'customIconColor') {
        this.customIconColor = event;
        this.buttonCustomizationForm.iconColor = event; this.isValidIconColor = true;
      } else if (type === 'customIconBorderColor') {
        this.customIconBorderColor = event;
        this.buttonCustomizationForm.iconBorderColor = event; this.isValidTextColor = true;
      } else if (type === 'customIconHoverColor') {
        this.customIconHoverColor = event;
        this.buttonCustomizationForm.iconHoverColor = event; this.isValidTextColor = true;
      }
      /*** Button customization */
    } catch (error) { console.log(error); }
    this.checkValideColorCodes();
  }

  setThemeDetails() {
    this.ngxloading = true;
    this.defaultAlert = false;
    this.saveThemeDto.name = this.sname.replace(/\s/g, '');
    this.saveThemeDto.description = 'Hi';
    this.saveThemeDto.defaultTheme = false;
    this.saveThemeDto.createdBy = this.loggedInUserId;
    this.saveThemeDto.parentId = this.themeId;
    this.saveThemeDto.parentThemeName = this.themeDTO.parentThemeName;
    if(!this.themeDTO.defaultTheme && !this.themeDTO.backgroundImagePath.includes('/assets')) {
      this.uploadBgImage = this.bgImagePath;
    }
    this.saveThemeDto.backgroundImagePath = this.uploadBgImage;
    console.log(this.saveThemeDto.parentId, "sudha");
    //this.ngxloading = false;
  }


  // gives default values with id
  getDefaultSkin(id: number) {
    this.ngxloading = true;
    this.divLoader = true;
    this.dashboardService.getPropertiesById(id)
      .subscribe(
        (data: any) => {
          let skinMAp = data.data;
          this.headerForm = skinMAp.TOP_NAVIGATION_BAR;
          this.headerForm.createdBy = this.loggedInUserId;
          this.leftSideForm = skinMAp.LEFT_SIDE_MENU;
          this.leftSideForm.createdBy = this.loggedInUserId;
          this.mainContentForm = skinMAp.MAIN_CONTENT;
          this.mainContentForm.createdBy = this.loggedInUserId;
          this.footerForm = skinMAp.FOOTER;
          this.footerForm.createdBy = this.loggedInUserId;
          this.buttonCustomizationForm = skinMAp.BUTTON_CUSTOMIZE;
          this.buttonCustomizationForm.createdBy = this.loggedInUserId;
          /***********Header Colors ************** */
          this.headerBgColor = this.headerForm.backgroundColor;
          this.headerBColor = this.headerForm.buttonColor;
          this.headerBBorderColor = this.headerForm.buttonBorderColor;
          this.headerBVColor = this.headerForm.buttonValueColor;
          this.headerBIconColor = this.headerForm.iconColor;
          /*******Left menu colors */
          this.leftBgColor = this.leftSideForm.backgroundColor;
          this.leftBorderColor = this.leftSideForm.buttonBorderColor;
          this.leftIconColor = this.leftSideForm.iconColor;
          this.leftTextColor = this.leftSideForm.textColor;
          /*******footer colors*********/
          this.footerBgColor = this.footerForm.backgroundColor;
          this.footerTextColor = this.footerForm.textColor;
          /**********Main Colors********* */
          this.mainBgColor = this.mainContentForm.backgroundColor;
          this.mainDivColor = this.mainContentForm.divBgColor;
          this.mainBorderColor = this.mainContentForm.buttonBorderColor;
          this.mainTextColor = this.mainContentForm.textColor;
          this.iconBorderColor = this.mainContentForm.iconBorderColor;
          this.iconColor = this.mainContentForm.iconColor;
          this.iconHoverColor = this.mainContentForm.iconHoverColor;
          // for btn customization
          this.mainButtonBgColor = this.mainContentForm.buttonColor;
          this.mainButtonBorderColor = this.mainContentForm.buttonPrimaryBorderColor;
          this.mainButtonValueColor = this.mainContentForm.buttonValueColor;
          this.mainButtonIconColor = this.mainContentForm.iconColor;
          this.secondaryButtonBgColor = this.mainContentForm.buttonSecondaryColor;
          this.secondaryButtonBorderColor = this.mainContentForm.buttonSecondaryBorderColor;
          this.secondaryButtonTextColor = this.mainContentForm.buttonSecondaryTextColor;
          /*** Button customization */
          this.customButtonBgColor = this.buttonCustomizationForm.buttonColor;
          this.customButtonBorderColor = this.buttonCustomizationForm.buttonBorderColor;
          this.customButtonValueColor = this.buttonCustomizationForm.buttonValueColor;
          this.customGradientColorOne = this.buttonCustomizationForm.gradiantColorOne;
          this.customGradientColorTwo = this.buttonCustomizationForm.gradiantColorTwo;
          this.customIconColor = this.buttonCustomizationForm.iconColor;
          this.customIconBorderColor = this.buttonCustomizationForm.iconBorderColor;
          this.customIconHoverColor = this.buttonCustomizationForm.iconHoverColor;
          document.documentElement.style.setProperty('--change-button-color', this.buttonCustomizationForm.buttonColor);
          document.documentElement.style.setProperty('--change-button-border-color', this.buttonCustomizationForm.buttonBorderColor);
          document.documentElement.style.setProperty('--change-button-value-color', this.buttonCustomizationForm.buttonValueColor);
          document.documentElement.style.setProperty('--change-button-gradient-one-color', this.buttonCustomizationForm.gradiantColorOne);
          document.documentElement.style.setProperty('--change-button-gradient-two-color', this.buttonCustomizationForm.gradiantColorTwo);
          this.ngxloading = false;
          this.divLoader = false;
        }, error => {
          this.ngxloading = false;
          this.message = this.properties.serverErrorMessage;
        });
  }

  //getting default values without calling id

  saveThemePropertiesToList(form: ThemePropertiesDto) {
    this.saveAlert = false;
    this.colorsdto = new ThemePropertiesDto();
    let self = this;

    self.colorsdto.backgroundColor = form.backgroundColor;
    self.colorsdto.textColor = form.textColor;
    self.colorsdto.buttonColor = form.buttonColor;
    self.colorsdto.divBgColor = form.divBgColor;
    self.colorsdto.iconBorderColor = form.iconBorderColor;
    self.colorsdto.iconHoverColor = form.iconHoverColor;
    self.colorsdto.buttonBorderColor = form.buttonBorderColor;
    self.colorsdto.iconColor = form.iconColor;
    self.colorsdto.buttonValueColor = form.buttonValueColor;
    self.colorsdto.showFooter = form.showFooter;
    self.colorsdto.moduleTypeString = form.moduleTypeString;
    self.textContent = form.textContent;
    self.colorsdto.createdBy = this.loggedInUserId;
    this.themePropertiesListWrapper.propertiesList.push(self.colorsdto);
    this.saveAlert = true;
    this.message = "Data saved Sucessfully"

  }

  // save theme
  menuColors: ThemePropertiesDto[] = []
  getThemePropertiesWrapperObj() {
    this.ngxloading = true;
    this.setThemeDetails();
    if (CKEDITOR != undefined) {
      for (var instanceName in CKEDITOR.instances) {
        CKEDITOR.instances[instanceName].updateElement();
        this.footerForm.textContent = CKEDITOR.instances[instanceName].getData();
      }
    }
    this.headerForm.moduleTypeString = this.headerModuleName;
    this.leftSideForm.moduleTypeString = this.leftMenuModuleName;
    this.footerForm.moduleTypeString = this.footerModuleName;
    this.mainContentForm.moduleTypeString = this.mainModuleName
    if (this.activeTabName == 'buttonCustomization') {
      this.themePropertiesListWrapper.propertiesList.push(this.buttonCustomizationForm)
    } else {
      this.themePropertiesListWrapper.propertiesList.push(this.headerForm);
      this.themePropertiesListWrapper.propertiesList.push(this.leftSideForm);
      this.themePropertiesListWrapper.propertiesList.push(this.footerForm);
      this.themePropertiesListWrapper.propertiesList.push(this.mainContentForm)
    }
    this.themePropertiesListWrapper.themeDto = this.saveThemeDto;
    console.log(this.themePropertiesListWrapper, 'wrapper');
    console.log(this.themeDto, 'dto');


    this.dashboardService.saveMultipleTheme(this.themePropertiesListWrapper).subscribe(
      (data: any) => {
        this.ngxloading = false;
        if (data.statusCode == 200) {
          this.saveThemeEventEmit("Theme Saved Successfully")
        } else if (data.statusCode == 409) {
          this.isValidContactName = true;
          this.invalidContactNameError = "Name Already Exists.";
        } else {
          this.isValidContactName = true;
          this.invalidContactNameError = "Name is Required.";
        }
      },
      error => {
        this.ngxloading = false;
        this.statusCode = 500;
        this.themePropertiesListWrapper.propertiesList = this.menuColors;
        this.message = "Oops!Something went wrong";
      }
    )
  }
  saveThemeEventEmit(value: string) {
    document.body.style.removeProperty('background-image');
    this.closeEvent.emit(value);
  }


  loadNames() {
    this.dashboardService.getAllThemeNames().subscribe(
      (data: any) => {
        this.xtremandLogger.info(data);
        this.sudha = data.data;
        for (let i = 0; i < data.data.length; i++) {
          this.tnames.push(data.data[i].replace(/\s/g, ''));
        }
      },
      (error: any) => {
        this.xtremandLogger.error(error);
        this.xtremandLogger.errorPage(error);
      },
    )
  }

  getAllThemeNames(contactName: string) {
    this.noOptionsClickError = false;
    var list = this.tnames;
    this.xtremandLogger.log(list);
    if ($.inArray(contactName, list) > -1) {
      if (contactName === this.themeDTO.name) {
        this.isValidContactName = false;
        $(".ng-valid[required], .ng-valid.required").css("color", "Black");
        $("button#sample_editable_1_new").prop('disabled', false);
      } else {
        this.isValidContactName = true;
        $("button#sample_editable_1_new").prop('disabled', true);
        $(".ng-valid[required], .ng-valid.required").css("color", "red");
        this.invalidContactNameError = "Name is already exists";
      }
    } else {
      $(".ng-valid[required], .ng-valid.required").css("color", "Black");
      $("button#sample_editable_1_new").prop('disabled', false);
      this.isValidContactName = false;
    }
  }
  all: string;
  sname = "name";
  showWithCopy(themeId: number) {
    this.dashboardService.getThemeDTOById(this.themeId).subscribe(
      (data: any) => {
        this.themeDto = data.data;
        if (this.themeDto.name === "Light" || this.themeDto.name === "Dark" ||
          this.themeDto.name === "Neumorphism Light" || this.themeDto.name === "Neumorphism Dark(Beta)"
          || this.isSaveTheme) {
          this.sname = this.themeDto.name + '_copy';
        }
        else {
          this.sname = this.themeDto.name;
        }
        console.log(this.sname);
      }
    )
  }
  updateThemedto: ThemeDto = new ThemeDto();
  emptyDto: ThemeDto = new ThemeDto();
  UpdateThemeDto() {
    this.ngxloading = true;
    this.updateThemedto.id = this.themeId;
    this.updateThemedto.name = this.sname;
    this.updateThemedto.defaultTheme = false;
    this.updateThemedto.createdBy = this.loggedInUserId;
    this.updateThemedto.parentThemeName = this.themeDTO.parentThemeName;
    if(this.uploadBgImage != "") {
    this.updateThemedto.backgroundImagePath = this.uploadBgImage;
    } else {
      this.updateThemedto.backgroundImagePath = this.themeDTO.backgroundImagePath;
    }

    if (CKEDITOR != undefined) {
      for (var instanceName in CKEDITOR.instances) {
        CKEDITOR.instances[instanceName].updateElement();
        this.footerForm.textContent = CKEDITOR.instances[instanceName].getData();
      }
    }
    this.headerForm.moduleTypeString = this.headerModuleName;
    this.leftSideForm.moduleTypeString = this.leftMenuModuleName;
    this.footerForm.moduleTypeString = this.footerModuleName;
    this.mainContentForm.moduleTypeString = this.mainModuleName;
    this.headerForm.themeId = this.themeId;
    this.leftSideForm.themeId = this.themeId;
    this.footerForm.themeId = this.themeId;
    this.mainContentForm.themeId = this.themeId;
    this.buttonCustomizationForm.themeId = this.themeId;
    if (this.activeTabName == 'buttonCustomization') {
      this.updateThemedto.themesProperties.push(this.buttonCustomizationForm)
    } else {
      this.updateThemedto.themesProperties.push(this.headerForm);
      this.updateThemedto.themesProperties.push(this.leftSideForm);
      this.updateThemedto.themesProperties.push(this.footerForm);
      this.updateThemedto.themesProperties.push(this.mainContentForm)
    }
    console.log(this.updateThemedto, 'wrapper');


    this.dashboardService.updateThemeDto(this.updateThemedto).subscribe(
      (data: any) => {
        this.ngxloading = false;
        //this.statusCode = 200;
        if (data.statusCode == 200) {
          this.saveThemeEventEmit("Theme Updated Successfully")
        } else if (data.statusCode == 402) {
          this.isValidContactName = true;
          this.invalidContactNameError = "Name is Required.";
        } else {
          this.isValid = true;
          this.validMessage = data.message;
        }

      },
      error => {
        this.ngxloading = false;
        this.statusCode = 500;
        this.updateThemedto = this.emptyDto;
        this.message = "Oops!Something went wrong";
      }
    )
  }
  updateThemeWithAlert() {
    let self = this;
    swal({
      title: 'Are you sure?',
      text: "Do you want to save the changes?",
      type: 'warning',
      showCancelButton: true,
      swalConfirmButtonColor: '#54a7e9',
      swalCancelButtonColor: '#999',
      confirmButtonText: 'Yes'

    }).then(function () {
      self.UpdateThemeDto();
      location.reload();
    }, function (dismiss: any) {
      console.log("you clicked showAlert cancel" + dismiss);
    });
  }
  update() {
    if (this.activeThemeId === this.themeId) {
      this.updateThemeWithAlert();
    } else {
      this.UpdateThemeDto();
    }
  }

  isShowUploadScreen: boolean;
  cropLogoImageText: string = "";
  cropRounded: boolean;
  aspectRatio: any;
  resizeToWidth: any;
  uploadImage() {
    this.isShowUploadScreen = false;
    this.cropLogoImageText = "Choose the image to be used as your company background";
    this.cropRounded = false;
    this.isShowUploadScreen = true;
    this.aspectRatio = (16 / 9);
    this.resizeToWidth = 1280;
    $('#cropBgImage').modal('show');
  }
  errorHandler(event) { event.target.src = 'assets/images/company-profile-logo.png'; }
  croppedImageForBgImage: any;
  loadingcrop: boolean;
  errorUploadCropper: boolean;
  showCropper: boolean;
  bgImagePath: any;
  logoError: boolean;
  logoErrorMessage: any;
  circleData: any;
  imageChangedEvent: any;
  croppedImage = '';
  backgroundImage(event: any) {
    this.croppedImageForBgImage = event;
    if (this.croppedImageForBgImage != "") {
      this.loadingcrop = true;
      let fileObj: any;
      fileObj = this.ustilService.convertBase64ToFileObject(this.croppedImageForBgImage);
      fileObj = this.ustilService.blobToFile(fileObj);
      this.processBgImageFile(fileObj);
    } else {
      this.errorUploadCropper = false;
      this.showCropper = false;
    }
  }
  uploadImagePath: any = "";
  uploadBgImage:any = "";
  processBgImageFile(fileObj: File) {
    this.dashboardService.uploadBgImageFile(fileObj).subscribe(result => {
      if (result.statusCode === 200) {
        this.bgImagePath = result.data;
        this.uploadBgImage = result.data;
        this.uploadImagePath = this.authenticationService.MEDIA_URL;
        this.logoError = false;
        this.logoErrorMessage = "";
        $('#cropBgImage').modal('hide');
        this.renderer.setElementStyle(document.body, 'background-image', 'url(' + this.authenticationService.MEDIA_URL + result.data + ')');
      }
    }, error => {
      console.log(error);
      $('#cropBgImage').modal('hide');
      this.customResponse = new CustomResponse('ERROR', this.properties.SOMTHING_WENT_WRONG, true)
    },
      () => {
        this.loadingcrop = false;
        this.themeDTO.backgroundImagePath = this.bgImagePath;
        $('#cropBgImage').modal('hide');
        this.closeModal();
      });
  }
  closeModal() {
    this.cropRounded = !this.cropRounded;
    this.circleData = {};
    this.imageChangedEvent = null;
    this.croppedImage = '';
  }
  resetPreviewImage() {
    document.body.style.removeProperty('background-image');
    this.getDefaultImagePath();
  }

  getDefaultImagePath() {
    this.ngxloading = true;
    this.dashboardService.getDefaultImagePath(this.themeDTO.parentThemeName, this.themeDTO.id).subscribe(
      (data: any) => {
        this.ngxloading = false;
        this.bgImagePath = data.data;
      }, error => {
        this.ngxloading = false;
        this.bgImagePath = "";
      }, () => {
        this.themeDTO.backgroundImagePath = this.bgImagePath;
        if(this.themeDTO.backgroundImagePath.includes('/assets')) {
          this.uploadImagePath ="";
        } else {
          this.uploadImagePath = this.authenticationService.MEDIA_URL;
        }
      }
    )
  }
}
