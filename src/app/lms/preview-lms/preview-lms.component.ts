import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { LmsService } from '../services/lms.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { LearningTrack } from '../models/learningTrack'
import { DomSanitizer } from "@angular/platform-browser";
import { CustomResponse } from '../../common/models/custom-response';


declare var $, swal: any;

@Component({
  selector: 'app-preview-lms',
  templateUrl: './preview-lms.component.html',
  styleUrls: ['./preview-lms.component.css'],
  providers: [HttpRequestLoader, LmsService]
})
export class PreviewLmsComponent implements OnInit {

  companyId:number = 0;
  slug:string = "";
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  learningTrack:LearningTrack = new LearningTrack();
  customResponse: CustomResponse = new CustomResponse();

  constructor(private route: ActivatedRoute, public referenceService: ReferenceService, 
    public authenticationService: AuthenticationService, public lmsService: LmsService, 
    private router: Router, public sanitizer: DomSanitizer) {

   }

  ngOnInit() {
    this.companyId = parseInt(this.route.snapshot.params['companyId']);
    this.slug = this.route.snapshot.params['slug'];
    this.getBySlug();
  }

  getBySlug(){
    this.referenceService.startLoader(this.httpRequestLoader);
    console.log(this.authenticationService.access_token)
    this.lmsService.getBySlug(this.companyId,this.slug).subscribe(
      (result:any) => {
        if(result.statusCode == 200){
          let learningTrack:LearningTrack = result.data;
          if (learningTrack != undefined) {
            this.learningTrack = learningTrack;
          }
          this.referenceService.stopLoader(this.httpRequestLoader);
        } else {
          swal("Please Contact Admin!", result.message, "error");
          this.referenceService.stopLoader(this.httpRequestLoader);
        }
      },
      (error: string) => {
        this.referenceService.showServerError(this.httpRequestLoader);
        this.referenceService.stopLoader(this.httpRequestLoader);
      });
    }

}
