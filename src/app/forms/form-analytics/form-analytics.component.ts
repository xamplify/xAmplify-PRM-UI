import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import {FormService} from '../services/form.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import {SubmittedFormRow} from '../models/submitted-form-row';
import {SubmittedFormData} from '../models/submitted-form-data';
declare var $:any,swal:any ;



@Component({
  selector: 'app-form-analytics',
  templateUrl: './form-analytics.component.html',
  styleUrls: ['./form-analytics.component.css'],
  providers: [Pagination, HttpRequestLoader]
})
export class FormAnalyticsComponent implements OnInit {

    alias:string="";
    campaignAlias:string = "";
    formName = "";
    pagination: Pagination = new Pagination();
    columns:Array<any> = new Array<any>();
    formDataRows:Array<SubmittedFormData> = new Array<SubmittedFormData>();
    statusCode:number = 200;
    selectedSortedOption:any;
    searchKey = "";
    campaignForms = false;
    routerLink = "/home/forms/manage";
    constructor( public referenceService: ReferenceService, private route: ActivatedRoute,
        public authenticationService: AuthenticationService,public formService:FormService, 
        public httpRequestLoader: HttpRequestLoader, public pagerService: PagerService,
        public logger: XtremandLogger
           ) { }

    ngOnInit() {
        this.alias = this.route.snapshot.params['alias'];
        this.campaignAlias = this.route.snapshot.params['campaignAlias'];
        if(this.campaignAlias!=undefined){
            this.pagination.campaignId = parseInt(this.campaignAlias);
            this.campaignForms = true;
            this.routerLink = "/home/forms/cf/"+this.pagination.campaignId;
        }
        this.listSubmittedData(this.pagination);
    }
    
    listSubmittedData( pagination: Pagination) {
        pagination.searchKey = this.searchKey;
        this.referenceService.loading( this.httpRequestLoader, true );
        this.formService.getFormAnalytics( pagination,this.alias,false ).subscribe(
            ( response: any ) => {
                const data = response.data;
                this.statusCode = response.statusCode;
                if(response.statusCode==200){
                    this.formName = data.formName;
                    this.columns = data.columns;
                    this.selectedSortedOption = this.columns[0];
                    this.formDataRows = data.submittedData;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, this.formDataRows);
                }
                this.referenceService.loading( this.httpRequestLoader, false );
            },
            ( error: any ) => { this.logger.errorPage( error ); } );
    }
    search(){
        this.pagination.pageIndex = 1;
        this.listSubmittedData(this.pagination);
    }
    
    
    eventHandler( keyCode: any ) { if ( keyCode === 13 ) { this.search(); } }
    
    refreshList(){
        this.listSubmittedData(this.pagination);
    }
    /************Page************** */
    setPage( event: any ) {
        this.pagination.pageIndex = event.page;
        this.listSubmittedData(this.pagination);
    }
    
    expandColumns(selectedFormDataRow:any,selectedIndex:number){
       $.each(this.formDataRows,function(index,row){
           if(selectedIndex!=index){
               row.expanded = false;
               $('#form-data-row-'+index).css("background-color", "#fff");
           }
       });
       selectedFormDataRow.expanded = !selectedFormDataRow.expanded;
       if(selectedFormDataRow.expanded){
           $('#form-data-row-'+selectedIndex).css("background-color", "#d3d3d357");
       }else{
           $('#form-data-row-'+selectedIndex).css("background-color", "#fff");
       }

    }
    
    getSortedResult(text: any){
        console.log(text);
    }

}
