import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePartnersComponent } from './manage-partners.component';

describe('ManagePartnersComponent', () => {
  let component: ManagePartnersComponent;
  let fixture: ComponentFixture<ManagePartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePartnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
