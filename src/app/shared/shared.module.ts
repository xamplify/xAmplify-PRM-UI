import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ColorPickerModule } from 'ngx-color-picker';
import { HttpModule } from '@angular/http';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
import { TimepickerModule } from 'ngx-bootstrap';
import { BootstrapSwitchModule } from 'angular2-bootstrap-switch';
import { TimezonePickerModule } from 'ng2-timezone-selector';
import { LoadingModule } from 'ngx-loading';
import { LefsideNavigationLoaderComponent } from '../lefside-navigation-loader/lefside-navigation-loader.component';
import { DynamicGridLoaderComponent } from '../dynamic-grid-loader/dynamic-grid-loader.component';
import { CommonComponentModule } from '../common/common.module';
import { NgxCurrencyModule } from "ngx-currency";
import { ImageCropperModule } from 'ng2-img-cropper';
import { DragulaModule } from 'ng2-dragula';
import { AddDealComponent } from '../deals/add-deal/add-deal.component';
import { SfDealComponent } from 'app/deal-registration/sf-deal/sf-deal.component';
import { TranslateModule } from '@ngx-translate/core';
import { AngularMultiSelectModule } from 'angular4-multiselect-dropdown/angular4-multiselect-dropdown';
import { EditVideoComponent } from 'app/videos/manage-video/edit-video/edit-video.component';
import { PlayVideoComponent } from 'app/videos/manage-video/play-video/play-video.component';
import { LandingPageAnalyticsComponent } from 'app/landing-pages/landing-page-analytics/landing-page-analytics.component';
import { ManageFormComponent } from 'app/forms/manage-form/manage-form.component';
import { FormDetailResponseComponent } from 'app/forms/form-detail-response/form-detail-response.component';
import { FormService } from 'app/forms/services/form.service';
import { CustomAddLeadComponent } from 'app/leads/custom-add-lead/custom-add-lead.component';
import { SelectLeadComponent } from 'app/deals/select-lead/select-lead.component';
import { VendorJourneyAnalyticsComponent } from 'app/util/vendor-journey-analytics/vendor-journey-analytics.component';
@NgModule({
        imports: [CommonModule, RouterModule, FileUploadModule, ReactiveFormsModule, FormsModule, UiSwitchModule,
                  HttpModule, Ng2FilterPipeModule, ColorPickerModule, TimepickerModule.forRoot(),
                  BootstrapSwitchModule.forRoot(),ImageCropperModule , TimezonePickerModule, LoadingModule, 
                  CommonComponentModule,NgxCurrencyModule,DragulaModule, AngularMultiSelectModule],

        declarations: [AddDealComponent,SfDealComponent,DynamicGridLoaderComponent,
                LefsideNavigationLoaderComponent, EditVideoComponent, PlayVideoComponent, LandingPageAnalyticsComponent, ManageFormComponent,FormDetailResponseComponent, CustomAddLeadComponent, SelectLeadComponent,VendorJourneyAnalyticsComponent ],

        exports: [FileSelectDirective, FileDropDirective, FormsModule, CommonModule, RouterModule, ColorPickerModule,
                  FileUploadModule, ReactiveFormsModule, FormsModule, UiSwitchModule,CommonComponentModule,
                  HttpModule, Ng2FilterPipeModule, ImageCropperModule, TimepickerModule,
                  BootstrapSwitchModule, TimezonePickerModule, LoadingModule,
                  NgxCurrencyModule,DragulaModule,AddDealComponent,SfDealComponent,
                  DynamicGridLoaderComponent,TranslateModule,AngularMultiSelectModule,LefsideNavigationLoaderComponent,
                EditVideoComponent, PlayVideoComponent, LandingPageAnalyticsComponent, ManageFormComponent,FormDetailResponseComponent, CustomAddLeadComponent, SelectLeadComponent, VendorJourneyAnalyticsComponent],
        providers: [FormService],
})

export class SharedModule { }
