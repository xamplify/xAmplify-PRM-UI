import { Component, OnInit,ViewChild,ElementRef } from "@angular/core";
import { AuthenticationService } from "../../core/services/authentication.service";
import { Properties } from '../../common/models/properties';

@Component({
  selector: "app-intro",
  templateUrl: "./intro.component.html",
  styleUrls: ["./intro.component.css"],
  providers: [Properties]
})
export class IntroComponent implements OnInit {

  @ViewChild('features') public features:ElementRef;
  @ViewChild('pricing') public pricing:ElementRef;
  @ViewChild('tour') public tour:ElementRef;
  @ViewChild('contact') public contact:ElementRef;

  mainLoader: boolean;
  navbar: any;
  sticky: any;
  zoom = 10;
  lat = 40.7143528;
  lng = -74.0059731;
  markers = [{ lat: 40.7143528, lng: -74.0059731, label: "A", draggable: true }];
  constructor(public authenticationService: AuthenticationService, public properties: Properties) {}

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
    if (window.pageYOffset >= this.sticky) { this.navbar.classList.add("stuck");} else { this.navbar.classList.remove("stuck"); }
  }
  goToFeaturesTab(){
    this.features.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
  }
  goToTourTab():void {
    this.tour.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
  }
  goToPricingTab(){
    this.pricing.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
  }
  goToContactTab(){
      this.contact.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
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
