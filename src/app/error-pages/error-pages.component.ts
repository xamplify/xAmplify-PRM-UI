import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error-pages',
  templateUrl: './error-pages.component.html',
  styleUrls: ['./error-pages.component.css']
})
export class ErrorPagesComponent implements OnInit, OnDestroy {
  errorCode: number;
  private subscribe: any;
  errorMap = [
                {code: '400', message: 'Bad Request'},
                {code: '401', message: 'Unauthorized'},
                {code: '403', message: 'Forbidden'},
                {code: '404', message: 'Not Found'},
                {code: '500', message: 'Internal Server Error'},
                {code: '502', message: 'Bad Gateway'},
                {code: '503', message: 'Service Unavailable'},
                {code: '504', message: 'Gateway Timeout'}
              ]
  constructor(public router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.subscribe = this.route.params.subscribe(params => {
      this.errorCode = +params['errorStatusId']; // (+) converts string 'id' to a number
    });
    
    if(this.errorCode == 503)
        this.router.navigate( ['/serviceunavailable'] );
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

}
