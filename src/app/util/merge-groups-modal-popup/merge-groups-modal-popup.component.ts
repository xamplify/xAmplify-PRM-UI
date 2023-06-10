import { Component, OnInit,Input,Output,EventEmitter,OnDestroy } from '@angular/core';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { SortOption } from '../../core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { CustomResponse } from 'app/common/models/custom-response';

declare var $: any, swal: any;
@Component({
  selector: 'app-merge-groups-modal-popup',
  templateUrl: './merge-groups-modal-popup.component.html',
  styleUrls: ['./merge-groups-modal-popup.component.css'],
  providers: [HttpRequestLoader, SortOption, Properties]
})
export class MergeGroupsModalPopupComponent implements OnInit,OnDestroy {

  @Input() userListId = 0;
  @Input() selectedUserIds = [];
  @Output() mergeGroupsModalPopupEventEmitter = new EventEmitter();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  customResponse: CustomResponse = new CustomResponse();
  pagination:Pagination = new Pagination();
  selectedGroupIds = [];
  copySuccess = false;
  responseMessage = "";
  responseImage = "";
  responseClass = "event-success";
  statusCode = 0;
  sortOption: SortOption = new SortOption();

  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public properties:Properties,
    public utilService:UtilService,public logger:XtremandLogger,public pagerService:PagerService) { }
  

  ngOnInit() {
    $('#mergeGroupsModalPopup').modal('show');
    this.referenceService.startLoader(this.httpRequestLoader);
    this.pagination.userListId = this.userListId;
    this.findGroupsForMerging(this.pagination);
  }

  findGroupsForMerging(pagination:Pagination){
    this.authenticationService.findGroupsForMerging(pagination).subscribe(
      response=>{
        const data = response.data;
        pagination.totalRecords = data.totalRecords;
        this.sortOption.totalRecords = data.totalRecords;
        pagination = this.pagerService.getPagedItems(pagination, data.list);
        this.referenceService.stopLoader(this.httpRequestLoader);
      },error=>{
        this.referenceService.showSweetAlertServerErrorMessage();
        this.callEmitter();
      });
  }

  copyToGroups(){

  }

  callEmitter(){
    this.mergeGroupsModalPopupEventEmitter.emit();
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  closePopup(){
    $('#mergeGroupsModalPopup').modal('hide');
  }

  searchGroups(){

  }

}
