import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneClickLaunchPartnerPreviewComponent } from './one-click-launch-partner-preview.component';

describe('OneClickLaunchPartnerPreviewComponent', () => {
  let component: OneClickLaunchPartnerPreviewComponent;
  let fixture: ComponentFixture<OneClickLaunchPartnerPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneClickLaunchPartnerPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneClickLaunchPartnerPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
