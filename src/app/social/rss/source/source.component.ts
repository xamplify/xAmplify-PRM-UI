import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RssService } from '../../services/rss.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CustomResponse } from '../../../common/models/custom-response';
import { Properties } from '../../../common/models/properties';
declare var swal, $: any;
@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['../rss/rss.component.css', './source.component.css'],
  providers: [Properties]
})
export class SourceComponent implements OnInit {

  feedsResponse: any;
  alias: string;
  userId: number;
  loading = false;
  sourceTitle: string;
  renameSourceTitleResponse: any;
  hasError = false;
  customResponse:CustomResponse = new CustomResponse();
  emptyFeeds = false;
  constructor(private router: Router, private route: ActivatedRoute, public rssService: RssService, private authenticationService: AuthenticationService,public properties:Properties) { }

  ngOnInit() {
    this.userId = this.authenticationService.getUserId();
    this.alias = this.route.snapshot.params['alias'];
    this.getFeedsBySourceAlias();
  }

  getFeedsBySourceAlias() {
    this.hasError = false;
    this.loading = true;
    this.emptyFeeds = false;
    this.customResponse  = new CustomResponse();
    this.rssService.getFeedsBySourceAlias(this.userId, this.alias).subscribe(
      data => {
        if(data.statusCode==8103){
          this.emptyFeeds = true;
          this.customResponse = new CustomResponse( 'INFO', 'No Feeds Found.', true );
        }else{
          this.feedsResponse = data;
          this.emptyFeeds = false;
        }
      },
      error => {
        this.loading = false;
        this.hasError = true;
        this.emptyFeeds = false;
        this.customResponse = new CustomResponse( 'ERROR', this.properties.serverErrorMessage, true );
      },
      () => this.loading = false
    );
  }

  renameSourceDialog() {
    this.sourceTitle = this.feedsResponse.data.customTitle;
    this.renameSourceTitleResponse = null;
    $('#renameModal').modal('show');
  }
  deleteSourceDialog() {
    const self = this;
    swal({
      title: 'Delete source?',
      text: 'Are you sure you want to delete this source? This operation cannot be undone.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#54a7e9',
      cancelButtonColor: '#999',
      confirmButtonText: 'Yes'

    }).then(function () {
      self.deleteSource();
    }, function (dismiss: any) {
      console.log('you clicked on option' + dismiss);
    });
  }

  renameSource() {
    let requestBody = {
      "companySourceId": this.feedsResponse.data.companySourceId,
      "userId": this.userId,
      "customTitle": this.sourceTitle
    };
    this.rssService.renameSource(requestBody).subscribe(
      data => {
        this.renameSourceTitleResponse = data;
        if (data.statusCode === 8114) {
          this.feedsResponse.data.customTitle = this.sourceTitle;
          this.rssService.refreshTime = new Date();
        } 
      },
      error => console.log(error),
      () => this.loading = false
    );
  }

  deleteSource() {
    let requestBody = {
      "userId": this.userId,
      "companySourceId": this.feedsResponse.data.companySourceId,
      "collectionId": this.feedsResponse.data.collections[0].id
    };
    this.rssService.deleteSource(requestBody).subscribe(
      data => {
        this.router.navigate(['/home/rss']);
      },
      error => console.log(error),
      () => { }
    );
  }

}
