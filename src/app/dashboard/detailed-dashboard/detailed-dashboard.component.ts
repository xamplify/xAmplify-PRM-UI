import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { UserService } from 'app/core/services/user.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';

@Component({
  selector: 'app-detailed-dashboard',
  templateUrl: './detailed-dashboard.component.html',
  styleUrls: ['./detailed-dashboard.component.css']
})
export class DetailedDashboardComponent implements OnInit {
  logedInCustomerCompanyName = "";
  hasAccess = false;
  loading = true;
  applyFilter = true;
  constructor(public referenceService:ReferenceService,public userService: UserService,public authenticationService:AuthenticationService,public logger:XtremandLogger) { }

  ngOnInit() {
	const currentUser = localStorage.getItem( 'currentUser' );
    if(currentUser!=undefined){
      this.logedInCustomerCompanyName = JSON.parse( currentUser )['logedInCustomerCompanyNeme'];
      this.getDashboardType();
    }else{
      this.hasAccess = false;
    }
  }

  getDashboardType(){
    this.userService.getDashboardType().
    subscribe(
      data=>{
        this.hasAccess = (data!=undefined && data.indexOf('Detailed Dashboard')>-1);
        if(!this.hasAccess){
          this.referenceService.goToPageNotFound();
        }
        this.loading = false;
      },error=>{
        this.loading = false;
        this.logger.error(error);
      }
    );
  }

  getSelectedIndexFromPopup(event:any){
    this.loading = true;
    let self = this;
    setTimeout(function() {
    self.loading = false;
    self.applyFilter = event['selectedOptionIndex'] == 1;
    }, 500);
  }

  

}
