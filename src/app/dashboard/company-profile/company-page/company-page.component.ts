import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-page',
  templateUrl: './company-page.component.html',
  styleUrls: ['./company-page.component.css']
})
export class CompanyPageComponent implements OnInit {
    videos = [
              {id:1,video:'videoTitle one'},{id:1,video:'videos1'},{id:1,video:'videos1'},{id:1,video:'videos1'},{id:1,video:'videos1'},
              {id:1,video:'videos1'},{id:1,video:'videos1'},{id:1,video:'videos1'},{id:1,video:'videos1'},{id:1,video:'videos1'},
              {id:1,video:'videos1'},{id:1,video:'videos1'},{id:1,video:'videos1'},{id:1,video:'videos1'},{id:1,video:'videos1'},
              ];
  constructor() { }

  ngOnInit() {
  }

}
