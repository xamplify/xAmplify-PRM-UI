import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomBlocksModalPopupComponent } from './custom-blocks-modal-popup.component';

describe('CustomBlocksModalPopupComponent', () => {
  let component: CustomBlocksModalPopupComponent;
  let fixture: ComponentFixture<CustomBlocksModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomBlocksModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomBlocksModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
