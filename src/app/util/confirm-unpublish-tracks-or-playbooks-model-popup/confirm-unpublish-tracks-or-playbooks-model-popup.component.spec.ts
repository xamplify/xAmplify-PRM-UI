import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmUnpublishTracksOrPlaybooksModelPopupComponent } from './confirm-unpublish-tracks-or-playbooks-model-popup.component';

describe('ConfirmUnpublishTracksOrPlaybooksModelPopupComponent', () => {
  let component: ConfirmUnpublishTracksOrPlaybooksModelPopupComponent;
  let fixture: ComponentFixture<ConfirmUnpublishTracksOrPlaybooksModelPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmUnpublishTracksOrPlaybooksModelPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmUnpublishTracksOrPlaybooksModelPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
