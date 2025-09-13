import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAsPartnerComponent } from './login-as-partner.component';

describe('LoginAsPartnerComponent', () => {
  let component: LoginAsPartnerComponent;
  let fixture: ComponentFixture<LoginAsPartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginAsPartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginAsPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
