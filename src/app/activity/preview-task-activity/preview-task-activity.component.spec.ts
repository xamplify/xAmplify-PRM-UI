import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewTaskActivityComponent } from './preview-task-activity.component';

describe('PreviewTaskActivityComponent', () => {
  let component: PreviewTaskActivityComponent;
  let fixture: ComponentFixture<PreviewTaskActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewTaskActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewTaskActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
