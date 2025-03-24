import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';

import { RssComponent } from '../social/rss/rss/rss.component';
import { DiscoverComponent } from '../social/rss/discover/discover.component';
import { CollectionComponent } from '../social/rss/collection/collection.component';
import { SourceComponent } from '../social/rss/source/source.component';
import { SearchComponent } from '../social/rss/search/search.component';

/*import { SocialStatusComponent } from '../social/common/social-status/social-status.component';
*/
import { SocialLoaderComponent } from '../social/common/social-loader/social-loader.component';
import { LeftNavComponent } from '../social/rss/left-nav/left-nav.component';

@NgModule({
  imports: [SharedModule],
  declarations: [RssComponent, DiscoverComponent, CollectionComponent, SourceComponent, SearchComponent
    , SocialLoaderComponent,LeftNavComponent],
  exports: [RssComponent, DiscoverComponent, CollectionComponent, SourceComponent, SearchComponent
    , SocialLoaderComponent,LeftNavComponent],
  providers: [],
})

export class SharedRssModule { }
