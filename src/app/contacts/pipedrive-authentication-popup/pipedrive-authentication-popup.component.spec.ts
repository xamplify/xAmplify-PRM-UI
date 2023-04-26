import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipedriveAuthenticationPopupComponent } from './pipedrive-authentication-popup.component';

describe('PipedriveAuthenticationPopupComponent', () => {
  let component: PipedriveAuthenticationPopupComponent;
  let fixture: ComponentFixture<PipedriveAuthenticationPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipedriveAuthenticationPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipedriveAuthenticationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
