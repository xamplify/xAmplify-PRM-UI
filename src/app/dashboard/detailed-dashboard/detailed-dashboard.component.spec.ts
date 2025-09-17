import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedDashboardComponent } from './detailed-dashboard.component';

describe('DetailedDashboardComponent', () => {
  let component: DetailedDashboardComponent;
  let fixture: ComponentFixture<DetailedDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
