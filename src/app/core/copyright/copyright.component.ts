import { Component, OnInit } from "@angular/core";
import { Properties } from "../../common/models/properties";

@Component({
  selector: "app-copyright",
  templateUrl: "./copyright.component.html",
  styleUrls: ["./copyright.component.css"],
  providers: [Properties]
})
export class CopyrightComponent implements OnInit {
  constructor(public properties: Properties) {}

  ngOnInit() {}
}
