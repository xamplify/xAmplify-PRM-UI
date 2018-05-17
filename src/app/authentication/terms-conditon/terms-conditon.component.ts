import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms-conditon',
  templateUrl: './terms-conditon.component.html',
  styleUrls: ['./terms-conditon.component.css','../intro/intro.component.css']
})
export class TermsConditonComponent implements OnInit {

  constructor() { }

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
