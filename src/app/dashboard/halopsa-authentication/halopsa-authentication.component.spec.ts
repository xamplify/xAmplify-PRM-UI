import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HalopsaAuthenticationComponent } from './halopsa-authentication.component';

describe('HalopsaAuthenticationComponent', () => {
  let component: HalopsaAuthenticationComponent;
  let fixture: ComponentFixture<HalopsaAuthenticationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HalopsaAuthenticationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HalopsaAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
