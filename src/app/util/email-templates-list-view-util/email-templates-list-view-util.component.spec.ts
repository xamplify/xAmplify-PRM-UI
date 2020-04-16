import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplatesListViewUtilComponent } from './email-templates-list-view-util.component';

describe('EmailTemplatesListViewUtilComponent', () => {
  let component: EmailTemplatesListViewUtilComponent;
  let fixture: ComponentFixture<EmailTemplatesListViewUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTemplatesListViewUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplatesListViewUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
