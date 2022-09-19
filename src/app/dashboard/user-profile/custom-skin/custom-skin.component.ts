import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
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

declare var $ : any,CKEDITOR: any;
@Component({
  selector: 'app-custom-skin',
  templateUrl: './custom-skin.component.html',
  styleUrls: ['./custom-skin.component.css'],
  providers: [EmailTemplate,Properties]
})
export class CustomSkinComponent implements OnInit {
  @ViewChild("myckeditor") ckeditor: any;
  form :CustomSkin = new CustomSkin();
  isValidDivBgColor = true;
  isValidHeaderTextColor =true;
  isValidBackgroundColor= true;
  isValidButtonValueColor= true;
  isValidTextColor= true;
  isValidButtonBorderColor= true; 
  isValidIconColor = true;
  isValidButtonColor = true;
  valueRange: number;
  backgroundColor :string;
  divBgColor:string;
  headerTextColor:string;
  iconColor :string;
  textColor:string;
  buttonBorderColor:string;
  buttonValueColor:string;
  buttonColor :string;
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
  statusCode :any;
  isValid = false;
  customResponse: CustomResponse = new CustomResponse();
  ngxloading = false;
  fontStyles : string[] =["--select font style--","serif","sans-serif","monospace","cursive","fantasy","system-ui","ui-serif",
                           "ui-sans-serif","ui-monospace","Open Sans, sans-serif"]
  constructor(public regularExpressions: RegularExpressions,public videoUtilService: VideoUtilService,
    public dashboardService: DashboardService,public authenticationService:AuthenticationService,
    public referenceService: ReferenceService,
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
    this.activeTabNav(this.activeTabName);
    try {
      this.ckeConfig = {
          allowedContent: true,
      };
  } catch ( errr ) { }
  }

  
  clearCustomResponse(){this.customResponse = new CustomResponse();}
  activeTabNav(activateTab:any){
    this.ngxloading = true;
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
   this.getDefaultSkin();
  }
  showFooterChange() {
    this.form.showFooter = !this.form.showFooter;
    this.showFooter = !this.form.showFooter;
  } 

  message:string="";
  saveSkin(form:CustomSkin){
    this.ngxloading = true;
    this.message = ""; 
    this.form.createdBy = this.loggedInUserId;
    this.form.updatedBy = this.loggedInUserId;
    this.form.companyId = this.loggedInUserId;
    if(CKEDITOR!=undefined){
      for (var instanceName in CKEDITOR.instances) {
          CKEDITOR.instances[instanceName].updateElement();
          form.textContent = CKEDITOR.instances[instanceName].getData();
      }
    }
    this.dashboardService.saveCustomSkin(form).subscribe(
      (data:any)=> {
      this.sucess = true;
      this.referenceService.showSweetAlertSuccessMessage("Settings updated successfully.");
      this.router.navigate(['/home/dashboard/myprofile']);
      },
     error =>{
      this.referenceService.scrollSmoothToTop();
      if(this.form.textContent.length > 225){
        this.message = this.properties.serverErrorMessage;
      }else{
        this.message = this.properties.serverErrorMessage;
      }
      this.statusCode = 500;
      this.ngxloading = false;
     });
  }
  saveCustomSkin(form:CustomSkin){
    this.form.defaultSkin = false;
    this.saveSkin(form);
  }
  saveDefaultSkin(form:CustomSkin){
    this.form.defaultSkin = true;
    this.saveSkin(form);
  }
  
  getDefaultSkin(){
    this.ngxloading = true;
    this.dashboardService.getTopNavigationBarCustomSkin(this.vanityLoginDto)
    .subscribe(
        (data:any) =>{
           let skinMap = data.data;
           if(this.form.moduleTypeString === "TOP_NAVIGATION_BAR"){
            this.form = skinMap.TOP_NAVIGATION_BAR;
           }else if(this.form.moduleTypeString === "LEFT_SIDE_MENU"){
            this.form = skinMap.LEFT_SIDE_MENU;
           }else if(this.form.moduleTypeString === "FOOTER"){
            this.form = skinMap.FOOTER;
           } else if(this.form.moduleTypeString === "MAIN_CONTENT"){
            this.form = skinMap.MAIN_CONTENT;
           }
           this.iconColor = this.form.iconColor;
           this.backgroundColor = this.form.backgroundColor;
           this.textColor = this.form.textColor;
           this.buttonBorderColor = this.form.buttonBorderColor;
           this.buttonColor = this.form.buttonColor;
           this.buttonValueColor = this.form.buttonValueColor;
           this.fontFamily = this.form.fontFamily
           this.divBgColor = this.form.divBgColor;
           this.footerContent = this.form.textContent;
           this.headerTextColor = this.form.headerTextColor;
           this.ngxloading =false;
        },error=>{
          this.ngxloading =false;
          this.message = this.properties.serverErrorMessage;
        });
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
  if (type === "backgroundColor") {
      this.form.backgroundColor = colorCode;
      this.isValidBackgroundColor = true;
  }else if(type === "divBgColor"){
    this.form.divBgColor = colorCode;
    this.isValidDivBgColor = true;
  }else if(type === "headerTextColor"){
    this.form.headerTextColor = colorCode;
    this.isValidHeaderTextColor = true;
  }else if (type === "butttonBorderColor") {
      this.form.buttonBorderColor = colorCode;
      this.isValidButtonBorderColor= true;
  } else if (type === "buttonColor") {
      this.form.buttonColor = colorCode;
      this.isValidButtonColor = true;
  } else if (type === "buttonValueColor") {
      this.form.buttonValueColor = colorCode;
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
    }else if(this.form.buttonValueColor === this.form.buttonColor){
      this.isValid = true;
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
  if (type === "backgroundColor") {
      this.form.backgroundColor = "";
      this.isValidBackgroundColor = false;
  }
  else if(type === "divBgColor"){
    this.form.divBgColor = "";
    this.isValidDivBgColor = false;
  }else if(type === "headerTextColor"){
    this.form.headerTextColor = "";
    this.isValidHeaderTextColor = false;
  }  else if (type === "buttonColor") {
      this.form.buttonColor = "";
      this.isValidButtonColor = false;
  } else if (type === "buttonValueColor") {
      this.form.buttonValueColor = "";
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
changeControllerColor(event: any, form: CustomSkin, type: string) {
  try {
      const rgba = this.videoUtilService.transparancyControllBarColor(event, this.valueRange);
      $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
      if (type === "backgroundColor") {
          this.backgroundColor = event;
          form.backgroundColor = event;
          this.isValidBackgroundColor = true;
      }else if(type === "divBgColor"){
        this.divBgColor = event;
        form.divBgColor = event;
        this.isValidDivBgColor = true;
      }else if(type === "headerTextColor"){
        form.headerTextColor = event;
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
          form.buttonValueColor = event;
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


}
