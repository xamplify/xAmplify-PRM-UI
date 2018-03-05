import { Component, OnInit, Input } from '@angular/core';
import { SocialConnection } from '../../models/social-connection';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {
  @Input() twitterProfile: any;
  @Input() socialConnection: SocialConnection;
  constructor() { }

  ngOnInit() {
  }

}
