import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryFolderViewUtilComponent } from './category-folder-view-util.component';

describe('CategoryFolderViewUtilComponent', () => {
  let component: CategoryFolderViewUtilComponent;
  let fixture: ComponentFixture<CategoryFolderViewUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryFolderViewUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryFolderViewUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
