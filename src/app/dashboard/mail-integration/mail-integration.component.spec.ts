import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailIntegrationComponent } from './mail-integration.component';

describe('MailIntegrationComponent', () => {
  let component: MailIntegrationComponent;
  let fixture: ComponentFixture<MailIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
