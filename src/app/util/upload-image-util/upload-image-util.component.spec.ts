import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadImageUtilComponent } from './upload-image-util.component';

describe('UploadImageUtilComponent', () => {
  let component: UploadImageUtilComponent;
  let fixture: ComponentFixture<UploadImageUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadImageUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadImageUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
