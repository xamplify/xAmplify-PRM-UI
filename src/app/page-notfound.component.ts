import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector:  'not-found',
  template: `
    <h3 style="background: white">{{title}} Please go back or click on <a (click)="homePage()">DashBoard</a></h3>
    <img src="assets/images/404Page.jpg" style="width: 100%; height: 566px;">
    `
})
export class NotFoundPageComponent {
  title = 'The page was Not Found for this URL !';
  constructor(public router: Router ) { }
  homePage() { this.router.navigate(['./home/dashboard']); }
}
