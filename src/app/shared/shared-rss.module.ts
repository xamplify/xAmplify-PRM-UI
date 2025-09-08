import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';

import { SourceComponent } from '../social/rss/source/source.component';
import { SearchComponent } from '../social/rss/search/search.component';



@NgModule({
  imports: [SharedModule],
  declarations: [SourceComponent, SearchComponent
     ],
  exports: [SourceComponent, SearchComponent
    ],
  providers: [],
})

export class SharedRssModule { }
