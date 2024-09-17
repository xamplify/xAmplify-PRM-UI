import { Component, OnInit } from '@angular/core';
import { Properties } from 'app/common/models/properties';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { SortOption } from 'app/core/models/sort-option';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';


@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.css'],
  providers:[SortOption,HttpRequestLoader]
})
export class CustomFieldsComponent implements OnInit {

  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public sortOption:SortOption) { }

  ngOnInit() {
  }

}
