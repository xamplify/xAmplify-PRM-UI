import { Component, OnInit , Input, Output, } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-pages',
  templateUrl: './error-pages.component.html',
  styleUrls: ['./error-pages.component.css']
})
export class ErrorPagesComponent implements OnInit {
  @Input() errorStatus: number;
  public Error400 = false;
  public Error403 = false;
  public Error500 = false;
  public Error406 = false;
  public Error409 = false;
  public Error503 = false;
  public errorMessage: string;
 constructor(public router: Router ) {
   this.errorMessage = 'campaign Launched';
 }
  homePage() { this.router.navigate(['./home/dashboard']); }

  ngOnInit() {
    if (this.errorStatus === undefined) {
      this.errorStatus = 500;
      this.Error500 = true;
    } else if (this.errorStatus === 400) {
      this.errorStatus = 400;
      this.Error400 = true;
    } else if (this.errorStatus === 406) {
      this.errorStatus = 406;
      this.Error406 = true;
    } else if (this.errorStatus === 409) {
        this.errorStatus = 409;
        this.Error409 = true;
      } else if (this.errorStatus === 500) {
      this.errorStatus = 500;
      this.Error500 = true;
    } else if (this.errorStatus === 503) {
         this.router.navigate(['/serviceunavailable']);
      } else if(this.errorStatus === 403){
      this.errorStatus = 403;
      this.Error403 = true;
      }
  }

}
