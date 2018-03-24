import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService} from '../../core/services/authentication.service';

declare var $: any;
@Component({
  selector: 'app-bottomnavbar',
  templateUrl: './bottomnavbar.component.html',
  styleUrls: ['./bottomnavbar.component.css']
})
export class BottomnavbarComponent implements OnInit {

  isEmailTemplate: boolean;

  constructor(public router: Router, public authenticationService: AuthenticationService) {
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
