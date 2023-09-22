import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Pagination } from '../../core/models/pagination';
import { PaginationComponent } from '../../common/pagination/pagination.component';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { SocialPagerService } from '../../contacts/services/social-pager.service';
import { UtilService } from '../../core/services/util.service';
import { PagerService } from '../../core/services/pager.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';


@Component({
  selector: 'app-partners-journey-automation',
  templateUrl: './partners-journey-automation.component.html',
  styleUrls: ['./partners-journey-automation.component.css'],
  providers: [ SocialPagerService, PaginationComponent, PagerService ]
})
export class PartnersJourneyAutomationComponent implements OnInit {
  pagination: Pagination = new Pagination();
  pager: any = {};
  public searchKey: string;
  notifications = [];
  public httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loading = false;
  selectedTabIndex = 0;
  redistributedCampaignsCount = 0;
  checkingContactTypeName = "";
  constructor(private router: Router, public userService: UserService, public authenticationService: AuthenticationService,
    public referenceService:ReferenceService, public socialPagerService: SocialPagerService, public paginationComponent: PaginationComponent,
    public utilService: UtilService, public pagerService:PagerService) { }

  ngOnInit() {
    this.listNotifications(this.pagination);
  }
  goToWorkflow(){this.router.navigate(["/home/partners/partner-workflow"]);}
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.listNotifications(this.pagination);
}
listNotifications(pagination:Pagination) {
  try{
    this.referenceService.loading(this.httpRequestLoader, true);
    this.userService.listNotifications(this.authenticationService.getUserId())
        .subscribe(
        data => {
            this.notifications = data;
            pagination.totalRecords = this.notifications.length;
            pagination =this.pagerService.getPagedItems(pagination, data);
            this.pager = this.socialPagerService.getPager( this.notifications.length, this.pagination.pageIndex, this.pagination.maxResults );
            this.pagination.pagedItems = this.notifications.slice( this.pager.startIndex, this.pager.endIndex + 1 );
            this.referenceService.loading(this.httpRequestLoader, false);
        },
        error => console.log(error));
    }catch(error) {console.error('error'+error); }
}
goToAnalytics(){
  this.router.navigate(["/home/partners/individual-partner"]);
}

goToReDistributedPartnersDiv(){

}

goToThroughPartnersDiv(){

}
searchKeyValue(string){

}
eventHandler(keyCode,string){
  
}
search(string){

}


}
