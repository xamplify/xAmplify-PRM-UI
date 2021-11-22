import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReferenceService } from "app/core/services/reference.service";
import { TracksPlayBookType } from '../../tracks-play-book-util/models/tracks-play-book-type.enum'
import {AuthenticationService} from 'app/core/services/authentication.service';
@Component({
  selector: 'app-play-book-partner-analytics',
  templateUrl: './play-book-partner-analytics.component.html',
  styleUrls: ['./play-book-partner-analytics.component.css']
})
export class PlayBookPartnerAnalyticsComponent implements OnInit {

  analyticsRouter: string = "";
  type:string = TracksPlayBookType[TracksPlayBookType.PLAYBOOK];

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
