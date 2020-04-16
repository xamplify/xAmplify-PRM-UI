import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';

import { RssComponent } from '../social/rss/rss/rss.component';
import { FeedUpdateComponent } from '../social/rss/feed-update/feed-update.component';
import { DiscoverComponent } from '../social/rss/discover/discover.component';
import { LeftNavComponent } from '../social/rss/left-nav/left-nav.component';
import { CollectionComponent } from '../social/rss/collection/collection.component';
import { SourceComponent } from '../social/rss/source/source.component';
import { FeedComponent } from '../social/rss/feed/feed.component';
import { RssLoaderComponent } from '../social/rss/rss-loader/rss-loader.component';
import { SearchComponent } from '../social/rss/search/search.component';

import { UpdateStatusComponent } from '../social/common/update-status/update-status.component';
/*import { SocialStatusComponent } from '../social/common/social-status/social-status.component';
*/
import { ConnectAccountsComponent } from '../social/common/connect-accounts/connect-accounts.component';
import { SocialLoaderComponent } from '../social/common/social-loader/social-loader.component';

@NgModule({
        imports: [SharedModule],
        declarations: [RssComponent, FeedUpdateComponent, DiscoverComponent, LeftNavComponent, CollectionComponent, SourceComponent, FeedComponent, RssLoaderComponent, SearchComponent
        ,UpdateStatusComponent, ConnectAccountsComponent, SocialLoaderComponent],
        exports: [RssComponent, FeedUpdateComponent, DiscoverComponent, LeftNavComponent, CollectionComponent, SourceComponent, FeedComponent, RssLoaderComponent, SearchComponent
          ,UpdateStatusComponent, ConnectAccountsComponent, SocialLoaderComponent],
        providers: [],
})

export class SharedRssModule { }
