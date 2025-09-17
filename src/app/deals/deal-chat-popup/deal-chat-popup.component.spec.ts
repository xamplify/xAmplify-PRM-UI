import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealChatPopupComponent } from './deal-chat-popup.component';

describe('DealChatPopupComponent', () => {
  let component: DealChatPopupComponent;
  let fixture: ComponentFixture<DealChatPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealChatPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealChatPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
