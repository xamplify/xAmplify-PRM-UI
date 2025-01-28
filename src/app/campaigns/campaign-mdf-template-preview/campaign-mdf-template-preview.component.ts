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
  selector: 'app-campaign-mdf-template-preview',
  templateUrl: './campaign-mdf-template-preview.component.html',
  styleUrls: ['./campaign-mdf-template-preview.component.css'],
  providers:[Processor,Properties]
})
export class CampaignMdfTemplatePreviewComponent implements OnInit {

  success = false;
  customResponse:CustomResponse = new CustomResponse();
  apiResponseFinished = false;
  alias:any;
  statusCode: any;

  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService,public xtremandLogger:XtremandLogger,
    public route:ActivatedRoute,public processor:Processor,public properties:Properties,public vanityUrlService:VanityURLService) { }

  ngOnInit() {
    this.processor.set(this.processor);
    this.alias = this.route.snapshot.params['mdfAlias'];
    this.getEmailTemplatePreviewByAlias();
    
  }

  getEmailTemplatePreviewByAlias(){
    this.authenticationService.getMdfCampaignTemplatePreview(this.alias).subscribe(
      response => {
        this.statusCode = response.statusCode;
        let data = response.data;
        if(this.statusCode==200){
          this.success = true;
          let htmlBody = data.htmlBody;
          document.getElementById('html-preview').innerHTML = htmlBody;
        }else{
          if(this.statusCode==403){
            this.statusCode = 404;
          }
          this.customResponse = new CustomResponse('ERROR',this.properties.pageNotFound,true);
        }
        this.apiResponseFinished = true;
        this.processor.remove(this.processor);
      }, error => {
        this.statusCode = JSON.parse(error["status"]);
        let message = this.properties.serverErrorMessage;
        if (this.statusCode == 403) {
          this.statusCode = 404;
          let errorResponse = JSON.parse(error['_body']);
          message = errorResponse['message'];
        }
        this.customResponse = new CustomResponse('ERROR', message, true);
        this.apiResponseFinished = true;
        this.processor.remove(this.processor);
      });
  }

}
