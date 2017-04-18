import { Component, OnInit  } from '@angular/core';
import { Logger } from "angular2-logger/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    
    constructor(private logger: Logger){
        logger.level = logger.Level.LOG; 
         this.logger.log("AppComponent constructor");
    }
    ngOnInit() {
        this.logger.log("AppComponent initialized");
    }
}