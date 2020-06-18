import { Component, OnInit, OnDestroy, } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { CampaignService } from '../services/campaign.service';
import { UserService } from '../../core/services/user.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Campaign } from '../models/campaign';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { UtilService } from '../../core/services/util.service';
import { ActionsDescription } from '../../common/models/actions-description';
import { SortOption } from '../../core/models/sort-option';
declare var swal, $: any;

@Component({
  selector: 'app-preview-partners',
  templateUrl: './preview-partners.component.html',
  styleUrls: ['./preview-partners.component.css'],
  providers: [Pagination, HttpRequestLoader, ActionsDescription,SortOption]
})
export class PreviewPartnersComponent implements OnInit {

    loggedInUserId: number = 0;
    partnerActionResponse: CustomResponse = new CustomResponse();
    partnersPagination: Pagination = new Pagination();
    campaignPartnerLoader: HttpRequestLoader = new HttpRequestLoader();
    campaignId:number = 0;
    constructor(public route: ActivatedRoute,private campaignService: CampaignService, private router: Router, private logger: XtremandLogger,
        public pagination: Pagination, private pagerService: PagerService, public utilService: UtilService, public actionsDescription: ActionsDescription,
        public refService: ReferenceService, private userService: UserService, public authenticationService: AuthenticationService,public sortOption:SortOption) {
        this.loggedInUserId = this.authenticationService.getUserId();
    }


    listPartners(pagination: Pagination ) {
        this.partnerActionResponse = new CustomResponse();
        this.refService.loading( this.campaignPartnerLoader, true );
        this.campaignService.listCampaignPartners( pagination, this.campaignId)
            .subscribe(
            data => {
                pagination.totalRecords = data.totalRecords;
                this.sortOption.totalRecords = data.totalRecords;
                pagination = this.pagerService.getPagedItems( pagination, data.campaignPartners );
                this.refService.loading( this.campaignPartnerLoader, false );
            },
            error => {
                this.logger.errorPage( error );
            },
            () => this.logger.info( "Finished listPartners()")
            );
    }

    confirmDeletePartnerById( partner: any, position: number ) {

        let self = this;
        swal( {
            title: 'Are you sure?',
            text: "This will remove the partner(s) from your list and cannot be undone.",
            type: 'warning',
            showCancelButton: true,
            swalConfirmButtonColor: '#54a7e9',
            swalCancelButtonColor: '#999',
            confirmButtonText: 'Yes, delete it!'

        }).then( function() {
            self.deletePartner( partner, position );
        }, function( dismiss: any ) {
           
        });
    

    }

    deletePartner( partner: any, position: number ) {
        this.refService.loading( this.campaignPartnerLoader, true );
        partner['loggedInUserId'] = this.loggedInUserId;
        this.campaignService.deletePartner(partner)
            .subscribe(
          data => {
            	if(data.access){
            		  const deleteMessage = partner.emailId + '  deleted successfully';
                      this.partnerActionResponse = new CustomResponse( 'SUCCESS', deleteMessage, true );
                      this.listPartners(this.partnersPagination);
            }else{
            	 this.authenticationService.forceToLogout();           }
            },
            error => { 
                this.refService.loading( this.campaignPartnerLoader, false );
                this.partnerActionResponse = new CustomResponse( 'ERROR', this.refService.serverErrorMessage, true );
        },
            () => console.log( "Partner Deleted Successfully" )
            );
    }

    paginationDropdown(items:any){
        this.sortOption.itemsSize = items;
        this.getAllFilteredResults(this.partnersPagination);
    }

    getAllFilteredResults(pagination: Pagination) {
        pagination.pageIndex = 1;
        pagination.searchKey = this.sortOption.searchKey;
        if (this.sortOption.itemsSize.value == 0) {
            pagination.maxResults = pagination.totalRecords;
        } else {
            pagination.maxResults = this.sortOption.itemsSize.value;
        }
        let sortedValue = this.sortOption.campaignPartnersRemoveAccessDefaultSortOption.value;
        if (sortedValue != "") {
            let options: string[] = sortedValue.split("-");
            pagination.sortcolumn = options[0];
            pagination.sortingOrder = options[1];
        }
        this.listPartners(pagination);
    }

    setPage(event:any){
        this.partnersPagination.pageIndex = event.page;
        this.listPartners(this.partnersPagination);
    }

    sortBy(text:any){
        this.sortOption.campaignPartnersRemoveAccessDefaultSortOption = text;
        this.getAllFilteredResults(this.partnersPagination);
    }

    searchOnKeyPress(keyCode:any){if (keyCode === 13) {  this.search(); }}

    search(){
        this.getAllFilteredResults(this.partnersPagination);
    }
    ngOnInit() {
        this.campaignId = this.route.snapshot.params['campaignId'];
        this.listPartners(this.partnersPagination);
    }

}
