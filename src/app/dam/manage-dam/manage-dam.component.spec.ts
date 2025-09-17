import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDamComponent } from './manage-dam.component';

describe('ManageDamComponent', () => {
  let component: ManageDamComponent;
  let fixture: ComponentFixture<ManageDamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
