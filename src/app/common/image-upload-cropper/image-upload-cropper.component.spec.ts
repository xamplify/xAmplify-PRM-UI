import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUploadCropperComponent } from './image-upload-cropper.component';

describe('ImageUploadCropperComponent', () => {
  let component: ImageUploadCropperComponent;
  let fixture: ComponentFixture<ImageUploadCropperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageUploadCropperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUploadCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
