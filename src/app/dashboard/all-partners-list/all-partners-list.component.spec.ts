import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPartnersListComponent } from './all-partners-list.component';

describe('AllPartnersListComponent', () => {
  let component: AllPartnersListComponent;
  let fixture: ComponentFixture<AllPartnersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllPartnersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPartnersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
