import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';

declare const $,google: any;
@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit {
  mainLoader = false;
  constructor(public authenticationService:AuthenticationService) { }
  googleMap() {
    const myCenter = new google.maps.LatLng(40.7143528,-74.0059731);
    const mapCanvas = document.getElementById("map-canvas_");
    const mapOptions = {center: myCenter, zoom: 5,
      mapTypeId:google.maps.MapTypeId.TERRAIN};
    const map = new google.maps.Map(mapCanvas, mapOptions);
    const marker = new google.maps.Marker({position:myCenter});
    marker.setMap(map);
  }
  ngOnInit() {
    this.mainLoader = true;
    if(localStorage.getItem('currentUser')){ this.mainLoader=false ;this.authenticationService.navigateToDashboardIfUserExists()}
    else {this.mainLoader=false }
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
