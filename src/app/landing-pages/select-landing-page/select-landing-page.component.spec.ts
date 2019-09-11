import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLandingPageComponent } from './select-landing-page.component';

describe('SelectLandingPageComponent', () => {
  let component: SelectLandingPageComponent;
  let fixture: ComponentFixture<SelectLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
