import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewVideoComponent } from './preview-video.component';

describe('PreviewVideoComponent', () => {
  let component: PreviewVideoComponent;
  let fixture: ComponentFixture<PreviewVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
