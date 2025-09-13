import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewLmsComponent } from './preview-lms.component';

describe('PreviewLmsComponent', () => {
  let component: PreviewLmsComponent;
  let fixture: ComponentFixture<PreviewLmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewLmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewLmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
