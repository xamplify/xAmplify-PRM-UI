import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AircallDialerComponent } from './aircall-dialer.component';

describe('AircallDialerComponent', () => {
  let component: AircallDialerComponent;
  let fixture: ComponentFixture<AircallDialerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AircallDialerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AircallDialerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
