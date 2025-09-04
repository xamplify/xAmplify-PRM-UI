import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogUnsubscribeComponent } from './log-unsubscribe.component';

describe('LogUnsubscribeComponent', () => {
  let component: LogUnsubscribeComponent;
  let fixture: ComponentFixture<LogUnsubscribeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogUnsubscribeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogUnsubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
