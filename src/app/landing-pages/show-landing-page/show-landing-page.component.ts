import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute,Router,NavigationStart, NavigationEnd  } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { Processor } from '../../core/models/processor';
import { CustomResponse } from '../../common/models/custom-response';
import { filter, pairwise } from 'rxjs/operators';
import { LandingPageService } from '../services/landing-page.service';

declare var $:any;
@Component({
  selector: 'app-show-landing-page',
  templateUrl: './show-landing-page.component.html',
  styleUrls: ['./show-landing-page.component.css','../../../assets/css/loader.css'],
  providers: [HttpRequestLoader,Processor,LandingPageService],

})
export class ShowLandingPageComponent implements OnInit {
    hasLandingPage=true;
    ngxLoading = false;
    customResponse: CustomResponse = new CustomResponse();
    alias: any;
    alertClass ="";
    successAlertClass = "alert alert-success";
    errorAlertClass = "alert alert-danger";
    show: boolean;
    message: string;
  constructor(private route: ActivatedRoute,private referenceService:ReferenceService,private landingPageService:LandingPageService,
          private authenticationService:AuthenticationService,private logger:XtremandLogger,public httpRequestLoader: HttpRequestLoader,public processor:Processor,private router:Router) { }

  ngOnInit() {
      this.processor.set(this.processor);
      this.alias = this.route.snapshot.params['alias'];
      this.getHtmlBodyAlias(this.alias);
  }

  
  getHtmlBodyAlias(alias:string){
      this.ngxLoading = true;
      this.landingPageService.getHtmlContentByAlias(alias)
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.hasLandingPage = true;
            document.getElementById('landing-page-html-body').innerHTML = response.message;
          } else {
            this.hasLandingPage = false;
            this.addHeaderMessage("Oops! This landing page does not exists.",this.errorAlertClass);
          }
          this.processor.remove(this.processor);
          this.ngxLoading = false;
        },
        (error: string) => {
          this.processor.remove(this.processor);
          this.logger.errorPage(error);
          this.referenceService.showServerError(this.httpRequestLoader);
        }
      );
  }
  

  addHeaderMessage(message:string,divAlertClass:string){
      this.ngxLoading = false;
      this.show = true;
      this.message = message;
      this.alertClass = divAlertClass;
  }
  removeErrorMessage(){
    this.show = false;
  }
}
