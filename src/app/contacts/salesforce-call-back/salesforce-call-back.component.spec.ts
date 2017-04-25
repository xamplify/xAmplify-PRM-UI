import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesforceCallBackComponent } from './salesforce-call-back.component';

describe('SalesforceCallBackComponent', () => {
  let component: SalesforceCallBackComponent;
  let fixture: ComponentFixture<SalesforceCallBackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesforceCallBackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesforceCallBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
