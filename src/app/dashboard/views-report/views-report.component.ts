import { Component, OnInit } from '@angular/core';
import { Pagination } from '../../core/models/pagination';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { ReferenceService } from '../../core/services/reference.service';
import { Logger } from 'angular2-logger/core';
import { PagerService } from '../../core/services/pager.service';
import { VideoFileService} from '../../videos/services/video-file.service';
import { SaveVideoFile } from '../../videos/models/save-video-file';
import { AuthenticationService } from '../../core/services/authentication.service';



declare var Metronic, Layout, Demo, Index, QuickSidebar, Tasks: any;

@Component( {
    selector: 'app-views-report',
    templateUrl: './views-report.component.html',
    styleUrls: ['./views-report.component.css'],
providers: [ Pagination, HttpRequestLoader ]
})
export class ViewsReportComponent implements OnInit {
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
public totalRecords: number;
videos: Array<SaveVideoFile>;
imagepath: string;
public errorPrepender: 'Error In:';


    constructor(private videoFileService: VideoFileService,private referenceService: ReferenceService,
            private pagerService: PagerService, private logger: Logger, private pagination: Pagination,private authenticationService: AuthenticationService) {
        
    }

    loadVideos(pagination: Pagination) {
        this.pagination.maxResults = 12;
        try {
           this.referenceService.loading(this.httpRequestLoader, true);
           this.videoFileService.loadVideoFiles(pagination)
             .subscribe((result: any) => {
                 this.videos = result.listOfMobinars;
                 this.totalRecords = result.totalRecords;
                 pagination.totalRecords = this.totalRecords;
                 /*if (this.checkTotalRecords === true) {
                      this.allRecords = this.totalRecords;
                      this.checkTotalRecords = false;
                  }*/
                 /*if (this.isCategoryThere === false || this.isCategoryUpdated === true) {
                      this.categories = result.categories;
                      this.categories.sort(function(a: any, b: any) { return (a.id) - (b.id); });
                 }*/
                 this.referenceService.loading(this.httpRequestLoader, false);
                 //console.log(this.categories);
                 //console.log(this.videos);
                 /*if (this.videos.length !== 0) {
                     this.isvideoThere = false;
                  } else {
                      this.isvideoThere = true;
                      this.pagedItems = null ;
                  }
                 if (this.videos.length === 0) {
                      this.isvideosLength = true;
                  } else {
                      this.isvideosLength = false;
                       }*/
                 for (let i = 0; i < this.videos.length; i++) {
                     this.imagepath = this.videos[i].imagePath + '?access_token=' + this.authenticationService.access_token;
                     this.videos[i].imagePath = this.imagepath;
                 }
                // this.isCategoryThere = true;
                 //this.isCategoryUpdated = false;
                 pagination = this.pagerService.getPagedItems(pagination, this.videos);
             },
             (error: string) => {
               this.logger.error(this.errorPrepender + ' Loading Videos():' + error);
               this.referenceService.showServerError(this.httpRequestLoader);
             },
             () => console.log('load videos completed:' + this.videos ),
             );
         } catch (error) {
             this.logger.error('erro in load videos :' + error);
         }
     };
     setPage(page: number) {
     // if (page !== this.pagination.pageIndex) {
         this.pagination.pageIndex = page;
         this.loadVideos(this.pagination);
         //this.showUpdatevalue = false;
         //this.showMessage = false;
      //}
     }
     /*getCategoryNumber() {
         this.showMessage = false;
         this.showUpdatevalue = false;
         this.isvideoThere = false;
         console.log(this.categoryNum);
         this.pagination.filterBy = this.categoryNum;
         this.pagination.pageIndex = 1;
         this.loadVideos(this.pagination);
     }
     searchDisableValue() {
         console.log(this.searchKey);
         if (this.searchKey !== null || this.searchKey.length !== 0) {
         this.searchDisable = false; }
         if (this.searchKey.length === 0 || this.searchKey === '') {
             this.searchDisable = true; }
     }
     searchVideoTitelName() {
      // if ( this.searchKey !== null && this.searchDisable === false ){
         this.showMessage = false;
         this.showUpdatevalue = false;
         console.log(this.searchKey);
         this.pagination.searchKey = this.searchKey;
         this.pagination.pageIndex = 1;
         this.loadVideos(this.pagination);
      // }
     }
     selectedSortByValue( event: any ) {
         this.showMessage = false;
         this.showUpdatevalue = false;
         this.videoSort = event;
          const sortedValue = this.videoSort.value;
          if ( sortedValue !== '') {
              const options: string[] = sortedValue.split('-');
              this.sortcolumn = options[0];
              this.sortingOrder = options[1];
          }else {
              this.sortcolumn = null;
              this.sortingOrder = null;
          }
         this.pagination.pageIndex = 1;
         this.pagination.sortcolumn = this.sortcolumn ;
         this.pagination.sortingOrder = this.sortingOrder ;
         this.loadVideos(this.pagination);
     }
    */
    
    ngOnInit() {
        try {
            this.loadVideos(this.pagination);
            Metronic.init();
            Layout.init();
            Demo.init();
            QuickSidebar.init();
            Index.init();
            Index.initDashboardDaterange();
            Index.initJQVMAP();
            Index.initCalendar();
            Index.initCharts();
            Index.initChat();
            Index.initMiniCharts();
            Tasks.initDashboardWidget();
        }
        catch ( err ) {}
    }

}
