import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../shared/shared.module";
import { RssRoutingModule } from './rss-routing.module';
import { RssComponent } from './rss/rss.component';
import { DiscoverComponent } from './discover/discover.component';
import { LeftNavComponent } from './left-nav/left-nav.component';
import { CollectionComponent } from './collection/collection.component';
import { SourceComponent } from './source/source.component';
import { FeedComponent } from './feed/feed.component';
import { RssLoaderComponent } from './rss-loader/rss-loader.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  imports: [CommonModule, RssRoutingModule, FormsModule],
  declarations: [RssComponent, DiscoverComponent, LeftNavComponent, CollectionComponent, SourceComponent, FeedComponent, RssLoaderComponent, SearchComponent],
  exports: [RssComponent, DiscoverComponent, LeftNavComponent, CollectionComponent, SourceComponent, FeedComponent, RssLoaderComponent]
})
export class RssModule { }
