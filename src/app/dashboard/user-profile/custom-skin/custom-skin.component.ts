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
  isValidLabelColor= true;
  isValidButtonValueColor= true;
  isValidTitleColor= true;
  isValidBorderColor= true;
  isValidPageBackgroundColor= true; 
  isValidColorCode = true;
  isValidButtonColor = true;
  valueRange: number;
  backgroundColor :string;
  iconColor :string;
  textColor:string;
  buttonBackgroundColor:string;
  buttonValueColor:string;
  loggedInUserId:any;
  moduleStatusList: string[] =["LEFT_SIDE_MENU","TOP_NAVIGATION_BAR"];
  //moduleStatusString:string;
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
    this.form.companyId = this.referenceService.companyId
   this.dashboardService.saveCustomSkin(form).subscribe(
    (data:any)=> 
    console.log(data.data)
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
  } else if (type === "fontSize") {
      this.form.fontSize = colorCode;
      this.isValidLabelColor = true;
  } else if (type === "buttonColor") {
      this.form.buttonColor = colorCode;
      this.isValidButtonColor = true;
  } else if (type === "buttonValueColor") {
      this.form.buttonValueColor = colorCode;
      this.isValidButtonValueColor = true;
  } else if (type === "textColor") {
      this.form.textColor = colorCode;
      this.isValidTitleColor = true;
  } else if (type === "iconColor") {
      this.form.iconColor = colorCode;
      this.isValidBorderColor = true;
  } else if (type === "fontFamily") {
      this.form.fontFamily = colorCode;
      this.isValidPageBackgroundColor = true;
  } 
  this.checkValideColorCodes();
}
checkValideColorCodes(){
  if (this.isValidBackgroundColor && this.isValidLabelColor && this.isValidButtonColor && this.isValidButtonValueColor && this.isValidTitleColor) {
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
      this.isValidTitleColor = false;
  } else if (type === "iconColor") {
      this.form.iconColor = "";
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
          this.isValidLabelColor = true;
      } else if (type === "buttonColor") {
          this.buttonBackgroundColor = event;
          form.buttonColor = event
          this.isValidButtonColor = true;
      } else if (type === "buttonValueColor") {
          this.buttonValueColor = event;
          form.buttonValueColor = event;
          this.isValidButtonValueColor = true;
      } else if (type === "textColor") {
          this.textColor = event;
          form.textColor = event;
          this.isValidTitleColor = true;
      } 
  } catch (error) { console.log(error); }
  this.checkValideColorCodes();
}


}
