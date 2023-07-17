import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { UserService } from 'app/core/services/user.service';
import { UserGuide } from 'app/guides/models/user-guide';

declare var $:any;
@Component({
  selector: 'app-user-guide-help-button',
  templateUrl: './user-guide-help-button.component.html',
  styleUrls: ['./user-guide-help-button.component.css']
})
export class UserGuideHelpButtonComponent implements OnInit, OnChanges {
  @Input() mergeTag: any;
  @Input() searchForGuides: any;
  loading: boolean = false;
  constructor(public userService: UserService, public authenticationService: AuthenticationService, public referanceService: ReferenceService) {

  }

  urllink: any
  ngOnInit() {
    // if(this.searchForGuides != null) {

    // } else {
    // this.getGuideUrl()
    // }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.searchForGuides != null) {
      this.urllink = this.authenticationService.APP_URL + 'home/help/search/' + this.searchForGuides;
    } else {
      this.getGuideUrl()
    }
  }
  ngAfterViewChecked() {
    // $('[data-toggle="tooltip"]').tooltip({
    //   trigger: 'hover'
    // });
    // $('[data-toggle="tooltip"]').on('click', function () {
    //   $(this).tooltip('dispose');
    // });
   }
  userGuide: UserGuide = new UserGuide();
  getGuideUrl() {
    this.loading = true;
    this.userService.showUserGuide(this.mergeTag).subscribe(
      response => {
        this.loading = false;
        if (response.statusCode === 200) {
          this.userGuide = response.data;
          this.urllink = this.authenticationService.APP_URL + 'home/help/' + this.userGuide.slug;
        }
        this.loading = false;
      }, (error: any) => {
        this.loading = false;
        //this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
      }
    )
  }
}
