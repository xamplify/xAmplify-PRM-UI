import { NgModule } from '@angular/core';
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SocialRoutingModule } from './social-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SharedRssModule } from '../shared/shared-rss.module';


@NgModule( {
    imports: [CommonModule, SharedModule, SharedRssModule, SocialRoutingModule, FormsModule],
    declarations: [
        ],
    providers: []
})
export class SocialModule { }
