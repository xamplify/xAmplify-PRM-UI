import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribeReasonsComponent } from './unsubscribe-reasons.component';

describe('UnsubscribeReasonsComponent', () => {
  let component: UnsubscribeReasonsComponent;
  let fixture: ComponentFixture<UnsubscribeReasonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsubscribeReasonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsubscribeReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
