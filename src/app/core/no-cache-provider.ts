import { Injectable } from '@angular/core';
import { HttpRequest,HttpHandler,HttpInterceptor } from '@angular/common/http';
@Injectable()
export class NoCacheHeadersInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
       console.log("Cache Cleared");
        const authReq = req.clone({
            setHeaders: {
                'Cache-Control': 'no-cache',
                 Pragma: 'no-cache'
            }
        });
        return next.handle(authReq);    
    }
}