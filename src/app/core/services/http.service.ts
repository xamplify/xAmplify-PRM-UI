import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response } from '@angular/http';
import { Router } from '@angular/router';

declare var $: any;

@Injectable()
export class HttpService extends Http {
  public pendingRequests: number = 0;
  public showLoading: boolean = false;

  constructor(backend: XHRBackend, defaultOptions: RequestOptions, private slimLoadingBarService: SlimLoadingBarService,private router:Router) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.request(url, options));
  }

  intercept(observable: Observable<Response>): Observable<Response> {
    this.turnOnModal();
    this.pendingRequests++;
    return observable
      .do((res: Response) => {
        console.log("http service:"+res);
      }, (err: any) => {
        let status = err['status'];
        if(status==0 && !this.router.url.includes('/login') && !this.router.url.includes('https://pro.ip-api.com')){
          this.router.navigate(['/logout']);
        }else if(status==401 && !this.router.url.includes('/login') ){
          this.router.navigate(['/expired']);
        }

      })
      .finally(() => {
        this.turnOffModal();
      });
  }
  private turnOnModal() {
    if (!this.showLoading) {
      this.showLoading = true;
      this.slimLoadingBarService.start(() => {
      });
    }
    this.showLoading = true;
  }

  private turnOffModal() {
    this.pendingRequests--;
    this.slimLoadingBarService.progress++;
    if (this.pendingRequests <= 0) {
      if (this.showLoading) {
        this.slimLoadingBarService.complete();
      }
      this.showLoading = false;
    }
  }
}
