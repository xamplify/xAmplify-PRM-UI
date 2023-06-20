import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftsidenavbarCustomComponent } from './leftsidenavbar-custom.component';

describe('LeftsidenavbarCustomComponent', () => {
  let component: LeftsidenavbarCustomComponent;
  let fixture: ComponentFixture<LeftsidenavbarCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftsidenavbarCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftsidenavbarCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
