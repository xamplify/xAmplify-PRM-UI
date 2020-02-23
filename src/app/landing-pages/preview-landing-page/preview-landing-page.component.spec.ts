import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewLandingPageComponent } from './preview-landing-page.component';

describe('PreviewLandingPageComponent', () => {
  let component: PreviewLandingPageComponent;
  let fixture: ComponentFixture<PreviewLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
