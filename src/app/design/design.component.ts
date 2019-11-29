import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../core/services/authentication.service';
import { XtremandLogger } from '../error-pages/xtremand-logger.service';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css']
})
export class DesignComponent implements OnInit {
    isLoading:boolean = true;
    emailTemplate:boolean = false;
    form:boolean = false;
    landingPage:boolean = false;
    landingPageDescription:string = "";
  constructor(public logger: XtremandLogger,public authenticationService: AuthenticationService) { }

  ngOnInit() {
      this.landingPageDescription = "Create custom  pages with xAmplify that convert more visitors than any other website.";
      this.getModuleAccess();
  }
  
  getModuleAccess(){
      this.authenticationService.getModulesByUserId()
      .subscribe(
          data => {
              let response = data.data;
              let statusCode = data.statusCode;
              if(statusCode==200){
                  this.emailTemplate = response.emailTemplate;
                  this.form = response.form;
                  this.landingPage = response.landingPage;
              }else{
                  
              }
              this.isLoading = false;
          },
          error => {
              this.logger.errorPage(error);
          },
          () => this.logger.info("Finished getModuleAccess()")
      );
  }

}
