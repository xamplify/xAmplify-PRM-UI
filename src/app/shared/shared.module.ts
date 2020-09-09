import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UiSwitchModule } from 'ngx-ui-switch';
import { ColorPickerModule } from 'ngx-color-picker';
/*import { TagInputModule } from 'ngx-chips';
*/
import { HttpModule } from '@angular/http';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
import { TimepickerModule } from 'ngx-bootstrap';
import { BootstrapSwitchModule } from 'angular2-bootstrap-switch';
import { TimezonePickerModule } from 'ng2-timezone-selector';
import { LoadingModule } from 'ngx-loading';


/*import { LoaderComponent } from '../loader/loader.component';
*/import { CountLoaderComponent } from '../count-loader/count-loader.component';
import { BoxLoaderComponent } from '../box-loader/box-loader.component';
import { DynamicGridLoaderComponent } from '../dynamic-grid-loader/dynamic-grid-loader.component';


// import { UpdateStatusComponent } from '../social/common/update-status/update-status.component';
// import { SocialStatusComponent } from '../social/common/social-status/social-status.component';
// import { ConnectAccountsComponent } from '../social/common/connect-accounts/connect-accounts.component';
// import { SocialLoaderComponent } from '../social/common/social-loader/social-loader.component';

import { CommonComponentModule } from '../common/common.module';
import { NgxCurrencyModule } from "ngx-currency";
import { ImageCropperModule } from 'ng2-img-cropper';
import { DragulaModule } from 'ng2-dragula';
import { SfDealComponent } from 'app/deal-registration/sf-deal/sf-deal.component';
import { TranslateModule } from '@ngx-translate/core';
import { AngularMultiSelectModule } from 'angular4-multiselect-dropdown/angular4-multiselect-dropdown';

@NgModule({
        imports: [CommonModule, RouterModule, FileUploadModule, ReactiveFormsModule, FormsModule, UiSwitchModule,
                  HttpModule, Ng2FilterPipeModule, ColorPickerModule, TimepickerModule.forRoot(),
                  BootstrapSwitchModule.forRoot(),ImageCropperModule , TimezonePickerModule, LoadingModule, CommonComponentModule,NgxCurrencyModule,DragulaModule, AngularMultiSelectModule],

        declarations: [CountLoaderComponent,SfDealComponent,BoxLoaderComponent,DynamicGridLoaderComponent],

        exports: [FileSelectDirective, FileDropDirective, FormsModule, CommonModule, RouterModule, ColorPickerModule,
                  FileUploadModule, ReactiveFormsModule, FormsModule, UiSwitchModule,CommonComponentModule,
                  HttpModule, Ng2FilterPipeModule, ImageCropperModule, TimepickerModule,
                  BootstrapSwitchModule, TimezonePickerModule, LoadingModule,
                  NgxCurrencyModule,CountLoaderComponent,DragulaModule,SfDealComponent,BoxLoaderComponent,DynamicGridLoaderComponent,TranslateModule,AngularMultiSelectModule],
        providers: [],
})

export class SharedModule { }
