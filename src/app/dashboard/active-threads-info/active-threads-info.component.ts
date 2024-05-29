import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { Properties } from '../../common/models/properties';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import * as XLSX from 'xlsx';
declare var $:any;
@Component({
  selector: 'app-active-threads-info',
  templateUrl: './active-threads-info.component.html',
  styleUrls: ['./active-threads-info.component.css',"../admin-report/admin-report.component.css"],
  providers: [HttpRequestLoader, Properties],
})
export class ActiveThreadsInfoComponent implements OnInit {

  activeThreads: Array<any> = new Array<any>();
  apiError = false;
  fileName = "Active-Threads.xlsx";
  loading = false;
  message = "";
  constructor(
    public dashboardService: DashboardService,
    public referenceService: ReferenceService,
    public httpRequestLoader: HttpRequestLoader,
    public authenticationService: AuthenticationService,
    public logger: XtremandLogger
  ) {}

  ngOnInit() {
    this.findActiveThreads();
  }

  findActiveThreads() {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.apiError = false;
    this.dashboardService.findActiveThreads().subscribe(
      (response) => {
        this.activeThreads = response.data;
        this.apiError = false;
        this.message = response.message;
        this.referenceService.loading(this.httpRequestLoader, false);
      },
      (error) => {
        this.referenceService.loading(this.httpRequestLoader, false);
        this.apiError = true;
      }
    );
  }

  exportexcel(): void {
    this.loading = true;
    /* pass here the table id */
    let element = document.getElementById("active-threads-table");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
    this.loading = false;
  }

  copyQueryText(inputElement:any,index:number){
    $(".success").hide();
    $('#copied-query-' + index).hide();
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    $('#copied-query-' + index).show(500);
  }
}

