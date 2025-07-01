import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivatedPartnersTableComponent } from './deactivated-partners-table.component';

describe('DeactivatedPartnersTableComponent', () => {
  let component: DeactivatedPartnersTableComponent;
  let fixture: ComponentFixture<DeactivatedPartnersTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeactivatedPartnersTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivatedPartnersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
