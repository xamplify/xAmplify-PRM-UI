import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpfModalPopupComponent } from './spf-modal-popup.component';

describe('SpfModalPopupComponent', () => {
  let component: SpfModalPopupComponent;
  let fixture: ComponentFixture<SpfModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpfModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpfModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
