import { NgModule } from '@angular/core';
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CommonComponentModule} from '../common/common.module';
import { SocialRoutingModule } from './social-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SharedRssModule } from '../shared/shared-rss.module';

import { FacebookAccountsComponent } from './facebook/facebook-accounts/facebook-accounts.component';
import { FacebookPostsComponent } from './facebook/facebook-posts/facebook-posts.component';
import { SocialManageComponent } from './common/social-manage/social-manage.component';

import { FacebookAnalyticsComponent } from './facebook/facebook-analytics/facebook-analytics.component';
import { FacebookInsightGenderAgeComponent } from './facebook/facebook-insight-gender-age/facebook-insight-gender-age.component';
import { FacebookInsightFansCountryComponent } from './facebook/facebook-insight-fans-country/facebook-insight-fans-country.component';
import { FacebookReactionsComponent } from './facebook/facebook-reactions/facebook-reactions.component';
import { FacebookCommentsComponent } from './facebook/facebook-comments/facebook-comments.component';

@NgModule( {
    imports: [CommonModule, SharedModule, SharedRssModule, SocialRoutingModule, FormsModule, CommonComponentModule],
    declarations: [SocialManageComponent, FacebookAccountsComponent, FacebookPostsComponent, FacebookAnalyticsComponent,
        FacebookInsightGenderAgeComponent, FacebookInsightFansCountryComponent, FacebookReactionsComponent, FacebookCommentsComponent],
    providers: []
})
export class SocialModule { }
