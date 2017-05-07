import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers } from '@angular/http';
declare var $: any;

@Injectable()
export class HttpService extends Http {
  public pendingRequests: number = 0;
  public showLoading: boolean = false;

  constructor(backend: XHRBackend, defaultOptions: RequestOptions, private slimLoadingBarService: SlimLoadingBarService) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.request(url, options));
  }

  intercept(observable: Observable<Response>): Observable<Response> {
    console.log('In the intercept routine..');
    this.turnOnModal();
    console.log('slimLoadingBarService : ' + this.slimLoadingBarService.height + 'pendingRequests' + this.pendingRequests);
    this.pendingRequests++;
    return observable
      .do((res: Response) => {
        console.log('Response: ' + res);
      }, (err: any) => {
        console.log('Caught error: ' + err);
      })
      .finally(() => {
        this.turnOffModal();
      });
  }
  private turnOnModal() {
    if (!this.showLoading) {
      this.showLoading = true;
      this.slimLoadingBarService.start(() => {
        console.log('Loading complete');
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
        console.log('Turned off modal');
      }
      this.showLoading = false;
    }
  }
}
