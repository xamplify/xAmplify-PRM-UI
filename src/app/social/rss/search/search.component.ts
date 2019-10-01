import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RssService } from '../../services/rss.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

declare var $: any;
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
  constructor(private router: Router, private activatedRoute: ActivatedRoute, public rssService: RssService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.userId = this.authenticationService.getUserId();
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.searchType = params['t'];
        this.searchValue = params['q'];
        console.log(params)
      });

    this.refresh();
  }

  refresh() {
    if (this.searchType === 'category')
      this.searchByCategory();
    else if (this.searchType === 'source')
      this.searchBySource();
    else
      this.search();
  }

  popoverToggle(divId: string) {
    var x = document.getElementById('popover' + divId);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  searchByCategory() {
    this.loading = true;
    this.rssService.searchByCategory(this.userId, this.searchValue).subscribe(
      data => {
        this.searchResponse = data;
        if (this.searchResponse.statusCode === 8105) {
          this.searchResponse.data.forEach(data => data.addNewCategory = false);
        }
      },
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

  search() {
    this.loading = true;
    let req = { "userId": this.userId, "q": this.searchValue };

    this.rssService.search(req).subscribe(
      data => {
        this.searchResponse = data;
        if (this.searchResponse.statusCode === 8105) {
          this.searchResponse.data.forEach(data => data.addNewCategory = false);
        }
      },
      error => console.log(error),
      () => this.loading = false
    );
  }

  followSource(collectionName: string, sourceId: number) {
    if (this.rssService.collectionsResponse.data) {
      let collection = this.rssService.collectionsResponse.data.find(obj => {
        return obj.title === collectionName;
      });
      if (collection !== undefined) {
        let req = { "userId": this.userId, "sourceId": sourceId, "collectionId": collection.id };
        this.addSourceToCollection(req);
      } else {
        this.createCollection(collectionName, sourceId);
      }
    } else {
      this.createCollection(collectionName, sourceId);
    }
  }

  createCollection(collectionName: string, sourceId: number) {
    let requestBody = { "userId": this.userId, "title": collectionName };
    this.rssService.createCollection(requestBody).subscribe(
      data => {
        if (data.statusCode === 8111) {
          let req = { "userId": this.userId, "sourceId": sourceId, "collectionId": data.data.id };
          this.addSourceToCollection(req);
        }

      },
      error => console.log(error),
      () => this.loading = false
    );
  }

  addSourceToCollection(req: any) {
    this.rssService.addSourceToCollection(req).subscribe(
      data => {
        // do nothing
        this.rssService.refreshTime = new Date();
      },
      error => console.log(error),
      () => { this.loading = false; this.refresh(); }
    );
  }

  removeSourceFromCollection(sourceId: number, collectionId: number) {
    let req = { "userId": this.userId, "companySourceId": sourceId, "collectionId": collectionId };
    this.rssService.removeSourceFromCollection(req).subscribe(
      data => {
        // do nothing
        this.rssService.refreshTime = new Date();
      },
      error => console.log(error),
      () => { this.loading = false; this.refresh(); }
    );
  }

  clearSearch() {
    this.router.navigate(['/home/rss/discover']);
  }

  navigateSearchPage(q: string) {
    this.router.navigate(['/home/rss/search'], { queryParams: { 'q': q } });
  }



}
