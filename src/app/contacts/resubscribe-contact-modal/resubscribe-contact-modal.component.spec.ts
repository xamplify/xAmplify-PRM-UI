import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResubscribeContactModalComponent } from './resubscribe-contact-modal.component';

describe('ResubscribeContactModalComponent', () => {
  let component: ResubscribeContactModalComponent;
  let fixture: ComponentFixture<ResubscribeContactModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResubscribeContactModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResubscribeContactModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
