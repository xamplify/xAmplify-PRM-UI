import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLandingPageComponent } from './manage-landing-page.component';

describe('ManageLandingPageComponent', () => {
  let component: ManageLandingPageComponent;
  let fixture: ComponentFixture<ManageLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
