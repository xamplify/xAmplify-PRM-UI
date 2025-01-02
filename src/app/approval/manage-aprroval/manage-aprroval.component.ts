import { Component, OnInit } from '@angular/core';
import { Pagination } from 'app/core/models/pagination';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { ReferenceService } from 'app/core/services/reference.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ApproveService } from '../service/approve.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { UtilService } from 'app/core/services/util.service';

@Component({
  selector: 'app-manage-aprroval',
  templateUrl: './manage-aprroval.component.html',
  styleUrls: ['./manage-aprroval.component.css'],
  providers: [HttpRequestLoader,ApproveService]
})
export class ManageAprrovalComponent implements OnInit {

  pagination: Pagination = new Pagination();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();

  constructor(public authenticationService: AuthenticationService, public referenceService: ReferenceService,
    public approveService: ApproveService,public utilService: UtilService,public xtremandLogger: XtremandLogger
  ) { }

  ngOnInit() {
    this.getPendingApprovalDamAndLMS(this.pagination);
  }

  getPendingApprovalDamAndLMS(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.approveService.getPendingApprovalDamAndLMS(pagination).subscribe(
      response => {
        pagination = this.utilService.setPaginatedRows(response, pagination);
        this.referenceService.loading(this.httpRequestLoader, false);
      }, error => {
        this.xtremandLogger.errorPage(error);
      });
  }

  paginateList(event: any) {
    this.pagination.pageIndex = event.page;
    this.getPendingApprovalDamAndLMS(this.pagination);
  }

  getImageSrc(dam): any {
    switch (dam.type) {
      case 'Track':
        return 'assets/images/universal-search-images/universal-track.webp';
      case 'Play Book':
        return 'assets/images/universal-search-images/universal-playbook.webp';
      case 'Asset':
        return 'assets/images/universal-search-images/universal-asset.webp';
      default:
        return 'assets/images/universal-search-images/universal-asset.webp';
    }
  }

}
