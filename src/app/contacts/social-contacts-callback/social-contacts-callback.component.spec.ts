import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialContactsCallbackComponent } from './social-contacts-callback.component';

describe('SocialContactsCallbackComponent', () => {
  let component: SocialContactsCallbackComponent;
  let fixture: ComponentFixture<SocialContactsCallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialContactsCallbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialContactsCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
