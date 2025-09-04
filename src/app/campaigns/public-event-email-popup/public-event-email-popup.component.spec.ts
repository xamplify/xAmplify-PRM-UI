import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicEventEmailPopupComponent } from './public-event-email-popup.component';

describe('PublicEventEmailPopupComponent', () => {
  let component: PublicEventEmailPopupComponent;
  let fixture: ComponentFixture<PublicEventEmailPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicEventEmailPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicEventEmailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
