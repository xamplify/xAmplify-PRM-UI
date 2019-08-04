import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RssService } from '../../services/rss.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['../rss/rss.component.css', './search.component.css']
})
export class SearchComponent implements OnInit {
  searchType: string;
  searchValue: string;
  searchResponse: any;
  userId: number;
  loading = false;
  refreshLeftNav: boolean;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private rssService: RssService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.userId = this.authenticationService.getUserId();
    this.searchType = this.activatedRoute.snapshot.url[1].path;
    this.searchValue = this.activatedRoute.snapshot.url[2].path;
    if (this.searchType === 'category')
      this.searchByCategory();
    else
      this.searchBySource();
  }

  searchByCategory() {
    this.loading = true;
    this.rssService.searchByCategory(this.userId, this.searchValue).subscribe(
      data => this.searchResponse = data,
      error => console.log(error),
      () => this.loading = false
    );
  }

  searchBySource() {
    this.loading = true;
    this.rssService.searchBySource(this.userId, this.searchValue).subscribe(
      data => this.searchResponse = data,
      error => console.log(error),
      () => this.loading = false
    );
  }

  followSource(collectionName: string, sourceId: number){
    debugger;
    if(this.rssService.collectionsResponse.data){
      let collection = this.rssService.collectionsResponse.data.find(obj => {
        return obj.title === collectionName
      });
      let req =  {"userId": this.userId, "sourceId": sourceId, "collectionId": collection.id};
      this.addSourceToCollection(req);
    } else {
      this.createCollection(collectionName, sourceId);
    }
  }

  createCollection(collectionName: string, sourceId: number){
    let requestBody = {"userId": this.userId, "title": collectionName};
    this.rssService.createCollection(requestBody).subscribe(
      data => {
        if(data.statusCode === 8111){
          let req =  {"userId": this.userId, "sourceId": sourceId, "collectionId": data.data.id};
          this.addSourceToCollection(req);
      }

      },
      error => console.log(error),
      () => this.loading = false
    );
  }

  addSourceToCollection(req: any){
    this.rssService.addSourceToCollection(req).subscribe(
      data => {
        // do nothing
        this.refreshLeftNav = true;
      },
      error => console.log(error),
      () => this.loading = false
    );
  }

  removeSourceFromCollection(sourceId: number, collectionId: number){
    let req =  {"userId": this.userId, "companySourceId": sourceId, "collectionId": collectionId};
    this.rssService.removeSourceFromCollection(req).subscribe(
      data => {
        // do nothing
        this.refreshLeftNav = true;
      },
      error => console.log(error),
      () => this.loading = false
    );
  }

  clearSearch(){
    this.router.navigate(['/home/rss/discover']);
  }

}
