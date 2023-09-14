import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplatesListAndGridViewComponent } from './email-templates-list-and-grid-view.component';

describe('EmailTemplatesListAndGridViewComponent', () => {
  let component: EmailTemplatesListAndGridViewComponent;
  let fixture: ComponentFixture<EmailTemplatesListAndGridViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTemplatesListAndGridViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplatesListAndGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
