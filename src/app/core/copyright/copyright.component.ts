import { Component, OnInit, Input } from "@angular/core";
import { Properties } from "../../common/models/properties";
import { AuthenticationService } from "../services/authentication.service";

@Component({
  selector: "app-copyright",
  templateUrl: "./copyright.component.html",
  styleUrls: ["./copyright.component.css"],
  providers: [Properties]
})
export class CopyrightComponent implements OnInit {
  @Input() styleOne:boolean;
  constructor(public properties: Properties, public authService: AuthenticationService) { }

  ngOnInit() {
    if (this.authService.v_companyName) {
      this.properties.BOTTOM_MESSAGE = this.properties.COPY_RIGHT_PREFIX + ' '+this.authService.v_companyName + '. All rights reserved.'
    }
  }
}
