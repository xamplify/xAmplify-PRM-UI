import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplatePreviewUtilComponent } from './email-template-preview-util.component';

describe('EmailTemplatePreviewUtilComponent', () => {
  let component: EmailTemplatePreviewUtilComponent;
  let fixture: ComponentFixture<EmailTemplatePreviewUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTemplatePreviewUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplatePreviewUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
