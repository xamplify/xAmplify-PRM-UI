import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService} from '../../core/services/authentication.service';
import { Properties } from '../../common/models/properties';

declare var $: any;
@Component({
  selector: 'app-bottomnavbar',
  templateUrl: './bottomnavbar.component.html',
  styleUrls: ['./bottomnavbar.component.css'],
  providers: [Properties]
})
export class BottomnavbarComponent implements OnInit {

  isEmailTemplate: boolean;

  constructor(public router: Router, public authenticationService: AuthenticationService,
  public properties: Properties) {
    this.isEmailTemplate = this.router.url.includes('/home/emailtemplates/create') ? true : false;
  }
  scrollTop() {
    $('html,body').animate({ scrollTop: 0 }, 'slow');
  }
  onResize(event) {
    if (this.isEmailTemplate && (window.outerHeight - window.innerHeight) > 100) {
      this.isEmailTemplate = false;
    }
  }
  ngOnInit() {
  }

}
