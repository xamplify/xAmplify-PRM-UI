import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantNavigationLinksDashboardComponent } from './instant-navigation-links-dashboard.component';

describe('InstantNavigationLinksDashboardComponent', () => {
  let component: InstantNavigationLinksDashboardComponent;
  let fixture: ComponentFixture<InstantNavigationLinksDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstantNavigationLinksDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstantNavigationLinksDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
