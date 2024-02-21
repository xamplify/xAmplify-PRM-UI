import { Component, OnInit } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { CustomLinkDto } from 'app/vanity-url/models/custom-link-dto';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';

@Component({
  selector: 'app-news-and-announcement-and-instant-navigation-dashboard-analytics',
  templateUrl: './news-and-announcement-and-instant-navigation-dashboard-analytics.component.html',
  styleUrls: ['./news-and-announcement-and-instant-navigation-dashboard-analytics.component.css'],
  providers:[Properties]
})
export class NewsAndAnnouncementAndInstantNavigationDashboardAnalyticsComponent implements OnInit {
  isVanityUrlEnabled = false;
  isLoading = false;
  pagination:Pagination = new Pagination();
  customResponse:CustomResponse = new CustomResponse();
  properties:Properties = new Properties();
  customLinkDtos:Array<CustomLinkDto> = new Array<CustomLinkDto>();
  newsAndAnnouncementsSize = 0;
  instantNavigationLinksSize = 0;
  constructor(public authenticationService:AuthenticationService,private referenceService:ReferenceService,public vanityUrlService:VanityURLService) { }

  ngOnInit() {
    this.customResponse = new CustomResponse();
    this.isVanityUrlEnabled = this.authenticationService.vanityURLEnabled;
    if (this.isVanityUrlEnabled) {
      this.isLoading = true;
      this.pagination.pageIndex = 1;
      this.pagination.maxResults = 4;
      this.vanityUrlService.findCustomLinks(this.pagination).subscribe(
        response=>{
          this.customLinkDtos = response.data.list;
          this.newsAndAnnouncementsSize = response.data.totalRecords;
          this.isLoading = false;
        },error=>{
          this.isLoading = false;
          this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
        }
      )
    }
  }

}
