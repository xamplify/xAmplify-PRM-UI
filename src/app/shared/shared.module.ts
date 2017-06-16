import { NgModule } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

//import { UiSwitchModule } from '../../../node_modules/angular2-ui-switch/src';
import { UiSwitchModule } from 'ngx-ui-switch/src';
//import { NKDatetimeModule } from 'ng2-datetime';

import { ColorPickerService } from 'angular2-color-picker';
import { ColorPickerDirective } from 'angular2-color-picker';
import { TagInputModule } from 'ng2-tag-input';
import { HttpModule } from '@angular/http';
import { CKEditorModule } from 'ng2-ckeditor';

import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
import {LoaderComponent} from '../loader/loader.component';

@NgModule({
	 imports: [ CommonModule,RouterModule, FileUploadModule, ReactiveFormsModule, FormsModule, UiSwitchModule,
	           TagInputModule, HttpModule, CKEditorModule, Ng2FilterPipeModule ],
	           
	 declarations: [ ColorPickerDirective,LoaderComponent ],
	 
	 exports :[ FileSelectDirective, ColorPickerDirective, FileDropDirective, FormsModule, CommonModule, RouterModule,
	           FileUploadModule, ReactiveFormsModule, FormsModule, UiSwitchModule, TagInputModule, 
	           HttpModule, CKEditorModule, Ng2FilterPipeModule,LoaderComponent ],
	              
	 providers: [ ColorPickerService ],  
})

export class SharedModule { }
