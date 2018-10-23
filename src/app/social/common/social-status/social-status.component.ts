import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication.service';
@Component({
  selector: 'app-social-status',
  templateUrl: './social-status.component.html',
  styleUrls: ['./social-status.component.css']
})
export class SocialStatusComponent implements OnInit {
  @Input('socialStatus') socialStatus;

  constructor(public authenticationService: AuthenticationService) { }
  isUrl(s): boolean {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
  }
  ngOnInit() {
  }

}
