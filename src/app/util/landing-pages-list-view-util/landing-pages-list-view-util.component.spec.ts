import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPagesListViewUtilComponent } from './landing-pages-list-view-util.component';

describe('LandingPagesListViewUtilComponent', () => {
  let component: LandingPagesListViewUtilComponent;
  let fixture: ComponentFixture<LandingPagesListViewUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingPagesListViewUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPagesListViewUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
