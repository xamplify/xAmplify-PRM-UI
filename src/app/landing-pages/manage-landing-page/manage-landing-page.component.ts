import { Component, OnInit, OnDestroy,ViewChild,AfterViewInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { ActionsDescription } from '../../common/models/actions-description';
import { LandingPage } from '../models/landing-page';
import { UtilService } from '../../core/services/util.service';
import { environment } from '../../../environments/environment';
import { SortOption } from '../../core/models/sort-option';
import { LandingPageService } from '../services/landing-page.service';
import {PreviewLandingPageComponent} from '../preview-landing-page/preview-landing-page.component';
declare var swal:any, $: any;
@Component({
  selector: 'app-manage-landing-page',
  templateUrl: './manage-landing-page.component.html',
  styleUrls: ['./manage-landing-page.component.css'],
  providers: [Pagination, HttpRequestLoader,ActionsDescription,SortOption],
})
export class ManageLandingPageComponent implements OnInit, OnDestroy {

    landingPage: LandingPage = new LandingPage();
    ngxloading = false;
    pagination: Pagination = new Pagination();
    loggedInUserId = 0;
    customResponse: CustomResponse = new CustomResponse();
    copiedLinkCustomResponse: CustomResponse = new CustomResponse();
    isListView = false;
    private dom: Document;
    message = "";
    campaignId = 0;
    statusCode = 200;
    isPartnerLandingPage = false;
    landingPageAliasUrl:string = "";
    selectedLandingPageTypeIndex = 0;
    @ViewChild('previewLandingPageComponent') previewLandingPageComponent: PreviewLandingPageComponent;
    constructor( public referenceService: ReferenceService,
            public httpRequestLoader: HttpRequestLoader, public pagerService:
                PagerService, public authenticationService: AuthenticationService,
            public router: Router, public landingPageService: LandingPageService, public logger: XtremandLogger,
            public actionsDescription: ActionsDescription,public sortOption:SortOption,private utilService:UtilService,private route: ActivatedRoute) {
        this.loggedInUserId = this.authenticationService.getUserId();
        this.pagination.userId = this.loggedInUserId;
        if ( this.referenceService.isCreated ) {
            this.message = "Page created successfully";
            this.showMessageOnTop(this.message );
        } else if ( this.referenceService.isUpdated) {
            this.message = "Page updated successfully";
            this.showMessageOnTop( this.message );
        }
        
    }
    
    ngOnInit() {
        if(this.router.url.includes('home/pages/partner')){
            this.isPartnerLandingPage = true;
        }else{
            this.selectedLandingPageTypeIndex = 0;
            this.pagination.filterKey = "All";
            this.isPartnerLandingPage = false;
        }
        this.listLandingPages(this.pagination);
        
    }
    
    showAllLandingPages(type:string,index:number){
        this.selectedLandingPageTypeIndex = index;
        this.pagination.filterKey = type;
        this.listLandingPages(this.pagination);
    }
    
    
    
    listLandingPages( pagination: Pagination ) {
        this.referenceService.loading( this.httpRequestLoader, true );
        this.landingPageService.list( pagination,this.isPartnerLandingPage ).subscribe(
            ( response: any ) => {
                const data = response.data;
                this.statusCode = response.statusCode;
                if(this.statusCode==200){
                    pagination.totalRecords = data.totalRecords;
                    this.sortOption.totalRecords = data.totalRecords;
                    $.each(data.landingPages, function (index, landingPage) {
                        landingPage.displayTime = new Date(landingPage.createdDateInString);
                    });
                    pagination = this.pagerService.getPagedItems(pagination, data.landingPages);
                }
                console.log(data.landingPages);
                this.referenceService.loading( this.httpRequestLoader, false );
            
            },
            ( error: any ) => { this.logger.errorPage( error ); } );
    }
    

    /********************Pagaination&Search Code*****************/

    /*************************Sort********************** */
    sortBy( text: any ) {
        this.sortOption.formsSortOption = text;
        this.getAllFilteredResults( this.pagination );
    }


    /*************************Search********************** */
    searchLandingPages() {
        this.getAllFilteredResults( this.pagination );
    }
    
    paginationDropdown(items:any){
        this.sortOption.itemsSize = items;
        this.getAllFilteredResults(this.pagination);
    }

    /************Page************** */
    setPage( event: any ) {
        this.pagination.pageIndex = event.page;
        this.listLandingPages( this.pagination );
    }

    getAllFilteredResults( pagination: Pagination ) {
        this.pagination.pageIndex = 1;
        this.pagination.searchKey = this.sortOption.searchKey;
        this.pagination = this.utilService.sortOptionValues(this.sortOption.formsSortOption, this.pagination);
        this.listLandingPages( this.pagination );
    }
    eventHandler( keyCode: any ) { if ( keyCode === 13 ) { this.searchLandingPages(); } }
    /********************Pagaination&Search Code*****************/
    showMessageOnTop( message ) {
        $( window ).scrollTop( 0 );
        this.customResponse = new CustomResponse( 'SUCCESS', message, true );
    }
    
    /***********Preview Email Template*********************/
    showPreview( landingPage: LandingPage ) {
        if(this.isPartnerLandingPage){
            landingPage.showPartnerCompanyLogo = true;
            landingPage.partnerId = this.loggedInUserId;
            landingPage.partnerLandingPage = true;
            landingPage.alias = landingPage.alias;
        }else{
            landingPage.showYourPartnersLogo = true;
        }
        this.previewLandingPageComponent.showPreview(landingPage);
      }
    
    
    /***********Delete**************/
    confirmDelete(landingPage:LandingPage){
        try {
            let self = this;
            swal( {
                title: 'Are you sure?',
                text: "You won’t be able to undo this action!",
                type: 'warning',
                showCancelButton: true,
                swalConfirmButtonColor: '#54a7e9',
                swalCancelButtonColor: '#999',
                confirmButtonText: 'Yes, delete it!'

            }).then( function() {
                self.deleteById(landingPage);
            }, function( dismiss: any ) {
                console.log( 'you clicked on option' + dismiss );
            });
        } catch ( error ) {
            this.logger.error(this.referenceService.errorPrepender+" confirmDelete():"+error);
            this.referenceService.showServerError(this.httpRequestLoader);
        }
    }
    

    editLandingPage(id:number){
        this.landingPageService.id = id;
        this.router.navigate(["/home/pages/add"]);
      }
    
    deleteById(landingPage:LandingPage){
        this.referenceService.loading(this.httpRequestLoader, true);
        this.referenceService.goToTop();
        this.landingPageService.deletebById( landingPage.id )
        .subscribe(
        ( response: any ) => {
            if(response.statusCode==200){
                $('#landingPageListDiv_'+landingPage.id).remove();
                let message = landingPage.name+" deleted successfully";
                this.customResponse = new CustomResponse('SUCCESS',message,true );
                this.pagination.pageIndex = 1;
                this.listLandingPages(this.pagination);
            }else{
                let campaignNames = "";
                $.each(response.data,function(index,value){
                    campaignNames+= (index+1)+"."+value+"<br><br>";
                });
                let message = response.message+"<br><br>"+campaignNames;
                this.customResponse = new CustomResponse('ERROR',message,true );
                this.referenceService.loading(this.httpRequestLoader, false);
            }

        },
        ( error: string ) => {
            this.referenceService.showServerErrorMessage(this.httpRequestLoader);
            this.customResponse = new CustomResponse('ERROR',this.httpRequestLoader.message,true);
            }
        );
    }
    /*********Copy The Link */
    copyInputMessage(inputElement){
        this.copiedLinkCustomResponse = new CustomResponse();
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
        this.copiedLinkCustomResponse = new CustomResponse('SUCCESS','Copied to clipboard successfully.',true );  
      }

    showLandingPageLink(landingPage:LandingPage){
          this.landingPage = landingPage;
          this.copiedLinkCustomResponse = new CustomResponse();
          if(this.isPartnerLandingPage){
              this.landingPageAliasUrl = this.authenticationService.APP_URL+"pl/"+this.landingPage.alias;
          }else{
              this.landingPageAliasUrl = this.authenticationService.APP_URL+"l/"+this.landingPage.alias;
          }
          $('#landing-page-url-modal').modal('show');
      }

    goToFormAnalytics(id:number){
        this.router.navigate(['/home/forms/lf/'+id]);
    }
    goToPartnerLandingPageFormAnalytics(alias:string){
        this.router.navigate(['/home/forms/partner/lf/'+alias]);
    }
    goToLandingPageAnalytics(id:number){
        this.router.navigate(['/home/pages/'+id+'/analytics']);
    }
    goToPartnerLandingPageAnalytics(alias:string){
        this.router.navigate(['/home/pages/partner/'+alias+'/analytics']);
    }

    
    
    ngOnDestroy() {
        this.referenceService.isCreated = false;
        this.referenceService.isUpdated = false;
        this.message = "";
        this.landingPage = new LandingPage();
        swal.close();
    }

}
