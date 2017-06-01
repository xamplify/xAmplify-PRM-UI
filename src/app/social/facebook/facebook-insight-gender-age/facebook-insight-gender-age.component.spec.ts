import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookInsightGenderAgeComponent } from './facebook-insight-gender-age.component';

describe('FacebookInsightGenderAgeComponent', () => {
  let component: FacebookInsightGenderAgeComponent;
  let fixture: ComponentFixture<FacebookInsightGenderAgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacebookInsightGenderAgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookInsightGenderAgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
