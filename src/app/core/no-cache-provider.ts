import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class NoCacheHeadersInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authReq = request.clone({
            setHeaders: {
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache'
            }
        });
        return next.handle(authReq).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // do stuff with response if you want
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                let status = err.status;
                if (status == 0 && !this.router.url.includes('/login')) {
                    this.router.navigate(['/logout']);
                } else if (status == 401 && !this.router.url.includes('/login')) {
                    this.router.navigate(['/expired']);
                }
            }
        });
    }
}