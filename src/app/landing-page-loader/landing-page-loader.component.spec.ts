import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageLoaderComponent } from './landing-page-loader.component';

describe('LandingPageLoaderComponent', () => {
  let component: LandingPageLoaderComponent;
  let fixture: ComponentFixture<LandingPageLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingPageLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
