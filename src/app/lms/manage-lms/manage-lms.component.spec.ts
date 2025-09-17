import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLmsComponent } from './manage-lms.component';

describe('ManageLmsComponent', () => {
  let component: ManageLmsComponent;
  let fixture: ComponentFixture<ManageLmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageLmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
