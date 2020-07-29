import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RssComponent } from './rss/rss.component';
import { DiscoverComponent } from './discover/discover.component';
import { CollectionComponent } from './collection/collection.component';
import { SourceComponent } from './source/source.component';
import { SearchComponent } from './search/search.component';
import { AddCustomFeedsComponent } from './add-custom-feeds/add-custom-feeds.component';
import { ManageCustomFeedsComponent } from './manage-custom-feeds/manage-custom-feeds.component';
const routes: Routes = [
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: 'welcome', component: RssComponent },
    { path: 'discover', component: DiscoverComponent },
    { path: 'collections/:alias', component: CollectionComponent },
    { path: 'sources/:alias', component: SourceComponent },
    { path: 'search', component: SearchComponent },
    { path: 'add-custom-feed', component: AddCustomFeedsComponent },
    { path: 'edit-custom-feed/:feedId', component: AddCustomFeedsComponent },
    { path: 'manage-custom-feed', component: ManageCustomFeedsComponent },
    { path: 'manage-custom-feed/:type', component: ManageCustomFeedsComponent },
    { path: 'manage-custom-feed/:type/:vendorCompanyId', component: ManageCustomFeedsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RssRoutingModule { }