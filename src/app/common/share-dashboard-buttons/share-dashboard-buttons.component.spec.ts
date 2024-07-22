import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareDashboardButtonsComponent } from './share-dashboard-buttons.component';

describe('ShareDashboardButtonsComponent', () => {
  let component: ShareDashboardButtonsComponent;
  let fixture: ComponentFixture<ShareDashboardButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareDashboardButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareDashboardButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
