import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTimeLineComponent } from './view-time-line.component';

describe('ViewTimeLineComponent', () => {
  let component: ViewTimeLineComponent;
  let fixture: ComponentFixture<ViewTimeLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTimeLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTimeLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
