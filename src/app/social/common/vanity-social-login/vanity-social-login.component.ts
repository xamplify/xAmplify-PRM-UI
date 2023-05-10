import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-vanity-social-login',
  templateUrl: './vanity-social-login.component.html',
  styleUrls: ['./vanity-social-login.component.css']
})
export class VanitySocialLoginComponent implements OnInit {

  parentWindowUserId = 0;
  constructor(private router: Router, private route: ActivatedRoute,private authenticationService: AuthenticationService) { }

  ngOnInit() {
    let providerName = this.route.snapshot.params['socialProvider'];
    let parentWindowUserId = this.route.snapshot.params['userId'];
    let vanityUrlDomainName = this.route.snapshot.params['vud'];
    if (parentWindowUserId == undefined || parentWindowUserId == null || parentWindowUserId == 0) {
      parentWindowUserId = 0;
      localStorage.setItem('loginPage','true');
    } else {
      localStorage.setItem('loginPage','false');
    }
    localStorage.setItem('parentWindowUserId',parentWindowUserId);
    localStorage.setItem('vanityUrlDomain',vanityUrlDomainName);
    localStorage.setItem('vanityUrlFilter','true');
    let url = providerName+"/login";
    this.router.navigate([url]);

  }

}
