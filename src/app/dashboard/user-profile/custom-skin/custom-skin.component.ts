import { Component, OnInit } from '@angular/core';
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { CustomSkin } from 'app/dashboard/models/custom-skin';
import { VideoUtilService } from 'app/videos/services/video-util.service';
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
  isValidBorderColor= true;
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
  moduleStatusList: string[] =["LEFT_SIDE_MENU","TOP_NAVIGATION_BAR","FOOTER"];
  //moduleStatusString:string;
  fontStyles : string[] =["serif","sans-serif","monospace","cursive","fantasy","system-ui","ui-serif",
                           "ui-sans-serif","ui-monospace","'Open Sans', sans-serif"]
  constructor(public regularExpressions: RegularExpressions,public videoUtilService: VideoUtilService,
    public dashboardService: DashboardService,public authenticationService:AuthenticationService,
    public referenceService: ReferenceService) {
        this.loggedInUserId = this.authenticationService.getUserId(); 
     }

  ngOnInit() {
  }
  saveCustomSkin(form:CustomSkin){
    this.form.createdBy = this.loggedInUserId;
    this.form.updatedBy = this.loggedInUserId;
    this.form.companyId = this.loggedInUserId;
   this.dashboardService.saveCustomSkin(form).subscribe(
    (data:any)=> {
    console.log(data.data)
    this.sucess = true;
    }
   )
  }
  type1:any;
  onChange(type:any){
    this.type1 = type;
    this.getDefaultSkin(this.form.moduleTypeString);
  }
  close(){
    this.sucess = false;
  }
  getDefaultSkin(type:any){
    this.dashboardService.getDefaulSkinBYType(this.loggedInUserId,type).subscribe(
        (data:any) =>{
           this.form = data.data;
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
      this.isValidBorderColor = true;
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
  if (this.isValidBackgroundColor  && this.isValidButtonColor && this.isValidButtonValueColor && this.isValidTextColor) {
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
      this.isValidBorderColor = false;
  } else if (type === "buttonBorderColor"){
    this.form.buttonBorderColor = "";
    this.isValidBorderColor = false;
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
        this.isValidBorderColor = true;
      }
  } catch (error) { console.log(error); }
  this.checkValideColorCodes();
}


}
