import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { ReferenceService } from '../../core/services/reference.service';
import { Properties } from '../../common/models/properties';
import {ContactService} from "app/contacts/services/contact.service"
declare var $: any, swal: any;

@Component({
  selector: 'app-preview-user-list',
  templateUrl: './preview-user-list.component.html',
  styleUrls: ['./preview-user-list.component.css'],
  providers: [HttpRequestLoader, Properties]

})
export class PreviewUserListComponent implements OnInit,OnDestroy {
 
  @Input()userListName:string;
  @Input() userListId:number;
  @Input() customWidth:boolean;
  @Input() moduleName:string = "";
  @Input() inputId:number = 0;
  @Output() notifyParentComponent = new EventEmitter();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  pagination:Pagination = new Pagination();
  customResponse:CustomResponse = new CustomResponse();
  publishedPartnerIds:Array<Number> = new Array<Number>();
  @Input() vendorJourney:boolean = false;
  @Input() selectedPartnerGroupPartnerIdAndPartnerStatus:any[] = [];
  constructor(public referenceService:ReferenceService,public contactService:ContactService,public properties:Properties,
    public pagerService:PagerService,private authenticationService:AuthenticationService) { }

  ngOnInit() {
    $('#userListUsersPreviewPopup').modal('show');
    if(this.userListId!=undefined && this.userListId>0){
      let isValidInputId = this.inputId!=undefined && this.inputId>0;
      let isAssets = this.moduleName=="dam";
      let isLms = this.moduleName=="lms";
      let isDashboardButtons = this.moduleName = this.properties.dashboardButtons;
      let isModuleMatched = isAssets || isLms || isDashboardButtons;
      if(isModuleMatched && isValidInputId){
        this.findPublishedPartnerIdsByUserListIdAndId();
      } else{
        this.findUsersByUserListId(this.pagination);
      }
      
    }else{
      this.referenceService.showSweetAlertErrorMessage('Invalid UserListId');
      this.closePopup();
    }
    
  }

  findPublishedPartnerIdsByUserListIdAndId(){
    this.referenceService.startLoader(this.httpRequestLoader);
    this.authenticationService.findPublishedPartnerIdsByUserListIdAndModuleId(this.userListId,this.inputId,this.moduleName)
    .subscribe(
      response=>{
        this.publishedPartnerIds = response.data;
      },error=>{
        this.findUsersByUserListId(this.pagination);
      },()=>{
        this.findUsersByUserListId(this.pagination);
      }
      );
  }

  ngOnDestroy(): void {
    this.closePopup();
  }


  navigateUsers(event:any){
    this.referenceService.scrollToModalBodyTopByClass();
    this.pagination.pageIndex = event.page;
    this.findUsersByUserListId(this.pagination);
  }

  findUsersByUserListId(pagination:Pagination){
    this.customResponse = new CustomResponse();
    this.referenceService.startLoader(this.httpRequestLoader);
    pagination.userListId = this.userListId;
    this.contactService.findUsersByUserListId(pagination).subscribe(
        response=>{
          pagination.totalRecords = response.data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, response.data.list);
          this.referenceService.stopLoader(this.httpRequestLoader);
        },_error=>{
          this.referenceService.stopLoader(this.httpRequestLoader);
          this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
        }
    );

  }

  closePopup(){
    $('#userListUsersPreviewPopup').modal('hide');
    this.notifyParentComponent.emit();
  }
  
  getUserStatus(userId: number) {
    let status = "N/A";
   if (this.selectedPartnerGroupPartnerIdAndPartnerStatus.some(e => e.partnerId ===  userId)) {
     status = this.selectedPartnerGroupPartnerIdAndPartnerStatus.filter(e => e.partnerId === userId)[0].status;
   } 
   return status;
 }

 searchPartners(){
  this.pagination.pageIndex = 1;
  this.findUsersByUserListId(this.pagination);

 }
}
