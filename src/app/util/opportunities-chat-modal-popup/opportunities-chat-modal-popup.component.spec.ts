import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunitiesChatModalPopupComponent } from './opportunities-chat-modal-popup.component';

describe('OpportunitiesChatModalPopupComponent', () => {
  let component: OpportunitiesChatModalPopupComponent;
  let fixture: ComponentFixture<OpportunitiesChatModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunitiesChatModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunitiesChatModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
