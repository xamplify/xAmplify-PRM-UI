import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerNotificationComponent } from './partner-notification.component';

describe('PartnerNotificationComponent', () => {
  let component: PartnerNotificationComponent;
  let fixture: ComponentFixture<PartnerNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
