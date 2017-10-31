import { Component, OnInit } from '@angular/core';
import { Logger } from 'angular2-logger/core';
import { Router, NavigationEnd } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(private logger: Logger, private slimLoadingBarService: SlimLoadingBarService, private router: Router) {
        logger.level = logger.Level.LOG;
        this.logger.log('AppComponent constructor');
    }
    ngOnInit() {
        this.logger.log('AppComponent initialized');
        // reloading the same url with in the application
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
        this.router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
                this.router.navigated = false;
                window.scrollTo(0, 0);
            }
        });
    }
}