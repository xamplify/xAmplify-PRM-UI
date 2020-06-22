import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VanitySocialLoginComponent } from './vanity-social-login.component';

describe('VanitySocialLoginComponent', () => {
  let component: VanitySocialLoginComponent;
  let fixture: ComponentFixture<VanitySocialLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VanitySocialLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VanitySocialLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
