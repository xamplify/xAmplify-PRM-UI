import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReferenceService } from "app/core/services/reference.service";
import { TracksPlayBookType } from '../../tracks-play-book-util/models/tracks-play-book-type.enum'
import {AuthenticationService} from 'app/core/services/authentication.service';
@Component({
  selector: 'app-lms-partner-analytics',
  templateUrl: './lms-partner-analytics.component.html',
  styleUrls: ['./lms-partner-analytics.component.css']
})
export class LmsPartnerAnalyticsComponent implements OnInit {

  analyticsRouter: string;
  type:string = TracksPlayBookType[TracksPlayBookType.TRACK];

  constructor(public referenceService: ReferenceService, public router: Router,public authenticationService:AuthenticationService) {
  }

  ngOnInit() {
  }

  updateAnalyticsRouter(analyticsRouter: string){
    this.analyticsRouter = analyticsRouter;
  }

  routeToAnalytics(){
    this.router.navigate([this.analyticsRouter]);
  }
}