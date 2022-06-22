import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPartnersAndShareLeadsComponent } from './select-partners-and-share-leads.component';

describe('SelectPartnersAndShareLeadsComponent', () => {
  let component: SelectPartnersAndShareLeadsComponent;
  let fixture: ComponentFixture<SelectPartnersAndShareLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPartnersAndShareLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPartnersAndShareLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
