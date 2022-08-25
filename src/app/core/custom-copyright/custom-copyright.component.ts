import { Component, OnInit } from '@angular/core';
import { Properties } from 'app/common/models/properties';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { CustomSkin } from 'app/dashboard/models/custom-skin';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-custom-copyright',
  templateUrl: './custom-copyright.component.html',
  styleUrls: ['./custom-copyright.component.css'],
  providers: [Properties]
})
export class CustomCopyrightComponent implements OnInit {

  loogedUserId:number;
  footerContent:string;
  apiCalled: boolean = false
  
  constructor(public dashboardService:DashboardService, public authService : AuthenticationService,
    public properties: Properties) { 
     this.loogedUserId = this.authService.getUserId();
    }

  ngOnInit() {
    this.getFooterSkin(this.loogedUserId)
  }
  readCustomMessage(){
    if (this.authService.v_companyName && this.skin.defaultSkin ) {
      this.properties.BOTTOM_MESSAGE = this.properties.COPY_RIGHT_PREFIX + ' ' + this.authService.v_companyName + '. All rights reserved. '
    }else{
      this.properties.BOTTOM_MESSAGE = this.properties.COPY_RIGHT_PREFIX + ' '+this.footerContent + '. All rights reserved.'
    }
  }
  skin:CustomSkin = new CustomSkin();
  getFooterSkin(userId:number){
    this.dashboardService.getTopNavigationBarCustomSkin(userId).subscribe(
      (data:any) => {
        let skinMap = data.data;
        this.skin = skinMap.FOOTER;
        this.footerContent = this.skin.textContent;
        this.readCustomMessage();
      }
    )
  }

}
