import { Component, OnInit,Input } from '@angular/core';
import { Properties } from 'app/common/models/properties';
import { AnalyticsCountDto } from 'app/core/models/analytics-count-dto';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
@Component({
  selector: 'app-count-statistics',
  templateUrl: './count-statistics.component.html',
  styleUrls: ['./count-statistics.component.css'],
  providers: [Properties]
})
export class CountStatisticsComponent implements OnInit {

  loader = false;
  statusCode = 200;
  @Input() moduleName = "";
  analyticsCountDto:AnalyticsCountDto = new AnalyticsCountDto();
  constructor(public properties:Properties,public authenticationService:AuthenticationService,public referenceService:ReferenceService) { }

  ngOnInit() {
    this.loader = true;
    this.callApi();
  }

  callApi(){
  }



}
