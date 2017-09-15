import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UiSwitchModule } from 'ngx-ui-switch/src';
import { ColorPickerModule } from 'ngx-color-picker';
import { TagInputModule } from 'ngx-chips';
import { HttpModule } from '@angular/http';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
import { LoaderComponent } from '../loader/loader.component';
import { ErrorPagesComponent } from '../error-pages/error-pages.component';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { BusyModule } from 'tixif-ngx-busy';
import { TimepickerModule } from 'ngx-bootstrap';
import { BootstrapSwitchModule } from 'angular2-bootstrap-switch';
@NgModule({
        imports: [CommonModule, RouterModule, FileUploadModule, ReactiveFormsModule, FormsModule, UiSwitchModule,
                TagInputModule, HttpModule, Ng2FilterPipeModule, ColorPickerModule, BusyModule, TimepickerModule.forRoot()
                , JWBootstrapSwitchModule,  BootstrapSwitchModule.forRoot()],
        declarations: [LoaderComponent, ErrorPagesComponent],
        exports: [FileSelectDirective, FileDropDirective, FormsModule, CommonModule, RouterModule, ColorPickerModule,
                FileUploadModule, ReactiveFormsModule, FormsModule, UiSwitchModule, TagInputModule,
                HttpModule, Ng2FilterPipeModule, LoaderComponent, ErrorPagesComponent, BusyModule, TimepickerModule,
                JWBootstrapSwitchModule, BootstrapSwitchModule],
        providers: [],
})

export class SharedModule { }
