import { Component, OnInit } from '@angular/core';
import { LandingPageService } from '../services/landing-page.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { LandingPage } from '../models/landing-page';
declare var swal, $: any;

@Component({
  selector: 'app-preview-landing-page',
  templateUrl: './preview-landing-page.component.html',
  styleUrls: ['./preview-landing-page.component.css'],
  providers: [HttpRequestLoader],

})
export class PreviewLandingPageComponent implements OnInit {
  constructor(public landingPageService: LandingPageService) { }
  loading = false;
  ngOnInit() {
  }
  
  
  showPreview(landingPage:LandingPage){
      this.loading = true;
      let htmlContent = "#landingPage-html-content";
      $(htmlContent).empty();
      $("#landing-page-preview-modal").modal('show');
      this.landingPageService.getHtmlContent(landingPage.id).subscribe(
              ( response: any ) => {
                  if(response.statusCode==200){
                      let title = "#landing-page-preview-title";
                      $(title).empty();
                      $(title).append(landingPage.name);
                      $(title).prop('title',landingPage.name);
                      $(htmlContent).append(response.message);
                      $('.modal .modal-body').css('overflow-y', 'auto');
                      this.loading = false;
                  }else{
                      swal("Please Contact Admin!", "No Landing Page Found", "error");
                      $("#landing-page-preview-modal").modal('hide');
                  }
              },
              ( error: any ) => { swal("Please Contact Admin!", "Unable to load landing page", "error");this.loading = false;
              $("#landing-page-preview-modal").modal('hide'); } );
  }
  

}
