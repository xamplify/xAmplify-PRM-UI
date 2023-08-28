import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveThreadsInfoComponent } from './active-threads-info.component';

describe('ActiveThreadsInfoComponent', () => {
  let component: ActiveThreadsInfoComponent;
  let fixture: ComponentFixture<ActiveThreadsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveThreadsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveThreadsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
