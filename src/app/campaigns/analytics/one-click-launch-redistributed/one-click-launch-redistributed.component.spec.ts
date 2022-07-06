import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneClickLaunchRedistributedComponent } from './one-click-launch-redistributed.component';

describe('OneClickLaunchRedistributedComponent', () => {
  let component: OneClickLaunchRedistributedComponent;
  let fixture: ComponentFixture<OneClickLaunchRedistributedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneClickLaunchRedistributedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneClickLaunchRedistributedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
