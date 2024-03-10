import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Processor } from '../../core/models/processor';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
  providers:[Processor]
})
export class PreviewComponent implements OnInit {
  id:number = 0;
  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService,public xtremandLogger:XtremandLogger,
    public route:ActivatedRoute,public processor:Processor) { }

  ngOnInit() {
    this.referenceService.clearHeadScriptFiles();
    this.processor.set(this.processor);
    this.id = this.route.snapshot.params['id'];
    if(this.id!=undefined && this.id>0){
      this.getHtmlBodyAndMergeTags();
    }
  }

  getHtmlBodyAndMergeTags(){
    this.authenticationService.getEmailTemplateHtmlBodyAndMergeTagsInfo(this.id).subscribe(
      response=>{
        let statusCode = response.statusCode;
        let data = response.data;
        if(statusCode==200){
          this.processor.remove(this.processor);
          document.getElementById('html-preview').innerHTML = data;
        }else{
          this.referenceService.goToPageNotFound();
        }
      },error=>{
        this.xtremandLogger.errorPage(error);
      });
  }

}
