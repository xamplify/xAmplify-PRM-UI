import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDamComponent } from './add-dam.component';

describe('AddDamComponent', () => {
  let component: AddDamComponent;
  let fixture: ComponentFixture<AddDamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
