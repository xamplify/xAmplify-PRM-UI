import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallIntegrationsComponent } from './call-integrations.component';

describe('CallIntegrationsComponent', () => {
  let component: CallIntegrationsComponent;
  let fixture: ComponentFixture<CallIntegrationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallIntegrationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallIntegrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
