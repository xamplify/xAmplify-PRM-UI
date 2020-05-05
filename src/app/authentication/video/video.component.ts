import { Component, OnInit } from '@angular/core';
import { Properties } from '../../common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';


@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css', '../../../assets/css/default.css', '../../../assets/css/authentication-page.css'],
  providers: [Properties]
})
export class VideoComponent implements OnInit {

  constructor(public properties: Properties, public authService: AuthenticationService) { }

  ngOnInit() {    
    if (this.authService.vanityURLEnabled && this.authService.v_companyLogoImagePath) {
      this.properties.COMPANY_LOGO = this.authService.v_companyLogoImagePath;
      this.properties.xamplify_router = this.authService.vanityURLink;
    }else{
      this.authService.v_companyBgImagePath = "assets/images/stratapps.jpeg";
    }
  }
}
