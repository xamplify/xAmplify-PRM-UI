import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms-conditon',
  templateUrl: './terms-conditon.component.html',
  styleUrls: ['./terms-conditon.component.css','../intro/intro.component.css']
})
export class TermsConditonComponent implements OnInit {
  termsPage:boolean;
  constructor(public router:Router) {
    this.termsPage = this.router.url.includes('terms')? true:false;
   }

  ngOnInit() {
    window.onscroll = function () { myFunction() };

    const navbar = document.getElementById("navbar");
    const sticky = navbar.offsetTop;

    function myFunction() {
      if (window.pageYOffset >= sticky) {
        navbar.classList.add("stuck")
      } else {
        navbar.classList.remove("stuck");
      }
    }
  }

}
