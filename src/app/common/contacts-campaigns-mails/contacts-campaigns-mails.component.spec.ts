import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsCampaignsMailsComponent } from './contacts-campaigns-mails.component';

describe('ContactsCampaignsMailsComponent', () => {
  let component: ContactsCampaignsMailsComponent;
  let fixture: ComponentFixture<ContactsCampaignsMailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsCampaignsMailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsCampaignsMailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
