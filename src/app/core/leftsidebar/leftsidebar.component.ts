import { Component, OnInit } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

@Component({
  selector: 'app-leftsidebar',
  templateUrl: './leftsidebar.component.html',
  styleUrls: ['./leftsidebar.component.css']
})
export class LeftsidebarComponent implements OnInit {

    location: Location;
    baseRoute: string;
    constructor(location: Location) {
        this.location = location;
        let url = this.location.path();
        if( url.indexOf('dashboard') >= 0)
            this.baseRoute = "dashboard";
        else if( url.indexOf('videos') >= 0)
            this.baseRoute = "videos";
        else if( url.indexOf('contacts') >= 0)
            this.baseRoute = "contacts";
        else if( url.indexOf('emailtemplate') >= 0)
            this.baseRoute = "emailtemplate";
        else if( url.indexOf('campaigns') >= 0)
            this.baseRoute = "campaigns";
        else if( url.indexOf('team') >= 0)
            this.baseRoute = "team";
        else if( url.indexOf('upgrade') >= 0)
            this.baseRoute = "upgrade";
        
        console.log(url);
        console.log(this.baseRoute);
    }

  ngOnInit() {
  }

}
