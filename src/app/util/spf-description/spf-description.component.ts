import { Component, OnInit,Input } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
declare var $:any;
@Component({
  selector: 'app-spf-description',
  templateUrl: './spf-description.component.html',
  styleUrls: ['./spf-description.component.css']
})
export class SpfDescriptionComponent implements OnInit {
 @Input() showGoDaddyConfiguration = false;
 @Input() spfConfigured = false;
  constructor(public authenticationService:AuthenticationService) { }

  ngOnInit() {
    if(this.showGoDaddyConfiguration==undefined){
      this.showGoDaddyConfiguration = false;
    }
  }

  navigateToSPFConfigurationSection(){
    this.authenticationService.module.navigateToSPFConfigurationSection = true;
    $('#spfModalPopup').modal('hide');
    this.authenticationService.navigateToMyProfileSection();
  }

}
