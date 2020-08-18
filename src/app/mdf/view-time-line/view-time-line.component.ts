import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-time-line',
  templateUrl: './view-time-line.component.html',
  styleUrls: ['./view-time-line.component.css','../html-sample/html-sample.component.css']
})
export class ViewTimeLineComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  goToManageMdfRequests(){
    this.router.navigate(["/home/mdf/requests/p"]);
  }
}
