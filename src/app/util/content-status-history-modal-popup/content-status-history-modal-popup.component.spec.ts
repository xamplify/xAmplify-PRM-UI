import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentStatusHistoryModalPopupComponent } from './content-status-history-modal-popup.component';

describe('ContentStatusHistoryModalPopupComponent', () => {
  let component: ContentStatusHistoryModalPopupComponent;
  let fixture: ComponentFixture<ContentStatusHistoryModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentStatusHistoryModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentStatusHistoryModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
