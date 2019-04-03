import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMarketoEmailTemplateComponent } from './upload-marketo-email-template.component';

describe('UploadMarketoEmailTemplateComponent', () => {
  let component: UploadMarketoEmailTemplateComponent;
  let fixture: ComponentFixture<UploadMarketoEmailTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadMarketoEmailTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadMarketoEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
