import { Component, OnInit } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit {

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
