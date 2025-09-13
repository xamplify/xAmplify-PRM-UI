import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternationalPhoneModule } from 'ng4-intl-phone';
import { MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { CheckBoxModule, ButtonModule } from '@syncfusion/ej2-angular-buttons';

@NgModule({
  imports: [
    CommonModule, InternationalPhoneModule,MultiSelectAllModule,CheckBoxModule, ButtonModule
  ],
  declarations: [],
  exports: [InternationalPhoneModule,MultiSelectAllModule,CheckBoxModule, ButtonModule]
})
export class SharedLibraryModule { }
