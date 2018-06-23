import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../core/services/authentication.service";

@Component({
  selector: "app-intro",
  templateUrl: "./intro.component.html",
  styleUrls: ["./intro.component.css"]
})
export class IntroComponent implements OnInit {
  mainLoader: boolean;
  navbar: any;
  sticky: any;
  // google maps zoom level
  zoom = 10;
  // initial center position for the map
  lat = 40.7143528;
  lng = -74.0059731;
  markers = [
    {
      lat: 40.7143528,
      lng: -74.0059731,
      label: "A",
      draggable: true
    }
  ];
  constructor(public authenticationService: AuthenticationService) {}
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  mapClicked($event: MouseEvent) {
    //  this.markers.push({lat: $event.coords.lat, lng: $event.coords.lng, draggable: true });
  }

  markerDragEnd(m: any, $event: MouseEvent) {
    console.log("dragEnd", m, $event);
  }
  onScroll() {
    if (window.pageYOffset >= this.sticky) { this.navbar.classList.add("stuck");
    } else { this.navbar.classList.remove("stuck"); }
  }
  ngOnInit() {
    this.navbar = document.getElementById("navbar");
    this.sticky = this.navbar.offsetTop;
    this.mainLoader = true;
    try {
      if (localStorage.getItem("currentUser")) {
        this.authenticationService.navigateToDashboardIfUserExists();
        setTimeout(() => {
          this.mainLoader = false;
        }, 900);
      } else {
        this.mainLoader = false;
      }
    } catch (error) {
      console.log("error" + error);
      this.mainLoader = true;
    }
  }
}
