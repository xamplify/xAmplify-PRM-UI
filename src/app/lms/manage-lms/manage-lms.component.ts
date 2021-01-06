import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { LmsService } from '../services/lms.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage-lms',
  templateUrl: './manage-lms.component.html',
  styleUrls: ['./manage-lms.component.css']
})
export class ManageLmsComponent implements OnInit {

  constructor(private route:ActivatedRoute,public referenceService: ReferenceService, public authenticationService: AuthenticationService, public lmsService: LmsService, private router: Router) { }

  ngOnInit() {
  }

}
