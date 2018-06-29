import { Component, OnInit } from "@angular/core";
import { ReferenceService } from "../../../core/services/reference.service";

@Component({
  selector: "app-analytics-loader",
  templateUrl: "./analytics-loader.component.html",
  styleUrls: [ "./analytics-loader.component.css",  "../list-loader/list-loader.component.css" ]
})
export class AnalyticsLoaderComponent implements OnInit {
  rowsCount = [0, 1, 2, 3];
  textLoader = [0, 1, 2];

  constructor(public referenceService: ReferenceService) {}

  ngOnInit() {}
}
