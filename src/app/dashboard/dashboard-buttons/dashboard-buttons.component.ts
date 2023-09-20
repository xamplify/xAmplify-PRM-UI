import { Component, OnInit } from '@angular/core';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DashboardButton } from 'app/vanity-url/models/dashboard.button';
import { Pagination } from 'app/core/models/pagination';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { ReferenceService } from 'app/core/services/reference.service';
import { PagerService } from 'app/core/services/pager.service';

declare var swal: any;

@Component({
  selector: 'app-dashboard-buttons',
  templateUrl: './dashboard-buttons.component.html',
  styleUrls: ['./dashboard-buttons.component.css'],
  providers: [Properties, HttpRequestLoader]
})
export class DashboardButtonsComponent implements OnInit {
  customResponse: CustomResponse = new CustomResponse();
  dashboardButton: DashboardButton = new DashboardButton();
  pagination: Pagination = new Pagination();
  dashboardButtonList: Array<DashboardButton> = new Array<DashboardButton>();
  buttonActionType: boolean;
  iconNamesFilePath: string;
  iconsList: any = [];
  selectedProtocol: string;
  saving = false;
  constructor(private vanityURLService: VanityURLService, private authenticationService: AuthenticationService, private xtremandLogger: XtremandLogger, private properties: Properties, private httpRequestLoader: HttpRequestLoader, private referenceService: ReferenceService, private pagerService: PagerService) {
    this.iconNamesFilePath = 'assets/config-files/dashboard-button-icons.json';
    this.vanityURLService.getDashboardButtonIcons(this.iconNamesFilePath).subscribe(result => {
      this.iconsList = result.icon_names;
    }, error => {
      console.log(error);
    });
  }

  ngOnInit() {
    this.buttonActionType = true;
    this.selectedProtocol = 'http';
    this.getDashboardButtons(this.pagination);
  }

  getDashboardButtons(pagination: Pagination) {
    if (this.authenticationService.vanityURLEnabled) {
      this.referenceService.loading(this.httpRequestLoader, true);
      pagination.userId = this.authenticationService.getUserId();
      pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityURLService.getDashboardButtons(pagination).subscribe(result => {
        const data = result.data;
        if (result.statusCode === 200) {
          pagination.totalRecords = data.totalRecords;
          this.dashboardButtonList = data.dbButtons;
          pagination = this.pagerService.getPagedItems(pagination, this.dashboardButtonList);
        }
        this.dashboardButton = new DashboardButton();
        this.buttonActionType = true;
        this.referenceService.loading(this.httpRequestLoader, false);
      });
    }
  }

  save() {
    this.saving = true;
    this.dashboardButton.vendorId = this.authenticationService.getUserId();
    this.dashboardButton.companyProfileName = this.authenticationService.companyProfileName;
    this.vanityURLService.saveDashboardButton(this.dashboardButton).subscribe(result => {
      this.saving = false;
      if (result.statusCode === 200) {
        this.customResponse = new CustomResponse('SUCCESS', this.properties.VANITY_URL_DB_BUTTON_SUCCESS_TEXT, true);
        this.getDashboardButtons(this.pagination);
      } else if (result.statusCode === 100) {
        this.customResponse = new CustomResponse('ERROR', this.properties.VANITY_URL_DB_BUTTON_TITLE_ERROR_TEXT, true);
      }
      this.referenceService.goToTop();
    }, error => {
      this.customResponse = new CustomResponse('ERROR', "Error while saving dashboard button", true)
      this.referenceService.goToTop();
      this.saving = false;
    });
  }

  edit(id: number) {
    this.buttonActionType = false;
    this.referenceService.goToTop();
    const dbButtonObj = this.dashboardButtonList.filter(dbButton => dbButton.id === id)[0];
    this.dashboardButton = JSON.parse(JSON.stringify(dbButtonObj));
  }

  update(id: number) {
    this.vanityURLService.updateDashboardButton(this.dashboardButton).subscribe(result => {
      if (result.statusCode === 200) {
        console.log("Updated");
        this.customResponse = new CustomResponse('SUCCESS', this.properties.VANITY_URL_DB_BUTTON_UPDATE_TEXT, true);
        this.getDashboardButtons(this.pagination);
      }
      else if (result.statusCode === 100) {
        this.customResponse = new CustomResponse('ERROR', this.properties.VANITY_URL_DB_BUTTON_TITLE_ERROR_TEXT, true);
      }
      this.referenceService.goToTop();
    }, error => {
      this.customResponse = new CustomResponse('ERROR', "Error while updating dashboard button", true)
      this.referenceService.goToTop();
    });
  }

  delete(id: number) {
    this.vanityURLService.deleteDashboardButton(id).subscribe(result => {
      if (result.statusCode === 200) {
        this.customResponse = new CustomResponse('SUCCESS', this.properties.VANITY_URL_DB_BUTTON_DELETE_TEXT, true);
        if (this.pagination.pageIndex === this.pagination.pager.totalPages && this.pagination.pagedItems.length === 1) {
          this.pagination.pageIndex = 1;
        }
        this.getDashboardButtons(this.pagination);
        this.referenceService.goToTop();
      }
    }, error => {
      this.customResponse = new CustomResponse('ERROR', "Error while deleting dashboard button", true)
      this.referenceService.goToTop();
    });
  }

  cancel() {
    this.dashboardButton = new DashboardButton();
    this.buttonActionType = true;
  }

  showAlert(dashboardButtonId: number) {
    try {
      let self = this;
      swal({
        title: 'Are you sure?',
        text: "You won't be able to undo this action!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#54a7e9',
        cancelButtonColor: '#999',
        confirmButtonText: 'Yes, delete it!'

      }).then(function (myData: any) {
        self.delete(dashboardButtonId);
      }, function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
    } catch (error) {
      this.xtremandLogger.error(error, "DashboardButtonsComponent", "delete()");
    }
  }

  /************Page************** */
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getDashboardButtons(this.pagination);
  }

  selectedIconName() {
    
  }

  selectedProtocolOption(selectedProtocolOption: string) {
    this.selectedProtocol = selectedProtocolOption;
  }
}
