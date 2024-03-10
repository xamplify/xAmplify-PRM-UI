import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService) { }

  ngOnInit() {
    this.referenceService.removeCssStylesAndCssFiles();
  }

  getHtmlBodyAndMergeTags(id){
    this.authenticationService.getEmailTemplateHtmlBodyAndMergeTagsInfo(id).subscribe(
      response=>{

      },error=>{

      });
  }

}
