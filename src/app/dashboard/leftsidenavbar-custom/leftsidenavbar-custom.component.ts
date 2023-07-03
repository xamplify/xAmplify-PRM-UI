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
  public menuItems: Array<any> = [];
  data: any;
  ngxloading: boolean;
  menuItems1: any;
  constructor(public authenticationService: AuthenticationService, public utilService: UtilService, private dashBoardService: DashboardService, public referenceService: ReferenceService
    , private dragulaService: DragulaService) {
    dragulaService.setOptions('leftSideMenuDragula', { removeOnSpill: true })
  }



  ngOnInit() {
    this.ngxloading = true;
    this.getMenuItems();
  }

  ngOnDestroy() {
    this.dragulaService.destroy('leftSideMenuDragula');
  }

  getMenuItems() {
    this.ngxloading = true;
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
          if (data.statusCode == 200) {
            this.ngxloading = false;
            this.menuItems = data.data;
          }
        },
        error => console.log(error),
        () => console.log('finished'));
  }

  updateMenuItems() {
    this.ngxloading = true;
    let customleftmenu = {};
    customleftmenu['userId'] = this.authenticationService.getUserId();
    customleftmenu['menuItems'] = this.menuItems;
    this.dashBoardService.updateLeftSideNavBarItems(customleftmenu)
      .subscribe(
        data => {
          if (data.statusCode == 200) {
            this.ngxloading = false;
            this.referenceService.showSweetAlertSuccessMessage(data.message);
            this.menuItems1 = data;
          }
        },
        error => console.log(error),
        () => console.log('finished '));
  }

}
