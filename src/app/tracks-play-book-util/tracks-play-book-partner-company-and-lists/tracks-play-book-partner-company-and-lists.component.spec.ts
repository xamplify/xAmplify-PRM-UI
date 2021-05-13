import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracksPlayBookPartnerCompanyAndListsComponent } from './tracks-play-book-partner-company-and-lists.component';

describe('TracksPlayBookPartnerCompanyAndListsComponent', () => {
  let component: TracksPlayBookPartnerCompanyAndListsComponent;
  let fixture: ComponentFixture<TracksPlayBookPartnerCompanyAndListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracksPlayBookPartnerCompanyAndListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracksPlayBookPartnerCompanyAndListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
