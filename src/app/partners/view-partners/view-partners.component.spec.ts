import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPartnersComponent } from './view-partners.component';

describe('ViewPartnersComponent', () => {
  let component: ViewPartnersComponent;
  let fixture: ComponentFixture<ViewPartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPartnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
