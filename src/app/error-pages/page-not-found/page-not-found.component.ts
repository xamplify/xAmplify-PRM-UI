import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  title = 'The page was Not Found !';
  constructor(public router: Router ) { }
  homePage() { this.router.navigate(['./home/dashboard']); }
  ngOnInit(){
    
  }
}
