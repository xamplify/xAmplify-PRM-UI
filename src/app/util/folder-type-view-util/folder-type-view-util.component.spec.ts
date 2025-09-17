import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderTypeViewUtilComponent } from './folder-type-view-util.component';

describe('FolderTypeViewUtilComponent', () => {
  let component: FolderTypeViewUtilComponent;
  let fixture: ComponentFixture<FolderTypeViewUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderTypeViewUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderTypeViewUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
