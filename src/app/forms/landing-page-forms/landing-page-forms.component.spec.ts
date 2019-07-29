import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageFormsComponent } from './landing-page-forms.component';

describe('LandingPageFormsComponent', () => {
  let component: LandingPageFormsComponent;
  let fixture: ComponentFixture<LandingPageFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingPageFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
