import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLandingPageComponent } from './show-landing-page.component';

describe('ShowLandingPageComponent', () => {
  let component: ShowLandingPageComponent;
  let fixture: ComponentFixture<ShowLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
