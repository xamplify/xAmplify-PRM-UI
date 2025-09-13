import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-xAmplify-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor() { 
      $('.mobile-camp').removeClass('mobile-camp');
  }

  ngOnInit() {
  }

}
