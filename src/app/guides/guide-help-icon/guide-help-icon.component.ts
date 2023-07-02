import { Component, OnInit, Input } from '@angular/core';
import { UserGuide } from '../models/user-guide';
import { UserService } from 'app/core/services/user.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-guide-help-icon',
  templateUrl: './guide-help-icon.component.html',
  styleUrls: ['./guide-help-icon.component.css']
})
export class GuideHelpIconComponent implements OnInit {
@Input() GuideUrl:any;
guideUrl:any;
  constructor(public userService:UserService,public authenticationService:AuthenticationService,public referanceService:ReferenceService) { }

  urllink:any
  ngOnInit() {
    this.getGuideUrl()
  }
  userGuide: UserGuide = new UserGuide();
  getGuideUrl(){
    this.userService.showUserGuide(this.GuideUrl).subscribe(
      response => {
        if (response.statusCode === 200) {
          this.userGuide = response.data;
          this.urllink =this.authenticationService.APP_URL+ 'home/help/' + this.userGuide.slug;
        }
      }, (error: any) => {
        //this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
      }
    )
  }

}
