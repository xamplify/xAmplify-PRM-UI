import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookInsightFansCountryComponent } from './facebook-insight-fans-country.component';

describe('FacebookInsightFansCountryComponent', () => {
  let component: FacebookInsightFansCountryComponent;
  let fixture: ComponentFixture<FacebookInsightFansCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacebookInsightFansCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookInsightFansCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
