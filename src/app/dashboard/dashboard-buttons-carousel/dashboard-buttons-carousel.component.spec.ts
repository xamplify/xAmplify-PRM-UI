import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardButtonsCarouselComponent } from './dashboard-buttons-carousel.component';

describe('DashboardButtonsCarouselComponent', () => {
  let component: DashboardButtonsCarouselComponent;
  let fixture: ComponentFixture<DashboardButtonsCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardButtonsCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardButtonsCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
