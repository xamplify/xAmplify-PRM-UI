import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { IntegrationService } from 'app/core/services/integration.service';

@Component({
  selector: 'app-integration-settings',
  templateUrl: './integration-settings.component.html',
  styleUrls: ['./integration-settings.component.css']
})
export class IntegrationSettingsComponent implements OnInit {

  @Input() loggedInUserId: any;
  @Output() closeEvent = new EventEmitter<any>();
  customResponse: CustomResponse = new CustomResponse(); 
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();  
  loading: boolean = false;


  constructor(private integrationService: IntegrationService) { }

  ngOnInit() {
    this.checkAuthorization(); 
  }

  checkAuthorization() {
    this.loading = true;
    this.integrationService.checkConfigurationByType("hubspot").subscribe(data => {
      this.loading = false;
			let response = data;      
			if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
				
			}
		}, error => {
      this.loading = false;
		}, () => {}
    );
  }

}
