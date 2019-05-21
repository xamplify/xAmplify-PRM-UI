import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import {FormService} from '../services/form.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';


@Component({
  selector: 'app-form-analytics',
  templateUrl: './form-analytics.component.html',
  styleUrls: ['./form-analytics.component.css'],
  providers: [Pagination, HttpRequestLoader]
})
export class FormAnalyticsComponent implements OnInit {

    alias:string="";
    pagination: Pagination = new Pagination();
    columns:Array<any> = new Array<any>();
    statusCode:number = 200;
    constructor( public referenceService: ReferenceService, private route: ActivatedRoute,
        public authenticationService: AuthenticationService,public formService:FormService, 
        public httpRequestLoader: HttpRequestLoader, public pagerService: PagerService,
        public logger: XtremandLogger
           ) { }

    ngOnInit() {
        this.alias = this.route.snapshot.params['alias'];
        this.listSubmittedData(this.pagination);
    }
    
    listSubmittedData( pagination: Pagination) {
       // pagination.searchKey = this.searchKey;
        this.referenceService.loading( this.httpRequestLoader, true );
        this.formService.getSubmittedFormData( pagination,this.alias ).subscribe(
            ( response: any ) => {
                const data = response.data;
                this.statusCode = response.statusCode;
                if(response.statusCode==200){
                    this.columns = data.columns;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.submittedData);
                }
                this.referenceService.loading( this.httpRequestLoader, false );
            },
            ( error: any ) => { this.logger.errorPage( error ); } );
    }
    
    refreshList(){
        this.listSubmittedData(this.pagination);
    }
    
   
    
    /************Page************** */
    setPage( event: any ) {
        this.pagination.pageIndex = event.page;
        this.listSubmittedData(this.pagination);
    }

}
