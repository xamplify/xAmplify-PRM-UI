import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMdfFundsComponent } from './manage-mdf-funds.component';

describe('ManageMdfFundsComponent', () => {
  let component: ManageMdfFundsComponent;
  let fixture: ComponentFixture<ManageMdfFundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMdfFundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMdfFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
