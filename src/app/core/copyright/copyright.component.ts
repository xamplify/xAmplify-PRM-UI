import { Component, OnInit } from "@angular/core";
import { Properties } from "../../common/models/properties";
import { VanityURLService } from "app/vanity-url/services/vanity.url.service";
import { AuthenticationService } from "../services/authentication.service";

@Component({
  selector: "app-copyright",
  templateUrl: "./copyright.component.html",
  styleUrls: ["./copyright.component.css"],
  providers: [Properties]
})
export class CopyrightComponent implements OnInit {

  constructor(public properties: Properties, private authService: AuthenticationService) { }

  ngOnInit() {
    if (this.authService.v_companyName != undefined && this.authService.v_companyName != '') {
      this.properties.BOTTOM_MESSAGE = '&copy; 2020 ' + this.authService.v_companyName + '. All rights reserved.'
    }
  }
}
