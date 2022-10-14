import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderListViewUtilComponent } from './folder-list-view-util.component';

describe('FolderListViewUtilComponent', () => {
  let component: FolderListViewUtilComponent;
  let fixture: ComponentFixture<FolderListViewUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderListViewUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderListViewUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
