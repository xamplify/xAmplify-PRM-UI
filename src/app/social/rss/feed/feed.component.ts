import { Component, OnInit, Input } from '@angular/core';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser'
import { Http} from '@angular/http';
declare var $: any;
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
@Input('feed') feed: any;
link: any;
  constructor(public sanitizer: DomSanitizer, private http: Http) { 
  }

  ngOnInit() {
        
  }

  openModal(link: string){
    this.link = this.sanitizer.bypassSecurityTrustResourceUrl(link) ;
    $('#exampleModal').modal('show');
  }

}
