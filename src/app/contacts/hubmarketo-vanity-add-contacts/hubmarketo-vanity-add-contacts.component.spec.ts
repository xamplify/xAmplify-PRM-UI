import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubmarketoVanityAddContactsComponent } from './hubmarketo-vanity-add-contacts.component';

describe('HubmarketoVanityAddContactsComponent', () => {
  let component: HubmarketoVanityAddContactsComponent;
  let fixture: ComponentFixture<HubmarketoVanityAddContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubmarketoVanityAddContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubmarketoVanityAddContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
