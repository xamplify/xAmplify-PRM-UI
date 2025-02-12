import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCampaignsListComponent } from './company-campaigns-list.component';

describe('CompanyCampaignsListComponent', () => {
  let component: CompanyCampaignsListComponent;
  let fixture: ComponentFixture<CompanyCampaignsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyCampaignsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyCampaignsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
