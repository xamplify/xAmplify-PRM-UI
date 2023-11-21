import { Component, OnInit,Input } from '@angular/core';
import { Properties } from '../../common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { EnvService } from 'app/env.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css', '../../../assets/css/default.css', '../../../assets/css/authentication-page.css'],
  providers: [Properties]
})
export class VideoComponent implements OnInit {

  @Input() vanityURLEnabled:boolean;
  @Input() newLogin:boolean;
  constructor(public properties: Properties, public authService: AuthenticationService,public envService: EnvService) { }

  ngOnInit() {
    if (this.authService.vanityURLEnabled && this.authService.v_companyBgImagePath2) {
      this.properties.COMPANY_LOGO = this.authService.v_companyLogoImagePath;      
      this.properties.xamplify_router = this.authService.vanityURLink;
    }else{
      let hostUrl = this.envService.CLIENT_URL;
      if("https://xamplify.co/"==hostUrl){
        this.authService.v_companyBgImagePath2 = "assets/images/xAmplify-sandbox.png";
      }else{
        this.authService.v_companyBgImagePath2 = "assets/images/stratapps.jpeg";
      }
    }
  }
}
