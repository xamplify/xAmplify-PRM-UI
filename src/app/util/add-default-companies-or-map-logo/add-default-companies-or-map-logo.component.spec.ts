import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDefaultCompaniesOrMapLogoComponent } from './add-default-companies-or-map-logo.component';

describe('AddDefaultCompaniesOrMapLogoComponent', () => {
  let component: AddDefaultCompaniesOrMapLogoComponent;
  let fixture: ComponentFixture<AddDefaultCompaniesOrMapLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDefaultCompaniesOrMapLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDefaultCompaniesOrMapLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
