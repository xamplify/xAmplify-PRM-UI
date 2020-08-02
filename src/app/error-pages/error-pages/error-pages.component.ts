import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { XtremandLogger } from '../xtremand-logger.service';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-error-pages',
  templateUrl: './error-pages.component.html',
  styleUrls: ['./error-pages.component.css']
})
export class ErrorPagesComponent implements OnInit, OnDestroy {
  errorCode: any;
  private subscribe: any;
  errorMap = [
    { code: '400', message: 'Bad Request' },
    { code: '401', message: 'Unauthorized' },
    { code: '403', message: 'Forbidden' },
    { code: '404', message: 'Not Found' },
    { code: '405', message: 'Method Not Allowed' },
    { code: '500', message: "Oops! That wasn't supposed to happen" },
    { code: '502', message: 'Bad Gateway' },
    { code: '503', message: 'Service Unavailable' },
    { code: '504', message: 'Gateway Timeout' },
    { code: '0', message: 'ERR_INTERNET_DISCONNECTED' }
  ]
  constructor(public router: Router, private route: ActivatedRoute, public xtremandLogger: XtremandLogger, public referenceService:ReferenceService) { }

  ngOnInit() {
    this.subscribe = this.route.params.subscribe(params => {
      this.errorCode = +params['errorStatusId']; // (+) converts string 'id' to a number
    });

    if (this.errorCode === 503 || this.errorCode === 0 || this.errorCode==401) {
      this.router.navigate(['/su']);
    }
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
    this.xtremandLogger.errorMessage = '';
  }

}
