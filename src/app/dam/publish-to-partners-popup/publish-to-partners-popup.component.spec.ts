import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishToPartnersPopupComponent } from './publish-to-partners-popup.component';

describe('PublishToPartnersPopupComponent', () => {
  let component: PublishToPartnersPopupComponent;
  let fixture: ComponentFixture<PublishToPartnersPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishToPartnersPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishToPartnersPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
