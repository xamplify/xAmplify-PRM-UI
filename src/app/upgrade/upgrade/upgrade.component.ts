import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';

declare var Metronic ,Demo,Layout:any;

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.css']
})
export class UpgradeComponent implements OnInit {

  constructor(public authenticationService:AuthenticationService, public referenceService:ReferenceService) { }

  ngOnInit(){
      try{
      }
      catch(err){
      console.log("err");
      }
  }

}
