import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectwiseAuthenticationPopupComponent } from './connectwise-authentication-popup.component';

describe('ConnectwiseAuthenticationPopupComponent', () => {
  let component: ConnectwiseAuthenticationPopupComponent;
  let fixture: ComponentFixture<ConnectwiseAuthenticationPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectwiseAuthenticationPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectwiseAuthenticationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
