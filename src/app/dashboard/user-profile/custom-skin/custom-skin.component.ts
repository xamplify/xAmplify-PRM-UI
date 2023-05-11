import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild,Input } from '@angular/core';
import { Router } from '@angular/router';
import { CustomResponse } from 'app/common/models/custom-response';
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { UtilService } from 'app/core/services/util.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { CustomSkin } from 'app/dashboard/models/custom-skin';
import { EmailTemplate } from 'app/email-template/models/email-template';
import { EmailTemplateService } from 'app/email-template/services/email-template.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { VideoUtilService } from 'app/videos/services/video-util.service';
import { Properties } from 'app/common/models/properties';
import { ThemePropertiesListWrapper } from 'app/dashboard/models/theme-properties-list-wrapper';
import { ThemeDto } from 'app/dashboard/models/theme-dto';
import { ThemePropertiesDto } from 'app/dashboard/models/theme-properties-dto';
import { NumericBlurEventArgs } from '@syncfusion/ej2-angular-inputs';
import { HeaderThemePropertiesDto } from 'app/dashboard/models/header-properties-dto';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';

declare var $ : any,CKEDITOR: any,swal:any;
@Component({
  selector: 'app-custom-skin',
  templateUrl: './custom-skin.component.html',
  styleUrls: ['./custom-skin.component.css'],
  providers: [EmailTemplate,Properties]
})
export class CustomSkinComponent implements OnInit {
  form :ThemePropertiesDto = new ThemePropertiesDto();
  @ViewChild("myckeditor") ckeditor: any;
  @Input() themeDTO:ThemeDto;
  @Input() themeId:number;
  isValidDivBgColor = true;
  isValidHeaderTextColor =true;
  isValidBackgroundColor= true;
  isValidButtonValueColor= true;
  isValidTextColor= true;
  isValidButtonBorderColor= true; 
  isValidIconColor = true;
  isValidButtonColor = true;

  saveBoolean = false;
  updateBoolean = false;

  valueRange: number;
  backgroundColor :string;
  divBgColor:string;
  headerTextColor:string;
  iconColor :string;
  textColor:string;
  buttonBorderColor:string;
  buttonValueColor:string;
  buttonColor :string;
  textContent :string;
  loggedInUserId:any;
  fontFamily:string;
  isValidColorCode = true;
  sucess:boolean = false;
  name = 'ng2-ckeditor';
  ckeConfig: any;
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  lableForBgColor:string ="Background Color";
  moduleStatusList: string[] =["--Select Type--","LEFT_SIDE_MENU","TOP_NAVIGATION_BAR","FOOTER","MAIN_CONTENT"];
  isLoggedInFromAdminSection = false;
  loading = false;
  vanityLogin = false;
  activeTabName: string = "header";
  showFooter:boolean;
  footerContent:any;
  charactersLeft = 250;
  minLength:number;
  statusCode :any;
  isValid = false;
  customResponse: CustomResponse = new CustomResponse();
  ngxloading = false;
  fontStyles : string[] =["--select font style--","serif","sans-serif","monospace","cursive","fantasy","system-ui","ui-serif",
                           "ui-sans-serif","ui-monospace","Open Sans, sans-serif"];
  saveAlert:boolean = false;
  defaultAlert :boolean = false;
  themeName  = "Light";
  themePropertiesListWrapper: ThemePropertiesListWrapper = new ThemePropertiesListWrapper();
  themeDtoObj: ThemeDto;
  // public createdBy: any;
  // public description: any;
  // public updatedBy: any;
  // public createdDate: any;
  // public updatedDate: any;
 
  themeDtoList : ThemePropertiesDto[];
  themeDto : ThemeDto = new ThemeDto();
  colorProperties : ThemePropertiesDto[]= [];
  themeWrapper : ThemePropertiesListWrapper = new ThemePropertiesListWrapper();
  footerForm :ThemePropertiesDto = new ThemePropertiesDto();
  mainContentForm :ThemePropertiesDto = new ThemePropertiesDto();
  headerForm :ThemePropertiesDto = new ThemePropertiesDto();
  leftSideForm :ThemePropertiesDto = new ThemePropertiesDto();
  isValidContactName: boolean = false;
  noOptionsClickError: boolean = false;
  invalidContactNameError = "";
  checkingContactTypeName: string;
  isValidLegalOptions = true;
  // sudha : Array<ThemePropertiesDto>;
  constructor(public regularExpressions: RegularExpressions,public videoUtilService: VideoUtilService,
    public dashboardService: DashboardService,public authenticationService:AuthenticationService,
    public referenceService: ReferenceService,
    public xtremandLogger: XtremandLogger,
    public ustilService: UtilService,public router: Router,public properties:Properties) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.isLoggedInFromAdminSection = this.ustilService.isLoggedInFromAdminPortal();
    this.vanityLoginDto.userId = this.loggedInUserId;
    let companyProfileName = this.authenticationService.companyProfileName;
    if (companyProfileName !== undefined && companyProfileName !== "") {
      this.vanityLoginDto.vendorCompanyProfileName = companyProfileName;
      this.vanityLoginDto.vanityUrlFilter = true;
      this.vanityLogin = true;
    }else{
      this.vanityLoginDto.vanityUrlFilter = false;
    }
   
     }

  ngOnInit() {
   //this. saveAll();
    this.activeTabNav(this.activeTabName);
    this.loadNames();
    this.getDefaultNames(this.themeId);

    this.getDefaultSkin(this.themeId);
    try {
      this.ckeConfig = {
          allowedContent: true,
      };
  } catch ( errr ) { }
  }
  save(form:ThemePropertiesDto){
    if(CKEDITOR!=undefined){
      for (var instanceName in CKEDITOR.instances) {
          CKEDITOR.instances[instanceName].updateElement();
          form.textContent = CKEDITOR.instances[instanceName].getData();
      }
    }
    this.saveThemePropertiesToList(form);
  }
  colorsdto:ThemePropertiesDto;
  // saveThemePropertiesToList(form:ThemePropertiesDto){
  //   this.saveAlert = false;
  //   this.colorsdto = new ThemePropertiesDto();
  //   let self = this;
    
  //   self.colorsdto.backgroundColor = 'pink';
  //   self.colorsdto.textColor = 'red';
  //   self.colorsdto.buttonColor = 'yellow';
  //   self.colorsdto.divBgColor = 'green';
  //   self.colorsdto.iconColor = 'purple';
  //   self.colorsdto.buttonBorderColor = 'grey';
  //   self.colorsdto.buttonValueColor = 'blue';
  //   self.colorsdto.showFooter = form.showFooter;
  //   self.colorsdto.moduleTypeString = form.moduleTypeString;
  //   self.textContent = 'added colors';
  //   self.colorsdto.createdBy = this.loggedInUserId;
  //   this.themePropertiesListWrapper.propertieslist.push(self.colorsdto);
  //   this.saveAlert = true;
  //   this.message = "Data saved Sucessfully"

  // }
  clearCustomResponse(){this.customResponse = new CustomResponse();}
  activeTabNav(activateTab:any){
   // this.ngxloading = true;
    this.saveAlert = false;
    this.defaultAlert = false;
  this.activeTabName = activateTab;
  if(this.activeTabName == "header"){
    this.form.moduleTypeString = this.moduleStatusList[2];
  }else if(this.activeTabName == "leftmenu"){
    this.form.moduleTypeString = this.moduleStatusList[1];
  }else if(this.activeTabName == "pagecontent"){
    this.form.moduleTypeString = this.moduleStatusList[4];
  }else if (this.activeTabName == "footer"){
    this.form.moduleTypeString = this.moduleStatusList[3];
  }
   //this.getDefaultSkin(this.themeId);
  }
  showFooterChange() {
    this.form.showFooter = !this.form.showFooter;
    this.showFooter = !this.form.showFooter;
  } 
  
  message:string="";

  
  /********** Sucess Alert (XNFR-238)************/
  showSweetAlertSuccessMessage(message: string) {
    swal({
      title: message,
      type: "success",
      allowOutsideClick: false,
    }).then(
      function (allowOutsideClick) {
        if (allowOutsideClick) {
          console.log('CONFIRMED');
           window.location.reload();
        }
      });
  }
  /******* Reload Alert ******/
  
  /********** Close Sucess Alert  (XNFR-238)*************/

  saveHeader(form:ThemePropertiesDto){
    // this.themeDtoHeaderList.push(form);
    this.headerForm = form;
    this.themePropertiesListWrapper.propertiesList.push(this.headerForm);
    //this.saveThemePropertiesToList(this.headerForm);
    console.log(this.headerForm);
  }
  saveLeftForm(form:ThemePropertiesDto){
    // this.themeDtoLeftMenu.push(form);
    this.leftSideForm = form;
    this.themePropertiesListWrapper.propertiesList.push(this.leftSideForm)
    this.saveThemePropertiesToList(this.leftSideForm);
    console.log(this.leftSideForm);
  }
  saveFooter(form:ThemePropertiesDto){
    //this.themeDtoFooterList.push(form);
    this.footerForm = form;
    this.themePropertiesListWrapper.propertiesList.push(this.footerForm);
   //this.saveThemePropertiesToList(this.footerForm);
  }
  saveMainForm(form:ThemePropertiesDto){
   // this.themeDtoMainContent.push(form);
   this.mainContentForm = form;
   this.themePropertiesListWrapper.propertiesList.push(this.mainContentForm);
   //.saveThemePropertiesToList(this.mainContentForm);

  }
  allProperties:any;
  // saveAll(){

  //   this.headerForm = this.allProperties.TOP_NAVIGATION_BAR;
  //   this.headerForm.createdBy = this.loggedInUserId;
  //   this.leftSideForm = this.allProperties.LEFT_SIDE_MENU;
  //   this.leftSideForm.createdBy = this.loggedInUserId;
  //   this.footerForm = this.allProperties.FOOTER;
  //   this.footerForm.createdBy = this.loggedInUserId;
  //   this.mainContentForm = this.allProperties.MAIN_CONTENT;
  //   this.mainContentForm.createdBy = this.loggedInUserId;
  //   }
  changEvent(ev:any){
    this.themeName = ev;
    this.getAllThemeNames(this.themeName);
  }
  // saveTheme(){
  //   // alert(this.themeName);
  //   this.defaultAlert = false;
  //   this.themeDto.name = this.themeName;
  //  // alert(this.themeDto.name)
  //   this.themeDto.description = 'Hi';
  //   this.themeDto.defaultTheme = false;
  //   this.themeDto.createdBy = this.loggedInUserId;
  //   this.defaultAlert = true;
  //   this.saveAlert = false;
  //  // console.log(this.themeDto);
  // }

id : number;
// getThemePropertiesWrapperObj(){
//   this.saveTheme();
//   this.getDefaultSkin(this.id);
// // this.themePropertiesListWrapper.propertieslist.push(this.headerForm);
// // this.themePropertiesListWrapper.propertieslist.push(this.leftSideForm);
// // this.themePropertiesListWrapper.propertieslist.push(this.footerForm);
// // this.themePropertiesListWrapper.propertieslist.push(this.mainContentForm)
// this.themePropertiesListWrapper.themeDto = this.themeDto;
//  console.log(this.themePropertiesListWrapper);
//   this.dashboardService.saveMultipleTheme(this.themePropertiesListWrapper).subscribe(
//         (data:any)=> {
//           this.router.navigate(['/home/dashboard/myprofile']);
//           this.referenceService.showSweetAlertSuccessMessage("Theme Saved Successfully.");
//         },
//         error =>{
//           this.statusCode = 500;
//           this.message = "Oops!Something went wrong";
//         }
//     )
// }
  saveDefaultSkin(form:CustomSkin){
  // this.form.defaultSkin = true;
    //this.sweetAlertDefaultSettings(form)
   // this.form.darkTheme = false;
    this.updateUserDefaultSettings(form);
  }
  updateUserDefaultSettings(form:CustomSkin){
    this.ngxloading = true;
   // this.form.createdBy = this.loggedInUserId;
    this.form.updatedBy = this.loggedInUserId;
    this.dashboardService.updateCustomDefaultSettings(form).subscribe(
      (data:any) =>{
        this.defaultAlert = true;
        this.message="Default Settings Updated."
        this.ngxloading =false;
      },error=>{
        this.ngxloading =false;
        this.message = this.properties.serverErrorMessage;
      });
  }
  important = "!important";
  // getDefaultSkin(id:number){
  //  // this.ngxloading = true;
  // this.dashboardService.getPropertiesById(id)
  //       .subscribe(
  //       (data:any) =>{
  //         let skinMAp = data.data;
  //         this.allProperties = data.data;
  //          if(this.form.moduleTypeString === "TOP_NAVIGATION_BAR"){
  //           this.form = skinMAp.TOP_NAVIGATION_BAR;
  //          }else if(this.form.moduleTypeString === "LEFT_SIDE_MENU"){
  //           this.form = skinMAp.LEFT_SIDE_MENU;
  //          }else if(this.form.moduleTypeString === "FOOTER"){
  //           this.form = skinMAp.FOOTER;
  //          } else if(this.form.moduleTypeString === "MAIN_CONTENT"){
  //           this.form = skinMAp.MAIN_CONTENT;
  //          }
  //          this.iconColor = this.form.iconColor;
  //          this.backgroundColor = this.form.backgroundColor;
  //          this.textColor = this.form.textColor;
  //          this.buttonBorderColor = this.form.buttonBorderColor;
  //          this.buttonColor = this.form.buttonColor;
  //          this.buttonValueColor = this.form.buttonValueColor;
  //          this.divBgColor = this.form.divBgColor;
  //          this.footerContent = this.form.textContent;
  //          this.textContent = this.form.textContent;
  //          this.saveAll()
  //          this.ngxloading =false;
  //       },error=>{
  //         this.ngxloading =false;
  //         this.message = this.properties.serverErrorMessage;
  //       });
  // }
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
  if (type === "headerBackgroundColor") {
    this.form.backgroundColor = colorCode;
    this.isValidBackgroundColor = true;
}
  else if(type === "divBgColor"){
    this.form.divBgColor = colorCode;
    this.isValidDivBgColor = true;
  }else if(type === "headerTextColor"){
  //  this.form.headerTextColor = colorCode;
    this.isValidHeaderTextColor = true;
  }else if (type === "butttonBorderColor") {
      this.form.buttonBorderColor = colorCode;
      this.isValidButtonBorderColor= true;
  } else if (type === "buttonColor") {
      this.form.buttonColor = colorCode;
      this.isValidButtonColor = true;
  } else if (type === "buttonValueColor") {
     // this.form.buttonValueColor = colorCode;
      this.isValidButtonValueColor = true;
  } else if (type === "textColor") {
      this.form.textColor = colorCode;
      this.isValidTextColor = true;
  } else if (type === "iconColor") {
      this.form.iconColor = colorCode;
      this.isValidIconColor = true;
  } 
  this.checkValideColorCodes();
  this.disabledSaveButton();
}

disabledSaveButton(){
    if(this.activeTabName ==='leftmenu'){
      if(this.form.backgroundColor === this.form.textColor){
        this.isValid = true;
      }else if(this.form.backgroundColor===this.form.iconColor){
        this.isValid = true;
      }else{
        this.isValid = false;
      }
    }
    if(this.activeTabName === 'footer'){
      if(this.form.textColor === this.form.backgroundColor){
        this.isValid = true;
      }else{
        this.isValid = false;
      }
    }

    if (this.isValidBackgroundColor  && this.isValidButtonColor && this.isValidButtonValueColor && this.isValidTextColor && this.isValidButtonBorderColor) {
      this.isValidColorCode = true;
  }
}
checkValideColorCodes(){
  if(this.form.backgroundColor=== this.form.buttonColor){
    this.isValid = true; 
  //  }else if(this.form.buttonValueColor === this.form.buttonColor){
  //    this.isValid = true;
    }else if(this.form.iconColor === this.form.buttonColor){
      this.isValid = true;
    }else{
      this.isValid = false;
    }
    
  if (this.isValidBackgroundColor  && this.isValidButtonColor && this.isValidButtonValueColor && this.isValidTextColor && this.isValidButtonBorderColor) {
      this.isValidColorCode = true;
  }
}
private addColorCodeErrorMessage(type: string) {
  this.isValidColorCode = false;
  if (type === "headerBackgroundColor") {
    this.form.backgroundColor = "";
    this.isValidBackgroundColor = false;
  }
  else if(type === "divBgColor"){
    this.form.divBgColor = "";
    this.isValidDivBgColor = false;
  }else if(type === "headerTextColor"){
  //  this.form.headerTextColor = "";
    this.isValidHeaderTextColor = false;
  }  else if (type === "buttonColor") {
      this.form.buttonColor = "";
      this.isValidButtonColor = false;
  } else if (type === "buttonValueColor") {
   //   this.form.buttonValueColor = "";
      this.isValidButtonValueColor = false;
  } else if (type === "textColor") {
      this.form.textColor = "";
      this.isValidTextColor = false;
  } else if (type === "iconColor") {
      this.form.iconColor = "";
      this.isValidIconColor = false;
  } else if (type === "buttonBorderColor"){
    this.form.buttonBorderColor = "";
    this.isValidButtonBorderColor = false;
  }
}
changeControllerColor(event: any, form: ThemePropertiesDto, type: string) {
  try {
      const rgba = this.videoUtilService.transparancyControllBarColor(event, this.valueRange);
      $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
      if (type === "headerBackgroundColor") {
        this.backgroundColor = event;
        form.headerBackgroundColor = event;
        this.isValidBackgroundColor = true;
    }
      else if(type === "divBgColor"){
        this.divBgColor = event;
        form.divBgColor = event;
        this.isValidDivBgColor = true;
      }else if(type === "headerTextColor"){
       // form.headerTextColor = event;
        this.headerTextColor = event;
        this.isValidHeaderTextColor = true;
      }
       else if (type === "iconColor") {
          this.iconColor = event;
          form.iconColor = event;
          this.isValidIconColor = true;
      } else if (type === "buttonColor") {
          this.buttonColor = event;
          form.buttonColor = event
          this.isValidButtonColor = true;
      } else if (type === "buttonValueColor") {
          this.buttonValueColor = event;
       //   form.buttonValueColor = event;
          this.isValidButtonValueColor = true;
      } else if (type === "textColor") {
          this.textColor = event;
          form.textColor = event;
          this.isValidTextColor = true;
      } else if( type === "buttonBorderColor"){
        this.buttonBorderColor = event;
        form.buttonBorderColor = event;
        this.isValidButtonBorderColor = true;
      }
  } catch (error) { console.log(error); }
  this.checkValideColorCodes();
  this.disabledSaveButton();
}




                                         //  Newly Changes

names: string[] = [];
                            //  saves name
saveTheme(){
    this.defaultAlert = false;
    this.themeDto.name = this.themeName;
    this.themeDto.description = 'Hi';
    this.themeDto.defaultTheme = false;
    this.themeDto.createdBy = this.loggedInUserId;
    this.defaultAlert = true;
    this.saveAlert = false;

  //   var list = this.names;
    
  //   if ($.inArray( this.themeName, list ) > -1 ) {
  //     this.isValidContactName = true;
  //     $( "button#sample_editable_1_new" ).prop( 'disabled', true );
  //     $( ".ng-valid[required], .ng-valid.required" ).css( "color", "red" );
  //     this.invalidContactNameError = this.checkingContactTypeName+" List name already exists";
  // }
  }

                           
                      // gives default values with id


  saveAll(){
    this.headerForm = this.allProperties.TOP_NAVIGATION_BAR;
    this.headerForm.createdBy = this.loggedInUserId;
    this.leftSideForm = this.allProperties.LEFT_SIDE_MENU;
    this.leftSideForm.createdBy = this.loggedInUserId;
    this.footerForm = this.allProperties.FOOTER;
    this.footerForm.createdBy = this.loggedInUserId;
    this.mainContentForm = this.allProperties.MAIN_CONTENT;
    this.mainContentForm.createdBy = this.loggedInUserId;
    }


                       // saves db colors


    getDefaultSkin(id:number){
      // this.ngxloading = true;
     this.dashboardService.getPropertiesById(id)
           .subscribe(
           (data:any) =>{
            // console.log(data);
            // alert(data);
             let skinMAp = data.data;
             this.allProperties = data.data;
              if(this.form.moduleTypeString === "TOP_NAVIGATION_BAR"){
               this.form = skinMAp.TOP_NAVIGATION_BAR;
              }else if(this.form.moduleTypeString === "LEFT_SIDE_MENU"){
               this.form = skinMAp.LEFT_SIDE_MENU;
              }else if(this.form.moduleTypeString === "FOOTER"){
               this.form = skinMAp.FOOTER;
              } else if(this.form.moduleTypeString === "MAIN_CONTENT"){
               this.form = skinMAp.MAIN_CONTENT;
              }

              this.headerForm = skinMAp.TOP_NAVIGATION_BAR;
              this.leftSideForm = skinMAp.LEFT_SIDE_MENU;
              this.mainContentForm = skinMAp.MAIN_CONTENT;
              this.footerForm = skinMAp.FOOTER;
              
              this.iconColor = this.form.iconColor;
              this.backgroundColor = this.form.backgroundColor;
              this.textColor = this.form.textColor;
              this.buttonBorderColor = this.form.buttonBorderColor;
              this.buttonColor = this.form.buttonColor;
              this.buttonValueColor = this.form.buttonValueColor;
              this.divBgColor = this.form.divBgColor;
              this.footerContent = this.form.textContent;
              this.textContent = this.form.textContent;
             // this.saveAll()
              this.ngxloading =false;
           },error=>{
             this.ngxloading =false;
             this.message = this.properties.serverErrorMessage;
           });
     }

                    //getting default values without calling id

     saveThemePropertiesToList(form:ThemePropertiesDto){
      this.saveAlert = false;
      this.colorsdto = new ThemePropertiesDto();
      let self = this;
      
      self.colorsdto.backgroundColor = form.backgroundColor;
    self.colorsdto.textColor = form.textColor;
    self.colorsdto.buttonColor = form.buttonColor;
    self.colorsdto.divBgColor = form.divBgColor;
    self.colorsdto.iconColor = form.iconColor;
    self.colorsdto.buttonBorderColor = form.buttonBorderColor;
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

  getThemePropertiesWrapperObj(){
  // this.saveTheme();
    this.getDefaultNames(this.themeId);
  this.themePropertiesListWrapper.themeDto = this.themeDto;
  console.log(this.themePropertiesListWrapper,'wrapper');
  console.log(this.themeDto,'dto');
  this.saveThemePropertiesToList(this.headerForm);
  this.saveThemePropertiesToList(this.leftSideForm);
  this.saveThemePropertiesToList(this.footerForm);
  this.saveThemePropertiesToList(this.mainContentForm);
    
    this.dashboardService.saveMultipleTheme(this.themePropertiesListWrapper).subscribe(
          (data:any)=> {
            this.router.navigate(['/home/dashboard/myprofile']);
            this.referenceService.showSweetAlertSuccessMessage("Theme Saved Successfully.");
          },
          error =>{
            this.statusCode = 500;
            this.message = "Oops!Something went wrong";
          }
      )
  }
nameAlreadyExist = "";
  tnames: string[] = [];
  sudha: string[] = [];
  public themeNameDto:Array<ThemeDto>;

  loadNames(){
    this.dashboardService.getAllThemeNames().subscribe(
      (data:any) =>{
        this.xtremandLogger.info( data );
        this.sudha = data.data;
        for ( let i = 0; i < data.data.length; i++ ) {
          this.tnames.push(data.data[i].replace( /\s/g, '' ) );
      }
      },
      ( error: any ) => {
        this.xtremandLogger.error( error );
        this.xtremandLogger.errorPage( error );
    },
    )
  }

  getAllThemeNames(contactName:string){
    this.noOptionsClickError = false;
    var list = this.tnames;
    this.xtremandLogger.log( list );
    if ($.inArray( contactName, list ) > -1 ) {
      this.isValidContactName = true;
      $( "button#sample_editable_1_new" ).prop( 'disabled', true );
      $( ".ng-valid[required], .ng-valid.required" ).css( "color", "red" );
      this.invalidContactNameError = "name already exists";
    }else {
      $( ".ng-valid[required], .ng-valid.required" ).css( "color", "Black" );
      $( "button#sample_editable_1_new" ).prop( 'disabled', false );
      this.isValidContactName = false;
  }
    }
    all:string;
    sname = "name";
getDefaultNames(themeId:number){
  this.dashboardService.getThemeDTOById(this.themeId).subscribe(
    (data:any) =>{
      this.themeDto = data.data;
      this.sname = this.themeDto.name + ' copy';
      console.log(this.sname);
    }
  )
}
}
