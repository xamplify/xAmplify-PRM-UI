import { Component, EventEmitter, Input, OnInit, Output, Renderer } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomResponse } from 'app/common/models/custom-response';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Form } from 'app/forms/models/form';
import { FormService } from 'app/forms/services/form.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { ModulesDisplayType } from '../models/modules-display-type';
declare var $: any;

@Component({
  selector: 'app-vendor-journey-analytics',
  templateUrl: './vendor-journey-analytics.component.html',
  styleUrls: ['./vendor-journey-analytics.component.css']
})
export class VendorJourneyAnalyticsComponent implements OnInit {

  form: Form = new Form();
  pagination: Pagination = new Pagination();
  loggedInUserId = 0;
  customResponse: CustomResponse = new CustomResponse();
  
  message = "";
  landingPageId = 0;
  landingPageCampaignId = 0;
  partnerLandingPageAlias = "";
  partnerId = 0;
  statusCode = 200;
  deleteAndEditAccess = false;

  categoryId: number = 0;
  showFolderView = true;

  formAliasUrl:string="";
  iframeEmbedUrl: string = "";

  exportObject:any = {};
  modulesDisplayType = new ModulesDisplayType();
  selectedFormTypeIndex = 0;

  surveyCampaignId = 0;
  selectedFormSubmitId = 0;
  detailedResponse: boolean = false;
  mergeTagForGuide:any;
  roleName:string = "";
  partnerView = false;
  formData:any[] =[];
  /** XNFR-522 **/
  @Input() isVendorJourney:boolean = false;
  @Input() isMasterLandingPages:boolean = false;
  @Input() vendorLandingPageId:number;
  @Output() vendorJourneyOrMasterLandingPageEdit: EventEmitter<any> = new EventEmitter();
  @Output() formAnalytics: EventEmitter<any> = new EventEmitter();

  constructor(public referenceService: ReferenceService,
      public httpRequestLoader: HttpRequestLoader, public pagerService:
          PagerService, public authenticationService: AuthenticationService,
      public router: Router, public formService: FormService, public logger: XtremandLogger,
      public sortOption: SortOption, private utilService: UtilService, private route: ActivatedRoute, 
      public renderer: Renderer,private vanityUrlService:VanityURLService) {
      this.referenceService.renderer = this.renderer;
      this.pagination.vanityUrlFilter =this.vanityUrlService.isVanityURLEnabled();
      this.categoryId = this.route.snapshot.params['categoryId'];
      this.partnerView = this.router.url.indexOf('/partner')>-1;
      if(this.router.url.indexOf('/manage')>-1){
          this.showFolderView = true;
      }else{
          this.showFolderView = false;
      }
      this.loggedInUserId = this.authenticationService.getUserId();
      this.pagination.userId = this.loggedInUserId;
    
      this.modulesDisplayType = this.referenceService.setDefaultDisplayType(this.modulesDisplayType);
  }

  ngOnInit() {
      this.selectedFormTypeIndex = 0;
      this.pagination.filterKey = "All";
      if(this.isVendorJourney || this.isMasterLandingPages){
          this.landingPageId = this.vendorLandingPageId;
          this.pagination.landingPageId = this.landingPageId;
          this.pagination.landingPageForm = true;
          this.pagination.vendorJourney = this.isVendorJourney;
          this.pagination.masterLandingPage = this.isMasterLandingPages;
          if(!this.modulesDisplayType.isListView && !this.modulesDisplayType.isGridView){
              this.modulesDisplayType.isListView = true;
              this.modulesDisplayType.isGridView = false;
          }
          this.modulesDisplayType.isFolderListView = false;
          this.modulesDisplayType.isFolderGridView = false;
          this.listForms(this.pagination);
      }
  }


  listForms(pagination: Pagination) {
      this.referenceService.loading(this.httpRequestLoader, true);
      if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
          this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
          this.pagination.vanityUrlFilter = true;
      }
      this.formService.listAllFormAnalyticsByLandingPageId(pagination).subscribe(
          (response: any) => {
              const data = response.data;
              this.statusCode = response.statusCode;
              if (this.statusCode == 200) {
                  this.setFormAnalyticsData(data)
              }
              this.referenceService.loading(this.httpRequestLoader, false);
          },
          (error: any) => {
              this.logger.errorPage(error);
          });
  }

  ngOnDestroy() {
      this.referenceService.isCreated = false;
      this.referenceService.isUpdated = false;
      this.message = "";
      this.form = new Form();
  }
  setFormAnalyticsData(data) {
    for(let form of  data){
      let importedObject ={};
      importedObject['formAlias'] = form.alias;
      importedObject['partnerLandingPageId'] = this.vendorLandingPageId;
      this.formData.push(importedObject);
    }
   }

}
