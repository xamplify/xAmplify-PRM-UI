import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAprrovalComponent } from './manage-aprroval.component';

describe('ManageAprrovalComponent', () => {
  let component: ManageAprrovalComponent;
  let fixture: ComponentFixture<ManageAprrovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAprrovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAprrovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
