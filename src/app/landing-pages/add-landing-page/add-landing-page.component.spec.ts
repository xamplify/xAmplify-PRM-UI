import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLandingPageComponent } from './add-landing-page.component';

describe('AddLandingPageComponent', () => {
  let component: AddLandingPageComponent;
  let fixture: ComponentFixture<AddLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
