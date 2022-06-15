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
  invalidInput = false;
  constructor(public referenceService: ReferenceService) {}

  ngOnInit() {
    if(this.dateAndTimeUTCString!=null && this.dateAndTimeUTCString!=undefined && this.dateAndTimeUTCString!=""){
      this.displayTime = new Date(this.dateAndTimeUTCString);
      this.invalidInput = "Invalid Date"==this.displayTime.toString();
    }else{
      this.invalidInput = true;
    }
  }
}
