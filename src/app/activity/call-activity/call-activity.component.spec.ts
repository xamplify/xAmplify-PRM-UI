import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallActivityComponent } from './call-activity.component';

describe('CallActivityComponent', () => {
  let component: CallActivityComponent;
  let fixture: ComponentFixture<CallActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
