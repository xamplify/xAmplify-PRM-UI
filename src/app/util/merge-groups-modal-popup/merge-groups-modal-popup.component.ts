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
  pagination:Pagination = new Pagination();

  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public properties:Properties,
    public utilService:UtilService,public logger:XtremandLogger) { }
  

  ngOnInit() {
    this.pagination.userListId = this.userListId;
  }

  findGroupsForMerging(pagination:Pagination){
    this.authenticationService.findGroupsForMerging(pagination).subscribe(
      response=>{
        alert(response.statusCode);
      },error=>{
        this.referenceService.showSweetAlertServerErrorMessage();
        this.callEmitter();
      });
  }

  callEmitter(){
    this.mergeGroupsModalPopupEventEmitter.emit();
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

}
