import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// import { UiSwitchModule } from '../../../node_modules/angular2-ui-switch/src';
import { UiSwitchModule } from 'ngx-ui-switch/src';

// import { ColorPickerService } from 'angular2-color-picker';
// import { ColorPickerDirective } from 'angular2-color-picker';
import { ColorPickerModule } from 'ngx-color-picker';
import { TagInputModule } from 'ng2-tag-input';
import { HttpModule } from '@angular/http';


import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
import {LoaderComponent} from '../loader/loader.component';
import { ErrorPagesComponent } from '../error-pages/error-pages.component';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import {BusyModule} from 'angular2-busy';
import { TimepickerModule } from 'ngx-bootstrap';
import { CKEditorModule } from 'ng2-ckeditor';
import {CkEditor} from "../campaigns/ck-editor.directive";
@NgModule({
       imports: [ CommonModule, RouterModule, FileUploadModule, ReactiveFormsModule, FormsModule, UiSwitchModule,
                TagInputModule, HttpModule, Ng2FilterPipeModule,  ColorPickerModule,BusyModule,TimepickerModule.forRoot(),CKEditorModule
                ,JWBootstrapSwitchModule],
       declarations: [ LoaderComponent, ErrorPagesComponent,CkEditor ],
        exports : [ FileSelectDirective, FileDropDirective, FormsModule, CommonModule, RouterModule, ColorPickerModule,
                FileUploadModule, ReactiveFormsModule, FormsModule, UiSwitchModule, TagInputModule,JWBootstrapSwitchModule,
                HttpModule, Ng2FilterPipeModule, LoaderComponent, ErrorPagesComponent,BusyModule,TimepickerModule,CkEditor],
       providers: [ ],
})

export class SharedModule { }
