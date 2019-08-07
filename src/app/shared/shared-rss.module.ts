import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';

import { RssComponent } from '../social/rss/rss/rss.component';
import { DiscoverComponent } from '../social/rss/discover/discover.component';
import { LeftNavComponent } from '../social/rss/left-nav/left-nav.component';
import { CollectionComponent } from '../social/rss/collection/collection.component';
import { SourceComponent } from '../social/rss/source/source.component';
import { FeedComponent } from '../social/rss/feed/feed.component';
import { RssLoaderComponent } from '../social/rss/rss-loader/rss-loader.component';
import { SearchComponent } from '../social/rss/search/search.component';

@NgModule({
        imports: [SharedModule],
        declarations: [RssComponent, DiscoverComponent, LeftNavComponent, CollectionComponent, SourceComponent, FeedComponent, RssLoaderComponent, SearchComponent],
        exports: [RssComponent, DiscoverComponent, LeftNavComponent, CollectionComponent, SourceComponent, FeedComponent, RssLoaderComponent, SearchComponent],
        providers: [],
})

export class SharedRssModule { }
