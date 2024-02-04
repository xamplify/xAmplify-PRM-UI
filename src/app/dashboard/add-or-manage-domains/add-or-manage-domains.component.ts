import { Component, OnInit,Input } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-add-or-manage-domains',
  templateUrl: './add-or-manage-domains.component.html',
  styleUrls: ['./add-or-manage-domains.component.css','../user-profile/my-profile/my-profile.component.css'],
  providers:[HttpRequestLoader,Properties],
})
export class AddOrManageDomainsComponent implements OnInit {

  customResponse:CustomResponse = new CustomResponse();
  @Input() moduleName:string;
  headerText = "";
  downloadCsvText = "";

  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public httpRequestLoader:HttpRequestLoader) { }

  ngOnInit() {
    if(this.moduleName=="addDomains"){
      this.headerText = "Add Domains";
      this.downloadCsvText = "Download CSV Template";
    }else{
      this.headerText = "Exclude A Domain";
    }
  }

}
