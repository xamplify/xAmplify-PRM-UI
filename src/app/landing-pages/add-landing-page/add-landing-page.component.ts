import { Component, OnInit,ViewChild } from '@angular/core';
import { CustomResponse } from '../../common/models/custom-response';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
/*************Landing Page***************/
import { LandingPageService } from '../services/landing-page.service';
declare var swal, $: any;
@Component({
  selector: 'app-add-landing-page',
  templateUrl: './add-landing-page.component.html',
  styleUrls: ['./add-landing-page.component.css'],
  providers: [Pagination, HttpRequestLoader],
})
export class AddLandingPageComponent implements OnInit {
    ngxloading = false;
    pagination: Pagination = new Pagination();
    searchKey = "";
  constructor( public referenceService: ReferenceService,
          public httpRequestLoader: HttpRequestLoader, public pagerService:
              PagerService, public authenticationService: AuthenticationService,
          public router: Router,public logger: XtremandLogger,
          private landingPageService:LandingPageService) { }

  ngOnInit() {
      this.listLandingPages(this.pagination);
  }
  
  listLandingPages( pagination: Pagination ) {
      this.referenceService.loading( this.httpRequestLoader, true );
      this.landingPageService.list( pagination ).subscribe(
          ( response: any ) => {
              let data = response.data;
              if(response.statusCode==200){
                  pagination.totalRecords = data.totalRecords;
                  pagination = this.pagerService.getPagedItems( pagination, data.landingPages );
              }
              this.referenceService.loading( this.httpRequestLoader, false );
          },
          ( error: any ) => { this.logger.errorPage( error ); } );
  }
  eventHandler( keyCode: any ) { if ( keyCode === 13 ) { this.searchLandingPages(); } }

  searchLandingPages() {
      this.pagination.pageIndex = 1;
      this.pagination.searchKey = this.searchKey;
      this.listLandingPages(this.pagination);
  }
  
  showLandingPage(id:number){
      this.referenceService.loading( this.httpRequestLoader, true );
      this.landingPageService.getById(id).subscribe(
              ( response: any ) => {
                  if(response.statusCode==200){
                     alert(response.message);
                  }else{
                      swal("Please Contact Admin!", "No Landing Page Found", "error");
                  }
                  this.referenceService.loading( this.httpRequestLoader, false );
              },
              ( error: any ) => { this.logger.errorPage( error ); } );
  }
  
}
