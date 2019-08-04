import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RssService } from '../../services/rss.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

declare var swal, $: any;
@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['../rss/rss.component.css','./source.component.css']
})
export class SourceComponent implements OnInit {

  feedsResponse: any;
  alias: string;
  userId: number;
  loading = false;
  sourceTitle: string;
  constructor(private router: Router, private route: ActivatedRoute, private rssService: RssService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.userId = this.authenticationService.getUserId();
    this.alias = this.route.snapshot.params['alias'];
    this.getFeedsBySourceAlias();
  }

  getFeedsBySourceAlias() {
    this.loading = true;
    this.rssService.getFeedsBySourceAlias(this.userId, this.alias).subscribe(
      data => {
        this.feedsResponse = data;
      },
      error => console.log(error),
      () => this.loading = false
    );
  }

renameSourceDialog(){
$('#renameModal').modal('show');
}
deleteSourceDialog(){
  const self = this;
  swal( {
      title: 'Delete source?',
      text: 'Are you sure you want to delete this source? This operation cannot be undone.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#54a7e9',
      cancelButtonColor: '#999',
      confirmButtonText: 'Yes'

  }).then( function() {
      self.deleteSource();
  }, function( dismiss: any ) {
      console.log( 'you clicked on option' + dismiss );
  });  
}

  renameSource(){
    let requestBody = {
      "id":this.feedsResponse.data.id,
      "userId": this.userId,
      "title": this.feedsResponse.data.title
    };
    this.rssService.renameSource(requestBody).subscribe(
      data => this.feedsResponse = data,
      error => console.log(error),
      () => this.loading = false
    );
  }

  deleteSource(){
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
      () => {}
    );
  }  

}
