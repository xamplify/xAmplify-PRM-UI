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
import { ManageFormComponent } from 'app/forms/manage-form/manage-form.component';
import { FormDetailResponseComponent } from 'app/forms/form-detail-response/form-detail-response.component';
import { FormService } from 'app/forms/services/form.service';
import { CustomAddLeadComponent } from 'app/leads/custom-add-lead/custom-add-lead.component';
import { SelectLeadComponent } from 'app/deals/select-lead/select-lead.component';
import { CustomManageLeadsComponent } from 'app/leads/custom-manage-leads/custom-manage-leads.component';
import { CustomManageDealsComponent } from 'app/deals/custom-manage-deals/custom-manage-deals.component';
import { CKEditorModule } from "ng2-ckeditor";
import { AgmCoreModule } from '@agm/core';
import { MarketplaceUtilComponent } from 'app/util/marketplace-util/marketplace-util.component';
import { MarketplaceMapUtilComponent } from 'app/util/marketplace-map-util/marketplace-map-util.component';
import { FormAnalyticsUtilComponent } from 'app/util/form-analytics-util/form-analytics-util.component';
import { SelectContactComponent } from 'app/deals/select-contact/select-contact.component';
import { WelcomeEmailListComponent } from 'app/util/welcome-email-list/welcome-email-list.component';

@NgModule({
        imports: [CommonModule, RouterModule, FileUploadModule, ReactiveFormsModule, FormsModule, UiSwitchModule,
                  HttpModule, Ng2FilterPipeModule, ColorPickerModule, TimepickerModule.forRoot(),
                  BootstrapSwitchModule.forRoot(),ImageCropperModule , TimezonePickerModule, LoadingModule, 
                  CommonComponentModule,NgxCurrencyModule,DragulaModule, AngularMultiSelectModule, CKEditorModule,
                  AgmCoreModule.forRoot({ apiKey: "AIzaSyAOFRgJ4DduOovKv1nuwutG7pPJ76n3hbk"
                  })
                  ],

        declarations: [AddDealComponent,SfDealComponent,DynamicGridLoaderComponent,
                LefsideNavigationLoaderComponent, EditVideoComponent, PlayVideoComponent, ManageFormComponent,FormDetailResponseComponent, CustomAddLeadComponent, SelectLeadComponent,
                CustomManageLeadsComponent, CustomManageDealsComponent,  MarketplaceUtilComponent, MarketplaceMapUtilComponent, FormAnalyticsUtilComponent,
                 SelectContactComponent,WelcomeEmailListComponent], 
        exports: [FileSelectDirective, FileDropDirective, FormsModule, CommonModule, RouterModule, ColorPickerModule,
                  FileUploadModule, ReactiveFormsModule, FormsModule, UiSwitchModule,CommonComponentModule,
                  HttpModule, Ng2FilterPipeModule, ImageCropperModule, TimepickerModule,
                  BootstrapSwitchModule, TimezonePickerModule, LoadingModule,
                  NgxCurrencyModule,DragulaModule,AddDealComponent,SfDealComponent,
                  DynamicGridLoaderComponent,TranslateModule,AngularMultiSelectModule,LefsideNavigationLoaderComponent,
                EditVideoComponent, PlayVideoComponent, ManageFormComponent,FormDetailResponseComponent, CustomAddLeadComponent, SelectLeadComponent, CustomManageLeadsComponent,
                CustomManageDealsComponent, AgmCoreModule, MarketplaceUtilComponent, MarketplaceMapUtilComponent, FormAnalyticsUtilComponent,
                SelectContactComponent,WelcomeEmailListComponent],
        providers: [FormService],
})

export class SharedModule { }
