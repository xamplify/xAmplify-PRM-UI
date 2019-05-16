import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSpamCheckComponent } from './email-spam-check.component';

describe('EmailSpamCheckComponent', () => {
  let component: EmailSpamCheckComponent;
  let fixture: ComponentFixture<EmailSpamCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailSpamCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSpamCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
