import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { UtilService } from 'app/core/services/util.service';
import { DashboardService } from '../dashboard.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DragulaService } from 'ng2-dragula';
import { CustomResponse } from 'app/common/models/custom-response';
declare var swal : any;
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
  leftMenuCustomResponse: CustomResponse = new CustomResponse();
  constructor(public authenticationService: AuthenticationService, public utilService: UtilService, private dashBoardService: DashboardService, public referenceService: ReferenceService
    , private dragulaService: DragulaService) {
      dragulaService.setOptions('leftSideMenuDragula', {})
    dragulaService.dropModel.subscribe((value) => {
      this.onDropModel(value);
    });
  }
  private onDropModel(args) {
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

  updateLeftMenuItems(){
		let self = this;
		swal({
			title: 'Are you sure?',
			text: 'Clicking "Confirm" will change the Leftside menu and reload the entire application.',
			type: 'success',
			icon: "success",
			showCancelButton: true,
			swalConfirmButtonColor: '#54a7e9',
			swalCancelButtonColor: '#999',
			confirmButtonText: 'Confirm'

		}).then(function () {
			self.updateMenuItems();
		},function (dismiss: any) {
			console.log("you clicked showAlert cancel" + dismiss);
		});
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
            this.menuItems1 = data;
            window.location.reload();
            this.leftMenuCustomResponse = new CustomResponse('SUCCESS', data.message, true);
          }
        },
        error => console.log(error),
        () => console.log('finished '));
  }

}




