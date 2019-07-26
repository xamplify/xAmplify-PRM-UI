import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NavigationCancel, Event, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { EnvService } from 'app/env.service';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
declare var QuickSidebar, $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

    constructor(public env: EnvService, private slimLoadingBarService: SlimLoadingBarService, private router: Router) {
        // logger.level = logger.Level.LOG;
    }
    ngOnInit() {
        QuickSidebar.init();
        // reloading the same url with in the application
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
        this.router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
                this.router.navigated = false;
                window.scrollTo(0, 0);
            }
            this.navigationInterceptor(evt);
        });
    }
    private navigationInterceptor(event: Event): void {
      if (event instanceof NavigationStart) {  this.slimLoadingBarService.start(); }
      if (event instanceof NavigationEnd) { this.slimLoadingBarService.complete(); }
      // Set loading state to false in both of the below events to hide the loader in case a request fails
      if (event instanceof NavigationCancel) { this.slimLoadingBarService.stop(); }
      if (event instanceof NavigationError) { this.slimLoadingBarService.stop(); }
    }
    ngAfterViewInit(){  $('body').tooltip({ selector: '[data-toggle="tooltip"]' }); }
}
