import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../shared/shared.module";
import { ErrorPagesModule } from "../error-pages/error-pages.module";
import { CommonComponentModule } from "../common/common.module";
import { FormService } from './services/form.service';
import {FormsRoutingModule} from "./forms-routing.module";

import { AddFormComponent } from './add-form/add-form.component';
import { ManageFormComponent } from './manage-form/manage-form.component';



@NgModule( {
    imports: [
        CommonModule, SharedModule, ErrorPagesModule,CommonComponentModule,FormsRoutingModule
    ],
    declarations: [AddFormComponent, ManageFormComponent],
    providers: [FormService]
} )
export class FormsModule { }
