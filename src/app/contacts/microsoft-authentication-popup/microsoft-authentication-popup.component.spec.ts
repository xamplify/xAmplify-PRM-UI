import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrosoftAuthenticationPopupComponent } from './microsoft-authentication-popup.component';

describe('MicrosoftAuthenticationPopupComponent', () => {
  let component: MicrosoftAuthenticationPopupComponent;
  let fixture: ComponentFixture<MicrosoftAuthenticationPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicrosoftAuthenticationPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicrosoftAuthenticationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
