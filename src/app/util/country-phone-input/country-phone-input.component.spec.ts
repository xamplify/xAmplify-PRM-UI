import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryPhoneInputComponent } from './country-phone-input.component';

describe('CountryPhoneInputComponent', () => {
  let component: CountryPhoneInputComponent;
  let fixture: ComponentFixture<CountryPhoneInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryPhoneInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryPhoneInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
