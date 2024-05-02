import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Processor } from '../../core/models/processor';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';

@Component({
  selector: 'app-preview-page',
  templateUrl: './preview-page.component.html',
  styleUrls: ['./preview-page.component.css'],
  providers:[Processor,Properties]
})
export class PreviewPageComponent implements OnInit {

  isLandingPagePreview = false;
  isPartnerLandingPagePreview = false;
  isPartnerVendorLandingPage = false;
  id = 0;
  statusCode = 404;
  customResponse:CustomResponse = new CustomResponse();
  success = false;
  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService,public xtremandLogger:XtremandLogger,
    public route:ActivatedRoute,public processor:Processor,public properties:Properties,
    public vanityUrlService:VanityURLService) { }

  ngOnInit() {
    this.processor.set(this.processor);
    let currentRouterUrl = this.referenceService.getCurrentRouteUrl();
    this.isLandingPagePreview = currentRouterUrl.indexOf("/pv/lp/")>-1;
    this.isPartnerLandingPagePreview = currentRouterUrl.indexOf("/pv/plp/")>-1;
    this.isPartnerVendorLandingPage = currentRouterUrl.indexOf("/pv/vjplp/")>-1;
    this.referenceService.clearHeadScriptFiles();
    this.id = this.route.snapshot.params['id'];
    this.getHtmlBody();
  }

  getHtmlBody(){
    let isVanityURLEnabled = this.vanityUrlService.isVanityURLEnabled();
    let isSubDomain = isVanityURLEnabled!=undefined ? isVanityURLEnabled : false;
    this.authenticationService.getLandingPageHtmlBody(this.id,isSubDomain,this.isPartnerLandingPagePreview, this.isPartnerVendorLandingPage).
    subscribe(
      response=>{
        this.statusCode = response.statusCode;
        if(this.statusCode==200){
          this.success = true;
          let data = response.data;
          let htmlBody = data.htmlBody;
          document.getElementById('page-html-body').innerHTML = htmlBody;
        }else if(this.statusCode==400){
          this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
        }
        this.processor.remove(this.processor);
      },error=>{
        this.statusCode = JSON.parse(error["status"]);
        let message = this.properties.serverErrorMessage;
        if(this.statusCode==403){
          this.statusCode = 404;
          let errorResponse = JSON.parse(error['_body']);
          message = errorResponse['message'];
        }
        this.customResponse = new CustomResponse('ERROR',message,true);
        this.processor.remove(this.processor);
      }
    );
  }

}
