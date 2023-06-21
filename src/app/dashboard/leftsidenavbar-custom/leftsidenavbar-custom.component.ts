import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { UtilService } from 'app/core/services/util.service';
import { DashboardService } from '../dashboard.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-leftsidenavbar-custom',
  templateUrl: './leftsidenavbar-custom.component.html',
  styleUrls: ['./leftsidenavbar-custom.component.css']
})
export class LeftsidenavbarCustomComponent implements OnInit {
  public menuItems:Array<any> =  [];
  data: any;
  loading = false;
  constructor(public authenticationService: AuthenticationService,  public utilService: UtilService, private dashBoardService: DashboardService,  public referenceService: ReferenceService
    ,private dragulaService: DragulaService) {
      dragulaService.setOptions('leftSideMenuDragula', {removeOnSpill: true})		
     }
    
      

  ngOnInit() {
    this.getMenuItems();
  }

  ngOnDestroy() {
  this.dragulaService.destroy('leftSideMenuDragula');
  }

  getMenuItems(){
    this.loading = true;
    let module = this.authenticationService.module;
    module.contentLoader = true;
    let vanityUrlPostDto = {};
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      vanityUrlPostDto['vendorCompanyProfileName'] = this.authenticationService.companyProfileName;
      vanityUrlPostDto['vanityUrlFilter'] = true;
    }
    vanityUrlPostDto['userId'] = this.authenticationService.getUserId();
      vanityUrlPostDto['loginAsUserId'] = this.utilService.getLoggedInVendorAdminCompanyUserId();
      this.dashBoardService.getLeftSideNavBarItems(vanityUrlPostDto)
        .subscribe(
          data => {
            this.menuItems = data.data;
            console.log(data);
          },
          error => console.log(error),
          () => console.log('finished'));
    }
  
    updateMenuItems(){
    this.loading = true;
    let customleftmenu = {};
    customleftmenu['userId'] = this.authenticationService.getUserId();
    customleftmenu['menuItems'] = this.menuItems;
    this.dashBoardService.updateLeftSideNavBarItems(customleftmenu)
    .subscribe(
      data => {
        this.menuItems= data.data;
        console.log(data);
      },
      error => console.log(error),
      () => console.log('finished'));
  }

}
