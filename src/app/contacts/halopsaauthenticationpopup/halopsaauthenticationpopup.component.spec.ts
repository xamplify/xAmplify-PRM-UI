import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HalopsaauthenticationpopupComponent } from './halopsaauthenticationpopup.component';

describe('HalopsaauthenticationpopupComponent', () => {
  let component: HalopsaauthenticationpopupComponent;
  let fixture: ComponentFixture<HalopsaauthenticationpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HalopsaauthenticationpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HalopsaauthenticationpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
