import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamAnalyticsComponent } from './dam-analytics.component';

describe('DamAnalyticsComponent', () => {
  let component: DamAnalyticsComponent;
  let fixture: ComponentFixture<DamAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
