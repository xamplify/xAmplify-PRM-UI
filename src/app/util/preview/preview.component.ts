import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Processor } from '../../core/models/processor';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
  providers:[Processor,Properties]
})
export class PreviewComponent implements OnInit {
  id:number = 0;
  success = false;
  customResponse:CustomResponse = new CustomResponse();
  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService,public xtremandLogger:XtremandLogger,
    public route:ActivatedRoute,public processor:Processor,public properties:Properties) { }

  ngOnInit() {
    this.referenceService.clearHeadScriptFiles();
    this.processor.set(this.processor);
    this.id = this.route.snapshot.params['id'];
    if(this.id!=undefined && this.id>0){
      this.getHtmlBody();
    }
  }

  getHtmlBody(){
    this.authenticationService.getEmailTemplateHtmlBodyAndMergeTagsInfo(this.id).subscribe(
      response=>{
        let statusCode = response.statusCode;
        let data = response.data;
        if(statusCode==200){
          this.success = true;
          document.getElementById('html-preview').innerHTML = data;
        }else{
          this.customResponse = new CustomResponse('ERROR',this.properties.pageNotFound,true);
        }
        this.processor.remove(this.processor);
      },error=>{
        this.processor.remove(this.processor);
        this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
      });
  }

}
