import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrManageDomainsComponent } from './AddOrManageDomainsComponent';

describe('AddOrManageDomainsComponent', () => {
  let component: AddOrManageDomainsComponent;
  let fixture: ComponentFixture<AddOrManageDomainsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrManageDomainsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrManageDomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
