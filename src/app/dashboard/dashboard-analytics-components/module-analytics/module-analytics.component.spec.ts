import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleAnalyticsComponent } from './module-analytics.component';

describe('ModuleAnalyticsComponent', () => {
  let component: ModuleAnalyticsComponent;
  let fixture: ComponentFixture<ModuleAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
