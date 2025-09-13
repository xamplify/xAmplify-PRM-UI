import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnersStatisticsComponent } from './partners-statistics.component';

describe('PartnersStatisticsComponent', () => {
  let component: PartnersStatisticsComponent;
  let fixture: ComponentFixture<PartnersStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnersStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnersStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
