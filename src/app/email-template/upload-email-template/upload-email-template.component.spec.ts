import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadEmailTemplateComponent } from './upload-email-template.component';

describe('UploadEmailTemplateComponent', () => {
  let component: UploadEmailTemplateComponent;
  let fixture: ComponentFixture<UploadEmailTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadEmailTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
