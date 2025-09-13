import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VanitySocialContactsCallbackComponent } from './vanity-social-contacts-callback.component';

describe('VanitySocialContactsCallbackComponent', () => {
  let component: VanitySocialContactsCallbackComponent;
  let fixture: ComponentFixture<VanitySocialContactsCallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VanitySocialContactsCallbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VanitySocialContactsCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
