import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector:  'not-found',
  template: `
    <h3 style="background: white">{{title}} go back or click on <a (click)="homePage()">home</a></h3>
    <img src="assets/images/404Page.jpg" style="width: 100%">
    `
})
export class NotFoundPageComponent {
  title = 'Not Found found this URL';
  constructor(public router: Router ) { }
  homePage() {
    this.router.navigate(['./home/dashboard']);
  }
}
