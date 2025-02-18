import { Component, OnInit } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { MyProfileService } from '../my-profile.service';
import { Properties } from 'app/common/models/properties';

@Component({
  selector: 'app-custom-dashboard-settings',
  templateUrl: './custom-dashboard-settings.component.html',
  styleUrls: ['./custom-dashboard-settings.component.css'],
  providers:[Properties]
})
export class CustomDashboardSettingsComponent implements OnInit {

  isLoading: boolean = true;
  isDashboardSettingsEnabled: boolean = false;
  customResponse: CustomResponse = new CustomResponse();
  constructor(private myProfileService: MyProfileService, private properties: Properties) { }

  ngOnInit() {
    this.findDefaultDashboardSettingsOption();
  }

  findDefaultDashboardSettingsOption() {
    this.myProfileService.findDefaultDashboardSettingsOption().subscribe(
      response => {
        this.isDashboardSettingsEnabled = response.data;
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      }
    );
  }

  customUiSwitchEventReceiver(event: any) {
    this.isDashboardSettingsEnabled = event;
  }

  updateDefaultDashboardSettingsOption() {
    this.customResponse = new CustomResponse();
    this.isLoading = true;
    this.myProfileService.updateDefaultDashboardSettingsOption(this.isDashboardSettingsEnabled).subscribe(
      response => {
        this.customResponse = new CustomResponse('SUCCESS', response.message, true);
        this.isLoading = false;
      }, error => {
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        this.isLoading = false;
      }
    );
  }

}
