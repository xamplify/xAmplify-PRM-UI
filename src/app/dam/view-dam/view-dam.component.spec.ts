import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDamComponent } from './view-dam.component';

describe('ViewDamComponent', () => {
  let component: ViewDamComponent;
  let fixture: ComponentFixture<ViewDamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
