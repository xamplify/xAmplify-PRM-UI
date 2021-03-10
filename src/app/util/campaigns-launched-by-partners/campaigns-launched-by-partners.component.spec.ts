import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsLaunchedByPartnersComponent } from './campaigns-launched-by-partners.component';

describe('CampaignsLaunchedByPartnersComponent', () => {
  let component: CampaignsLaunchedByPartnersComponent;
  let fixture: ComponentFixture<CampaignsLaunchedByPartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignsLaunchedByPartnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignsLaunchedByPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
