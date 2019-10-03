import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RssService } from '../../services/rss.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

declare var swal, $: any;
@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['../rss/rss.component.css','./collection.component.css']
})
export class CollectionComponent implements OnInit {
  feedsResponse: any;
  alias: string;
  loading = false;
  userId: number;
  collectionTitle: string;
  renameCollectionTitleResponse: any;
  constructor(private router: Router, private route: ActivatedRoute, public rssService: RssService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.userId = this.authenticationService.getUserId();
    this.alias = this.route.snapshot.params['alias'];
    this.getFeedsByCollectionAlias();
  }

  getFeedsByCollectionAlias(){
    this.loading = true;
    this.rssService.getFeedsByCollectionAlias(this.alias).subscribe(
      data => this.feedsResponse = data,
      error => console.log(error),
      () => this.loading = false
    );
  }
renameCollectionDialog(){
    this.collectionTitle = this.feedsResponse.data.title;
    this.renameCollectionTitleResponse = null;
    $('#renameModal').modal('show');
}
deleteCollectionDialog(){
  const self = this;
  swal( {
      title: 'Delete collection?',
      text: 'Are you sure you want to delete this collection? This operation cannot be undone.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#54a7e9',
      cancelButtonColor: '#999',
      confirmButtonText: 'Yes'

  }).then( function() {
      self.deleteCollection();
  }, function( dismiss: any ) {
      console.log( 'you clicked on option' + dismiss );
  });  
}

  renameCollection(){
    let requestBody = {
      "id":this.feedsResponse.data.id,
      "userId": this.userId,
      "title": this.collectionTitle
    };
    this.rssService.renameCollection(requestBody).subscribe(
      data => {
        this.renameCollectionTitleResponse = data;
        if (data.statusCode === 8114) {
          this.feedsResponse.data.title = this.collectionTitle;
        } else {

        }
      },
      error => console.log(error),
      () => this.loading = false
    );
  }

  deleteCollection(){
    let requestBody = {
	"userId": this.userId,
	"id": this.feedsResponse.data.id
};
    this.rssService.deleteCollection(requestBody).subscribe(
      data => {
        this.router.navigate(['/home/rss']);
      },
      error => console.log(error),
      () => {}
    );
  }

}
