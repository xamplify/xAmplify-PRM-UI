import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTagsUtilComponent } from './add-tags-util.component';

describe('AddTagsUtilComponent', () => {
  let component: AddTagsUtilComponent;
  let fixture: ComponentFixture<AddTagsUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTagsUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTagsUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
