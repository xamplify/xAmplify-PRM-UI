import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPagesListAndGridViewComponent } from './landing-pages-list-and-grid-view.component';

describe('LandingPagesListAndGridViewComponent', () => {
  let component: LandingPagesListAndGridViewComponent;
  let fixture: ComponentFixture<LandingPagesListAndGridViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingPagesListAndGridViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPagesListAndGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
