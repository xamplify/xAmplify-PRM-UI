import { NgModule } from '@angular/core';
import { CommonModule }       from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import {ConfirmModule} from 'angular2-bootstrap-confirm';

import { UiSwitchModule } from 'angular2-ui-switch'
import { NKDatetimeModule } from 'ng2-datetime';

import {ColorPickerService} from 'angular2-color-picker';
import {ColorPickerDirective} from 'angular2-color-picker';
import { TagInputModule } from 'ng2-tag-input';
import {ChartModule} from 'angular2-highcharts';
import { HttpModule } from '@angular/http';
import { CKEditorModule } from 'ng2-ckeditor';
import {DropdownModule} from "ng2-dropdown";

import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import {FileUploadModule} from 'ng2-file-upload/ng2-file-upload';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';

@NgModule({
	 imports: [CommonModule,RouterModule,FileUploadModule,NKDatetimeModule,ReactiveFormsModule,ConfirmModule,FormsModule,
	              TagInputModule,ChartModule,HttpModule,CKEditorModule,UiSwitchModule,DropdownModule,Ng2FilterPipeModule],
	    declarations: [ColorPickerDirective],
	    exports :[FileSelectDirective,ColorPickerDirective,FileDropDirective,FormsModule,CommonModule,RouterModule,FileUploadModule,
	             NKDatetimeModule,ReactiveFormsModule,ConfirmModule,FormsModule,
	             TagInputModule,ChartModule,HttpModule,CKEditorModule,UiSwitchModule,DropdownModule,Ng2FilterPipeModule],
	    providers: [ColorPickerService],  
})

export class SharedModule { }
