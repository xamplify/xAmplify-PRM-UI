import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Properties } from "../../common/models/properties";

declare var $: any;
@Component({
  selector: "app-bottomnavbar",
  templateUrl: "./bottomnavbar.component.html",
  styleUrls: ["./bottomnavbar.component.css"],
  providers: [Properties]
})
export class BottomnavbarComponent implements OnInit {
  isEmailTemplate: boolean;

  constructor(public router: Router, public properties: Properties) {
    this.isEmailTemplate = this.router.url.includes("/home/emailtemplates/create") ? true : false;
  }
  scrollTop() {
    $("html,body").animate({ scrollTop: 0 }, "slow");
  }
  onResize(event) {
    if (this.isEmailTemplate && window.outerHeight - window.innerHeight > 100) {
      this.isEmailTemplate = false;
    }
  }
  scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
    }
  ngOnInit() {
  }
}
