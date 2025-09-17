import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveQueriesComponent } from './active-queries.component';

describe('ActiveQueriesComponent', () => {
  let component: ActiveQueriesComponent;
  let fixture: ComponentFixture<ActiveQueriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveQueriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveQueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
