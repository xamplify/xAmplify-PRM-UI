import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-terms-conditon",
  templateUrl: "./terms-conditon.component.html",
  styleUrls: ["./terms-conditon.component.css", "../intro/intro.component.css"]
})
export class TermsConditonComponent implements OnInit {
  termsPage: boolean;
  navbar: any;
  sticky: any;
  constructor(public router: Router) {
    this.termsPage = this.router.url.includes("terms") ? true : false;
  }
  onScroll() {
    if (window.pageYOffset >= this.sticky) { this.navbar.classList.add("stuck");
    } else { this.navbar.classList.remove("stuck"); }
  }
  ngOnInit() {
    this.navbar = document.getElementById("navbar");
    this.sticky = this.navbar.offsetTop;
  }
}
