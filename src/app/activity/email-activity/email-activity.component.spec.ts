import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailActivityComponent } from './email-activity.component';

describe('EmailActivityComponent', () => {
  let component: EmailActivityComponent;
  let fixture: ComponentFixture<EmailActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
