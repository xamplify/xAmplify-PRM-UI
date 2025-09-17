import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesInfoComponent } from './devices-info.component';

describe('DevicesInfoComponent', () => {
  let component: DevicesInfoComponent;
  let fixture: ComponentFixture<DevicesInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicesInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
