import { Component, OnInit,Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { Router } from '@angular/router';
import { Properties } from '../../common/models/properties';
import { SubmittedFormData } from '../../forms/models/submitted-form-data';
import { MdfService } from '../services/mdf.service';
import { CustomResponse } from 'app/common/models/custom-response';


declare var $: any, swal: any;


@Component({
  selector: 'app-manage-mdf-request-form',
  templateUrl: './manage-mdf-request-form.component.html',
  styleUrls: ['./manage-mdf-request-form.component.css','../mdf-html/mdf-html.component.css'],
  providers: [Pagination, HttpRequestLoader,Properties]
})
export class ManageMdfRequestFormComponent implements OnInit {

  loggedInUserId: number = 0;
  pagination:Pagination = new Pagination();
  columns: Array<any> = new Array<any>();
  formDataRows: Array<SubmittedFormData> = new Array<SubmittedFormData>();
  searchKey:string = "";
  @Input() vendorCompanyId:number;
  @Input() partnerView:boolean;
  @Input() partnershipId:number;
  formName: string="";
  statusCode:number = 0; 
  customResponse:CustomResponse = new CustomResponse();
  constructor(public referenceService: ReferenceService, private route: ActivatedRoute,
    public authenticationService: AuthenticationService,private mdfService:MdfService,
    public httpRequestLoader: HttpRequestLoader, public pagerService: PagerService, public router: Router,
    public logger: XtremandLogger,public properties:Properties) { }

  ngOnInit() {
    this.customResponse = new CustomResponse();
    this.loggedInUserId = this.authenticationService.getUserId();
    this.pagination.userId = this.loggedInUserId;
    this.pagination.vendorCompanyId = this.vendorCompanyId;
    this.pagination.partnerView = this.partnerView;
    this.pagination.partnershipId = this.partnershipId;
    this.listSubmittedData(this.pagination);
  }

  listSubmittedData( pagination: Pagination ) {
    pagination.searchKey = this.searchKey;
    this.referenceService.loading( this.httpRequestLoader, true );
    this.mdfService.getMdfFormAnalytics( pagination).subscribe(
        ( response: any ) => {
            this.statusCode = response.statusCode;
            if(response.statusCode==200){
                const data = response.data;
                this.columns = data.columns;
                this.formDataRows = data.submittedData;
                this.formName = data.formName;
                pagination.totalRecords = data.totalRecords;
                pagination = this.pagerService.getPagedItems( pagination, this.formDataRows );
            }else{
                this.customResponse = new CustomResponse('ERROR','Default MDF Form Not Found',true);
            }
            this.referenceService.loading( this.httpRequestLoader, false );
        },
        ( error: any ) => { this.logger.errorPage( error ); } );
}
search() {
    this.pagination.pageIndex = 1;
    this.listSubmittedData( this.pagination );
}


eventHandler( keyCode: any ) { if ( keyCode === 13 ) { this.search(); } }

refreshList() {
    this.pagination.searchKey = "";
    this.listSubmittedData( this.pagination );
}
/************Page************** */
setPage( event: any ) {
    this.pagination.pageIndex = event.page;
    this.listSubmittedData( this.pagination );
}

expandColumns( selectedFormDataRow: any, selectedIndex: number ) {
    $.each( this.formDataRows, function( index, row ) {
        if ( selectedIndex != index ) {
            row.expanded = false;
            $( '#form-data-row-' + index ).css( "background-color", "#fff" );
        }
    } );
    selectedFormDataRow.expanded = !selectedFormDataRow.expanded;
    if ( selectedFormDataRow.expanded ) {
        $( '#form-data-row-' + selectedIndex ).css( "background-color", "#d3d3d357" );
    } else {
        $( '#form-data-row-' + selectedIndex ).css( "background-color", "#fff" );
    }

}

}
