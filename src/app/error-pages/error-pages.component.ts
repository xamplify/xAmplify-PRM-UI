import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error-pages',
  templateUrl: './error-pages.component.html',
  styleUrls: ['./error-pages.component.css']
})
export class ErrorPagesComponent implements OnInit, OnDestroy {
  errorStatus: number;
  private sub: any;
  public Error400 = false;
  public Error403 = false;
  public Error500 = false;
  public Error406 = false;
  public Error409 = false;
  public Error503 = false;
  public ErrorUndefined = false;
  public errorDifferent = false;
  public errorMessage: string;
  constructor(public router: Router, private route: ActivatedRoute) {
    this.errorMessage = '';
  }
  homePage() { this.router.navigate(['./home/dashboard']); }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.errorStatus = +params['errorStatusId']; // (+) converts string 'id' to a number
    });
    if (this.errorStatus === 400) {
      this.Error400 = true;
    } else if (this.errorStatus === 406) {
      this.Error406 = true;
    } else if (this.errorStatus === 409) {
      this.Error409 = true;
    } else if (this.errorStatus === 500) {
      this.Error500 = true;
    } else if (this.errorStatus === 503) {
      this.router.navigate(['/serviceunavailable']);
    } else if (this.errorStatus === 403) {
      this.Error403 = true;
    } else if(this.errorStatus === 0) {
       this.router.navigate(['/serviceunavailable']);
    }else if (this.isNumber(this.errorStatus)) {
      this.ErrorUndefined = true;
      this.errorStatus = this.errorStatus;
      console.log(this.errorStatus);
    } else {
      this.errorDifferent = true;
      this.errorMessage = 'Oops ! An Error Occured !';
      console.log(this.errorStatus);
    }
  }
isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
