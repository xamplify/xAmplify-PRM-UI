import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SourceComponent } from './source/source.component';
import { SearchComponent } from './search/search.component';
const routes: Routes = [
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: 'sources/:alias', component: SourceComponent },
    { path: 'search', component: SearchComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RssRoutingModule { }