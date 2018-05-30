import { Component, OnInit } from '@angular/core';

declare var $,google: any;
@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit {

  constructor() { }
  googleMap() {
    let myCenter = new google.maps.LatLng(40.7143528,-74.0059731);
    var mapCanvas = document.getElementById("map-canvas_");
    var mapOptions = {center: myCenter, zoom: 5,
      mapTypeId:google.maps.MapTypeId.TERRAIN};
    var map = new google.maps.Map(mapCanvas, mapOptions);
    var marker = new google.maps.Marker({position:myCenter});
    marker.setMap(map);
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
 //   this.googleMap();
  }

}
