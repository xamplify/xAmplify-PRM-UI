import { Component, OnInit, Input } from "@angular/core";
import { ReferenceService } from "app/core/services/reference.service";

@Component({
  selector: "app-display-date-and-time",
  templateUrl: "./display-date-and-time.component.html",
  styleUrls: ["./display-date-and-time.component.css"],
})
export class DisplayDateAndTimeComponent implements OnInit {
  @Input() dateAndTimeUTCString: any;
  displayTime = new Date();
  constructor(public referenceService: ReferenceService) {}

  ngOnInit() {
    this.displayTime = new Date(this.dateAndTimeUTCString);
  }
}
