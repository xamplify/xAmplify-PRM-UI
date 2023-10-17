import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribeReasonModalComponent } from './unsubscribe-reason-modal.component';

describe('UnsubscribeReasonModalComponent', () => {
  let component: UnsubscribeReasonModalComponent;
  let fixture: ComponentFixture<UnsubscribeReasonModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsubscribeReasonModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsubscribeReasonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
