import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { UtilService } from 'app/core/services/util.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { CustomSkin } from 'app/dashboard/models/custom-skin';
import { VideoUtilService } from 'app/videos/services/video-util.service';
import { TabHeadingDirective } from 'ngx-bootstrap';
declare var $ : any;
@Component({
  selector: 'app-custom-skin',
  templateUrl: './custom-skin.component.html',
  styleUrls: ['./custom-skin.component.css']
})
export class CustomSkinComponent implements OnInit {
  form :CustomSkin = new CustomSkin();
  isValidBackgroundColor= true;
  isValidButtonValueColor= true;
  isValidTextColor= true;
  isValidButtonBorderColor= true; 
  isValidIconColor = true;
  isValidButtonColor = true;
  valueRange: number;
  backgroundColor :string;
  iconColor :string;
  textColor:string;
  buttonBorderColor:string;
  buttonValueColor:string;
  buttonColor :string;
  loggedInUserId:any;
  fontFamily:string;
  isValidColorCode = true;
  sucess:boolean = false;
  ckeConfig: any;
  moduleStatusList: string[] =["--Select Type--","LEFT_SIDE_MENU","TOP_NAVIGATION_BAR","FOOTER","MAIN_CONTENT"];
  isLoggedInFromAdminSection = false;
  loading = false;
  fontStyles : string[] =["serif","sans-serif","monospace","cursive","fantasy","system-ui","ui-serif",
                           "ui-sans-serif","ui-monospace","'Open Sans', sans-serif"]
  constructor(public regularExpressions: RegularExpressions,public videoUtilService: VideoUtilService,
    public dashboardService: DashboardService,public authenticationService:AuthenticationService,
    public referenceService: ReferenceService,
    public ustilService: UtilService,public router: Router) {
        this.loggedInUserId = this.authenticationService.getUserId();
        this.isLoggedInFromAdminSection = this.ustilService.isLoggedInFromAdminPortal()
     }

  ngOnInit() {
    this.form.moduleTypeString = this.moduleStatusList[0];
  }
  showFooterChange() {
    this.form.showFooter = !this.form.showFooter;
  } 
  saveCustomSkin(form:CustomSkin){
    this.form.createdBy = this.loggedInUserId;
    this.form.updatedBy = this.loggedInUserId;
    this.form.companyId = this.loggedInUserId;
   this.dashboardService.saveCustomSkin(form).subscribe(
    (data:any)=> {
    console.log(data.data)
    this.sucess = true;
    this.router.navigate(['/home/dashboard/myprofile']);
    }
   )
  }
  type1:any;
  onChange(type:any){
    this.type1 = type;
    this.getDefaultSkin();
  }
  close(){
    this.sucess = false;
  }
  getDefaultSkin(){
    this.dashboardService.getTopNavigationBarCustomSkin(this.loggedInUserId).subscribe(
        (data:any) =>{
           let skinMap = data.data;
           if(this.form.moduleTypeString === "TOP_NAVIGATION_BAR"){
            this.form = skinMap.TOP_NAVIGATION_BAR
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
           console.log(this.form)
        }
    )
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
  } else if (type === "butttonBorderColor") {
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
}
checkValideColorCodes(){
  if (this.isValidBackgroundColor  && this.isValidButtonColor && this.isValidButtonValueColor && this.isValidTextColor && this.isValidButtonBorderColor) {
      this.isValidColorCode = true;
  }
}
private addColorCodeErrorMessage(type: string) {
  this.isValidColorCode = false;
  if (type === "backgroundColor") {
      this.form.backgroundColor = "";
      this.isValidBackgroundColor = false;
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
      } else if (type === "iconColor") {
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
}


}
