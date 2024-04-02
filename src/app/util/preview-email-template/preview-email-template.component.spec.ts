import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewEmailTemplateComponent } from './preview-email-template.component';

describe('PreviewEmailTemplateComponent', () => {
  let component: PreviewEmailTemplateComponent;
  let fixture: ComponentFixture<PreviewEmailTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewEmailTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
