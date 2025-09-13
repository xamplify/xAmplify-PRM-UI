import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivePartnersTableComponent } from './active-partners-table.component';

describe('ActivePartnersTableComponent', () => {
  let component: ActivePartnersTableComponent;
  let fixture: ComponentFixture<ActivePartnersTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivePartnersTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivePartnersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
