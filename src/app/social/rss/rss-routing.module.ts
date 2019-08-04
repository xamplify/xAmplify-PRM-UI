import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RssComponent } from './rss/rss.component';
import { DiscoverComponent } from './discover/discover.component';
import { CollectionComponent } from './collection/collection.component';
import { SourceComponent } from './source/source.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
    { path: '', component: RssComponent },
    { path: 'discover', component: DiscoverComponent },
    { path: 'collections/:alias', component: CollectionComponent },
    { path: 'sources/:alias', component: SourceComponent },
    { path: 'search/category/:value', component: SearchComponent },
    { path: 'search/source/:value', component: SearchComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RssRoutingModule { }