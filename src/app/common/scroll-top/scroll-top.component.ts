import { Component, OnInit } from '@angular/core';
declare var $:any;

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.css']
})
export class ScrollTopComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  scrollTop() {
    $("html,body").animate({ scrollTop: 0 }, "slow");
  }
  scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
  }
}
