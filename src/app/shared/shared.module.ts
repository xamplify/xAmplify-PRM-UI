import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UiSwitchModule } from 'ngx-ui-switch';
import { ColorPickerModule } from 'ngx-color-picker';
import { TagInputModule } from 'ngx-chips';
import { HttpModule } from '@angular/http';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
import { BusyModule } from 'tixif-ngx-busy';
import { TimepickerModule } from 'ngx-bootstrap';
import { BootstrapSwitchModule } from 'angular2-bootstrap-switch';
import { TimezonePickerModule } from 'ng2-timezone-selector';

import { LoaderComponent } from '../loader/loader.component';
import { UpdateStatusComponent } from '../social/common/update-status/update-status.component';
import { ConnectAccountsComponent } from '../social/common/connect-accounts/connect-accounts.component';

@NgModule({
        imports: [CommonModule, RouterModule, FileUploadModule, ReactiveFormsModule, FormsModule, UiSwitchModule,
                TagInputModule, HttpModule, Ng2FilterPipeModule, ColorPickerModule, BusyModule, TimepickerModule.forRoot()
                , BootstrapSwitchModule.forRoot(), TimezonePickerModule],
        declarations: [LoaderComponent, UpdateStatusComponent, ConnectAccountsComponent],
        exports: [FileSelectDirective, FileDropDirective, FormsModule, CommonModule, RouterModule, ColorPickerModule,
                FileUploadModule, ReactiveFormsModule, FormsModule, UiSwitchModule, TagInputModule,
                HttpModule, Ng2FilterPipeModule, LoaderComponent, BusyModule, TimepickerModule,
                BootstrapSwitchModule, TimezonePickerModule, UpdateStatusComponent, ConnectAccountsComponent],
        providers: [],
})

export class SharedModule { }
