import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypewiseTrackContentDetailsComponent } from './typewise-track-content-details.component';

describe('TypewiseTrackContentDetailsComponent', () => {
  let component: TypewiseTrackContentDetailsComponent;
  let fixture: ComponentFixture<TypewiseTrackContentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypewiseTrackContentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypewiseTrackContentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
